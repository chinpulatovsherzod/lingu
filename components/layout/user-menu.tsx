"use client";



import Link from "next/link";

import { signOut } from "next-auth/react";

import { LogOut, User } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeToggle } from "./theme-toggle";

import { useI18n } from "@/components/i18n/locale-provider";



export function UserMenu({ name }: { name?: string | null }) {

  const { t } = useI18n();



  return (

    <div className="flex items-center gap-2 sm:gap-3">

      <ThemeToggle />

      <LanguageSwitcher />

      <span className="hidden text-sm font-medium sm:inline">{name ?? t.header.student}</span>

      <Link href="/profile" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>

        <User className="h-4 w-4" />

        <span className="hidden sm:inline">{t.header.myAccount}</span>

        <span className="sm:hidden">{t.header.accountShort}</span>

      </Link>

      <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/auth/login" })}>

        <LogOut className="h-4 w-4" />

        <span className="hidden sm:inline">{t.header.logout}</span>

      </Button>

    </div>

  );

}

