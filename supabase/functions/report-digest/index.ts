import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const REPORT_EMAIL = Deno.env.get("REPORT_EMAIL")!;

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Get poems with 1-4 reports (not yet flagged, not yet reviewed)
  const { data: digestPoems } = await supabase
    .from("gp_poems")
    .select(`
      id, slug, title, flagged, reviewed,
      gp_forms(name, variant),
      gp_reports(reason, created_at)
    `)
    .eq("flagged", false)
    .eq("reviewed", false)
    .not("gp_reports", "is", null);

  // Filter to poems with 1-4 reports
  const digest = (digestPoems || []).filter(p => 
    p.gp_reports.length >= 1 && p.gp_reports.length <= 4
  );

  // Get flagged poems (5+ reports) for immediate context
  const { data: flaggedPoems } = await supabase
    .from("gp_poems")
    .select(`
      id, slug, title,
      gp_forms(name, variant),
      gp_reports(reason, created_at)
    `)
    .eq("flagged", true)
    .eq("reviewed", false);

  // Build email
  let html = `<h2>Gang Poetry — Moderation Digest</h2>`;

  if ((flaggedPoems || []).length > 0) {
    html += `<h3 style="color: red;">⚠️ Flagged Poems (need review)</h3>`;
    for (const poem of flaggedPoems!) {
      const url = `https://gang.jincywillett.com/poem.html?id=${poem.slug}`;
      html += `
        <div style="border: 2px solid red; padding: 1rem; margin-bottom: 1rem;">
          <p><strong>"${poem.title}"</strong> — ${poem.gp_forms.name}</p>
          <p>Reports: ${poem.gp_reports.length}</p>
          <p>Reasons: ${poem.gp_reports.map((r: any) => r.reason || "no reason given").join(", ")}</p>
          <p><a href="${url}">${url}</a></p>
        </div>
      `;
    }
  }

  if (digest.length > 0) {
    html += `<h3>📋 Poems with Reports (1–4, not yet flagged)</h3>`;
    for (const poem of digest) {
      const url = `https://gang.jincywillett.com/poem.html?id=${poem.slug}`;
      html += `
        <div style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem;">
          <p><strong>"${poem.title}"</strong> — ${poem.gp_forms.name}</p>
          <p>Reports: ${poem.gp_reports.length}</p>
          <p>Reasons: ${poem.gp_reports.map((r: any) => r.reason || "no reason given").join(", ")}</p>
          <p><a href="${url}">${url}</a></p>
        </div>
      `;
    }
  }

  if (digest.length === 0 && (flaggedPoems || []).length === 0) {
    html += `<p>✅ No reports to review. All quiet!</p>`;
  }

  // Send email via Resend
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "noreply@flaneurpajamas.com",
      to: REPORT_EMAIL,
      subject: `Gang Poetry Moderation Digest — ${new Date().toLocaleDateString()}`,
      html,
    }),
  });

  if (!res.ok) {
    return new Response("Failed to send email", { status: 500 });
  }

  return new Response("Digest sent!", { status: 200 });
});
