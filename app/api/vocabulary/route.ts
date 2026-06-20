import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPglite, isPgliteMode } from "@/lib/pglite";
import { MasteryStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status") as MasteryStatus | "ALL" | "IELTS" | null;
  const q = req.nextUrl.searchParams.get("q");

  if (isPgliteMode()) {
    const db = await getPglite();
    let queryStr = `
      SELECT uw.id, uw.mastery_status as "masteryStatus", uw.review_count as "reviewCount", uw.next_review_date as "nextReviewDate", uw.ease_factor as "easeFactor",
             w.id as "wordId", w.word, w.part_of_speech as "partOfSpeech", w.definition, w.example_sentence as "exampleSentence", w.cefr_level as "cefrLevel", w.is_ielts_academic as "isIeltsAcademic"
      FROM user_words uw
      JOIN words w ON w.id = uw.word_id
      WHERE uw.user_id = $1
    `;
    const params: any[] = [session.user.id];

    if (status && status !== "ALL" && status !== "IELTS") {
      params.push(status);
      queryStr += ` AND uw.mastery_status = $${params.length}`;
    }

    if (status === "IELTS") {
      queryStr += ` AND w.is_ielts_academic = true`;
    }

    if (q) {
      params.push(`%${q}%`);
      queryStr += ` AND w.word ILIKE $${params.length}`;
    }

    queryStr += ` ORDER BY uw.next_review_date ASC`;

    const res = await db.query<any>(queryStr, params);

    const words = res.rows.map((row) => ({
      id: row.id,
      userId: session.user.id,
      wordId: row.wordId,
      masteryStatus: row.masteryStatus,
      reviewCount: row.reviewCount,
      nextReviewDate: row.nextReviewDate,
      easeFactor: row.easeFactor,
      word: {
        id: row.wordId,
        word: row.word,
        partOfSpeech: row.partOfSpeech,
        definition: row.definition,
        exampleSentence: row.exampleSentence,
        cefrLevel: row.cefrLevel,
        isIeltsAcademic: row.isIeltsAcademic,
      },
    }));

    return NextResponse.json(words);
  }

  const words = await prisma.userWord.findMany({
    where: {
      userId: session.user.id,
      ...(status && status !== "ALL" && status !== "IELTS"
        ? { masteryStatus: status }
        : {}),
      ...(status === "IELTS" ? { word: { isIeltsAcademic: true } } : {}),
      ...(q ? { word: { word: { contains: q, mode: "insensitive" } } } : {}),
    },
    include: { word: true },
    orderBy: { nextReviewDate: "asc" },
  });

  return NextResponse.json(words);
}
