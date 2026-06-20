import OpenAI from "openai";
import type { ReadingTest } from "@/lib/ielts/reading/types";
import { geminiGenerate, getGeminiApiKey, isOpenAiKey } from "@/lib/llm/gemini";
import { buildMentorUserMessage } from "@/lib/mentor/context";
import { getLocalMentorReply } from "@/lib/mentor/local-mentor";
import type { Locale } from "@/lib/i18n/types";

export function getOpenAI() {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key || !isOpenAiKey(key)) return null;
  return new OpenAI({ apiKey: key });
}

export async function scoreWritingEssay(params: {
  task: 1 | 2;
  prompt: string;
  essay: string;
}) {
  const client = getOpenAI();
  if (!client) {
    return {
      band: 6.5,
      criteria: {
        taskAchievement: 6.5,
        coherence: 6.5,
        lexicalResource: 6.5,
        grammar: 6.5,
      },
      feedback:
        "Sample evaluation shown. Detailed examiner feedback will appear after full review.",
    };
  }

  const res = await client.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are an IELTS writing examiner. Return JSON: band (number), criteria {taskAchievement, coherence, lexicalResource, grammar}, feedback (string with specific improvements).",
      },
      {
        role: "user",
        content: `Task ${params.task}\nPrompt: ${params.prompt}\nEssay:\n${params.essay}`,
      },
    ],
  });

  const text = res.choices[0]?.message?.content ?? "{}";
  return JSON.parse(text);
}

const DEMO_READING_PRACTICE: ReadingTest = {
  id: "demo-ai-reading",
  title: "Extra Practice — Urban Biodiversity",
  source: "ai",
  passages: [
    {
      id: "demo-p1",
      title: "Urban Biodiversity Corridors",
      content: `City planners increasingly design green corridors—linear parks, restored riverbanks, and tree-lined streets—to connect fragmented habitats. Research from several European capitals shows that even narrow strips of native vegetation allow small mammals, pollinators, and birds to move between larger parks, reducing genetic isolation.

Corridors work best when they include varied plant layers and minimal night-time lighting, which disorients nocturnal species. Community gardens contribute unexpectedly by supplying flowering plants across seasons. Critics argue that corridors cannot replace extensive reserves, yet data suggest they raise species richness in districts that would otherwise be ecological dead zones.

Maintenance costs are lower than building new suburban parks because corridors often reuse vacant land along railways or canals. The challenge is political: developers may resist set-asides that reduce buildable area. Where ordinances require biodiversity impact assessments, corridors have become standard mitigation measures.`,
      vocabulary: [
        { word: "fragmented", definition: "broken into separate, disconnected parts" },
        { word: "pollinators", definition: "insects and animals that carry pollen between plants" },
        { word: "nocturnal", definition: "active at night" },
        { word: "species richness", definition: "the number of different species in an area" },
        { word: "set-asides", definition: "land reserved for a specific purpose, not built on" },
        { word: "ordinances", definition: "local laws or official regulations" },
        { word: "mitigation", definition: "action taken to reduce harm or negative impact" },
        { word: "biodiversity", definition: "the variety of plant and animal life in a place" },
      ],
      questions: [
        {
          id: "demo-q1",
          question: "Green corridors primarily help wildlife by",
          options: [
            { text: "eliminating the need for large parks", explanation: "The text says corridors cannot replace extensive reserves." },
            { text: "linking separated habitats", explanation: "Corridors connect fragmented habitats so species can move between parks." },
            { text: "increasing night-time lighting", explanation: "Minimal lighting is preferred because bright light disorients nocturnal species." },
            { text: "replacing all community gardens", explanation: "Community gardens complement corridors; they are not replaced." },
          ],
          correctIndex: 1,
        },
        {
          id: "demo-q2",
          question: "According to the passage, community gardens are valuable because they",
          options: [
            { text: "provide flowers throughout the year", explanation: "They supply flowering plants across seasons." },
            { text: "block predators from urban areas", explanation: "Predators are not discussed." },
            { text: "require no maintenance", explanation: "Maintenance is discussed for corridors, not as zero for gardens." },
            { text: "replace railway land entirely", explanation: "Railway land is reused for corridors, not replaced by gardens." },
          ],
          correctIndex: 0,
        },
        {
          id: "demo-q3",
          question: "One economic advantage of corridors is that they",
          options: [
            { text: "often use land that is already undeveloped", explanation: "They reuse vacant land along railways or canals, lowering costs." },
            { text: "generate more profit for developers", explanation: "Developers may resist set-asides that reduce buildable area." },
            { text: "remove the need for impact assessments", explanation: "Ordinances require biodiversity impact assessments." },
            { text: "depend on expensive suburban expansion", explanation: "Costs are lower than building new suburban parks." },
          ],
          correctIndex: 0,
        },
        {
          id: "demo-q4",
          question: "The author's attitude toward corridors is that they are",
          options: [
            { text: "a complete solution to urban ecology", explanation: "Critics note they cannot replace large reserves." },
            { text: "useful but not sufficient on their own", explanation: "They improve richness but cannot replace extensive reserves." },
            { text: "too costly for any city to implement", explanation: "Maintenance costs are described as relatively low." },
            { text: "harmful to pollinator populations", explanation: "Pollinators benefit from connected habitats." },
          ],
          correctIndex: 1,
        },
        {
          id: "demo-q5",
          question: "Corridors become standard mitigation when",
          options: [
            { text: "cities ban all new construction", explanation: "Construction continues with mitigation requirements." },
            { text: "laws require biodiversity impact assessments", explanation: "Where ordinances require assessments, corridors are standard mitigation." },
            { text: "community gardens are eliminated", explanation: "Gardens are presented as helpful, not eliminated." },
            { text: "species richness is already high", explanation: "Corridors help districts that would otherwise be ecological dead zones." },
          ],
          correctIndex: 1,
        },
      ],
    },
  ],
};

function normalizeAiReadingTest(raw: {
  title?: string;
  passage?: string;
  vocabulary?: Array<{ word?: string; definition?: string }>;
  questions?: Array<{
    question?: string;
    options?: Array<{ text?: string; explanation?: string }>;
    correctIndex?: number;
  }>;
}): ReadingTest | null {
  const passage = raw.passage?.trim();
  const title = raw.title?.trim();
  const questions = raw.questions;

  if (!passage || !title || !questions?.length) return null;

  const normalizedQuestions = questions.slice(0, 6).map((item, i) => {
    const opts = (item.options ?? []).slice(0, 4);
    while (opts.length < 4) opts.push({ text: "—", explanation: "—" });

    return {
      id: `ai-q-${i + 1}`,
      question: item.question?.trim() || `Question ${i + 1}`,
      options: opts.map((o) => ({
        text: o.text?.trim() || "—",
        explanation: o.explanation?.trim() || "—",
      })) as [
        { text: string; explanation: string },
        { text: string; explanation: string },
        { text: string; explanation: string },
        { text: string; explanation: string },
      ],
      correctIndex: Math.min(Math.max(item.correctIndex ?? 0, 0), 3),
    };
  });

  if (normalizedQuestions.length < 4) return null;

  const vocabulary = (raw.vocabulary ?? [])
    .map((v) => ({
      word: v.word?.trim() ?? "",
      definition: v.definition?.trim() ?? "",
    }))
    .filter((v) => v.word.length > 0 && v.definition.length > 0)
    .slice(0, 12);

  return {
    id: `ai-${Date.now()}`,
    title,
    source: "ai",
    passages: [
      {
        id: `ai-p-${Date.now()}`,
        title,
        content: passage,
        vocabulary: vocabulary.length ? vocabulary : undefined,
        questions: normalizedQuestions,
      },
    ],
  };
}

export async function generateReadingPractice(params?: { topic?: string; difficulty?: string }) {
  const client = getOpenAI();
  const topic = params?.topic?.trim() || "an academic topic suitable for IELTS Reading";
  const difficulty = params?.difficulty?.trim() || "Band 6–7";

  if (!client) {
    return {
      ...DEMO_READING_PRACTICE,
      id: `demo-${Date.now()}`,
      _demo: true,
      _message:
        "Sample passage shown for practice.",
    };
  }

  const res = await client.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an IELTS Academic Reading test writer. Return JSON:
{
  "title": "short passage title",
  "passage": "300-400 word academic passage in English",
  "vocabulary": [
    { "word": "exact word as it appears in passage", "definition": "short learner-friendly definition" }
  ],
  "questions": [
    {
      "question": "string",
      "options": [
        { "text": "option A", "explanation": "why correct or why wrong" },
        { "text": "option B", "explanation": "..." },
        { "text": "option C", "explanation": "..." },
        { "text": "option D", "explanation": "..." }
      ],
      "correctIndex": 0
    }
  ]
}
Create exactly 8-10 vocabulary items that literally appear in the passage (use exact spelling from the text).
Create exactly 5 multiple-choice questions. Questions must be answerable only from the passage. Explanations should be concise and educational.`,
      },
      {
        role: "user",
        content: `Topic: ${topic}. Target difficulty: ${difficulty}.`,
      },
    ],
  });

  const text = res.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(text) as Parameters<typeof normalizeAiReadingTest>[0];
  const test = normalizeAiReadingTest(parsed);

  if (!test) {
    return {
      ...DEMO_READING_PRACTICE,
      id: `fallback-${Date.now()}`,
      _demo: true,
      _message: "Sample passage shown for practice.",
    };
  }

  return test;
}

const MENTOR_LOCALE_HINT: Record<string, string> = {
  ru: "Russian",
  en: "English",
  uz: "Uzbek",
};

export async function chatWithMentor(params: {
  message: string;
  locale?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}) {
  const locale = (params.locale ?? "ru") as Locale;
  const lang = MENTOR_LOCALE_HINT[locale] ?? "Russian";

  const history = params.history ?? [];
  const userMessage = buildMentorUserMessage(params.message, history);

  const system = `You are the Lingu Online Mentor — an expert English teacher for students from A1 to C1 and IELTS preparation.

STRICT RULES:
1. Answer the user's question DIRECTLY and SPECIFICALLY. No vague introductions or generic advice.
2. Start with a clear, concrete answer in 1-2 sentences.
3. Then explain with: rules/formulas (for grammar), definitions (for vocabulary), or step-by-step tips (for IELTS).
4. Always include 1-3 real example sentences in English where relevant.
5. If the question is short or vague BUT there is chat history, use the history to understand the topic and answer about THAT topic. Never ask the student to repeat the topic if it was already discussed.
6. Only ask for clarification when there is NO prior context at all.
7. If the question is outside English learning, politely redirect to English/IELTS topics only.
8. Respond in ${lang} (locale: ${locale}). Keep English examples in English.
9. Never mention AI, chatbots, or language models. You are a human-like mentor.
10. Stay under 350 words unless the user explicitly asks for a detailed explanation.`;

  const notices: Record<Locale, { quota: string; error: string }> = {
    ru: {
      quota: "Превышен лимит запросов — показан ответ из учебной базы знаний.",
      error: "Сервис наставника временно недоступен — ответ из учебной базы.",
    },
    en: {
      quota: "Request limit exceeded — knowledge-base answer shown.",
      error: "Mentor service temporarily unavailable — knowledge-base answer shown.",
    },
    uz: {
      quota: "So'rovlar limiti tugagan — darslik bazasidan javob ko'rsatilmoqda.",
      error: "Ustoz vaqtincha ishlamayapti — darslik bazasidan javob.",
    },
  };

  const llmMessages = [
    ...history.slice(-10).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  const client = getOpenAI();

  if (client) {
    try {
      const res = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: system },
          ...llmMessages.map((m) => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.35,
      });
      const reply = res.choices[0]?.message?.content?.trim();
      if (reply) return { reply, source: "live" as const };
    } catch {
      /* fall through to Gemini or local */
    }
  }

  if (getGeminiApiKey()) {
    const { text, status } = await geminiGenerate({
      system,
      messages: llmMessages,
      temperature: 0.35,
    });
    if (text) return { reply: text, source: "live" as const };

    const notice = status === 429 ? notices[locale].quota : notices[locale].error;
    return {
      reply: getLocalMentorReply(params.message, locale, history),
      source: "local" as const,
      notice,
    };
  }

  if (!client) {
    return { reply: getLocalMentorReply(params.message, locale, history) };
  }

  return {
    reply: getLocalMentorReply(params.message, locale, history),
    source: "local" as const,
    notice: notices[locale].quota,
  };
}
