import type { GrammarQuestion } from "../types";

export const QUESTIONS: GrammarQuestion[] = [
  {
    id: "pt-01",
    question: "I have ______ my homework already.",
    options: ["finish", "finished", "had finished", "finishing"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Use present perfect with 'already' for a completed action connected to now: 'have finished'."
  },
  {
    id: "pt-02",
    question: "By the time the train arrived, we ______ for two hours.",
    options: ["waited", "have waited", "had waited", "were waiting"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Past perfect shows an earlier past action before another past event."
  },
  {
    id: "pt-03",
    question: "She ______ in London since 2019.",
    options: ["lived", "has lived", "had lived", "lives"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "With 'since' and a starting point, use present perfect: 'has lived'."
  },
  {
    id: "pt-04",
    question: "______ you ______ your homework yet?",
    options: ["Did / finish", "Do / finish", "Have / finished", "Had / finished"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "With 'yet' in questions about unfinished time, use present perfect."
  },
  {
    id: "pt-05",
    question: "He ______ to Paris last year.",
    options: ["has gone", "went", "had gone", "has been"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "A finished past time marker ('last year') requires past simple."
  },
  {
    id: "pt-06",
    question: "By next June, they ______ married for ten years.",
    options: ["are", "have been", "will be", "will have been"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "Future perfect expresses duration up to a specific future point."
  },
  {
    id: "pt-07",
    question: "I ______ this movie three times.",
    options: ["saw", "have seen", "had seen", "was seeing"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Present perfect is used for life experience without a finished time."
  },
  {
    id: "pt-08",
    question: "When I got home, my sister ______ dinner.",
    options: ["has cooked", "cooked", "had already cooked", "was cooked"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Her cooking happened before you got home, so use past perfect."
  },
  {
    id: "pt-09",
    question: "We ______ Tom since Monday.",
    options: ["didn't see", "haven't seen", "hadn't seen", "don't see"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "With 'since' up to now, use present perfect negative."
  },
  {
    id: "pt-10",
    question: "While I was shopping, I ______ an old friend.",
    options: ["have met", "had met", "met", "am meeting"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "A completed event in the past narrative takes past simple."
  },
  {
    id: "pt-11",
    question: "They ______ the project by Friday.",
    options: ["complete", "have completed", "had completed", "will have completed"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "Future perfect is used for an action completed before a future deadline."
  },
  {
    id: "pt-12",
    question: "She ______ just ______ the office.",
    options: ["did / leave", "has / left", "had / left", "was / leaving"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Just' with present relevance commonly uses present perfect."
  },
  {
    id: "pt-13",
    question: "I can't open the door. Someone ______ the key.",
    options: ["broke", "has broken", "had broken", "breaks"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Present perfect focuses on the current result: the key is now broken."
  },
  {
    id: "pt-14",
    question: "How long ______ you ______ English?",
    options: ["did / study", "have / studied", "had / studied", "are / studying"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "For duration continuing to now, use present perfect."
  },
  {
    id: "pt-15",
    question: "He ______ his leg, so he can't play football.",
    options: ["broke", "has broken", "had broken", "breaks"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Use present perfect when a past action has a present consequence."
  },
  {
    id: "pt-16",
    question: "We ______ to that restaurant yesterday.",
    options: ["have gone", "go", "went", "had gone"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "'Yesterday' is a finished past time, so use past simple."
  },
  {
    id: "pt-17",
    question: "By the time the movie started, we ______ our seats.",
    options: ["found", "have found", "had found", "were finding"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Past perfect marks the earlier of two past actions."
  },
  {
    id: "pt-18",
    question: "I ______ my phone! Can you call it?",
    options: ["lost", "have lost", "had lost", "lose"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "The loss affects the present situation, so present perfect is best."
  },
  {
    id: "pt-19",
    question: "She ______ never ______ sushi before last night.",
    options: ["has / eaten", "had / eaten", "did / eat", "was / eating"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Before a past point ('last night'), use past perfect."
  },
  {
    id: "pt-20",
    question: "They ______ each other for years before they got married.",
    options: ["knew", "have known", "had known", "were knowing"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Past perfect expresses duration before another past event."
  },
  {
    id: "pt-21",
    question: "I ______ already ______ that email, so don't resend it.",
    options: ["did / read", "have / read", "had / read", "am / reading"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Use present perfect with 'already' for recently completed actions."
  },
  {
    id: "pt-22",
    question: "When I was a child, we ______ to the seaside every summer.",
    options: ["have gone", "went", "had gone", "go"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Repeated habits in a finished past period use past simple."
  },
  {
    id: "pt-23",
    question: "This is the best book I ______.",
    options: ["read", "had read", "have ever read", "am reading"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "With superlatives and life experience, present perfect is standard."
  },
  {
    id: "pt-24",
    question: "At 8 p.m. yesterday, I ______ TV.",
    options: ["watched", "have watched", "was watching", "had watched"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Past continuous describes an action in progress at a specific past time."
  },
  {
    id: "pt-25",
    question: "He ______ yet, so let's start without him.",
    options: ["didn't arrive", "hasn't arrived", "hadn't arrived", "isn't arriving"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Yet' in negatives typically uses present perfect."
  },
  {
    id: "pt-26",
    question: "By 2030, scientists ______ a better cure.",
    options: ["find", "found", "have found", "will have found"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "Future perfect shows completion before a future year."
  },
  {
    id: "pt-27",
    question: "She ______ in two companies before she joined us.",
    options: ["worked", "has worked", "had worked", "works"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Work experience happened before another past action, so past perfect."
  },
  {
    id: "pt-28",
    question: "______ you ever ______ to Canada?",
    options: ["Did / go", "Have / been", "Had / gone", "Do / go"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "For life experience, use present perfect: 'Have you ever been...?'"
  },
  {
    id: "pt-29",
    question: "I ______ my keys yesterday, but I found them this morning.",
    options: ["have lost", "had lost", "lost", "lose"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "'Yesterday' requires past simple."
  },
  {
    id: "pt-30",
    question: "We ______ for an hour when the bus finally came.",
    options: ["waited", "have waited", "had been waiting", "are waiting"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Past perfect continuous emphasizes duration before a past event."
  },
  {
    id: "pt-31",
    question: "Since we moved here, we ______ much happier.",
    options: ["were", "are", "have been", "had been"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "'Since' linking past to present takes present perfect."
  },
  {
    id: "pt-32",
    question: "I ______ him three times today.",
    options: ["called", "have called", "had called", "am calling"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Today' is unfinished time, so present perfect is natural."
  },
  {
    id: "pt-33",
    question: "After they ______ dinner, they went for a walk.",
    options: ["finished", "have finished", "had finished", "were finishing"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Dinner was completed before another past action, so past perfect."
  },
  {
    id: "pt-34",
    question: "He ______ in this office for six months when he got promoted.",
    options: ["worked", "has worked", "had worked", "works"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "The six-month period ended before promotion, so past perfect."
  },
  {
    id: "pt-35",
    question: "Look! The children ______ all the cake.",
    options: ["ate", "have eaten", "had eaten", "eat"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Present perfect highlights a recent action with visible result now."
  },
  {
    id: "pt-36",
    question: "______ she ______ the report by the deadline?",
    options: ["Has / finished", "Did / finish", "Will / finish", "Will / have finished"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "Future perfect asks about completion before a future time limit."
  },
  {
    id: "pt-37",
    question: "I ______ never ______ such a noisy city.",
    options: ["did / see", "have / seen", "had / seen", "am / seeing"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Present perfect is used for life experience up to now."
  },
  {
    id: "pt-38",
    question: "Before I moved to Tokyo, I ______ abroad.",
    options: ["never lived", "haven't lived", "had never lived", "don't live"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Use past perfect for something true before a past event."
  },
  {
    id: "pt-39",
    question: "When the lights went out, we ______ TV.",
    options: ["watched", "have watched", "were watching", "had watched"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Past continuous sets the background action interrupted by past simple."
  },
  {
    id: "pt-40",
    question: "By the end of this course, you ______ all twelve units.",
    options: ["complete", "completed", "have completed", "will have completed"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "Future perfect indicates completion before a specific future endpoint."
  }
];
