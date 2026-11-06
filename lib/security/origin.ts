function allowedOrigins(): string[] {
  const origins = new Set<string>();
  origins.add("https://lingu.uz");
  origins.add("https://www.lingu.uz");

  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (nextAuthUrl) {
    origins.add(nextAuthUrl.replace(/\/$/, ""));
  }
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    origins.add(`https://${vercelUrl.replace(/\/$/, "")}`);
  }
  const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProdUrl) {
    origins.add(`https://${vercelProdUrl.replace(/\/$/, "")}`);
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

  try {
    const originUrl = new URL(origin);
    const hostname = originUrl.hostname;

    if (process.env.NODE_ENV !== "production") {
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return true;
      }
    }
  } catch {
    return false;
  }

  const allowed = allowedOrigins();
  return allowed.some((base) => origin === base || origin.startsWith(`${base}/`));
}
