import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { getServerI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const valid = ["reading", "listening", "speaking"] as const;

export default async function IeltsSectionPage({ params }: { params: { section: string } }) {
  if (!valid.includes(params.section as (typeof valid)[number])) notFound();

  const { t } = await getServerI18n();
  const section = params.section as (typeof valid)[number];
  const title = t.ielts.modules[section]?.title ?? params.section;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="font-heading text-2xl font-bold">{title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t.ielts.sectionInDev}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>{t.ielts.sectionInDevDesc}</p>
          <Link href="/ielts/writing" className={cn(buttonVariants(), "inline-flex")}>
            {t.ielts.goToWriting}
          </Link>
          <Link href="/ielts" className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}>
            {t.ielts.backToIelts}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
