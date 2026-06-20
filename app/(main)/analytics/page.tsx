import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAnalyticsData } from "@/lib/data";
import { getServerI18n } from "@/lib/i18n";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export default async function AnalyticsPage() {
  const { t } = await getServerI18n();
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const data = await getAnalyticsData(session.user.id, t);
  if (!data) redirect("/auth/login");

  return (
    <AnalyticsDashboard data={data} labels={t.analytics} ieltsSections={t.dashboard.ieltsSections} />
  );
}
