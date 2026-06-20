import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { buttonVariants } from "@/components/ui/button";

import { BookOpen, Headphones, PenLine, Mic } from "lucide-react";

import { getServerI18n } from "@/lib/i18n";

import { cn } from "@/lib/utils";



const moduleIcons = {

  reading: BookOpen,

  listening: Headphones,

  writing: PenLine,

  speaking: Mic,

};



const moduleSlugs = ["reading", "listening", "writing", "speaking"] as const;



export default async function IeltsPage() {

  const { t } = await getServerI18n();



  return (

    <div className="space-y-6">

      <div>

        <h1 className="font-heading text-3xl font-bold">{t.ielts.title}</h1>

        <p className="text-muted-foreground">{t.ielts.subtitle}</p>

      </div>

      <div className="grid gap-4 md:grid-cols-2">

        {moduleSlugs.map((slug) => {

          const Icon = moduleIcons[slug];

          const mod = t.ielts.modules[slug];

          return (

            <Card key={slug}>

              <CardHeader>

                <Icon className="h-8 w-8 text-accent" />

                <CardTitle>{mod.title}</CardTitle>

              </CardHeader>

              <CardContent className="flex items-center justify-between">

                <span className="text-sm text-muted-foreground">{mod.time}</span>

                <Link href={`/ielts/${slug}`} className={cn(buttonVariants({ size: "sm" }))}>

                  {t.ielts.start}

                </Link>

              </CardContent>

            </Card>

          );

        })}

      </div>

    </div>

  );

}

