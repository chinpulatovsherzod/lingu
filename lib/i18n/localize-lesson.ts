import type { ExampleSentence, TenseTopic } from "@/lib/lessons/tenses";
import type { Locale, Messages } from "./types";

export function getExampleTranslation(example: ExampleSentence, locale: Locale): string {
  if (locale === "en") return example.ru;
  return example.ru;
}

export function getLocalizedLessonTopic(topic: TenseTopic, locale: Locale, t: Messages) {
  const meta = t.lessons.topics[topic.slug];
  const title = meta?.title ?? (locale === "ru" ? topic.titleRu : topic.title);
  const purpose = meta?.purpose ?? topic.purpose;
  const groupLabel = t.lessons.groups[topic.group] ?? topic.groupRu;

  return {
    ...topic,
    displayTitle: title,
    displaySubtitle: locale === "en" ? topic.titleRu : topic.title,
    purpose,
    groupLabel,
    formulaLabels: {
      affirmative: topic.formulaLabels?.affirmative ?? t.lessons.affirmative,
      negative: topic.formulaLabels?.negative ?? t.lessons.negative,
      question: topic.formulaLabels?.question ?? t.lessons.question,
    },
  };
}
