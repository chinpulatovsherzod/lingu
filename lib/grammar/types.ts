export type GrammarQuestion = {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  optionExplanations?: [string, string, string, string];
};

export type GrammarTestTopic = {
  slug: string;
  title: string;
  titleRu: string;
  level: string;
  description: string;
  questionPool: GrammarQuestion[];
};

export const QUESTIONS_PER_TEST = 20;
