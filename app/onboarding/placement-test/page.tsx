"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLACEMENT_QUESTIONS, determineLevel, nextQuestionIndex } from "@/lib/placement";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function PlacementTestPage() {
  const router = useRouter();
  const [qIndex, setQIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const q = PLACEMENT_QUESTIONS[qIndex];
  const total = 10;

  function pick(i: number) {
    if (selected !== null) return;
    setSelected(i);
    const isCorrect = i === q.correctIndex;
    if (isCorrect) setCorrect((c) => c + 1);
    setAnswered((a) => a + 1);
    setTimeout(() => {
      if (answered + 1 >= total) {
        setDone(true);
        return;
      }
      setQIndex(nextQuestionIndex(qIndex, isCorrect));
      setSelected(null);
    }, 600);
  }

  async function finish() {
    const level = determineLevel(correct, total);
    await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ englishLevel: level }),
    });
    router.push("/dashboard");
  }

  if (done) {
    const level = determineLevel(correct, total);
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="space-y-4 p-8">
            <h2 className="font-heading text-2xl font-bold">Ваш уровень: {level}</h2>
            <p className="text-muted-foreground">
              {correct} / {total} правильных ответов
            </p>
            <Button onClick={finish} className="w-full">
              Перейти на дашборд
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4">
        <Progress value={((answered + 1) / total) * 100} />
        <Card>
          <CardContent className="space-y-4 p-6">
            <p className="text-sm text-muted-foreground">
              Вопрос {answered + 1} · {q.skill} · {q.level}
            </p>
            <p className="text-lg font-medium">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(i)}
                  disabled={selected !== null}
                  className={`w-full rounded-lg border p-3 text-left text-sm ${
                    selected === i
                      ? i === q.correctIndex
                        ? "border-success bg-success/10"
                        : "border-warning bg-warning/10"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
