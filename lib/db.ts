import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPglite, isPgliteMode } from "@/lib/pglite";

export type DbClient = PrismaClient | Awaited<ReturnType<typeof getPglite>>;

export async function getDb(): Promise<DbClient> {
  if (isPgliteMode()) {
    const db = await getPglite();
    return db;
  }
  return prisma;
}

export function isPglite(db: DbClient): db is Awaited<ReturnType<typeof getPglite>> {
  return isPgliteMode();
}
