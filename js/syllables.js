// js/syllables.js
// Heuristic syllable counter for English words
// Accuracy ~90-95% for common words

function countSyllables(word) {
  word = word.toLowerCase().trim();
  if (!word) return 0;
  
  // Handle some common exceptions
  const exceptions = {
    'the': 1, 'every': 3, 'different': 3, 'family': 3,
    'general': 3, 'natural': 3, 'separate': 3, 'several': 3,
    'temperature': 4, 'interest': 3, 'beautiful': 3,
    'basically': 4, 'probably': 3, 'comfortable': 4
  };
  if (exceptions[word]) return exceptions[word];

  // Remove non-alpha
  word = word.replace(/[^a-z]/g, '');
  if (!word) return 0;

  // Count vowel groups
  let count = 0;
  let prevWasVowel = false;
  const vowels = 'aeiouy';

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !prevWasVowel) count++;
    prevWasVowel = isVowel;
  }

  // Subtract silent e at end
  if (word.endsWith('e') && count > 1) count--;

  // Add for common suffixes
  if (word.endsWith('le') && word.length > 2 &&
      !vowels.includes(word[word.length - 3])) count++;
  if (word.endsWith('ed') && !word.endsWith('ted') &&
      !word.endsWith('ded')) count = Math.max(1, count - 1);

  return Math.max(1, count);
}

function countLineSyllables(line) {
  if (!line || !line.trim()) return 0;
  const words = line.trim().split(/\s+/);
  return words.reduce((total, word) => total + countSyllables(word), 0);
}

function checkSyllables(line, expected, min, max) {
  const actual = countLineSyllables(line);
  
  if (expected !== null && expected !== undefined) {
    return {
      actual,
      expected,
      ok: actual === expected,
      message: actual === expected
        ? null
        : `This line has ${actual} syllable${actual !== 1 ? 's' : ''} — expected ${expected}.`
    };
  }
  
  if (min !== null && max !== null) {
    return {
      actual,
      min,
      max,
      ok: actual >= min && actual <= max,
      message: actual >= min && actual <= max
        ? null
        : `This line has ${actual} syllable${actual !== 1 ? 's' : ''} — expected between ${min} and ${max}.`
    };
  }

  return { actual, ok: true, message: null };
}
