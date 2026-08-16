// js/glossary-data.js
const GLOSSARY = [
  {
    term: "Anapest",
    definition: "A metrical foot of three syllables — two unstressed followed by one stressed (da-da-DUM), as in 'un-der-STAND' or 'in-ter-VENE'. Common in limericks and comic verse.",
    related: ["Foot", "Meter", "Limerick"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/anapest"
  },
  {
    term: "Ballad meter",
    definition: 'A common metrical pattern alternating lines of 8 and 6 syllables ' +
      '(iambic tetrameter and iambic trimeter), used in folk ballads and hymns. ' +
      'Emily Dickinson used this form extensively, often with slant rhyme.',
    example: 'The first verse of "Amazing Grace" is a perfect example: ' +
      '"A<b>ma</b>zing <b>grace</b>, how <b>sweet</b> the <b>sound</b> / ' +
      'that <b>saved</b> a <b>wretch</b> like <b>me</b>! / ' +
      'I <b>once</b> was <b>lost</b> but <b>now</b> am <b>found</b>, / ' +
      'was <b>blind</b> but <b>now</b> I <b>see</b>."',
    related: ["Iamb", "Meter", "Stanza", "Quatrain"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/ballad"
  },
  {
    term: "Couplet",
    definition: "A pair of successive lines that rhyme. A heroic couplet is two lines of iambic pentameter that rhyme. The closing couplet of a Shakespearean sonnet is one of the most recognizable structures in English poetry.",
    related: ["Rhyme scheme", "Sonnet", "Stanza"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/couplet"
  },
  {
    term: "Dactyl",
    definition: "A metrical foot of three syllables — one stressed followed by two unstressed (DUM-da-da), as in 'MER-ri-ly' or 'HEA-ven-ly'. The opposite of an anapest.",
    related: ["Foot", "Meter", "Anapest"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/dactyl"
  },
  {
    term: "End rhyme",
    definition: "Rhyme that occurs at the end of lines of poetry, as opposed to internal rhyme (within a line) or slant rhyme (approximate rhyme). The most common form of rhyme in English poetry.",
    related: ["Rhyme scheme", "Slant rhyme"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/end-rhyme"
  },
  {
    term: "Foot",
    definition: "The basic unit of meter in poetry, consisting of a pattern of stressed and unstressed syllables. Common feet include the iamb (da-DUM), trochee (DUM-da), anapest (da-da-DUM), and dactyl (DUM-da-da).",
    related: ["Iamb", "Trochee", "Anapest", "Dactyl", "Meter"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/foot"
  },
  {
    term: "Haiku",
    definition: "A Japanese poetic form of three lines with 5, 7, and 5 syllables respectively. Traditionally evokes a moment in nature, often with a seasonal reference (kigo) and a cutting word (kireji) that creates a pause or shift.",
    related: ["Syllable"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/haiku"
  },
  {
    term: "Iamb",
    definition: "A metrical foot consisting of one unstressed syllable followed by one stressed syllable (da-DUM), as in 'be-TRAY' or 'a-LONE'. The most common foot in English poetry.",
    related: ["Foot", "Meter", "Iambic pentameter"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/iamb"
  },
  {
    term: "Iambic pentameter",
    definition: "A line of poetry consisting of five iambic feet (da-DUM da-DUM da-DUM da-DUM da-DUM), totaling 10 syllables. The foundation of the sonnet and much of Shakespeare's work.",
    related: ["Iamb", "Foot", "Sonnet"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/iambic-pentameter"
  },
  {
    term: "Limerick",
    definition: 'A five-line comic form with an AABBA rhyme scheme. ' +
      'Lines 1, 2, and 5 are longer (7–9 syllables) and lines 3 and 4 are shorter (5–7 syllables), ' +
      'with an anapestic rhythm — three weak syllables leading to a strong beat (da-da-DUM). ' +
      'Traditionally humorous or bawdy.',
    example: 'The word "understand" is one anapest: un-der-STAND. ' +
      'Long lines have three: "un-der-STAND un-der-STAND un-der-STAND." ' +
      'Short lines have two: "un-der-STAND un-der-STAND."',
    related: ["Rhyme scheme", "Anapest"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/limerick"
  },
  {
    term: "Meter",
    definition: "The rhythmic structure of a line of poetry, based on patterns of stressed and unstressed syllables. Described by naming the dominant foot type and the number of feet per line (e.g. iambic pentameter = 5 iambic feet).",
    related: ["Foot", "Iamb", "Syllable"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/meter"
  },
  {
    term: "Octave",
    definition: "An eight-line stanza, or the first eight lines of an Italian sonnet. The octave typically presents a problem, situation, or argument that the sestet then responds to or resolves.",
    related: ["Sonnet", "Sestet", "Stanza"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/octave"
  },
  {
    term: "Quatrain",
    definition: "A four-line stanza. One of the most common units in English poetry — the Shakespearean sonnet is built from three quatrains and a couplet, and ballad meter is typically organized in quatrains.",
    related: ["Stanza", "Sonnet", "Ballad meter"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/quatrain"
  },
  {
    term: "Rhyme scheme",
    definition: "The pattern of end rhymes in a poem, designated by letters. Each new rhyme sound gets a new letter (A, B, C...), so ABAB means lines 1 and 3 rhyme, and lines 2 and 4 rhyme. AABBA is the limerick scheme.",
    related: ["Sonnet", "Limerick", "End rhyme"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/rhyme-scheme"
  },
  {
    term: "Sestet",
    definition: "A six-line stanza, or the final six lines of an Italian sonnet following the octave. The sestet typically resolves or responds to the problem posed in the octave. Common sestet rhyme schemes include CDECDE and CDCDCD.",
    related: ["Sonnet", "Octave", "Stanza"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/sestet"
  },
  {
    term: "Slant rhyme",
    definition: "An approximate or imperfect rhyme where sounds are similar but not identical, such as 'moon' and 'stone' or 'love' and 'move'. Emily Dickinson was a master of slant rhyme, using it to create tension and unease.",
    related: ["End rhyme", "Rhyme scheme"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/slant-rhyme"
  },
  {
    term: "Sonnet",
    definition: 'A 14-line poem in iambic pentameter (five da-DUM beats per line). ' +
      'The Shakespearean (English) sonnet uses ABAB CDCD EFEF GG rhyme scheme. ' +
      'The Petrarchan (Italian) sonnet uses ABBAABBA for the octave followed by a sestet. ' +
      'Both forms traditionally explore love, time, or mortality.',
    example: 'An example of iambic pentameter: ' +
      '"I <b>am</b> a <b>pi</b>rate <b>with</b> a <b>woo</b>den <b>leg</b>."',
    related: ["Iambic pentameter", "Rhyme scheme", "Octave", "Sestet", "Quatrain"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/sonnet"
  },
  {
    term: "Spondee",
    definition: "A metrical foot of two stressed syllables (DUM-DUM), as in 'DARK NIGHT' or 'BREAD KNIFE'. Used for emphasis or to slow a line's pace. Rare as a sustained meter but common as a substitution.",
    related: ["Foot", "Meter"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/spondee"
  },
  {
    term: "Stanza",
    definition: "A grouped set of lines in a poem, separated by blank lines — like a paragraph in prose. Common stanza forms include the couplet (2 lines), tercet (3 lines), quatrain (4 lines), and sestet (6 lines).",
    related: ["Quatrain", "Tercet", "Couplet", "Sestet"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/stanza"
  },
  {
    term: "Syllable",
    definition: "A unit of pronunciation with a single vowel sound. 'Poetry' has three syllables (po-et-ry). Syllable counting is the basis of forms like haiku and ballad meter.",
    related: ["Haiku", "Meter"],
  },
  {
    term: "Tercet",
    definition: "A three-line stanza. The haiku is a single tercet. Tercets are also the building block of the terza rima, the form Dante used in the Divine Comedy.",
    related: ["Stanza", "Haiku"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/tercet"
  },
  {
    term: "Trochee",
    definition: "A metrical foot of two syllables — one stressed followed by one unstressed (DUM-da), as in 'TI-ger' or 'GA-den'. The opposite of an iamb. Shakespeare often used trochees for witches and spells.",
    related: ["Foot", "Meter", "Iamb"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/trochee"
  },
  {
    term: "Volta",
    definition: "The 'turn' in a sonnet — the moment where the poem shifts in argument, tone, or perspective. In a Shakespearean sonnet it often comes at the couplet; in a Petrarchan sonnet at the transition from octave to sestet.",
    related: ["Sonnet", "Octave", "Sestet"],
    more_info: "https://www.poetryfoundation.org/learn/glossary-terms/volta"
  }
];
