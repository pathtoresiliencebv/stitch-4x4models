import { readFile } from "node:fs/promises";
import path from "node:path";
import manifest from "@/data/live-mirror/manifest.json";
import { mirrorCssVarsForHref } from "@/data/live-mirror/image-map";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MirrorManifest = {
  pages: Record<string, string>;
};

type Base44WebsitePage = {
  id: string;
  slug?: string;
  status?: string;
  content?: string;
};

type Base44ListResponse<T> = {
  records?: T[];
};

type MirrorSource = "base44-full" | "base44-fragment" | "local";

type Base44MirrorPage = {
  html: string;
  source: Exclude<MirrorSource, "local">;
};

const BASE44_BASE_URL =
  process.env.NEXT_PUBLIC_BASE44_API_URL ||
  "https://stimulating-growth-suite-ai.base44.app/api";
const SITE_ORIGIN = "https://www.4x4models.com";

function injectMirrorOverrides(html: string) {
  const href = "/mirror-overrides.css";
  if (html.includes(href)) return html;
  return html.replace("</head>", `<link rel="stylesheet" href="${href}"/></head>`);
}

function addPremiumBodyClass(html: string) {
  return html.replace('<body class="', '<body class="mirror-premium ');
}

function rewriteBrandAssets(html: string) {
  return html
    .replace(/<link rel="icon"[^>]*>/g, "")
    .replace(/<link rel="apple-touch-icon"[^>]*>/g, "")
    .replace(
      "</head>",
      '<link rel="icon" href="/favicon.ico" sizes="32x32" type="image/x-icon"/><link rel="apple-touch-icon" href="/images/brand/icon.png" sizes="180x180"/></head>'
    )
    .replaceAll('src="/images/brand/logo.svg"', 'src="/images/brand/logo.png"')
    .replaceAll('href="/images/brand/logo.svg"', 'href="/images/brand/logo.png"')
    .replace(
      '<div class="text-base tracking-tightest font-medium text-ink">4x4models<span class="text-accent">.</span></div>',
      '<a class="footer-brand-logo inline-flex no-underline" aria-label="4x4models" href="/"><img src="/images/brand/logo.png" alt="4x4models"/></a>'
    )
    .replace(
      "<span>Gebouwd met Next.js · Statisch gegenereerd</span>",
      '<span>Powered by <a class="powered-by-link" href="https://jasonmohabali.com" target="_blank" rel="noopener noreferrer">jasonmohabali.com</a></span>'
    )
    .replaceAll("<span aria-hidden=\"true\">🌐</span>", "<span aria-hidden=\"true\" class=\"nl-flag\">🇳🇱</span>");
}

function rewriteCanonicalUrls(html: string, pathname: string) {
  const canonicalUrl = `${SITE_ORIGIN}${pathname === "/" ? "/" : pathname}`;
  const normalized = html
    .replaceAll("https://4x4models.com", SITE_ORIGIN)
    .replaceAll("http://4x4models.com", SITE_ORIGIN);

  const withCanonical = normalized.includes('rel="canonical"')
    ? normalized.replace(/<link rel="canonical" href="[^"]*"\/?>/g, `<link rel="canonical" href="${canonicalUrl}"/>`)
    : normalized.replace("</head>", `<link rel="canonical" href="${canonicalUrl}"/></head>`);

  return withCanonical
    .replace(/<meta property="og:url" content="[^"]*"\/?>/g, `<meta property="og:url" content="${canonicalUrl}"/>`)
    .replace(/<meta name="twitter:url" content="[^"]*"\/?>/g, `<meta name="twitter:url" content="${canonicalUrl}"/>`);
}

function mergeInlineStyle(tag: string, cssVars: string) {
  if (tag.includes('style="')) {
    return tag.replace(/style="([^"]*)"/, (_match, style: string) => {
      const separator = style.trim().endsWith(";") || !style.trim() ? "" : ";";
      return `style="${style}${separator} ${cssVars}"`;
    });
  }

  return tag.replace("<a ", `<a style="${cssVars}" `);
}

function addCardImageVars(html: string) {
  return html.replace(
    /<a\b(?=[^>]*\bclass="[^"]*\bgroup\b[^"]*\bno-underline\b[^"]*")(?=[^>]*\bhref="([^"]+)")[^>]*>/g,
    (tag: string, href: string) => mergeInlineStyle(tag, mirrorCssVarsForHref(href))
  );
}

function rewriteLocalImageUrls(html: string) {
  return html.replace(
    /\/_next\/image\?url=([^&"'\s,]+)(?:&amp;|&)w=\d+(?:&amp;|&)q=\d+(?:(?:&amp;|&)[^"'\s,]+)*/g,
    (_match, encodedUrl: string) => {
      try {
        return decodeURIComponent(encodedUrl);
      } catch {
        return encodedUrl;
      }
    }
  );
}

function normalizePathname(parts?: string[]) {
  if (!parts?.length) return "/";
  const pathname = `/${parts.join("/")}`;
  return pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function pathnameToSlug(pathname: string) {
  return pathname === "/" ? "home" : pathname.replace(/^\/+/, "");
}

function hasFullHtmlDocument(html: string) {
  return /<html(?:\s|>)/i.test(html) && /<\/html>/i.test(html);
}

function hasRenderableHtml(html: string) {
  return /<(?:main|section|article|div|header|footer|h1|p)(?:\s|>)/i.test(html);
}

function replaceMainContent(shellHtml: string, content: string) {
  if (/<main(?:\s|>)/i.test(content) && /<\/main>/i.test(content)) {
    return shellHtml.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, content);
  }

  return shellHtml.replace(/(<main\b[^>]*>)[\s\S]*?(<\/main>)/i, `$1${content}$2`);
}

function shouldReadBase44Mirror() {
  return process.env.BASE44_MIRROR_ENABLED === "true" && Boolean(process.env.BASE44_API_KEY);
}

async function readLocalMirrorHtml(fileName: string) {
  return readFile(
    path.join(process.cwd(), "src", "data", "live-mirror", "pages", fileName),
    "utf8"
  );
}

async function readBase44MirrorPage(pathname: string, localHtml: string): Promise<Base44MirrorPage | undefined> {
  if (!shouldReadBase44Mirror()) return undefined;

  const queryFilter: Record<string, string> = {
    slug: pathnameToSlug(pathname),
    status: "published",
  };
  if (process.env.NEXT_PUBLIC_WEBSHOP_ID) {
    queryFilter.webshop_id = process.env.NEXT_PUBLIC_WEBSHOP_ID;
  }

  const query = new URLSearchParams({
    q: JSON.stringify(queryFilter),
    limit: "1",
  });

  try {
    const response = await fetch(`${BASE44_BASE_URL}/entities/WebsitePage?${query}`, {
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.BASE44_API_KEY || "",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`Base44 mirror read failed for ${pathname}: ${response.status}`);
      return undefined;
    }

    const payload = (await response.json()) as Base44ListResponse<Base44WebsitePage> | Base44WebsitePage[];
    const records = Array.isArray(payload) ? payload : payload.records || [];
    const content = records[0]?.content?.trim();

    if (!content || !hasRenderableHtml(content)) {
      return undefined;
    }

    if (hasFullHtmlDocument(content)) {
      return { html: content, source: "base44-full" };
    }

    return { html: replaceMainContent(localHtml, content), source: "base44-fragment" };
  } catch (error) {
    console.warn(`Base44 mirror read failed for ${pathname}`, error);
    return undefined;
  }
}

function applyMirrorTransforms(html: string, pathname: string) {
  return injectMirrorOverrides(
    addPremiumBodyClass(
      addCardImageVars(
        rewriteCanonicalUrls(rewriteBrandAssets(rewriteLocalImageUrls(html)), pathname)
      )
    )
  );
}

export async function GET(
  _request: Request,
  props: { params: Promise<{ path?: string[] }> }
) {
  const { path: routeParts } = await props.params;
  const pathname = normalizePathname(routeParts);
  const fileName = (manifest as MirrorManifest).pages[pathname];

  if (!fileName) {
    return new Response("Pagina niet gevonden.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const localHtml = await readLocalMirrorHtml(fileName);
  const base44Page = await readBase44MirrorPage(pathname, localHtml);
  const html = base44Page?.html || localHtml;
  const source: MirrorSource = base44Page?.source || "local";

  return new Response(applyMirrorTransforms(html, pathname), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-mirror-source": source,
    },
  });
}
