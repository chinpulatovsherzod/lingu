import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LessonType, EnglishLevel } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as LessonType | null;
  const level = searchParams.get("level") as EnglishLevel | null;
  const search = searchParams.get("q");

  const lessons = await prisma.lesson.findMany({
    where: {
      ...(type ? { type } : {}),
      ...(level ? { cefrLevel: level } : {}),
      ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
    },
    orderBy: { orderIndex: "asc" },
    include: {
      progress: { where: { userId: session.user.id } },
      _count: { select: { steps: true } },
    },
  });

  return NextResponse.json(
    lessons.map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      type: l.type,
      cefrLevel: l.cefrLevel,
      durationMinutes: l.durationMinutes,
      xpReward: l.xpReward,
      isIelts: l.isIelts,
      stepCount: l._count.steps,
      progress: l.progress[0]
        ? {
            currentStep: l.progress[0].currentStep,
            isCompleted: l.progress[0].isCompleted,
            percent: l.progress[0].isCompleted
              ? 100
              : Math.round((l.progress[0].currentStep / Math.max(l._count.steps, 1)) * 100),
          }
        : null,
    }))
  );
}
