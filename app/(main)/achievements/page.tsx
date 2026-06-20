import { auth } from "@/lib/auth";

import { getAchievements } from "@/lib/data";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { isPgliteMode } from "@/lib/pglite";

import { getServerI18n } from "@/lib/i18n";



export default async function AchievementsPage() {

  const { t } = await getServerI18n();

  const session = await auth();

  const { all, earnedIds } = await getAchievements(session!.user!.id);



  return (

    <div className="space-y-6">

      <h1 className="font-heading text-3xl font-bold">{t.achievements.title}</h1>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

        {all.map((a) => {

          const id = a.id;

          const title = isPgliteMode() ? (a as { title: string }).title : (a as { title: string }).title;

          const description = (a as { description: string }).description;

          const xp = isPgliteMode() ? (a as { xp_reward: number }).xp_reward : (a as { xpReward: number }).xpReward;

          return (

            <Card key={id} className={earnedIds.has(id) ? "border-primary/50" : "opacity-60"}>

              <CardHeader>

                <CardTitle className="text-lg">{title}</CardTitle>

              </CardHeader>

              <CardContent>

                <p className="text-sm text-muted-foreground">{description}</p>

                <div className="mt-2 flex justify-between">

                  <Badge variant={earnedIds.has(id) ? "success" : "secondary"}>

                    {earnedIds.has(id) ? t.achievements.earned : t.achievements.locked}

                  </Badge>

                  <span className="text-xs">+{xp} XP</span>

                </div>

              </CardContent>

            </Card>

          );

        })}

      </div>

    </div>

  );

}

