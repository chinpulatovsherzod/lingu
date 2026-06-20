import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPglite, isPgliteMode } from "@/lib/pglite";
import { requireSession } from "@/lib/security/api-guard";
import { levelFromXp } from "@/lib/xp";

export async function POST(req: Request) {
  const { session, response } = await requireSession();
  if (response) return response;

  const userId = session!.user!.id;
  const body = await req.json();
  const xpAward = parseInt(body.xp, 10);

  if (isNaN(xpAward) || xpAward <= 0 || xpAward > 500) {
    return NextResponse.json({ error: "Invalid XP amount" }, { status: 400 });
  }

  let totalXp = 0;

  if (isPgliteMode()) {
    const db = await getPglite();
    const userRes = await db.query<{ total_xp: number }>(
      `SELECT total_xp FROM users WHERE id = $1`,
      [userId]
    );
    const user = userRes.rows[0];
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    totalXp = (user.total_xp ?? 0) + xpAward;
    const currentLevel = levelFromXp(totalXp);

    await db.query(
      `UPDATE users SET total_xp = $1, current_level = $2, updated_at = NOW() WHERE id = $3`,
      [totalXp, currentLevel, userId]
    );
  } else {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalXp: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    totalXp = user.totalXp + xpAward;
    const currentLevel = levelFromXp(totalXp);

    await prisma.user.update({
      where: { id: userId },
      data: {
        totalXp,
        currentLevel,
      },
    });
  }

  return NextResponse.json({ success: true, totalXp, level: levelFromXp(totalXp) });
}
