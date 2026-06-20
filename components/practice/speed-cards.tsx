"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Zap, RotateCcw, Award, XCircle, Volume2, Flame, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type WordItem = {
  id: string;
  word: {
    word: string;
    definition: string;
  };
};

type SpeedCardsProps = {
  userWords: WordItem[];
};

const FALLBACK_WORDS = [
  { id: "fb1", word: { word: "mitigate", definition: "смягчать, уменьшать" } },
  { id: "fb2", word: { word: "redundant", definition: "избыточный, лишний" } },
  { id: "fb3", word: { word: "exquisite", definition: "изысканный, утонченный" } },
  { id: "fb4", word: { word: "profound", definition: "глубокий, основательный" } },
  { id: "fb5", word: { word: "fluctuate", definition: "колебаться, меняться" } },
  { id: "fb6", word: { word: "comprehensive", definition: "всесторонний, полный" } },
  { id: "fb7", word: { word: "advocate", definition: "защищать, отстаивать" } },
  { id: "fb8", word: { word: "coherent", definition: "последовательный, связный" } },
  { id: "fb9", word: { word: "arbitrary", definition: "произвольный, случайный" } },
  { id: "fb10", word: { word: "diligent", definition: "прилежный, старательный" } },
];

const TIME_LIMIT = 10; // seconds per word

export function SpeedCardsGame({ userWords }: SpeedCardsProps) {
  const wordsList = userWords && userWords.length >= 4 ? userWords : FALLBACK_WORDS;

  const [shuffledList, setShuffledList] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctOption, setCorrectOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [xpRewarded, setXpRewarded] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and shuffle words
  const initGame = () => {
    const shuffled = [...wordsList].sort(() => Math.random() - 0.5);
    setShuffledList(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setCombo(1);
    setMaxCombo(1);
    setLives(3);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsFinished(false);
    setXpRewarded(false);
    setIsPlaying(true);
    setIsAnswered(false);
    setSelectedOption(null);
    setTimeLeft(TIME_LIMIT);
  };

  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [userWords]);

  // Generate options when current index changes
  useEffect(() => {
    if (shuffledList.length === 0 || currentIndex >= shuffledList.length || !isPlaying) return;

    const currentWord = shuffledList[currentIndex];
    const correct = currentWord.word.definition;
    setCorrectOption(correct);

    // Get random incorrect options from the rest of the list
    const otherDefs = wordsList
      .filter((w) => w.id !== currentWord.id)
      .map((w) => w.word.definition);

    // Shuffle other definitions and pick 3
    const incorrect = [...otherDefs].sort(() => Math.random() - 0.5).slice(0, 3);

    // Combine and shuffle
    const combined = [correct, ...incorrect].sort(() => Math.random() - 0.5);
    setOptions(combined);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(TIME_LIMIT);

    // Audio pronunciation
    speakWord(currentWord.word.word);
  }, [currentIndex, shuffledList, isPlaying]);

  // Timer effect
  useEffect(() => {
    if (!isPlaying || isFinished || isAnswered) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isFinished, isAnswered, currentIndex]);

  // Keyboard controls (1-4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isFinished || isAnswered) return;
      if (["1", "2", "3", "4"].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < options.length) {
          handleAnswer(options[idx]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isFinished, isAnswered, options]);

  // Pronounce word
  const speakWord = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTimeout = () => {
    setIsAnswered(true);
    setCombo(1);
    setLives((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setIsFinished(true);
        setIsPlaying(false);
      }
      return next;
    });
    setIncorrectCount((c) => c + 1);

    // Go to next after a delay
    setTimeout(() => {
      advanceGame();
    }, 1500);
  };

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(option);

    if (timerRef.current) clearInterval(timerRef.current);

    if (option === correctOption) {
      setScore((s) => s + 10 * combo);
      setCorrectCount((c) => c + 1);
      setCombo((c) => {
        const next = c + 1;
        if (next > maxCombo) setMaxCombo(next);
        return next;
      });

      // Advance quickly
      setTimeout(() => {
        advanceGame();
      }, 800);
    } else {
      setCombo(1);
      setLives((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setIsFinished(true);
          setIsPlaying(false);
        }
        return next;
      });
      setIncorrectCount((c) => c + 1);

      // Keep showing error for longer so they learn
      setTimeout(() => {
        advanceGame();
      }, 1500);
    }
  };

  const advanceGame = () => {
    if (lives <= 1 && selectedOption !== correctOption && selectedOption !== null) {
      // If we just lost the last life
      setIsFinished(true);
      setIsPlaying(false);
      return;
    }

    if (currentIndex + 1 >= shuffledList.length) {
      setIsFinished(true);
      setIsPlaying(false);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Determine XP based on score
  const calculateXp = () => {
    if (score === 0) return 0;
    if (score < 50) return 10;
    if (score < 100) return 15;
    if (score < 150) return 20;
    return 30;
  };

  const xpReward = calculateXp();

  const handleClaimXp = async () => {
    if (xpRewarded || xpReward === 0) return;
    setXpRewarded(true);
    try {
      await fetch("/api/user/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp: xpReward, activity: "Speed Cards Game" }),
      });
    } catch {
      // Fail silently if offline
    }
  };

  const progressPercentage = (timeLeft / TIME_LIMIT) * 100;

  return (
    <Card className="w-full border-border bg-card/60 backdrop-blur-md">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between pb-3 border-b border-border gap-3">
        <CardTitle className="font-heading text-lg font-bold flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent animate-pulse" />
          Тренажер «Быстрые карты» (Speed Cards)
        </CardTitle>
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="text-muted-foreground flex items-center gap-1.5">
            Жизни:
            <span className="flex gap-0.5 text-rose-500 font-bold">
              {Array.from({ length: Math.max(0, lives) }).map((_, idx) => (
                <Heart key={`live-${idx}`} className="h-4 w-4 fill-rose-500 text-rose-500" />
              ))}
              {Array.from({ length: Math.max(0, 3 - lives) }).map((_, idx) => (
                <Heart key={`dead-${idx}`} className="h-4 w-4 text-rose-500/20" />
              ))}
            </span>
          </span>
          {combo > 1 && (
            <span className="flex items-center gap-0.5 text-amber-500 font-bold animate-bounce">
              <Flame className="h-4 w-4 fill-amber-500" />
              x{combo}
            </span>
          )}
          <span className="text-muted-foreground">Счёт: <span className="text-foreground font-semibold">{score}</span></span>
          <span className="text-muted-foreground">Слово: <span className="text-primary font-bold">{currentIndex + 1}/{shuffledList.length}</span></span>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {!isFinished && shuffledList.length > 0 ? (
          <div className="space-y-6">
            {/* Time Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                <span>Оставшееся время:</span>
                <span className={cn(timeLeft <= 3 ? "text-rose-500 font-bold animate-pulse" : "")}>
                  {timeLeft} сек
                </span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-2"
                style={{
                  backgroundColor: "rgba(229, 231, 235, 0.1)",
                }}
              />
            </div>

            {/* Target Word Display */}
            <div className="flex flex-col items-center justify-center py-10 bg-muted/20 border border-border/50 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-2 right-2 text-xs text-muted-foreground select-none">
                Слушайте произношение
              </div>
              <h2 className="font-heading text-4xl font-bold text-foreground mb-4 tracking-wide select-none">
                {shuffledList[currentIndex]?.word.word}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => speakWord(shuffledList[currentIndex]?.word.word)}
                className="flex items-center gap-1.5 rounded-full hover:scale-105 transition-transform"
              >
                <Volume2 className="h-4 w-4 text-primary" />
                Прослушать
              </Button>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((option, idx) => {
                const isThisSelected = selectedOption === option;
                const isCorrect = option === correctOption;
                const showCorrectStyle = isAnswered && isCorrect;
                const showWrongStyle = isAnswered && isThisSelected && !isCorrect;

                return (
                  <button
                    key={`opt-${idx}`}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(option)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border p-4 text-left text-sm font-medium transition-all duration-300 md:text-base outline-none relative overflow-hidden",
                      showCorrectStyle
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold ring-2 ring-emerald-500/20"
                        : showWrongStyle
                        ? "border-destructive bg-destructive/10 text-destructive font-semibold ring-2 ring-destructive/20 scale-95"
                        : isAnswered
                        ? "border-border bg-muted/10 text-muted-foreground opacity-50"
                        : "border-border bg-muted/30 text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted/60 hover:shadow-sm"
                    )}
                  >
                    <span className="flex-1 pr-4">{option}</span>
                    <span className="text-xs font-semibold text-muted-foreground bg-muted/80 border border-border px-1.5 py-0.5 rounded">
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="text-center text-xs text-muted-foreground">
              Используйте клавиши <kbd className="px-1.5 py-0.5 bg-muted border rounded">1</kbd>,{" "}
              <kbd className="px-1.5 py-0.5 bg-muted border rounded">2</kbd>,{" "}
              <kbd className="px-1.5 py-0.5 bg-muted border rounded">3</kbd>,{" "}
              <kbd className="px-1.5 py-0.5 bg-muted border rounded">4</kbd> на клавиатуре для быстрых ответов
            </div>
          </div>
        ) : (
          /* Finished Screen */
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full scale-110",
                lives <= 0
                  ? "bg-destructive/10 text-destructive animate-pulse"
                  : "bg-emerald-500/10 text-emerald-500 animate-bounce"
              )}
            >
              {lives <= 0 ? <XCircle className="h-10 w-10" /> : <Award className="h-10 w-10" />}
            </div>

            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground">
                {lives <= 0 ? "Попытки закончились!" : "Игра окончена!"}
              </h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                {lives <= 0
                  ? "Вы сделали 3 ошибки. Попробуйте еще раз!"
                  : "Отличный забег! Вы успешно проверили свои знания на скорость."}
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 bg-muted/20 border border-border/50 rounded-2xl px-6 py-4 w-full max-w-md">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-0.5">Очки</div>
                <div className="text-xl font-bold text-foreground">{score}</div>
              </div>
              <div className="text-center border-x border-border/50">
                <div className="text-xs text-muted-foreground mb-0.5">Макс Комбо</div>
                <div className="text-xl font-bold text-amber-500 flex items-center justify-center gap-0.5">
                  <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
                  {maxCombo}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-0.5">Верно</div>
                <div className="text-xl font-bold text-emerald-500">{correctCount}</div>
              </div>
            </div>

            {/* Reward block */}
            {xpReward > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 flex items-center gap-3">
                <Zap className="h-5 w-5 text-accent animate-pulse" />
                <span className="font-medium text-sm">Награда: +{xpReward} XP</span>
                {!xpRewarded && (
                  <Button size="sm" onClick={handleClaimXp} className="ml-2">
                    Забрать
                  </Button>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={initGame} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Сыграть ещё раз
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
