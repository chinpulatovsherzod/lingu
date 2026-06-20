import { NextResponse } from "next/server";

import { scoreWritingEssay } from "@/lib/openai";

import { guardMutation, requireSession } from "@/lib/security/api-guard";

import { ieltsWritingSchema, parseJsonBody } from "@/lib/security/validation";

import { rateLimit } from "@/lib/security/rate-limit";



export async function POST(req: Request) {

  const blocked = guardMutation(req, { key: "ielts-writing", limit: 10, windowMs: 60 * 60 * 1000 });

  if (blocked) return blocked;



  const { session, response } = await requireSession();

  if (response) return response;



  const userLimit = rateLimit(`ielts-writing:user:${session!.user!.id}`, 10, 60 * 60 * 1000);

  if (!userLimit.ok) {

    return NextResponse.json(

      { error: "Лимит проверок эссе исчерпан" },

      { status: 429, headers: { "Retry-After": String(userLimit.retryAfter) } }

    );

  }



  const body = await req.json();

  const parsed = parseJsonBody(body, ieltsWritingSchema);

  if (!parsed) {

    return NextResponse.json({ error: "Некорректные данные эссе" }, { status: 400 });

  }



  const result = await scoreWritingEssay({
    task: parsed.task ?? 2,
    prompt: parsed.prompt,
    essay: parsed.essay,
  });



  return NextResponse.json(result);

}

