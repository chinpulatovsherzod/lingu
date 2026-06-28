"use client";

import { useI18n } from "@/components/i18n/locale-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { BookOpen, GraduationCap, Gamepad2, Play, Building } from "lucide-react";
import Image from "next/image";
import { InteractiveCourses } from "@/components/landing/interactive-courses";
import { FaqAccordion } from "@/components/landing/faq-accordion";

// Local translations for the landing page to keep it clean and isolated
const dict = {
  en: {
    heroBadgeEnglish: "🇬🇧 British English",
    heroBadgeLevels: "A1 — C2",
    heroTitlePart1: "Expand your ",
    heroTitleHorizons: "horizons",
    heroTitlePart2: " with an English course",
    heroSub: "Lingu offers flexible, interactive online English courses that help you improve your language skills, make steady progress, and communicate confidently in daily life.",
    btnFindCourse: "Find your course",
    btnHowItWorks: "How it works",
    navLearn: "Learn a language",
    navEnterprise: "Enterprise",
    navResources: "Resources",
    navHow: "How it works",
    navFaq: "FAQ",
    loginBtn: "Log in",
    registerBtn: "Register",
    featuresTitle: "Why choose Lingu?",
    featureIeltsTitle: "IELTS Preparation",
    featureIeltsDesc: "Interactive practice tests and evaluation for IELTS Listening, Reading, and Writing modules.",
    featureDictTitle: "Spelling Dictation",
    featureDictDesc: "Practice writing saved words with voice synthesis to build accurate muscle memory.",
    featureArenaTitle: "Tense Arena",
    featureArenaDesc: "A fast-paced interactive practice game to master English tenses under time pressure.",
    howItWorksTitle: "How It Works",
    howItWorksStep1: "1. Placement Test",
    howItWorksStep1Text: "Register and determine your current language level with an adaptive grammar test.",
    howItWorksStep2: "2. Interactive Studies",
    howItWorksStep2Text: "Learn tenses, save vocabulary, practice spelling, and chat with your AI English mentor.",
    howItWorksStep3: "3. Exam Simulation",
    howItWorksStep3Text: "Take complete IELTS Listening, Reading, and Writing mock tests with detailed automatic score reports.",
    coursesTitle: "Our Courses",
    coursesSub: "Structured learning materials from Beginner to Advanced levels.",
    coursesStart: "Start learning",
    enterpriseTitle: "Lingu for Teams & Business",
    enterpriseText: "Elevate your team's English level. Perfect for schools, universities, and corporate companies with comprehensive performance analytics dashboard.",
    enterpriseContact: "Get started",
    faqTitle: "Frequently Asked Questions",
    faq1Q: "Is the platform free?",
    faq1A: "You can register and try the demo account with preloaded lessons. Subscribing gives full unlimited access to all courses, spelling trainer, and AI mentor.",
    faq2Q: "How does the AI Mentor work?",
    faq2A: "Our AI mentor is powered by Google Gemini, trained to explain English rules, check writing, and suggest fixes in real-time.",
    faq3Q: "Can I prepare for IELTS?",
    faq3A: "Yes! Lingu contains mock tests specifically designed for IELTS Academic prep, including automated grading of Writing tasks."
  },
  ru: {
    heroBadgeEnglish: "🇬🇧 Британский английский",
    heroBadgeLevels: "A1 — C2",
    heroTitlePart1: "Расширяй свои ",
    heroTitleHorizons: "горизонты",
    heroTitlePart2: " с курсом английского языка",
    heroSub: "Lingu предлагает гибкие, интерактивные онлайн-курсы, которые помогут вам улучшить языковые навыки, добиться стабильного прогресса и уверенно общаться в повседневной жизни.",
    btnFindCourse: "Выбрать курс",
    btnHowItWorks: "Как это работает",
    navLearn: "Изучение языков",
    navEnterprise: "Для бизнеса",
    navResources: "Ресурсы",
    navHow: "Как работать",
    navFaq: "FAQ",
    loginBtn: "Войти",
    registerBtn: "Регистрация",
    featuresTitle: "Почему именно Lingu?",
    featureIeltsTitle: "Подготовка к IELTS",
    featureIeltsDesc: "Интерактивные практические тесты и оценка навыков Listening, Reading и Writing.",
    featureDictTitle: "Спеллинг-диктант",
    featureDictDesc: "Тренируйте написание сохраненных слов с голосовым синтезом для точного запоминания.",
    featureArenaTitle: "Арена времен",
    featureArenaDesc: "Динамичная интерактивная игра для тренировки грамматических времен на время.",
    howItWorksTitle: "Как это работает",
    howItWorksStep1: "1. Тест уровня",
    howItWorksStep1Text: "Зарегистрируйтесь и определите свой текущий уровень владения языком с помощью адаптивного теста.",
    howItWorksStep2: "2. Интерактивное обучение",
    howItWorksStep2Text: "Изучайте времена, сохраняйте лексику, тренируйте правописание и общайтесь с ИИ-ментором.",
    howItWorksStep3: "3. Симуляция экзаменов",
    howItWorksStep3Text: "Сдавайте полные пробные тесты IELTS Listening, Reading и Writing с подробными отчетами о баллах.",
    coursesTitle: "Наши курсы",
    coursesSub: "Структурированные учебные материалы от начального (Beginner) до продвинувого (Advanced) уровней.",
    coursesStart: "Начать обучение",
    enterpriseTitle: "Lingu для бизнеса и школ",
    enterpriseText: "Повышайте уровень английского вашей команды. Идеально для школ, университетов и компаний с детальной панелью аналитики успеваемости.",
    enterpriseContact: "Попробовать бесплатно",
    faqTitle: "Часто задаваемые вопросы",
    faq1Q: "Платформа бесплатная?",
    faq1A: "Вы можете зарегистрироваться и использовать демо-аккаунт бесплатно. Подписка дает неограниченный доступ ко всем курсам, спеллинг-тренажеру и ИИ-ментору.",
    faq2Q: "Как работает ИИ-ментор?",
    faq2A: "Наш ИИ-ментор работает на базе Google Gemini. Он умеет объяснять правила, проверять ваши письменные работы и подсказывать ошибки в реальном времени.",
    faq3Q: "Могу ли я подготовиться к IELTS?",
    faq3A: "Да! Lingu содержит пробные тесты, специально разработанные для подготовки к академическому IELTS, включая автоматическую оценку письменной части."
  },
  uz: {
    heroBadgeEnglish: "🇬🇧 Britaniya ingliz tili",
    heroBadgeLevels: "A1 — C2",
    heroTitlePart1: "Ingliz tili kursi bilan ",
    heroTitleHorizons: "ufqlaringizni",
    heroTitlePart2: " kengaytiring",
    heroSub: "Lingu ingliz tili bo'yicha moslashuvchan va interaktiv onlayn kurslarni taklif etadi. Ular til ko'nikmalaringizni oshirish, muntazam rivojlanish va kundalik hayotda ishonch bilan muloqot qilishga yordam beradi.",
    btnFindCourse: "Kursni tanlash",
    btnHowItWorks: "Bu qanday ishlaydi",
    navLearn: "Tillar o'rganish",
    navEnterprise: "Biznes uchun",
    navResources: "Resurslar",
    navHow: "Qanday ishlaydi",
    navFaq: "FAQ",
    loginBtn: "Tizimga kirish",
    registerBtn: "Ro'yxatdan o'tish",
    featuresTitle: "Nima uchun aynan Lingu?",
    featureIeltsTitle: "IELTS ga tayyorgarlik",
    featureIeltsDesc: "Listening, Reading va Writing modullari bo'yicha interaktiv testlar va baholash tizimi.",
    featureDictTitle: "Imlo diktanti",
    featureDictDesc: "So'zlarni aniq eslab qolish uchun ovozli sintez yordamida yozishni mashq qiling.",
    featureArenaTitle: "Zamonlar arenasi",
    featureArenaDesc: "Grammatik zamonlarni vaqt bosimi ostida o'rganish uchun dinamik interaktiv o'yin.",
    howItWorksTitle: "Bu qanday ishlaydi",
    howItWorksStep1: "1. Darajani aniqlash",
    howItWorksStep1Text: "Ro'yxatdan o'ting va adaptiv grammatik test yordamida joriy til darajangizni aniqlang.",
    howItWorksStep2: "2. Interaktiv o'rganish",
    howItWorksStep2Text: "Zamonlarni o'rganing, so'z boyligini saqlang, imloni mashq qiling va sun'iy intellekt mentori bilan suhbatlashing.",
    howItWorksStep3: "3. Imtihon simulyatsiyasi",
    howItWorksStep3Text: "IELTS Listening, Reading va Writing modullari bo'yicha to'liq testlarni topshiring va natijalarni oling.",
    coursesTitle: "Kurslarimiz",
    coursesSub: "Boshlang'ichdan (Beginner) yuqori (Advanced) darajagacha bo'lgan tizimli o'quv materiallari.",
    coursesStart: "Boshlash",
    enterpriseTitle: "Biznes va maktablar uchun Lingu",
    enterpriseText: "Jamoangizning ingliz tili darajasini oshiring. Maktablar, universitetlar va kompaniyalar uchun to'liq tahliliy dashboard mavjud.",
    enterpriseContact: "Bepul sinab ko'rish",
    faqTitle: "Ko'p beriladigan savollar",
    faq1Q: "Platforma bepulmi?",
    faq1A: "Ro'yxatdan o'tib, demo akkauntdan bepul foydalanishingiz mumkin. Obuna esa barcha kurslar, imlo trenajyori va AI mentorga to'liq kirish imkonini beradi.",
    faq2Q: "AI mentor qanday ishlaydi?",
    faq2A: "Sun'iy intellekt mentorimiz Google Gemini bazasida ishlaydi. U ingliz tili qoidalarini tushuntiradi va xatolarni real vaqtda tuzatadi.",
    faq3Q: "IELTS ga tayyorlana olamanmi?",
    faq3A: "Ha! Lingu akademik IELTS ga tayyorlanish uchun maxsus testlarni, jumladan Writing qismini avtomatik baholash tizimini o'z ichiga oladi."
  }
};

export function LandingClient() {
  const { locale } = useI18n();
  const t = dict[locale] || dict.en;

  const interactiveProps = {
    locale,
    ru: { title: t.coursesTitle, sub: t.coursesSub, start: t.coursesStart, levels: dict.ru.coursesSub as any },
    en: { title: t.coursesTitle, sub: t.coursesSub, start: t.coursesStart, levels: dict.en.coursesSub as any },
    uz: { title: t.coursesTitle, sub: t.coursesSub, start: t.coursesStart, levels: dict.uz.coursesSub as any }
  };

  const faqItems = [
    { question: t.faq1Q, answer: t.faq1A },
    { question: t.faq2Q, answer: t.faq2A },
    { question: t.faq3Q, answer: t.faq3A }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* Premium Glassmorphic Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary overflow-hidden p-0.5 relative">
                <Image src="/logo.png" alt="Lingu logo" width={32} height={32} className="h-full w-full object-cover rounded-md" />
              </div>
              <span className="font-heading text-lg font-bold tracking-wider text-white">Lingu</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#courses" className="text-sm text-muted-foreground hover:text-white transition cursor-pointer font-medium">
                {t.navLearn}
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-white transition cursor-pointer font-medium">
                {t.navHow}
              </a>
              <a href="#enterprise" className="text-sm text-muted-foreground hover:text-white transition cursor-pointer font-medium">
                {t.navEnterprise}
              </a>
              <a href="#features" className="text-sm text-muted-foreground hover:text-white transition cursor-pointer font-medium">
                {t.navResources}
              </a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-white transition cursor-pointer font-medium">
                {t.navFaq}
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-white hover:bg-muted/50 text-xs sm:text-sm">
                {t.loginBtn}
              </Button>
            </Link>
            <Link href="/auth/register" className="hidden sm:inline-block">
              <Button size="sm" className="bg-primary text-white hover:bg-primary/90 font-medium rounded-xl">
                {t.registerBtn}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
              <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                {t.heroBadgeEnglish}
              </span>
              <span className="inline-flex items-center rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-semibold text-accent">
                {t.heroBadgeLevels}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white font-heading">
              {t.heroTitlePart1}
              <span className="text-primary font-cursive text-5xl sm:text-6xl lg:text-7xl block sm:inline-block mx-1">
                {t.heroTitleHorizons}
              </span>
              {t.heroTitlePart2}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              {t.heroSub}
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap pt-2">
              <Link href="/auth/register">
                <Button size="lg" className="bg-primary hover:bg-primary/95 text-white rounded-xl shadow-lg shadow-primary/20 transition-all font-semibold">
                  {t.btnFindCourse}
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="border-border/60 hover:bg-muted/40 text-white rounded-xl font-semibold gap-2">
                  <Play className="h-4 w-4 fill-white" />
                  {t.btnHowItWorks}
                </Button>
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            {/* Ambient glows behind the hero image */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl" />
            <div className="relative glass p-2 rounded-3xl overflow-hidden shadow-2xl border-border/30">
              <Image 
                src="/landing-hero.png" 
                alt="Students learning English with Lingu" 
                width={600}
                height={400}
                priority
                className="w-full h-auto object-cover rounded-2xl shadow-inner"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border/20 scroll-mt-20">
          <h2 className="text-3xl font-bold text-center text-white font-heading mb-4">
            {t.howItWorksTitle}
          </h2>
          <div className="h-0.5 w-16 bg-primary mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-6 rounded-2xl border-border/30 space-y-3 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl" />
              <h3 className="text-xl font-bold text-white font-heading">{t.howItWorksStep1}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.howItWorksStep1Text}</p>
            </div>
            <div className="glass p-6 rounded-2xl border-border/30 space-y-3 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl" />
              <h3 className="text-xl font-bold text-white font-heading">{t.howItWorksStep2}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.howItWorksStep2Text}</p>
            </div>
            <div className="glass p-6 rounded-2xl border-border/30 space-y-3 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl" />
              <h3 className="text-xl font-bold text-white font-heading">{t.howItWorksStep3}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.howItWorksStep3Text}</p>
            </div>
          </div>
        </section>

        {/* Interactive Courses Selector Section */}
        <section id="courses" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border/20 scroll-mt-20">
          <h2 className="text-3xl font-bold text-center text-white font-heading mb-2">
            {t.coursesTitle}
          </h2>
          <p className="text-center text-muted-foreground text-sm max-w-md mx-auto mb-12">
            {t.coursesSub}
          </p>
          <InteractiveCourses {...interactiveProps} />
        </section>

        {/* Enterprise & Business Section */}
        <section id="enterprise" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border/20 scroll-mt-20">
          <div className="relative glass p-8 sm:p-12 rounded-3xl overflow-hidden border-border/50 bg-card/25 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="absolute -left-32 -bottom-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
            
            <div className="space-y-4 max-w-2xl text-center lg:text-left relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mx-auto lg:mx-0">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-heading">
                {t.enterpriseTitle}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t.enterpriseText}
              </p>
            </div>
            
            <div className="relative z-10 shrink-0">
              <Link href="/auth/register">
                <Button size="lg" className="bg-primary hover:bg-primary/95 text-white rounded-xl shadow-lg shadow-primary/25 px-8 font-semibold">
                  {t.enterpriseContact}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Highlights Section */}
        <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border/20 scroll-mt-20">
          <h2 className="text-3xl font-bold text-center text-white font-heading mb-12">
            {t.featuresTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass p-6 rounded-2xl space-y-4 hover:border-primary/45 transition premium-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">{t.featureIeltsTitle}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.featureIeltsDesc}</p>
            </div>
            
            {/* Feature 2 */}
            <div className="glass p-6 rounded-2xl space-y-4 hover:border-primary/45 transition premium-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">{t.featureDictTitle}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.featureDictDesc}</p>
            </div>

            {/* Feature 3 */}
            <div className="glass p-6 rounded-2xl space-y-4 hover:border-primary/45 transition premium-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">{t.featureArenaTitle}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.featureArenaDesc}</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border/20 scroll-mt-20">
          <h2 className="text-3xl font-bold text-center text-white font-heading mb-12">
            {t.faqTitle}
          </h2>
          <FaqAccordion items={faqItems} />
        </section>
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div>
          © {new Date().getFullYear()} Lingu. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <span>A1 → C1 + IELTS</span>
        </div>
      </footer>
    </div>
  );
}
