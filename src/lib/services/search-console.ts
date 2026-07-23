import "server-only";
import { base44Fetch, base44List } from "@/lib/base44-api";
import type {
  SearchConsoleQuery,
  SearchConsoleSnapshot,
  WebsitePage,
} from "@/types/base44";

type SearchAnalyticsRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

type SearchConsoleSite = {
  siteUrl: string;
  permissionLevel?: string;
};

const MATON_URL = process.env.MATON_API_URL || "https://api.maton.ai";
const DOMAIN = "4x4models.com";

function webshopScope() {
  return process.env.NEXT_PUBLIC_WEBSHOP_ID
    ? { webshop_id: process.env.NEXT_PUBLIC_WEBSHOP_ID }
    : {};
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function syncPeriod() {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 2);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27);
  return { startDate: dateOnly(start), endDate: dateOnly(end) };
}

async function matonFetch(path: string, init: RequestInit = {}) {
  const apiKey = process.env.MATON_API_KEY;
  if (!apiKey) {
    throw new Error("MATON_API_KEY ontbreekt in de Vercel-omgeving.");
  }

  const response = await fetch(`${MATON_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      ...(process.env.MATON_GOOGLE_CONNECTION_ID
        ? { "Maton-Connection": process.env.MATON_GOOGLE_CONNECTION_ID }
        : {}),
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    if (response.status === 401 || response.status === 403 || response.status === 404) {
      throw new Error("Google Search Console is nog niet als actieve Maton-verbinding gekoppeld.");
    }
    throw new Error(`Search Console sync mislukt (${response.status}): ${detail.slice(0, 240)}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) as Record<string, unknown> : {};
}

async function queryAnalytics(siteUrl: string, body: Record<string, unknown>) {
  const payload = await matonFetch(
    `/google-search-console/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    { method: "POST", body: JSON.stringify(body) },
  );
  return Array.isArray(payload.rows) ? payload.rows as SearchAnalyticsRow[] : [];
}

function chooseSite(sites: SearchConsoleSite[]) {
  const preferred = process.env.MATON_GSC_SITE_URL;
  if (preferred && sites.some((site) => site.siteUrl === preferred)) return preferred;

  return sites.find((site) => site.siteUrl === `sc-domain:${DOMAIN}`)?.siteUrl ||
    sites.find((site) => site.siteUrl === "https://www.4x4models.com/")?.siteUrl ||
    sites.find((site) => site.siteUrl.includes(DOMAIN))?.siteUrl;
}

function pageSlugFromUrl(value: string) {
  try {
    const url = new URL(value);
    if (!url.hostname.endsWith(DOMAIN)) return "";
    return url.pathname.replace(/^\/+|\/+$/g, "") || "home";
  } catch {
    return "";
  }
}

function opportunityScore(row: SearchAnalyticsRow) {
  const impressions = row.impressions || 0;
  const ctr = row.ctr || 0;
  const position = row.position || 99;
  return Math.round(Math.min(
    100,
    impressions / 80 + Math.max(0, 0.08 - ctr) * 1000 + Math.max(0, 12 - position) * 2,
  ));
}

async function upsertSnapshot(payload: Partial<SearchConsoleSnapshot>) {
  const { records } = await base44List<SearchConsoleSnapshot>("SearchConsoleSnapshot", {
    q: {
      site_url: payload.site_url,
      period_start: payload.period_start,
      period_end: payload.period_end,
      ...webshopScope(),
    },
    limit: 1,
  });

  if (records[0]?.id) {
    return base44Fetch<SearchConsoleSnapshot>(`/entities/SearchConsoleSnapshot/${records[0].id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }
  return base44Fetch<SearchConsoleSnapshot>("/entities/SearchConsoleSnapshot", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function upsertQuery(payload: Partial<SearchConsoleQuery>) {
  const q = payload.record_type === "query"
    ? {
        record_type: "query",
        query: payload.query,
        period_start: payload.period_start,
        ...webshopScope(),
      }
    : {
        record_type: "page",
        page_url: payload.page_url,
        period_start: payload.period_start,
        ...webshopScope(),
      };
  const { records } = await base44List<SearchConsoleQuery>("SearchConsoleQuery", {
    q,
    limit: 1,
  });

  if (records[0]?.id) {
    return base44Fetch<SearchConsoleQuery>(`/entities/SearchConsoleQuery/${records[0].id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }
  return base44Fetch<SearchConsoleQuery>("/entities/SearchConsoleQuery", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function syncSearchConsoleToCms() {
  const sitePayload = await matonFetch("/google-search-console/webmasters/v3/sites");
  const sites = Array.isArray(sitePayload.siteEntry)
    ? sitePayload.siteEntry as SearchConsoleSite[]
    : [];
  const siteUrl = chooseSite(sites);
  if (!siteUrl) {
    throw new Error("Geen geverifieerde Search Console-property voor 4x4models.com gevonden.");
  }

  const { startDate, endDate } = syncPeriod();
  const [overallRows, queryRows, pageRows, sitemapPayload, pageResponse] = await Promise.all([
    queryAnalytics(siteUrl, { startDate, endDate, rowLimit: 1, searchType: "web" }),
    queryAnalytics(siteUrl, { startDate, endDate, dimensions: ["query"], rowLimit: 100, searchType: "web" }),
    queryAnalytics(siteUrl, { startDate, endDate, dimensions: ["page"], rowLimit: 100, searchType: "web" }),
    matonFetch(`/google-search-console/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`),
    base44List<WebsitePage>("WebsitePage", { q: webshopScope(), limit: 500 }),
  ]);
  const syncedAt = new Date().toISOString();
  const overall = overallRows[0] || {};
  const sitemaps = Array.isArray(sitemapPayload.sitemap)
    ? sitemapPayload.sitemap as Array<Record<string, unknown>>
    : [];
  const sitemap = sitemaps.find((item) => String(item.path || "").includes("sitemap")) || sitemaps[0];

  await upsertSnapshot({
    ...webshopScope(),
    site_url: siteUrl,
    domain: DOMAIN,
    period_start: startDate,
    period_end: endDate,
    clicks: overall.clicks || 0,
    impressions: overall.impressions || 0,
    ctr: overall.ctr || 0,
    position: overall.position || 0,
    sitemap_url: String(sitemap?.path || "https://www.4x4models.com/sitemap.xml"),
    sitemap_status: sitemap ? (sitemap.isPending ? "pending" : "submitted") : "not_found",
    verified_sites: sites.map((site) => site.siteUrl),
    synced_at: syncedAt,
  });

  for (const row of queryRows) {
    const query = row.keys?.[0] || "";
    if (!query) continue;
    await upsertQuery({
      ...webshopScope(),
      site_url: siteUrl,
      record_type: "query",
      query,
      period_start: startDate,
      period_end: endDate,
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
      opportunity_score: opportunityScore(row),
      synced_at: syncedAt,
    });
  }

  const pagesBySlug = new Map(pageResponse.records.map((page) => [page.slug, page]));
  for (const row of pageRows) {
    const pageUrl = row.keys?.[0] || "";
    if (!pageUrl) continue;
    const pageSlug = pageSlugFromUrl(pageUrl);
    await upsertQuery({
      ...webshopScope(),
      site_url: siteUrl,
      record_type: "page",
      page_url: pageUrl,
      page_slug: pageSlug,
      period_start: startDate,
      period_end: endDate,
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
      opportunity_score: opportunityScore(row),
      synced_at: syncedAt,
    });

    const page = pagesBySlug.get(pageSlug);
    if (page?.id) {
      await base44Fetch(`/entities/WebsitePage/${page.id}`, {
        method: "PUT",
        body: JSON.stringify({
          search_console_clicks: row.clicks || 0,
          search_console_impressions: row.impressions || 0,
          search_console_ctr: row.ctr || 0,
          search_console_position: row.position || 0,
          last_search_console_sync: syncedAt,
        }),
      });
    }
  }

  return {
    siteUrl,
    startDate,
    endDate,
    queryCount: queryRows.length,
    pageCount: pageRows.length,
    clicks: overall.clicks || 0,
    impressions: overall.impressions || 0,
    syncedAt,
  };
}
