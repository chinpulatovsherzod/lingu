import type { GrammarTestTopic } from "./types";
import { QUESTIONS as perfectTenses } from "./questions/perfect-tenses";
import { QUESTIONS as pastPerfectSimple } from "./questions/past-perfect-simple";
import { QUESTIONS as pastPerfectContinuous } from "./questions/past-perfect-continuous";
import { QUESTIONS as conditionals } from "./questions/conditionals";
import { QUESTIONS as passiveVoice } from "./questions/passive-voice";
import { QUESTIONS as modalVerbs } from "./questions/modal-verbs";
import { QUESTIONS as articles } from "./questions/articles";
import { QUESTIONS as reportedSpeech } from "./questions/reported-speech";
import { QUESTIONS as compoundAdjectives } from "./questions/compound-adjectives";
import { QUESTIONS as verbPatterns } from "./questions/verb-patterns";

export { QUESTIONS_PER_TEST } from "./types";
export { pickTestQuestions } from "./pick-questions";
export type { GrammarQuestion, GrammarTestTopic } from "./types";

export const GRAMMAR_TEST_TOPICS: GrammarTestTopic[] = [
  {
    slug: "perfect-tenses",
    title: "Perfect Tenses",
    titleRu: "Совершённые времена",
    level: "B1",
    description: "Present, Past и Future Perfect — тест из 20 вопросов.",
    questionPool: perfectTenses,
  },
  {
    slug: "past-perfect-simple",
    title: "Past Perfect Simple",
    titleRu: "Прошедшее совершенное (Past Perfect Simple)",
    level: "B1",
    description: "Had + V3 — действие до другого момента в прошлом. Тест из 20 вопросов.",
    questionPool: pastPerfectSimple,
  },
  {
    slug: "past-perfect-continuous",
    title: "Past Perfect Continuous",
    titleRu: "Прошедшее совершенное длительное",
    level: "B2",
    description: "Had been + V-ing — процесс до момента в прошлом. Тест из 20 вопросов.",
    questionPool: pastPerfectContinuous,
  },
  {
    slug: "conditionals",
    title: "Conditionals",
    titleRu: "Условные предложения",
    level: "B1",
    description: "Zero, First, Second, Third — тест из 20 вопросов.",
    questionPool: conditionals,
  },
  {
    slug: "passive-voice",
    title: "Passive Voice",
    titleRu: "Пассивный залог",
    level: "B2",
    description: "Пассив во всех временах — тест из 20 вопросов.",
    questionPool: passiveVoice,
  },
  {
    slug: "modal-verbs",
    title: "Modal Verbs",
    titleRu: "Модальные глаголы",
    level: "A2",
    description: "Can, must, should, might и др. — тест из 20 вопросов.",
    questionPool: modalVerbs,
  },
  {
    slug: "articles",
    title: "Articles",
    titleRu: "Артикли",
    level: "A1",
    description: "A / an / the / zero article — тест из 20 вопросов.",
    questionPool: articles,
  },
  {
    slug: "reported-speech",
    title: "Reported Speech",
    titleRu: "Косвенная речь (Reported Speech)",
    level: "B2",
    description: "Косвенная речь в утверждениях и вопросах. Тест из 20 вопросов.",
    questionPool: reportedSpeech,
  },
  {
    slug: "compound-adjectives",
    title: "Compound Adjectives",
    titleRu: "Сложные прилагательные (Compound Adjectives)",
    level: "B1",
    description: "Сложные прилагательные (hard-working, self-confident). Тест из 20 вопросов.",
    questionPool: compoundAdjectives,
  },
  {
    slug: "verb-patterns",
    title: "Verb Patterns",
    titleRu: "Глагольные паттерны (Infinitive vs -ing)",
    level: "B2",
    description: "Инфинитив или герундий после глаголов с изменением значения. Тест из 20 вопросов.",
    questionPool: verbPatterns,
  },
];

export function getGrammarTestBySlug(slug: string) {
  return GRAMMAR_TEST_TOPICS.find((t) => t.slug === slug) ?? null;
}
