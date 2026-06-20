import Link from "next/link";
import { BookOpen, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { getServerI18n } from "@/lib/i18n";
import { getOfficialQuestionCount } from "@/lib/ielts/reading/passages";
import { cn } from "@/lib/utils";

export default async function IeltsReadingPage() {
  const { t } = await getServerI18n();
  const r = t.ielts.reading;
  const questionCount = getOfficialQuestionCount();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">{t.ielts.modules.reading.title}</h1>
        <p className="text-muted-foreground">{r.hubSubtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <BookOpen className="h-8 w-8 text-accent" />
          <CardTitle>{r.officialTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {r.officialDesc.replace("{count}", String(questionCount))}
          </p>
          <Link href="/ielts/reading/test" className={cn(buttonVariants())}>
            {r.startOfficial}
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Layers className="h-8 w-8 text-accent" />
          <CardTitle>{r.extraTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{r.extraDesc}</p>
          <Link href="/ielts/reading/practice" className={cn(buttonVariants({ variant: "secondary" }))}>
            {r.startExtra}
          </Link>
        </CardContent>
      </Card>

      <Link href="/ielts" className={cn(buttonVariants({ variant: "outline" }))}>
        {t.ielts.backToIelts}
      </Link>
    </div>
  );
}
