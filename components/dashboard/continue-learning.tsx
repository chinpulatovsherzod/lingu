"use client";



import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import { Badge } from "@/components/ui/badge";

import { useI18n } from "@/components/i18n/locale-provider";



export function ContinueLearningPanel({

  lessons,

}: {

  lessons: {

    id: string;

    title: string;

    type: string;

    progress: number;

    cefrLevel: string;

  }[];

}) {

  const { t } = useI18n();



  return (

    <Card>

      <CardHeader>

        <CardTitle>{t.dashboard.continueLearning}</CardTitle>

      </CardHeader>

      <CardContent className="space-y-3">

        {lessons.length === 0 ? (

          <p className="text-sm text-muted-foreground">{t.dashboard.continueEmpty}</p>

        ) : (

          lessons.map((l) => (

            <Link

              key={l.id}

              href={`/lessons/${l.id}`}

              className="block rounded-lg border border-border p-3 transition-colors hover:border-primary/40"

            >

              <div className="mb-2 flex items-center justify-between gap-2">

                <span className="font-medium">{l.title}</span>

                <Badge variant="secondary">{l.cefrLevel}</Badge>

              </div>

              <Progress value={l.progress} />

            </Link>

          ))

        )}

      </CardContent>

    </Card>

  );

}

