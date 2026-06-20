export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const secret = process.env.NEXTAUTH_SECRET ?? "";
  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    console.error("[security] NEXTAUTH_SECRET must be at least 32 characters in production");
  }
}
