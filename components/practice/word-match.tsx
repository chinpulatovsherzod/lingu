"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, RotateCcw, Award, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type WordItem = {
  id: string;
  word: {
    word: string;
    definition: string;
  };
};

type CardState = {
  id: string; // unique card id: word-id + "-word" or "-definition"
  text: string;
  type: "word" | "definition";
  originalId: string;
  isMatched: boolean;
};

// Fallback IELTS words if the user has no words in their vocabulary yet
const FALLBACK_WORDS = [
  { id: "fb1", word: { word: "mitigate", definition: "смягчать, уменьшать" } },
  { id: "fb2", word: { word: "redundant", definition: "избыточный, лишний" } },
  { id: "fb3", word: { word: "exquisite", definition: "изысканный, утонченный" } },
  { id: "fb4", word: { word: "profound", definition: "глубокий, основательный" } },
  { id: "fb5", word: { word: "fluctuate", definition: "колебаться, меняться" } },
  { id: "fb6", word: { word: "comprehensive", definition: "всесторонний, полный" } },
];

export function WordMatchGame({ userWords }: { userWords: WordItem[] }) {
  const [cards, setCards] = useState<CardState[]>([]);
  const [selected, setSelected] = useState<string[]>([]); // holds card ids
  const [wrongPairs, setWrongPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isLost, setIsLost] = useState(false);
  const [xpRewarded, setXpRewarded] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const initialWords = userWords && userWords.length >= 4 ? userWords.slice(0, 6) : FALLBACK_WORDS;

  const initializeGame = () => {
    // Generate 12 cards (6 words + 6 definitions)
    const newCards: CardState[] = [];
    initialWords.forEach((item) => {
      newCards.push({
        id: `${item.id}-word`,
        text: item.word.word,
        type: "word",
        originalId: item.id,
        isMatched: false,
      });
      newCards.push({
        id: `${item.id}-def`,
        text: item.word.definition,
        type: "definition",
        originalId: item.id,
        isMatched: false,
      });
    });

    // Shuffle cards
    const shuffled = [...newCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelected([]);
    setWrongPairs([]);
    setMoves(0);
    setMatches(0);
    setMistakes(0);
    setIsLost(false);
    setIsFinished(false);
    setXpRewarded(false);
  };

  useEffect(() => {
    initializeGame();
  }, [userWords]);

  const handleCardClick = (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.isMatched || selected.includes(id) || selected.length >= 2 || isFinished) return;

    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards.find((c) => c.id === newSelected[0])!;
      const secondCard = cards.find((c) => c.id === newSelected[1])!;

      // Check match
      if (firstCard.originalId === secondCard.originalId && firstCard.type !== secondCard.type) {
        // Match Success
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.originalId === firstCard.originalId ? { ...c, isMatched: true } : c
            )
          );
          setSelected([]);
          setMatches((m) => {
            const next = m + 1;
            if (next === initialWords.length) {
              setIsFinished(true);
            }
            return next;
          });
        }, 300);
      } else {
        // Match Fail
        setWrongPairs(newSelected);
        setMistakes((prev) => {
          const next = prev + 1;
          if (next >= 3) {
            setIsLost(true);
            setIsFinished(true);
          }
          return next;
        });
        setTimeout(() => {
          setSelected([]);
          setWrongPairs([]);
        }, 1000);
      }
    }
  };

  // Add XP when game is successfully completed
  const handleClaimXp = async () => {
    if (xpRewarded) return;
    setXpRewarded(true);
    try {
      await fetch("/api/user/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp: 15, activity: "Word Match Game" }),
      });
    } catch {
      // Fallback silently if API is offline
    }
  };

  return (
    <Card className="w-full border-border bg-card/60 backdrop-blur-md">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between pb-3 border-b border-border gap-3">
        <CardTitle className="font-heading text-lg font-bold flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          Тренажер «Найди пару» (Word Match)
        </CardTitle>
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="text-muted-foreground flex items-center gap-1.5">
            Попытки: 
            <span className="flex gap-0.5 text-rose-500 font-bold">
              {Array.from({ length: Math.max(0, 3 - mistakes) }).map((_, idx) => (
                <span key={`live-${idx}`}>❤️</span>
              ))}
              {Array.from({ length: Math.min(3, mistakes) }).map((_, idx) => (
                <span key={`dead-${idx}`} className="opacity-20">❤️</span>
              ))}
            </span>
          </span>
          <span className="text-muted-foreground">Ходы: <span className="text-foreground">{moves}</span></span>
          <span className="text-muted-foreground">Пары: <span className="text-primary font-bold">{matches}/{initialWords.length}</span></span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {!isFinished ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {cards.map((card) => {
              const isSelected = selected.includes(card.id);
              const isWrong = wrongPairs.includes(card.id);

              return (
                <button
                  key={card.id}
                  disabled={card.isMatched}
                  onClick={() => handleCardClick(card.id)}
                  className={cn(
                    "flex h-24 items-center justify-center rounded-xl border p-3 text-center text-sm font-medium transition-all duration-300 md:text-base",
                    card.isMatched
                      ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 opacity-40 dark:text-emerald-400"
                      : isWrong
                      ? "scale-95 border-destructive bg-destructive/10 text-destructive shadow-lg animate-shake"
                      : isSelected
                      ? "scale-105 border-primary bg-primary/10 text-primary shadow-md ring-2 ring-primary/30"
                      : "border-border bg-muted/30 text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted/60 hover:shadow-sm"
                  )}
                >
                  {card.text}
                </button>
              );
            })}
          </div>
        ) : isLost ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive scale-110 animate-pulse">
              <XCircle className="h-10 w-10" />
            </div>
            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground">Попытки закончились!</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                Вы совершили 3 ошибки. Попробуйте еще раз сосредоточиться и пройти без ошибок!
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={initializeGame} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Начать заново
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 scale-110 animate-bounce">
              <Award className="h-10 w-10" />
            </div>
            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground">Отличная работа!</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                Вы успешно сопоставили все слова за <span className="font-semibold text-foreground">{moves} ходов</span> с {mistakes} ошибками.
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 flex items-center gap-3">
              <Zap className="h-5 w-5 text-accent animate-pulse" />
              <span className="font-medium text-sm">Награда: +15 XP</span>
              {!xpRewarded && (
                <Button size="sm" onClick={handleClaimXp} className="ml-2">
                  Забрать
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={initializeGame} className="flex items-center gap-2">
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
