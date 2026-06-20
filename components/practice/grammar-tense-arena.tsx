"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Timer, Zap, Trophy, Play, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Question = {
  sentenceBefore: string;
  sentenceAfter: string;
  verb: string;
  correctAnswer: string;
  options: string[];
};

const QUESTIONS: Question[] = [
  {
    sentenceBefore: "Usually she ",
    sentenceAfter: " coffee in the morning.",
    verb: "drink",
    correctAnswer: "drinks",
    options: ["drink", "drinks", "drank", "is drinking"],
  },
  {
    sentenceBefore: "Yesterday, we ",
    sentenceAfter: " a fantastic movie.",
    verb: "watch",
    correctAnswer: "watched",
    options: ["watch", "watched", "have watched", "were watching"],
  },
  {
    sentenceBefore: "Listen! The baby ",
    sentenceAfter: ".",
    verb: "cry",
    correctAnswer: "is crying",
    options: ["cries", "cried", "is crying", "has cried"],
  },
  {
    sentenceBefore: "I ",
    sentenceAfter: " this book three times already.",
    verb: "read",
    correctAnswer: "have read",
    options: ["read", "have read", "am reading", "reads"],
  },
  {
    sentenceBefore: "They ",
    sentenceAfter: " to London next week.",
    verb: "fly",
    correctAnswer: "are flying",
    options: ["fly", "flew", "are flying", "flies"],
  },
  {
    sentenceBefore: "While I was cooking, the phone ",
    sentenceAfter: ".",
    verb: "ring",
    correctAnswer: "rang",
    options: ["ring", "rang", "was ringing", "has rung"],
  },
  {
    sentenceBefore: "He ",
    sentenceAfter: " English for five years before he moved to Canada.",
    verb: "study",
    correctAnswer: "had studied",
    options: ["studies", "has studied", "had studied", "was studying"],
  },
  {
    sentenceBefore: "By the time you arrive, we ",
    sentenceAfter: " dinner.",
    verb: "finish",
    correctAnswer: "will have finished",
    options: ["finish", "will finish", "will have finished", "have finished"],
  },
  {
    sentenceBefore: "Right now, they ",
    sentenceAfter: " football in the yard.",
    verb: "play",
    correctAnswer: "are playing",
    options: ["play", "plays", "are playing", "played"],
  },
  {
    sentenceBefore: "She ",
    sentenceAfter: " here since 2018.",
    verb: "work",
    correctAnswer: "has been working",
    options: ["works", "has been working", "worked", "is working"],
  },
  {
    sentenceBefore: "I ",
    sentenceAfter: " my homework yet.",
    verb: "not do",
    correctAnswer: "haven't done",
    options: ["don't do", "didn't do", "haven't done", "haven't been doing"],
  },
  {
    sentenceBefore: "We ",
    sentenceAfter: " a loud noise last night.",
    verb: "hear",
    correctAnswer: "heard",
    options: ["hear", "heard", "have heard", "were hearing"],
  },
  {
    sentenceBefore: "If it rains tomorrow, we ",
    sentenceAfter: " at home.",
    verb: "stay",
    correctAnswer: "will stay",
    options: ["stay", "will stay", "would stay", "stayed"],
  },
  {
    sentenceBefore: "She ",
    sentenceAfter: " always ",
    verb: "lose (annoyance)",
    correctAnswer: "is... losing",
    options: ["is... losing", "has... lost", "loses", "was... lost"],
  },
  {
    sentenceBefore: "Look at those dark clouds! It ",
    sentenceAfter: " rain.",
    verb: "go to",
    correctAnswer: "is going to",
    options: ["goes to", "is going to", "will", "would"],
  },
];

export function GrammarTenseArena() {
  const router = useRouter();
  const onBack = () => router.push("/practice");
  const [phase, setPhase] = useState<"intro" | "playing" | "results">("intro");
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [answers, setAnswers] = useState<{ sentence: string; correct: boolean; userAns: string; correctAns: string }[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [xpClaimed, setXpClaimed] = useState(false);

  // Initialize and shuffle
  const startGame = () => {
    const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
    setShuffledQuestions(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(60);
    setAnswers([]);
    setXpClaimed(false);
    setPhase("playing");
  };

  // Timer loop
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      setPhase("results");
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, phase]);

  const currentQ = shuffledQuestions[currentIdx];

  const handleAnswer = (option: string) => {
    if (!currentQ) return;
    const isCorrect = option === currentQ.correctAnswer;
    const sentenceFull = `${currentQ.sentenceBefore}__(${currentQ.verb})__${currentQ.sentenceAfter}`;

    setAnswers((prev) => [
      ...prev,
      {
        sentence: sentenceFull,
        correct: isCorrect,
        userAns: option,
        correctAns: currentQ.correctAnswer,
      },
    ]);

    if (isCorrect) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (nextCombo > maxCombo) setMaxCombo(nextCombo);
      // XP formula: base 10 + combo bonus
      setScore((s) => s + 10 + Math.min(20, nextCombo * 2));
    } else {
      setCombo(0);
    }

    if (currentIdx >= shuffledQuestions.length - 1) {
      // Out of questions, reshuffle list to allow endless play until time ends
      const reshuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
      setShuffledQuestions((prev) => [...prev, ...reshuffled]);
    }
    setCurrentIdx((i) => i + 1);
  };

  const claimXp = async () => {
    if (xpClaimed || score === 0) return;
    setXpClaimed(true);
    // Scale XP reward: max 35 XP based on game score
    const xpReward = Math.min(35, Math.max(10, Math.round(score / 5)));
    try {
      await fetch("/api/user/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp: xpReward, activity: `Tense Arena: score ${score}` }),
      });
    } catch {}
    onBack();
  };

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-xl space-y-6 animate-fade-in py-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Назад в Practice Hub
        </Button>
        <Card className="border-primary/20 bg-gradient-to-b from-primary/10 via-card/20 to-transparent p-6 text-center">
          <CardHeader className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary shadow-lg shadow-primary/10 mb-4 animate-bounce">
              <Timer className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-black">Grammar Tense Arena</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Динамичная игра на время! Сопоставляйте маркеры времени с правильными видовременными формами английского глагола.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl bg-muted/30 p-4 text-xs text-left space-y-2 border border-border/40">
              <p className="font-bold text-foreground">Правила арены:</p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>У вас есть ровно <strong>60 секунд</strong>.</li>
                <li>Каждый правильный ответ добавляет очки.</li>
                <li><strong>Комбо-множитель</strong>: несколько верных ответов подряд увеличивают количество очков!</li>
                <li>В конце вы получите до <strong>35 XP</strong> в зависимости от набранных очков.</li>
              </ul>
            </div>
            <Button size="lg" className="w-full gap-2" onClick={startGame}>
              <Play className="h-5 w-5 fill-current" /> Войти на арену
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === "results") {
    const correctCount = answers.filter((a) => a.correct).length;
    const xpReward = Math.min(35, Math.max(10, Math.round(score / 5)));

    return (
      <div className="mx-auto max-w-2xl space-y-6 animate-fade-in py-6">
        <Card className="border-primary/30 bg-gradient-to-b from-primary/10 via-card/15 to-transparent text-center p-6 shadow-xl shadow-primary/5">
          <CardHeader className="flex flex-col items-center">
            <Trophy className="h-12 w-12 text-amber-400 mb-2" />
            <CardTitle className="text-2xl font-black">Результаты боя</CardTitle>
            <p className="text-sm text-muted-foreground">Время истекло! Отличный поединок.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-card/60 p-3 border border-border/40">
                <span className="text-xs text-muted-foreground block font-medium">Очки</span>
                <span className="text-xl font-bold text-foreground">{score}</span>
              </div>
              <div className="rounded-xl bg-card/60 p-3 border border-border/40">
                <span className="text-xs text-muted-foreground block font-medium">Правильных</span>
                <span className="text-xl font-bold text-emerald-400">{correctCount} / {answers.length}</span>
              </div>
              <div className="rounded-xl bg-card/60 p-3 border border-border/40">
                <span className="text-xs text-muted-foreground block font-medium">Макс. комбо</span>
                <span className="text-xl font-bold text-primary">{maxCombo} 🔥</span>
              </div>
            </div>

            {/* Answer details list */}
            <div className="space-y-2 max-h-48 overflow-y-auto text-left pr-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Детализация ответов:</p>
              {answers.map((ans, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs p-2.5 rounded-lg border border-border/30 bg-background/30 justify-between">
                  <div className="space-y-0.5 max-w-[80%]">
                    <p className="text-foreground font-medium">{ans.sentence}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Ваш ответ: <span className={ans.correct ? "text-emerald-400" : "text-red-400 font-bold"}>{ans.userAns}</span>
                      {!ans.correct && <span> (Верно: <span className="text-emerald-400 font-bold">{ans.correctAns}</span>)</span>}
                    </p>
                  </div>
                  {ans.correct ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {score > 0 && !xpClaimed ? (
                <Button onClick={claimXp} className="w-full gap-2">
                  <Zap className="h-4 w-4 fill-current" /> Забрать +{xpReward} XP и выйти
                </Button>
              ) : (
                <Button onClick={startGame} className="w-full">
                  Играть снова
                </Button>
              )}
              <Button variant="ghost" onClick={onBack} className="w-full">
                Вернуться в хаб
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active playing view
  return (
    <div className="mx-auto max-w-xl space-y-6 animate-fade-in py-6">
      {/* HUD Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-card/50 border border-border/40 rounded-xl px-3 py-1.5 backdrop-blur-sm">
          <Timer className={cn("h-4 w-4", timeLeft <= 10 ? "text-destructive animate-pulse" : "text-primary")} />
          <span className={cn("text-sm font-bold font-mono", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>
            {timeLeft}с
          </span>
        </div>

        <div className="flex items-center gap-3">
          {combo > 1 && (
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full animate-bounce">
              🔥 {combo} COMBO
            </span>
          )}
          <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-xl">
            Score: {score}
          </span>
        </div>
      </div>

      <Progress value={(timeLeft / 60) * 100} className="h-1.5" />

      {/* Main Question Card */}
      <Card className="border-border/60 bg-card/65 backdrop-blur-sm shadow-lg shadow-black/5">
        <CardContent className="p-8 space-y-6 text-center">
          <div className="space-y-2">
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Tense Matcher
            </span>
            <h2 className="font-heading text-xl font-bold leading-relaxed pt-2">
              {currentQ.sentenceBefore}
              <span className="text-primary font-black underline underline-offset-4 decoration-2 px-1 font-mono">
                _____
              </span>
              {currentQ.sentenceAfter}
            </h2>
            <p className="text-xs text-muted-foreground italic mt-1">
              Глагол: <strong className="font-mono text-foreground font-semibold">{currentQ.verb}</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            {currentQ.options.map((option, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={() => handleAnswer(option)}
                className="h-12 text-sm font-bold border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all rounded-xl active:scale-[0.98]"
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
