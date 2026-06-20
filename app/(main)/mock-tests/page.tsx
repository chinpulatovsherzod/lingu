import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getServerI18n } from "@/lib/i18n";

import { cn } from "@/lib/utils";



export default async function MockTestsPage() {

  const { t } = await getServerI18n();



  return (

    <div className="space-y-6">

      <h1 className="font-heading text-3xl font-bold">{t.mockTests.title}</h1>

      <Card>

        <CardHeader>

          <CardTitle>{t.mockTests.fullTitle}</CardTitle>

        </CardHeader>

        <CardContent className="space-y-2 text-sm text-muted-foreground">

          <p>{t.mockTests.fullDesc}</p>

          <Link href="/ielts" className={cn(buttonVariants())}>

            {t.mockTests.fullStart} ({t.mockTests.soon})

          </Link>

        </CardContent>

      </Card>

      <Card>

        <CardHeader>

          <CardTitle>{t.mockTests.miniTitle}</CardTitle>

        </CardHeader>

        <CardContent>

          <p className="mb-4 text-sm text-muted-foreground">{t.mockTests.miniDesc}</p>

          <button type="button" className={cn(buttonVariants({ variant: "outline" }))} disabled>

            {t.mockTests.miniStart} ({t.mockTests.soon})

          </button>

        </CardContent>

      </Card>

    </div>

  );

}

