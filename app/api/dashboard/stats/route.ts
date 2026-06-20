import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [user, words, daily, progress, tests] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userWord.findMany({ where: { userId }, include: { word: true } }),
    prisma.userStatsDaily.findMany({
      where: { userId, date: { gte: weekAgo } },
    }),
    prisma.userLessonProgress.findMany({ where: { userId, isCompleted: false }, take: 4, include: { lesson: true } }),
    prisma.ieltsTest.findMany({ where: { userId }, orderBy: { takenAt: "desc" }, take: 1 }),
  ]);

  const mastered = words.filter((w) => w.masteryStatus === "MASTERED").length;
  const weeklyMinutes = daily.reduce((s, d) => s + d.minutesStudied, 0);

  const lastTest = tests[0];
  const sections = [
    { name: "Reading", band: lastTest?.readingBand ?? 5.5 },
    { name: "Listening", band: lastTest?.listeningBand ?? 5.5 },
    { name: "Writing", band: lastTest?.writingBand ?? 5.5 },
    { name: "Speaking", band: lastTest?.speakingBand ?? 5.5 },
  ];
  const overall =
    lastTest?.overallBand ??
    sections.reduce((s, x) => s + x.band, 0) / sections.length;

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const activityDays = dayLabels.map((label, i) => {
    const d = daily[i];
    const mins = d?.minutesStudied ?? 0;
    const intensity = mins === 0 ? 0 : mins < 15 ? 1 : mins < 30 ? 2 : mins < 45 ? 3 : 4;
    return { label, intensity };
  });

  return NextResponse.json({
    vocabulary: { learned: words.length, mastered, weeklyNew: words.filter((w) => w.masteryStatus === "NEW").length },
    accuracy: 78,
    xp: user?.totalXp ?? 0,
    level: user?.currentLevel ?? 1,
    streak: user?.streakCount ?? 0,
    studyMinutes: daily.reduce((s, d) => s + d.minutesStudied, 0),
    weeklyMinutes,
    weeklyGoal: user?.weeklyGoalMinutes ?? 150,
    ielts: { overall, sections },
    continueLessons: progress.map((p) => ({
      id: p.lessonId,
      title: p.lesson.title,
      type: p.lesson.type,
      cefrLevel: p.lesson.cefrLevel,
      progress: Math.round((p.currentStep / 5) * 100),
    })),
    vocabBreakdown: [
      { label: "A1-A2", count: words.filter((w) => ["A1", "A2"].includes(w.word.cefrLevel)).length },
      { label: "B1-B2", count: words.filter((w) => ["B1", "B2"].includes(w.word.cefrLevel)).length },
      { label: "C1-C2", count: words.filter((w) => ["C1", "C2"].includes(w.word.cefrLevel)).length },
      { label: "IELTS Academic", count: words.filter((w) => w.word.isIeltsAcademic).length },
    ],
    activityDays,
  });
}
