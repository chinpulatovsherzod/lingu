import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getPglite, isPgliteMode } from "@/lib/pglite";

import { levelFromXp, XP_REWARDS } from "@/lib/xp";

import { randomUUID } from "crypto";

import { guardMutation, requireSession } from "@/lib/security/api-guard";

import { lessonCompleteSchema, parseJsonBody, uuidSchema } from "@/lib/security/validation";



export async function POST(req: Request, { params }: { params: { id: string } }) {

  const blocked = guardMutation(req, { key: "lesson-complete", limit: 30, windowMs: 60 * 1000 });

  if (blocked) return blocked;



  const { session, response } = await requireSession();

  if (response) return response;



  if (!uuidSchema.safeParse(params.id).success) {

    return NextResponse.json({ error: "Invalid lesson id" }, { status: 400 });

  }



  const body = await req.json();

  const parsed = parseJsonBody(body, lessonCompleteSchema);

  if (!parsed) {

    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });

  }



  const userId = session!.user!.id;

  const scorePercent = parsed.scorePercent ?? 0;

  const timeSpentSeconds = parsed.timeSpentSeconds ?? 0;



  if (isPgliteMode()) {

    const db = await getPglite();



    const doneRes = await db.query<{ is_completed: boolean }>(

      `SELECT is_completed FROM user_lesson_progress WHERE user_id = $1 AND lesson_id = $2`,

      [userId, params.id]

    );

    if (doneRes.rows[0]?.is_completed) {

      return NextResponse.json({ error: "Урок уже завершён" }, { status: 409 });

    }



    const lessonRes = await db.query<{ xp_reward: number }>(

      `SELECT xp_reward FROM lessons WHERE id = $1`,

      [params.id]

    );

    if (!lessonRes.rows[0]) {

      return NextResponse.json({ error: "Not found" }, { status: 404 });

    }



    const xpTotal = lessonRes.rows[0].xp_reward + XP_REWARDS.lessonComplete;

    const stepsRes = await db.query<{ count: number }>(

      `SELECT COUNT(*)::int as count FROM lesson_steps WHERE lesson_id = $1`,

      [params.id]

    );

    const stepCount = stepsRes.rows[0]?.count ?? 4;



    await db.query(

      `INSERT INTO user_lesson_progress (id, user_id, lesson_id, current_step, is_completed, score_percent, xp_earned, time_spent_seconds, completed_at, updated_at)

       VALUES ($1, $2, $3, $4, true, $5, $6, $7, NOW(), NOW())

       ON CONFLICT (user_id, lesson_id) DO UPDATE SET

         current_step = $4, is_completed = true, score_percent = $5, xp_earned = $6, completed_at = NOW(), updated_at = NOW()`,

      [randomUUID(), userId, params.id, stepCount, scorePercent, xpTotal, timeSpentSeconds]

    ).catch(async () => {

      await db.query(

        `UPDATE user_lesson_progress SET current_step = $1, is_completed = true, score_percent = $2, xp_earned = $3, completed_at = NOW(), updated_at = NOW()

         WHERE user_id = $4 AND lesson_id = $5`,

        [stepCount, scorePercent, xpTotal, userId, params.id]

      );

    });



    const userRes = await db.query<{ total_xp: number }>(

      `UPDATE users SET total_xp = total_xp + $1, last_active_date = NOW() WHERE id = $2 RETURNING total_xp`,

      [xpTotal, userId]

    );

    const totalXp = userRes.rows[0]?.total_xp ?? 0;



    return NextResponse.json({ xpEarned: xpTotal, level: levelFromXp(totalXp) });

  }



  const lesson = await prisma.lesson.findUnique({

    where: { id: params.id },

    include: { steps: true },

  });

  if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });



  const existing = await prisma.userLessonProgress.findUnique({

    where: { userId_lessonId: { userId, lessonId: params.id } },

  });

  if (existing?.isCompleted) {

    return NextResponse.json({ error: "Урок уже завершён" }, { status: 409 });

  }



  const xpTotal = lesson.xpReward + XP_REWARDS.lessonComplete;



  await prisma.userLessonProgress.upsert({

    where: { userId_lessonId: { userId, lessonId: params.id } },

    create: {

      userId,

      lessonId: params.id,

      currentStep: lesson.steps.length,

      isCompleted: true,

      scorePercent,

      xpEarned: xpTotal,

      timeSpentSeconds,

      completedAt: new Date(),

    },

    update: {

      isCompleted: true,

      scorePercent,

      xpEarned: xpTotal,

      completedAt: new Date(),

    },

  });



  const before = await prisma.user.findUnique({ where: { id: userId } });

  const newXp = (before?.totalXp ?? 0) + xpTotal;



  const user = await prisma.user.update({

    where: { id: userId },

    data: {

      totalXp: newXp,

      currentLevel: levelFromXp(newXp),

      lastActiveDate: new Date(),

      streakCount: { increment: 1 },

    },

  });



  const today = new Date();

  today.setHours(0, 0, 0, 0);

  await prisma.userStatsDaily.upsert({

    where: { userId_date: { userId, date: today } },

    create: {

      userId,

      date: today,

      minutesStudied: Math.ceil(timeSpentSeconds / 60),

      xpEarned: xpTotal,

      lessonsCompleted: 1,

    },

    update: {

      minutesStudied: { increment: Math.ceil(timeSpentSeconds / 60) },

      xpEarned: { increment: xpTotal },

      lessonsCompleted: { increment: 1 },

    },

  });



  const vocabSteps = lesson.steps.filter((s) => s.stepType === "VOCABULARY");

  for (const step of vocabSteps) {

    const wordText = String((step.content as { word?: string }).word ?? "").toLowerCase();

    const word = await prisma.word.findFirst({

      where: { word: { equals: wordText, mode: "insensitive" } },

    });

    if (word) {

      await prisma.userWord.upsert({

        where: { userId_wordId: { userId, wordId: word.id } },

        create: { userId, wordId: word.id, masteryStatus: "NEW" },

        update: {},

      });

    }

  }



  return NextResponse.json({ xpEarned: xpTotal, level: user.currentLevel });

}

