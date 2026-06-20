import { NextResponse } from "next/server";
import { guardMutation, requireSession } from "@/lib/security/api-guard";
import { parseJsonBody, translateSchema } from "@/lib/security/validation";
import { translateText } from "@/lib/translate";

export async function POST(req: Request) {
  const blocked = guardMutation(req, { key: "translate", limit: 60, windowMs: 60 * 1000 });
  if (blocked) return blocked;

  const { response } = await requireSession();
  if (response) return response;

  const body = await req.json();
  const parsed = parseJsonBody(body, translateSchema);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const translation = await translateText(parsed.text, parsed.source, parsed.target);
    return NextResponse.json({ translation });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 502 });
  }
}
