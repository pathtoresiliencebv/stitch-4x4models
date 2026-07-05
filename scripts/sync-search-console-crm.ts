const write = Deno.env.get("BASE44_WRITE") === "true";
const matonApiKey = Deno.env.get("MATON_API_KEY") || "";
const matonBaseUrl = Deno.env.get("MATON_API_URL") || "https://api.maton.ai";
const preferredSiteUrl = Deno.env.get("MATON_GSC_SITE_URL") || "";
const domain = "4x4models.com";
const canonicalUrl = "https://www.4x4models.com";
const workingWebshopName = "4x4models";
const archivedWebshopName = "4x4models.com";

type EntityRecord = Record<string, unknown> & { id?: string };
type SearchAnalyticsRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

const stats: Record<string, number | string> = {
  write: write ? "true" : "false",
  WebshopUpdated: 0,
  SearchConsoleSnapshot: 0,
  SearchConsoleQuery: 0,
  WebsitePageSearchMetrics: 0,
};

function entity(name: string) {
  return base44.entities[name];
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRateLimitError(error: unknown) {
  const maybe = error as { status?: number; data?: { message?: string }; message?: string };
  return maybe?.status === 429 ||
    /rate limit/i.test(maybe?.message || "") ||
    /rate limit/i.test(maybe?.data?.message || "");
}

async function withRetry<T>(operation: () => Promise<T>, label: string): Promise<T> {
  const delays = [1500, 3500, 8000, 16000, 30000];

  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (!isRateLimitError(error) || attempt === delays.length) throw error;
      console.warn(`${label} hit rate limit; retrying in ${delays[attempt]}ms`);
      await sleep(delays[attempt]);
    }
  }

  throw new Error(`${label} failed after retries`);
}

async function listAll(entityName: string) {
  return await withRetry(
    () => entity(entityName).list(undefined, 5000) as Promise<EntityRecord[]>,
    `${entityName}.list`,
  );
}

async function updateRecord(entityName: string, id: string, payload: EntityRecord) {
  if (!write) return;
  await withRetry(() => entity(entityName).update(id, payload), `${entityName}.update`);
}

async function createRecord(entityName: string, payload: EntityRecord) {
  if (!write) return payload;
  return await withRetry(() => entity(entityName).create(payload), `${entityName}.create`);
}

async function upsert(entityName: string, match: (record: EntityRecord) => boolean, payload: EntityRecord) {
  const records = await listAll(entityName);
  const existing = records.find(match);
  if (existing?.id) {
    await updateRecord(entityName, existing.id, payload);
    return existing;
  }

  return await createRecord(entityName, payload);
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function period() {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 2);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27);
  return { startDate: dateOnly(start), endDate: dateOnly(end) };
}

function matonHeaders() {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${matonApiKey}`,
    Accept: "application/json",
  };
  const connectionId = Deno.env.get("MATON_GOOGLE_CONNECTION_ID");
  if (connectionId) headers["Maton-Connection"] = connectionId;
  return headers;
}

async function matonFetch(path: string, init: RequestInit = {}) {
  if (!matonApiKey) {
    throw new Error("MATON_API_KEY ontbreekt in deze sessie.");
  }

  const response = await fetch(`${matonBaseUrl}${path}`, {
    ...init,
    headers: {
      ...matonHeaders(),
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Maton ${path} failed (${response.status}): ${text.slice(0, 400)}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

function encodeSite(siteUrl: string) {
  return encodeURIComponent(siteUrl);
}

async function listSites() {
  const data = await matonFetch("/google-search-console/webmasters/v3/sites");
  return Array.isArray(data.siteEntry) ? data.siteEntry as Array<{ siteUrl: string; permissionLevel?: string }> : [];
}

function pickSiteUrl(sites: Array<{ siteUrl: string }>) {
  if (preferredSiteUrl) return preferredSiteUrl;
  const siteUrls = sites.map((site) => site.siteUrl);
  return siteUrls.find((site) => site === `sc-domain:${domain}`) ||
    siteUrls.find((site) => site === `${canonicalUrl}/`) ||
    siteUrls.find((site) => site === "https://4x4models.com/") ||
    siteUrls.find((site) => site.includes(domain)) ||
    `${canonicalUrl}/`;
}

async function listSitemaps(siteUrl: string) {
  const data = await matonFetch(`/google-search-console/webmasters/v3/sites/${encodeSite(siteUrl)}/sitemaps`);
  return Array.isArray(data.sitemap) ? data.sitemap as EntityRecord[] : [];
}

async function queryAnalytics(siteUrl: string, body: EntityRecord) {
  const data = await matonFetch(
    `/google-search-console/webmasters/v3/sites/${encodeSite(siteUrl)}/searchAnalytics/query`,
    { method: "POST", body: JSON.stringify(body) },
  );
  return Array.isArray(data.rows) ? data.rows as SearchAnalyticsRow[] : [];
}

function routeSlugFromUrl(value?: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (!url.hostname.includes(domain)) return "";
    const path = url.pathname.replace(/^\/+|\/+$/g, "");
    return path || "home";
  } catch {
    return "";
  }
}

function opportunity(row: SearchAnalyticsRow) {
  const impressions = row.impressions || 0;
  const ctr = row.ctr || 0;
  const position = row.position || 99;
  const ctrGap = Math.max(0, 0.08 - ctr) * 1000;
  return Math.round(Math.min(100, impressions / 80 + ctrGap + Math.max(0, 12 - position) * 2));
}

async function main() {
  const webshops = await listAll("Webshop");
  const working = webshops.find((record) => record.name === workingWebshopName) || webshops[0];
  const archived = webshops.find((record) => record.name === archivedWebshopName && record.id !== working?.id);
  const webshopId = String(working?.id || "");

  if (working?.id) {
    await updateRecord("Webshop", working.id, {
      name: workingWebshopName,
      url: canonicalUrl,
      status: "actief",
      description: "Premium automotive 4x4 knowledge base, webshop en SEO cockpit.",
      repo_url: "https://github.com/pathtoresiliencebv/stitch-4x4models",
      vercel_url: canonicalUrl,
    });
    stats.WebshopUpdated = Number(stats.WebshopUpdated) + 1;
  }

  if (archived?.id) {
    await updateRecord("Webshop", archived.id, {
      status: "inactief",
      description: "Gearchiveerde dubbele website-record. Gebruik 4x4models met canonical https://www.4x4models.com.",
    });
    stats.WebshopUpdated = Number(stats.WebshopUpdated) + 1;
  }

  const sites = await listSites();
  const siteUrl = pickSiteUrl(sites);
  const { startDate, endDate } = period();
  const syncedAt = new Date().toISOString();

  const [overallRows, queryRows, pageRows, sitemaps] = await Promise.all([
    queryAnalytics(siteUrl, { startDate, endDate, rowLimit: 1, searchType: "web" }),
    queryAnalytics(siteUrl, { startDate, endDate, dimensions: ["query"], rowLimit: 100, searchType: "web" }),
    queryAnalytics(siteUrl, { startDate, endDate, dimensions: ["page"], rowLimit: 100, searchType: "web" }),
    listSitemaps(siteUrl),
  ]);

  const overall = overallRows[0] || {};
  const sitemap = sitemaps.find((item) => String(item.path || "").includes("sitemap")) || sitemaps[0];

  await upsert(
    "SearchConsoleSnapshot",
    (record) => record.site_url === siteUrl && record.period_start === startDate && record.period_end === endDate,
    {
      webshop_id: webshopId,
      site_url: siteUrl,
      domain,
      period_start: startDate,
      period_end: endDate,
      clicks: overall.clicks || 0,
      impressions: overall.impressions || 0,
      ctr: overall.ctr || 0,
      position: overall.position || 0,
      sitemap_url: String(sitemap?.path || `${canonicalUrl}/sitemap.xml`),
      sitemap_status: sitemap ? (sitemap.isPending ? "pending" : "submitted") : "not_found",
      verified_sites: sites.map((site) => site.siteUrl),
      synced_at: syncedAt,
    },
  );
  stats.SearchConsoleSnapshot = Number(stats.SearchConsoleSnapshot) + 1;

  for (const row of queryRows) {
    const query = row.keys?.[0] || "";
    if (!query) continue;
    await upsert(
      "SearchConsoleQuery",
      (record) => record.record_type === "query" && record.query === query && record.period_start === startDate,
      {
        webshop_id: webshopId,
        site_url: siteUrl,
        record_type: "query",
        query,
        period_start: startDate,
        period_end: endDate,
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
        opportunity_score: opportunity(row),
        synced_at: syncedAt,
      },
    );
    stats.SearchConsoleQuery = Number(stats.SearchConsoleQuery) + 1;
  }

  const pages = await listAll("WebsitePage");
  const pagesBySlug = new Map(pages.map((page) => [String(page.slug || "").replace(/^\/+|\/+$/g, "") || "home", page]));

  for (const row of pageRows) {
    const pageUrl = row.keys?.[0] || "";
    const pageSlug = routeSlugFromUrl(pageUrl);
    await upsert(
      "SearchConsoleQuery",
      (record) => record.record_type === "page" && record.page_url === pageUrl && record.period_start === startDate,
      {
        webshop_id: webshopId,
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
        opportunity_score: opportunity(row),
        synced_at: syncedAt,
      },
    );
    stats.SearchConsoleQuery = Number(stats.SearchConsoleQuery) + 1;

    const page = pagesBySlug.get(pageSlug);
    if (page?.id) {
      await updateRecord("WebsitePage", page.id, {
        search_console_clicks: row.clicks || 0,
        search_console_impressions: row.impressions || 0,
        search_console_ctr: row.ctr || 0,
        search_console_position: row.position || 0,
        last_search_console_sync: syncedAt,
      });
      stats.WebsitePageSearchMetrics = Number(stats.WebsitePageSearchMetrics) + 1;
    }
  }

  console.log(JSON.stringify({ stats, siteUrl, startDate, endDate }, null, 2));
}

await main();
