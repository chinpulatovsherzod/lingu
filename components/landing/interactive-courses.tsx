"use client";

import { useState } from "react";
import { BookOpen, GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CourseDetail {
  code: string;
  name: string;
  badge: string;
  lessonsCount: number;
  skills: string[];
  description: string;
}

interface InteractiveCoursesProps {
  ru: {
    title: string;
    sub: string;
    start: string;
    levels: Record<string, string>;
  };
  en: {
    title: string;
    sub: string;
    start: string;
    levels: Record<string, string>;
  };
  uz: {
    title: string;
    sub: string;
    start: string;
    levels: Record<string, string>;
  };
  locale: string;
}

const COURSES_DATA: Record<string, Record<string, CourseDetail>> = {
  en: {
    A1: {
      code: "A1",
      name: "Beginner",
      badge: "Basics & Foundation",
      lessonsCount: 12,
      skills: ["Self-introduction", "Basic daily expressions", "Present Simple tense", "Countable/Uncountable nouns"],
      description: "Build your confidence with essential grammar and common vocabulary for everyday communication."
    },
    A2: {
      code: "A2",
      name: "Elementary",
      badge: "Expanding Grammar",
      lessonsCount: 15,
      skills: ["Talking about past events", "Future intentions", "Comparatives & Superlatives", "Basic modal verbs"],
      description: "Express your opinions, describe past experiences, and start constructing complex sentences."
    },
    B1: {
      code: "B1",
      name: "Intermediate",
      badge: "Fluency & Comfort",
      lessonsCount: 18,
      skills: ["Present Perfect tense", "Passive voice", "First & Second Conditionals", "Making predictions"],
      description: "Communicate with confidence on familiar topics at work, school, and leisure."
    },
    B2: {
      code: "B2",
      name: "Upper Intermediate",
      badge: "Advanced Structures",
      lessonsCount: 20,
      skills: ["Third & Mixed Conditionals", "Modal verbs in the past", "Reported Speech", "Gerund vs Infinitive"],
      description: "Discuss complex issues, write detailed essays, and read sophisticated articles."
    },
    C1: {
      code: "C1",
      name: "Advanced",
      badge: "Near-Native mastery",
      lessonsCount: 22,
      skills: ["Inversion & cleft sentences", "Advanced tenses combination", "Collocations & idioms", "Academic writing skills"],
      description: "Express yourself fluently, understand implicit meanings, and prepare for academic environments."
    },
    IELTS: {
      code: "IELTS",
      name: "IELTS Prep",
      badge: "Exam Strategies",
      lessonsCount: 30,
      skills: ["Writing Task 1 & 2 criteria", "Listening flow maps", "Skimming & Scanning in Reading", "Speaking templates"],
      description: "Master full mock exams and learn standard templates to maximize your band score."
    }
  },
  ru: {
    A1: {
      code: "A1",
      name: "Beginner",
      badge: "Основы и база",
      lessonsCount: 12,
      skills: ["Рассказ о себе", "Простые бытовые фразы", "Настоящее простое время (Present Simple)", "Исчисляемые и неисчисляемые существительные"],
      description: "Получите базовую грамматическую подготовку и словарный запас для элементарного повседневного общения."
    },
    A2: {
      code: "A2",
      name: "Elementary",
      badge: "Расширение грамматики",
      lessonsCount: 15,
      skills: ["Разговор о прошлых событиях", "Планы на будущее", "Сравнительные степени прилагательных", "Модальные глаголы"],
      description: "Научитесь рассказывать о себе, делиться опытом, строить развернутые предложения."
    },
    B1: {
      code: "B1",
      name: "Intermediate",
      badge: "Свободное общение",
      lessonsCount: 18,
      skills: ["Настоящее совершенное время (Present Perfect)", "Пассивный залог", "Условные предложения 1-го и 2-го типа", "Выражение предположений"],
      description: "Развивайте беглость речи и уверенность на работе, в школе и путешествиях."
    },
    B2: {
      code: "B2",
      name: "Upper Intermediate",
      badge: "Сложные конструкции",
      lessonsCount: 20,
      skills: ["Условные предложения 3-го и смешанного типов", "Модальные глаголы в прошедшем времени", "Косвенная речь", "Герундий и инфинитив"],
      description: "Свободно обсуждайте сложные темы, пишите детальные эссе и читайте развернутые тексты."
    },
    C1: {
      code: "C1",
      name: "Advanced",
      badge: "Свободное владение",
      lessonsCount: 22,
      skills: ["Инверсия в предложениях", "Сложные комбинации времен", "Идиомы и коллокации", "Академическое письмо"],
      description: "Говорите без барьеров, понимайте скрытый смысл текстов и готовьтесь к обучению за рубежом."
    },
    IELTS: {
      code: "IELTS",
      name: "IELTS Prep",
      badge: "Стратегия экзамена",
      lessonsCount: 30,
      skills: ["Критерии оценивания Writing Task 1 & 2", "Техники прослушивания Listening", "Стратегии чтения (Skimming/Scanning)", "Шаблоны для Speaking"],
      description: "Разбирайте реальные экзаменационные задания и пишите пробные тесты с автооценкой."
    }
  },
  uz: {
    A1: {
      code: "A1",
      name: "Beginner",
      badge: "Asoslar va poydevor",
      lessonsCount: 12,
      skills: ["O'zini tanishtirish", "Kundalik oddiy iboralar", "Hozirgi oddiy zamon (Present Simple)", "Sanaladigan/Sanalmaydigan otlar"],
      description: "Kundalik muloqot uchun zarur bo'lgan boshlang'ich grammatika va asosiy so'z boyligini shakllantiring."
    },
    A2: {
      code: "A2",
      name: "Elementary",
      badge: "Kengaytirilgan grammatika",
      lessonsCount: 15,
      skills: ["O'tgan zamon haqida suhbat", "Kelajak rejalari", "Sifat darajalari", "Modal fe'llar"],
      description: "O'z fikrlaringizni bayon qiling, o'tmish tajribalari haqida gapiring va murakkab gaplar tuza boshlang."
    },
    B1: {
      code: "B1",
      name: "Intermediate",
      badge: "Erkin muloqot",
      lessonsCount: 18,
      skills: ["Present Perfect zamoni", "Majhul nisbat (Passive voice)", "1 va 2-tur shart gaplar", "Fikr-mulohaza bildirish"],
      description: "Ish, maktab va dam olish mavzularida til to'siqlarisiz ishonch bilan muloqot qiling."
    },
    B2: {
      code: "B2",
      name: "Upper Intermediate",
      badge: "Murakkab tuzilmalar",
      lessonsCount: 20,
      skills: ["3-tur va aralash shart gaplar", "O'tgan zamondagi modal fe'llar", "Ko'chirma gap", "Gerund va Infinitive"],
      description: "Murakkab mavzularni muhokama qiling, batafsil insholar yozing va ilmiy maqolalarni tushuning."
    },
    C1: {
      code: "C1",
      name: "Advanced",
      badge: "Mukammal daraja",
      lessonsCount: 22,
      skills: ["Gaplarda inversiya", "Murakkab zamonlar kombinatsiyasi", "Idiomalar va iboralar", "Akademik yozma nutq"],
      description: "Erkin so'zlang, yashirin ma'nolarni tushuning va xalqaro o'quv muhitiga tayyorlaning."
    },
    IELTS: {
      code: "IELTS",
      name: "IELTS Prep",
      badge: "Imtihon strategiyasi",
      lessonsCount: 30,
      skills: ["Writing Task 1 & 2 baholash mezonlari", "Listening bo'limi texnikalari", "Tez o'qish (Skimming/Scanning)", "Speaking andozalari"],
      description: "Imtihon topshiriqlarini to'liq tahlil qiling va ballni maksimal darajaga ko'tarishni o'rganing."
    }
  }
};

export function InteractiveCourses({ locale, ru, en, uz }: InteractiveCoursesProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>("A1");

  const currentDict = locale === "uz" ? uz : locale === "en" ? en : ru;
  const courses = COURSES_DATA[locale] || COURSES_DATA.en;
  const activeCourse = courses[selectedLevel];

  const levelsList = ["A1", "A2", "B1", "B2", "C1", "IELTS"];

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
      {/* Level Selectors */}
      <div className="lg:col-span-4 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-thin">
        {levelsList.map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={cn(
              "flex items-center justify-between px-5 py-4 rounded-xl border text-left font-semibold transition-all duration-300 w-full min-w-[120px] lg:min-w-0",
              selectedLevel === level
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                : "bg-card/45 border-border/40 text-muted-foreground hover:text-white hover:border-border/80 hover:bg-card/60"
            )}
          >
            <span>{level} {courses[level].name}</span>
            <span
              className={cn(
                "hidden lg:inline-block text-xs px-2 py-0.5 rounded-full",
                selectedLevel === level ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              )}
            >
              {courses[level].lessonsCount}
            </span>
          </button>
        ))}
      </div>

      {/* Details Box */}
      <div className="lg:col-span-8 glass p-6 sm:p-8 rounded-2xl border border-border/50 bg-card/40 space-y-6 relative overflow-hidden">
        {/* Glow effect inside details box */}
        <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-white font-heading">
              {activeCourse.code} · {activeCourse.name}
            </h3>
            <p className="text-xs text-primary font-medium tracking-wider uppercase mt-1">
              {activeCourse.badge}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>{activeCourse.lessonsCount} lessons</span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {activeCourse.description}
        </p>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            {locale === "uz" ? "Nimalarni o'rganasiz:" : locale === "en" ? "What you will learn:" : "Чему вы научитесь:"}
          </h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {activeCourse.skills.map((skill, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end">
          <Link href="/auth/register">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold gap-2 shadow-lg shadow-primary/10">
              <span>{currentDict.start}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
