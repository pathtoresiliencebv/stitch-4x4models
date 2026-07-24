import {
  localeForPublicPathname,
  publicPathForLocale,
  stripSupportedLocalePrefix,
} from "@/lib/i18n-routing";

export type MirrorWebsitePageRecord = {
  id: string;
  slug?: string;
  status?: string;
  content?: string;
  title?: string;
};

export function alternateLocalePath(pathname: string, targetLocale: "en" | "nl") {
  return publicPathForLocale(pathname, targetLocale);
}

export function resolveMirrorContentPathname(
  publicPathname: string,
  pages: Record<string, string>,
) {
  const locale = localeForPublicPathname(publicPathname);
  const basePathname = stripSupportedLocalePrefix(publicPathname);
  const englishPathname = basePathname === "/" ? "/en" : `/en${basePathname}`;
  const contentPathname =
    locale === "en" && pages[englishPathname] ? englishPathname : basePathname;

  return {
    locale,
    publicPathname: publicPathForLocale(publicPathname, locale),
    contentPathname,
  };
}

export function base44ContentPathname(
  publicPathname: string,
  locale = localeForPublicPathname(publicPathname),
) {
  const basePathname = stripSupportedLocalePrefix(publicPathname);
  if (locale === "nl") return basePathname;
  return basePathname === "/" ? "/en" : `/en${basePathname}`;
}

function hasRenderableHtml(html: string) {
  return /<(?:main|section|article|div|header|footer|h1|p)(?:\s|>)/i.test(html);
}

export function hasIncompleteHtmlTag(html: string) {
  const trimmed = html.trim();
  const lastLt = trimmed.lastIndexOf("<");
  const lastGt = trimmed.lastIndexOf(">");

  if (lastLt <= lastGt) return false;

  return /^<\/?[A-Za-z][A-Za-z0-9:-]*(?:\s|$)/.test(trimmed.slice(lastLt));
}

export function isUsableBase44MirrorContent(html: string) {
  return hasRenderableHtml(html) && !hasIncompleteHtmlTag(html);
}

export function selectBase44MirrorRecord<T extends MirrorWebsitePageRecord>(
  records: T[],
  expectedSlug: string,
) {
  return records.find((record) => (
    record.slug === expectedSlug &&
    (!record.status || record.status === "published")
  ));
}

export function sanitizeBase44MirrorFragment(content: string) {
  let fragment = content.trim();
  const mainMatch = fragment.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);

  if (mainMatch?.[1]) {
    fragment = mainMatch[1].trim();
  }

  return fragment
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, "")
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<\/?html\b[^>]*>/gi, "")
    .replace(/<\/?body\b[^>]*>/gi, "")
    .trim();
}
