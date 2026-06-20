"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Loader2, PenTool, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type EvaluationResult = {
  band: number;
  criteria?: {
    taskAchievement: number;
    coherence: number;
    lexicalResource: number;
    grammar: number;
  };
  feedback: string;
};

export default function IeltsWritingPage() {
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  const loadingStages = [
    "Подготовка эссе к анализу...",
    "Оценка структуры и связности текста (Coherence)...",
    "Проверка лексического богатства (Lexical Resource)...",
    "Анализ грамматических конструкций и орфографии...",
    "Формирование итогового отчета экспертной системы...",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStage(0);
      interval = setInterval(() => {
        setLoadingStage((prev) => (prev < loadingStages.length - 1 ? prev + 1 : prev));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  async function submit() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ielts/writing/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: 2,
          prompt: "Some people believe technology has made life worse. Discuss both views and give your opinion.",
          essay,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        const errData = await res.json();
        alert(errData.error || "Произошла ошибка при оценке эссе.");
      }
    } catch {
      alert("Не удалось связаться с сервером.");
    } finally {
      setLoading(false);
    }
  }

  // Helper for rendering band values out of 9
  const getPercentOfNine = (band: number) => {
    return Math.min(100, Math.round((band / 9) * 100));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in pb-12">
      {/* Back button */}
      <Link href="/ielts" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "inline-flex w-fit")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        К разделу IELTS
      </Link>

      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
          <PenTool className="h-6 w-6 text-primary" />
          IELTS Writing Evaluator
        </h1>
        <p className="text-muted-foreground text-sm">
          Интеллектуальная проверка письменных работ с мгновенной оценкой по официальным критериям IELTS.
        </p>
      </div>

      {!result && !loading && (
        <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3 border-b border-border/20">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Задание (Task 2)</span>
            <CardTitle className="text-base font-semibold leading-relaxed mt-1 text-foreground">
              Some people believe technology has made life worse. Discuss both views and give your opinion.
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-semibold">Ваше эссе (рекомендуется 250+ слов):</label>
              <textarea
                className="mt-1 min-h-[320px] w-full rounded-xl border border-border/50 bg-background/50 p-4 text-sm font-sans leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-y"
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder="Write your essay here..."
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-xs font-bold px-3 py-1 rounded-full",
                wordCount < 150 ? "bg-red-500/10 text-red-400" : wordCount < 250 ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
              )}>
                Количество слов: {wordCount} {wordCount < 250 && "(рекомендуется 250+)"}
              </span>
              <Button onClick={submit} disabled={wordCount < 40} className="px-6 h-11">
                Отправить на проверку
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card className="p-12 text-center flex flex-col items-center justify-center space-y-6 border-primary/20 bg-card/65 backdrop-blur-sm min-h-[350px]">
          <div className="relative flex items-center justify-center h-20 w-20">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <PenTool className="absolute h-5 w-5 text-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-lg font-bold text-foreground">Система оценивает работу</h3>
            <p className="text-sm text-muted-foreground max-w-sm font-medium animate-pulse">
              {loadingStages[loadingStage]}
            </p>
          </div>
          <Progress value={((loadingStage + 1) / loadingStages.length) * 100} className="w-64 h-1.5" />
        </Card>
      )}

      {result && !loading && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column: Overall score */}
          <div className="md:col-span-1 space-y-4">
            <Card className="text-center p-6 border-primary/30 bg-gradient-to-b from-primary/10 via-card/15 to-transparent shadow-lg shadow-primary/5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Итоговый балл</span>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/30 shadow-inner shadow-primary/10">
                  <span className="font-heading text-4xl font-black text-primary">{result.band.toFixed(1)}</span>
                  <div className="absolute inset-0 rounded-full border border-primary/10 animate-ping opacity-25" />
                </div>
                <span className="text-xs text-muted-foreground mt-3 font-semibold">IELTS Writing Band Score</span>
              </div>
              <Button variant="outline" onClick={() => setResult(null)} className="w-full">
                Написать заново
              </Button>
            </Card>
          </div>

          {/* Right Column: Breakdown & Feedback */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-border/50 bg-card/65 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  Детализация оценок по критериям
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 1. Task Achievement */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-foreground">Task Achievement (Раскрытие темы)</span>
                    <span className="text-primary">{((result.criteria?.taskAchievement) ?? result.band).toFixed(1)} / 9.0</span>
                  </div>
                  <Progress value={getPercentOfNine((result.criteria?.taskAchievement) ?? result.band)} className="h-2" />
                </div>

                {/* 2. Coherence and Cohesion */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-foreground">Coherence & Cohesion (Связность текста)</span>
                    <span className="text-primary">{((result.criteria?.coherence) ?? result.band).toFixed(1)} / 9.0</span>
                  </div>
                  <Progress value={getPercentOfNine((result.criteria?.coherence) ?? result.band)} className="h-2" />
                </div>

                {/* 3. Lexical Resource */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-foreground">Lexical Resource (Словарный запас)</span>
                    <span className="text-primary">{((result.criteria?.lexicalResource) ?? result.band).toFixed(1)} / 9.0</span>
                  </div>
                  <Progress value={getPercentOfNine((result.criteria?.lexicalResource) ?? result.band)} className="h-2" />
                </div>

                {/* 4. Grammatical Range */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-foreground">Grammatical Range & Accuracy (Грамматика)</span>
                    <span className="text-primary">{((result.criteria?.grammar) ?? result.band).toFixed(1)} / 9.0</span>
                  </div>
                  <Progress value={getPercentOfNine((result.criteria?.grammar) ?? result.band)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/65 backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-border/20">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Подробные комментарии экзаменатора
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {result.feedback}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
