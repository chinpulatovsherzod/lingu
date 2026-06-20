"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Zap, Volume2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GrammarQuestion, GrammarTestTopic } from "@/lib/grammar/types";
import { QUESTIONS_PER_TEST, pickTestQuestions } from "@/lib/grammar";
import { PRACTICE_QUESTIONS } from "@/lib/grammar/practice-questions";
import { useI18n } from "@/components/i18n/locale-provider";
import { formatMessage } from "@/lib/i18n/messages";
import { ExplainedQuizQuestion } from "@/components/quiz/explained-quiz-question";
import { grammarQuestionToExplained } from "@/lib/quiz/explanations";

type Phase = "intro" | "testing" | "results";
type Mode = "test" | "practice";

export function GrammarTestPlayer({ topic }: { topic: GrammarTestTopic }) {
  const { t, locale } = useI18n();
  const topicMeta = t.grammar.topics[topic.slug];
  const displayTitle = topicMeta?.title ?? topic.title;
  const displaySubtitle = topic.title;
  const displayDescription = topicMeta?.description ?? topic.description;

  const [mode, setMode] = useState<Mode>("test");
  const [phase, setPhase] = useState<Phase>("intro");
  
  // MCQ Test States
  const [attempt, setAttempt] = useState(0);
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Practice States
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceInput, setPracticeInput] = useState("");
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [practiceCorrect, setPracticeCorrect] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);
  const [xpRewarded, setXpRewarded] = useState(false);

  const practiceList = useMemo(() => {
    return PRACTICE_QUESTIONS[topic.slug] || [];
  }, [topic.slug]);

  // Pronounce sentence
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const startTest = useCallback(
    (nextAttempt: number) => {
      if (mode === "test") {
        const picked = pickTestQuestions(topic.questionPool, QUESTIONS_PER_TEST, nextAttempt);
        setAttempt(nextAttempt);
        setQuestions(picked);
        setIndex(0);
        setSelected(null);
        setAnswered(false);
        setCorrectCount(0);
        setPhase("testing");
      } else {
        setPracticeIndex(0);
        setPracticeInput("");
        setPracticeChecked(false);
        setPracticeCorrect(false);
        setPracticeScore(0);
        setXpRewarded(false);
        setPhase("testing");
      }
    },
    [topic.questionPool, mode]
  );

  // Practice Answer Check
  const handlePracticeCheck = () => {
    const currentQ = practiceList[practiceIndex];
    if (!currentQ) return;

    const trimmedInput = practiceInput.trim().toLowerCase();
    const isAnsCorrect = currentQ.correctAnswers.some(
      (ans) => ans.trim().toLowerCase() === trimmedInput
    );

    setPracticeCorrect(isAnsCorrect);
    setPracticeChecked(true);

    if (isAnsCorrect) {
      setPracticeScore((s) => s + 1);
      // Play pronunciation of completed sentence
      const fullSentence = `${currentQ.textBefore}${currentQ.correctAnswers[0]}${currentQ.textAfter}`;
      speakText(fullSentence);
    }
  };

  const goNextPractice = () => {
    setPracticeChecked(false);
    setPracticeInput("");
    setPracticeCorrect(false);
    
    if (practiceIndex >= practiceList.length - 1) {
      setPhase("results");
      return;
    }
    setPracticeIndex((i) => i + 1);
  };

  const handleClaimXp = async () => {
    if (xpRewarded || mode !== "practice" || practiceScore === 0) return;
    setXpRewarded(true);
    try {
      await fetch("/api/user/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp: 15, activity: `Practice Mode: ${displayTitle}` }),
      });
    } catch {
      // Fail silently
    }
  };

  // MCQ handlers
  const current = questions[index];
  const progress =
    phase === "testing"
      ? mode === "test"
        ? ((index + (answered ? 1 : 0)) / questions.length) * 100
        : ((practiceIndex + (practiceChecked ? 1 : 0)) / practiceList.length) * 100
      : 0;

  const scorePercent = useMemo(
    () => (questions.length ? Math.round((correctCount / questions.length) * 100) : 0),
    [correctCount, questions.length]
  );

  const handleSelect = (i: number) => {
    if (!current || answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === current.correctIndex) setCorrectCount((n) => n + 1);
  };

  const goNext = () => {
    setAnswered(false);
    setSelected(null);
    if (index >= questions.length - 1) {
      setPhase("results");
      return;
    }
    setIndex((i) => i + 1);
  };

  // Localization Helpers
  const localeText = (ruStr: string, uzStr: string, enStr: string) => {
    return locale === "uz" ? uzStr : locale === "en" ? enStr : ruStr;
  };

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
        <Link href="/grammar" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "inline-flex w-fit")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.grammar.back}
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Badge className="mb-2">{topic.level}</Badge>
            <h1 className="font-heading text-3xl font-bold">{displayTitle}</h1>
            <p className="text-lg text-muted-foreground">{displaySubtitle}</p>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-muted p-0.5 rounded-xl border border-border self-start sm:self-center shrink-0">
            <button
              onClick={() => setMode("test")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                mode === "test" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {localeText("Тест (Варианты)", "Test (Variantlar)", "Test (MCQ)")}
            </button>
            <button
              onClick={() => setMode("practice")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                mode === "practice" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {localeText("Практика (Пропуски)", "Amaliyot (Bo'shliqlar)", "Practice (Fill-ins)")}
            </button>
          </div>
        </div>

        <Card className="border-border bg-card/60 backdrop-blur-md">
          <CardContent className="space-y-4 p-6">
            <p className="text-muted-foreground">{displayDescription}</p>
            
            {mode === "test" ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • {formatMessage(t.grammar.introBullets[0], { count: QUESTIONS_PER_TEST, pool: topic.questionPool.length })}
                </li>
                <li>
                  • {formatMessage(t.grammar.introBullets[1], { count: QUESTIONS_PER_TEST, pool: topic.questionPool.length })}
                </li>
                <li>• {t.grammar.introBullets[2]}</li>
              </ul>
            ) : (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • {localeText("10 вопросов на заполнение пропусков вручную", "10 ta yozma to'ldirish savoli", "10 fill-in-the-blank writing tasks")}
                </li>
                <li>
                  • {localeText("Развивает правописание и практическое усвоение правил", "Imlo va qoidalarni amaliy o'zlashtirishni rivojlantiradi", "Develops spelling and active rule application")}
                </li>
                <li>
                  • {localeText("Озвучка правильного предложения после ввода", "To'g'ri javobdan keyin gap to'liq o'qib eshittiriladi", "Audio voice readout upon correct input")}
                </li>
              </ul>
            )}

            <Button className="w-full" size="lg" onClick={() => startTest(1)}>
              {t.grammar.startTest}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl space-y-6"
      >
        <Card className="border-border bg-card/60 backdrop-blur-md">
          {mode === "test" ? (
            <CardContent className="space-y-5 p-8 text-center">
              <h2 className="font-heading text-2xl font-bold">{t.grammar.testFinished}</h2>
              <p className="text-4xl font-bold text-primary">
                {correctCount} / {questions.length}
              </p>
              <p className="text-muted-foreground">
                {formatMessage(t.grammar.result, { percent: scorePercent })}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button size="lg" onClick={() => startTest(attempt + 1)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t.grammar.tryAgain}
                </Button>
                <Link href="/grammar" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                  {t.grammar.toList}
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatMessage(t.grammar.newTestHint, { count: topic.questionPool.length })}
              </p>
            </CardContent>
          ) : (
            <CardContent className="space-y-5 p-8 text-center">
              <h2 className="font-heading text-2xl font-bold">
                {localeText("Практическая тренировка завершена!", "Amaliy mashg'ulot yakunlandi!", "Practice training complete!")}
              </h2>
              <p className="text-4xl font-bold text-primary">
                {practiceScore} / {practiceList.length}
              </p>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                {localeText(
                  `Вы успешно заполнили ${practiceScore} из ${practiceList.length} пропусков.`,
                  `Siz ${practiceList.length} tadan ${practiceScore} ta bo'shliqni to'g'ri to'ldirdingiz.`,
                  `You correctly completed ${practiceScore} out of ${practiceList.length} fill-in tasks.`
                )}
              </p>

              {practiceScore > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 flex items-center justify-center gap-3 w-fit mx-auto">
                  <Zap className="h-5 w-5 text-accent animate-pulse" />
                  <span className="font-medium text-sm">Награда: +15 XP</span>
                  {!xpRewarded && (
                    <Button size="sm" onClick={handleClaimXp} className="ml-2">
                      Забрать
                    </Button>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center pt-4">
                <Button size="lg" onClick={() => startTest(1)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t.grammar.tryAgain}
                </Button>
                <Link href="/grammar" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                  {t.grammar.toList}
                </Link>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    );
  }

  // --- PLAYING MODE ---

  // --- PRACTICE MODE GAMEPLAY ---
  if (mode === "practice") {
    const currentQ = practiceList[practiceIndex];
    if (!currentQ) return null;

    const fullTextSpeech = `${currentQ.textBefore}${currentQ.correctAnswers[0]}${currentQ.textAfter}`;

    return (
      <div className="mx-auto max-w-2xl space-y-4 animate-fade-in">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>{displayTitle} (Практика)</span>
            <span>
              {practiceIndex + 1} / {practiceList.length}
            </span>
          </div>
          <Progress value={progress} />
        </div>

        <Card className="border-border bg-card/60 backdrop-blur-md">
          <CardContent className="space-y-6 p-6">
            <Badge variant="secondary">
              {localeText(`Задание ${practiceIndex + 1}`, `Vazifa ${practiceIndex + 1}`, `Task ${practiceIndex + 1}`)}
            </Badge>

            {/* Fill-in-the-blank Interactive Display */}
            <div className="text-lg md:text-xl font-medium text-foreground py-6 px-4 bg-muted/20 border border-border/50 rounded-2xl leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-3">
              <span>{currentQ.textBefore}</span>
              <input
                type="text"
                disabled={practiceChecked}
                value={practiceInput}
                onChange={(e) => setPracticeInput(e.target.value)}
                placeholder="..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && practiceInput.trim().length > 0 && !practiceChecked) {
                    handlePracticeCheck();
                  }
                }}
                className={cn(
                  "inline-block w-44 px-3 py-1 text-center font-bold bg-background border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all",
                  practiceChecked
                    ? practiceCorrect
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "border-destructive bg-destructive/10 text-destructive font-bold"
                    : "border-border text-primary"
                )}
              />
              <span className="text-sm font-semibold text-muted-foreground select-none">
                {currentQ.hint}
              </span>
              <span>{currentQ.textAfter}</span>
            </div>

            {/* Checked Feedback Alert */}
            {practiceChecked && (
              <div
                className={cn(
                  "border rounded-xl p-4 flex items-center justify-between animate-fade-in",
                  practiceCorrect
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-destructive/10 border-destructive/20 text-destructive"
                )}
              >
                <div className="flex items-center gap-3">
                  {practiceCorrect ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      <div>
                        <span className="font-bold block">{t.grammar.correct}</span>
                        <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                          {localeText("Предложение прослушано в аудио", "Gap audio orqali o'qildi", "Sentence read aloud")}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                      <div>
                        <span className="font-bold block">{localeText("Неверно", "Noto'g'ri", "Incorrect")}</span>
                        <span className="text-xs text-rose-600/80 dark:text-rose-400/80">
                          {localeText("Правильный ответ: ", "To'g'ri javob: ", "Correct answer: ")}
                          <span className="font-semibold underline uppercase">{currentQ.correctAnswers.join(" / ")}</span>
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => speakText(fullTextSpeech)}
                    className="flex items-center gap-1"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={goNextPractice}
                    className={cn(practiceCorrect ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "")}
                  >
                    {practiceIndex >= practiceList.length - 1 ? t.grammar.finishTest : t.grammar.nextQuestion}
                  </Button>
                </div>
              </div>
            )}

            {!practiceChecked && (
              <Button
                className="w-full"
                disabled={practiceInput.trim().length === 0}
                onClick={handlePracticeCheck}
              >
                {t.grammar.checkAnswer}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- MCQ TEST MODE GAMEPLAY ---
  if (!current) return null;

  const explained = grammarQuestionToExplained(current);
  const quizItem = {
    id: current.id,
    question: current.question,
    options: explained.options,
    correctIndex: explained.correctIndex,
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 animate-fade-in">
      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span>{displayTitle}</span>
          <span>
            {index + 1} / {questions.length}
          </span>
        </div>
        <Progress value={progress} />
      </div>

      <Card className="border-border bg-card/60 backdrop-blur-md">
        <CardContent className="space-y-4 p-6">
          <Badge variant="secondary">{formatMessage(t.grammar.question, { n: index + 1 })}</Badge>
          <ExplainedQuizQuestion
            item={quizItem}
            labels={{ correct: t.grammar.correct, notQuite: t.grammar.wrong }}
            selected={selected}
            answered={answered}
            onSelect={handleSelect}
            locale={locale}
          />
          {answered && (
            <Button onClick={goNext} className="w-full">
              {index >= questions.length - 1 ? t.grammar.finishTest : t.grammar.nextQuestion}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
