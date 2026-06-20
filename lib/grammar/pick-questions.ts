import type { GrammarQuestion } from "./types";

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pickTestQuestions(
  pool: GrammarQuestion[],
  count: number,
  attempt: number
): GrammarQuestion[] {
  const timePart = Date.now() % 100000;
  const seed = attempt * 10007 + timePart + pool.length;
  return seededShuffle(pool, seed).slice(0, Math.min(count, pool.length));
}
