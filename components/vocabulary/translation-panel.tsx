"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftRight, Copy, Check, Volume2, BookmarkPlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/locale-provider";
import { formatMessage } from "@/lib/i18n/messages";
import type { TranslateLang } from "@/lib/translate";

const LANGS: TranslateLang[] = ["en", "ru", "uz"];

type Props = {
  defaultSource?: TranslateLang;
  defaultTarget?: TranslateLang;
  onSaved?: () => void;
};

export function TranslationPanel({ defaultSource = "ru", defaultTarget = "en", onSaved }: Props) {
  const { t } = useI18n();
  const tr = t.vocabulary.translator;

  const [sourceLang, setSourceLang] = useState<TranslateLang>(defaultSource);
  const [targetLang, setTargetLang] = useState<TranslateLang>(defaultTarget);
  const [sourceText, setSourceText] = useState("");
  const [targetText, setTargetText] = useState("");
  const [loading, setLoading] = useState(false);
  const [translateError, setTranslateError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestId = useRef(0);

  const translate = useCallback(
    async (text: string, source: TranslateLang, target: TranslateLang) => {
      if (!text.trim()) {
        setTargetText("");
        setTranslateError(false);
        return;
      }
      if (source === target) {
        setTargetText(text);
        setTranslateError(false);
        return;
      }

      const id = ++requestId.current;
      setLoading(true);
      setTranslateError(false);
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, source, target }),
        });
        const data = await res.json();
        if (id !== requestId.current) return;
        if (res.ok && data.translation) {
          setTargetText(data.translation);
        } else {
          setTargetText("");
          setTranslateError(true);
        }
      } catch {
        if (id === requestId.current) {
          setTargetText("");
          setTranslateError(true);
        }
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      translate(sourceText, sourceLang, targetLang);
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [sourceText, sourceLang, targetLang, translate]);

  function swapLanguages() {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(targetText);
    setTargetText(sourceText);
    setSaveState("idle");
  }

  function clearAll() {
    setSourceText("");
    setTargetText("");
    setSaveState("idle");
  }

  async function copyTranslation() {
    if (!targetText) return;
    await navigator.clipboard.writeText(targetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function speak(text: string, lang: TranslateLang) {
    if (!text.trim() || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US";
    window.speechSynthesis.speak(utterance);
  }

  async function saveWord() {
    if (!sourceText.trim() || !targetText.trim()) return;
    setSaveState("saving");
    try {
      const res = await fetch("/api/vocabulary/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceText,
          targetText,
          sourceLang,
          targetLang,
        }),
      });
      if (!res.ok) {
        setSaveState("error");
        return;
      }
      setSaveState("saved");
      onSaved?.();
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
        <LangSelect
          value={sourceLang}
          onChange={(lang) => {
            setSourceLang(lang);
            setSaveState("idle");
          }}
          labels={tr.languages}
          exclude={targetLang}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full"
          onClick={swapLanguages}
          title="Swap"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
        <LangSelect
          value={targetLang}
          onChange={(lang) => {
            setTargetLang(lang);
            setSaveState("idle");
          }}
          labels={tr.languages}
          exclude={sourceLang}
        />
        <div className="ml-auto flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={clearAll} disabled={!sourceText && !targetText}>
            <X className="mr-1 h-3.5 w-3.5" />
            {tr.clear}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className="relative border-b border-border lg:border-b-0 lg:border-r">
          <textarea
            value={sourceText}
            onChange={(e) => {
              setSourceText(e.target.value);
              setSaveState("idle");
            }}
            placeholder={tr.sourcePlaceholder}
            className="min-h-[220px] w-full resize-none bg-transparent p-5 text-base leading-relaxed outline-none placeholder:text-muted-foreground/70 md:min-h-[280px]"
            spellCheck={false}
          />
          <div className="flex items-center justify-between border-t border-border/60 px-4 py-2">
            <span className="text-xs text-muted-foreground">
              {formatMessage(tr.charCount, { count: sourceText.length })}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!sourceText.trim()}
              onClick={() => speak(sourceText, sourceLang)}
            >
              <Volume2 className="mr-1 h-3.5 w-3.5" />
              {tr.listen}
            </Button>
          </div>
        </div>

        <div className="relative bg-muted/10">
          <div
            className={cn(
              "min-h-[220px] whitespace-pre-wrap p-5 text-base leading-relaxed md:min-h-[280px]",
              !targetText && !loading && "text-muted-foreground/60"
            )}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {tr.translating}
              </span>
            ) : translateError ? (
              <span className="text-warning">{tr.translateError}</span>
            ) : (
              targetText || tr.targetPlaceholder
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 px-4 py-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!targetText.trim()}
              onClick={() => speak(targetText, targetLang)}
            >
              <Volume2 className="mr-1 h-3.5 w-3.5" />
              {tr.listen}
            </Button>
            <div className="flex gap-1">
              <Button type="button" variant="ghost" size="sm" disabled={!targetText} onClick={copyTranslation}>
                {copied ? <Check className="mr-1 h-3.5 w-3.5 text-success" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
                {copied ? tr.copied : tr.copy}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!sourceText.trim() || !targetText.trim() || loading || saveState === "saving"}
                onClick={saveWord}
              >
                <BookmarkPlus className="mr-1 h-3.5 w-3.5" />
                {saveState === "saving"
                  ? "…"
                  : saveState === "saved"
                    ? tr.saved
                    : saveState === "error"
                      ? tr.saveError
                      : tr.saveWord}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LangSelect({
  value,
  onChange,
  labels,
  exclude,
}: {
  value: TranslateLang;
  onChange: (lang: TranslateLang) => void;
  labels: Record<TranslateLang, string>;
  exclude: TranslateLang;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TranslateLang)}
      className="h-9 rounded-lg border border-border bg-background px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/40"
    >
      {LANGS.map((lang) => (
        <option key={lang} value={lang} disabled={lang === exclude}>
          {labels[lang]}
        </option>
      ))}
    </select>
  );
}
