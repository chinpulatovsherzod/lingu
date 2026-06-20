import { NextResponse } from "next/server";
import { deleteMentorChat, getMentorChat } from "@/lib/mentor/store";
import { guardMutation, requireSession } from "@/lib/security/api-guard";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { session, response } = await requireSession();
  if (response) return response;

  const chat = await getMentorChat(session!.user!.id, params.id);
  if (!chat) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json(chat);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const blocked = guardMutation(req, { key: "mentor-delete", limit: 30, windowMs: 60 * 60 * 1000 });
  if (blocked) return blocked;

  const { session, response } = await requireSession();
  if (response) return response;

  await deleteMentorChat(session!.user!.id, params.id);
  return NextResponse.json({ ok: true });
}
