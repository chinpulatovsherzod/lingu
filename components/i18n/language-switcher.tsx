"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LOCALES, type Locale } from "@/lib/i18n/types";
import { useI18n } from "./locale-provider";

const LOCALE_LABELS: Record<Locale, keyof ReturnType<typeof useI18n>["t"]["language"]> = {
  en: "en",
  ru: "ru",
  uz: "uz",
};

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
      <Globe className="ml-1.5 hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
      {LOCALES.map((code) => (
        <Button
          key={code}
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 px-2 text-xs font-medium",
            locale === code && "bg-primary/20 text-primary hover:bg-primary/25"
          )}
          onClick={() => setLocale(code)}
          title={t.language[LOCALE_LABELS[code]]}
        >
          {code.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
