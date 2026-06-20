"use client";



import { useEffect, useState } from "react";

import { Flame } from "lucide-react";

import { useI18n } from "@/components/i18n/locale-provider";



type HeaderData = { streakCount: number; totalXp: number };



export function HeaderStats() {

  const { t } = useI18n();

  const [stats, setStats] = useState<HeaderData>({ streakCount: 0, totalXp: 0 });



  useEffect(() => {

    let cancelled = false;

    fetch("/api/user/header")

      .then((r) => (r.ok ? r.json() : null))

      .then((data) => {

        if (!cancelled && data) {

          setStats({ streakCount: data.streakCount ?? 0, totalXp: data.totalXp ?? 0 });

        }

      })

      .catch(() => {});

    return () => {

      cancelled = true;

    };

  }, []);



  return (

    <div className="flex items-center gap-2 text-sm">

      <Flame className="h-4 w-4 text-warning" />

      <span>

        {t.header.streak}: {stats.streakCount} {t.header.days}

      </span>

      <span className="text-muted-foreground">· XP: {stats.totalXp}</span>

    </div>

  );

}

