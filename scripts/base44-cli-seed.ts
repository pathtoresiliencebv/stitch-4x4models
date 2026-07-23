const root = Deno.cwd();
const write = Deno.env.get("BASE44_WRITE") === "true";
const siteOrigin = Deno.env.get("NEXT_PUBLIC_SITE_URL") || "https://www.4x4models.com";
const routePrefix = Deno.env.get("CRM_SEED_ROUTE_PREFIX") || "";
const useStructuredCache = Deno.env.get("CRM_SEED_USE_CACHE") !== "false";
let activeWebshopId = Deno.env.get("NEXT_PUBLIC_WEBSHOP_ID") || "";
const websitePageContentLimitBytes = 15_000;
let localImagePaths = new Set<string>();

const manifestPath = `${root}/src/data/live-mirror/manifest.json`;
const pagesDir = `${root}/src/data/live-mirror/pages`;
const publicImagesDir = `${root}/public/images`;

const stats: Record<string, number> = {
  WebsitePage: 0,
  WebsitePageContentSkipped: 0,
  SiteContent: 0,
  WebsiteSection: 0,
  WebsiteCard: 0,
  WebsiteCardSkipped: 0,
  BlogPost: 0,
  Vehicle: 0,
  WebshopPhoto: 0,
  Webshop: 0,
  ProductCategory: 0,
  ProductTag: 0,
};

const productCategories = [
  {
    name: "Gear & herstel",
    slug: "gear-herstel",
    description: "Functionele off-road gear, recovery tools, verlichting en koelboxen.",
    sort_order: 10,
  },
  {
    name: "Schaalmodellen",
    slug: "schaalmodellen",
    description: "Verzamelmodellen van iconische 4x4's.",
    sort_order: 20,
  },
  {
    name: "Kleding & merch",
    slug: "kleding-merch",
    description: "4x4models apparel en trail-tested accessoires.",
    sort_order: 30,
  },
  {
    name: "Boeken & media",
    slug: "boeken-media",
    description: "Boeken, verhalen en media voor 4x4 liefhebbers.",
    sort_order: 40,
  },
];

const productTags = [
  "recovery",
  "lighting",
  "scale-model",
  "apparel",
  "books",
  "overlanding",
  "land-rover",
  "toyota",
  "jeep",
  "ford",
];

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

async function withRateLimitRetry<T>(operation: () => Promise<T>, label: string): Promise<T> {
  const delays = [2500, 6000, 12000, 24000, 45000];

  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    await sleep(attempt === 0 ? 250 : delays[attempt - 1]);

    try {
      return await operation();
    } catch (error) {
      if (!isRateLimitError(error) || attempt === delays.length) {
        throw error;
      }

      console.warn(`${label} hit rate limit; retrying in ${delays[attempt]}ms`);
    }
  }

  throw new Error(`${label} failed after rate limit retries`);
}

function routeToSlug(route: string) {
  return route === "/" ? "home" : route.replace(/^\/+/, "");
}

function lastSegment(route: string) {
  return route.split("/").filter(Boolean).at(-1) || "home";
}

function stripTags(value = "") {
  return value
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&eacute;/g, "é")
    .replace(/\s+/g, " ")
    .trim();
}

function compactText(value = "") {
  return stripTags(value).replace(/\s+/g, " ").trim();
}

function text(html: string, tagName: string) {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  return stripTags(html.match(pattern)?.[1] || "");
}

function title(html: string) {
  return text(html, "title");
}

function meta(html: string, name: string) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (!new RegExp(`(?:name|property)=["']${name}["']`, "i").test(tag)) continue;
    const content = tag.match(/\bcontent=["']([^"']*)["']/i)?.[1];
    if (content) return stripTags(content);
  }

  return "";
}

function inferLocale(route: string, html: string) {
  const htmlLang = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1];
  if (htmlLang) return htmlLang;
  return route.startsWith("/en") ? "en" : "nl";
}

function firstImage(html: string) {
  const img = html.match(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i);
  if (!img) return undefined;
  return img[1].startsWith("/images/") ? img[1] : undefined;
}

function firstImageAlt(html: string) {
  return html.match(/<img\b[^>]*\balt=["']([^"']*)["'][^>]*>/i)?.[1];
}

function pageBodyExcerpt(html: string) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
  return stripTags(main).slice(0, 5000);
}

function mirrorContentForBase44(html: string) {
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]?.trim() || html;
}

function websitePageContentPayload(content: string) {
  if (new TextEncoder().encode(content).length > websitePageContentLimitBytes) {
    stats.WebsitePageContentSkipped += 1;
    return {};
  }

  return { content };
}

function firstText(html: string, selectors: string[]) {
  for (const selector of selectors) {
    let value = "";
    if (selector.startsWith("h")) {
      value = text(html, selector);
    } else if (selector === "p") {
      value = stripTags(html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "");
    } else if (selector === "small") {
      value = text(html, "small");
    } else if (selector.includes("title")) {
      value = stripTags(html.match(/<[^>]*class=["'][^"']*title[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i)?.[1] || "");
    } else if (selector.includes("meta") || selector.includes("subtitle") || selector.includes("badge") || selector.includes("eyebrow") || selector.includes("price") || selector.includes("date") || selector.includes("count")) {
      const token = selector.match(/\*='([^']+)'/)?.[1] || selector.replace(/[^a-z]/g, "");
      value = stripTags(html.match(new RegExp(`<[^>]*class=["'][^"']*${token}[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`, "i"))?.[1] || "");
    }

    if (value) return value;
  }

  return "";
}

function firstHref(html: string) {
  return html.match(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] || "";
}

function imageFromHtml(html: string) {
  const match = html.match(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i);
  const src = match?.[1] || "";
  if (!src) return { image_url: undefined, image_alt: undefined };

  try {
    const url = new URL(src, siteOrigin);
    if (url.pathname.startsWith("/images/")) {
      return {
        image_url: url.pathname,
        image_alt: match?.[0].match(/\balt=["']([^"']*)["']/i)?.[1] || undefined,
      };
    }
  } catch {
    if (src.startsWith("/images/")) {
      return {
        image_url: src,
        image_alt: match?.[0].match(/\balt=["']([^"']*)["']/i)?.[1] || undefined,
      };
    }
  }

  return { image_url: undefined, image_alt: undefined };
}

function sectionTypeFor(route: string, sectionTitle: string, sectionHtml: string) {
  const value = `${route} ${sectionTitle} ${sectionHtml.slice(0, 400)}`.toLowerCase();
  if (/hero|intro|kenniscentrum/.test(value)) return "hero";
  if (/shop|product|prijs|sku/.test(value)) return "product_grid";
  if (/blog|journal|artikel|story|verhaal/.test(value)) return "article_grid";
  if (/forum|discussie|reacties/.test(value)) return "forum_grid";
  if (/merk|model|vehicle|platform/.test(value)) return "brand_grid";
  if (/collectie|collection/.test(value)) return "card_grid";
  if (/cta|zoek|contact/.test(value)) return "cta";
  return "card_grid";
}

function cardTypeFor(href: string) {
  if (/\/merken\//.test(href)) return "model";
  if (/\/blog\//.test(href)) return "article";
  if (/\/journal\//.test(href)) return "journal";
  if (/\/collecties\//.test(href)) return "collection";
  if (/\/shop\//.test(href)) return "product";
  if (/\/forum\//.test(href)) return "forum";
  return "link";
}

function normalizeInternalHref(href: string) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return "";
  if (href.startsWith("/")) return href;

  if (/^https?:\/\//i.test(href)) {
    try {
      const url = new URL(href);
      const allowedHosts = new Set(["4x4models.com", "www.4x4models.com"]);
      if (!allowedHosts.has(url.hostname)) return "";
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return "";
    }
  }

  return href;
}

function firstExistingImage(candidates: string[]) {
  return candidates.find((candidate) => localImagePaths.has(candidate)) || "/images/hero/homepage.jpg";
}

function fallbackImageForHref(href: string) {
  const normalized = normalizeInternalHref(href);
  const pathname = normalized.split("?")[0].replace(/\/$/, "") || "/";
  const parts = pathname.split("/").filter(Boolean);
  const slug = parts.at(-1) || "homepage";
  const brand = parts[0] === "merken" ? parts[1] : "";

  if (pathname === "/" || pathname === "/en") return "/images/hero/homepage.jpg";

  return firstExistingImage([
    `/images/blog/${slug}.jpg`,
    `/images/journal/${slug}.jpg`,
    `/images/collections/${slug}.jpg`,
    `/images/shop/${slug}.jpg`,
    `/images/explainers/${slug}.jpg`,
    brand ? `/images/brands/${brand === "ineos-fusilier" ? "ineos" : brand}.jpg` : "",
    /hummer/.test(pathname) ? "/images/brands/hummer.jpg" : "",
    /bronco|ford|raptor|sema|truck|pre-runner/.test(pathname) ? "/images/brands/ford.jpg" : "",
    /jeep|wrangler|rock|badge/.test(pathname) ? "/images/brands/jeep.jpg" : "",
    /toyota|land-cruiser|hilux|4runner|lc70/.test(pathname) ? "/images/brands/toyota.jpg" : "",
    /defender|land-rover|camel/.test(pathname) ? "/images/brands/land-rover.jpg" : "",
    /overland|expedition|trail|morocco/.test(pathname) ? "/images/collections/beste-4x4-voor-overlanding.jpg" : "",
    /snow|ijs|winter|ardennen/.test(pathname) ? "/images/collections/beste-4x4-sneeuw-ijs.jpg" : "",
    /woestijn|desert|sand|dune|texas|mint/.test(pathname) ? "/images/collections/beste-4x4-woestijn.jpg" : "",
    /differentieel|locker|awd|4wd|techniek/.test(pathname) ? "/images/blog/differentieelslot-open-limited-slip-locking.jpg" : "",
    "/images/hero/homepage.jpg",
  ].filter(Boolean));
}

function imageWithFallback(
  image: { image_url?: string; image_alt?: string },
  href: string,
  title: string
) {
  return {
    image_url: image.image_url || fallbackImageForHref(href),
    image_alt: image.image_alt || title || undefined,
  };
}

function sectionHtmlBlocks(html: string) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
  const sections = Array.from(main.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/gi));
  if (!sections.length) return [{ attrs: "", html: main }];
  return sections.slice(0, 24).map((match) => ({ attrs: match[1] || "", html: match[2] || "" }));
}

function toStructuredContent(route: string, html: string) {
  const pageSlug = routeToSlug(route);
  const locale = inferLocale(route, html);
  const sections: Record<string, unknown>[] = [];
  const cards: Record<string, unknown>[] = [];
  const seenCards = new Set<string>();

  sectionHtmlBlocks(html).forEach((section, sectionIndex) => {
    const sectionTitle = firstText(section.html, ["h1", "h2", "h3"]) || (sectionIndex === 0 ? text(html, "h1") : "");
    const sectionKey = slugify(
      section.attrs.match(/\bid=["']([^"']+)["']/i)?.[1] ||
      sectionTitle ||
      `section-${sectionIndex + 1}`
    );
    const sectionImage = imageFromHtml(section.html);
    const ctaHref = normalizeInternalHref(firstHref(section.html));

    sections.push({
      ...(activeWebshopId ? { webshop_id: activeWebshopId } : {}),
      page_slug: pageSlug,
      locale,
      section_key: sectionKey,
      section_type: sectionTypeFor(route, sectionTitle, section.html),
      eyebrow: firstText(section.html, ["[class*='eyebrow']", "[class*='badge']", "small"]),
      title: sectionTitle,
      body: firstText(section.html, ["p"]),
      ...imageWithFallback(sectionImage, ctaHref || route, sectionTitle),
      cta_label: stripTags(section.html.match(/<a\b[^>]*href=["'][^"']+["'][^>]*>([\s\S]*?)<\/a>/i)?.[1] || ""),
      cta_url: ctaHref || undefined,
      layout: section.attrs.match(/\bclass=["']([^"']+)["']/i)?.[1] || undefined,
      status: "published",
      sort_order: (sectionIndex + 1) * 10,
    });

    Array.from(section.html.matchAll(/<a\b([^>]*)href=["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi))
      .slice(0, 30)
      .forEach((match, cardIndex) => {
        const href = normalizeInternalHref(match[2] || "");
        if (!href) return;

        const linkHtml = match[4] || "";
        const cardTitle = firstText(linkHtml, ["h2", "h3", "h4", "[class*='title']"]) || compactText(linkHtml);
        if (!cardTitle || cardTitle.length < 2) return;

        const dedupeKey = `${sectionKey}:${href}:${cardTitle}`;
        if (seenCards.has(dedupeKey)) return;
        seenCards.add(dedupeKey);

        cards.push({
          ...(activeWebshopId ? { webshop_id: activeWebshopId } : {}),
          page_slug: pageSlug,
          section_key: sectionKey,
          locale,
          card_type: cardTypeFor(href),
          title: cardTitle.slice(0, 180),
          subtitle: firstText(linkHtml, ["[class*='meta']", "[class*='subtitle']", "small"]),
          body: firstText(linkHtml, ["p"]).slice(0, 500),
          badge: firstText(linkHtml, ["[class*='badge']", "[class*='eyebrow']"]),
          meta: firstText(linkHtml, ["[class*='price']", "[class*='date']", "[class*='count']"]),
          ...imageWithFallback(imageFromHtml(linkHtml), href, cardTitle),
          href,
          cta_label: "Bekijk",
          status: "published",
          sort_order: (cardIndex + 1) * 10,
        });
      });
  });

  return { sections, cards };
}

function numberFromText(value: string) {
  const match = value.replace(/\./g, "").replace(",", ".").match(/(?:€|\bEUR\b)?\s*(\d+(?:\.\d+)?)/i);
  return match ? Number(match[1]) : undefined;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function canonicalUrlForRoute(route: string, html: string) {
  const routePath = route === "/" ? "/" : route;
  const canonical = html.match(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1];
  try {
    if (canonical) {
      const url = new URL(canonical, siteOrigin);
      const canonicalPath = url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "");
      if (canonicalPath === routePath) {
        return `${siteOrigin}${canonicalPath}`;
      }
    }
  } catch {
    // Fall through to route-based canonical below.
  }

  return `${siteOrigin}${routePath}`;
}

function vehicleSlug(route: string) {
  const parts = route.split("/").filter(Boolean);
  return slugify(parts.slice(1).join("-") || lastSegment(route));
}

function inferProductMeta(route: string, itemTitle: string) {
  const value = `${route} ${itemTitle}`.toLowerCase();

  if (/hoodie|shirt|t-shirt|cap/.test(value)) {
    return { category: "Kleding & merch", product_type: "apparel", tags: ["apparel", "overlanding"] };
  }

  if (/boek|book|voucher|streaming/.test(value)) {
    return { category: "Boeken & media", product_type: "media", tags: ["books", "overlanding"] };
  }

  if (/1-18|1-24|model|schaal|bronco|wrangler|troopcarrier|defender-90/.test(value)) {
    const brandTag = value.includes("jeep")
      ? "jeep"
      : value.includes("ford")
        ? "ford"
        : value.includes("land-cruiser")
          ? "toyota"
          : value.includes("defender")
            ? "land-rover"
            : "scale-model";
    return { category: "Schaalmodellen", product_type: "scale-model", tags: ["scale-model", brandTag] };
  }

  const tags = ["recovery", "overlanding"];
  if (/light|led/.test(value)) tags.push("lighting");
  if (/warn|lier|kit|recovery/.test(value)) tags.push("recovery");
  return { category: "Gear & herstel", product_type: "gear", tags: Array.from(new Set(tags)) };
}

function toWebsitePage(route: string, html: string) {
  const itemTitle = title(html) || text(html, "h1") || routeToSlug(route);
  const content = mirrorContentForBase44(html);
  const locale = inferLocale(route, html);
  const canonicalUrl = canonicalUrlForRoute(route, html);

  return {
    webshop_id: activeWebshopId,
    title: itemTitle,
    slug: routeToSlug(route),
    ...websitePageContentPayload(content),
    meta_description: meta(html, "description"),
    seo_title: itemTitle.slice(0, 70),
    google_preview_title: itemTitle.slice(0, 70),
    google_preview_url: canonicalUrl,
    google_preview_description: meta(html, "description"),
    canonical_url: canonicalUrl,
    focus_keyword: text(html, "h1"),
    locale,
    source_locale: locale,
    translation_status: locale === "nl" ? "source" : "published",
    status: "published",
  };
}

function toBlogPost(route: string, html: string, isProduct: boolean) {
  const itemTitle = text(html, "h1") || title(html) || lastSegment(route);
  const productMeta = isProduct ? inferProductMeta(route, itemTitle) : {};

  return {
    ...(activeWebshopId ? { webshop_id: activeWebshopId } : {}),
    title: itemTitle,
    slug: lastSegment(route),
    locale: inferLocale(route, html),
    excerpt: meta(html, "description") || stripTags(html.match(/<main\b[^>]*>\s*<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] || ""),
    content: pageBodyExcerpt(html),
    meta_description: meta(html, "description"),
    seo_title: title(html),
    canonical_url: canonicalUrlForRoute(route, html),
    focus_keyword: itemTitle,
    featured_image_url: firstImage(html),
    featured_image_alt: firstImageAlt(html),
    is_product: isProduct,
    status: isProduct ? "active" : "published",
    ...(isProduct
      ? {
        price: numberFromText(stripTags(html)),
        sku: `4X4-${slugify(lastSegment(route)).slice(0, 24).toUpperCase()}`,
        ...productMeta,
      }
      : {}),
  };
}

function toVehicle(route: string, html: string) {
  const parts = route.split("/").filter(Boolean);
  const brand = parts[1];
  const itemTitle = text(html, "h1") || title(html) || lastSegment(route);

  return {
    ...(activeWebshopId ? { webshop_id: activeWebshopId } : {}),
    name: itemTitle,
    brand,
    slug: vehicleSlug(route),
    hero_headline: itemTitle,
    hero_body: meta(html, "description") || stripTags(html.match(/<main\b[^>]*>\s*<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] || ""),
    hero_image_url: firstImage(html),
    hero_image_alt: firstImageAlt(html),
    description: pageBodyExcerpt(html).slice(0, 1200),
    seo_title: title(html),
    meta_description: meta(html, "description"),
    canonical_url: canonicalUrlForRoute(route, html),
    status: "published",
  };
}

function toGlobalSiteContent(homeHtml: string) {
  const headerHtml = homeHtml.match(/<header\b[^>]*>([\s\S]*?)<\/header>/i)?.[1] || "";
  const navLinks = Array.from(headerHtml.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi))
    .map((match, index) => ({
      label: stripTags(match[2]),
      href: match[1],
      sort_order: index + 1,
    }))
    .filter((link) => link.label && link.href && !link.href.startsWith("#"));

  return [
    {
      page: "global",
      section: "brand",
      key: "logo_url",
      value: "/images/brand/logo.png",
      image_url: "/images/brand/logo.png",
      locale: "nl",
      sort_order: 10,
      notes: "Footer en header logo voor de Vercel mirror.",
    },
    {
      page: "global",
      section: "navigation",
      key: "main_links",
      value_long: JSON.stringify(navLinks, null, 2),
      locale: "nl",
      sort_order: 20,
      notes: "Hoofdnavigatie zoals gesynct uit de Vercel mirror.",
    },
    {
      page: "global",
      section: "footer",
      key: "powered_by",
      value: "jasonmohabali.com",
      link_url: "https://jasonmohabali.com",
      locale: "nl",
      sort_order: 30,
      notes: "Subtiele footer-credit.",
    },
    {
      page: "home",
      section: "hero",
      key: "image_url",
      value: "/images/hero/homepage.jpg",
      image_url: "/images/hero/homepage.jpg",
      locale: "nl",
      sort_order: 40,
      notes: "Primaire hero-afbeelding voor consistente paginahero's.",
    },
  ];
}

function compactQuery(q: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(q).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

async function findExisting(entityName: string, q: Record<string, unknown>) {
  const records = await withRateLimitRetry(
    () => entity(entityName).filter(q, undefined, 1),
    `${entityName} lookup`
  );
  return records[0];
}

async function upsertByQueries(entityName: string, queries: Record<string, unknown>[], payload: Record<string, unknown>) {
  stats[entityName] += 1;
  if (!write) return;

  const label = String(payload.slug || payload.key || payload.name || payload.title || "unknown");
  const contentBytes = typeof payload.content === "string"
    ? new TextEncoder().encode(payload.content).length
    : 0;
  const normalizedQueries = queries.map(compactQuery).filter((q) => Object.keys(q).length > 0);
  for (const query of normalizedQueries) {
    const existing = await findExisting(entityName, query);
    if (existing?.id) {
      try {
        await withRateLimitRetry(
          () => entity(entityName).update(existing.id, payload),
          `${entityName} update`
        );
      } catch (error) {
        throw new Error(`${entityName} update failed for ${label} (${contentBytes} content bytes): ${error?.data?.message || error?.message || "unknown error"}`);
      }
      return;
    }
  }

  try {
    await withRateLimitRetry(
      () => entity(entityName).create(payload),
      `${entityName} create`
    );
  } catch (error) {
    throw new Error(`${entityName} create failed for ${label} (${contentBytes} content bytes): ${error?.data?.message || error?.message || "unknown error"}`);
  }
}

async function upsert(entityName: string, q: Record<string, unknown>, payload: Record<string, unknown>) {
  await upsertByQueries(entityName, [q], payload);
}

function structuredKey(record: Record<string, unknown>, includeHref = false) {
  return [
    record.page_slug,
    record.section_key,
    record.title,
    includeHref ? record.href : "",
    record.locale,
  ].join("|");
}

function sectionKey(record: Record<string, unknown>) {
  return [
    record.page_slug,
    record.section_key,
    record.locale,
  ].join("|");
}

async function listExistingForCache(entityName: string) {
  if (!write) return new Map<string, Record<string, unknown>>();

  const records = await withRateLimitRetry(
    () => entity(entityName).list(undefined, 5000),
    `${entityName} cache`
  );
  const cache = new Map<string, Record<string, unknown>>();

  for (const record of records as Record<string, unknown>[]) {
    if (entityName === "WebsiteSection") {
      cache.set(sectionKey(record), record);
    } else {
      cache.set(structuredKey(record, true), record);
      cache.set(structuredKey(record, false), record);
    }
  }

  return cache;
}

async function upsertCached(
  entityName: string,
  cache: Map<string, Record<string, unknown>>,
  key: string,
  payload: Record<string, unknown>
) {
  stats[entityName] += 1;
  if (!write) return;

  const existing = cache.get(key);
  if (existing?.id) {
    try {
      await withRateLimitRetry(
        () => entity(entityName).update(existing.id, payload),
        `${entityName} update`
      );
      cache.set(key, { ...existing, ...payload });
    } catch (error) {
      if (entityName === "WebsiteCard") {
        stats.WebsiteCardSkipped += 1;
        console.warn(`Skipped WebsiteCard update: ${String(payload.title || "untitled")}`);
        return;
      }
      throw new Error(`${entityName} update failed: ${error?.data?.message || error?.message || "unknown error"}`);
    }
    return;
  }

  try {
    const created = await withRateLimitRetry(
      () => entity(entityName).create(payload),
      `${entityName} create`
    );
    cache.set(key, created);
  } catch (error) {
    if (entityName === "WebsiteCard") {
      stats.WebsiteCardSkipped += 1;
      console.warn(`Skipped WebsiteCard create: ${String(payload.title || "untitled")}`);
      return;
    }
    throw new Error(`${entityName} create failed: ${error?.data?.message || error?.message || "unknown error"}`);
  }
}

async function resolveWebshopId() {
  if (activeWebshopId) return activeWebshopId;
  if (!write) {
    activeWebshopId = "dry-run-webshop-id";
    return activeWebshopId;
  }

  const existing = await findExisting("Webshop", { name: "4x4models" });
  if (existing?.id) {
    activeWebshopId = existing.id;
    return activeWebshopId;
  }

  stats.Webshop += 1;
  const created = await entity("Webshop").create({
    name: "4x4models",
    url: "https://4x4models.com",
    status: "actief",
    description: "Premium automotive 4x4 knowledge base and webshop.",
    logo_url: "/images/brand/logo.png",
    repo_url: "https://github.com/pathtoresiliencebv/stitch-4x4models",
    vercel_url: "https://4x4models.com",
  });

  activeWebshopId = created.id;
  return activeWebshopId;
}

async function listImageFiles(dir: string, prefix = "/images"): Promise<string[]> {
  const files: string[] = [];

  try {
    for await (const entry of Deno.readDir(dir)) {
      const fullPath = `${dir}/${entry.name}`;
      const publicPath = `${prefix}/${entry.name}`;
      if (entry.isDirectory) {
        files.push(...await listImageFiles(fullPath, publicPath));
      } else if (/\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name)) {
        files.push(publicPath);
      }
    }
  } catch {
    return files;
  }

  return files;
}

const manifest = JSON.parse(await Deno.readTextFile(manifestPath));
const pages = manifest.pages || {};
const seedGlobals = !routePrefix || routePrefix === "/";
const images = await listImageFiles(publicImagesDir);
localImagePaths = new Set(images);

await resolveWebshopId();

const websiteSectionCache = useStructuredCache
  ? await listExistingForCache("WebsiteSection")
  : new Map<string, Record<string, unknown>>();
const websiteCardCache = useStructuredCache
  ? await listExistingForCache("WebsiteCard")
  : new Map<string, Record<string, unknown>>();

const homeFileName = pages["/"];
if (seedGlobals && homeFileName) {
  const homeHtml = await Deno.readTextFile(`${pagesDir}/${homeFileName}`);
  for (const entry of toGlobalSiteContent(homeHtml)) {
    await upsert("SiteContent", {
      page: entry.page,
      key: entry.key,
      locale: entry.locale,
    }, {
      ...(activeWebshopId ? { webshop_id: activeWebshopId } : {}),
      ...entry,
    });
  }
}

if (seedGlobals) {
  for (const category of productCategories) {
    await upsert("ProductCategory", { slug: category.slug }, {
      ...(activeWebshopId ? { webshop_id: activeWebshopId } : {}),
      ...category,
      status: "published",
      featured_image_url: "/images/hero/homepage.jpg",
    });
  }

  for (const tag of productTags) {
    await upsert("ProductTag", { slug: slugify(tag) }, {
      ...(activeWebshopId ? { webshop_id: activeWebshopId } : {}),
      name: tag,
      slug: slugify(tag),
      status: "active",
    });
  }
}

const pageEntries = Object.entries<string>(pages).filter(([route]) => {
  if (!routePrefix) return true;
  return route === routePrefix || route.startsWith(`${routePrefix}/`);
});

for (const [route, fileName] of pageEntries) {
  const html = await Deno.readTextFile(`${pagesDir}/${fileName}`);
  const slug = routeToSlug(route);

  await upsert("WebsitePage", { slug }, toWebsitePage(route, html));

  const structured = toStructuredContent(route, html);
  for (const section of structured.sections) {
    if (useStructuredCache) {
      await upsertCached(
        "WebsiteSection",
        websiteSectionCache,
        sectionKey(section),
        section
      );
    } else {
      await upsert("WebsiteSection", {
        page_slug: section.page_slug,
        section_key: section.section_key,
        locale: section.locale,
      }, section);
    }
  }

  for (const card of structured.cards) {
    if (useStructuredCache) {
      await upsertCached(
        "WebsiteCard",
        websiteCardCache,
        structuredKey(card, Boolean(card.href)),
        card
      );
    } else {
      await upsertByQueries("WebsiteCard", [
        {
          page_slug: card.page_slug,
          section_key: card.section_key,
          title: card.title,
          href: card.href,
          locale: card.locale,
        },
        {
          page_slug: card.page_slug,
          section_key: card.section_key,
          title: card.title,
          locale: card.locale,
        },
      ], card);
    }
  }

  if (/^\/(?:en\/)?(?:blog|journal)\/[^/]+$/.test(route)) {
    const post = toBlogPost(route, html, false);
    await upsertByQueries("BlogPost", [
      { canonical_url: post.canonical_url },
      { slug: post.slug, is_product: false, locale: post.locale },
      { slug: lastSegment(route), is_product: false },
    ], post);
  }

  if (/^\/(?:en\/)?shop\/[^/]+$/.test(route)) {
    const product = toBlogPost(route, html, true);
    await upsertByQueries("BlogPost", [
      { canonical_url: product.canonical_url },
      { slug: product.slug, is_product: true, locale: product.locale },
      { slug: lastSegment(route), is_product: true },
    ], product);
  }

  if (/^\/merken\/[^/]+\/[^/]+$/.test(route)) {
    const vehicle = toVehicle(route, html);
    await upsertByQueries("Vehicle", [
      { canonical_url: vehicle.canonical_url },
      { slug: vehicle.slug },
      { brand: vehicle.brand, slug: lastSegment(route) },
    ], vehicle);
  }
}

if (seedGlobals) {
  for (const url of images) {
    const imageTitle = url.split("/").pop()?.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") || url;
    await upsert("WebshopPhoto", { url }, {
      webshop_id: activeWebshopId,
      title: imageTitle,
      url,
      alt: imageTitle,
    });
  }
}

console.log(JSON.stringify({
  mode: write ? "write" : "dry-run",
  pages: Object.keys(pages).length,
  ...stats,
}, null, 2));
