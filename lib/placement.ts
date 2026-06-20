import { EnglishLevel } from "@prisma/client";

export type PlacementQuestion = {
  id: number;
  level: EnglishLevel;
  question: string;
  options: string[];
  correctIndex: number;
  skill: "grammar" | "vocabulary";
};

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: 1,
    level: "A1",
    skill: "vocabulary",
    question: "I ___ a student.",
    options: ["am", "is", "are", "be"],
    correctIndex: 0,
  },
  {
    id: 2,
    level: "A1",
    skill: "grammar",
    question: "She ___ coffee every morning.",
    options: ["drink", "drinks", "drinking", "drank"],
    correctIndex: 1,
  },
  {
    id: 3,
    level: "A2",
    skill: "vocabulary",
    question: "We ___ to the cinema yesterday.",
    options: ["go", "went", "gone", "going"],
    correctIndex: 1,
  },
  {
    id: 4,
    level: "A2",
    skill: "grammar",
    question: "There isn't ___ milk left.",
    options: ["many", "some", "any", "few"],
    correctIndex: 2,
  },
  {
    id: 5,
    level: "B1",
    skill: "vocabulary",
    question: "If I ___ more time, I would travel more.",
    options: ["have", "had", "will have", "would have"],
    correctIndex: 1,
  },
  {
    id: 6,
    level: "B1",
    skill: "grammar",
    question: "The report ___ by Friday.",
    options: ["must submit", "must be submitted", "must submitting", "submits"],
    correctIndex: 1,
  },
  {
    id: 7,
    level: "B2",
    skill: "vocabulary",
    question: "Hardly ___ when the meeting started.",
    options: ["had I arrived", "I had arrived", "I arrived", "did I arrive"],
    correctIndex: 0,
  },
  {
    id: 8,
    level: "B2",
    skill: "grammar",
    question: "She suggested ___ earlier.",
    options: ["to leave", "leaving", "leave", "left"],
    correctIndex: 1,
  },
  {
    id: 9,
    level: "C1",
    skill: "vocabulary",
    question: "The policy was met with ___ from stakeholders.",
    options: ["skepticism", "skeptical", "skeptic", "skeptically"],
    correctIndex: 0,
  },
  {
    id: 10,
    level: "C1",
    skill: "grammar",
    question: "Not until later ___ the full impact.",
    options: ["we realized", "did we realize", "realized we", "we did realize"],
    correctIndex: 1,
  },
];

const LEVEL_ORDER: EnglishLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function determineLevel(correctCount: number, total: number): EnglishLevel {
  const ratio = correctCount / total;
  if (ratio < 0.3) return "A1";
  if (ratio < 0.45) return "A2";
  if (ratio < 0.6) return "B1";
  if (ratio < 0.75) return "B2";
  if (ratio < 0.9) return "C1";
  return "C2";
}

export function nextQuestionIndex(current: number, correct: boolean): number {
  if (correct) return Math.min(current + 1, PLACEMENT_QUESTIONS.length - 1);
  return Math.max(current - 1, 0);
}

export { LEVEL_ORDER };
