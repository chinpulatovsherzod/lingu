"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { XP_REWARDS } from "@/lib/xp";
import { ExplainedQuizQuestion } from "@/components/quiz/explained-quiz-question";
import type { ExplainedQuizItem } from "@/lib/quiz/types";

type Step = {
  id: string;
  stepType: string;
  orderIndex: number;
  content: Record<string, unknown>;
};

export function LessonPlayer({
  lessonId,
  title,
  steps,
  initialStep,
  xpReward,
}: {
  lessonId: string;
  title: string;
  steps: Step[];
  initialStep: number;
  xpReward: number;
}) {
  const [index, setIndex] = useState(initialStep);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [fillAnswer, setFillAnswer] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const step = steps[index];
  const progress = ((index + (feedback ? 1 : 0)) / steps.length) * 100;

  const saveProgress = useCallback(
    async (stepIdx: number, completed = false, score?: number) => {
      const url = completed
        ? `/api/lessons/${lessonId}/complete`
        : `/api/lessons/${lessonId}/progress`;
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentStep: stepIdx,
          scorePercent: score,
          timeSpentSeconds: Math.floor((Date.now() - startTime) / 1000),
          xpEarned: xpGained,
        }),
      });
    },
    [lessonId, startTime, xpGained]
  );

  const handleMcqSelect = (i: number) => {
    if (!step || step.stepType !== "MCQ" || feedback) return;
    const c = step.content;
    const ok = i === (c.correct_index as number);
    setSelected(i);
    setFeedback(ok ? "correct" : "wrong");
    if (ok) {
      setCorrectCount((n) => n + 1);
      setXpGained((n) => n + XP_REWARDS.correctAnswer);
    }
  };

  const checkAnswer = () => {
    if (!step) return;
    const c = step.content;
    let ok = false;
    if (step.stepType === "MCQ") {
      return;
    } else if (step.stepType === "FILL_IN_BLANK") {
      const ans = String(c.answer ?? "").toLowerCase().trim();
      ok = fillAnswer.toLowerCase().trim() === ans;
    } else if (step.stepType === "EXPLANATION" || step.stepType === "VOCABULARY") {
      ok = true;
    } else {
      ok = selected === 0;
    }
    setFeedback(ok ? "correct" : "wrong");
    if (ok) {
      setCorrectCount((n) => n + 1);
      setXpGained((n) => n + XP_REWARDS.correctAnswer);
    }
  };

  const goNext = async () => {
    setFeedback(null);
    setSelected(null);
    setFillAnswer("");
    if (index >= steps.length - 1) {
      const score = (correctCount / steps.length) * 100;
      await saveProgress(index + 1, true, score);
      setFinished(true);
      return;
    }
    const next = index + 1;
    setIndex(next);
    await saveProgress(next);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && feedback) goNext();
      if (!feedback && step?.stepType === "MCQ") {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= 4) setSelected(n - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (finished) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg text-center">
        <Card>
          <CardContent className="space-y-4 p-8">
            <Sparkles className="mx-auto h-12 w-12 text-warning" />
            <h2 className="font-heading text-2xl font-bold">Lesson Complete!</h2>
            <p className="text-muted-foreground">
              {correctCount} / {steps.length} correct · +{xpGained + xpReward} XP
            </p>
            <Button asChild>
              <a href="/lessons">Back to lessons</a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!step) return null;

  const c = step.content;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span>{title}</span>
          <span>
            {index + 1} / {steps.length}
          </span>
        </div>
        <Progress value={progress} />
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <Badge variant="secondary">{step.stepType.replace(/_/g, " ")}</Badge>

          {step.stepType === "EXPLANATION" && (
            <>
              <h3 className="font-heading text-xl">{String(c.title ?? "")}</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{String(c.body ?? "")}</p>
            </>
          )}

          {step.stepType === "VOCABULARY" && (
            <>
              <h3 className="font-heading text-2xl">{String(c.word ?? "")}</h3>
              <p className="text-accent">{String(c.part_of_speech ?? "")}</p>
              <p>{String(c.definition ?? "")}</p>
              <p className="italic text-muted-foreground">{String(c.example ?? "")}</p>
            </>
          )}

          {step.stepType === "MCQ" && (() => {
            const options = (c.options as string[]) ?? [];
            const correctIndex = (c.correct_index as number) ?? 0;
            const explanations = (c.option_explanations as string[]) ?? [];
            const mcqItem: ExplainedQuizItem = {
              question: String(c.question ?? ""),
              correctIndex,
              options: options.map((text, i) => ({
                text,
                explanation:
                  explanations[i] ??
                  (i === correctIndex
                    ? String(c.explanation ?? "Correct!")
                    : `«${text}» is not the right answer here.`),
              })) as ExplainedQuizItem["options"],
            };
            return (
              <ExplainedQuizQuestion
                item={mcqItem}
                labels={{ correct: "Correct!", notQuite: "Not quite" }}
                selected={selected}
                answered={!!feedback}
                onSelect={handleMcqSelect}
                locale="en"
              />
            );
          })()}

          {step.stepType === "FILL_IN_BLANK" && (
            <>
              <p className="text-lg">{String(c.sentence ?? "")}</p>
              <input
                className="w-full rounded-lg border border-input bg-background px-3 py-2"
                value={fillAnswer}
                onChange={(e) => setFillAnswer(e.target.value)}
                disabled={!!feedback}
                placeholder="Your answer"
              />
            </>
          )}

          {!feedback && step.stepType !== "MCQ" && (
            <Button onClick={checkAnswer} className="w-full">
              {step.stepType === "EXPLANATION" || step.stepType === "VOCABULARY" ? "Continue" : "Check answer"}
            </Button>
          )}
          {feedback && (
            <Button onClick={goNext} className="w-full">
              {index >= steps.length - 1 ? "Finish lesson" : "Next (Enter)"}
            </Button>
          )}
        </CardContent>
      </Card>

      {feedback === "correct" && (
        <motion.p
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -30 }}
          className="text-center text-sm text-warning font-bold"
        >
          +{XP_REWARDS.correctAnswer} XP
        </motion.p>
      )}
    </div>
  );
}
