import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getPglite, isPgliteMode } from "@/lib/pglite";

export type MentorMessageRow = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type MentorChatSummary = {
  id: string;
  title: string;
  updatedAt: string;
};

export type MentorChatDetail = MentorChatSummary & {
  messages: MentorMessageRow[];
};

function titleFromMessage(message: string) {
  const text = message.trim().replace(/\s+/g, " ");
  if (!text) return "New chat";
  return text.length > 56 ? `${text.slice(0, 56)}…` : text;
}

async function ensureMentorTablesPglite() {
  const db = await getPglite();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS mentor_chats (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS mentor_messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL REFERENCES mentor_chats(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS mentor_chats_user_updated ON mentor_chats(user_id, updated_at DESC);
    CREATE INDEX IF NOT EXISTS mentor_messages_chat_created ON mentor_messages(chat_id, created_at);
  `);
}

export async function listMentorChats(userId: string): Promise<MentorChatSummary[]> {
  if (isPgliteMode()) {
    await ensureMentorTablesPglite();
    const db = await getPglite();
    const res = await db.query<{ id: string; title: string; updated_at: string }>(
      `SELECT id, title, updated_at FROM mentor_chats
       WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 50`,
      [userId]
    );
    return res.rows.map((r) => ({
      id: r.id,
      title: r.title,
      updatedAt: r.updated_at,
    }));
  }

  const rows = await prisma.mentorChat.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 50,
    select: { id: true, title: true, updatedAt: true },
  });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function getMentorChat(userId: string, chatId: string): Promise<MentorChatDetail | null> {
  if (isPgliteMode()) {
    await ensureMentorTablesPglite();
    const db = await getPglite();
    const chat = await db.query<{ id: string; title: string; updated_at: string }>(
      `SELECT id, title, updated_at FROM mentor_chats WHERE id = $1 AND user_id = $2`,
      [chatId, userId]
    );
    if (!chat.rows[0]) return null;

    const msgs = await db.query<{ id: string; role: string; content: string; created_at: string }>(
      `SELECT id, role, content, created_at FROM mentor_messages
       WHERE chat_id = $1 ORDER BY created_at ASC`,
      [chatId]
    );

    return {
      id: chat.rows[0].id,
      title: chat.rows[0].title,
      updatedAt: chat.rows[0].updated_at,
      messages: msgs.rows.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        createdAt: m.created_at,
      })),
    };
  }

  const chat = await prisma.mentorChat.findFirst({
    where: { id: chatId, userId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!chat) return null;

  return {
    id: chat.id,
    title: chat.title,
    updatedAt: chat.updatedAt.toISOString(),
    messages: chat.messages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    })),
  };
}

export async function createMentorChat(userId: string, firstMessage: string) {
  const title = titleFromMessage(firstMessage);
  const id = randomUUID();

  if (isPgliteMode()) {
    await ensureMentorTablesPglite();
    const db = await getPglite();
    await db.query(
      `INSERT INTO mentor_chats (id, user_id, title, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [id, userId, title]
    );
    return { id, title };
  }

  const chat = await prisma.mentorChat.create({
    data: { id, userId, title },
    select: { id: true, title: true },
  });
  return chat;
}

export async function addMentorMessage(chatId: string, role: "user" | "assistant", content: string) {
  const id = randomUUID();

  if (isPgliteMode()) {
    await ensureMentorTablesPglite();
    const db = await getPglite();
    await db.query(
      `INSERT INTO mentor_messages (id, chat_id, role, content, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [id, chatId, role, content]
    );
    await db.query(`UPDATE mentor_chats SET updated_at = NOW() WHERE id = $1`, [chatId]);
    return id;
  }

  await prisma.$transaction([
    prisma.mentorMessage.create({
      data: { id, chatId, role, content },
    }),
    prisma.mentorChat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    }),
  ]);
  return id;
}

export async function deleteMentorChat(userId: string, chatId: string) {
  if (isPgliteMode()) {
    await ensureMentorTablesPglite();
    const db = await getPglite();
    await db.query(`DELETE FROM mentor_chats WHERE id = $1 AND user_id = $2`, [chatId, userId]);
    return;
  }

  await prisma.mentorChat.deleteMany({ where: { id: chatId, userId } });
}

export async function ensureMentorChatAccess(userId: string, chatId: string) {
  if (isPgliteMode()) {
    await ensureMentorTablesPglite();
    const db = await getPglite();
    const res = await db.query<{ id: string }>(
      `SELECT id FROM mentor_chats WHERE id = $1 AND user_id = $2`,
      [chatId, userId]
    );
    return !!res.rows[0];
  }

  const row = await prisma.mentorChat.findFirst({
    where: { id: chatId, userId },
    select: { id: true },
  });
  return !!row;
}
