import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { isPgliteMode } from "@/lib/pglite";
import {
  pgliteFindUserById,
  pgliteGetLessonWithSteps,
  pgliteInProgressLessons,
  pgliteLatestIeltsTest,
  pgliteListLessons,
  pgliteUserWordCount,
  pgliteUserHeaderStats,
} from "@/lib/data/pglite-queries";
import { getPglite } from "@/lib/pglite";
import { buildAnalyticsSnapshot } from "@/lib/analytics/build-data";
import type { Messages } from "@/lib/i18n/types";

function mapPgliteUser(u: NonNullable<Awaited<ReturnType<typeof pgliteFindUserById>>>) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    lastName: u.last_name ?? null,
    englishLevel: u.english_level,
    learningGoal: u.learning_goal,
    ieltsTargetBand: u.ielts_target_band,
    totalXp: u.total_xp,
    currentLevel: u.current_level,
    streakCount: u.streak_count,
    weeklyGoalMinutes: u.weekly_goal_minutes,
    createdAt: u.created_at ? new Date(u.created_at) : new Date(),
  };
}

export const getUserById = cache(async (id: string) => {
  if (isPgliteMode()) {
    const u = await pgliteFindUserById(id);
    if (!u) return null;
    return mapPgliteUser(u);
  }
  return prisma.user.findUnique({ where: { id } });
});

export const getUserHeaderStats = cache(async (id: string) => {
  if (isPgliteMode()) {
    const row = await pgliteUserHeaderStats(id);
    return {
      name: row?.name ?? null,
      streakCount: row?.streak_count ?? 0,
      totalXp: row?.total_xp ?? 0,
    };
  }
  const user = await prisma.user.findUnique({
    where: { id },
    select: { name: true, streakCount: true, totalXp: true },
  });
  return {
    name: user?.name ?? null,
    streakCount: user?.streakCount ?? 0,
    totalXp: user?.totalXp ?? 0,
  };
});

export async function getLessonsForUser(userId: string, filters: { type?: string; level?: string; q?: string }) {
  if (isPgliteMode()) {
    let rows = await pgliteListLessons(userId);
    if (filters.type) rows = rows.filter((l) => l.type === filters.type);
    if (filters.level) rows = rows.filter((l) => l.cefr_level === filters.level);
    if (filters.q) {
      const q = filters.q.toLowerCase();
      rows = rows.filter((l) => l.title.toLowerCase().includes(q));
    }
    return rows.map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      type: l.type,
      cefrLevel: l.cefr_level,
      durationMinutes: l.duration_minutes,
      xpReward: l.xp_reward,
      isIelts: l.is_ielts,
      progress: l.current_step != null
        ? [{ currentStep: l.current_step, isCompleted: !!l.is_completed }]
        : [],
      _count: { steps: l.step_count },
    }));
  }
  return prisma.lesson.findMany({
    where: {
      ...(filters.type ? { type: filters.type as never } : {}),
      ...(filters.level ? { cefrLevel: filters.level as never } : {}),
      ...(filters.q ? { title: { contains: filters.q, mode: "insensitive" } } : {}),
    },
    orderBy: { orderIndex: "asc" },
    include: {
      progress: { where: { userId } },
      _count: { select: { steps: true } },
    },
  });
}

export async function getLessonDetail(lessonId: string, userId: string) {
  if (isPgliteMode()) {
    const data = await pgliteGetLessonWithSteps(lessonId, userId);
    if (!data.lesson) return null;
    const lesson = data.lesson as Record<string, unknown>;
    return {
      id: lesson.id as string,
      title: lesson.title as string,
      xpReward: lesson.xp_reward as number,
      steps: (data.steps as Record<string, unknown>[]).map((s) => ({
        id: s.id as string,
        stepType: s.step_type as string,
        orderIndex: s.order_index as number,
        content: typeof s.content === "string" ? JSON.parse(s.content) : s.content,
      })),
      userProgress: data.progress
        ? { currentStep: (data.progress as Record<string, unknown>).current_step as number }
        : null,
    };
  }
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      steps: { orderBy: { orderIndex: "asc" } },
      progress: { where: { userId } },
    },
  });
  if (!lesson) return null;
  return {
    id: lesson.id,
    title: lesson.title,
    xpReward: lesson.xpReward,
    steps: lesson.steps.map((s) => ({
      id: s.id,
      stepType: s.stepType,
      orderIndex: s.orderIndex,
      content: s.content as Record<string, unknown>,
    })),
    userProgress: lesson.progress[0] ?? null,
  };
}

function pointsToLevel(points: number): { level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"; progress: number } {
  if (points < 50) {
    return { level: "A1", progress: Math.min(100, Math.round((points / 50) * 100)) };
  }
  if (points < 120) {
    return { level: "A2", progress: Math.min(100, Math.round(((points - 50) / 70) * 100)) };
  }
  if (points < 220) {
    return { level: "B1", progress: Math.min(100, Math.round(((points - 120) / 100) * 100)) };
  }
  if (points < 350) {
    return { level: "B2", progress: Math.min(100, Math.round(((points - 220) / 130) * 100)) };
  }
  if (points < 500) {
    return { level: "C1", progress: Math.min(100, Math.round(((points - 350) / 150) * 100)) };
  }
  return { level: "C2", progress: Math.min(100, Math.round(((points - 500) / 300) * 100)) };
}

function calculateSkillsFromStats(params: {
  completedLessons: { type: string; score_percent: number | null }[];
  words: number;
  masteryCounts: { NEW: number; LEARNING: number; MASTERED: number };
  lastTest: any;
  userLevel: string;
}) {
  const { completedLessons, words, masteryCounts, lastTest, userLevel } = params;

  const counts: Record<string, { count: number; sumScore: number }> = {};
  completedLessons.forEach(l => {
    if (!counts[l.type]) counts[l.type] = { count: 0, sumScore: 0 };
    counts[l.type].count += 1;
    counts[l.type].sumScore += l.score_percent ?? 100;
  });

  const readingBand = lastTest?.reading_band ?? lastTest?.readingBand ?? 5.5;
  const listeningBand = lastTest?.listening_band ?? lastTest?.listeningBand ?? 5.5;
  const writingBand = lastTest?.writing_band ?? lastTest?.writingBand ?? 5.5;
  const speakingBand = lastTest?.speaking_band ?? lastTest?.speakingBand ?? 5.5;

  const readingPoints = (counts["READING"]?.count ?? 0) * 12 + readingBand * 15;
  const listeningPoints = (counts["LISTENING"]?.count ?? 0) * 12 + listeningBand * 15;
  const writingPoints = (counts["WRITING"]?.count ?? 0) * 12 + writingBand * 20;
  const speakingPoints = (counts["SPEAKING"]?.count ?? 0) * 12 + speakingBand * 20;
  const pronunciationPoints = (counts["SPEAKING"]?.count ?? 0) * 8 + speakingBand * 10;
  
  const avgGrammarScore = counts["GRAMMAR"]?.count ? (counts["GRAMMAR"].sumScore / counts["GRAMMAR"].count) : 80;
  const grammarPoints = (counts["GRAMMAR"]?.count ?? 0) * 12 + avgGrammarScore * 0.5;

  const vocabPoints = words + (masteryCounts.MASTERED * 2) + (masteryCounts.LEARNING * 0.5);
  const idiomsPoints = words * 0.15 + (masteryCounts.MASTERED * 0.3);

  return {
    reading: pointsToLevel(readingPoints),
    listening: pointsToLevel(listeningPoints),
    writing: pointsToLevel(writingPoints),
    speaking: pointsToLevel(speakingPoints),
    grammar: pointsToLevel(grammarPoints),
    vocabulary: pointsToLevel(vocabPoints),
    pronunciation: pointsToLevel(pronunciationPoints),
    idioms: pointsToLevel(idiomsPoints),
  };
}

export const getDashboardData = cache(async (userId: string) => {
  if (isPgliteMode()) {
    const db = await getPglite();
    const [user, inProgress, lastTest] = await Promise.all([
      getUserById(userId),
      pgliteInProgressLessons(userId),
      pgliteLatestIeltsTest(userId),
    ]);

    const wordsCountRes = await db.query<{ count: number }>(
      `SELECT COUNT(*)::int as count FROM user_words WHERE user_id = $1`, [userId]
    );
    const words = wordsCountRes.rows[0]?.count ?? 0;

    const dueCountRes = await db.query<{ count: number }>(
      `SELECT COUNT(*)::int as count FROM user_words WHERE user_id = $1 AND next_review_date <= NOW()`, [userId]
    );
    const dueWords = dueCountRes.rows[0]?.count ?? 0;

    const masteryRes = await db.query<{ mastery_status: string; count: number }>(
      `SELECT mastery_status, COUNT(*)::int as count FROM user_words WHERE user_id = $1 GROUP BY mastery_status`, [userId]
    );
    
    const masteryCounts = { NEW: 0, LEARNING: 0, MASTERED: 0 };
    masteryRes.rows.forEach(r => {
      const status = r.mastery_status as keyof typeof masteryCounts;
      if (status in masteryCounts) {
        masteryCounts[status] = r.count;
      }
    });

    const completedLessonsRes = await db.query<{ type: string; score_percent: number | null }>(
      `SELECT l.type, lp.score_percent 
       FROM user_lesson_progress lp 
       JOIN lessons l ON l.id = lp.lesson_id 
       WHERE lp.user_id = $1 AND lp.is_completed = true`, [userId]
    );
    const completedLessons = completedLessonsRes.rows;

    const userLevel = user?.englishLevel ?? "A1";
    
    const isIeltsGoal = user?.learningGoal === "IELTS";

    const targetLessonsRes = await db.query<{ id: string }>(
      isIeltsGoal 
        ? `SELECT id FROM lessons WHERE is_ielts = true`
        : `SELECT id FROM lessons WHERE cefr_level = $1`,
      isIeltsGoal ? [] : [userLevel]
    );
    const totalTargetLessons = targetLessonsRes.rows.length;

    const completedTargetLessonsRes = await db.query<{ id: string }>(
      isIeltsGoal
        ? `SELECT lp.lesson_id FROM user_lesson_progress lp JOIN lessons l ON l.id = lp.lesson_id WHERE lp.user_id = $1 AND lp.is_completed = true AND l.is_ielts = true`
        : `SELECT lp.lesson_id FROM user_lesson_progress lp JOIN lessons l ON l.id = lp.lesson_id WHERE lp.user_id = $1 AND lp.is_completed = true AND l.cefr_level = $2`,
      isIeltsGoal ? [userId] : [userId, userLevel]
    );
    const completedTargetLessons = completedTargetLessonsRes.rows.length;

    const skillsProgression = calculateSkillsFromStats({
      completedLessons,
      words,
      masteryCounts,
      lastTest,
      userLevel
    });

    const memoryStrength = words > 0 ? Math.round(((words - dueWords) / words) * 100) : 100;
    const readinessScore = totalTargetLessons > 0 ? (completedTargetLessons / totalTargetLessons) * 100 : 0;

    return { 
      user, 
      words, 
      daily: [] as { minutesStudied: number }[], 
      inProgress, 
      lastTest,
      skillsProgression,
      memoryStrength,
      readinessScore,
      masteryCounts
    };
  }

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [user, words, daily, inProgress, lastTest, dueWords, masteryGroups, completedLessons] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userWord.count({ where: { userId } }),
    prisma.userStatsDaily.findMany({ where: { userId, date: { gte: weekAgo } } }),
    prisma.userLessonProgress.findMany({
      where: { userId, isCompleted: false },
      take: 4,
      include: { lesson: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.ieltsTest.findFirst({ where: { userId }, orderBy: { takenAt: "desc" } }),
    prisma.userWord.count({ where: { userId, nextReviewDate: { lte: new Date() } } }),
    prisma.userWord.groupBy({
      by: ['masteryStatus'],
      where: { userId },
      _count: true
    }),
    prisma.userLessonProgress.findMany({
      where: { userId, isCompleted: true },
      include: { lesson: true }
    })
  ]);

  const totalTargetLessons = await prisma.lesson.count({
    where: user?.learningGoal === "IELTS" ? { isIelts: true } : { cefrLevel: user?.englishLevel ?? "A1" }
  });

  const completedTargetLessons = await prisma.userLessonProgress.count({
    where: {
      userId,
      isCompleted: true,
      lesson: user?.learningGoal === "IELTS" ? { isIelts: true } : { cefrLevel: user?.englishLevel ?? "A1" }
    }
  });

  const masteryCounts = { NEW: 0, LEARNING: 0, MASTERED: 0 };
  masteryGroups.forEach(g => {
    const status = g.masteryStatus as keyof typeof masteryCounts;
    if (status in masteryCounts) {
      masteryCounts[status] = g._count;
    }
  });

  const formattedCompleted = completedLessons.map(cl => ({
    type: cl.lesson.type,
    score_percent: cl.scorePercent
  }));

  const userLevel = user?.englishLevel ?? "A1";
  const skillsProgression = calculateSkillsFromStats({
    completedLessons: formattedCompleted,
    words,
    masteryCounts,
    lastTest,
    userLevel
  });

  const memoryStrength = words > 0 ? Math.round(((words - dueWords) / words) * 100) : 100;
  const readinessScore = totalTargetLessons > 0 ? (completedTargetLessons / totalTargetLessons) * 100 : 0;

  return { 
    user, 
    words, 
    daily, 
    inProgress, 
    lastTest,
    skillsProgression,
    memoryStrength,
    readinessScore,
    masteryCounts
  };
});

export async function getVocabularyForUser(userId: string) {
  if (isPgliteMode()) {
    const db = await getPglite();
    const res = await db.query<{
      id: string;
      mastery_status: string;
      word: string;
      part_of_speech: string;
      definition: string;
      example_sentence: string;
      cefr_level: string;
    }>(
      `SELECT uw.id, uw.mastery_status, w.word, w.part_of_speech, w.definition, w.example_sentence, w.cefr_level
       FROM user_words uw JOIN words w ON w.id = uw.word_id
       WHERE uw.user_id = $1 ORDER BY uw.next_review_date LIMIT 50`,
      [userId]
    );
    return res.rows.map((r) => ({
      id: r.id,
      masteryStatus: r.mastery_status,
      word: {
        word: r.word,
        partOfSpeech: r.part_of_speech,
        definition: r.definition,
        exampleSentence: r.example_sentence,
        cefrLevel: r.cefr_level,
      },
    }));
  }
  return prisma.userWord.findMany({
    where: { userId },
    include: { word: true },
    take: 50,
    orderBy: { nextReviewDate: "asc" },
  });
}

export async function getGrammarTopics() {
  if (isPgliteMode()) {
    const db = await getPglite();
    const res = await db.query<{
      id: string;
      slug: string;
      title: string;
      description: string;
      cefr_level: string;
    }>(`SELECT id, slug, title, description, cefr_level FROM grammar_topics ORDER BY order_index`);
    return res.rows.map((t) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      description: t.description,
      cefrLevel: t.cefr_level,
    }));
  }
  return prisma.grammarTopic.findMany({ orderBy: { orderIndex: "asc" } });
}

export async function getAchievements(userId: string) {
  if (isPgliteMode()) {
    const db = await getPglite();
    const all = await db.query(`SELECT * FROM achievements`);
    const earned = await db.query<{ achievement_id: string }>(
      `SELECT achievement_id FROM user_achievements WHERE user_id = $1`,
      [userId]
    );
    const earnedIds = new Set(earned.rows.map((e) => e.achievement_id));
    return {
      all: all.rows as { id: string; title: string; description: string; xp_reward: number }[],
      earnedIds,
    };
  }
  const [all, earned] = await Promise.all([
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany({ where: { userId }, include: { achievement: true } }),
  ]);
  return { all, earnedIds: new Set(earned.map((e) => e.achievementId)) };
}

export async function getUserProfile(userId: string) {
  const user = await getUserById(userId);
  if (!user) return null;

  if (isPgliteMode()) {
    const db = await getPglite();
    const [words, lessonsRes] = await Promise.all([
      pgliteUserWordCount(userId),
      db.query<{ count: number }>(
        `SELECT COUNT(*)::int as count FROM user_lesson_progress WHERE user_id = $1 AND is_completed = true`,
        [userId]
      ),
    ]);
    return {
      user,
      stats: { words, lessonsCompleted: lessonsRes.rows[0]?.count ?? 0 },
    };
  }

  const [words, lessonsCompleted] = await Promise.all([
    prisma.userWord.count({ where: { userId } }),
    prisma.userLessonProgress.count({ where: { userId, isCompleted: true } }),
  ]);

  return { user, stats: { words, lessonsCompleted } };
}

export const getAnalyticsData = cache(async (userId: string, t: Messages) => {
  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
  const dayLabels = dayKeys.map((k) => t.dashboard.days[k]);
  const weekLabels = ["W1", "W2", "W3", "W4", "W5", "W6"];

  const user = await getUserById(userId);
  if (!user) return null;

  if (isPgliteMode()) {
    const db = await getPglite();
    const [wordCount, lessonsRes, dailyRes, testsRes, breakdownRes] = await Promise.all([
      pgliteUserWordCount(userId),
      db.query<{ count: number }>(
        `SELECT COUNT(*)::int as count FROM user_lesson_progress WHERE user_id = $1 AND is_completed = true`,
        [userId]
      ),
      db.query<{ minutes_studied: number; xp_earned: number; words_learned: number }>(
        `SELECT minutes_studied, xp_earned, words_learned FROM user_stats_daily
         WHERE user_id = $1 ORDER BY date DESC LIMIT 7`,
        [userId]
      ),
      db.query<{
        overall_band: number;
        reading_band: number;
        listening_band: number;
        writing_band: number;
        speaking_band: number;
        taken_at: string;
      }>(
        `SELECT overall_band, reading_band, listening_band, writing_band, speaking_band, taken_at
         FROM ielts_tests WHERE user_id = $1 ORDER BY taken_at DESC LIMIT 6`,
        [userId]
      ),
      db.query<{ cefr_level: string; is_ielts_academic: boolean }>(
        `SELECT w.cefr_level, w.is_ielts_academic FROM user_words uw
         JOIN words w ON w.id = uw.word_id WHERE uw.user_id = $1`,
        [userId]
      ),
    ]);

    const words = breakdownRes.rows;
    const wordBreakdown = {
      a1a2: words.filter((w) => ["A1", "A2"].includes(w.cefr_level)).length,
      b1b2: words.filter((w) => ["B1", "B2"].includes(w.cefr_level)).length,
      c1c2: words.filter((w) => ["C1", "C2"].includes(w.cefr_level)).length,
      ielts: words.filter((w) => w.is_ielts_academic).length,
    };

    return buildAnalyticsSnapshot({
      userId,
      dayLabels: [...dayLabels],
      weekLabels,
      skillLabels: t.dashboard.skillsList,
      vocabBreakdownLabels: t.dashboard.vocabBreakdown,
      totalXp: user.totalXp ?? 0,
      streak: user.streakCount ?? 0,
      weeklyGoal: user.weeklyGoalMinutes ?? 150,
      englishLevel: user.englishLevel ?? "A1",
      wordCount: wordCount,
      lessonsCompleted: lessonsRes.rows[0]?.count ?? 0,
      daily: dailyRes.rows.reverse().map((d) => ({
        minutesStudied: d.minutes_studied,
        xpEarned: d.xp_earned,
        wordsLearned: d.words_learned,
      })),
      ieltsTests: testsRes.rows.map((test) => ({
        takenAt: test.taken_at,
        overallBand: test.overall_band,
        readingBand: test.reading_band,
        listeningBand: test.listening_band,
        writingBand: test.writing_band,
        speakingBand: test.speaking_band,
      })),
      wordBreakdown,
    });
  }

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [wordCount, lessonsCompleted, daily, tests, words] = await Promise.all([
    prisma.userWord.count({ where: { userId } }),
    prisma.userLessonProgress.count({ where: { userId, isCompleted: true } }),
    prisma.userStatsDaily.findMany({
      where: { userId, date: { gte: weekAgo } },
      orderBy: { date: "asc" },
    }),
    prisma.ieltsTest.findMany({
      where: { userId },
      orderBy: { takenAt: "desc" },
      take: 6,
    }),
    prisma.userWord.findMany({ where: { userId }, include: { word: true } }),
  ]);

  const wordBreakdown = {
    a1a2: words.filter((w) => ["A1", "A2"].includes(w.word.cefrLevel)).length,
    b1b2: words.filter((w) => ["B1", "B2"].includes(w.word.cefrLevel)).length,
    c1c2: words.filter((w) => ["C1", "C2"].includes(w.word.cefrLevel)).length,
    ielts: words.filter((w) => w.word.isIeltsAcademic).length,
  };

  return buildAnalyticsSnapshot({
    userId,
    dayLabels: [...dayLabels],
    weekLabels,
    skillLabels: t.dashboard.skillsList,
    vocabBreakdownLabels: t.dashboard.vocabBreakdown,
    totalXp: user.totalXp ?? 0,
    streak: user.streakCount ?? 0,
    weeklyGoal: user.weeklyGoalMinutes ?? 150,
    englishLevel: user.englishLevel ?? "A1",
    wordCount,
    lessonsCompleted,
    daily: daily.map((d) => ({
      minutesStudied: d.minutesStudied,
      xpEarned: d.xpEarned,
      wordsLearned: d.wordsLearned,
    })),
    ieltsTests: tests.reverse().map((test) => ({
      takenAt: test.takenAt,
      overallBand: test.overallBand,
      readingBand: test.readingBand,
      listeningBand: test.listeningBand,
      writingBand: test.writingBand,
      speakingBand: test.speakingBand,
    })),
    wordBreakdown,
  });
});
