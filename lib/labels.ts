export const GOAL_LABELS: Record<string, string> = {
  IELTS: "IELTS",
  CAREER: "Карьера",
  TRAVEL: "Путешествия",
  COMMUNICATION: "Общение",
  OTHER: "Другое",
};

export function formatLevel(level: string | null | undefined) {
  if (!level) return "Не определён";
  return level;
}
