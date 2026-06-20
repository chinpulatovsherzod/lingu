"use client";

import { useCallback, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/locale-provider";
import { formatMessage } from "@/lib/i18n/messages";
import { TranslationPanel } from "./translation-panel";
import { IRREGULAR_VERBS } from "@/lib/data/irregular-verbs";
import { Search, Volume2, Zap } from "lucide-react";
import type { TranslateLang } from "@/lib/translate";

export type VocabWord = {
  id: string;
  masteryStatus: string;
  word: {
    word: string;
    partOfSpeech: string;
    definition: string;
    exampleSentence: string;
    cefrLevel: string;
  };
};

function defaultLangPair(locale: string): { source: TranslateLang; target: TranslateLang } {
  if (locale === "uz") return { source: "uz", target: "en" };
  if (locale === "en") return { source: "en", target: "ru" };
  return { source: "ru", target: "en" };
}

export function VocabularyWorkspace({ initialWords }: { initialWords: VocabWord[] }) {
  const { locale, t } = useI18n();
  const [words, setWords] = useState(initialWords);
  const [activeTab, setActiveTab] = useState<"dictionary" | "irregular" | "spelling">("dictionary");
  const [searchQuery, setSearchQuery] = useState("");
  const pair = defaultLangPair(locale);

  const refreshWords = useCallback(async () => {
    const res = await fetch("/api/vocabulary");
    if (res.ok) {
      const data = await res.json();
      setWords(data);
    }
  }, []);

  const speakSingle = useCallback((word: string) => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const cleanWord = word.replace(/\//g, " or ");
    const utterance = new SpeechSynthesisUtterance(cleanWord);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }, []);

  const speakAllForms = useCallback((v1: string, v2: string, v3: string) => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${v1}... ${v2}... ${v3}`);
    utterance.lang = "en-US";
    utterance.rate = 0.85; // slightly slower for better clarity
    window.speechSynthesis.speak(utterance);
  }, []);

  const filteredVerbs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return IRREGULAR_VERBS;
    return IRREGULAR_VERBS.filter((v) => {
      const trans = v.translation[locale as "ru" | "uz" | "en"] || v.translation.ru;
      return (
        v.v1.toLowerCase().includes(q) ||
        v.v2.toLowerCase().includes(q) ||
        v.v3.toLowerCase().includes(q) ||
        trans.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, locale]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">{t.vocabulary.title}</h1>
          <p className="text-muted-foreground">
            {formatMessage(t.vocabulary.wordsInTracker, { count: words.length })}
          </p>
        </div>
        <Link href="/vocabulary/flashcards" className={cn(buttonVariants())}>
          {t.vocabulary.flashcards}
        </Link>
      </div>

      {/* Tabs selector */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("dictionary")}
          className={cn(
            "px-6 py-2.5 text-sm font-medium border-b-2 -mb-[2px] transition-all",
            activeTab === "dictionary"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {t.vocabulary.tabDictionary}
        </button>
        <button
          onClick={() => setActiveTab("irregular")}
          className={cn(
            "px-6 py-2.5 text-sm font-medium border-b-2 -mb-[2px] transition-all",
            activeTab === "irregular"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {t.vocabulary.tabIrregular}
        </button>
        <button
          onClick={() => setActiveTab("spelling")}
          className={cn(
            "px-6 py-2.5 text-sm font-medium border-b-2 -mb-[2px] transition-all",
            activeTab === "spelling"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {locale === "uz" ? "Imlo diktanti" : locale === "en" ? "Spelling Dictation" : "Спеллинг-диктант"}
        </button>
      </div>

      {/* Tab 1: Dictionary & Translator */}
      {activeTab === "dictionary" && (
        <div className="space-y-8">
          <TranslationPanel
            key={locale}
            defaultSource={pair.source}
            defaultTarget={pair.target}
            onSaved={refreshWords}
          />

          <section className="space-y-4">
            <h2 className="font-heading text-xl font-semibold">{t.vocabulary.translator.myWords}</h2>
            {words.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
                {t.vocabulary.empty}
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {words.map((uw) => (
                  <Card key={uw.id} className="transition-colors hover:border-primary/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-lg">{uw.word.word}</CardTitle>
                        <Badge variant="secondary">{uw.masteryStatus}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>
                        {uw.word.partOfSpeech} · {uw.word.cefrLevel}
                      </p>
                      <p className="mt-1 text-foreground whitespace-pre-wrap">{uw.word.definition}</p>
                      {uw.word.exampleSentence && (
                        <p className="mt-1 italic">&ldquo;{uw.word.exampleSentence}&rdquo;</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Tab 2: Irregular Verbs */}
      {activeTab === "irregular" && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.vocabulary.irregularSearchPlaceholder}
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Scrollable table container */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">{t.vocabulary.irregularFormV1}</th>
                    <th className="px-4 py-3 font-semibold">{t.vocabulary.irregularFormV2}</th>
                    <th className="px-4 py-3 font-semibold">{t.vocabulary.irregularFormV3}</th>
                    <th className="px-4 py-3 font-semibold">{t.vocabulary.irregularTranslation}</th>
                    <th className="px-4 py-3 font-semibold w-16 text-center">Аудио</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredVerbs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        Ничего не найдено
                      </td>
                    </tr>
                  ) : (
                    filteredVerbs.map((item, index) => {
                      const trans = item.translation[locale as "ru" | "uz" | "en"] || item.translation.ru;
                      return (
                        <tr key={index} className="group/row hover:bg-muted/10 transition-colors">
                          {/* V1 form */}
                          <td className="px-4 py-3">
                            <button
                              onClick={() => speakSingle(item.v1)}
                              className="flex flex-col items-start gap-0.5 hover:text-primary transition-colors text-left group/btn"
                              title="Нажмите, чтобы прослушать V1"
                            >
                              <span className="font-semibold text-foreground group-hover/btn:underline">{item.v1}</span>
                              <span className="text-xs text-muted-foreground/70 font-normal font-sans">{item.v1Phonetic}</span>
                            </button>
                          </td>
                          {/* V2 form */}
                          <td className="px-4 py-3">
                            <button
                              onClick={() => speakSingle(item.v2)}
                              className="flex flex-col items-start gap-0.5 hover:text-primary transition-colors text-left group/btn"
                              title="Нажмите, чтобы прослушать V2"
                            >
                              <span className="font-semibold text-foreground group-hover/btn:underline">{item.v2}</span>
                              <span className="text-xs text-muted-foreground/70 font-normal font-sans">{item.v2Phonetic}</span>
                            </button>
                          </td>
                          {/* V3 form */}
                          <td className="px-4 py-3">
                            <button
                              onClick={() => speakSingle(item.v3)}
                              className="flex flex-col items-start gap-0.5 hover:text-primary transition-colors text-left group/btn"
                              title="Нажмите, чтобы прослушать V3"
                            >
                              <span className="font-semibold text-foreground group-hover/btn:underline">{item.v3}</span>
                              <span className="text-xs text-muted-foreground/70 font-normal font-sans">{item.v3Phonetic}</span>
                            </button>
                          </td>
                          {/* Translation form */}
                          <td className="px-4 py-3 font-medium text-foreground">
                            {trans}
                          </td>
                          {/* Row Pronunciation action */}
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => speakAllForms(item.v1, item.v2, item.v3)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground"
                              title="Прослушать все 3 формы подряд"
                            >
                              <Volume2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "spelling" && (
        <div className="py-4">
          <SpellingDictation words={words} onComplete={refreshWords} />
        </div>
      )}
    </div>
  );
}

function SpellingDictation({ words, onComplete }: { words: VocabWord[]; onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionWords, setSessionWords] = useState<VocabWord[]>([]);
  const [finished, setFinished] = useState(false);
  const [xpClaimed, setXpClaimed] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;
    const shuffled = [...words].sort(() => 0.5 - Math.random()).slice(0, 5);
    setSessionWords(shuffled);
  }, [words]);

  const currentWord = sessionWords[index];

  const speak = useCallback(() => {
    if (!currentWord || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const cleanWord = currentWord.word.word.replace(/\//g, " or ");
    const utterance = new SpeechSynthesisUtterance(cleanWord);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }, [currentWord]);

  useEffect(() => {
    if (currentWord) {
      speak();
    }
  }, [currentWord, speak]);

  const handleCheck = () => {
    if (!currentWord || checked) return;
    const isOk = input.trim().toLowerCase() === currentWord.word.word.trim().toLowerCase();
    setIsCorrect(isOk);
    setChecked(true);
    if (isOk) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setInput("");
    setChecked(false);
    setIsCorrect(false);
    if (index >= sessionWords.length - 1) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const claimXp = async () => {
    if (xpClaimed || score === 0) return;
    setXpClaimed(true);
    try {
      await fetch("/api/user/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp: 10, activity: `Словарный диктант: 5 слов` }),
      });
    } catch {}
    onComplete();
  };

  if (words.length === 0) {
    return (
      <Card className="text-center p-8 border-dashed max-w-md mx-auto">
        <p className="text-muted-foreground text-sm">
          Ваш словарь пуст. Сохраните хотя бы одно английское слово в переводчике (вкладка «Словарь»), чтобы начать диктант.
        </p>
      </Card>
    );
  }

  if (sessionWords.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    );
  }

  if (finished) {
    return (
      <Card className="max-w-md mx-auto text-center p-6 border-primary/20 bg-gradient-to-br from-primary/5 via-card/10 to-transparent">
        <h3 className="font-heading text-2xl font-bold text-primary">Диктант завершен!</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Ваш результат: <strong className="text-foreground">{score}</strong> из {sessionWords.length} правильных слов.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {score > 0 && !xpClaimed ? (
            <Button onClick={claimXp} className="w-full gap-2">
              <Zap className="h-4 w-4 fill-current" /> Зачислить +10 XP
            </Button>
          ) : (
            <Button onClick={() => {
              setIndex(0);
              setInput("");
              setChecked(false);
              setIsCorrect(false);
              setScore(0);
              setFinished(false);
              setXpClaimed(false);
              const shuffled = [...words].sort(() => 0.5 - Math.random()).slice(0, 5);
              setSessionWords(shuffled);
            }} className="w-full">
              Пройти еще раз
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto border-border/50 bg-card/65 backdrop-blur-sm">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Слово {index + 1} из {sessionWords.length}
          </span>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            Верно: {score}
          </span>
        </div>

        <div className="flex flex-col items-center gap-4 py-4">
          <Button
            size="lg"
            variant="outline"
            onClick={speak}
            className="h-16 w-16 rounded-full border-primary/20 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all flex items-center justify-center"
          >
            <Volume2 className="h-6 w-6 text-primary" />
          </Button>
          <span className="text-xs text-muted-foreground">Нажмите для прослушивания слова</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground font-medium">Введите английское слово:</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={checked}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (checked) handleNext();
                  else handleCheck();
                }
              }}
              placeholder="Сюда..."
              className="mt-1 h-11 w-full rounded-xl border border-border/60 bg-background/50 px-4 text-center text-lg outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/15 transition-all font-mono tracking-wide"
            />
          </div>

          {checked && (
            <div className={cn(
              "rounded-xl p-3 text-center text-sm flex items-center justify-center gap-2",
              isCorrect ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"
            )}>
              {isCorrect ? (
                <span>Отлично! Верно.</span>
              ) : (
                <span>Неверно. Правильно: <strong className="font-mono text-base font-bold underline">{currentWord.word.word}</strong></span>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {!checked ? (
              <Button onClick={handleCheck} disabled={!input.trim()} className="w-full h-11">
                Проверить
              </Button>
            ) : (
              <Button onClick={handleNext} className="w-full h-11">
                {index === sessionWords.length - 1 ? "Завершить" : "Следующее слово"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

