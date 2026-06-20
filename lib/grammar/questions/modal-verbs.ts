import type { GrammarQuestion } from "../types";

export const QUESTIONS: GrammarQuestion[] = [
  {
    id: "mod-01",
    question: "I ______ swim when I was five.",
    options: ["can", "could", "must", "should"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Use 'could' for general ability in the past."
  },
  {
    id: "mod-02",
    question: "You ______ wear a seatbelt while driving.",
    options: ["might", "should", "must", "can"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "'Must' expresses strong obligation/rule."
  },
  {
    id: "mod-03",
    question: "Students ______ submit the assignment by Friday.",
    options: ["have to", "might", "could", "may"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "'Have to' is used for external obligation."
  },
  {
    id: "mod-04",
    question: "It ______ rain later, so take an umbrella.",
    options: ["must", "might", "should", "have to"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Might' indicates possibility."
  },
  {
    id: "mod-05",
    question: "______ I borrow your pen, please?",
    options: ["Must", "Should", "May", "Have to"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "'May I...?' is a polite way to ask permission."
  },
  {
    id: "mod-06",
    question: "You look tired. You ______ go to bed early.",
    options: ["might", "should", "mustn't", "can"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Should' is used for advice."
  },
  {
    id: "mod-07",
    question: "I ______ finish this report today; it's urgent.",
    options: ["can", "must", "might", "could"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Must' expresses necessity from the speaker."
  },
  {
    id: "mod-08",
    question: "When I was younger, I ______ run 10 kilometers easily.",
    options: ["can", "could", "may", "must"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Could' is past ability."
  },
  {
    id: "mod-09",
    question: "Visitors ______ park here; it's prohibited.",
    options: ["don't have to", "mustn't", "might not", "shouldn't have"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Mustn't' means prohibition."
  },
  {
    id: "mod-10",
    question: "Do we ______ wear uniforms at your school?",
    options: ["must", "have to", "should", "can"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Questions with obligation commonly use 'have to'."
  },
  {
    id: "mod-11",
    question: "You ______ speak so loudly; the baby is sleeping.",
    options: ["mustn't", "don't have to", "shouldn't", "can't"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "'Shouldn't' gives advice to avoid an action."
  },
  {
    id: "mod-12",
    question: "She ______ be at home; her car is outside.",
    options: ["might", "must", "can", "should"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Must' can express strong logical deduction."
  },
  {
    id: "mod-13",
    question: "______ you help me carry this box?",
    options: ["May", "Could", "Must", "Have to"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Could you...?' is a polite request."
  },
  {
    id: "mod-14",
    question: "You ______ pay now; you can pay later.",
    options: ["mustn't", "shouldn't", "don't have to", "can't"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "'Don't have to' means no necessity."
  },
  {
    id: "mod-15",
    question: "I ______ be wrong, but I think this is the right street.",
    options: ["must", "may", "have to", "should"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'May' expresses possibility/uncertainty."
  },
  {
    id: "mod-16",
    question: "Drivers ______ stop when the traffic light is red.",
    options: ["can", "must", "might", "should"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Traffic rules require 'must'."
  },
  {
    id: "mod-17",
    question: "You ______ eat more vegetables if you want to stay healthy.",
    options: ["might", "should", "mustn't", "couldn't"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Should' gives recommendation."
  },
  {
    id: "mod-18",
    question: "He ______ speak three languages by the age of ten.",
    options: ["can", "could", "must", "may"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Past ability takes 'could'."
  },
  {
    id: "mod-19",
    question: "Employees ______ use their ID cards to enter the building.",
    options: ["have to", "may", "should", "could"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "'Have to' indicates company policy/requirement."
  },
  {
    id: "mod-20",
    question: "There are dark clouds. It ______ snow tonight.",
    options: ["must", "can", "might", "have to"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "'Might' is used for possible future events."
  },
  {
    id: "mod-21",
    question: "______ I ask you a quick question?",
    options: ["Must", "Could", "Should", "Have to"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Could I...?' is a polite form for permission."
  },
  {
    id: "mod-22",
    question: "You ______ forget to lock the door before leaving.",
    options: ["mustn't", "don't have to", "might", "can"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "'Mustn't' warns that something is not allowed/very important not to do."
  },
  {
    id: "mod-23",
    question: "I ______ go to the dentist tomorrow; I have an appointment.",
    options: ["may", "must", "can", "should"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Must' expresses strong necessity."
  },
  {
    id: "mod-24",
    question: "We ______ leave early today because the meeting was canceled.",
    options: ["mustn't", "don't have to", "shouldn't", "can't"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "No need = 'don't have to'."
  },
  {
    id: "mod-25",
    question: "She ______ join us later if she finishes work on time.",
    options: ["must", "might", "has to", "should"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Might' shows possibility."
  },
  {
    id: "mod-26",
    question: "At school, we ______ wear black shoes every day.",
    options: ["have to", "could", "may", "might"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "School rule -> external obligation -> 'have to'."
  },
  {
    id: "mod-27",
    question: "You ______ talk during the exam.",
    options: ["don't have to", "mustn't", "might not", "should"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Exam rule prohibits talking, so 'mustn't'."
  },
  {
    id: "mod-28",
    question: "I ______ understand this question. Can you explain it?",
    options: ["can't", "mustn't", "don't have to", "shouldn't"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "'Can't' expresses lack of ability."
  },
  {
    id: "mod-29",
    question: "You ______ check your email more often.",
    options: ["might", "should", "mustn't", "have to"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Advice is best expressed with 'should'."
  },
  {
    id: "mod-30",
    question: "He ______ be in his office; the lights are on.",
    options: ["might", "must", "should", "could"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Strong deduction from evidence uses 'must'."
  },
  {
    id: "mod-31",
    question: "______ you play the guitar?",
    options: ["Must", "Can", "Should", "Have to"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Can' asks about ability."
  },
  {
    id: "mod-32",
    question: "Passengers ______ smoke on the plane.",
    options: ["don't have to", "can't", "might", "should"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Can't' indicates prohibition in this context."
  },
  {
    id: "mod-33",
    question: "You look pale. You ______ see a doctor.",
    options: ["might", "should", "mustn't", "have to"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Medical recommendation uses 'should'."
  },
  {
    id: "mod-34",
    question: "During the storm, we ______ hear the thunder from miles away.",
    options: ["must", "could", "should", "may"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Could' expresses past ability/perception."
  },
  {
    id: "mod-35",
    question: "You ______ bring your own towel; the hotel provides one.",
    options: ["mustn't", "don't have to", "can't", "shouldn't"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "No necessity is expressed with 'don't have to'."
  },
  {
    id: "mod-36",
    question: "The answer ______ be correct; I checked it twice.",
    options: ["must", "might", "could", "may"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "'Must' shows strong certainty."
  },
  {
    id: "mod-37",
    question: "______ I leave early today, please?",
    options: ["Should", "May", "Must", "Have to"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'May I...?' requests permission politely."
  },
  {
    id: "mod-38",
    question: "If you want better results, you ______ practice every day.",
    options: ["might", "should", "could", "mustn't"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Should' gives practical advice."
  },
  {
    id: "mod-39",
    question: "We ______ hear the music from outside the hall.",
    options: ["can", "must", "have to", "should"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "'Can' is used for present ability/perception."
  },
  {
    id: "mod-40",
    question: "You ______ submit the form online or in person.",
    options: ["can", "mustn't", "have to", "shouldn't"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "'Can' offers available options/possibility."
  }
];
