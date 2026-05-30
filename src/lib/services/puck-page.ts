import "server-only";
import { base44Fetch, base44List } from "@/lib/base44-api";
import { sanitizeManagedText } from "@/lib/content";
import type { Locale, SiteContent } from "@/types/common";
import type { PuckPageData } from "@/types/puck";

const puckQuery = (page: string, locale: Locale) => ({
  page,
  locale,
  section: "puck",
  key: "data",
});

function sanitizePuckValue(value: unknown): unknown {
  if (typeof value === "string") return sanitizeManagedText(value);
  if (Array.isArray(value)) return value.map(sanitizePuckValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, childValue]) => [key, sanitizePuckValue(childValue)])
    );
  }
  return value;
}

function sanitizePuckData(data: PuckPageData): PuckPageData {
  return {
    ...data,
    root: sanitizePuckValue(data.root) as PuckPageData["root"],
    content: data.content.map((block) => ({
      ...block,
      props: sanitizePuckValue(block.props || {}) as typeof block.props,
    })),
  } as PuckPageData;
}

export async function getPuckPageData(page: string, locale: Locale) {
  const { records } = await base44List<SiteContent>("SiteContent", {
    q: puckQuery(page, locale),
    limit: 1,
    sort_by: "-updated_date",
  });

  const raw = records[0]?.value_long;
  if (!raw) return null;

  try {
    return sanitizePuckData(JSON.parse(raw) as PuckPageData);
  } catch {
    return null;
  }
}

export async function savePuckPageData(
  page: string,
  locale: Locale,
  data: PuckPageData
) {
  const { records } = await base44List<SiteContent>("SiteContent", {
    q: puckQuery(page, locale),
    limit: 1,
    sort_by: "-updated_date",
  });

  const payload: Partial<SiteContent> = {
    page,
    locale,
    section: "puck",
    key: "data",
    value: `CMS page: ${page}/${locale}`,
    value_long: JSON.stringify(sanitizePuckData(data)),
    notes: "Managed by the full-screen page editor",
  };

  if (records[0]?.id) {
    return base44Fetch<SiteContent>(`/entities/SiteContent/${records[0].id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  return base44Fetch<SiteContent>("/entities/SiteContent", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
