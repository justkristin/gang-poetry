// js/utils.js
function generateSlug(length = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  array.forEach(n => slug += chars[n % chars.length]);
  return slug;
}
function poemUrl(slug) {
  return `poem.html?id=${slug}&t=${Date.now()}`;
}
function getRhymeHint(line, allLines) {
  if (!line.rhyme_group) return 'unrhymed';
  
  const letter = line.rhyme_group.replace(/\d+$/, '').toLowerCase();
  
  const groupHasRhyme = allLines.some(l => 
    l.rhyme_group === line.rhyme_group && l.is_rhyme_determining
  );
  
  if (!groupHasRhyme && !line.is_rhyme_determining) {
    return `(${letter}) unrhymed`;
  }
  
  if (line.is_rhyme_determining) {
    return `sets the (${letter}) rhyme`;
  }
  
  // Try to find rhyme word from the determining line
  const determiningLine = allLines.find(l => 
    l.rhyme_group === line.rhyme_group && 
    l.is_rhyme_determining && 
    l.content
  );
  
  // Use rhyme_phonemes if available, otherwise last word of determining line
  const rhymeWord = line.rhyme_phonemes || 
    (determiningLine?.content?.trim().split(/\s+/).pop()?.replace(/[^a-zA-Z]/g, '') || null);
  
  if (rhymeWord) {
    return `rhymes with \u201c${rhymeWord}\u201d (${letter})`;
  }
  
  return `(${letter}) rhyme`;
}
function getScansionGuide(footType, feetCount) {
  if (!footType || !feetCount) return null;
  
  const feet = {
    'iambic':    '˘ /',
    'trochaic':  '/ ˘',
    'anapestic': '˘ ˘ /',
'dactylic':  '/ ˘ ˘',
    'spondaic':  '/ /'
  };
  
  const foot = feet[footType];
  if (!foot) return null;
  
  return Array(feetCount).fill(foot).join('  ');
}
function glossaryUrl(formName) {
  return `glossary.html#letter-${formName.charAt(0).toUpperCase()}`;
}

function obscureTitle(title) {
  if (!title) return null;
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) return title;
  
  // Find the last word that isn't just punctuation
  let lastWordIndex = words.length - 1;
  while (lastWordIndex > 0 && /^[^a-zA-Z0-9]+$/.test(words[lastWordIndex])) {
    lastWordIndex--;
  }
  
  const lastWord = words[lastWordIndex];
  const obscured = words.slice(0, lastWordIndex).map(w => 
    w.replace(/[a-zA-Z0-9]/g, '·')
  ).join(' ');
  const remaining = words.slice(lastWordIndex + 1).map(w =>
    w.replace(/[a-zA-Z0-9]/g, '·')
  ).join(' ');
  
  return remaining 
    ? `${obscured} ${lastWord} ${remaining}`
    : `${obscured} ${lastWord}`;
}
