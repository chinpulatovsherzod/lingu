"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Sparkles, Headphones, Play, Pause, RotateCcw, Volume2, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Question = {
  id: string;
  type: "blank" | "choice";
  question: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
};

type ListeningTest = {
  title: string;
  section: number;
  audioScript: string;
  audioParagraphs: string[];
  questions: Question[];
};

export default function IeltsListeningPage() {
  const [section, setSection] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [test, setTest] = useState<ListeningTest | null>(null);
  
  // Game state
  const [phase, setPhase] = useState<"setup" | "playing" | "results">("setup");
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [xpClaimed, setXpClaimed] = useState(false);

  // Audio simulation state
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentLineIdx, setCurrentLineIdx] = useState(-1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Load voices for speech synthesis
  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      voicesRef.current = allVoices;
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const generateTest = async () => {
    setLoading(true);
    setTest(null);
    try {
      const res = await fetch("/api/ielts/listening/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section }),
      });
      if (res.ok) {
        const data = await res.json();
        setTest(data);
        setUserAnswers({});
        setChecked(false);
        setScore(0);
        setXpClaimed(false);
        setAudioPlaying(false);
        setCurrentLineIdx(-1);
        setPhase("playing");
      } else {
        alert("Не удалось сгенерировать тест. Пожалуйста, попробуйте снова.");
      }
    } catch {
      alert("Ошибка подключения к серверу.");
    } finally {
      setLoading(false);
    }
  };

  // Dialogue voicing engine
  const speakLine = useCallback((index: number) => {
    if (!test || typeof window === "undefined" || index >= test.audioParagraphs.length) {
      setAudioPlaying(false);
      setCurrentLineIdx(-1);
      return;
    }

    setCurrentLineIdx(index);
    const line = test.audioParagraphs[index];
    
    // Parse speaker name if exists (e.g. "Clerk: Good morning" or "Customer: Hi")
    let speaker = "Speaker";
    let textToSpeak = line;
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      speaker = match[1];
      textToSpeak = match[2];
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "en-US";
    utterance.rate = 0.85; // Natural speed for IELTS

    // Alternate voices if possible
    const enVoices = voicesRef.current.filter((v) => v.lang.startsWith("en"));
    if (enVoices.length > 1) {
      // Pick voice based on hash of speaker name
      const hash = speaker.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      utterance.voice = enVoices[hash % enVoices.length];
    } else if (enVoices.length === 1) {
      utterance.voice = enVoices[0];
    }

    utterance.onend = () => {
      if (audioPlaying) {
        speakLine(index + 1);
      }
    };

    utterance.onerror = () => {
      setAudioPlaying(false);
      setCurrentLineIdx(-1);
    };

    window.speechSynthesis.speak(utterance);
  }, [test, audioPlaying]);

  // Handle Play / Pause
  const togglePlay = () => {
    if (audioPlaying) {
      window.speechSynthesis.cancel();
      setAudioPlaying(false);
    } else {
      setAudioPlaying(true);
      speakLine(currentLineIdx === -1 ? 0 : currentLineIdx);
    }
  };

  // Sync state when audioPlaying toggle occurs
  useEffect(() => {
    if (audioPlaying && currentLineIdx !== -1) {
      speakLine(currentLineIdx);
    }
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [audioPlaying, speakLine]);

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setAudioPlaying(false);
    setCurrentLineIdx(-1);
  };

  const handleInputChange = (id: string, val: string) => {
    setUserAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const submitAnswers = () => {
    if (!test) return;
    stopAudio();
    let correctCount = 0;
    test.questions.forEach((q) => {
      const userAns = (userAnswers[q.id] || "").trim().toLowerCase();
      const correctAns = q.correctAnswer.trim().toLowerCase();
      if (userAns === correctAns) {
        correctCount += 1;
      }
    });
    setScore(correctCount);
    setChecked(true);
    setPhase("results");
  };

  const claimXp = async () => {
    if (xpClaimed || score === 0) return;
    setXpClaimed(true);
    const xpAmount = score * 6; // up to 30 XP max for 5 questions
    try {
      await fetch("/api/user/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp: xpAmount, activity: `IELTS Listening: ${test?.title || "Test"}` }),
      });
    } catch {}
    setPhase("setup");
    setTest(null);
  };

  const formatAudioScript = (script: string) => {
    // Replace answer markers like [1], [2] with highlighted badges
    return script.split("\n").map((line, idx) => {
      let content = line;
      // Regex to find all [number] markers
      const matches = line.match(/\[\d+\]/g);
      if (matches) {
        return (
          <p key={idx} className="leading-relaxed mb-2">
            {content.split(/(\[\d+\])/g).map((part, pIdx) => {
              const markerMatch = part.match(/^\[(\d+)\]$/);
              if (markerMatch) {
                const num = markerMatch[1];
                return (
                  <span key={pIdx} className="bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-500/40 rounded px-1.5 py-0.5 mx-1 text-xs">
                    Ответ {num}
                  </span>
                );
              }
              return part;
            })}
          </p>
        );
      }
      return <p key={idx} className="leading-relaxed mb-2">{line}</p>;
    });
  };

  const getBandScore = (correct: number) => {
    if (correct === 5) return 9.0;
    if (correct === 4) return 7.5;
    if (correct === 3) return 6.0;
    if (correct === 2) return 4.5;
    if (correct === 1) return 3.0;
    return 1.0;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in pb-12">
      {/* Back to dashboard */}
      <Link href="/ielts" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "inline-flex w-fit")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        К разделу IELTS
      </Link>

      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
          <Headphones className="h-7 w-7 text-primary" />
          IELTS Listening Arena
        </h1>
        <p className="text-muted-foreground text-sm">
          Подготовка и тренировка аудирования с озвучиванием диалогов по ролям.
        </p>
      </div>

      {phase === "setup" && !loading && (
        <Card className="border-border/60 bg-card/50 backdrop-blur-sm max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Настройки тренировки</CardTitle>
            <CardDescription>Выберите секцию IELTS Listening для тренировки:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                { sec: 1, label: "Секция 1", desc: "Социальный диалог" },
                { sec: 2, label: "Секция 2", desc: "Социальный монолог" },
                { sec: 3, label: "Секция 3", desc: "Учебный диалог" },
                { sec: 4, label: "Секция 4", desc: "Академическая лекция" },
              ].map((item) => (
                <button
                  key={item.sec}
                  onClick={() => setSection(item.sec)}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-xl border transition-all text-left space-y-1 active:scale-[0.98]",
                    section === item.sec
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                      : "border-border/60 bg-background/50 hover:bg-muted/30"
                  )}
                >
                  <span className="font-bold text-sm text-foreground">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                </button>
              ))}
            </div>

            <Button size="lg" className="w-full gap-2" onClick={generateTest}>
              Начать
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card className="p-12 text-center flex flex-col items-center justify-center space-y-6 border-primary/20 bg-card/65 backdrop-blur-sm min-h-[300px] max-w-lg mx-auto">
          <div className="relative flex items-center justify-center h-20 w-20">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <Headphones className="absolute h-6 w-6 text-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-lg font-bold text-foreground">Подготовка материалов</h3>
            <p className="text-sm text-muted-foreground max-w-xs font-medium animate-pulse">
              Формирование вопросов, подготовка аудиодорожки и бланков ответов...
            </p>
          </div>
        </Card>
      )}

      {test && phase === "playing" && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Side: Audio Player Control & Script info */}
          <div className="md:col-span-1 space-y-4">
            <Card className="border-primary/20 bg-gradient-to-b from-primary/10 via-card/15 to-transparent p-5 space-y-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Секция {test.section}</span>
              <h3 className="font-heading text-lg font-bold leading-snug">{test.title}</h3>
              
              <div className="flex flex-col items-center gap-3 py-4">
                <Button
                  size="lg"
                  onClick={togglePlay}
                  className="h-16 w-16 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center transition-all duration-300"
                >
                  {audioPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
                </Button>
                <span className="text-xs text-muted-foreground font-semibold">
                  {audioPlaying ? "Прослушивание..." : "Нажмите для воспроизведения"}
                </span>
              </div>

              {audioPlaying && currentLineIdx !== -1 && (
                <div className="rounded-xl bg-card/50 p-3 border border-border/40 text-left space-y-1 animate-pulse">
                  <span className="text-[10px] text-primary uppercase font-bold">Озвучивается строка:</span>
                  <p className="text-xs text-foreground italic line-clamp-3">
                    {test.audioParagraphs[currentLineIdx]}
                  </p>
                </div>
              )}

              <Button variant="outline" size="sm" onClick={stopAudio} className="w-full gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" /> Сбросить аудио
              </Button>
            </Card>
          </div>

          {/* Right Side: Questions Blanks */}
          <div className="md:col-span-2 space-y-4">
            <Card className="border-border/60 bg-card/65 backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-border/20">
                <CardTitle className="text-base">Бланк ответов (Ответьте на 5 вопросов)</CardTitle>
                <CardDescription>
                  Внимательно слушайте аудио и заполняйте пропуски или выбирайте правильные варианты ответов.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {test.questions.map((q, qIdx) => (
                  <div key={q.id} className="space-y-2">
                    <p className="text-sm font-bold text-foreground">{q.question}</p>
                    
                    {q.type === "blank" ? (
                      <input
                        type="text"
                        value={userAnswers[q.id] || ""}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        placeholder="Напишите ответ..."
                        className="h-10 w-full md:w-80 rounded-lg border border-border/60 bg-background/50 px-3 text-sm outline-none focus:border-primary transition-all"
                      />
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {q.options?.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleInputChange(q.id, opt)}
                            className={cn(
                              "text-xs font-semibold p-2.5 rounded-lg border text-left transition-all active:scale-[0.98]",
                              userAnswers[q.id] === opt
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border/60 bg-background/50 hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <Button size="lg" className="w-full mt-4" onClick={submitAnswers}>
                  Завершить и проверить
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {test && phase === "results" && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Result Card: Score */}
          <div className="md:col-span-1 space-y-4">
            <Card className="text-center p-6 border-primary/30 bg-gradient-to-b from-primary/10 via-card/15 to-transparent shadow-lg shadow-primary/5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Итог теста</span>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/30 shadow-inner shadow-primary/10">
                  <span className="font-heading text-4xl font-black text-primary">
                    {getBandScore(score).toFixed(1)}
                  </span>
                  <div className="absolute inset-0 rounded-full border border-primary/10 animate-ping opacity-25" />
                </div>
                <span className="text-xs text-muted-foreground mt-3 font-semibold">IELTS Listening Band Score</span>
                <span className="text-xs font-medium text-foreground mt-1">
                  Верно: {score} из {test.questions.length}
                </span>
              </div>
              
              {score > 0 && !xpClaimed ? (
                <Button onClick={claimXp} className="w-full gap-2">
                  <Zap className="h-4 w-4 fill-current" /> Забрать +{score * 6} XP
                </Button>
              ) : (
                <Button onClick={() => setPhase("setup")} className="w-full">
                  Пройти другой тест
                </Button>
              )}
            </Card>
          </div>

          {/* Breakdown & Transcript */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-border/50 bg-card/65 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  Анализ ваших ответов
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {test.questions.map((q) => {
                  const isCorrect = (userAnswers[q.id] || "").trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                  return (
                    <div key={q.id} className="p-3.5 rounded-xl border border-border/30 bg-background/30 text-xs space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-foreground leading-normal">{q.question}</p>
                        {isCorrect ? (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">Верно</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">Ошибка</Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground space-y-0.5 font-medium">
                        <p>Ваш ответ: <span className={isCorrect ? "text-emerald-400" : "text-red-400 font-bold"}>{userAnswers[q.id] || "—"}</span></p>
                        {!isCorrect && <p>Правильный ответ: <span className="text-emerald-400 font-bold font-mono">{q.correctAnswer}</span></p>}
                        <p className="text-[11px] text-primary italic mt-1 leading-relaxed">
                          Почему так: {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/65 backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-border/20">
                <CardTitle className="text-base flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-primary" />
                  Транскрипт записи (Audio Script)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-sm text-foreground leading-relaxed font-sans max-h-72 overflow-y-auto">
                {formatAudioScript(test.audioScript)}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
