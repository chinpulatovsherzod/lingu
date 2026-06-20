"use client";



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import { cn } from "@/lib/utils";

import { useI18n } from "@/components/i18n/locale-provider";



export function WeeklyActivityHeatmap({

  days,

  weeklyMinutes,

  weeklyGoal,

}: {

  days: { label: string; intensity: number }[];

  weeklyMinutes: number;

  weeklyGoal: number;

}) {

  const { t } = useI18n();

  const intensities = [0, 1, 2, 3];



  return (

    <Card>

      <CardHeader>

        <CardTitle>{t.dashboard.weeklyActivity}</CardTitle>

      </CardHeader>

      <CardContent>

        <div className="mb-4 flex justify-between gap-2">

          {days.map((d) => (

            <div key={d.label} className="flex flex-1 flex-col items-center gap-1">

              <span className="text-xs text-muted-foreground">{d.label}</span>

              <div className="flex flex-col gap-1">

                {intensities.map((row) => (

                  <div

                    key={row}

                    className={cn(

                      "h-3 w-8 rounded-sm",

                      d.intensity >= row + 1

                        ? row === 0

                          ? "bg-primary/30"

                          : row === 1

                            ? "bg-primary/50"

                            : row === 2

                              ? "bg-primary/70"

                              : "bg-primary"

                        : "bg-muted"

                    )}

                  />

                ))}

              </div>

            </div>

          ))}

        </div>

        <div className="space-y-1">

          <div className="flex justify-between text-xs">

            <span>{t.dashboard.weeklyGoal}</span>

            <span>

              {weeklyMinutes} / {weeklyGoal} {t.dashboard.min}

            </span>

          </div>

          <Progress value={Math.min(100, (weeklyMinutes / weeklyGoal) * 100)} />

        </div>

      </CardContent>

    </Card>

  );

}

