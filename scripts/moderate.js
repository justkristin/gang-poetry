#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load .env from Working/ directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf8');
  env.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length) process.env[key.trim()] = val.join('=').trim();
  });
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const REPORT_EMAIL = process.env.REPORT_EMAIL;

const CONFIGS = {
  demo: {
    url: 'https://kkxymarbuetrabyvsbtk.supabase.co',
    key: process.env.DEMO_SERVICE_KEY,
    siteUrl: 'https://hyde.flaneurpajamas.com/gang-poetry',
    name: 'Demo'
  },
  prod: {
    url: 'https://evlvnsqjtnonnijkosjj.supabase.co',
    key: process.env.PROD_SERVICE_KEY,
    siteUrl: 'https://gang.jincywillett.com',
    name: 'Production'
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q) => new Promise(resolve => rl.question(q, resolve));

const divider = '═'.repeat(50);
const thin = '─'.repeat(50);

let supabase;
let config;

// ── SEND EMAIL ───────────────────────────────────
async function sendEmail(subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'noreply@flaneurpajamas.com',
      to: REPORT_EMAIL,
      subject,
      html
    })
  });
  return res.ok;
}

// ── LOAD REPORTED POEMS ──────────────────────────
async function loadReportedPoems() {
  const { data } = await supabase
    .from('gp_poems')
    .select(`
      id, slug, title, flagged, reviewed, reviewed_at, review_notes,
      gp_forms(name, variant),
      gp_reports(id, reason, created_at, reporter_cookie)
    `)
    .not('gp_reports', 'is', null)
    .order('created_at', { ascending: false });

  return (data || []).filter(p => {
    if (p.gp_reports.length === 0) return false;
    if (p.flagged) return true;
    if (!p.reviewed) return true;
    // Show if there are reports NEWER than the review date
    if (p.reviewed_at) {
      const hasNewReports = p.gp_reports.some(r => 
        new Date(r.created_at) > new Date(p.reviewed_at)
      );
      return hasNewReports;
    }
    return false;
  });
}

// ── LOAD POEM LINES ──────────────────────────────
async function loadPoemLines(poemId) {
  const { data } = await supabase
    .from('gp_lines')
    .select('line_number, content, is_locked')
    .eq('poem_id', poemId)
    .order('line_number');
  return data || [];
}

// ── DISPLAY POEM ─────────────────────────────────
function displayPoem(poem, lines) {
  console.log('\n' + divider);
  console.log(`"${poem.title}"`);
  const form = poem.gp_forms.name + (poem.gp_forms.variant ? ` (${poem.gp_forms.variant})` : '');
  console.log(`${form} · ${lines.length} lines`);
  if (poem.reviewed) console.log('✓ Previously reviewed');
  if (poem.flagged) console.log('⚠️  Currently flagged');
  console.log(thin);
  lines.forEach(l => {
    console.log(`${l.line_number}. ${l.content || '[not yet written]'}`);
  });
  console.log(thin);
  console.log(`Reports: ${poem.gp_reports.length}`);
  console.log(`URL: ${config.siteUrl}/poem.html?id=${poem.slug}`);
  console.log(divider);
}

// ── DISPLAY REASONS ──────────────────────────────
function displayReasons(poem) {
  console.log('\n' + thin);
  console.log('Report reasons:');
  poem.gp_reports.forEach((r, i) => {
    const date = new Date(r.created_at).toLocaleDateString();
    console.log(`  ${i + 1}. ${r.reason || 'no reason given'} (${date})`);
  });
  console.log(thin);
}

// ── CLEAR POEM ───────────────────────────────────
async function clearPoem(poem) {
  const notes = await ask('Notes for your records (optional, press ENTER to skip): ');
  const { error } = await supabase
    .from('gp_poems')
    .update({
      flagged: false,
      reviewed: true,
      reviewed_at: new Date().toISOString(),
      review_notes: notes || 'Reviewed and cleared'
    })
    .eq('id', poem.id);

  if (error) {
    console.log('❌ Error clearing poem:', error.message);
  } else {
    console.log('✓ Poem cleared and marked as reviewed.');
  }
}

// ── DELETE POEM ──────────────────────────────────
async function deletePoem(poem, lines) {
  console.log('\n⚠️  This will permanently delete the poem and all its lines.');
  const confirm = await ask('Type DELETE to confirm: ');
  if (confirm.trim() !== 'DELETE') {
    console.log('Cancelled.');
    return false;
  }

  // Build email
  const reasonsList = poem.gp_reports
    .map((r, i) => `<li>${r.reason || 'no reason given'} (${new Date(r.created_at).toLocaleDateString()})</li>`)
    .join('');

  const linesList = lines
    .map(l => `<p>${l.line_number}. ${l.content || '[not yet written]'}</p>`)
    .join('');

  const html = `
    <h2>Poem Deleted: "${poem.title}"</h2>
    <p><strong>Form:</strong> ${poem.gp_forms.name}${poem.gp_forms.variant ? ` (${poem.gp_forms.variant})` : ''}</p>
    <p><strong>Reports:</strong> ${poem.gp_reports.length}</p>
    <h3>Report reasons:</h3>
    <ul>${reasonsList}</ul>
    <h3>Poem content:</h3>
    ${linesList}
    <p><em>This poem has been permanently deleted from ${config.name}.</em></p>
  `;

  console.log('Sending deletion record email...');
  const sent = await sendEmail(
    `Poem deleted: "${poem.title}" — Gang Poetry ${config.name}`,
    html
  );

  if (!sent) {
    console.log('❌ Email failed to send. Deletion cancelled to preserve record.');
    return false;
  }

  console.log('✓ Email sent. Deleting poem...');
  const { error } = await supabase
    .from('gp_poems')
    .delete()
    .eq('id', poem.id);

  if (error) {
    console.log('❌ Error deleting poem:', error.message);
    return false;
  }

  console.log('✓ Poem deleted.');
  return true;
}

// ── POEM MENU ─────────────────────────────────────
async function poemMenu(poem) {
  const lines = await loadPoemLines(poem.id);
  displayPoem(poem, lines);

  while (true) {
    console.log('\nOptions:');
    console.log('  1. Clear poem of wrongdoing ✓');
    console.log('  2. View report reasons');
    console.log('  3. Delete poem');
    console.log('  4. Back to poem list');
    console.log('  5. Exit');

    const choice = await ask('\n> ');

    switch (choice.trim()) {
      case '1':
        await clearPoem(poem);
        return;
      case '2':
        displayReasons(poem);
        break;
      case '3':
        const deleted = await deletePoem(poem, lines);
        if (deleted) return 'deleted';
        break;
      case '4':
        return;
      case '5':
        rl.close();
        process.exit(0);
      default:
        console.log('Invalid choice.');
    }
  }
}

// ── MAIN MENU ─────────────────────────────────────
async function mainMenu() {
  while (true) {
    console.log('\n' + divider);
    console.log(`Gang Poetry Moderation — ${config.name}`);
    console.log(divider);

    const poems = await loadReportedPoems();

    if (poems.length === 0) {
      console.log('\n✅ No reported poems. All quiet!');
      console.log('\nPress ENTER to refresh or type EXIT to quit.');
      const input = await ask('> ');
      if (input.trim().toLowerCase() === 'exit') break;
      continue;
    }

    console.log('\nReported poems:\n');
    poems.forEach((p, i) => {
      const flag = p.flagged ? ' ⚠️ FLAGGED' : '';
      const reviewed = p.reviewed ? ' ✓' : '';
      const hasNewReports = p.reviewed && p.reviewed_at &&
        p.gp_reports.some(r => new Date(r.created_at) > new Date(p.reviewed_at));
      const newReportFlag = hasNewReports ? ' 🆕 NEW REPORTS AFTER REVIEW' : '';
      const form = p.gp_forms.name + (p.gp_forms.variant ? ` (${p.gp_forms.variant})` : '');
      console.log(`  ${i + 1}. "${p.title}" — ${form} · ${p.gp_reports.length} report(s)${flag}${reviewed}${newReportFlag}`);
    });
    console.log('\nEnter a number to review, or EXIT to quit.');
    const input = await ask('\n> ');

    if (input.trim().toLowerCase() === 'exit') break;

    const idx = parseInt(input.trim()) - 1;
    if (isNaN(idx) || idx < 0 || idx >= poems.length) {
      console.log('Invalid selection.');
      continue;
    }

    await poemMenu(poems[idx]);
  }
}

// ── STARTUP ───────────────────────────────────────
async function main() {
  console.log('\n' + divider);
  console.log('Gang Poetry Moderation Tool');
  console.log(divider);
  console.log('\nSelect database:');
  console.log('  1. Demo (hyde.flaneurpajamas.com)');
  console.log('  2. Production (gang.jincywillett.com)');

  const choice = await ask('\n> ');

  if (choice.trim() === '1') {
    config = CONFIGS.demo;
  } else if (choice.trim() === '2') {
    config = CONFIGS.prod;
  } else {
    console.log('Invalid choice. Exiting.');
    rl.close();
    process.exit(1);
  }

  supabase = createClient(config.url, config.key);
  console.log(`\nConnected to ${config.name}.`);

  await mainMenu();
  rl.close();
}

main().catch(err => {
  console.error('Fatal error:', err);
  rl.close();
  process.exit(1);
});
