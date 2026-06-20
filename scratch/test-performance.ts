import * as react from "react";
(react as any).cache = (fn: any) => fn;

import { getPglite } from "../lib/pglite";
import { getDashboardData } from "../lib/data";

async function run() {
  console.log("--- Performance Test ---");
  
  const startDb = performance.now();
  const db = await getPglite();
  const endDb = performance.now();
  console.log(`getPglite() took ${endDb - startDb} ms`);

  // Let's test a simple query
  const startQuery = performance.now();
  const res = await db.query("SELECT 1");
  const endQuery = performance.now();
  console.log(`Simple SELECT 1 took ${endQuery - startQuery} ms`);

  // Let's get a user ID to test with
  const userRes = await db.query<{ id: string }>("SELECT id FROM users LIMIT 1");
  const userId = userRes.rows[0]?.id;
  
  if (!userId) {
    console.log("No users found in database!");
    await db.close();
    return;
  }
  
  console.log(`Testing with user ID: ${userId}`);

  // Test getDashboardData
  for (let i = 1; i <= 3; i++) {
    const startDash = performance.now();
    const data = await getDashboardData(userId);
    const endDash = performance.now();
    console.log(`Attempt ${i}: getDashboardData() took ${endDash - startDash} ms`);
  }

  await db.close();
}

run().catch(console.error);
