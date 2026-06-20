import { z } from "zod";

const englishLevels = z.enum(["A1", "A2", "B1", "B2", "C1", "C2", "UNKNOWN"]);
const learningGoals = z.enum(["IELTS", "CAREER", "TRAVEL", "COMMUNICATION", "OTHER"]);
const srsRatings = z.enum(["again", "hard", "good", "easy"]);

export const registerSchema = z.object({
  email: z.string().email().max(254).transform((v) => v.toLowerCase().trim()),
  name: z.string().trim().min(1).max(80),
  lastName: z.string().trim().max(80).optional().nullable(),
  password: z
    .string()
    .min(8, "Пароль минимум 8 символов")
    .max(128)
    .regex(/[A-Za-z]/, "Пароль должен содержать буквы")
    .regex(/[0-9]/, "Пароль должен содержать цифры"),
  level: englishLevels.optional().nullable(),
  goal: learningGoals.optional(),
});

export const profilePatchSchema = z
  .object({
    englishLevel: englishLevels.optional(),
    ieltsTargetBand: z.number().min(0).max(9).optional(),
    name: z.string().trim().min(1).max(80).optional(),
    lastName: z.string().trim().max(80).optional().nullable(),
  })
  .strict();

export const lessonProgressSchema = z.object({
  currentStep: z.number().int().min(0).max(100).optional(),
  timeSpentSeconds: z.number().int().min(0).max(7200).optional(),
});

export const lessonCompleteSchema = z.object({
  scorePercent: z.number().min(0).max(100).optional(),
  timeSpentSeconds: z.number().int().min(0).max(7200).optional(),
});

export const vocabularyReviewSchema = z.object({
  userWordId: z.string().uuid(),
  rating: srsRatings,
});

const translateLang = z.enum(["en", "ru", "uz"]);

export const translateSchema = z.object({
  text: z.string().min(1).max(1500),
  source: translateLang,
  target: translateLang,
});

export const vocabularySaveSchema = z.object({
  sourceText: z.string().min(1).max(500),
  targetText: z.string().min(1).max(500),
  sourceLang: translateLang,
  targetLang: translateLang,
});

export const ieltsWritingSchema = z.object({
  task: z.union([z.literal(1), z.literal(2)]).optional().default(2),
  prompt: z.string().min(10).max(2000),
  essay: z.string().min(50).max(5000),
});

export const ieltsReadingGenerateSchema = z.object({
  topic: z.string().max(200).optional(),
  difficulty: z.string().max(50).optional(),
});

export const mentorChatSchema = z.object({
  message: z.string().min(1).max(2000),
  locale: translateLang.optional().default("ru"),
  chatId: z.string().min(8).max(64).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      })
    )
    .max(20)
    .optional()
    .default([]),
});

export const uuidSchema = z.string().uuid();

export function parseJsonBody<T>(body: unknown, schema: z.ZodSchema<T>): T | null {
  const result = schema.safeParse(body);
  return result.success ? result.data : null;
}
