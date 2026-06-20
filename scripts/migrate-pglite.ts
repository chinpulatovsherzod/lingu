import { PGlite } from "@electric-sql/pglite";
import { NodeFS } from "@electric-sql/pglite/nodefs";
import path from "path";

async function main() {
  const dataDir = path.join(process.cwd(), "prisma", "pglite-data");
  const db = await PGlite.create(dataDir, { fs: new NodeFS(dataDir) });
  await db.exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;`);
  await db.close();
  console.log("Migration applied: last_name column");
}

main().catch(console.error);
