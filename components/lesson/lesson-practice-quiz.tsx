"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExplainedQuizQuestion } from "@/components/quiz/explained-quiz-question";
import type { ExplainedQuizItem } from "@/lib/quiz/types";

type Props = {
  quizzes: ExplainedQuizItem[];
  labels: {
    practice: string;
    correct: string;
    notQuite: string;
    next: string;
    finish: string;
  };
  locale: string;
};

export function LessonPracticeQuiz({ quizzes, labels, locale }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  if (quizzes.length === 0) return null;

  const current = quizzes[index];
  const isLast = index >= quizzes.length - 1;

  function handleSelect(i: number) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
  }

  function goNext() {
    if (isLast) {
      setIndex(0);
      setSelected(null);
      setAnswered(false);
      return;
    }
    setIndex((n) => n + 1);
    setSelected(null);
    setAnswered(false);
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-base">{labels.practice}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {index + 1} / {quizzes.length}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ExplainedQuizQuestion
          item={current}
          labels={labels}
          selected={selected}
          answered={answered}
          onSelect={handleSelect}
          locale={locale}
          questionNumber={index + 1}
        />
        {answered && (
          <Button className="w-full" onClick={goNext}>
            {isLast ? labels.finish : labels.next}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
