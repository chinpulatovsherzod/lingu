import type { Locale, Messages } from "../types";
import { en } from "./en";
import { ru } from "./ru";
import { uz } from "./uz";

export const dictionaries: Record<Locale, Messages> = { en, ru, uz };

export function getDictionary(locale: Locale): Messages {
  return dictionaries[locale];
}

/** Replace `{key}` placeholders in a template string. */
export function formatMessage(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
}
