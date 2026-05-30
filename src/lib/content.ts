import "server-only";
import type { LocalizedPageContent, SiteContent } from "@/types/common";

export function sanitizeManagedText(value: string) {
  return value
    .replace(/powered directly by Base44/gi, "managed from the CMS")
    .replace(/powered by Base44/gi, "managed from the CMS")
    .replace(/stored in Base44/gi, "stored in the CMS")
    .replace(/from Base44/gi, "from the CMS")
    .replace(/Base44/gi, "CMS");
}

export function groupSiteContent(records: SiteContent[]): LocalizedPageContent {
  return records.reduce<LocalizedPageContent>((acc, item) => {
    const section = item.section || "global";
    acc[section] ||= {};
    acc[section][item.key] = {
      ...item,
      value: item.value ? sanitizeManagedText(item.value) : item.value,
      value_long: item.value_long ? sanitizeManagedText(item.value_long) : item.value_long,
      notes: item.notes ? sanitizeManagedText(item.notes) : item.notes,
    };
    return acc;
  }, {});
}

export function contentText(
  content: LocalizedPageContent,
  section: string,
  key: string,
  fallback: string
) {
  const item = content[section]?.[key];
  return sanitizeManagedText(item?.value_long || item?.value || fallback);
}

export function contentLink(
  content: LocalizedPageContent,
  section: string,
  key: string,
  fallback: string
) {
  return content[section]?.[key]?.link_url || fallback;
}

export function contentImage(
  content: LocalizedPageContent,
  section: string,
  key: string,
  fallback: string
) {
  return content[section]?.[key]?.image_url || fallback;
}
