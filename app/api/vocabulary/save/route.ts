import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getPglite, isPgliteMode } from "@/lib/pglite";
import { guardMutation, requireSession } from "@/lib/security/api-guard";
import { parseJsonBody, vocabularySaveSchema } from "@/lib/security/validation";
import { pickVocabularyEntry } from "@/lib/translate";

export async function POST(req: Request) {
  const blocked = guardMutation(req, { key: "vocab-save", limit: 40, windowMs: 60 * 1000 });
  if (blocked) return blocked;

  const { session, response } = await requireSession();
  if (response) return response;

  const body = await req.json();
  const parsed = parseJsonBody(body, vocabularySaveSchema);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { word, definition } = pickVocabularyEntry(
    parsed.sourceText,
    parsed.targetText,
    parsed.sourceLang,
    parsed.targetLang
  );

  const normalized = word.toLowerCase().trim();
  if (!normalized) {
    return NextResponse.json({ error: "Empty word" }, { status: 400 });
  }

  const userId = session!.user!.id;

  if (isPgliteMode()) {
    const db = await getPglite();
    const existing = await db.query<{ id: string }>(
      `SELECT uw.id FROM user_words uw
       JOIN words w ON w.id = uw.word_id
       WHERE uw.user_id = $1 AND LOWER(w.word) = $2 LIMIT 1`,
      [userId, normalized]
    );
    if (existing.rows[0]) {
      return NextResponse.json({ ok: true, userWordId: existing.rows[0].id, duplicate: true });
    }

    const wordId = randomUUID();
    const userWordId = randomUUID();
    await db.query(
      `INSERT INTO words (id, word, part_of_speech, definition, example_sentence, cefr_level, is_ielts_academic, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [wordId, word.slice(0, 120), "phrase", definition.slice(0, 1500), parsed.sourceText.slice(0, 300), "A1", false]
    );
    await db.query(
      `INSERT INTO user_words (id, user_id, word_id, mastery_status, review_count, next_review_date, ease_factor)
       VALUES ($1, $2, $3, 'NEW', 0, NOW(), 2.5)`,
      [userWordId, userId, wordId]
    );
    return NextResponse.json({ ok: true, userWordId });
  }

  const existingWord = await prisma.word.findFirst({
    where: { word: { equals: word, mode: "insensitive" } },
    include: { userWords: { where: { userId }, take: 1 } },
  });

  if (existingWord?.userWords[0]) {
    return NextResponse.json({ ok: true, userWordId: existingWord.userWords[0].id, duplicate: true });
  }

  let wordId = existingWord?.id;
  if (!wordId) {
    const created = await prisma.word.create({
      data: {
        word: word.slice(0, 120),
        partOfSpeech: "phrase",
        definition: definition.slice(0, 1500),
        exampleSentence: parsed.sourceText.slice(0, 300),
        cefrLevel: "A1",
      },
    });
    wordId = created.id;
  }

  const userWord = await prisma.userWord.create({
    data: { userId, wordId },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, userWordId: userWord.id });
}
