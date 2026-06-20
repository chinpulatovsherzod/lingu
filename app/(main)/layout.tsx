import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { UserMenu } from "@/components/layout/user-menu";
import { HeaderStats } from "@/components/layout/header-stats";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col lg:pl-0 min-h-screen">
        <header className="sticky top-4 z-30 mx-4 lg:mx-8 flex items-center justify-between glass-header px-6 py-3.5 rounded-2xl pl-14 lg:pl-6">
          <HeaderStats />
          <UserMenu name={session.user.name} />
        </header>
        <main className="flex-1 p-4 lg:p-8 pt-6 lg:pt-8">{children}</main>
      </div>
    </div>
  );
}
