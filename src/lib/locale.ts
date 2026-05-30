import "server-only";
import type { Locale } from "@/types/common";

export type { Locale };

export const locales = ["en", "nl"] as const;
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizedPath(locale: Locale, path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

export function t(
  dictionary: Record<string, string>,
  key: string,
  fallback: string
) {
  return dictionary[key] || fallback;
}
