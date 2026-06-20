import { NextResponse } from "next/server";
import { requireSession } from "@/lib/security/api-guard";
import { geminiGenerate, getGeminiApiKey } from "@/lib/llm/gemini";
import { getOpenAI } from "@/lib/openai";

export async function POST(req: Request) {
  const { session, response } = await requireSession();
  if (response) return response;

  let body;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const section = parseInt(body.section, 10) || 1;

  const prompt = `Generate a complete IELTS Listening test for Section ${section}.
Please generate:
- Section 1: A dialogue between 2 people about an everyday social situation (e.g., booking a hotel room, renting a bicycle).
- Section 2: A monologue about an everyday social topic (e.g., a guide explaining a local park's history, a welcome speech for university facilities).
- Section 3: A dialogue between 2-3 people in an educational or training context (e.g., two students discussing a research project with their tutor).
- Section 4: A monologue/lecture on an academic topic (e.g., the history of photography, the migration patterns of whales).

The output must be a valid JSON object matching the following TypeScript type:
{
  title: string;
  section: number;
  audioScript: string;
  audioParagraphs: string[];
  questions: {
    id: string;
    type: "blank" | "choice";
    question: string;
    options: string[] | null;
    correctAnswer: string;
    explanation: string;
  }[];
}

Instructions:
1. Generate exactly 5 questions.
2. Put answer markers like "[1]", "[2]", "[3]", "[4]", "[5]" inside "audioScript" immediately after the sentence that reveals the answer, e.g. "My email address is john@rentals.com [1]".
3. "audioParagraphs" is an array of sentences or speaker lines to be voiced sequentially by the SpeechSynthesis API. Each element must start with the speaker's name if it is a dialogue (e.g. "Agent: Hello", "Customer: Hi there"). Make sure each line is self-contained.
4. If type is "choice", specify 4 logical options. If type is "blank", the correctAnswer must be exactly 1-3 words representing what needs to be written.
5. All text should be in English (for IELTS listening context), but instructions on the page will be in Russian/Uzbek.`;

  const system = "You are an IELTS Listening test creator. Always return strictly valid JSON.";

  let resultJson = null;

  try {
    // 1. Try Gemini
    const key = getGeminiApiKey();
    if (key) {
      const res = await geminiGenerate({
        system,
        messages: [{ role: "user", content: prompt }],
        json: true,
        temperature: 0.4,
      });
      if (res.text) {
        resultJson = JSON.parse(res.text);
      }
    }

    // 2. Try OpenAI fallback
    if (!resultJson) {
      const openai = getOpenAI();
      if (openai) {
        const res = await openai.chat.completions.create({
          model: "gpt-4o",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
        });
        const text = res.choices[0]?.message?.content ?? "{}";
        resultJson = JSON.parse(text);
      }
    }
  } catch (err) {
    console.error("AI Listening generation failed, falling back to mock:", err);
  }

  // 3. Fallback to high quality mock data if AI generation fails or keys are missing
  if (!resultJson) {
    resultJson = getMockListeningTest(section);
  }

  return NextResponse.json(resultJson);
}

function getMockListeningTest(section: number) {
  if (section === 1) {
    return {
      title: "IELTS Listening Section 1 - Gym Membership Inquiry",
      section: 1,
      audioScript: "Clerk: Good morning, City Fitness. How can I help you today? \nCustomer: Hi, I'd like to ask about your gym membership rates. \nClerk: Certainly. First, could I get your full name? \nCustomer: Yes, it's Sarah Jenkins [1]. \nClerk: Thank you, Sarah. And what is your contact phone number? \nCustomer: It's 07911-555-829 [2]. \nClerk: Great. We have two main packages. The Gold package includes pool access and is forty-five pounds per month [3]. \nCustomer: That sounds good. Can I start tomorrow? \nClerk: Yes, tomorrow is the first of June [4]. \nCustomer: Perfect. I'll sign up now. How will you pay? \nCustomer: I'll use my credit card [5].",
      audioParagraphs: [
        "Clerk: Good morning, City Fitness. How can I help you today?",
        "Customer: Hi, I'd like to ask about your gym membership rates.",
        "Clerk: Certainly. First, could I get your full name?",
        "Customer: Yes, it's Sarah Jenkins.",
        "Clerk: Thank you, Sarah. And what is your contact phone number?",
        "Customer: It's 07911-555-829.",
        "Clerk: Great. We have two main packages. The Gold package includes pool access and is forty-five pounds per month.",
        "Customer: That sounds good. Can I start tomorrow?",
        "Clerk: Yes, tomorrow is the first of June.",
        "Customer: Perfect. I'll sign up now. How will you pay?",
        "Customer: I'll use my credit card."
      ],
      questions: [
        {
          id: "q1",
          type: "blank",
          question: "1. Customer Full Name: _______",
          options: null,
          correctAnswer: "Sarah Jenkins",
          explanation: "The customer clearly states: 'Yes, it's Sarah Jenkins.'"
        },
        {
          id: "q2",
          type: "blank",
          question: "2. Contact Phone Number: _______",
          options: null,
          correctAnswer: "07911-555-829",
          explanation: "The customer provides the phone number: 'It's 07911-555-829.'"
        },
        {
          id: "q3",
          type: "choice",
          question: "3. The cost of the Gold Package is:",
          options: ["35 pounds per month", "40 pounds per month", "45 pounds per month", "50 pounds per month"],
          correctAnswer: "45 pounds per month",
          explanation: "The clerk states: 'The Gold package includes pool access and is forty-five pounds per month.'"
        },
        {
          id: "q4",
          type: "blank",
          question: "4. Membership start date: _______",
          options: null,
          correctAnswer: "1st June",
          explanation: "The customer asks to start tomorrow, and the clerk confirms: 'Yes, tomorrow is the first of June.'"
        },
        {
          id: "q5",
          type: "choice",
          question: "5. Preferred payment method:",
          options: ["Cash", "Credit card", "Debit card", "PayPal"],
          correctAnswer: "Credit card",
          explanation: "The customer states: 'I'll use my credit card.'"
        }
      ]
    };
  }

  // Fallback for other sections
  return {
    title: "IELTS Listening Section 4 - Solar Energy Systems",
    section: 4,
    audioScript: "Lecturer: Good morning everyone. Today we are looking at the development of solar power technology [1]. Solar cells operate by absorbing sunlight and converting it directly into electrical energy. The efficiency of early cells was quite low, sitting around six percent [2]. However, modern silicon-based panels reach up to twenty-two percent [3]. One major issue is the storage of this power, which requires high-capacity batteries [4]. In conclusion, solar power represents a vital pillar of the green energy transition [5].",
    audioParagraphs: [
      "Lecturer: Good morning everyone. Today we are looking at the development of solar power technology.",
      "Lecturer: Solar cells operate by absorbing sunlight and converting it directly into electrical energy.",
      "Lecturer: The efficiency of early cells was quite low, sitting around six percent.",
      "Lecturer: However, modern silicon-based panels reach up to twenty-two percent.",
      "Lecturer: One major issue is the storage of this power, which requires high-capacity batteries.",
      "Lecturer: In conclusion, solar power represents a vital pillar of the green energy transition."
    ],
    questions: [
      {
        id: "q1",
        type: "blank",
        question: "1. The lecture is about: solar power _______",
        options: null,
        correctAnswer: "technology",
        explanation: "The lecturer says: 'Today we are looking at the development of solar power technology.'"
      },
      {
        id: "q2",
        type: "choice",
        question: "2. Early solar cells had an efficiency of about:",
        options: ["4 percent", "6 percent", "10 percent", "12 percent"],
        correctAnswer: "6 percent",
        explanation: "The lecturer mentions: 'The efficiency of early cells was quite low, sitting around six percent.'"
      },
      {
        id: "q3",
        type: "blank",
        question: "3. Modern silicon-based panels reach: _______ percent",
        options: null,
        correctAnswer: "22",
        explanation: "The lecturer states: 'silicon-based panels reach up to twenty-two percent.'"
      },
      {
        id: "q4",
        type: "blank",
        question: "4. Storing solar power requires high-capacity: _______",
        options: null,
        correctAnswer: "batteries",
        explanation: "The lecturer mentions: 'requires high-capacity batteries.'"
      },
      {
        id: "q5",
        type: "choice",
        question: "5. Solar power is described as a vital pillar of:",
        options: ["fossil fuels", "urban lighting", "green energy transition", "agricultural heating"],
        correctAnswer: "green energy transition",
        explanation: "The lecturer concludes: 'solar power represents a vital pillar of the green energy transition.'"
      }
    ]
  };
}
