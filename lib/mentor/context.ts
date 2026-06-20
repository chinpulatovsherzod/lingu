export type MentorHistoryItem = { role: "user" | "assistant"; content: string };

const VAGUE_RE =
  /(объясни|поясни|расскажи|уточни|что\s+значит|как\s+понять|explain|tell\s+me\s+more|clarify|смысл|перевод|meaning|why|зачем|подробнее|проще|ещё\s+раз|in\s+simple\s+terms)/i;

export function isVagueMentorMessage(message: string): boolean {
  const text = message.trim();
  if (text.length > 140) return false;
  return VAGUE_RE.test(text) || (text.length < 40 && !/[?.!]$/.test(text));
}

export function buildMentorUserMessage(message: string, history?: MentorHistoryItem[]): string {
  if (!history?.length || !isVagueMentorMessage(message)) return message;

  const lastAssistant = [...history].reverse().find((m) => m.role === "assistant");
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  if (!lastAssistant) return message;

  return `[Follow-up to the previous answer]
Student's earlier question: ${lastUser?.content ?? "—"}
Your previous answer (excerpt): ${lastAssistant.content.slice(0, 800)}
Student now asks: ${message}

Answer specifically about the SAME topic from the conversation. Do not ask the student to name the topic again. Give a clear, concrete explanation.`;
}

export function combinedMentorContext(message: string, history?: MentorHistoryItem[]): string {
  if (!history?.length) return message;
  const lastAssistant = [...history].reverse().find((m) => m.role === "assistant");
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  return `${lastUser?.content ?? ""} ${lastAssistant?.content ?? ""} ${message}`;
}
