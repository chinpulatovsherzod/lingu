export type ExplainedOption = {
  text: string;
  explanation: string;
};

export type ExplainedQuizItem = {
  id?: string;
  question: string;
  options: [ExplainedOption, ExplainedOption, ExplainedOption, ExplainedOption];
  correctIndex: number;
};

export type ExplainedQuizLabels = {
  correct: string;
  notQuite: string;
  checkAnswer?: string;
  next?: string;
  finish?: string;
  practice?: string;
};
