"use client";

import Link from "next/link";
import { ExampleSentence, TenseTopic } from "@/lib/lessons/tenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/locale-provider";
import { getLocalizedLessonTopic, getExampleTranslation } from "@/lib/i18n/localize-lesson";
import { getLessonQuizzes } from "@/lib/lessons/quizzes";
import { LessonPracticeQuiz } from "@/components/lesson/lesson-practice-quiz";

export function TenseTopicView({ topic }: { topic: TenseTopic }) {
  const { locale, t } = useI18n();
  const localized = getLocalizedLessonTopic(topic, locale, t);
  const quizzes = getLessonQuizzes(topic.slug);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/lessons"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "inline-flex w-fit")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t.lessons.back}
      </Link>

      <div>
        <div className="mb-2 flex flex-wrap gap-2">
          <Badge>{topic.level}</Badge>
          <Badge variant="secondary">{localized.groupLabel}</Badge>
        </div>
        <h1 className="font-heading text-3xl font-bold">{localized.displayTitle}</h1>
        <p className="text-lg text-muted-foreground">{localized.displaySubtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.lessons.purposeTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{localized.purpose}</p>
        </CardContent>
      </Card>

      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="text-base">{t.lessons.mainExample}</CardTitle>
        </CardHeader>
        <CardContent>
          <ExampleBlock example={topic.example} locale={locale} />
        </CardContent>
      </Card>

      {topic.formulas && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.lessons.formulasTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormulaBlock
              label={localized.formulaLabels.affirmative}
              formula={topic.formulas.affirmative}
              examples={topic.formulas.examples.affirmative}
              locale={locale}
            />
            <FormulaBlock
              label={localized.formulaLabels.negative}
              formula={topic.formulas.negative}
              examples={topic.formulas.examples.negative}
              locale={locale}
            />
            <FormulaBlock
              label={localized.formulaLabels.question}
              formula={topic.formulas.question}
              examples={topic.formulas.examples.question}
              locale={locale}
            />
            {topic.formulas.note && (
              <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">{topic.formulas.note}</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.lessons.rulesTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {topic.rules.map((item) => (
            <div key={item.rule} className="space-y-3">
              <p className="text-sm font-medium">{item.rule}</p>
              <div className="space-y-2 rounded-lg border border-border/60 bg-muted/30 p-3">
                {item.examples.map((ex) => (
                  <ExampleBlock key={ex.en} example={ex} compact locale={locale} />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {topic.extra?.map((block) => (
        <Card key={block.title}>
          <CardHeader>
            <CardTitle className="text-base">{block.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{block.content}</p>
          </CardContent>
        </Card>
      ))}

      <LessonPracticeQuiz quizzes={quizzes} labels={t.lessons.quiz} locale={locale} />
    </div>
  );
}

function FormulaBlock({
  label,
  formula,
  examples,
  locale,
}: {
  label: string;
  formula: string;
  examples: ExampleSentence[];
  locale: ReturnType<typeof useI18n>["locale"];
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
        <code className="block rounded-lg bg-muted px-3 py-2 font-mono text-sm">{formula}</code>
      </div>
      <div className="space-y-2 pl-1">
        {examples.map((ex) => (
          <ExampleBlock key={ex.en} example={ex} compact locale={locale} />
        ))}
      </div>
    </div>
  );
}

function ExampleBlock({
  example,
  compact,
  locale,
}: {
  example: ExampleSentence;
  compact?: boolean;
  locale: ReturnType<typeof useI18n>["locale"];
}) {
  const translation = getExampleTranslation(example, locale);
  return (
    <div className={compact ? "space-y-0.5" : "space-y-2"}>
      <p className={compact ? "text-sm font-medium text-accent" : "text-lg font-medium text-accent"}>
        {example.en}
      </p>
      <p className="text-sm text-muted-foreground">{translation}</p>
    </div>
  );
}
