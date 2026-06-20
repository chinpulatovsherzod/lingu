import { auth } from "@/lib/auth";
import { getVocabularyForUser } from "@/lib/data";
import { WordMatchGame } from "@/components/practice/word-match";
import { SpeedCardsGame } from "@/components/practice/speed-cards";
import { SentenceBuilderGame } from "@/components/practice/sentence-builder";
import { CrosswordGame } from "@/components/practice/crossword";
import { ReportedSpeechGame } from "@/components/practice/reported-speech-game";
import { GrammarTenseArena } from "@/components/practice/grammar-tense-arena";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Shuffle, Gauge, Lock, Sparkles, LayoutGrid, Quote, Timer } from "lucide-react";
import Link from "next/link";

export default async function PracticePage({
  searchParams,
}: {
  searchParams: { game?: string };
}) {
  const session = await auth();
  const userId = session!.user!.id;
  const userWords = await getVocabularyForUser(userId);

  const activeGame = searchParams.game;

  if (activeGame === "word-match") {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/practice"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1 mb-2"
          >
            ← Вернуться к тренажёрам
          </Link>
          <h1 className="font-heading text-3xl font-bold">Игровые тренажёры</h1>
          <p className="text-muted-foreground">Игры и тренировки для закрепления лексики и грамматики</p>
        </div>

        <WordMatchGame userWords={userWords} />
      </div>
    );
  }

  if (activeGame === "speed-cards") {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/practice"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1 mb-2"
          >
            ← Вернуться к тренажёрам
          </Link>
          <h1 className="font-heading text-3xl font-bold">Игровые тренажёры</h1>
          <p className="text-muted-foreground">Игры и тренировки для закрепления лексики и грамматики</p>
        </div>

        <SpeedCardsGame userWords={userWords} />
      </div>
    );
  }

  if (activeGame === "sentence-builder") {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/practice"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1 mb-2"
          >
            ← Вернуться к тренажёрам
          </Link>
          <h1 className="font-heading text-3xl font-bold">Игровые тренажёры</h1>
          <p className="text-muted-foreground">Игры и тренировки для закрепления лексики и грамматики</p>
        </div>

        <SentenceBuilderGame userWords={userWords} />
      </div>
    );
  }

  if (activeGame === "crossword") {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/practice"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1 mb-2"
          >
            ← Вернуться к тренажёрам
          </Link>
          <h1 className="font-heading text-3xl font-bold">Игровые тренажёры</h1>
          <p className="text-muted-foreground">Игры и тренировки для закрепления лексики и грамматики</p>
        </div>

        <CrosswordGame />
      </div>
    );
  }

  if (activeGame === "reported-speech-game") {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/practice"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1 mb-2"
          >
            ← Вернуться к тренажёрам
          </Link>
          <h1 className="font-heading text-3xl font-bold">Игровые тренажёры</h1>
          <p className="text-muted-foreground">Игры и тренировки для закрепления лексики и грамматики</p>
        </div>

        <ReportedSpeechGame />
      </div>
    );
  }
  if (activeGame === "tense-arena") {
    return (
      <div className="space-y-6">
        <GrammarTenseArena />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Игровые тренажёры</h1>
        <p className="text-muted-foreground">Интерактивные тренировки для закрепления лексики и грамматики без лишнего стресса</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Word Match Game Card */}
        <Card className="group relative overflow-hidden border-border bg-card/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Gamepad2 className="h-24 w-24 text-primary" />
          </div>
          <CardHeader className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <CardTitle className="font-heading text-xl font-bold flex items-center gap-2">
              Найди пару (Word Match)
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600">Доступно</span>
            </CardTitle>
            <CardDescription>
              Карточки для сопоставления английских слов и их переводов из вашего личного словаря.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="text-xs space-y-1 text-muted-foreground">
              <div className="flex justify-between">
                <span>Материал:</span>
                <span className="text-foreground font-medium">Ваш словарь (минимум 4 слова)</span>
              </div>
              <div className="flex justify-between">
                <span>Награда:</span>
                <span className="text-accent font-semibold flex items-center gap-0.5">
                  <Sparkles className="h-3 w-3" /> +15 XP
                </span>
              </div>
            </div>
            <Link
              href="/practice?game=word-match"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/95 hover:shadow-md"
            >
              Играть
            </Link>
          </CardContent>
        </Card>

        {/* Sentence Builder Game Card */}
        <Card className="group relative overflow-hidden border-border bg-card/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Shuffle className="h-24 w-24 text-primary" />
          </div>
          <CardHeader className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
              <Shuffle className="h-6 w-6" />
            </div>
            <CardTitle className="font-heading text-xl font-bold flex items-center gap-2">
              Конструктор фраз
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600">Доступно</span>
            </CardTitle>
            <CardDescription>
              Соберите правильное английское предложение из разбросанных слов-блоков по правилам грамматики.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="text-xs space-y-1 text-muted-foreground">
              <div className="flex justify-between">
                <span>Материал:</span>
                <span className="text-foreground font-medium">Грамматические правила и словарь</span>
              </div>
              <div className="flex justify-between">
                <span>Награда:</span>
                <span className="text-accent font-semibold flex items-center gap-0.5">
                  <Sparkles className="h-3 w-3" /> +20 XP
                </span>
              </div>
            </div>
            <Link
              href="/practice?game=sentence-builder"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/95 hover:shadow-md"
            >
              Играть
            </Link>
          </CardContent>
        </Card>

        {/* Speed Cards Game Card */}
        <Card className="group relative overflow-hidden border-border bg-card/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Gauge className="h-24 w-24 text-primary" />
          </div>
          <CardHeader className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
              <Gauge className="h-6 w-6" />
            </div>
            <CardTitle className="font-heading text-xl font-bold flex items-center gap-2">
              Быстрые карты (Speed Cards)
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600">Доступно</span>
            </CardTitle>
            <CardDescription>
              Вспоминайте переводы слов на время. Отвечайте быстро, чтобы накопить стрик и умножить опыт.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="text-xs space-y-1 text-muted-foreground">
              <div className="flex justify-between">
                <span>Материал:</span>
                <span className="text-foreground font-medium">Словарь на время</span>
              </div>
              <div className="flex justify-between">
                <span>Награда:</span>
                <span className="text-accent font-semibold flex items-center gap-0.5">
                  <Sparkles className="h-3 w-3" /> до +30 XP
                </span>
              </div>
            </div>
            <Link
              href="/practice?game=speed-cards"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/95 hover:shadow-md"
            >
              Играть
            </Link>
          </CardContent>
        </Card>

        {/* Crossword Game Card */}
        <Card className="group relative overflow-hidden border-border bg-card/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <LayoutGrid className="h-24 w-24 text-primary" />
          </div>
          <CardHeader className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
              <LayoutGrid className="h-6 w-6" />
            </div>
            <CardTitle className="font-heading text-xl font-bold flex items-center gap-2">
              Кроссворд (Crossword)
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600">Доступно</span>
            </CardTitle>
            <CardDescription>
              Разгадывайте кроссворды по уровням сложности, чтобы закрепить написание и перевод слов.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="text-xs space-y-1 text-muted-foreground">
              <div className="flex justify-between">
                <span>Материал:</span>
                <span className="text-foreground font-medium">Лексика B1, B2, C1</span>
              </div>
              <div className="flex justify-between">
                <span>Награда:</span>
                <span className="text-accent font-semibold flex items-center gap-0.5">
                  <Sparkles className="h-3 w-3" /> +30 XP
                </span>
              </div>
            </div>
            <Link
              href="/practice?game=crossword"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/95 hover:shadow-md"
            >
              Играть
            </Link>
          </CardContent>
        </Card>

        {/* Reported Speech Game Card */}
        <Card className="group relative overflow-hidden border-border bg-card/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Quote className="h-24 w-24 text-primary animate-pulse" />
          </div>
          <CardHeader className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
              <Quote className="h-6 w-6" />
            </div>
            <CardTitle className="font-heading text-xl font-bold flex items-center gap-2">
              Эхо-репортер (Reported Speech)
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600">Доступно</span>
            </CardTitle>
            <CardDescription>
              Преобразуйте прямую речь персонажей в косвенную, выбирая правильные формы глаголов и местоимений.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="text-xs space-y-1 text-muted-foreground">
              <div className="flex justify-between">
                <span>Материал:</span>
                <span className="text-foreground font-medium">Косвенная речь (he asked, he said)</span>
              </div>
              <div className="flex justify-between">
                <span>Награда:</span>
                <span className="text-accent font-semibold flex items-center gap-0.5">
                  <Sparkles className="h-3 w-3" /> +25 XP
                </span>
              </div>
            </div>
            <Link
              href="/practice?game=reported-speech-game"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/95 hover:shadow-md"
            >
              Играть
            </Link>
          </CardContent>
        </Card>

        {/* Grammar Tense Arena Game Card */}
        <Card className="group relative overflow-hidden border-border bg-card/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Timer className="h-24 w-24 text-primary" />
          </div>
          <CardHeader className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
              <Timer className="h-6 w-6" />
            </div>
            <CardTitle className="font-heading text-xl font-bold flex items-center gap-2">
              Битва Времен (Tense Arena)
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600">Доступно</span>
            </CardTitle>
            <CardDescription>
              Динамичная игра на время! Сопоставляйте маркеры времени с видовременными формами глаголов.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="text-xs space-y-1 text-muted-foreground">
              <div className="flex justify-between">
                <span>Материал:</span>
                <span className="text-foreground font-medium">Present, Past & Perfect Tenses</span>
              </div>
              <div className="flex justify-between">
                <span>Награда:</span>
                <span className="text-accent font-semibold flex items-center gap-0.5">
                  <Sparkles className="h-3 w-3" /> до +35 XP
                </span>
              </div>
            </div>
            <Link
              href="/practice?game=tense-arena"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/95 hover:shadow-md"
            >
              Играть
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
