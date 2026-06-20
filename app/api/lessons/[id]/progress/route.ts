import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getPglite, isPgliteMode } from "@/lib/pglite";

import { randomUUID } from "crypto";

import { guardMutation, requireSession } from "@/lib/security/api-guard";

import { lessonProgressSchema, parseJsonBody, uuidSchema } from "@/lib/security/validation";



export async function POST(req: Request, { params }: { params: { id: string } }) {

  const blocked = guardMutation(req, { key: "lesson-progress", limit: 120, windowMs: 60 * 1000 });

  if (blocked) return blocked;



  const { session, response } = await requireSession();

  if (response) return response;



  if (!uuidSchema.safeParse(params.id).success) {

    return NextResponse.json({ error: "Invalid lesson id" }, { status: 400 });

  }



  const body = await req.json();

  const parsed = parseJsonBody(body, lessonProgressSchema);

  if (!parsed) {

    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });

  }



  const userId = session!.user!.id;

  const currentStep = parsed.currentStep ?? 0;

  const timeSpentSeconds = parsed.timeSpentSeconds ?? 0;



  if (isPgliteMode()) {

    const db = await getPglite();

    const stepsRes = await db.query<{ count: number }>(

      `SELECT COUNT(*)::int as count FROM lesson_steps WHERE lesson_id = $1`,

      [params.id]

    );

    const maxStep = stepsRes.rows[0]?.count ?? 100;

    const safeStep = Math.min(currentStep, maxStep);



    const existing = await db.query(

      `SELECT id FROM user_lesson_progress WHERE user_id = $1 AND lesson_id = $2`,

      [userId, params.id]

    );

    if (existing.rows[0]) {

      await db.query(

        `UPDATE user_lesson_progress SET current_step = $1, time_spent_seconds = $2, updated_at = NOW()

         WHERE user_id = $3 AND lesson_id = $4`,

        [safeStep, timeSpentSeconds, userId, params.id]

      );

    } else {

      await db.query(

        `INSERT INTO user_lesson_progress (id, user_id, lesson_id, current_step, time_spent_seconds, xp_earned, updated_at)

         VALUES ($1, $2, $3, $4, $5, 0, NOW())`,

        [randomUUID(), userId, params.id, safeStep, timeSpentSeconds]

      );

    }

    return NextResponse.json({ ok: true });

  }



  const lesson = await prisma.lesson.findUnique({

    where: { id: params.id },

    include: { _count: { select: { steps: true } } },

  });

  if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });



  const safeStep = Math.min(currentStep, lesson._count.steps);



  await prisma.userLessonProgress.upsert({

    where: { userId_lessonId: { userId, lessonId: params.id } },

    create: {

      userId,

      lessonId: params.id,

      currentStep: safeStep,

      timeSpentSeconds,

      xpEarned: 0,

    },

    update: {

      currentStep: safeStep,

      timeSpentSeconds,

    },

  });



  return NextResponse.json({ ok: true });

}

