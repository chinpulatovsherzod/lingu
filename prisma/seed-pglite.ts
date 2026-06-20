/**
 * Seed через PGlite (без Prisma Client) — для локальной разработки без PostgreSQL.
 */
import { PGlite } from "@electric-sql/pglite";
import { NodeFS } from "@electric-sql/pglite/nodefs";
import bcrypt from "bcryptjs";
import path from "path";
import { randomUUID } from "crypto";

const dataDir = path.join(process.cwd(), "prisma", "pglite-data");

async function main() {
  const db = await PGlite.create(dataDir, { fs: new NodeFS(dataDir) });

  console.log("Seeding PGlite...");

  const tables = [
    "user_achievements",
    "user_words",
    "user_lesson_progress",
    "user_stats_daily",
    "ielts_tests",
    "lesson_steps",
    "lessons",
    "words",
    "grammar_topics",
    "achievements",
    "sessions",
    "accounts",
    "users",
  ];
  for (const t of tables) {
    await db.query(`DELETE FROM ${t}`).catch(() => undefined);
  }

  const userId = randomUUID();
  const hash = await bcrypt.hash("demo1234", 10);

  await db.query(
    `INSERT INTO users (id, email, name, password_hash, english_level, learning_goal, ielts_target_band, total_xp, current_level, streak_count, last_active_date, weekly_goal_minutes, created_at, updated_at)
     VALUES ($1, $2, $3, $4, 'B1', 'IELTS', 7, 1250, 5, 3, NOW(), 150, NOW(), NOW())`,
    [userId, "demo@lingu.uz", "Demo Student", hash]


  );

  const lessonTypes = ["READING", "LISTENING", "WRITING", "SPEAKING", "GRAMMAR", "VOCABULARY"];
  const levels = ["A1", "A2", "B1", "B2", "C1"];
  let order = 0;

  for (const type of lessonTypes) {
    for (let i = 0; i < 2; i++) {
      const lessonId = randomUUID();
      const level = levels[(order + i) % levels.length];
      await db.query(
        `INSERT INTO lessons (id, title, description, type, cefr_level, is_ielts, duration_minutes, xp_reward, order_index, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
        [
          lessonId,
          `${type} Practice ${i + 1} (${level})`,
          `Interactive ${type.toLowerCase()} lesson for ${level} learners.`,
          type,
          level,
          type === "READING" && level === "C1",
          15 + i * 5,
          120 + i * 20,
          order++,
        ]
      );

      const steps = [
        {
          type: "EXPLANATION",
          content: JSON.stringify({ title: "Introduction", body: `Welcome to ${type} lesson.` }),
        },
        {
          type: "VOCABULARY",
          content: JSON.stringify({
            word: "hello",
            part_of_speech: "noun",
            definition: "A greeting",
            example: "Hello!",
          }),
        },
        {
          type: "MCQ",
          content: JSON.stringify({
            question: "Choose the correct sentence.",
            options: ["She go", "She goes", "She going", "She gone"],
            correct_index: 1,
            explanation: "Third person: goes.",
          }),
        },
        {
          type: "FILL_IN_BLANK",
          content: JSON.stringify({
            sentence: "I ___ learning English.",
            answer: "enjoy",
            explanation: "Present simple.",
          }),
        },
      ];

      for (let s = 0; s < steps.length; s++) {
        await db.query(
          `INSERT INTO lesson_steps (id, lesson_id, step_type, order_index, content)
           VALUES ($1, $2, $3, $4, $5)`,
          [randomUUID(), lessonId, steps[s].type, s, steps[s].content]
        );
      }
    }
  }

  const bases = ["learn", "study", "practice", "improve", "speak"];
  for (let li = 0; li < levels.length; li++) {
    for (let bi = 0; bi < bases.length; bi++) {
      const wordId = randomUUID();
      await db.query(
        `INSERT INTO words (id, word, part_of_speech, definition, example_sentence, cefr_level, is_ielts_academic, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          wordId,
          `${bases[bi]}${bi + li}`,
          bi % 2 === 0 ? "verb" : "noun",
          `Definition at ${levels[li]}`,
          `Example at ${levels[li]}.`,
          levels[li],
          li >= 3 && bi < 2,
        ]
      );
      if (li === 0 && bi < 3) {
        await db.query(
          `INSERT INTO user_words (id, user_id, word_id, mastery_status, review_count, next_review_date, ease_factor)
           VALUES ($1, $2, $3, $4, 2, NOW(), 2.5)`,
          [randomUUID(), userId, wordId, bi < 1 ? "MASTERED" : "LEARNING"]
        );
      }
    }
  }

  const grammar = [
    ["perfect-tenses", "Perfect Tenses", "B1"],
    ["conditionals", "Conditionals", "B1"],
    ["passive-voice", "Passive Voice", "B2"],
    ["modal-verbs", "Modal Verbs", "A2"],
    ["articles", "Articles", "A1"],
  ];
  for (let i = 0; i < grammar.length; i++) {
    const [slug, title, level] = grammar[i];
    await db.query(
      `INSERT INTO grammar_topics (id, slug, title, description, cefr_level, content, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        randomUUID(),
        slug,
        title,
        `Master ${title}.`,
        level,
        JSON.stringify({ body: `${title} rules.`, examples: ["Ex 1", "Ex 2"] }),
        i,
      ]
    );
  }

  const achId = randomUUID();
  await db.query(
    `INSERT INTO achievements (id, slug, title, description, icon, xp_reward) VALUES ($1, 'first-lesson', 'First Lesson', 'Complete first lesson', 'book', 50)`,
    [achId]
  );
  await db.query(
    `INSERT INTO user_achievements (id, user_id, achievement_id, earned_at) VALUES ($1, $2, $3, NOW())`,
    [randomUUID(), userId, achId]
  );

  await db.query(
    `INSERT INTO ielts_tests (id, user_id, test_type, reading_band, listening_band, writing_band, speaking_band, overall_band, taken_at)
     VALUES ($1, $2, 'MINI', 6, 6.5, 5.5, 6, 6, NOW())`,
    [randomUUID(), userId]
  );

  const firstLesson = await db.query<{ id: string }>(`SELECT id FROM lessons LIMIT 1`);
  if (firstLesson.rows[0]) {
    await db.query(
      `INSERT INTO user_lesson_progress (id, user_id, lesson_id, current_step, is_completed, updated_at)
       VALUES ($1, $2, $3, 2, false, NOW())`,
      [randomUUID(), userId, firstLesson.rows[0].id]
    );
  }

  await db.close();
  console.log("PGlite seeded! Demo: demo@lingoarc.com / demo1234");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
