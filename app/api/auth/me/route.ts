import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPglite, isPgliteMode } from "@/lib/pglite";
import { guardMutation, requireSession, safeUserProfile } from "@/lib/security/api-guard";
import { parseJsonBody, profilePatchSchema } from "@/lib/security/validation";

const profileSelect = {
  id: true,
  email: true,
  name: true,
  lastName: true,
  englishLevel: true,
  ieltsTargetBand: true,
  learningGoal: true,
  totalXp: true,
  currentLevel: true,
  streakCount: true,
} as const;

export async function GET() {
  const { session, response } = await requireSession();
  if (response) return response;

  if (isPgliteMode()) {
    const db = await getPglite();
    const res = await db.query(
      `SELECT id, email, name, last_name, english_level, ielts_target_band, learning_goal, total_xp, current_level, streak_count
       FROM users WHERE id = $1`,
      [session!.user!.id]
    );
    const u = res.rows[0] as Record<string, unknown> | undefined;
    if (!u) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(safeUserProfile(u));
  }

  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id },
    select: profileSelect,
  });
  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const blocked = guardMutation(req, { key: "profile-patch", limit: 30, windowMs: 60 * 1000 });
  if (blocked) return blocked;

  const { session, response } = await requireSession();
  if (response) return response;

  const body = await req.json();
  const parsed = parseJsonBody(body, profilePatchSchema);
  if (!parsed) {
    return NextResponse.json({ error: "Некорректные данные профиля" }, { status: 400 });
  }

  if (isPgliteMode()) {
    const db = await getPglite();
    if (parsed.englishLevel) {
      await db.query(`UPDATE users SET english_level = $1, updated_at = NOW() WHERE id = $2`, [
        parsed.englishLevel === "UNKNOWN" ? null : parsed.englishLevel,
        session!.user!.id,
      ]);
    }
    if (parsed.ieltsTargetBand !== undefined) {
      await db.query(`UPDATE users SET ielts_target_band = $1, updated_at = NOW() WHERE id = $2`, [
        parsed.ieltsTargetBand,
        session!.user!.id,
      ]);
    }
    if (parsed.name) {
      await db.query(`UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2`, [
        parsed.name,
        session!.user!.id,
      ]);
    }
    if (parsed.lastName !== undefined) {
      await db.query(`UPDATE users SET last_name = $1, updated_at = NOW() WHERE id = $2`, [
        parsed.lastName,
        session!.user!.id,
      ]);
    }
    const res = await db.query(
      `SELECT id, email, name, last_name, english_level, ielts_target_band, learning_goal, total_xp, current_level, streak_count
       FROM users WHERE id = $1`,
      [session!.user!.id]
    );
    const row = res.rows[0] as Record<string, unknown> | undefined;
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(safeUserProfile(row));
  }

  const user = await prisma.user.update({
    where: { id: session!.user!.id },
    data: {
      ...(parsed.englishLevel ? { englishLevel: parsed.englishLevel === "UNKNOWN" ? null : (parsed.englishLevel as "A1" | "A2" | "B1" | "B2" | "C1" | "C2") } : {}),
      ...(parsed.ieltsTargetBand !== undefined ? { ieltsTargetBand: parsed.ieltsTargetBand } : {}),
      ...(parsed.name ? { name: parsed.name } : {}),
      ...(parsed.lastName !== undefined ? { lastName: parsed.lastName } : {}),
    },
    select: profileSelect,
  });
  return NextResponse.json(user);
}
