import type { ExplainedQuizItem } from "@/lib/quiz/types";
import type { ReadingVocabEntry } from "./vocabulary";

export type ReadingQuestion = ExplainedQuizItem & { id: string };

export type ReadingPassage = {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  vocabulary?: ReadingVocabEntry[];
  questions: ReadingQuestion[];
};

export type ReadingTest = {
  id: string;
  title: string;
  passages: ReadingPassage[];
  source: "official" | "ai";
};
