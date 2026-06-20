export type AnalyticsSnapshot = {
  kpis: {
    studyMinutes: number;
    studyGoal: number;
    accuracy: number;
    words: number;
    streak: number;
    xp: number;
    lessonsCompleted: number;
  };
  studyTimeByDay: { day: string; minutes: number; xp: number }[];
  skillsRadar: { skill: string; value: number }[];
  accuracyTrend: { day: string; accuracy: number }[];
  vocabGrowth: { week: string; words: number }[];
  ieltsHistory: {
    label: string;
    overall: number;
    reading: number;
    listening: number;
    writing: number;
    speaking: number;
  }[];
  activityHeatmap: { day: string; intensity: number; minutes: number }[];
  vocabBreakdown: { label: string; count: number }[];
};

function seed(userId: string, index: number): number {
  let h = 0;
  const s = `${userId}:${index}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

const LEVEL_OFFSET: Record<string, number> = {
  A1: 0,
  A2: 8,
  B1: 16,
  B2: 24,
  C1: 32,
  C2: 40,
};

function buildSyntheticDaily(
  userId: string,
  dayLabels: string[],
  weeklyGoal: number,
  totalXp: number
) {
  return dayLabels.map((day, i) => {
    const r = seed(userId, i);
    const minutes = Math.round((weeklyGoal / 7) * (0.3 + r * 1.1));
    const xp = Math.round((totalXp / 30) * (0.2 + r * 0.8));
    return { day, minutes: Math.min(120, minutes), xp: Math.max(5, xp) };
  });
}

export function buildAnalyticsSnapshot(input: {
  userId: string;
  dayLabels: string[];
  weekLabels: string[];
  skillLabels: Record<string, string>;
  vocabBreakdownLabels: Record<string, string>;
  totalXp: number;
  streak: number;
  weeklyGoal: number;
  englishLevel: string;
  wordCount: number;
  lessonsCompleted: number;
  daily: { minutesStudied: number; xpEarned?: number; wordsLearned?: number }[];
  ieltsTests: {
    takenAt: Date | string;
    overallBand?: number | null;
    readingBand?: number | null;
    listeningBand?: number | null;
    writingBand?: number | null;
    speakingBand?: number | null;
  }[];
  wordBreakdown?: { a1a2: number; b1b2: number; c1c2: number; ielts: number };
}): AnalyticsSnapshot {
  const levelBase = LEVEL_OFFSET[input.englishLevel] ?? 10;

  const synth = buildSyntheticDaily(input.userId, input.dayLabels, input.weeklyGoal, input.totalXp);
  const studyTimeByDay = input.dayLabels.map((day, i) => {
    if (input.daily.length > 0) {
      const row = input.daily[i];
      return {
        day,
        minutes: row?.minutesStudied ?? 0,
        xp: row?.xpEarned ?? 0,
      };
    }
    return synth[i];
  });

  const studyMinutes = studyTimeByDay.reduce((s, d) => s + d.minutes, 0);

  const accuracyTrend = input.dayLabels.map((day, i) => ({
    day,
    accuracy: Math.round(62 + levelBase * 0.4 + seed(input.userId, i + 20) * 22),
  }));
  const accuracy = Math.round(
    accuracyTrend.reduce((s, d) => s + d.accuracy, 0) / accuracyTrend.length
  );

  const skillKeys = ["reading", "listening", "speaking", "writing", "grammar", "vocabulary"] as const;
  const skillsRadar = skillKeys.map((key, i) => ({
    skill: input.skillLabels[key] ?? key,
    value: Math.round(45 + levelBase + seed(input.userId, i + 40) * 30),
  }));

  const vocabGrowth = input.weekLabels.map((week, i) => ({
    week,
    words: Math.max(0, Math.round(input.wordCount * ((i + 1) / input.weekLabels.length))),
  }));

  const ieltsHistory =
    input.ieltsTests.length > 0
      ? input.ieltsTests.slice(0, 6).reverse().map((t, i) => ({
          label: `T${i + 1}`,
          overall: t.overallBand ?? 5.5,
          reading: t.readingBand ?? 5.5,
          listening: t.listeningBand ?? 5.5,
          writing: t.writingBand ?? 5.5,
          speaking: t.speakingBand ?? 5.5,
        }))
      : [
          { label: "T1", overall: 5.0, reading: 5.0, listening: 5.0, writing: 4.5, speaking: 5.0 },
          { label: "T2", overall: 5.5, reading: 5.5, listening: 5.5, writing: 5.0, speaking: 5.5 },
          { label: "T3", overall: 6.0, reading: 6.0, listening: 5.5, writing: 5.5, speaking: 6.0 },
        ];

  const activityHeatmap = studyTimeByDay.map((d) => ({
    day: d.day,
    minutes: d.minutes,
    intensity:
      d.minutes === 0 ? 0 : d.minutes < 15 ? 1 : d.minutes < 30 ? 2 : d.minutes < 45 ? 3 : 4,
  }));

  const breakdown = input.wordBreakdown ?? {
    a1a2: Math.floor(input.wordCount * 0.4),
    b1b2: Math.floor(input.wordCount * 0.35),
    c1c2: Math.floor(input.wordCount * 0.15),
    ielts: Math.floor(input.wordCount * 0.1),
  };

  return {
    kpis: {
      studyMinutes,
      studyGoal: input.weeklyGoal,
      accuracy,
      words: input.wordCount,
      streak: input.streak,
      xp: input.totalXp,
      lessonsCompleted: input.lessonsCompleted,
    },
    studyTimeByDay,
    skillsRadar,
    accuracyTrend,
    vocabGrowth,
    ieltsHistory,
    activityHeatmap,
    vocabBreakdown: [
      { label: input.vocabBreakdownLabels.a1a2, count: breakdown.a1a2 },
      { label: input.vocabBreakdownLabels.b1b2, count: breakdown.b1b2 },
      { label: input.vocabBreakdownLabels.c1c2, count: breakdown.c1c2 },
      { label: input.vocabBreakdownLabels.ielts, count: breakdown.ielts },
    ],
  };
}
