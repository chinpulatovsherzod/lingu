import { NextResponse } from "next/server";
import { chatWithMentor } from "@/lib/openai";
import {
  addMentorMessage,
  createMentorChat,
  ensureMentorChatAccess,
} from "@/lib/mentor/store";
import { guardMutation, requireSession } from "@/lib/security/api-guard";
import { mentorChatSchema, parseJsonBody } from "@/lib/security/validation";
import { rateLimit } from "@/lib/security/rate-limit";

export async function POST(req: Request) {
  const blocked = guardMutation(req, { key: "mentor-chat", limit: 60, windowMs: 60 * 60 * 1000 });
  if (blocked) return blocked;

  const { session, response } = await requireSession();
  if (response) return response;

  const userId = session!.user!.id;
  const userLimit = rateLimit(`mentor-chat:user:${userId}`, 40, 60 * 60 * 1000);
  if (!userLimit.ok) {
    return NextResponse.json(
      { error: "limit" },
      { status: 429, headers: { "Retry-After": String(userLimit.retryAfter) } }
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = parseJsonBody(body, mentorChatSchema);
  if (!parsed) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  let chatId = parsed.chatId;

  try {
    if (chatId) {
      const ok = await ensureMentorChatAccess(userId, chatId);
      if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
    } else {
      const created = await createMentorChat(userId, parsed.message);
      chatId = created.id;
    }

    await addMentorMessage(chatId, "user", parsed.message);

    const result = await chatWithMentor({
      message: parsed.message,
      locale: parsed.locale,
      history: parsed.history,
    });

    await addMentorMessage(chatId, "assistant", result.reply);

    return NextResponse.json({ ...result, chatId });
  } catch {
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}