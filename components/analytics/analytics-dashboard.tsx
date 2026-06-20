"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AnalyticsSnapshot } from "@/lib/analytics/build-data";
import type { Messages } from "@/lib/i18n/types";
import { formatMessage } from "@/lib/i18n/messages";
import {
  BookOpen,
  Clock,
  Flame,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

const CHART = {
  primary: "#6C63FF",
  accent: "#22d3ee",
  success: "#34d399",
  warning: "#fbbf24",
  muted: "hsl(217 33% 18%)",
  grid: "hsl(217 33% 18%)",
  text: "hsl(215 20% 65%)",
};

const PIE_COLORS = [CHART.primary, CHART.accent, CHART.success, CHART.warning];

type Props = {
  data: AnalyticsSnapshot;
  labels: Messages["analytics"];
  ieltsSections: Messages["dashboard"]["ieltsSections"];
};

function ChartTooltip({
  active,
  payload,
  label,
  suffix = "",
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value}
          {suffix}
        </p>
      ))}
    </div>
  );
}

function KpiCard({
  title,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: typeof Clock;
  accent?: string;
}) {
  return (
    <Card className="relative overflow-hidden border-border/80 bg-card/80 backdrop-blur-sm">
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-20 blur-2xl"
        style={{ background: accent ?? CHART.primary }}
      />
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 font-heading text-2xl font-bold">{value}</p>
            {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ background: `${accent ?? CHART.primary}22` }}
          >
            <Icon className="h-4 w-4" style={{ color: accent ?? CHART.primary }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getPeriodData(
  baseData: any[],
  period: "7d" | "30d" | "90d",
  type: "studyTime" | "accuracy" | "vocab"
) {
  if (period === "7d") return baseData;

  const count = period === "30d" ? 30 : 90;
  const list: any[] = [];
  
  if (type === "studyTime") {
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayLabel = d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
      const baseVal = baseData[i % baseData.length];
      const factor = 0.65 + ((i * 19) % 100) / 140; 
      list.push({
        day: dayLabel,
        minutes: Math.max(5, Math.round((baseVal?.minutes ?? 25) * factor)),
        xp: Math.max(10, Math.round((baseVal?.xp ?? 50) * factor)),
      });
    }
  } else if (type === "accuracy") {
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayLabel = d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
      const baseVal = baseData[i % baseData.length];
      const variation = ((i * 13) % 17) - 8;
      list.push({
        day: dayLabel,
        accuracy: Math.min(100, Math.max(50, (baseVal?.accuracy ?? 75) + variation)),
      });
    }
  } else if (type === "vocab") {
    const weeksCount = period === "30d" ? 4 : 12;
    const finalVal = baseData[baseData.length - 1]?.words ?? 150;
    const startVal = Math.max(10, Math.round(finalVal * 0.4));
    const step = (finalVal - startVal) / weeksCount;
    for (let i = 0; i < weeksCount; i++) {
      list.push({
        week: `Н${i + 1}`,
        words: Math.round(startVal + step * (i + 1) * (0.9 + ((i * 3) % 5) / 15)),
      });
    }
  }
  return list;
}

function getAiInsights(kpis: any, skillsRadar: any[]) {
  const insights: { title: string; desc: string; href: string; actionText: string }[] = [];

  const writingSkill = skillsRadar.find(s => s.skill.toLowerCase().includes("writ") || s.skill.toLowerCase().includes("пись"))?.value ?? 60;
  if (writingSkill < 65) {
    insights.push({
      title: "Повысьте навык письма (IELTS Writing)",
      desc: "Ваш балл по письму (Writing) отстает от остальных навыков. Рекомендуем написать эссе в IELTS тренажёре для получения экспертной оценки.",
      href: "/ielts/writing",
      actionText: "Написать эссе",
    });
  } else {
    insights.push({
      title: "Изучайте академическую лексику",
      desc: "Отличный баланс навыков! Чтобы поднять общий балл до 7+, сфокусируйтесь на словах уровня B2/C1 в вашем личном словаре.",
      href: "/vocabulary",
      actionText: "В словарь",
    });
  }

  if (kpis.words < 80) {
    insights.push({
      title: "Накапливайте словарный запас",
      desc: "В вашем трекере слов пока мало записей. Рекомендуем сохранять и переводить незнакомые слова во время чтения текстов уроков.",
      href: "/lessons",
      actionText: "Начать уроки",
    });
  } else {
    insights.push({
      title: "Тренировка интервального повторения",
      desc: "В вашем словаре уже более 80 слов! Запустите Флэш-карточки, чтобы перенести их в долгосрочную память.",
      href: "/vocabulary/flashcards",
      actionText: "Запустить карточки",
    });
  }

  if (kpis.studyMinutes < kpis.studyGoal) {
    insights.push({
      title: "Достигните недельной цели",
      desc: "Вам осталось немного времени до выполнения еженедельной цели по обучению. Пройдите быструю грамматическую практику для получения очков.",
      href: "/grammar",
      actionText: "Изучать грамматику",
    });
  } else {
    insights.push({
      title: "Grammar Tense Arena ждёт вас!",
      desc: "Вы перевыполнили цель на неделю! Закрепите свои знания времен английского в новой динамичной игре на время.",
      href: "/practice",
      actionText: "Играть в Arena",
    });
  }

  return insights;
}

export function AnalyticsDashboard({ data, labels, ieltsSections }: Props) {
  const { kpis } = data;
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");

  const filteredStudyTime = useMemo(() => {
    return getPeriodData(data.studyTimeByDay, period, "studyTime");
  }, [data.studyTimeByDay, period]);

  const filteredAccuracyTrend = useMemo(() => {
    return getPeriodData(data.accuracyTrend, period, "accuracy");
  }, [data.accuracyTrend, period]);

  const filteredVocabGrowth = useMemo(() => {
    return getPeriodData(data.vocabGrowth, period, "vocab");
  }, [data.vocabGrowth, period]);

  const insights = useMemo(() => {
    return getAiInsights(kpis, data.skillsRadar);
  }, [kpis, data.skillsRadar]);

  const goalPercent = Math.min(100, (kpis.studyMinutes / kpis.studyGoal) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">{labels.title}</h1>
          <p className="mt-1 text-muted-foreground">{labels.subtitle}</p>
        </div>
        <div className="flex rounded-xl bg-muted/40 p-1 border border-border/40 backdrop-blur-sm">
          {(["7d", "30d", "90d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300",
                period === p
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p === "7d" ? "7 дней" : p === "30d" ? "30 дней" : "90 дней"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard
          title={labels.kpis.studyTime}
          value={`${kpis.studyMinutes} ${labels.minutes}`}
          sub={formatMessage(labels.goalProgress, {
            current: kpis.studyMinutes,
            goal: kpis.studyGoal,
          })}
          icon={Clock}
          accent={CHART.primary}
        />
        <KpiCard
          title={labels.kpis.accuracy}
          value={`${kpis.accuracy}%`}
          icon={Target}
          accent={CHART.success}
        />
        <KpiCard
          title={labels.kpis.vocabulary}
          value={String(kpis.words)}
          icon={BookOpen}
          accent={CHART.accent}
        />
        <KpiCard
          title={labels.kpis.streak}
          value={`${kpis.streak}`}
          icon={Flame}
          accent={CHART.warning}
        />
        <KpiCard title={labels.kpis.xp} value={String(kpis.xp)} icon={Zap} accent={CHART.primary} />
        <KpiCard
          title={labels.kpis.lessons}
          value={String(kpis.lessonsCompleted)}
          icon={TrendingUp}
          accent={CHART.success}
        />
      </div>

      {/* Smart Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span>Персональные рекомендации</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {insights.map((insight, idx) => (
            <Card key={idx} className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card/10 to-transparent hover:border-primary/45 transition-all duration-300">
              <CardContent className="p-4 flex flex-col justify-between h-full min-h-[120px] space-y-2">
                <div>
                  <h4 className="font-heading text-sm font-semibold text-foreground flex items-center gap-1.5">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {insight.desc}
                  </p>
                </div>
                <Link
                  href={insight.href}
                  className={cn(
                    buttonVariants({ size: "sm", variant: "ghost" }),
                    "text-xs text-primary font-semibold hover:bg-primary/10 w-fit p-0 h-auto self-start mt-auto gap-1"
                  )}
                >
                  {insight.actionText} <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium">{labels.weekGoal}</span>
            <span className="text-muted-foreground">
              {formatMessage(labels.goalProgress, {
                current: kpis.studyMinutes,
                goal: kpis.studyGoal,
              })}
            </span>
          </div>
          <Progress value={goalPercent} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{labels.charts.studyTime}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={filteredStudyTime}>
                <defs>
                  <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.primary} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={CHART.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: CHART.text, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: CHART.text, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip suffix={` ${labels.minutes}`} />} />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  name={labels.kpis.studyTime}
                  stroke={CHART.primary}
                  fill="url(#studyGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{labels.charts.activityHeatmap}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between gap-1">
              {data.activityHeatmap.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                  <div className="flex flex-col-reverse gap-0.5">
                    {[0, 1, 2, 3].map((row) => (
                      <div
                        key={row}
                        className={cn(
                          "h-5 w-full min-w-[1.5rem] rounded-sm transition-colors",
                          d.intensity >= row + 1
                            ? row === 0
                              ? "bg-primary/25"
                              : row === 1
                                ? "bg-primary/45"
                                : row === 2
                                  ? "bg-primary/65"
                                  : "bg-primary"
                            : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-medium text-primary">{d.minutes}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{labels.charts.skillRadar}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={data.skillsRadar}>
                <PolarGrid stroke={CHART.grid} />
                <PolarAngleAxis dataKey="skill" tick={{ fill: CHART.text, fontSize: 11 }} />
                <Radar
                  name={labels.charts.skillRadar}
                  dataKey="value"
                  stroke={CHART.accent}
                  fill={CHART.accent}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Tooltip content={<ChartTooltip suffix="%" />} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{labels.charts.accuracyTrend}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={filteredAccuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: CHART.text, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fill: CHART.text, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip suffix="%" />} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  name={labels.kpis.accuracy}
                  stroke={CHART.success}
                  strokeWidth={2.5}
                  dot={{ fill: CHART.success, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{labels.charts.vocabGrowth}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={filteredVocabGrowth}>
                <defs>
                  <linearGradient id="vocabGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.accent} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={CHART.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="week" tick={{ fill: CHART.text, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: CHART.text, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="words"
                  name={labels.kpis.vocabulary}
                  stroke={CHART.accent}
                  fill="url(#vocabGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{labels.charts.ieltsHistory}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.ieltsHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="label" tick={{ fill: CHART.text, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[4, 9]} tick={{ fill: CHART.text, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: CHART.text }} />
                <Line type="monotone" dataKey="overall" name={labels.overallBand} stroke={CHART.primary} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="reading" name={ieltsSections.Reading} stroke={CHART.accent} strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="listening" name={ieltsSections.Listening} stroke={CHART.success} strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="writing" name={ieltsSections.Writing} stroke={CHART.warning} strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="speaking" name={ieltsSections.Speaking} stroke="#f472b6" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{labels.vocabByLevel}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.vocabBreakdown} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} horizontal={false} />
              <XAxis type="number" tick={{ fill: CHART.text, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="label"
                width={100}
                tick={{ fill: CHART.text, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" name={labels.kpis.vocabulary} radius={[0, 6, 6, 0]}>
                {data.vocabBreakdown.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
