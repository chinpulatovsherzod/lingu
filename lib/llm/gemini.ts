export type LlmMessage = { role: "user" | "assistant"; content: string };

export function getGeminiApiKey(): string | null {
  const gemini = process.env.GEMINI_API_KEY?.trim();
  if (gemini) return gemini;

  const fallback = process.env.OPENAI_API_KEY?.trim();
  if (fallback && (fallback.startsWith("AIza") || fallback.startsWith("AQ."))) {
    return fallback;
  }
  return null;
}

export function isOpenAiKey(key?: string | null) {
  return !!key?.startsWith("sk-");
}

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-2.0-flash"];

export async function geminiGenerate(params: {
  system: string;
  messages: LlmMessage[];
  json?: boolean;
  temperature?: number;
}): Promise<{ text: string | null; status?: number }> {
  const key = getGeminiApiKey();
  if (!key) return { text: null };

  const contents = params.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body = {
    systemInstruction: { parts: [{ text: params.system }] },
    contents,
    generationConfig: {
      temperature: params.temperature ?? 0.35,
      ...(params.json ? { responseMimeType: "application/json" } : {}),
    },
  };

  let lastStatus: number | undefined;

  for (const model of GEMINI_MODELS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    lastStatus = res.status;

    if (res.ok) {
      const data = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
      return { text, status: res.status };
    }

    if (res.status === 404 || res.status === 429) continue;
    break;
  }

  return { text: null, status: lastStatus };
}
