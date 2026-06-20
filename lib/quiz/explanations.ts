import type { GrammarQuestion } from "@/lib/grammar/types";
import type { ExplainedOption } from "./types";

export function grammarQuestionToExplained(q: GrammarQuestion): {
  options: [ExplainedOption, ExplainedOption, ExplainedOption, ExplainedOption];
  correctIndex: number;
} {
  const options = q.options.map((text, i) => ({
    text,
    explanation:
      q.optionExplanations?.[i] ??
      (i === q.correctIndex
        ? q.explanation
        : `«${text}» is not correct in this context. Review the rule and try again.`),
  })) as [ExplainedOption, ExplainedOption, ExplainedOption, ExplainedOption];

  return { options, correctIndex: q.correctIndex };
}
