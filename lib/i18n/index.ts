import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES, type Locale, type Messages } from "./types";
import { getDictionary } from "./messages";

export { LOCALES, LOCALE_COOKIE, DEFAULT_LOCALE, type Locale, type Messages } from "./types";
export { getDictionary, formatMessage } from "./messages";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  if (value && isLocale(value)) return value;
  return DEFAULT_LOCALE;
}

export async function getServerI18n(): Promise<{ locale: Locale; t: Messages }> {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}
