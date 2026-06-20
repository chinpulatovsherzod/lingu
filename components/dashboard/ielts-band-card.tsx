"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/utils";

export function IeltsBandCard({
  overall,
  sections,
  readinessScore,
}: {
  overall: number;
  sections: { name: string; band: number }[];
  readinessScore?: number;
}) {
  const { t } = useI18n();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t.dashboard.ieltsBand}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <span className="font-heading text-4xl font-bold text-accent">{overall.toFixed(1)}</span>
          <span className="pb-1 text-sm text-muted-foreground">{t.dashboard.overall}</span>
        </div>
        {sections.map((s) => (
          <div key={s.name}>
            <div className="mb-1 flex justify-between text-xs">
              <span>{t.dashboard.ieltsSections[s.name as keyof typeof t.dashboard.ieltsSections] ?? s.name}</span>
              <span>{s.band.toFixed(1)}</span>
            </div>
            <Progress value={(s.band / 9) * 100} />
          </div>
        ))}
        {readinessScore !== undefined && (
          <div className="pt-2 border-t border-border">
            <div className="mb-1 flex justify-between text-xs font-medium">
              <span className="text-muted-foreground">Готовность к тесту:</span>
              <span className="text-accent font-semibold">{Math.round(readinessScore)}%</span>
            </div>
            <Progress value={readinessScore} className="h-2" />
          </div>
        )}
        <Link href="/ielts" className={cn(buttonVariants(), "w-full")}>
          {t.dashboard.startIelts}
        </Link>
      </CardContent>
    </Card>
  );
}
