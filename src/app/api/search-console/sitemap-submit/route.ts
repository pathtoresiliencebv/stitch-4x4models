import { NextResponse } from "next/server";
import { submitGscSitemap, hasMatonKey } from "@/lib/maton-helpers";

/**
 * GET /api/search-console/sitemap-submit
 *
 * Pings Google Search Console via Maton to re-submit the sitemap. Designed to
 * be called from a Vercel cron or manually after major content changes.
 *
 * Auth: requires MATON_API_KEY to be set on the server. Returns 503 otherwise
 * so we never leak a key path from the client.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!hasMatonKey()) {
    return NextResponse.json(
      { ok: false, error: "MATON_API_KEY is not configured on the server." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const sitemapPath = searchParams.get("sitemap") || "/sitemap.xml";

  try {
    await submitGscSitemap(sitemapPath);
    return NextResponse.json({
      ok: true,
      submitted: sitemapPath,
      siteUrl: process.env.MATON_GSC_SITE_URL || "https://4x4models.com/",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}