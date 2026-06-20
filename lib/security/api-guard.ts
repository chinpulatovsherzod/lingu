import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getClientIp, rateLimit } from "./rate-limit";
import { isAllowedOrigin } from "./origin";

export function forbiddenOrigin() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export function tooManyRequests(retryAfter: number) {
  return NextResponse.json(
    { error: "Слишком много запросов. Попробуйте позже." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}

export function guardMutation(
  req: Request,
  opts: { limit: number; windowMs: number; key: string }
): NextResponse | null {
  if (!isAllowedOrigin(req)) return forbiddenOrigin();

  const ip = getClientIp(req);
  const result = rateLimit(`${opts.key}:${ip}`, opts.limit, opts.windowMs);
  if (!result.ok) return tooManyRequests(result.retryAfter);

  return null;
}

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, response: null };
}

export function safeUserProfile(row: Record<string, unknown>) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    lastName: row.last_name ?? row.lastName ?? null,
    englishLevel: row.english_level ?? row.englishLevel ?? null,
    ieltsTargetBand: row.ielts_target_band ?? row.ieltsTargetBand ?? null,
    learningGoal: row.learning_goal ?? row.learningGoal ?? null,
    totalXp: row.total_xp ?? row.totalXp ?? 0,
    currentLevel: row.current_level ?? row.currentLevel ?? 1,
    streakCount: row.streak_count ?? row.streakCount ?? 0,
  };
}
