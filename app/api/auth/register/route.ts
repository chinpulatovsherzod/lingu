import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";

import { getPglite, isPgliteMode } from "@/lib/pglite";

import { guardMutation } from "@/lib/security/api-guard";

import { parseJsonBody, registerSchema } from "@/lib/security/validation";

import { BCRYPT_ROUNDS } from "@/lib/security/password";



export async function POST(req: Request) {

  const blocked = guardMutation(req, { key: "register", limit: 5, windowMs: 60 * 60 * 1000 });

  if (blocked) return blocked;



  try {

    const body = await req.json();

    const parsed = parseJsonBody(body, registerSchema);

    if (!parsed) {

      return NextResponse.json({ error: "Некорректные данные регистрации" }, { status: 400 });

    }



    const { email, name, lastName, password, level, goal } = parsed;

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const englishLevel = level && level !== "UNKNOWN" ? level : null;



    if (isPgliteMode()) {

      const db = await getPglite();



      const existing = await db.query<{ id: string }>(

        "SELECT id FROM users WHERE email = $1",

        [email]

      );

      if (existing.rows.length > 0) {

        return NextResponse.json({ error: "Email уже зарегистрирован" }, { status: 400 });

      }



      const id = randomUUID();

      await db.query(

        `INSERT INTO users (

          id, email, name, last_name, password_hash, english_level, learning_goal,

          total_xp, current_level, streak_count, weekly_goal_minutes, created_at, updated_at

        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 1, 0, 150, NOW(), NOW())`,

        [id, email, name, lastName ?? null, passwordHash, englishLevel, goal ?? "IELTS"]

      );



      return NextResponse.json({ id });

    }



    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {

      return NextResponse.json({ error: "Email уже зарегистрирован" }, { status: 400 });

    }



    const user = await prisma.user.create({

      data: {

        email,

        name,

        lastName: lastName ?? null,

        passwordHash,

        englishLevel: englishLevel,

        learningGoal: goal ?? "IELTS",

      },

      select: { id: true },

    });



    return NextResponse.json({ id: user.id });

  } catch (err) {

    console.error("Register error:", err);

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });

  }

}

