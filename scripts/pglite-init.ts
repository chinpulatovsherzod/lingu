import { execSync } from "child_process";
import { PGlite } from "@electric-sql/pglite";
import { NodeFS } from "@electric-sql/pglite/nodefs";
import path from "path";

const dataDir = path.join(process.cwd(), "prisma", "pglite-data");

async function main() {
  console.log("Initializing PGlite at prisma/pglite-data ...");

  const sql = execSync(
    "npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script",
    { encoding: "utf-8" }
  );

  const db = await PGlite.create(dataDir, { fs: new NodeFS(dataDir) });

  // Execute full migration script (PGlite supports multi-statement exec)
  await db.exec(sql);

  await db.close();
  console.log("PGlite schema applied.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
