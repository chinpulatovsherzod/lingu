import type { GrammarQuestion } from "../types";

export const QUESTIONS: GrammarQuestion[] = [
  {
    id: "art-01",
    question: "I saw ______ elephant at the zoo.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Use 'an' before a vowel sound."
  },
  {
    id: "art-02",
    question: "She bought ______ new laptop yesterday.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "Use 'a' for singular countable nouns mentioned for the first time."
  },
  {
    id: "art-03",
    question: "______ sun rises in the east.",
    options: ["A", "An", "The", "No article"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Use 'the' with unique things like the sun."
  },
  {
    id: "art-04",
    question: "I need ______ information about the course.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "'Information' is uncountable, so no indefinite article."
  },
  {
    id: "art-05",
    question: "Can you pass me ______ salt, please?",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Use 'the' for specific shared context items."
  },
  {
    id: "art-06",
    question: "He is ______ honest person.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Honest' begins with a vowel sound, so use 'an'."
  },
  {
    id: "art-07",
    question: "We had ______ great time at the party.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "'A great time' is a common singular countable phrase."
  },
  {
    id: "art-08",
    question: "______ Mount Everest is the highest mountain.",
    options: ["A", "An", "The", "No article"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "Most mountain names take no article."
  },
  {
    id: "art-09",
    question: "My brother is ______ engineer.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Professions use 'a/an'; 'engineer' begins with a vowel sound."
  },
  {
    id: "art-10",
    question: "I usually drink ______ coffee in the morning.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "'Coffee' is uncountable in general meaning, so no article."
  },
  {
    id: "art-11",
    question: "She opened ______ window and looked outside.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "First mention of a singular countable noun takes 'a'."
  },
  {
    id: "art-12",
    question: "Could you close ______ window, please?",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Second mention of the same noun takes 'the'."
  },
  {
    id: "art-13",
    question: "They visited ______ United Kingdom last summer.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Country names with plural/kingdom/republic often take 'the'."
  },
  {
    id: "art-14",
    question: "I need ______ umbrella; it's raining.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Umbrella' starts with a vowel sound, so use 'an'."
  },
  {
    id: "art-15",
    question: "______ children need love and support.",
    options: ["A", "An", "The", "No article"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "Use zero article for plural nouns in general statements."
  },
  {
    id: "art-16",
    question: "He plays ______ guitar very well.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Musical instruments usually take 'the' after 'play'."
  },
  {
    id: "art-17",
    question: "She has ______ long hair.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "'Hair' is uncountable in this meaning, so no article."
  },
  {
    id: "art-18",
    question: "We stayed at ______ small hotel near the beach.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "Use 'a' for first mention of a singular countable noun."
  },
  {
    id: "art-19",
    question: "______ Pacific Ocean is huge.",
    options: ["A", "An", "The", "No article"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Names of oceans take 'the'."
  },
  {
    id: "art-20",
    question: "My father is in ______ hospital right now.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "In standard international usage, this specific place often takes 'the'."
  },
  {
    id: "art-21",
    question: "She gave me ______ useful advice.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "'Advice' is uncountable, so no indefinite article."
  },
  {
    id: "art-22",
    question: "I saw ______ movie you recommended.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Use 'the' when both speaker and listener know which one."
  },
  {
    id: "art-23",
    question: "He wants to become ______ actor.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "Professions use 'a/an'; 'actor' starts with a vowel sound."
  },
  {
    id: "art-24",
    question: "______ milk in this fridge is fresh.",
    options: ["A", "An", "The", "No article"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Specific milk in a known fridge takes 'the'."
  },
  {
    id: "art-25",
    question: "Do you have ______ pen I can borrow?",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "Any one pen, not specific, so use 'a'."
  },
  {
    id: "art-26",
    question: "They go to ______ school by bus.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "In institutional use ('go to school'), use zero article."
  },
  {
    id: "art-27",
    question: "I have ______ idea for our project.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 1,
    explanation: "'Idea' begins with a vowel sound, so use 'an'."
  },
  {
    id: "art-28",
    question: "She is reading ______ book I gave her.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "The noun is specific because of the defining clause."
  },
  {
    id: "art-29",
    question: "______ life can be unpredictable.",
    options: ["A", "An", "The", "No article"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "Abstract nouns in general meaning often take no article."
  },
  {
    id: "art-30",
    question: "We had lunch at ______ restaurant near my office.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "First mention of a singular countable noun takes 'a'."
  },
  {
    id: "art-31",
    question: "______ Nile is the longest river in Africa.",
    options: ["A", "An", "The", "No article"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Names of rivers take 'the'."
  },
  {
    id: "art-32",
    question: "My sister studies ______ medicine at university.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "Academic subjects usually take zero article."
  },
  {
    id: "art-33",
    question: "Could you turn off ______ lights, please?",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Specific lights in the current context require 'the'."
  },
  {
    id: "art-34",
    question: "He bought ______ kilo of apples.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "Use 'a' before singular measure nouns like 'a kilo'."
  },
  {
    id: "art-35",
    question: "She works as ______ teacher in my town.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "Professions take 'a/an' when singular."
  },
  {
    id: "art-36",
    question: "I prefer ______ tea to coffee.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "Uncountable nouns used generally take no article."
  },
  {
    id: "art-37",
    question: "They reached ______ airport at 6 a.m.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Specific destination known in context takes 'the'."
  },
  {
    id: "art-38",
    question: "He is ______ university student.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 0,
    explanation: "'University' starts with /juː/ consonant sound, so use 'a'."
  },
  {
    id: "art-39",
    question: "______ Japanese is difficult for me to learn.",
    options: ["A", "An", "The", "No article"] as [string, string, string, string],
    correctIndex: 3,
    explanation: "Languages normally take zero article."
  },
  {
    id: "art-40",
    question: "Let's meet at ______ station near your house.",
    options: ["a", "an", "the", "no article"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "Both speakers know which station is meant, so use 'the'."
  }
];
