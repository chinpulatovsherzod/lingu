import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPglite, isPgliteMode } from "@/lib/pglite";
import { sm2Update, SrsRating } from "@/lib/srs";
import { guardMutation, requireSession } from "@/lib/security/api-guard";
import { parseJsonBody, vocabularyReviewSchema } from "@/lib/security/validation";

export async function POST(req: Request) {
  const blocked = guardMutation(req, { key: "vocab-review", limit: 200, windowMs: 60 * 1000 });
  if (blocked) return blocked;

  const { session, response } = await requireSession();
  if (response) return response;

  const body = await req.json();
  const parsed = parseJsonBody(body, vocabularyReviewSchema);
  if (!parsed) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }

  if (isPgliteMode()) {
    const db = await getPglite();
    const existing = await db.query<{
      id: string;
      review_count: number;
      ease_factor: number;
    }>(
      `SELECT id, review_count, ease_factor FROM user_words WHERE id = $1 AND user_id = $2 LIMIT 1`,
      [parsed.userWordId, session!.user!.id]
    );
    const uw = existing.rows[0];
    if (!uw) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const currentReviewCount = Number(uw.review_count);
    const currentEaseFactor = Number(uw.ease_factor);
    const intervalDays = currentReviewCount === 0 ? 0 : Math.max(1, Math.round(currentReviewCount * currentEaseFactor));
    const result = sm2Update(currentEaseFactor, intervalDays, currentReviewCount, parsed.rating as SrsRating);

    const status =
      parsed.rating === "easy" && result.reviewCount >= 3
        ? "MASTERED"
        : parsed.rating === "again"
          ? "NEW"
          : "LEARNING";

    await db.query(
      `UPDATE user_words 
       SET ease_factor = $1, review_count = $2, next_review_date = $3, last_reviewed_at = NOW(), mastery_status = $4
       WHERE id = $5`,
      [result.easeFactor, result.reviewCount, result.nextReviewDate, status, uw.id]
    );

    return NextResponse.json({
      id: uw.id,
      masteryStatus: status,
      reviewCount: result.reviewCount,
      nextReviewDate: result.nextReviewDate,
      easeFactor: result.easeFactor,
    });
  }

  const uw = await prisma.userWord.findFirst({
    where: { id: parsed.userWordId, userId: session!.user!.id },
  });

  if (!uw) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const intervalDays = uw.reviewCount === 0 ? 0 : Math.max(1, Math.round(uw.reviewCount * uw.easeFactor));
  const result = sm2Update(uw.easeFactor, intervalDays, uw.reviewCount, parsed.rating as SrsRating);

  const status =
    parsed.rating === "easy" && result.reviewCount >= 3
      ? "MASTERED"
      : parsed.rating === "again"
        ? "NEW"
        : "LEARNING";

  const updated = await prisma.userWord.update({
    where: { id: uw.id },
    data: {
      easeFactor: result.easeFactor,
      reviewCount: result.reviewCount,
      nextReviewDate: result.nextReviewDate,
      lastReviewedAt: new Date(),
      masteryStatus: status,
    },
    select: {
      id: true,
      masteryStatus: true,
      reviewCount: true,
      nextReviewDate: true,
      easeFactor: true,
    },
  });

  return NextResponse.json(updated);
}

