"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Languages,
  GraduationCap,
  FileText,
  PenLine,
  BarChart3,
  Trophy,
  UserCircle,
  MessagesSquare,
  Menu,
  X,
  Sparkles,
  Gamepad2,
  LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/locale-provider";

const navItems: { href: string; key: keyof ReturnType<typeof useI18n>["t"]["nav"]; icon: LucideIcon }[] = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/lessons", key: "lessons", icon: BookOpen },
  { href: "/vocabulary", key: "vocabulary", icon: Languages },
  { href: "/ielts", key: "ielts", icon: GraduationCap },
  { href: "/mock-tests", key: "mockTests", icon: FileText },
  { href: "/grammar", key: "grammar", icon: PenLine },
  { href: "/mentor", key: "mentor", icon: MessagesSquare },
  { href: "/practice", key: "practice", icon: Gamepad2 },
  { href: "/analytics", key: "analytics", icon: BarChart3 },
  { href: "/achievements", key: "achievements", icon: Trophy },
  { href: "/profile", key: "profile", icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const content = (
    <>
      <div className="flex items-center gap-3 px-5 py-6 border-b border-border/20 mb-4 bg-muted/10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 overflow-hidden p-0.5">
          <img src="/logo.png" alt="Lingu logo" className="h-full w-full object-cover rounded-lg" />
        </div>
        <div>
          <p className="font-heading text-lg font-bold tracking-wider text-foreground">Lingu</p>

          <p className="text-[10px] uppercase font-bold text-accent tracking-widest leading-none mt-0.5">
            {t.nav.tagline}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 hover:scale-[1.01] border-l-2",
                active
                  ? "bg-gradient-to-r from-primary/15 to-transparent text-primary border-primary font-semibold shadow-sm shadow-primary/5"
                  : "text-muted-foreground hover:bg-muted/30 hover:text-foreground border-transparent"
              )}
            >
              <Icon className={cn("h-4 w-4 transition-transform", active ? "scale-110 text-primary" : "")} />
              {t.nav[item.key]}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden bg-card/85 border border-border backdrop-blur shadow-md rounded-lg"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/40 bg-card/45 backdrop-blur-md transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-4 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
        {content}
      </aside>
    </>
  );
}
