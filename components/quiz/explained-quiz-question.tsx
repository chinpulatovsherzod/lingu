"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExplainedQuizItem, ExplainedQuizLabels } from "@/lib/quiz/types";

const DEFAULT_LETTERS = ["A", "B", "C", "D"];
const RU_LETTERS = ["А", "Б", "В", "Г"];

type Props = {
  item: ExplainedQuizItem;
  labels: ExplainedQuizLabels;
  selected: number | null;
  answered: boolean;
  onSelect: (index: number) => void;
  locale?: string;
  questionNumber?: number;
};

export function ExplainedQuizQuestion({
  item,
  labels,
  selected,
  answered,
  onSelect,
  locale = "ru",
  questionNumber,
}: Props) {
  const letters = locale === "ru" ? RU_LETTERS : DEFAULT_LETTERS;

  return (
    <div className="space-y-4">
      <p className="text-base font-medium leading-relaxed">
        {questionNumber != null && <span className="text-muted-foreground">{questionNumber}. </span>}
        {item.question}
      </p>

      <div className="space-y-2.5">
        {item.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === item.correctIndex;
          const showFeedback = answered && isSelected;

          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => onSelect(i)}
              className={cn(
                "w-full rounded-xl border-2 p-4 text-left transition-all",
                !answered && "border-transparent bg-muted/50 hover:bg-muted/80",
                !answered && isSelected && "border-primary/50 bg-primary/5",
                showFeedback && isCorrect && "border-success bg-success/5",
                showFeedback && !isCorrect && "border-red-400 bg-red-500/5"
              )}
            >
              <p className="text-sm leading-relaxed">
                <span className="mr-2 font-semibold text-muted-foreground">{letters[i]}.</span>
                {opt.text}
              </p>

              {showFeedback && (
                <div className="mt-3 space-y-1.5 border-t border-border/40 pt-3">
                  <div
                    className={cn(
                      "flex items-center gap-2 text-sm font-semibold",
                      isCorrect ? "text-success" : "text-red-400"
                    )}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0" />
                    )}
                    {isCorrect ? labels.correct : labels.notQuite}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{opt.explanation}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
