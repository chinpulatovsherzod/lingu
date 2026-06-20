import Link from "next/link";

import { TENSE_GROUPS, TENSE_TOPICS } from "@/lib/lessons/tenses";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { BookOpen, Clock, Layers } from "lucide-react";

import { getServerI18n } from "@/lib/i18n";



const icons = {

  book: BookOpen,

  clock: Clock,

  layers: Layers,

};



export default async function LessonsPage() {

  const { t } = await getServerI18n();



  return (

    <div className="space-y-8">

      <div>

        <h1 className="font-heading text-3xl font-bold">{t.lessons.title}</h1>

        <p className="mt-1 text-muted-foreground">{t.lessons.subtitle}</p>

        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{t.lessons.description}</p>

      </div>



      {TENSE_GROUPS.map((group) => {

        const topics = TENSE_TOPICS.filter((tpc) => tpc.group === group.id);

        if (topics.length === 0) return null;

        const groupLabel = t.lessons.groups[group.id] ?? group.label;



        return (

          <section key={group.id} className="space-y-4">

            <h2 className="font-heading text-xl font-semibold">{groupLabel}</h2>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {topics.map((topic) => {

                const Icon = icons[topic.icon];

                const meta = t.lessons.topics[topic.slug];

                return (

                  <Link key={topic.slug} href={`/lessons/${topic.slug}`}>

                    <Card className="h-full transition-colors hover:border-primary/50">

                      <CardHeader>

                        <div className="flex items-start justify-between gap-2">

                          <Icon className="h-8 w-8 shrink-0 text-primary" />

                          <Badge>{topic.level}</Badge>

                        </div>

                        <CardTitle className="text-lg">{meta?.title ?? topic.title}</CardTitle>

                        <CardDescription>{topic.title}</CardDescription>

                      </CardHeader>

                      <CardContent>

                        <p className="line-clamp-2 text-sm text-muted-foreground">{meta?.purpose ?? topic.purpose}</p>

                        <p className="mt-3 font-mono text-xs text-accent">{topic.example.en}</p>

                      </CardContent>

                    </Card>

                  </Link>

                );

              })}

            </div>

          </section>

        );

      })}

    </div>

  );

}

