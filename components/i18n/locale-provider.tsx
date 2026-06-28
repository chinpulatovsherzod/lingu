"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getDictionary } from "@/lib/i18n/messages";
import type { Locale, Messages } from "@/lib/i18n/types";

type I18nContextValue = {
  locale: Locale;
  t: Messages;
  setLocale: (locale: Locale) => Promise<void>;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback(
    async (next: Locale) => {
      if (next === locale) return;
      try {
        await fetch("/api/locale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale: next }),
        });
      } catch (e) {
        console.error("Failed to persist locale:", e);
      }
      setLocaleState(next);
      router.refresh();
    },
    [locale, router]
  );

  const value = useMemo(
    () => ({ locale, t: getDictionary(locale), setLocale }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LocaleProvider");
  return ctx;
}
