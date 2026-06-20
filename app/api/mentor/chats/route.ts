import { NextResponse } from "next/server";
import { listMentorChats } from "@/lib/mentor/store";
import { requireSession } from "@/lib/security/api-guard";

export async function GET() {
  const { session, response } = await requireSession();
  if (response) return response;

  const chats = await listMentorChats(session!.user!.id);
  return NextResponse.json({ chats });
}
