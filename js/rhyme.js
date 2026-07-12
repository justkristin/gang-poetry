// js/rhyme.js
// Rhyme detection using Datamuse API
// Returns the rhyme signature of the last word in a line

async function getRhymeSignature(line) {
  if (!line || !line.trim()) return null;
  
  // Get last word, strip punctuation
  const words = line.trim().split(/\s+/);
  const lastWord = words[words.length - 1].replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    .toLowerCase()
    .replace(/[^a-z']/g, '');
  
  if (!lastWord) return null;

  try {
    // Datamuse API returns words that rhyme with our word
    // We use it to get the phoneme ending (rhyme signature)
    const response = await fetch(
      `https://api.datamuse.com/words?rel_rhy=${lastWord}&max=1`
    );
    const data = await response.json();
    
    // Store the last word itself as the signature
    // We'll check rhymes by asking "does word B rhyme with word A?"
    return lastWord;
  } catch (err) {
    console.warn('Rhyme API unavailable:', err);
    return lastWord; // Fall back to storing the word itself
  }
}

async function checkRhymes(line, rhymeWord) {
  if (!line || !rhymeWord) return { ok: true, message: null };

  const words = line.trim().split(/\s+/);
  const lastWord = words[words.length - 1].replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    .toLowerCase()
    .replace(/[^a-z']/g, '');

  if (!lastWord) return { ok: true, message: null };
  
  // If same word, it rhymes (identity rhyme)
  if (lastWord === rhymeWord) return { ok: true, message: null };

  try {
    // Ask Datamuse if lastWord rhymes with rhymeWord
    const response = await fetch(
      `https://api.datamuse.com/words?rel_rhy=${rhymeWord}&max=100`
    );
    const data = await response.json();
    const rhymes = data.map(w => w.word.toLowerCase());
    
    const ok = rhymes.includes(lastWord);
    return {
      ok,
      message: ok
        ? null
        : `"${lastWord}" may not rhyme with "${rhymeWord}"; If this is intentional, please feel free to save anyway.`
    };
  } catch (err) {
    console.warn('Rhyme check unavailable:', err);
    return { ok: true, message: null };
  }
}
