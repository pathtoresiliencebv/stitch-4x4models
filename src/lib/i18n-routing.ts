export type Locale = "en" | "nl";

export const LOCALE_COOKIE = "4x4models_locale";

export function stripSupportedLocalePrefix(pathname: string) {
  if (pathname === "/en" || pathname === "/nl") return "/";
  if (pathname.startsWith("/en/") || pathname.startsWith("/nl/")) {
    return pathname.slice(3) || "/";
  }

  return pathname || "/";
}

export function localeForPublicPathname(pathname: string): Locale {
  return pathname === "/nl" || pathname.startsWith("/nl/") ? "nl" : "en";
}

export function publicPathForLocale(pathname: string, locale: Locale) {
  const basePath = stripSupportedLocalePrefix(pathname);

  if (locale === "nl") {
    return basePath === "/" ? "/nl" : `/nl${basePath}`;
  }

  return basePath;
}

export function isLegacyEnglishPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/");
}

export function preferredLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) return "en";

  const preferred = header
    .split(",")
    .map((part, index) => {
      const [tag = "", ...params] = part.trim().split(";");
      const qParam = params.find((param) => param.trim().startsWith("q="));
      const q = qParam ? Number(qParam.split("=")[1]) : 1;
      return {
        tag: tag.toLowerCase(),
        q: Number.isFinite(q) ? q : 0,
        index,
      };
    })
    .filter((entry) => entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index)[0]?.tag;

  return preferred === "nl" || preferred?.startsWith("nl-") ? "nl" : "en";
}
