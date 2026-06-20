"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, RotateCcw, Award, CheckCircle2, HelpCircle, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

type WordDefinition = {
  number: number;
  word: string;
  clue: string;
  direction: "across" | "down";
  row: number;
  col: number;
};

type CrosswordLevel = {
  id: string;
  name: string;
  gridWidth: number;
  gridHeight: number;
  words: WordDefinition[];
};

const CROSSWORD_LEVELS: CrosswordLevel[] = [
  {
    id: "b1",
    name: "B1 (Средний)",
    gridWidth: 6,
    gridHeight: 6,
    words: [
      { number: 1, word: "SIMPLE", clue: "Простой, несложный, элементарный", direction: "across", row: 1, col: 0 },
      { number: 2, word: "SILVER", clue: "Серебро или серебряный цвет/металл", direction: "across", row: 3, col: 0 },
      { number: 1, word: "FINISH", clue: "Завершать, заканчивать работу или гонку", direction: "down", row: 0, col: 1 },
      { number: 3, word: "CLIENT", clue: "Клиент, заказчик, покупатель услуг", direction: "down", row: 0, col: 4 },
    ],
  },
  {
    id: "b2",
    name: "B2 (Выше среднего)",
    gridWidth: 7,
    gridHeight: 7,
    words: [
      { number: 1, word: "ACQUIRE", clue: "Приобретать, овладевать (навыком), усваивать", direction: "across", row: 0, col: 0 },
      { number: 3, word: "AMATEUR", clue: "Любитель, непрофессионал, любительский", direction: "across", row: 2, col: 0 },
      { number: 1, word: "ANALYZE", clue: "Анализировать, детально разбирать", direction: "down", row: 0, col: 0 },
      { number: 2, word: "QUALITY", clue: "Качество, свойство, характеристика", direction: "down", row: 0, col: 2 },
      { number: 4, word: "IDEAL", clue: "Идеал, идеальный, совершенный", direction: "down", row: 0, col: 4 },
    ],
  },
  {
    id: "c1",
    name: "C1 (Продвинутый)",
    gridWidth: 7,
    gridHeight: 8,
    words: [
      { number: 1, word: "OBSCURE", clue: "Смутный, малоизвестный, скрывать, делать неясным", direction: "across", row: 0, col: 0 },
      { number: 2, word: "TROUBLE", clue: "Беспокойство, проблема, тревожить, мешать", direction: "across", row: 2, col: 0 },
      { number: 1, word: "OPTIMAL", clue: "Оптимальный, наиболее благоприятный, наилучший", direction: "down", row: 0, col: 0 },
      { number: 3, word: "SPORADIC", clue: "Спорадический, единичный, случайный, нерегулярный", direction: "down", row: 0, col: 2 },
      { number: 4, word: "UNUSUAL", clue: "Необычный, редкий, неординарный", direction: "down", row: 0, col: 4 },
    ],
  },
];

export function CrosswordGame() {
  const [activeLevelIdx, setActiveLevelIdx] = useState(0);
  const currentLevel = CROSSWORD_LEVELS[activeLevelIdx];

  // User input letters state: key is `row-col`, value is string (1 char)
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isCellChecked, setIsCellChecked] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [xpRewarded, setXpRewarded] = useState(false);

  // Focus tracking
  const [focusedCell, setFocusedCell] = useState<[number, number] | null>(null);
  const [activeDirection, setActiveDirection] = useState<"across" | "down">("across");

  // Keep cell input refs to programmatically focus
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Reset inputs when level changes
  useEffect(() => {
    setInputs({});
    setIsCellChecked(false);
    setIsSolved(false);
    setXpRewarded(false);
    setFocusedCell(null);
  }, [activeLevelIdx]);

  // Compute layout structure
  const activeCells = new Set<string>();
  const cellNumbers: Record<string, number> = {};
  const correctLetters: Record<string, string> = {};

  currentLevel.words.forEach((w) => {
    for (let i = 0; i < w.word.length; i++) {
      const r = w.direction === "across" ? w.row : w.row + i;
      const c = w.direction === "across" ? w.col + i : w.col;
      const key = `${r}-${c}`;
      activeCells.add(key);
      correctLetters[key] = w.word[i].toUpperCase();

      if (i === 0) {
        cellNumbers[key] = w.number;
      }
    }
  });

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    const key = `${row}-${col}`;
    if (!activeCells.has(key)) return;

    if (focusedCell && focusedCell[0] === row && focusedCell[1] === col) {
      // Toggle direction if clicked again
      setActiveDirection((d) => (d === "across" ? "down" : "across"));
    } else {
      setFocusedCell([row, col]);
    }
  };

  // Find next cell in current word direction
  const getNextCell = (row: number, col: number, direction: "across" | "down", steps = 1): [number, number] | null => {
    let nextRow = row;
    let nextCol = col;
    
    if (direction === "across") {
      nextCol += steps;
    } else {
      nextRow += steps;
    }

    const key = `${nextRow}-${nextCol}`;
    if (activeCells.has(key)) {
      return [nextRow, nextCol];
    }
    return null;
  };

  // Keyboard navigation & typing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    const key = `${row}-${col}`;

    if (e.key === "Backspace") {
      e.preventDefault();
      
      // If cell has value, clear it
      if (inputs[key]) {
        setInputs((prev) => ({ ...prev, [key]: "" }));
      } else {
        // Go back and clear previous cell
        const prev = getNextCell(row, col, activeDirection, -1);
        if (prev) {
          const prevKey = `${prev[0]}-${prev[1]}`;
          setInputs((prevInputs) => ({ ...prevInputs, [prevKey]: "" }));
          setFocusedCell(prev);
          inputRefs.current[prevKey]?.focus();
        }
      }
      return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = getNextCell(row, col, "across", 1);
      if (next) {
        setFocusedCell(next);
        setActiveDirection("across");
        inputRefs.current[`${next[0]}-${next[1]}`]?.focus();
      }
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const next = getNextCell(row, col, "across", -1);
      if (next) {
        setFocusedCell(next);
        setActiveDirection("across");
        inputRefs.current[`${next[0]}-${next[1]}`]?.focus();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = getNextCell(row, col, "down", 1);
      if (next) {
        setFocusedCell(next);
        setActiveDirection("down");
        inputRefs.current[`${next[0]}-${next[1]}`]?.focus();
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = getNextCell(row, col, "down", -1);
      if (next) {
        setFocusedCell(next);
        setActiveDirection("down");
        inputRefs.current[`${next[0]}-${next[1]}`]?.focus();
      }
      return;
    }

    // Capture standard letters (A-Z, a-z) and Cyrillic/Latin keyboard layouts
    if (e.key.length === 1 && /[a-zA-Z]/i.test(e.key)) {
      e.preventDefault();
      const upperChar = e.key.toUpperCase();
      
      setInputs((prev) => ({ ...prev, [key]: upperChar }));
      setIsCellChecked(false); // reset checked styling on edit

      // Move focus forward
      const next = getNextCell(row, col, activeDirection, 1);
      if (next) {
        setFocusedCell(next);
        inputRefs.current[`${next[0]}-${next[1]}`]?.focus();
      }
    }
  };

  const handleCheck = () => {
    let allCorrect = true;
    
    // Check all active cells
    activeCells.forEach((key) => {
      const correct = correctLetters[key];
      const user = inputs[key] || "";
      if (user !== correct) {
        allCorrect = false;
      }
    });

    setIsCellChecked(true);
    if (allCorrect) {
      setIsSolved(true);
    }
  };

  const handleClaimXp = async () => {
    if (xpRewarded || !isSolved) return;
    setXpRewarded(true);
    try {
      await fetch("/api/user/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp: 30, activity: `Crossword Resolved (${currentLevel.name})` }),
      });
    } catch {
      // Fail silently
    }
  };

  // Check if a cell is highlighted (belongs to the currently focused word)
  const isCellHighlighted = (row: number, col: number) => {
    if (!focusedCell) return false;
    const [fRow, fCol] = focusedCell;

    // Find the word that is currently focused in activeDirection
    const focusedWord = currentLevel.words.find((w) => {
      if (w.direction !== activeDirection) return false;
      
      // Check if clicked cell falls within word boundaries
      if (w.direction === "across") {
        return fRow === w.row && fCol >= w.col && fCol < w.col + w.word.length;
      } else {
        return fCol === w.col && fRow >= w.row && fRow < w.row + w.word.length;
      }
    });

    if (!focusedWord) return false;

    // Check if this row,col falls within that same word
    if (focusedWord.direction === "across") {
      return row === focusedWord.row && col >= focusedWord.col && col < focusedWord.col + focusedWord.word.length;
    } else {
      return col === focusedWord.col && row >= focusedWord.row && row < focusedWord.row + focusedWord.word.length;
    }
  };

  return (
    <Card className="w-full border-border bg-card/60 backdrop-blur-md">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between pb-3 border-b border-border gap-3">
        <CardTitle className="font-heading text-lg font-bold flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          Интерактивный Кроссворд
        </CardTitle>
        <div className="flex bg-muted/60 p-0.5 rounded-xl border border-border">
          {CROSSWORD_LEVELS.map((level, idx) => (
            <button
              key={level.id}
              onClick={() => setActiveLevelIdx(idx)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                activeLevelIdx === idx
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {level.name}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {!isSolved ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left/Top: Crossword Grid */}
            <div className="lg:col-span-7 flex justify-center">
              <div
                className="grid gap-1 bg-slate-950/20 dark:bg-slate-900/10 p-4 border border-border/80 rounded-2xl shadow-inner max-w-full overflow-auto"
                style={{
                  gridTemplateColumns: `repeat(${currentLevel.gridWidth}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: currentLevel.gridHeight }).map((_, rIdx) =>
                  Array.from({ length: currentLevel.gridWidth }).map((_, cIdx) => {
                    const key = `${rIdx}-${cIdx}`;
                    const isActive = activeCells.has(key);
                    const isFocused = focusedCell && focusedCell[0] === rIdx && focusedCell[1] === cIdx;
                    const isHighlighted = isCellHighlighted(rIdx, cIdx);

                    const userLetter = inputs[key] || "";
                    const correctLetter = correctLetters[key];
                    const isCorrect = userLetter === correctLetter;

                    return (
                      <div
                        key={key}
                        onClick={() => handleCellClick(rIdx, cIdx)}
                        className={cn(
                          "relative aspect-square h-10 w-10 md:h-12 md:w-12 rounded-lg border flex items-center justify-center transition-all duration-200 select-none",
                          !isActive
                            ? "bg-slate-900/90 border-slate-950 dark:bg-slate-950 dark:border-slate-950 opacity-40 cursor-not-allowed"
                            : isFocused
                            ? "bg-primary/20 border-primary ring-2 ring-primary/30"
                            : isCellChecked && userLetter
                            ? isCorrect
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold"
                              : "bg-destructive/15 border-destructive text-destructive font-bold animate-shake"
                            : isHighlighted
                            ? "bg-primary/5 border-primary/40"
                            : "bg-background border-border hover:border-primary/40 cursor-text"
                        )}
                      >
                        {/* Start Word Cell Label Number */}
                        {cellNumbers[key] && (
                          <span className="absolute top-0.5 left-0.5 text-[9px] font-bold text-muted-foreground select-none leading-none">
                            {cellNumbers[key]}
                          </span>
                        )}

                        {/* Letter Input */}
                        {isActive && (
                          <input
                            ref={(el) => {
                              inputRefs.current[key] = el;
                            }}
                            type="text"
                            maxLength={1}
                            value={userLetter}
                            onChange={() => {}}
                            onKeyDown={(e) => handleKeyDown(e, rIdx, cIdx)}
                            className="w-full h-full text-center text-lg md:text-xl font-bold uppercase bg-transparent border-none outline-none caret-transparent text-foreground"
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right/Bottom: Question Clues */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-primary border-b border-border pb-1.5 flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4" /> По горизонтали (Across)
                </h4>
                <div className="space-y-2">
                  {currentLevel.words
                    .filter((w) => w.direction === "across")
                    .map((w) => (
                      <div
                        key={`${w.number}-across`}
                        className={cn(
                          "text-sm p-2 rounded-lg border transition-all select-none cursor-pointer",
                          focusedCell &&
                            activeDirection === "across" &&
                            isCellHighlighted(w.row, w.col)
                            ? "bg-primary/10 border-primary/30 font-medium"
                            : "bg-muted/30 border-transparent hover:bg-muted/60"
                        )}
                        onClick={() => {
                          setFocusedCell([w.row, w.col]);
                          setActiveDirection("across");
                          inputRefs.current[`${w.row}-${w.col}`]?.focus();
                        }}
                      >
                        <span className="font-bold text-primary mr-1.5">{w.number}.</span>
                        {w.clue} <span className="text-[11px] text-muted-foreground">({w.word.length} букв)</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-primary border-b border-border pb-1.5 flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4" /> По вертикали (Down)
                </h4>
                <div className="space-y-2">
                  {currentLevel.words
                    .filter((w) => w.direction === "down")
                    .map((w) => (
                      <div
                        key={`${w.number}-down`}
                        className={cn(
                          "text-sm p-2 rounded-lg border transition-all select-none cursor-pointer",
                          focusedCell &&
                            activeDirection === "down" &&
                            isCellHighlighted(w.row, w.col)
                            ? "bg-primary/10 border-primary/30 font-medium"
                            : "bg-muted/30 border-transparent hover:bg-muted/60"
                        )}
                        onClick={() => {
                          setFocusedCell([w.row, w.col]);
                          setActiveDirection("down");
                          inputRefs.current[`${w.row}-${w.col}`]?.focus();
                        }}
                      >
                        <span className="font-bold text-primary mr-1.5">{w.number}.</span>
                        {w.clue} <span className="text-[11px] text-muted-foreground">({w.word.length} букв)</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setInputs({})}
                  className="flex-1 items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> Сбросить
                </Button>
                <Button onClick={handleCheck} className="flex-1 font-semibold">
                  Проверить
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Solved Victory Screen */
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-6 animate-fade-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 scale-110 animate-bounce">
              <Award className="h-10 w-10" />
            </div>

            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Кроссворд успешно разгадан!
              </h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                Отличная работа! Вы правильно ввели все пересекающиеся слова уровня{" "}
                <span className="font-bold text-foreground">{currentLevel.name}</span>.
              </p>
            </div>

            {/* Reward block */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 flex items-center gap-3">
              <Zap className="h-5 w-5 text-accent animate-pulse" />
              <span className="font-medium text-sm">Награда: +30 XP</span>
              {!xpRewarded && (
                <Button size="sm" onClick={handleClaimXp} className="ml-2">
                  Забрать
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsSolved(false);
                  setInputs({});
                  setIsCellChecked(false);
                }}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" /> Разгадать ещё раз
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
