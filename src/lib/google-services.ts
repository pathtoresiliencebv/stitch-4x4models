import "server-only";
import { matonGet, matonSend } from "@/lib/maton";

/**
 * Google Search Console helpers via the Maton API gateway.
 * Endpoint reference: https://clawhub.ai/byungkyu/skills/api-gateway
 *   GET    /google-search-console/webmasters/v3/sites
 *   GET    /google-search-console/webmasters/v3/sites/{siteUrl}
 *   GET    /google-search-console/webmasters/v3/sites/{siteUrl}/sitemaps
 *   PUT    /google-search-console/webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}
 *   DELETE /google-search-console/webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}
 *   POST   /google-search-console/webmasters/v3/sites/{siteUrl}/searchAnalytics/query
 */

function encodeSite(siteUrl: string): string {
  // The Google API requires the siteUrl path segment to be URL-encoded.
  return encodeURIComponent(siteUrl);
}

function getSiteUrl(): string {
  return process.env.MATON_GSC_SITE_URL || "https://4x4models.com/";
}

export type GscSite = {
  siteUrl: string;
  permissionLevel?: string;
};

export async function listGscSites(): Promise<GscSite[]> {
  const data = await matonGet<{ siteEntry?: GscSite[] }>(
    "/google-search-console/webmasters/v3/sites"
  );
  return data.siteEntry || [];
}

export async function getGscSite(siteUrl: string = getSiteUrl()): Promise<GscSite> {
  return matonGet<GscSite>(
    `/google-search-console/webmasters/v3/sites/${encodeSite(siteUrl)}`
  );
}

export async function listGscSitemaps(siteUrl: string = getSiteUrl()) {
  const data = await matonGet<{ sitemap?: Array<{ path: string; lastSubmitted?: string; lastDownloaded?: string; isPending?: boolean; warnings?: string; errors?: string }> }>(
    `/google-search-console/webmasters/v3/sites/${encodeSite(siteUrl)}/sitemaps`
  );
  return data.sitemap || [];
}

export async function submitGscSitemap(
  feedpath: string,
  siteUrl: string = getSiteUrl()
): Promise<void> {
  const path = `/google-search-console/webmasters/v3/sites/${encodeSite(siteUrl)}/sitemaps/${encodeURIComponent(feedpath)}`;
  await matonSend("PUT", path);
}

export type SearchAnalyticsRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

export type SearchAnalyticsParams = {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  dimensions?: Array<"query" | "page" | "country" | "device" | "date" | "searchAppearance">;
  rowLimit?: number;
  startRow?: number;
  searchType?: "web" | "image" | "video" | "news" | "discover" | "googleNews";
  filter?: {
    dimension: string;
    operator: "equals" | "contains" | "notContains" | "includingRegex" | "excludingRegex";
    expression: string;
  };
};

export async function querySearchAnalytics(
  params: SearchAnalyticsParams,
  siteUrl: string = getSiteUrl()
): Promise<SearchAnalyticsRow[]> {
  const dimensionFilterGroups = params.filter
    ? [{ filters: [{ dimension: params.filter.dimension, operator: params.filter.operator, expression: params.filter.expression }] }]
    : undefined;

  const data = await matonSend<{ rows?: SearchAnalyticsRow[] }>(
    "POST",
    `/google-search-console/webmasters/v3/sites/${encodeSite(siteUrl)}/searchAnalytics/query`,
    {
      startDate: params.startDate,
      endDate: params.endDate,
      dimensions: params.dimensions || ["query"],
      rowLimit: params.rowLimit ?? 25,
      startRow: params.startRow ?? 0,
      searchType: params.searchType || "web",
      dimensionFilterGroups,
    }
  );
  return data.rows || [];
}

/**
 * Google Analytics 4 Data API helpers via the Maton gateway.
 * Returns the GA4 property id used for reporting.
 */
export function getGa4PropertyId(): string {
  return process.env.GA4_PROPERTY_ID || "";
}

export type Ga4RunReportResponse = {
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>;
    metricValues?: Array<{ value?: string }>;
  }>;
  rowCount?: number;
  metadata?: {
    currencyCode?: string;
    timeZone?: string;
  };
};

/**
 * Lightweight GA4 reporter. Use only in server routes.
 *
 * NOTE: We don't have the GA4 Data API routing ref in this repo, but the Maton
 * gateway follows the documented passthrough convention:
 *   POST /google-analytics-data/v1beta/properties/{propertyId}:runReport
 * Body matches https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport
 */
export async function runGa4Report(
  request: Record<string, unknown>,
  propertyId: string = getGa4PropertyId()
): Promise<Ga4RunReportResponse> {
  if (!propertyId) {
    throw new Error("GA4_PROPERTY_ID is not configured.");
  }
  return matonSend<Ga4RunReportResponse>(
    "POST",
    `/google-analytics-data/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`,
    request
  );
}