type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 60 * 1000;

function cleanupExpired(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS && buckets.size < MAX_BUCKETS) {
    return;
  }
  lastCleanup = now;
  for (const [key, b] of buckets.entries()) {
    if (now >= b.resetAt) {
      buckets.delete(key);
    }
  }
  if (buckets.size > MAX_BUCKETS) {
    const keysToDelete = Array.from(buckets.keys()).slice(0, 1000);
    for (const k of keysToDelete) {
      buckets.delete(k);
    }
  }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  cleanupExpired(now);

  const entry = buckets.get(key);

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }

  entry.count += 1;
  return { ok: true };
}
