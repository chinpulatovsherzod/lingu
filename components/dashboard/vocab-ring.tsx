"use client";



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useI18n } from "@/components/i18n/locale-provider";



export function VocabMasteryRing({
  learned,
  memoryStrength = 100,
  goal = 10000,
  breakdown,
}: {
  learned: number;
  memoryStrength?: number;
  goal?: number;
  breakdown: { label: string; count: number }[];
}) {
  const { t } = useI18n();

  const percent = memoryStrength;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t.dashboard.vocabMastery}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative">
          <svg width="140" height="140" className="-rotate-90">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#6C63FF"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-xl font-bold text-[#6C63FF]">{percent}%</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Сила памяти</span>
          </div>
        </div>
        <ul className="w-full space-y-2 text-sm">
          {breakdown.map((b) => (
            <li key={b.label} className="flex justify-between">
              <span className="text-muted-foreground">{b.label}</span>
              <span className="font-medium">{b.count}</span>
            </li>
          ))}
          <li className="flex justify-between pt-2 border-t border-border">
            <span className="text-muted-foreground font-semibold">Всего слов:</span>
            <span className="font-semibold text-primary">{learned}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

