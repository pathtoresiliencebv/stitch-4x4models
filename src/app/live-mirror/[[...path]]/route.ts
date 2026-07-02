import { readFile } from "node:fs/promises";
import path from "node:path";
import manifest from "@/data/live-mirror/manifest.json";
import { mirrorCssVarsForHref } from "@/data/live-mirror/image-map";
import {
  localeForPublicPathname,
  publicPathForLocale,
  stripSupportedLocalePrefix,
  type Locale,
} from "@/lib/i18n-routing";
import { searchLiveMirror, type SearchResult } from "@/lib/live-mirror-search";

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

const mobileNavItems = {
  nl: [
    ["Merken", "/merken"],
    ["Amerikaans", "/amerikaans"],
    ["Collecties", "/collecties"],
    ["Blog", "/blog"],
    ["Journal", "/journal"],
    ["Forum", "/forum"],
    ["Shop", "/shop"],
    ["Leren", "/leren"],
    ["Over ons", "/over-ons"],
  ],
  en: [
    ["Brands", "/merken"],
    ["American", "/amerikaans"],
    ["Collections", "/collecties"],
    ["Blog", "/blog"],
    ["Journal", "/journal"],
    ["Forum", "/forum"],
    ["Shop", "/shop"],
    ["Learn", "/leren"],
    ["About", "/over-ons"],
  ],
} satisfies Record<Locale, [string, string][]>;

const searchSuggestions = {
  nl: [
    "Hummer H2",
    "Toyota Land Cruiser",
    "Land Rover Defender",
    "differentiëel",
    "overlanding",
    "Mercedes G",
    "Jimny",
    "elektrische 4x4",
  ],
  en: [
    "Hummer H2",
    "Toyota Land Cruiser",
    "Land Rover Defender",
    "differential",
    "overlanding",
    "Mercedes G",
    "Jimny",
    "electric 4x4",
  ],
} satisfies Record<Locale, string[]>;

const searchCopy = {
  nl: {
    eyebrow: "4x4models zoeken",
    title: "Zoek door het complete 4x4 dossier.",
    intro: "Vind merken, modellen, collecties, artikelen, forumtopics en shop-items in één snelle zoeklaag.",
    placeholder: "Zoek Hummer, Land Cruiser, techniek...",
    button: "Zoeken",
    compactLabel: "Zoeken",
    suggestions: "Populaire zoekopdrachten",
    emptyTitle: "Begin met zoeken.",
    emptyText: "Typ een merk, model, techniekterm of collectie. De resultaten komen uit de bestaande 4x4models pagina's.",
    noResultsTitle: "Geen resultaten gevonden.",
    noResultsText: "Probeer een merknaam, modelnaam of bredere off-road term.",
    resultsSingular: "resultaat",
    resultsPlural: "resultaten",
    resultAction: "Bekijk pagina",
    metaTitle: "Zoeken",
    metaDescription: "Zoek door merken, modellen, artikelen, collecties, forumtopics en shop-items op 4x4models.",
  },
  en: {
    eyebrow: "4x4models search",
    title: "Search the full 4x4 dossier.",
    intro: "Find brands, model pages, collections, articles, forum threads and shop items from one fast search layer.",
    placeholder: "Search Hummer, Land Cruiser, suspension...",
    button: "Search",
    compactLabel: "Search",
    suggestions: "Popular searches",
    emptyTitle: "Start searching.",
    emptyText: "Type a brand, model, technical term or collection. Results are built from the existing 4x4models pages.",
    noResultsTitle: "No results found.",
    noResultsText: "Try a brand name, model name or broader off-road term.",
    resultsSingular: "result",
    resultsPlural: "results",
    resultAction: "View page",
    metaTitle: "Search",
    metaDescription: "Search brands, models, articles, collections, forum threads and shop items on 4x4models.",
  },
} satisfies Record<Locale, Record<string, string>>;

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
    .replace(
      "<span>Built with Next.js · Statically generated</span>",
      '<span>Powered by <a class="powered-by-link" href="https://jasonmohabali.com" target="_blank" rel="noopener noreferrer">jasonmohabali.com</a></span>'
    );
}

export function alternateLocalePath(pathname: string, targetLocale: Locale) {
  return publicPathForLocale(pathname, targetLocale);
}

function localizedPath(pathname: string, locale: Locale) {
  return publicPathForLocale(pathname, locale);
}

function languageSwitchHref(pathname: string, targetLocale: Locale) {
  const href = alternateLocalePath(pathname, targetLocale);
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}lang=${targetLocale}`;
}

function languageSwitcherHtml(pathname: string) {
  const locale = localeForPublicPathname(pathname);
  const nlClass = locale === "nl" ? " is-active" : "";
  const enClass = locale === "en" ? " is-active" : "";
  const label = locale === "nl" ? "Taalkeuze" : "Language";

  return [
    `<div class="language-switcher" aria-label="${label}">`,
    `<a class="language-switcher__link${nlClass}" href="${languageSwitchHref(pathname, "nl")}" aria-label="Bekijk de Nederlandse versie"><span aria-hidden="true" class="nl-flag">🇳🇱</span><span>NL</span></a>`,
    '<span class="language-switcher__divider" aria-hidden="true">/</span>',
    `<a class="language-switcher__link${enClass}" href="${languageSwitchHref(pathname, "en")}" aria-label="View the English version"><span>EN</span></a>`,
    "</div>",
  ].join("");
}

function rewriteLanguageSwitcher(html: string, pathname: string) {
  return html.replace(
    /<div class="relative shrink-0">\s*<button\b(?=[^>]*aria-haspopup="listbox")(?=[^>]*aria-label="(?:Taal|Language)")[\s\S]*?<\/button>\s*<\/div>/g,
    languageSwitcherHtml(pathname)
  );
}

function searchPublicPath(locale: Locale) {
  return locale === "nl" ? "/nl/zoeken" : "/search";
}

function isSearchPathname(pathname: string) {
  return pathname === "/search" ||
    pathname === "/zoeken" ||
    pathname === "/nl/zoeken" ||
    pathname === "/nl/search";
}

function searchLocaleForPathname(pathname: string): Locale {
  return pathname === "/nl/zoeken" || pathname === "/nl/search" || pathname === "/zoeken"
    ? "nl"
    : "en";
}

function searchIconSvg() {
  return '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M16.5 16.5 L21 21"></path></svg>';
}

function searchHeaderHtml(pathname: string) {
  const locale = localeForPublicPathname(pathname);
  const copy = searchCopy[locale];
  const action = searchPublicPath(locale);

  return [
    '<div class="mirror-search-shell">',
    `<form class="mirror-search-form" action="${action}" method="get" role="search" aria-label="${copy.compactLabel}">`,
    '<label class="mirror-search-label">',
    `<span class="mirror-search-icon">${searchIconSvg()}</span>`,
    `<input class="mirror-search-input" name="q" type="search" placeholder="${copy.placeholder}" autoComplete="off"/>`,
    "</label>",
    `<button class="mirror-search-submit" type="submit">${copy.button}</button>`,
    "</form>",
    `<a class="mirror-search-compact" href="${action}" aria-label="${copy.compactLabel}">${searchIconSvg()}</a>`,
    "</div>",
  ].join("");
}

function injectHeaderSearch(html: string, pathname: string) {
  if (html.includes("mirror-search-shell")) return html;

  return html.replace(
    /(<div class="language-switcher"[\s\S]*?<\/div>)/g,
    `$1${searchHeaderHtml(pathname)}`
  );
}

function mobileNavHtml(pathname: string) {
  const locale = localeForPublicPathname(pathname);
  const currentPath = stripSupportedLocalePrefix(pathname);
  const links = mobileNavItems[locale]
    .map(([label, href]) => {
      const localizedHref = localizedPath(href, locale);
      const isCurrent = currentPath === href || currentPath.startsWith(`${href}/`);
      const currentAttr = isCurrent ? ' aria-current="page"' : "";
      const currentClass = isCurrent ? " is-active" : "";
      return `<a class="mirror-mobile-nav__link${currentClass}" href="${localizedHref}"${currentAttr}>${label}</a>`;
    })
    .join("");

  return `<nav class="mirror-mobile-nav" aria-label="${locale === "nl" ? "Mobiele navigatie" : "Mobile navigation"}"><div class="mirror-mobile-nav__inner">${links}</div></nav>`;
}

function injectMobileNav(html: string, pathname: string) {
  if (html.includes("mirror-mobile-nav")) return html;
  return html.replace("</header>", `</header>${mobileNavHtml(pathname)}`);
}

function absoluteSiteUrl(pathname: string) {
  return `${SITE_ORIGIN}${pathname === "/" ? "/" : pathname}`;
}

function alternateLinkTags(pathname: string) {
  const enPath = publicPathForLocale(pathname, "en");
  const nlPath = publicPathForLocale(pathname, "nl");

  return [
    `<link rel="alternate" hrefLang="en" href="${absoluteSiteUrl(enPath)}"/>`,
    `<link rel="alternate" hrefLang="nl" href="${absoluteSiteUrl(nlPath)}"/>`,
    `<link rel="alternate" hrefLang="x-default" href="${absoluteSiteUrl(enPath)}"/>`,
  ].join("");
}

function rewriteHtmlLang(html: string, locale: Locale) {
  if (/<html\b[^>]*\blang="/i.test(html)) {
    return html.replace(/<html\b([^>]*)\blang="[^"]*"/i, `<html$1lang="${locale}"`);
  }

  return html.replace(/<html\b/i, `<html lang="${locale}"`);
}

function shouldLocalizeHref(pathname: string) {
  return ![
    "/api",
    "/admin",
    "/_next",
    "/live-mirror",
    "/mirror-next-static",
    "/images",
    "/favicons",
    "/brand-kit",
  ].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) && ![
    "/favicon.ico",
    "/mirror-overrides.css",
    "/robots.txt",
    "/sitemap.xml",
  ].includes(pathname);
}

function rewriteLocalizedInternalLinks(html: string, locale: Locale) {
  return html.replace(/href="\/([^"#?]*)(\?[^"]*)?"/g, (match, pathPart: string, query = "") => {
    const pathname = `/${pathPart}`;
    if (!shouldLocalizeHref(pathname)) return match;

    return `href="${publicPathForLocale(pathname, locale)}${query}"`;
  });
}

function rewriteCanonicalUrls(html: string, pathname: string) {
  const canonicalUrl = `${SITE_ORIGIN}${pathname === "/" ? "/" : pathname}`;
  const normalized = html
    .replaceAll("https://4x4models.com", SITE_ORIGIN)
    .replaceAll("http://4x4models.com", SITE_ORIGIN)
    .replace(/<link\s+rel="alternate"[^>]*>/gi, "");

  const withCanonical = normalized.includes('rel="canonical"')
    ? normalized.replace(/<link rel="canonical" href="[^"]*"\/?>/g, `<link rel="canonical" href="${canonicalUrl}"/>${alternateLinkTags(pathname)}`)
    : normalized.replace("</head>", `<link rel="canonical" href="${canonicalUrl}"/>${alternateLinkTags(pathname)}</head>`);

  return withCanonical
    .replace(/<meta property="og:url" content="[^"]*"\/?>/g, `<meta property="og:url" content="${canonicalUrl}"/>`)
    .replace(/<meta name="twitter:url" content="[^"]*"\/?>/g, `<meta name="twitter:url" content="${canonicalUrl}"/>`);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function readSearchShellPath(locale: Locale, pages: Record<string, string>) {
  if (locale === "en" && pages["/en"]) return "/en";
  return "/";
}

async function readSearchShellHtml(locale: Locale, pages: Record<string, string>) {
  const contentPathname = readSearchShellPath(locale, pages);
  const fileName = pages[contentPathname] || pages["/"];

  if (!fileName) return undefined;

  return {
    contentPathname,
    html: await readLocalMirrorHtml(fileName),
  };
}

function rewriteSearchMetadata(html: string, locale: Locale, query: string) {
  const copy = searchCopy[locale];
  const pageTitle = query
    ? `${query} - ${copy.metaTitle} · 4x4models`
    : `${copy.metaTitle} · 4x4models`;

  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(pageTitle)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\/?>/i,
      `<meta name="description" content="${escapeHtml(copy.metaDescription)}"/>`
    );
}

function resultCountLabel(count: number, locale: Locale) {
  const copy = searchCopy[locale];
  const noun = count === 1 ? copy.resultsSingular : copy.resultsPlural;
  return locale === "nl" ? `${count} ${noun}` : `${count} ${noun}`;
}

function renderSuggestionLinks(locale: Locale) {
  const action = searchPublicPath(locale);

  return searchSuggestions[locale]
    .map((suggestion) => (
      `<a class="mirror-search-chip" href="${action}?q=${encodeURIComponent(suggestion)}">${escapeHtml(suggestion)}</a>`
    ))
    .join("");
}

function renderSearchResult(result: SearchResult, locale: Locale) {
  const copy = searchCopy[locale];
  const pathLabel = result.path === "/" ? "4x4models.com" : result.path;

  return [
    `<a class="mirror-search-card" href="${escapeHtml(result.path)}">`,
    '<span class="mirror-search-card__media" aria-hidden="true">',
    `<img src="${escapeHtml(result.image)}" alt="" loading="lazy"/>`,
    "</span>",
    '<span class="mirror-search-card__content">',
    '<span class="mirror-search-card__meta">',
    `<span>${escapeHtml(result.section)}</span>`,
    `<span>${escapeHtml(pathLabel)}</span>`,
    "</span>",
    `<span class="mirror-search-card__title">${escapeHtml(result.title)}</span>`,
    `<span class="mirror-search-card__description">${escapeHtml(result.description)}</span>`,
    `<span class="mirror-search-card__cta">${copy.resultAction} <span aria-hidden="true">→</span></span>`,
    "</span>",
    "</a>",
  ].join("");
}

function renderSearchContent(query: string, results: SearchResult[], locale: Locale) {
  const copy = searchCopy[locale];
  const trimmedQuery = query.trim();
  const hasQuery = Boolean(trimmedQuery);
  const action = searchPublicPath(locale);

  return [
    '<div class="mirror-search-page">',
    '<section class="mirror-search-hero" aria-labelledby="mirror-search-title">',
    '<div class="mirror-search-hero__inner">',
    `<p class="mirror-search-eyebrow">${copy.eyebrow}</p>`,
    `<h1 id="mirror-search-title">${copy.title}</h1>`,
    `<p class="mirror-search-intro">${copy.intro}</p>`,
    '<form class="mirror-search-page-form" action="' + action + '" method="get" role="search">',
    '<label class="mirror-search-page-label">',
    `<span class="mirror-search-page-icon">${searchIconSvg()}</span>`,
    `<input name="q" type="search" value="${escapeHtml(trimmedQuery)}" placeholder="${copy.placeholder}" autoComplete="off" autofocus/>`,
    "</label>",
    `<button type="submit">${copy.button}</button>`,
    "</form>",
    '<div class="mirror-search-suggestions" aria-label="' + copy.suggestions + '">',
    `<span>${copy.suggestions}</span>`,
    renderSuggestionLinks(locale),
    "</div>",
    "</div>",
    "</section>",
    '<section class="mirror-search-results" aria-live="polite">',
    hasQuery
      ? `<div class="mirror-search-results__head"><p>${escapeHtml(resultCountLabel(results.length, locale))}</p><h2>${escapeHtml(trimmedQuery)}</h2></div>`
      : `<div class="mirror-search-empty"><h2>${copy.emptyTitle}</h2><p>${copy.emptyText}</p></div>`,
    hasQuery && results.length
      ? `<div class="mirror-search-grid">${results.map((result) => renderSearchResult(result, locale)).join("")}</div>`
      : "",
    hasQuery && !results.length
      ? `<div class="mirror-search-empty"><h2>${copy.noResultsTitle}</h2><p>${copy.noResultsText}</p></div>`
      : "",
    "</section>",
    "</div>",
  ].join("");
}

async function renderSearchPage(request: Request, pathname: string, pages: Record<string, string>) {
  const requestUrl = new URL(request.url);
  const locale = searchLocaleForPathname(pathname);
  const canonicalPathname = searchPublicPath(locale);

  if (pathname !== canonicalPathname) {
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = canonicalPathname;
    return Response.redirect(redirectUrl, 308);
  }

  const query = requestUrl.searchParams.get("q")?.trim() || "";
  const shell = await readSearchShellHtml(locale, pages);
  if (!shell) return notFoundResponse();

  const results = query ? await searchLiveMirror(query, locale) : [];
  const shellWithMetadata = rewriteSearchMetadata(shell.html, locale, query);
  const html = replaceMainContent(shellWithMetadata, renderSearchContent(query, results, locale));

  return new Response(applyMirrorTransforms(html, canonicalPathname, locale), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-mirror-source": "local",
      "x-mirror-locale": locale,
      "x-mirror-content-path": "search-index",
    },
  });
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

export function resolveMirrorContentPathname(
  publicPathname: string,
  pages: Record<string, string>
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

function hasFullHtmlDocument(html: string) {
  return /<html(?:\s|>)/i.test(html) && /<\/html>/i.test(html);
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

export function selectBase44MirrorRecord(
  records: Base44WebsitePage[],
  expectedSlug: string
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

function replaceMainContent(shellHtml: string, content: string) {
  const sanitizedContent = sanitizeBase44MirrorFragment(content);

  if (/<main(?:\s|>)/i.test(content) && /<\/main>/i.test(content)) {
    return shellHtml.replace(
      /(<main\b[^>]*>)[\s\S]*?(<\/main>)/i,
      `$1${sanitizedContent}$2`
    );
  }

  return shellHtml.replace(/(<main\b[^>]*>)[\s\S]*?(<\/main>)/i, `$1${sanitizedContent}$2`);
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
    limit: "250",
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
    const record = selectBase44MirrorRecord(records, pathnameToSlug(pathname));
    const content = record?.content?.trim();

    if (!content || !isUsableBase44MirrorContent(content)) {
      return undefined;
    }

    if (hasFullHtmlDocument(content)) {
      return { html: content, source: "base44-full" };
    }

    const sanitizedContent = sanitizeBase44MirrorFragment(content);
    if (!isUsableBase44MirrorContent(sanitizedContent)) {
      return undefined;
    }

    return { html: replaceMainContent(localHtml, sanitizedContent), source: "base44-fragment" };
  } catch (error) {
    console.warn(`Base44 mirror read failed for ${pathname}`, error);
    return undefined;
  }
}

function applyMirrorTransforms(html: string, pathname: string, locale: Locale) {
  return injectMirrorOverrides(
    addPremiumBodyClass(
      rewriteHtmlLang(
        rewriteCanonicalUrls(
          injectMobileNav(
            injectHeaderSearch(
              rewriteLanguageSwitcher(
                rewriteLocalizedInternalLinks(
                  addCardImageVars(
                    rewriteBrandAssets(rewriteLocalImageUrls(html))
                  ),
                  locale
                ),
                pathname
              ),
              pathname
            ),
            pathname
          ),
          pathname
        ),
        locale
      )
    )
  );
}

function notFoundResponse() {
  return new Response("Pagina niet gevonden.", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

async function readMirrorHtml(contentPathname: string, fileName?: string) {
  if (!fileName) {
    return undefined;
  }

  return {
    contentPathname,
    html: await readLocalMirrorHtml(fileName),
  };
}

async function readResolvedMirrorHtml(
  publicPathname: string,
  pages: Record<string, string>
) {
  const resolved = resolveMirrorContentPathname(publicPathname, pages);
  const primary = await readMirrorHtml(resolved.contentPathname, pages[resolved.contentPathname]);

  if (primary) return { ...resolved, ...primary };

  const fallbackPathname = stripSupportedLocalePrefix(publicPathname);
  const fallback = await readMirrorHtml(fallbackPathname, pages[fallbackPathname]);

  if (fallback) return { ...resolved, ...fallback, contentPathname: fallbackPathname };

  return undefined;
}

export async function GET(
  request: Request,
  props: { params: Promise<{ path?: string[] }> }
) {
  const { path: routeParts } = await props.params;
  const pathname = normalizePathname(routeParts);

  if (isSearchPathname(pathname)) {
    return renderSearchPage(request, pathname, (manifest as MirrorManifest).pages);
  }

  const resolved = await readResolvedMirrorHtml(pathname, (manifest as MirrorManifest).pages);

  if (!resolved) {
    return notFoundResponse();
  }

  const base44Page = await readBase44MirrorPage(resolved.contentPathname, resolved.html);
  const html = base44Page?.html || resolved.html;
  const source: MirrorSource = base44Page?.source || "local";

  return new Response(applyMirrorTransforms(html, resolved.publicPathname, resolved.locale), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-mirror-source": source,
      "x-mirror-locale": resolved.locale,
      "x-mirror-content-path": resolved.contentPathname,
    },
  });
}
