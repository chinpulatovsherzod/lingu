import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/data";
import { xpProgressInLevel } from "@/lib/xp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Mail, Target, Flame, Zap, BookOpen, Calendar } from "lucide-react";
import { formatMessage, getServerI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

function ProfileRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

const dateLocales: Record<Locale, string> = { en: "en-US", ru: "ru-RU", uz: "uz-UZ" };

export default async function ProfilePage() {
  const { t, locale } = await getServerI18n();
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const data = await getUserProfile(session.user.id);
  if (!data) redirect("/auth/login");

  const { user, stats } = data;
  const xp = xpProgressInLevel(user.totalXp ?? 0);
  const goalKey = String(user.learningGoal ?? "");
  const created = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(dateLocales[locale], {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const formatLevel = (level: string | null | undefined) => level || t.profile.levelUndefined;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">{t.profile.title}</h1>
        <p className="text-muted-foreground">{t.profile.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {t.profile.personalData}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <ProfileRow icon={User} label={t.profile.name} value={user.name ?? "—"} />
          <ProfileRow icon={User} label={t.profile.lastName} value={user.lastName ?? "—"} />
          <ProfileRow icon={Mail} label={t.profile.email} value={user.email ?? "—"} />
          <ProfileRow icon={Calendar} label={t.profile.registeredAt} value={created} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            {t.profile.learning}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">CEFR: {formatLevel(user.englishLevel)}</Badge>
            <Badge variant="secondary">Lingu Level {user.currentLevel ?? xp.level}</Badge>

            {user.ieltsTargetBand && (
              <Badge variant="outline">
                {t.profile.ieltsTarget}: {user.ieltsTargetBand}
              </Badge>
            )}
          </div>
          <ProfileRow
            icon={Target}
            label={t.profile.learningGoal}
            value={(t.profile.goals[goalKey] ?? goalKey) || "—"}
          />
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span>{formatMessage(t.profile.progressToLevel, { level: xp.level + 1 })}</span>
              <span>{Math.round(xp.percent)}%</span>
            </div>
            <Progress value={xp.percent} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.profile.statistics}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <ProfileRow icon={Zap} label={t.profile.totalXp} value={String(user.totalXp ?? 0)} />
          <ProfileRow
            icon={Flame}
            label={t.profile.streak}
            value={`${user.streakCount ?? 0} ${t.header.days}`}
          />
          <ProfileRow icon={BookOpen} label={t.profile.wordsInVocab} value={String(stats.words)} />
          <ProfileRow icon={BookOpen} label={t.profile.lessonsCompleted} value={String(stats.lessonsCompleted)} />
          <ProfileRow
            icon={Target}
            label={t.profile.weeklyGoal}
            value={`${user.weeklyGoalMinutes ?? 150} ${t.profile.perWeek}`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
