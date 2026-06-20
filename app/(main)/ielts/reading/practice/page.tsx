"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadingTestPlayer } from "@/components/ielts/reading-test-player";
import { useI18n } from "@/components/i18n/locale-provider";
import type { ReadingTest } from "@/lib/ielts/reading/types";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ielts-reading-practice";

export default function IeltsReadingPracticePage() {
  const { locale, t } = useI18n();
  const [test, setTest] = useState<ReadingTest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoNote, setDemoNote] = useState<string | null>(null);
  const [playKey, setPlayKey] = useState(0);

  const labels = {
    correct: t.lessons.quiz.correct,
    notQuite: t.lessons.quiz.notQuite,
    passage: t.ielts.reading.passage,
    passageOf: t.ielts.reading.passageOf,
    questions: t.ielts.reading.questions,
    nextPassage: t.ielts.reading.nextPassage,
    finishTest: t.ielts.reading.finishTest,
    results: t.ielts.reading.results,
    score: t.ielts.reading.score,
    estimatedBand: t.ielts.reading.estimatedBand,
    reviewPassage: t.ielts.reading.reviewPassage,
    allAnswered: t.ielts.reading.allAnswered,
    generateAnother: t.ielts.reading.generateAnother,
    backToReading: t.ielts.reading.backToReading,
    demoNote: t.ielts.reading.demoNote,
    vocabHint: t.ielts.reading.vocabHint,
  };

  const loadFromStorage = useCallback(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ReadingTest & { _demo?: boolean; _message?: string };
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setTest(stored);
      if (stored._message) setDemoNote(stored._message);
    }
  }, [loadFromStorage]);

  async function generate(topic?: string) {
    setLoading(true);
    setError(null);
    setDemoNote(null);
    try {
      const res = await fetch("/api/ielts/reading/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topic ? { topic } : {}),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.ielts.reading.generateError);
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setTest(data);
      if (data._message) setDemoNote(data._message);
      setPlayKey((k) => k + 1);
    } catch {
      setError(t.ielts.reading.generateError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-heading text-2xl font-bold">{t.ielts.reading.extraTitle}</h1>
        <Link href="/ielts/reading" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          {t.ielts.reading.backToReading}
        </Link>
      </div>

      {!test && (
        <Card>
          <CardHeader>
            <CardTitle>{t.ielts.reading.extraPrompt}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{t.ielts.reading.extraDesc}</p>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={() => generate()} disabled={loading}>
              {loading ? t.ielts.reading.generating : t.ielts.reading.generateTest}
            </Button>
          </CardContent>
        </Card>
      )}

      {demoNote && (
        <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">{demoNote}</p>
      )}

      {test && (
        <>
          <ReadingTestPlayer
            key={playKey}
            test={test}
            labels={labels}
            locale={locale}
            onGenerateAnother={() => generate()}
            generating={loading}
            showGenerateAfterComplete
          />
        </>
      )}
    </div>
  );
}
