import type { GrammarQuestion } from "../types";

export const QUESTIONS: GrammarQuestion[] = [
  {
    id: "pass-01",
    question: "The report ______ by the manager yesterday.",
    options: ["wrote", "was written", "is written", "has written"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Past simple passive is formed with was/were + past participle."
  },
  {
    id: "pass-02",
    question: "English ______ in many countries.",
    options: ["speaks", "is spoken", "was spoken", "has spoken"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "General facts use present simple passive: is/are + past participle."
  },
  {
    id: "pass-03",
    question: "The windows ______ every week.",
    options: ["clean", "are cleaned", "were cleaned", "have cleaned"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Regular actions use present simple passive."
  },
  {
    id: "pass-04",
    question: "The bridge ______ next year.",
    options: ["completes", "will complete", "will be completed", "is completing"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Future passive uses will be + past participle."
  },
  {
    id: "pass-05",
    question: "My bike ______ last night.",
    options: ["stole", "was stolen", "is stolen", "has stolen"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Completed past action in passive: was/were + past participle."
  },
  {
    id: "pass-06",
    question: "Dinner ______ when we arrived.",
    options: ["served", "was being served", "is serving", "has been serving"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Past continuous passive: was/were being + past participle."
  },
  {
    id: "pass-07",
    question: "A new library ______ in our town recently.",
    options: ["opened", "has opened", "has been opened", "was opening"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Present perfect passive: has/have been + past participle."
  },
  {
    id: "pass-08",
    question: "The movie ______ by a famous director.",
    options: ["directed", "was directed", "was directing", "has directed"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Use by-agent to name who did the action in passive."
  },
  {
    id: "pass-09",
    question: "The letters ______ tomorrow morning.",
    options: ["send", "are sent", "will be sent", "were sent"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Future passive: will be sent."
  },
  {
    id: "pass-10",
    question: "This phone ______ in Korea.",
    options: ["made", "is made", "is making", "has made"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Present simple passive for manufacturing facts."
  },
  {
    id: "pass-11",
    question: "The room ______ right now.",
    options: ["cleans", "is cleaned", "is being cleaned", "was cleaned"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Present continuous passive: is/are being + past participle."
  },
  {
    id: "pass-12",
    question: "By the time we arrived, the cake ______.",
    options: ["had eaten", "had been eaten", "was eaten", "has been eaten"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Past perfect passive: had been + past participle."
  },
  {
    id: "pass-13",
    question: "The email ______ yet.",
    options: ["hasn't sent", "hasn't been sent", "wasn't sent", "isn't sent"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Present perfect passive negative uses has/have not been + participle."
  },
  {
    id: "pass-14",
    question: "The wall needs ______.",
    options: ["paint", "to paint", "painting", "painted"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "After 'need', gerund can have passive meaning: 'needs painting'."
  },
  {
    id: "pass-15",
    question: "She got ______ in the final round.",
    options: ["eliminate", "eliminating", "eliminated", "to eliminate"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "'Get-passive' uses get + past participle."
  },
  {
    id: "pass-16",
    question: "How often ______ this machine ______?",
    options: ["does / service", "is / serviced", "was / serviced", "has / serviced"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Present simple passive question form: is/are + subject + past participle."
  },
  {
    id: "pass-17",
    question: "The decision ______ at the meeting tomorrow.",
    options: ["will make", "will be made", "is made", "was made"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Future passive is required because the object receives the action."
  },
  {
    id: "pass-18",
    question: "Three people ______ in the accident.",
    options: ["injured", "were injured", "are injuring", "have injure"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Past simple passive for completed past events."
  },
  {
    id: "pass-19",
    question: "The classroom ______ before the students arrived.",
    options: ["cleaned", "had cleaned", "had been cleaned", "has been cleaned"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Past perfect passive marks an earlier past action."
  },
  {
    id: "pass-20",
    question: "This song ______ by millions of people every day.",
    options: ["listen", "is listened", "is listened to", "listens"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "With phrasal/prepositional verbs, keep the preposition in passive: listened to."
  },
  {
    id: "pass-21",
    question: "The package ______ while it was being delivered.",
    options: ["damaged", "was damaged", "is damaged", "has damaged"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Past simple passive is correct for the main completed event."
  },
  {
    id: "pass-22",
    question: "A lot of trees ______ in this area each year.",
    options: ["cut down", "are cut down", "were cut down", "have cut down"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Present simple passive for repeated annual actions."
  },
  {
    id: "pass-23",
    question: "The article ______ by Friday.",
    options: ["will finish", "will have finished", "will have been finished", "has been finished"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Future perfect passive: will have been + past participle."
  },
  {
    id: "pass-24",
    question: "He ______ by everyone in the office.",
    options: ["likes", "is liked", "is liking", "was liked"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Present simple passive expresses a general state."
  },
  {
    id: "pass-25",
    question: "The final match ______ on Sunday.",
    options: ["plays", "will play", "will be played", "is playing"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Scheduled event in passive often uses future passive."
  },
  {
    id: "pass-26",
    question: "Their house ______ at the moment.",
    options: ["renovates", "is renovating", "is being renovated", "was renovated"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Present continuous passive describes action in progress."
  },
  {
    id: "pass-27",
    question: "I ______ my wallet stolen on the bus.",
    options: ["got", "was", "had", "did"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "Get-passive can express unpleasant events: 'got my wallet stolen'."
  },
  {
    id: "pass-28",
    question: "The suspects ______ by the police last night.",
    options: ["arrested", "were arrested", "are arrested", "have arrested"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Past simple passive with agent phrase if needed."
  },
  {
    id: "pass-29",
    question: "Not much ______ about the incident so far.",
    options: ["knows", "is known", "was known", "has known"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Known' functions in a passive structure: is known."
  },
  {
    id: "pass-30",
    question: "When I arrived, the documents ______.",
    options: ["were photocopying", "were being photocopied", "are photocopied", "had photocopied"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Past continuous passive describes an ongoing action in the past."
  },
  {
    id: "pass-31",
    question: "The old theater ______ into a museum next year.",
    options: ["turns", "will turn", "will be turned", "is turning"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Future passive for planned transformations."
  },
  {
    id: "pass-32",
    question: "Our flight ______ because of bad weather.",
    options: ["canceled", "was canceled", "is canceling", "has cancel"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Past event in passive takes was/were + past participle."
  },
  {
    id: "pass-33",
    question: "The problem ______ yet.",
    options: ["hasn't solved", "hasn't been solved", "wasn't solved", "isn't solve"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Present perfect passive negative: hasn't been solved."
  },
  {
    id: "pass-34",
    question: "The winner ______ a gold medal by the president.",
    options: ["presented", "was presented", "was presented with", "is presenting"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Use 'presented with' when mentioning what someone receives."
  },
  {
    id: "pass-35",
    question: "These files ______ in a secure folder.",
    options: ["keep", "are kept", "were keeping", "have kept"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Present simple passive: are kept."
  },
  {
    id: "pass-36",
    question: "He ______ for the role after three auditions.",
    options: ["chose", "was chosen", "is choosing", "has chose"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Past simple passive of choose is 'was chosen'."
  },
  {
    id: "pass-37",
    question: "The room got ______ very quickly.",
    options: ["fill", "filled", "filling", "to fill"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Get-passive uses get + past participle: got filled."
  },
  {
    id: "pass-38",
    question: "By noon, all the invitations ______.",
    options: ["sent", "had sent", "had been sent", "have been sent"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Past perfect passive for action completed before a past time."
  },
  {
    id: "pass-39",
    question: "The lesson ______ by Mr. Brown today.",
    options: ["teaches", "is taught", "was taught", "has taught"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Present simple passive for scheduled/classroom context."
  },
  {
    id: "pass-40",
    question: "By next month, the road repairs ______.",
    options: ["will finish", "will have finished", "will have been finished", "are finished"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Future perfect passive indicates completion before a future point."
  }
];
