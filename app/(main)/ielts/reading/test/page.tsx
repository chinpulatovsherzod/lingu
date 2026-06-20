"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ReadingTestPlayer } from "@/components/ielts/reading-test-player";
import { useI18n } from "@/components/i18n/locale-provider";
import { OFFICIAL_READING_TEST } from "@/lib/ielts/reading/passages";
import { cn } from "@/lib/utils";

export default function IeltsReadingTestPage() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

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

  async function generatePractice() {
    setGenerating(true);
    try {
      const res = await fetch("/api/ielts/reading/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      sessionStorage.setItem("ielts-reading-practice", JSON.stringify(data));
      router.push("/ielts/reading/practice");
    } catch {
      /* keep user on results screen */
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-heading text-2xl font-bold">{OFFICIAL_READING_TEST.title}</h1>
        <Link href="/ielts/reading" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          {t.ielts.reading.backToReading}
        </Link>
      </div>

      <ReadingTestPlayer
        test={OFFICIAL_READING_TEST}
        labels={labels}
        locale={locale}
        onGenerateAnother={generatePractice}
        generating={generating}
        showGenerateAfterComplete
      />
    </div>
  );
}
