"use client";



import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import {

  BookOpen,

  Headphones,

  Mic,

  PenLine,

  SpellCheck,

  Languages,

  AudioLines,

  Quote,

  LucideIcon,

} from "lucide-react";

import { useI18n } from "@/components/i18n/locale-provider";



const skills: { slug: keyof ReturnType<typeof useI18n>["t"]["dashboard"]["skillsList"]; icon: LucideIcon; href: string }[] = [

  { slug: "reading", icon: BookOpen, href: "/lessons?type=READING" },

  { slug: "listening", icon: Headphones, href: "/lessons?type=LISTENING" },

  { slug: "speaking", icon: Mic, href: "/ielts/speaking" },

  { slug: "writing", icon: PenLine, href: "/ielts/writing" },

  { slug: "grammar", icon: SpellCheck, href: "/grammar" },

  { slug: "vocabulary", icon: Languages, href: "/vocabulary" },

  { slug: "pronunciation", icon: AudioLines, href: "/lessons?type=SPEAKING" },

  { slug: "idioms", icon: Quote, href: "/vocabulary" },

];



export function SkillsGrid({

  levels,

}: {

  levels: Record<string, { level: string; progress: number }>;

}) {

  const { t } = useI18n();



  return (

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

      {skills.map((s) => {

        const Icon = s.icon;

        const data = levels[s.slug] ?? { level: "A1", progress: 0 };

        return (

          <Link key={s.slug} href={s.href}>

            <Card className="transition-colors hover:border-primary/50">

              <CardContent className="p-4">

                <div className="mb-3 flex items-center gap-2">

                  <Icon className="h-5 w-5 text-accent" />

                  <span className="font-medium">{t.dashboard.skillsList[s.slug]}</span>

                </div>

                <p className="mb-2 text-xs text-muted-foreground">

                  {t.dashboard.level} {data.level}

                </p>

                <Progress value={data.progress} />

              </CardContent>

            </Card>

          </Link>

        );

      })}

    </div>

  );

}

