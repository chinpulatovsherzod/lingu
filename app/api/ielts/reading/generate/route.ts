import { NextResponse } from "next/server";
import { generateReadingPractice } from "@/lib/openai";
import { guardMutation, requireSession } from "@/lib/security/api-guard";
import { ieltsReadingGenerateSchema, parseJsonBody } from "@/lib/security/validation";
import { rateLimit } from "@/lib/security/rate-limit";

export async function POST(req: Request) {
  const blocked = guardMutation(req, { key: "ielts-reading", limit: 20, windowMs: 60 * 60 * 1000 });
  if (blocked) return blocked;

  const { session, response } = await requireSession();
  if (response) return response;

  const userLimit = rateLimit(`ielts-reading:user:${session!.user!.id}`, 10, 60 * 60 * 1000);
  if (!userLimit.ok) {
    return NextResponse.json(
      { error: "Reading test generation limit reached" },
      { status: 429, headers: { "Retry-After": String(userLimit.retryAfter) } }
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = parseJsonBody(body, ieltsReadingGenerateSchema);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const test = await generateReadingPractice({
    topic: parsed.topic,
    difficulty: parsed.difficulty,
  });

  return NextResponse.json(test);
}
