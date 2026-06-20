import { getPglite } from "@/lib/pglite";

type PgliteUserRow = {
  id: string;
  email: string;
  name: string | null;
  last_name?: string | null;
  english_level: string | null;
  learning_goal: string | null;
  ielts_target_band: number | null;
  total_xp: number;
  current_level: number;
  streak_count: number;
  weekly_goal_minutes: number;
  created_at: string;
};

export async function pgliteUserHeaderStats(id: string) {
  const db = await getPglite();
  const res = await db.query<{
    name: string | null;
    streak_count: number;
    total_xp: number;
  }>(`SELECT name, streak_count, total_xp FROM users WHERE id = $1`, [id]);
  return res.rows[0] ?? null;
}

export async function pgliteFindUserById(id: string) {
  const db = await getPglite();
  const baseSql = `SELECT id, email, name, english_level, learning_goal, ielts_target_band,
            total_xp, current_level, streak_count, weekly_goal_minutes, created_at
     FROM users WHERE id = $1`;

  try {
    const res = await db.query<PgliteUserRow>(
      `SELECT id, email, name, last_name, english_level, learning_goal, ielts_target_band,
              total_xp, current_level, streak_count, weekly_goal_minutes, created_at
       FROM users WHERE id = $1`,
      [id]
    );
    return res.rows[0] ?? null;
  } catch (err) {
    if (!String(err).includes("last_name")) throw err;
    const res = await db.query<PgliteUserRow>(baseSql, [id]);
    const row = res.rows[0];
    if (!row) return null;
    return { ...row, last_name: null };
  }
}

export async function pgliteListLessons(userId: string) {
  const db = await getPglite();
  const res = await db.query<{
    id: string;
    title: string;
    description: string;
    type: string;
    cefr_level: string;
    duration_minutes: number;
    xp_reward: number;
    is_ielts: boolean;
    order_index: number;
    current_step: number | null;
    is_completed: boolean | null;
    step_count: number;
  }>(
    `SELECT l.*, p.current_step, p.is_completed,
      (SELECT COUNT(*)::int FROM lesson_steps s WHERE s.lesson_id = l.id) as step_count
     FROM lessons l
     LEFT JOIN user_lesson_progress p ON p.lesson_id = l.id AND p.user_id = $1
     ORDER BY l.order_index`,
    [userId]
  );
  return res.rows;
}

export async function pgliteGetLessonWithSteps(lessonId: string, userId: string) {
  const db = await getPglite();
  const lesson = await db.query(`SELECT * FROM lessons WHERE id = $1`, [lessonId]);
  const steps = await db.query(
    `SELECT * FROM lesson_steps WHERE lesson_id = $1 ORDER BY order_index`,
    [lessonId]
  );
  const progress = await db.query(
    `SELECT * FROM user_lesson_progress WHERE lesson_id = $1 AND user_id = $2`,
    [lessonId, userId]
  );
  return {
    lesson: lesson.rows[0],
    steps: steps.rows,
    progress: progress.rows[0] ?? null,
  };
}

export async function pgliteUserWordCount(userId: string) {
  const db = await getPglite();
  const res = await db.query<{ count: number }>(
    `SELECT COUNT(*)::int as count FROM user_words WHERE user_id = $1`,
    [userId]
  );
  return res.rows[0]?.count ?? 0;
}

export async function pgliteInProgressLessons(userId: string, limit = 4) {
  const db = await getPglite();
  const res = await db.query<{
    lesson_id: string;
    title: string;
    type: string;
    cefr_level: string;
    current_step: number;
  }>(
    `SELECT p.lesson_id, l.title, l.type, l.cefr_level, p.current_step
     FROM user_lesson_progress p
     JOIN lessons l ON l.id = p.lesson_id
     WHERE p.user_id = $1 AND p.is_completed = false
     ORDER BY p.current_step DESC
     LIMIT $2`,
    [userId, limit]
  );
  return res.rows;
}

export async function pgliteLatestIeltsTest(userId: string) {
  const db = await getPglite();
  const res = await db.query<{
    reading_band: number | null;
    listening_band: number | null;
    writing_band: number | null;
    speaking_band: number | null;
    overall_band: number | null;
  }>(
    `SELECT reading_band, listening_band, writing_band, speaking_band, overall_band
     FROM ielts_tests WHERE user_id = $1 ORDER BY taken_at DESC LIMIT 1`,
    [userId]
  );
  return res.rows[0] ?? null;
}
