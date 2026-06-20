"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, RotateCcw, Award, XCircle, Volume2, Heart, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ReportedSpeechLevel = {
  id: string;
  speakerName: string;
  speakerEmoji: string;
  directSpeech: string;
  textSegments: string[]; // e.g. ["Alex said that he ", " hungry."]
  options: string[][]; // list of choices for each blank
  correctAnswers: string[]; // correct choices
};

const GAME_LEVELS: ReportedSpeechLevel[] = [
  {
    id: "rsg-1",
    speakerName: "Alex",
    speakerEmoji: "👦",
    directSpeech: '"I am hungry."',
    textSegments: ["Alex said that he ", " hungry."],
    options: [["was", "is", "had been"]],
    correctAnswers: ["was"],
  },
  {
    id: "rsg-2",
    speakerName: "Jane",
    speakerEmoji: "👧",
    directSpeech: '"I will help you tomorrow."',
    textSegments: ["Jane promised that she ", " help us ", "."],
    options: [
      ["would", "will", "did"],
      ["the next day", "tomorrow", "yesterday"],
    ],
    correctAnswers: ["would", "the next day"],
  },
  {
    id: "rsg-3",
    speakerName: "Tom",
    speakerEmoji: "👨",
    directSpeech: '"Where did you go?"',
    textSegments: ["Tom asked me where I ", "."],
    options: [["had gone", "went", "did go"]],
    correctAnswers: ["had gone"],
  },
  {
    id: "rsg-4",
    speakerName: "Sara",
    speakerEmoji: "👩",
    directSpeech: '"I can\'t come because I lost my keys."',
    textSegments: ["Sara explained that she ", " come because she ", " her keys."],
    options: [
      ["couldn't", "can't", "wouldn't"],
      ["had lost", "lost", "loses"],
    ],
    correctAnswers: ["couldn't", "had lost"],
  },
  {
    id: "rsg-5",
    speakerName: "Officer Rick",
    speakerEmoji: "👮",
    directSpeech: '"Have you ever been here?"',
    textSegments: ["The officer asked us if we ", " ever been ", "."],
    options: [
      ["had", "have", "were"],
      ["there", "here", "somewhere"],
    ],
    correctAnswers: ["had", "there"],
  },
];

export function ReportedSpeechGame() {
  const [levelIdx, setLevelIdx] = useState(0);
  const currentLevel = GAME_LEVELS[levelIdx];

  const [selections, setSelections] = useState<string[]>([]);
  const [lives, setLives] = useState(3);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const [isFinished, setIsFinished] = useState(false);
  const [xpRewarded, setXpRewarded] = useState(false);

  // Initialize level
  useEffect(() => {
    if (!currentLevel) return;
    setSelections(Array(currentLevel.options.length).fill(""));
    setChecked(false);
    setIsCorrect(false);
  }, [levelIdx, currentLevel]);

  // Click handler for options
  const handleSelectOption = (blankIndex: number, val: string) => {
    if (checked && isCorrect) return; // locked on success
    setSelections((prev) => {
      const next = [...prev];
      next[blankIndex] = val;
      return next;
    });
    setChecked(false); // reset check if they change answer
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCheck = () => {
    if (!currentLevel) return;
    
    // Check if all answers match
    const match = selections.every(
      (sel, idx) => sel === currentLevel.correctAnswers[idx]
    );

    setChecked(true);
    setIsCorrect(match);

    if (match) {
      // Speak the constructed reported sentence
      let fullText = "";
      currentLevel.textSegments.forEach((seg, idx) => {
        fullText += seg;
        if (idx < selections.length) {
          fullText += selections[idx];
        }
      });
      speakText(fullText);
    } else {
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) {
          setIsFinished(true);
        }
        return next;
      });
    }
  };

  const handleNext = () => {
    if (levelIdx >= GAME_LEVELS.length - 1) {
      setIsFinished(true);
    } else {
      setLevelIdx((idx) => idx + 1);
    }
  };

  const handleRestart = () => {
    setLevelIdx(0);
    setLives(3);
    setIsFinished(false);
    setXpRewarded(false);
    setSelections(Array(GAME_LEVELS[0].options.length).fill(""));
    setChecked(false);
    setIsCorrect(false);
  };

  const handleClaimXp = async () => {
    if (xpRewarded || lives <= 0) return;
    setXpRewarded(true);
    try {
      await fetch("/api/user/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp: 25, activity: "Reported Speech Game" }),
      });
    } catch {
      // Fail silently
    }
  };

  return (
    <Card className="w-full border-border bg-card/60 backdrop-blur-md">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between pb-3 border-b border-border gap-3">
        <CardTitle className="font-heading text-lg font-bold flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent animate-pulse" />
          Тренажер «Эхо-репортер» (Reported Speech)
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
          <span className="text-muted-foreground">Уровень: <span className="text-primary font-bold">{levelIdx + 1}/{GAME_LEVELS.length}</span></span>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {!isFinished && currentLevel ? (
          <div className="space-y-6">
            {/* Speaker Prompt (Direct Speech) */}
            <div className="flex items-start gap-4 bg-muted/20 border border-border/50 rounded-2xl p-5 relative overflow-hidden">
              <div className="text-4xl select-none">{currentLevel.speakerEmoji}</div>
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-0.5">
                  {currentLevel.speakerName} говорит:
                </span>
                <p className="text-xl font-heading font-bold text-foreground italic">
                  {currentLevel.directSpeech}
                </p>
              </div>
            </div>

            {/* Reported Speech Template Display */}
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground font-semibold">Ваш пересказ в косвенной речи:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-3 p-5 min-h-[4.5rem] bg-background/50 border border-border rounded-2xl items-center text-base md:text-lg font-medium leading-relaxed">
                {currentLevel.textSegments.map((seg, idx) => (
                  <span key={`seg-${idx}`} className="flex items-center gap-2">
                    <span>{seg}</span>
                    {idx < currentLevel.options.length && (
                      <span
                        className={cn(
                          "px-3 py-1 text-sm font-bold border rounded-xl min-w-[5rem] text-center transition-all duration-200 select-none shadow-sm",
                          selections[idx] === ""
                            ? "border-dashed border-muted-foreground/40 bg-muted/10 text-muted-foreground/60 italic"
                            : checked
                            ? isCorrect
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                              : "border-destructive bg-destructive/10 text-destructive font-bold"
                            : "border-primary/30 bg-primary/5 text-primary"
                        )}
                      >
                        {selections[idx] === "" ? "выберите..." : selections[idx]}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Selection Options Pools */}
            <div className="space-y-4 pt-2">
              {currentLevel.options.map((optionGroup, optGroupIdx) => (
                <div key={`optGroup-${optGroupIdx}`} className="space-y-1.5">
                  <span className="text-xs text-muted-foreground font-semibold">
                    Варианты для пропуска {optGroupIdx + 1}:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {optionGroup.map((opt) => (
                      <button
                        key={`opt-${opt}`}
                        disabled={checked && isCorrect}
                        onClick={() => handleSelectOption(optGroupIdx, opt)}
                        className={cn(
                          "rounded-lg border px-4 py-2 text-sm font-medium transition-all shadow-sm",
                          selections[optGroupIdx] === opt
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border text-foreground hover:bg-muted"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Check Feedback Alert */}
            {checked && (
              <div
                className={cn(
                  "border rounded-xl p-4 flex items-center justify-between animate-fade-in",
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
                        <span className="font-bold block">Отлично пересказано!</span>
                        <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                          Все сдвиги времен (backshift) выполнены верно.
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                      <div>
                        <span className="font-bold block">Неверный пересказ. Попробуйте ещё!</span>
                        <span className="text-xs text-rose-600/80 dark:text-rose-400/80">
                          Обратите внимание на замену местоимений, временных маркеров и правил согласования времен.
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {isCorrect && (
                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="flex items-center gap-1 bg-emerald-600 text-white hover:bg-emerald-500 border-none shrink-0"
                  >
                    Далее <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {!isCorrect && (
              <Button
                disabled={selections.some((s) => s === "")}
                onClick={handleCheck}
                className="w-full"
              >
                Проверить пересказ
              </Button>
            )}
          </div>
        ) : (
          /* Solved Victory Screen */
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-6 animate-fade-in">
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
                {lives <= 0 ? "Попытки закончились!" : "Косвенная речь освоена!"}
              </h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                {lives <= 0
                  ? "Вы совершили 3 ошибки. Попробуйте пройти заново, чтобы отточить правила пересказа!"
                  : "Вы отлично справились со всеми 5 диалогами и сдвигами времен!"}
              </p>
            </div>

            {/* Reward block */}
            {lives > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 flex items-center gap-3">
                <Zap className="h-5 w-5 text-accent animate-pulse" />
                <span className="font-medium text-sm">Награда: +25 XP</span>
                {!xpRewarded && (
                  <Button size="sm" onClick={handleClaimXp} className="ml-2">
                    Забрать
                  </Button>
                )}
              </div>
            )}

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
