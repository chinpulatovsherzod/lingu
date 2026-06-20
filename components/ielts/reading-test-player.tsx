"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExplainedQuizQuestion } from "@/components/quiz/explained-quiz-question";
import { ReadingPassageText } from "@/components/ielts/reading-passage-text";
import type { ReadingTest } from "@/lib/ielts/reading/types";
import type { ExplainedQuizLabels } from "@/lib/quiz/types";

export type ReadingPlayerLabels = ExplainedQuizLabels & {
  passage: string;
  passageOf: string;
  questions: string;
  nextPassage: string;
  finishTest: string;
  results: string;
  score: string;
  correct: string;
  estimatedBand: string;
  reviewPassage: string;
  allAnswered: string;
  generateAnother: string;
  backToReading: string;
  demoNote: string;
  vocabHint: string;
};

type Props = {
  test: ReadingTest;
  labels: ReadingPlayerLabels;
  locale: string;
  onGenerateAnother?: () => void;
  generating?: boolean;
  showGenerateAfterComplete?: boolean;
};

function estimateBand(correct: number, total: number) {
  if (total === 0) return 0;
  const ratio = correct / total;
  if (ratio >= 0.9) return 8.5;
  if (ratio >= 0.8) return 7.5;
  if (ratio >= 0.7) return 6.5;
  if (ratio >= 0.6) return 5.5;
  if (ratio >= 0.5) return 4.5;
  return 3.5;
}

export function ReadingTestPlayer({
  test,
  labels,
  locale,
  onGenerateAnother,
  generating = false,
  showGenerateAfterComplete = false,
}: Props) {
  const [passageIdx, setPassageIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const passage = test.passages[passageIdx];
  const totalQuestions = useMemo(
    () => test.passages.reduce((n, p) => n + p.questions.length, 0),
    [test]
  );

  const answeredInPassage = passage.questions.filter((q) => answers[q.id] !== undefined).length;
  const allPassageAnswered = answeredInPassage === passage.questions.length;
  const isLastPassage = passageIdx === test.passages.length - 1;

  const correctCount = useMemo(() => {
    let n = 0;
    for (const p of test.passages) {
      for (const q of p.questions) {
        if (answers[q.id] === q.correctIndex) n++;
      }
    }
    return n;
  }, [answers, test]);

  function selectQuestion(questionId: string, index: number) {
    if (answers[questionId] !== undefined || finished) return;
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  }

  function goNext() {
    if (!allPassageAnswered) return;
    if (isLastPassage) {
      setFinished(true);
      return;
    }
    setPassageIdx((i) => i + 1);
  }

  if (finished) {
    const band = estimateBand(correctCount, totalQuestions);
    return (
      <Card>
        <CardHeader>
          <CardTitle>{labels.results}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-semibold text-accent">
            {labels.score}: {correctCount}/{totalQuestions}
          </p>
          <p className="text-sm text-muted-foreground">
            {labels.estimatedBand}: <span className="font-medium text-foreground">{band}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {showGenerateAfterComplete && onGenerateAnother && (
              <Button onClick={onGenerateAnother} disabled={generating}>
                {generating ? "..." : labels.generateAnother}
              </Button>
            )}
            <Link href="/ielts/reading" className={cn(buttonVariants({ variant: "outline" }))}>
              {labels.backToReading}
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          {labels.passage} {passageIdx + 1} {labels.passageOf} {test.passages.length}
        </span>
        <span>
          {labels.questions}: {answeredInPassage}/{passage.questions.length}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="lg:max-h-[70vh] lg:overflow-y-auto">
          <CardHeader>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{passage.subtitle}</p>
            <CardTitle className="text-lg">{passage.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ReadingPassageText
              content={passage.content}
              vocabulary={passage.vocabulary}
              vocabHint={labels.vocabHint}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {passage.questions.map((item, i) => (
            <ExplainedQuizQuestion
              key={item.id}
              item={item}
              labels={labels}
              selected={answers[item.id] ?? null}
              answered={answers[item.id] !== undefined}
              onSelect={(index) => selectQuestion(item.id, index)}
              locale={locale}
              questionNumber={i + 1}
            />
          ))}

          <div className="flex items-center justify-between gap-2 pt-2">
            {!allPassageAnswered && (
              <p className="text-xs text-muted-foreground">{labels.allAnswered}</p>
            )}
            <Button onClick={goNext} disabled={!allPassageAnswered} className="ml-auto">
              {isLastPassage ? labels.finishTest : labels.nextPassage}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
