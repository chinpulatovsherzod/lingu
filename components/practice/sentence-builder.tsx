"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, RotateCcw, Award, XCircle, Volume2, Heart, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type WordItem = {
  id: string;
  word: {
    word: string;
    definition: string;
    exampleSentence: string;
  };
};

type SentenceLevel = {
  id: string;
  russianClue: string;
  englishTarget: string;
  wordBlocks: string[];
};

type SentenceBuilderProps = {
  userWords: WordItem[];
};

const PREDEFINED_LEVELS: SentenceLevel[] = [
  {
    id: "pre1",
    russianClue: "Я изучаю английский язык, чтобы получить лучшую работу.",
    englishTarget: "I am learning English to get a better job.",
    wordBlocks: ["I", "am", "learning", "English", "to", "get", "a", "better", "job."],
  },
  {
    id: "pre2",
    russianClue: "Она изучает грамматику с самого утра.",
    englishTarget: "She has been studying grammar since morning.",
    wordBlocks: ["She", "has", "been", "studying", "grammar", "since", "morning."],
  },
  {
    id: "pre3",
    russianClue: "Если я найду хороший курс, я улучшу свои навыки.",
    englishTarget: "If I find a good course, я will improve my skills.", // Note: simple typo check helper: "I will improve my skills"
    wordBlocks: ["If", "I", "find", "a", "good", "course,", "I", "will", "improve", "my", "skills."],
  },
  {
    id: "pre4",
    russianClue: "Мы бы завершили этот тест, если бы у нас было больше времени.",
    englishTarget: "We would have completed this test if we had more time.",
    wordBlocks: ["We", "would", "have", "completed", "this", "test", "if", "we", "had", "more", "time."],
  },
  {
    id: "pre5",
    russianClue: "Эта красивая библиотека была построена известными архитекторами.",
    englishTarget: "This beautiful library was built by famous architects.",
    wordBlocks: ["This", "beautiful", "library", "was", "built", "by", "famous", "architects."],
  },
];

export function SentenceBuilderGame({ userWords }: SentenceBuilderProps) {
  const [levels, setLevels] = useState<SentenceLevel[]>([]);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  
  // Gameplay states
  const [constructed, setConstructed] = useState<string[]>([]);
  const [pool, setPool] = useState<string[]>([]);
  
  const [lives, setLives] = useState(3);
  const [isLevelChecked, setIsLevelChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const [isFinished, setIsFinished] = useState(false);
  const [xpRewarded, setXpRewarded] = useState(false);

  // Generate levels on mount or when userWords changes
  useEffect(() => {
    // Select valid user words with sentence examples
    const validUserWords = (userWords || []).filter(
      (w) => w.word.exampleSentence && w.word.exampleSentence.trim().length > 10
    );

    const generatedLevels: SentenceLevel[] = [];

    // Add user-word levels first (up to 3)
    validUserWords.slice(0, 3).forEach((item, index) => {
      const target = item.word.exampleSentence.trim();
      // Simple splitter preserving original tokens
      const blocks = target.split(/\s+/);
      generatedLevels.push({
        id: `user-${item.id}`,
        russianClue: `Соберите пример для слова "${item.word.word}" (Перевод слова: ${item.word.definition})`,
        englishTarget: target,
        wordBlocks: blocks,
      });
    });

    // Pad remaining levels with predefined levels
    let preIndex = 0;
    while (generatedLevels.length < 5 && preIndex < PREDEFINED_LEVELS.length) {
      // Avoid duplicate targets just in case
      const preLevel = PREDEFINED_LEVELS[preIndex];
      generatedLevels.push({
        ...preLevel,
        // Make sure it has correct blocks array
        wordBlocks: preLevel.englishTarget.split(/\s+/),
      });
      preIndex++;
    }

    setLevels(generatedLevels.slice(0, 5));
    setCurrentLevelIdx(0);
    setLives(3);
    setIsFinished(false);
    setXpRewarded(false);
  }, [userWords]);

  // Load level details
  useEffect(() => {
    if (levels.length === 0 || currentLevelIdx >= levels.length) return;

    const level = levels[currentLevelIdx];
    // Shuffle the blocks for the pool
    const shuffled = [...level.wordBlocks].sort(() => Math.random() - 0.5);
    setPool(shuffled);
    setConstructed([]);
    setIsLevelChecked(false);
    setIsCorrect(false);
  }, [currentLevelIdx, levels]);

  // Handle clicking word in pool (moves to constructed)
  const handleWordClickFromPool = (word: string, indexInPool: number) => {
    if (isLevelChecked && isCorrect) return; // locked after success
    
    // Add to constructed
    setConstructed((prev) => [...prev, word]);
    
    // Remove from pool (only the specific index to support duplicate words)
    setPool((prev) => prev.filter((_, idx) => idx !== indexInPool));
  };

  // Handle clicking word in constructed (moves back to pool)
  const handleWordClickFromConstructed = (word: string, indexInConstructed: number) => {
    if (isLevelChecked && isCorrect) return; // locked after success
    
    // Add back to pool
    setPool((prev) => [...prev, word]);
    
    // Remove from constructed
    setConstructed((prev) => prev.filter((_, idx) => idx !== indexInConstructed));
  };

  // Pronounce full sentence
  const speakSentence = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  // Check constructed answer
  const handleCheck = () => {
    if (levels.length === 0) return;
    const level = levels[currentLevelIdx];
    const joinedConstructed = constructed.join(" ").trim();
    const target = level.englishTarget.trim();

    // Direct string match comparison
    const match = joinedConstructed.toLowerCase() === target.toLowerCase();

    setIsLevelChecked(true);
    setIsCorrect(match);

    if (match) {
      speakSentence(level.englishTarget);
    } else {
      // Reduce life
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) {
          setIsFinished(true);
        }
        return next;
      });
    }
  };

  // Reset current level
  const handleResetLevel = () => {
    if (levels.length === 0) return;
    const level = levels[currentLevelIdx];
    const shuffled = [...level.wordBlocks].sort(() => Math.random() - 0.5);
    setPool(shuffled);
    setConstructed([]);
    setIsLevelChecked(false);
    setIsCorrect(false);
  };

  // Advance level
  const handleNextLevel = () => {
    if (currentLevelIdx + 1 >= levels.length) {
      setIsFinished(true);
    } else {
      setCurrentLevelIdx((prev) => prev + 1);
    }
  };

  // Restart game
  const handleRestart = () => {
    setCurrentLevelIdx(0);
    setLives(3);
    setIsFinished(false);
    setXpRewarded(false);
    // force reload level
    if (levels.length > 0) {
      const level = levels[0];
      setPool([...level.wordBlocks].sort(() => Math.random() - 0.5));
      setConstructed([]);
      setIsLevelChecked(false);
      setIsCorrect(false);
    }
  };

  // XP Reward
  const handleClaimXp = async () => {
    if (xpRewarded || lives <= 0) return;
    setXpRewarded(true);
    try {
      await fetch("/api/user/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp: 20, activity: "Sentence Builder Game" }),
      });
    } catch {
      // Fail silently if offline
    }
  };

  const currentLevel = levels[currentLevelIdx];

  return (
    <Card className="w-full border-border bg-card/60 backdrop-blur-md">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between pb-3 border-b border-border gap-3">
        <CardTitle className="font-heading text-lg font-bold flex items-center gap-2">
          <Award className="h-5 w-5 text-accent animate-pulse" />
          Тренажер «Конструктор фраз»
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
          <span className="text-muted-foreground">Уровень: <span className="text-primary font-bold">{currentLevelIdx + 1}/{levels.length}</span></span>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {!isFinished && currentLevel ? (
          <div className="space-y-6">
            {/* Clue Prompt */}
            <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 relative overflow-hidden">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider block mb-1">
                Подсказка-перевод:
              </span>
              <p className="text-base md:text-lg font-medium text-foreground">
                {currentLevel.russianClue}
              </p>
            </div>

            {/* Constructed Sentence Slots */}
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground font-semibold">Ваше предложение:</span>
              <div className="flex flex-wrap gap-2 p-4 min-h-[4.5rem] bg-background/50 border border-dashed border-border rounded-xl items-center">
                {constructed.length === 0 ? (
                  <span className="text-sm text-muted-foreground italic select-none">
                    Нажимайте на блоки слов ниже, чтобы составить фразу...
                  </span>
                ) : (
                  constructed.map((word, idx) => (
                    <button
                      key={`constructed-${idx}`}
                      onClick={() => handleWordClickFromConstructed(word, idx)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-sm font-medium border transition-all shadow-sm select-none",
                        isLevelChecked
                          ? isCorrect
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold"
                            : "bg-destructive/10 border-destructive text-destructive"
                          : "bg-primary/10 border-primary/20 hover:bg-destructive/10 hover:border-destructive hover:text-destructive text-foreground"
                      )}
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Word Blocks Pool */}
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground font-semibold">Доступные слова:</span>
              <div className="flex flex-wrap gap-2 p-4 min-h-[4.5rem] bg-muted/20 border border-border/40 rounded-xl items-center">
                {pool.length === 0 && constructed.length > 0 ? (
                  <span className="text-xs text-muted-foreground italic select-none">
                    Все слова перемещены в поле ввода
                  </span>
                ) : (
                  pool.map((word, idx) => (
                    <button
                      key={`pool-${idx}`}
                      onClick={() => handleWordClickFromPool(word, idx)}
                      className="rounded-lg bg-card border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:border-primary hover:bg-muted transition-all shadow-sm hover:-translate-y-0.5"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Answer feedback alert */}
            {isLevelChecked && (
              <div
                className={cn(
                  "border rounded-xl p-4 flex items-center justify-between",
                  isCorrect
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-destructive/10 border-destructive/20 text-destructive"
                )}
              >
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      <div>
                        <span className="font-bold block">Отлично! Всё правильно.</span>
                        <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80 font-medium">
                          Предложение произнесено в аудио.
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                      <div>
                        <span className="font-bold block">Неверно. Попробуйте еще раз!</span>
                        <span className="text-xs text-rose-600/80 dark:text-rose-400/80">
                          Проверьте порядок слов и расстановку знаков препинания.
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {isCorrect && (
                  <Button
                    size="sm"
                    onClick={handleNextLevel}
                    className="flex items-center gap-1 bg-emerald-600 text-white hover:bg-emerald-500 border-none shrink-0"
                  >
                    Далее <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetLevel}
                className="flex items-center gap-1.5"
              >
                <RotateCcw className="h-4 w-4" /> Очистить
              </Button>
              {isLevelChecked && isCorrect && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakSentence(currentLevel.englishTarget)}
                  className="flex items-center gap-1.5"
                >
                  <Volume2 className="h-4 w-4" /> Озвучить
                </Button>
              )}
              <Button
                disabled={constructed.length === 0 || (isLevelChecked && isCorrect)}
                onClick={handleCheck}
                className="flex items-center gap-1.5"
              >
                Проверить
              </Button>
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
                {lives <= 0 ? "Попытки закончились!" : "Великолепный результат!"}
              </h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                {lives <= 0
                  ? "Вы совершили 3 ошибки. Попробуйте пройти заново и потренировать структуру фраз!"
                  : "Вы успешно построили все 5 английских предложений с правильной грамматикой."}
              </p>
            </div>

            {/* Reward block */}
            {!isFinished || (lives > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 flex items-center gap-3">
                <Zap className="h-5 w-5 text-accent animate-pulse" />
                <span className="font-medium text-sm">Награда: +20 XP</span>
                {!xpRewarded && (
                  <Button size="sm" onClick={handleClaimXp} className="ml-2">
                    Забрать
                  </Button>
                )}
              </div>
            ))}

            <div className="flex gap-3">
              <Button onClick={handleRestart} className="flex items-center gap-2">
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
