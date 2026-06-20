export type ReadingVocabEntry = {
  word: string;
  definition: string;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildVocabularyPattern(vocabulary: ReadingVocabEntry[]) {
  const terms = [...vocabulary]
    .map((v) => v.word.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (!terms.length) return null;

  const pattern = terms.map((t) => escapeRegex(t)).join("|");
  return new RegExp(`(${pattern})`, "gi");
}

export function vocabularyDefinitionMap(vocabulary: ReadingVocabEntry[]) {
  return new Map(vocabulary.map((v) => [v.word.toLowerCase(), v.definition]));
}
