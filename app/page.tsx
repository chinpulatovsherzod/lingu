import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLocale } from "@/lib/i18n";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { BookOpen, GraduationCap, Gamepad2, Play } from "lucide-react";

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
    navAbout: "This is Lingu",
    loginBtn: "Log in",
    registerBtn: "Register",
    featuresTitle: "Why choose Lingu?",
    featureIeltsTitle: "IELTS Preparation",
    featureIeltsDesc: "Interactive practice tests and evaluation for IELTS Listening, Reading, and Writing modules.",
    featureDictTitle: "Spelling Dictation",
    featureDictDesc: "Practice writing saved words with voice synthesis to build accurate muscle memory.",
    featureArenaTitle: "Tense Arena",
    featureArenaDesc: "A fast-paced interactive practice game to master English tenses under time pressure."
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
    navAbout: "О проекте",
    loginBtn: "Войти",
    registerBtn: "Регистрация",
    featuresTitle: "Почему именно Lingu?",
    featureIeltsTitle: "Подготовка к IELTS",
    featureIeltsDesc: "Интерактивные практические тесты и оценка навыков Listening, Reading и Writing.",
    featureDictTitle: "Спеллинг-диктант",
    featureDictDesc: "Тренируйте написание сохраненных слов с голосовым синтезом для точного запоминания.",
    featureArenaTitle: "Арена времен",
    featureArenaDesc: "Динамичная интерактивная игра для тренировки грамматических времен на время."
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
    navAbout: "Lingu haqida",
    loginBtn: "Tizimga kirish",
    registerBtn: "Ro'yxatdan o'tish",
    featuresTitle: "Nima uchun aynan Lingu?",
    featureIeltsTitle: "IELTS ga tayyorgarlik",
    featureIeltsDesc: "Listening, Reading va Writing modullari bo'yicha interaktiv testlar va baholash tizimi.",
    featureDictTitle: "Imlo diktanti",
    featureDictDesc: "So'zlarni aniq eslab qolish uchun ovozli sintez yordamida yozishni mashq qiling.",
    featureArenaTitle: "Zamonlar arenasi",
    featureArenaDesc: "Grammatik zamonlarni vaqt bosimi ostida o'rganish uchun dinamik interaktiv o'yin."
  }
};

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  const locale = await getLocale();
  const t = dict[locale] || dict.en;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* Premium Glassmorphic Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary overflow-hidden p-0.5">
                <img src="/logo.png" alt="Lingu logo" className="h-full w-full object-cover rounded-md" />
              </div>
              <span className="font-heading text-lg font-bold tracking-wider text-white">Lingu</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <span className="text-sm text-muted-foreground hover:text-white transition cursor-pointer">{t.navLearn}</span>
              <span className="text-sm text-muted-foreground hover:text-white transition cursor-pointer">{t.navEnterprise}</span>
              <span className="text-sm text-muted-foreground hover:text-white transition cursor-pointer">{t.navResources}</span>
              <span className="text-sm text-muted-foreground hover:text-white transition cursor-pointer">{t.navAbout}</span>
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
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="border-border/60 hover:bg-muted/40 text-white rounded-xl font-semibold gap-2">
                  <Play className="h-4 w-4 fill-white" />
                  {t.btnHowItWorks}
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            {/* Ambient glows behind the hero image */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl" />
            <div className="relative glass p-2 rounded-3xl overflow-hidden shadow-2xl border-border/30">
              <img 
                src="/landing-hero.png" 
                alt="Students learning English with Lingu" 
                className="w-full h-auto object-cover rounded-2xl shadow-inner"
              />
            </div>
          </div>
        </section>

        {/* Features Highlights */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border/20">
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
