import { auth } from "@/lib/auth";

import { getDashboardData } from "@/lib/data";

import { StatCard } from "@/components/dashboard/stat-card";

import { VocabMasteryRing } from "@/components/dashboard/vocab-ring";

import { IeltsBandCard } from "@/components/dashboard/ielts-band-card";

import { SkillsGrid } from "@/components/dashboard/skills-grid";

import { ContinueLearningPanel } from "@/components/dashboard/continue-learning";

import { WeeklyActivityHeatmap } from "@/components/dashboard/activity-heatmap";

import { xpProgressInLevel } from "@/lib/xp";

import { isPgliteMode } from "@/lib/pglite";

import { formatMessage, getServerI18n } from "@/lib/i18n";

import { BookOpen, Target, Zap, Clock } from "lucide-react";



export default async function DashboardPage() {

  const { t } = await getServerI18n();

  const session = await auth();

  const userId = session!.user!.id;

  const {
    user,
    words,
    daily,
    inProgress,
    lastTest,
    skillsProgression,
    memoryStrength,
    readinessScore,
    masteryCounts
  } = await getDashboardData(userId);

  const displayName = user?.name?.trim() || session?.user?.name?.trim() || t.dashboard.studentFallback;



  const xp = xpProgressInLevel(user?.totalXp ?? 0);

  const weeklyMinutes = daily.reduce((s, d) => s + d.minutesStudied, 0);

  const sections = [

    { name: "Reading", band: (lastTest as { reading_band?: number })?.reading_band ?? (lastTest as { readingBand?: number })?.readingBand ?? 5.5 },

    { name: "Listening", band: (lastTest as { listening_band?: number })?.listening_band ?? (lastTest as { listeningBand?: number })?.listeningBand ?? 5.5 },

    { name: "Writing", band: (lastTest as { writing_band?: number })?.writing_band ?? (lastTest as { writingBand?: number })?.writingBand ?? 5.5 },

    { name: "Speaking", band: (lastTest as { speaking_band?: number })?.speaking_band ?? (lastTest as { speakingBand?: number })?.speakingBand ?? 5.5 },

  ];

  const overall =

    (lastTest as { overall_band?: number })?.overall_band ??

    (lastTest as { overallBand?: number })?.overallBand ??

    sections.reduce((s, x) => s + x.band, 0) / 4;



  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

  const activityDays = dayKeys.map((key, i) => {

    const d = daily[i];

    const mins = d?.minutesStudied ?? 0;

    const intensity = mins === 0 ? 0 : mins < 15 ? 1 : mins < 30 ? 2 : mins < 45 ? 3 : 4;

    return { label: t.dashboard.days[key], intensity };

  });



  const level = user?.englishLevel ?? "A1";



  const continueLessons = isPgliteMode()

    ? (inProgress as { lesson_id: string; title: string; type: string; cefr_level: string; current_step: number }[]).map(

        (p) => ({

          id: p.lesson_id,

          title: p.title,

          type: p.type,

          cefrLevel: p.cefr_level,

          progress: Math.min(95, p.current_step * 20),

        })

      )

    : (

        inProgress as {

          lessonId: string;

          lesson: { title: string; type: string; cefrLevel: string };

          currentStep: number;

        }[]

      ).map((p) => ({

        id: p.lessonId,

        title: p.lesson.title,

        type: p.lesson.type,

        cefrLevel: p.lesson.cefrLevel,

        progress: Math.min(95, p.currentStep * 20),

      }));



  return (

    <div className="space-y-8">

      <div>

        <h1 className="font-heading text-3xl font-bold">

          {formatMessage(t.dashboard.greeting, { name: displayName })}

        </h1>

        <p className="text-muted-foreground">

          {formatMessage(t.dashboard.levelLine, {

            cefr: level,

            level: String(xp.level),

            percent: String(Math.round(xp.percent)),

          })}

        </p>

      </div>



      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard title={t.dashboard.vocabulary} value={String(words)} subtitle={t.dashboard.vocabularySub} icon={BookOpen} />

        <StatCard title={t.dashboard.accuracy} value="78%" subtitle={t.dashboard.accuracySub} icon={Target} />

        <StatCard title={t.dashboard.totalXp} value={String(user?.totalXp ?? 0)} subtitle={`${t.dashboard.level} ${xp.level}`} icon={Zap} />

        <StatCard title={t.dashboard.studyTime} value={`${weeklyMinutes} ${t.dashboard.min}`} subtitle={t.dashboard.studyTimeSub} icon={Clock} />

      </div>



      <div className="grid gap-4 lg:grid-cols-3">

        <div className="lg:col-span-1">

          <VocabMasteryRing

            learned={words}

            memoryStrength={memoryStrength}

            breakdown={[

              { label: "Новые (New)", count: masteryCounts.NEW },

              { label: "Изучаемые (Learning)", count: masteryCounts.LEARNING },

              { label: "Освоенные (Mastered)", count: masteryCounts.MASTERED },

            ]}

          />

        </div>

        <div className="lg:col-span-1">

          <IeltsBandCard overall={overall} sections={sections} readinessScore={readinessScore} />

        </div>

        <div className="lg:col-span-1">

          <ContinueLearningPanel lessons={continueLessons} />

        </div>

      </div>



      <div>

        <h2 className="mb-4 font-heading text-xl font-semibold">{t.dashboard.skills}</h2>

        <SkillsGrid

          levels={skillsProgression}

        />

      </div>



      <WeeklyActivityHeatmap

        days={activityDays}

        weeklyMinutes={weeklyMinutes}

        weeklyGoal={user?.weeklyGoalMinutes ?? 150}

      />

    </div>

  );

}

