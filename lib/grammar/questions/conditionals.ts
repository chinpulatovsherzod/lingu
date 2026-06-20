import type { GrammarQuestion } from "../types";

export const QUESTIONS: GrammarQuestion[] = [
  {
    id: "cond-01",
    question: "If you heat water to 100°C, it ______.",
    options: ["boils", "will boil", "would boil", "boiled"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "Zero conditional uses present simple in both clauses for general truths."
  },
  {
    id: "cond-02",
    question: "If it rains tomorrow, we ______ at home.",
    options: ["stay", "stayed", "will stay", "would stay"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "First conditional: if + present simple, main clause with 'will'."
  },
  {
    id: "cond-03",
    question: "If I ______ more free time, I would learn Spanish.",
    options: ["have", "had", "will have", "had had"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Second conditional uses if + past simple for unreal present situations."
  },
  {
    id: "cond-04",
    question: "If they had left earlier, they ______ the train.",
    options: ["caught", "would catch", "would have caught", "had caught"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Third conditional: if + past perfect, main clause + would have + past participle."
  },
  {
    id: "cond-05",
    question: "You won't pass the exam unless you ______ harder.",
    options: ["study", "studied", "will study", "would study"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "'Unless' means 'if not' and is followed by present simple."
  },
  {
    id: "cond-06",
    question: "If I ______ you, I would apologize.",
    options: ["am", "was", "were", "had been"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "In formal second conditional, 'If I were you' is the standard form."
  },
  {
    id: "cond-07",
    question: "If she ______ me, I'll tell her the truth.",
    options: ["calls", "called", "will call", "would call"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "First conditional uses present simple in the if-clause."
  },
  {
    id: "cond-08",
    question: "If we had known about the traffic, we ______ earlier.",
    options: ["leave", "would leave", "would have left", "had left"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Third conditional describes an unreal past result."
  },
  {
    id: "cond-09",
    question: "If you ______ ice, it melts.",
    options: ["heat", "heated", "will heat", "would heat"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "Zero conditional states scientific facts with present simple."
  },
  {
    id: "cond-10",
    question: "I ______ a new car if I won the lottery.",
    options: ["buy", "will buy", "would buy", "would have bought"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Second conditional main clause uses 'would' + base verb."
  },
  {
    id: "cond-11",
    question: "If he doesn't hurry, he ______ late.",
    options: ["is", "was", "will be", "would be"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "First conditional predicts a likely future result."
  },
  {
    id: "cond-12",
    question: "If they ______ the instructions, they wouldn't have made that mistake.",
    options: ["follow", "followed", "had followed", "would follow"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Third conditional if-clause requires past perfect."
  },
  {
    id: "cond-13",
    question: "Unless you ______ now, you'll miss the bus.",
    options: ["leave", "left", "will leave", "would leave"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "After 'unless', use present simple for future meaning."
  },
  {
    id: "cond-14",
    question: "I wish I ______ play the piano.",
    options: ["can", "could", "will", "have"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Wish' for present ability uses 'could'."
  },
  {
    id: "cond-15",
    question: "She wishes she ______ so much work every day.",
    options: ["doesn't have", "didn't have", "hadn't had", "won't have"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "For present unreal situations after 'wish', use past simple."
  },
  {
    id: "cond-16",
    question: "If I had seen your message, I ______ you.",
    options: ["called", "will call", "would have called", "had called"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Third conditional describes a missed action in the past."
  },
  {
    id: "cond-17",
    question: "If we ______ enough money, we'll go on holiday.",
    options: ["have", "had", "will have", "would have"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "First conditional if-clause takes present simple."
  },
  {
    id: "cond-18",
    question: "If he ______ so fast, he wouldn't be tired now.",
    options: ["didn't run", "hadn't run", "doesn't run", "won't run"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Mixed conditional: past cause ('hadn't run') with present result."
  },
  {
    id: "cond-19",
    question: "If I ______ earlier, I catch the 7 a.m. train.",
    options: ["wake up", "woke up", "had woken up", "will wake up"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "Zero conditional can describe routine results with present simple."
  },
  {
    id: "cond-20",
    question: "If you press this button, the machine ______.",
    options: ["starts", "started", "will start", "would start"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "For instructions/general result, zero conditional with present simple."
  },
  {
    id: "cond-21",
    question: "If she ______ more confident, she would speak in public.",
    options: ["is", "was", "were", "had been"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Second conditional with 'were' for unreal present situations."
  },
  {
    id: "cond-22",
    question: "You'll feel better if you ______ some rest.",
    options: ["get", "got", "will get", "would get"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "First conditional: present simple after 'if'."
  },
  {
    id: "cond-23",
    question: "If they had invited me, I ______ to the party.",
    options: ["go", "would go", "would have gone", "had gone"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Third conditional main clause uses 'would have gone'."
  },
  {
    id: "cond-24",
    question: "I wish we ______ that decision yesterday.",
    options: ["didn't make", "hadn't made", "don't make", "wouldn't make"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "For regret about the past with 'wish', use past perfect."
  },
  {
    id: "cond-25",
    question: "Unless he ______ soon, we'll start without him.",
    options: ["arrives", "arrived", "will arrive", "would arrive"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "'Unless' + present simple is used for future conditions."
  },
  {
    id: "cond-26",
    question: "If I ______ the answer, I would tell you.",
    options: ["know", "knew", "had known", "will know"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Second conditional if-clause takes past simple."
  },
  {
    id: "cond-27",
    question: "If the weather ______ nice, we'll have a picnic.",
    options: ["is", "was", "will be", "would be"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "In first conditional, do not use 'will' after 'if'."
  },
  {
    id: "cond-28",
    question: "If he had listened to me, he ______ in trouble now.",
    options: ["isn't", "won't be", "wouldn't be", "hadn't been"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Mixed conditional: unreal past action with present consequence."
  },
  {
    id: "cond-29",
    question: "If plants don't get sunlight, they ______.",
    options: ["die", "will die", "would die", "died"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "Zero conditional for universal truths uses present simple."
  },
  {
    id: "cond-30",
    question: "If you ______ him, please ask him to call me.",
    options: ["see", "saw", "will see", "would see"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "First conditional if-clause remains in present simple."
  },
  {
    id: "cond-31",
    question: "I wish I ______ to work tomorrow.",
    options: ["don't have to go", "didn't have to go", "hadn't had to go", "won't have to go"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Wish' for an unwanted present/future situation uses past simple."
  },
  {
    id: "cond-32",
    question: "If they ______ more carefully, they wouldn't make so many errors.",
    options: ["read", "reads", "had read", "would read"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "Second conditional can use present simple form in if-clause for plural subject."
  },
  {
    id: "cond-33",
    question: "If I ______ enough time yesterday, I would have helped you.",
    options: ["had", "have", "had had", "would have"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Third conditional if-clause uses past perfect: 'had had'."
  },
  {
    id: "cond-34",
    question: "Unless you ______ your password, you can't log in.",
    options: ["remember", "remembered", "will remember", "would remember"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "'Unless' introduces a real condition and takes present simple."
  },
  {
    id: "cond-35",
    question: "If he ______ late again, the teacher will be angry.",
    options: ["arrive", "arrives", "arrived", "would arrive"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "First conditional requires present simple in the if-clause."
  },
  {
    id: "cond-36",
    question: "If I were rich, I ______ around the world.",
    options: ["travel", "will travel", "would travel", "would have traveled"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Second conditional main clause: would + base verb."
  },
  {
    id: "cond-37",
    question: "If you hadn't reminded me, I ______ the meeting.",
    options: ["miss", "would miss", "would have missed", "had missed"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Third conditional result clause uses 'would have' + participle."
  },
  {
    id: "cond-38",
    question: "I wish it ______ raining right now.",
    options: ["isn't", "wasn't", "weren't", "hadn't been"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "For present unreal situations after 'wish', use past subjunctive 'weren't'."
  },
  {
    id: "cond-39",
    question: "If we mix red and blue, we ______ purple.",
    options: ["get", "will get", "would get", "got"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "Zero conditional for general result uses present simple."
  },
  {
    id: "cond-40",
    question: "If she ______ harder, she would have passed the exam.",
    options: ["studies", "studied", "had studied", "would study"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Third conditional if-clause needs past perfect."
  }
];
