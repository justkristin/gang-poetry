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
function getRhymeHint(line) {
  // Haiku - no rhyme groups at all
  if (!line.rhyme_group) return 'unrhymed';
  
  const letter = line.rhyme_group.toLowerCase();
  
  // Rhyme-determining line
  if (line.is_rhyme_determining) {
    return `sets the (${letter}) rhyme`;
  }
  
  // Non-determining line with known rhyme word
  if (line.rhyme_phonemes) {
    return `rhymes with \u201c${line.rhyme_phonemes}\u201d (${letter})`;
  }
  
  // Non-determining line, rhyme not yet known
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
