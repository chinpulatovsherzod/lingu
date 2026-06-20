import Link from "next/link";

import { GRAMMAR_TEST_TOPICS, QUESTIONS_PER_TEST } from "@/lib/grammar";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { ClipboardList } from "lucide-react";

import { formatMessage, getServerI18n } from "@/lib/i18n";



export default async function GrammarPage() {

  const { t } = await getServerI18n();



  return (

    <div className="space-y-6">

      <div>

        <h1 className="font-heading text-3xl font-bold">{t.grammar.title}</h1>

        <p className="mt-1 text-muted-foreground">

          {formatMessage(t.grammar.subtitle, { count: QUESTIONS_PER_TEST })}

        </p>

      </div>



      <div className="grid gap-3 md:grid-cols-2">

        {GRAMMAR_TEST_TOPICS.map((topic) => {

          const meta = t.grammar.topics[topic.slug];

          return (

            <Link key={topic.slug} href={`/grammar/${topic.slug}`}>

              <Card className="h-full transition-colors hover:border-primary/50">

                <CardHeader>

                  <div className="flex items-start justify-between gap-2">

                    <ClipboardList className="h-8 w-8 shrink-0 text-primary" />

                    <Badge>{topic.level}</Badge>

                  </div>

                  <CardTitle className="text-lg">{meta?.title ?? topic.title}</CardTitle>

                  <p className="text-sm text-muted-foreground">{topic.title}</p>

                </CardHeader>

                <CardContent>

                  <p className="text-sm text-muted-foreground">{meta?.description ?? topic.description}</p>

                  <p className="mt-3 text-xs text-accent">

                    {formatMessage(t.grammar.questionsCount, { count: QUESTIONS_PER_TEST })} ·{" "}

                    {formatMessage(t.grammar.poolCount, { count: topic.questionPool.length })}

                  </p>

                </CardContent>

              </Card>

            </Link>

          );

        })}

      </div>

    </div>

  );

}

