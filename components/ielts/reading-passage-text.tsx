"use client";

import { useMemo } from "react";
import type { ReadingVocabEntry } from "@/lib/ielts/reading/vocabulary";
import { buildVocabularyPattern, vocabularyDefinitionMap } from "@/lib/ielts/reading/vocabulary";
import { cn } from "@/lib/utils";

type Props = {
  content: string;
  vocabulary?: ReadingVocabEntry[];
  vocabHint?: string;
};

function highlightParagraph(text: string, vocabulary: ReadingVocabEntry[]) {
  const pattern = buildVocabularyPattern(vocabulary);
  const definitions = vocabularyDefinitionMap(vocabulary);

  if (!pattern) return text;

  const parts = text.split(pattern);

  return parts.map((part, i) => {
    const definition = definitions.get(part.toLowerCase());
    if (!definition) return part;

    return (
      <mark
        key={`${part}-${i}`}
        title={definition}
        className={cn(
          "cursor-help rounded-sm bg-emerald-200/80 px-0.5 font-medium text-emerald-900",
          "underline decoration-emerald-500/50 decoration-dotted underline-offset-2",
          "dark:bg-emerald-900/50 dark:text-emerald-100"
        )}
      >
        {part}
      </mark>
    );
  });
}

export function ReadingPassageText({ content, vocabulary = [], vocabHint }: Props) {
  const paragraphs = useMemo(() => content.split("\n\n"), [content]);
  const hasVocab = vocabulary.length > 0;

  return (
    <div className="space-y-3">
      {hasVocab && vocabHint && (
        <p className="text-xs text-emerald-700 dark:text-emerald-400">{vocabHint}</p>
      )}
      <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
        {paragraphs.map((para, i) => (
          <p key={i}>{highlightParagraph(para, vocabulary)}</p>
        ))}
      </div>
    </div>
  );
}
