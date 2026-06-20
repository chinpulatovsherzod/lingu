type PGliteInstance = import("@electric-sql/pglite").PGlite;

const globalPglite = globalThis as unknown as {
  pglite: PGliteInstance | undefined;
  pgliteReady: Promise<PGliteInstance> | undefined;
  schemaReady: boolean | undefined;
};

export function isPgliteMode() {
  return process.env.USE_PGLITE === "true";
}

function getDataDir() {
  const { join } = require("node:path") as typeof import("node:path");
  return join(process.cwd(), "prisma", "pglite-data");
}

function resetPgliteState() {
  globalPglite.pglite = undefined;
  globalPglite.pgliteReady = undefined;
  globalPglite.schemaReady = undefined;
}

async function ensureSchema(db: PGliteInstance) {
  if (globalPglite.schemaReady) return;
  try {
    await db.exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;`);
  } catch {
    /* users table may not exist yet — run npm run db:push */
  }
  try {
    await db.exec(`CREATE INDEX IF NOT EXISTS user_words_user_id_next_review_date_idx ON user_words (user_id, next_review_date);`);
  } catch {
    /* user_words table may not exist yet */
  }
  try {
    await db.exec(`CREATE INDEX IF NOT EXISTS ielts_tests_user_id_taken_at_idx ON ielts_tests (user_id, taken_at DESC);`);
  } catch {
    /* ielts_tests table may not exist yet */
  }
  globalPglite.schemaReady = true;
}

async function createPglite(): Promise<PGliteInstance> {
  const { PGlite } = await import("@electric-sql/pglite");
  const { NodeFS } = await import("@electric-sql/pglite/nodefs");
  const dataDir = getDataDir();

  const db = await PGlite.create(dataDir, {
    fs: new NodeFS(dataDir),
    relaxedDurability: true,
  });

  await ensureSchema(db);
  globalPglite.pglite = db;
  return db;
}

export async function getPglite(): Promise<PGliteInstance> {
  if (globalPglite.pglite?.ready) {
    await ensureSchema(globalPglite.pglite);
    return globalPglite.pglite;
  }

  if (!globalPglite.pgliteReady) {
    globalPglite.pgliteReady = (async () => {
      try {
        return await createPglite();
      } catch (firstError) {
        resetPgliteState();
        try {
          return await createPglite();
        } catch {
          resetPgliteState();
          throw firstError;
        }
      }
    })();
  }

  return globalPglite.pgliteReady;
}
