function allowedOrigins(): string[] {
  const origins = new Set<string>();
  const url = process.env.NEXTAUTH_URL;
  if (url) {
    origins.add(url.replace(/\/$/, ""));
  }
  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
  }
  return [...origins];
}

export function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  const allowed = allowedOrigins();
  return allowed.some((base) => origin === base || origin.startsWith(`${base}/`));
}
