import { translate as googleTranslate } from "google-translate-api-x";
import { geminiGenerate } from "@/lib/llm/gemini";

export type TranslateLang = "en" | "ru" | "uz";

const MAX_CHARS = 1500;

const DEEPL_CODES: Record<TranslateLang, string> = {
  en: "EN",
  ru: "RU",
  uz: "UZ", // DeepL may reject — we fall back to Google
};

function isBadTranslation(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("mymemory warning") ||
    lower.includes("quota exceeded") ||
    lower.includes("invalid language")
  );
}

async function translateWithGemini(
  text: string,
  source: TranslateLang,
  target: TranslateLang
): Promise<string | null> {
  try {
    const langNames: Record<TranslateLang, string> = {
      en: "English",
      ru: "Russian",
      uz: "Uzbek",
    };
    const res = await geminiGenerate({
      system: `You are a professional dictionary and translator. 
If the input text is a single word:
1. Translate it and describe its meaning, usage, and translations at different CEFR levels (e.g. A1, A2, B1, B2, C1, C2) where relevant. 
2. Write the explanations and translations in ${langNames[target]}.
3. Format it clearly with section headers (e.g. "• A1-A2:", "• B1-B2:", "• C1-C2:"), bullet points, and brief examples.
4. Keep the overall description under 1000 characters total.

If the input text is a phrase or sentence:
1. Translate it directly and naturally into ${langNames[target]}.
2. Do not include any explanations, notes, or extra formatting.`,
      messages: [
        {
          role: "user",
          content: `Translate this from ${langNames[source]} to ${langNames[target]}:\n\n${text}`,
        },
      ],
      temperature: 0.1,
    });
    return res.text?.trim() || null;
  } catch {
    return null;
  }
}

async function translateWithDeepL(
  text: string,
  source: TranslateLang,
  target: TranslateLang
): Promise<string | null> {
  const apiKey = process.env.DEEPL_API_KEY?.trim();
  if (!apiKey) return null;
  if (source === "uz" || target === "uz") return null;

  const base = apiKey.endsWith(":fx") ? "https://api-free.deepl.com" : "https://api.deepl.com";
  const body = new URLSearchParams();
  body.set("auth_key", apiKey);
  body.set("text", text);
  body.set("source_lang", DEEPL_CODES[source]);
  body.set("target_lang", DEEPL_CODES[target]);

  const res = await fetch(`${base}/v2/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { translations?: { text: string }[] };
  const translated = data.translations?.[0]?.text?.trim();
  return translated || null;
}

async function translateWithGoogle(
  text: string,
  source: TranslateLang,
  target: TranslateLang
): Promise<string | null> {
  try {
    const result = await googleTranslate(text, {
      from: source,
      to: target,
      forceTo: true,
    });
    const translated = result.text?.trim();
    if (!translated || isBadTranslation(translated)) return null;
    return translated;
  } catch {
    return null;
  }
}

async function translateWithMyMemory(
  text: string,
  source: TranslateLang,
  target: TranslateLang
): Promise<string | null> {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", `${source}|${target}`);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    responseStatus?: number;
    responseData?: { translatedText?: string };
  };

  const translated = data.responseData?.translatedText?.trim();
  if (!translated || data.responseStatus !== 200 || isBadTranslation(translated)) return null;
  if (translated.toUpperCase() === text.toUpperCase() && source !== target) return null;
  return translated;
}

export async function translateText(
  text: string,
  source: TranslateLang,
  target: TranslateLang
): Promise<string> {
  const trimmed = text.trim().slice(0, MAX_CHARS);
  if (!trimmed) return "";
  if (source === target) return trimmed;

  const providers = [
    () => translateWithGemini(trimmed, source, target),
    () => translateWithDeepL(trimmed, source, target),
    () => translateWithGoogle(trimmed, source, target),
    () => translateWithMyMemory(trimmed, source, target),
  ];

  for (const provider of providers) {
    const result = await provider();
    if (result) return result;
  }

  if (source !== "en" && target !== "en") {
    const viaEn = await translateWithGoogle(trimmed, source, "en");
    if (viaEn) {
      const second = await translateWithGoogle(viaEn, "en", target);
      if (second) return second;
    }
  }

  throw new Error("Translation unavailable");
}

export function pickVocabularyEntry(
  sourceText: string,
  targetText: string,
  sourceLang: TranslateLang,
  targetLang: TranslateLang
) {
  const source = sourceText.trim();
  const target = targetText.trim();
  if (targetLang === "en") {
    return { word: target, definition: source };
  }
  if (sourceLang === "en") {
    return { word: source, definition: target };
  }
  return { word: source.slice(0, 120), definition: target };
}
