const root = Deno.cwd();
const manifestPath = `${root}/src/data/live-mirror/manifest.json`;

type EntityRecord = Record<string, unknown> & {
  id?: string;
};

type AuditPage = {
  route: string;
  slug: string;
  locale: "en" | "nl";
  page: EntityRecord | undefined;
  sections: EntityRecord[];
  cards: EntityRecord[];
};

const entityNames = [
  "Webshop",
  "WebsitePage",
  "WebsiteSection",
  "WebsiteCard",
  "SiteContent",
  "BlogPost",
  "Vehicle",
  "WebshopPhoto",
  "SeoTask",
  "SeoAuditIssue",
  "TranslationJob",
  "SearchConsoleSnapshot",
  "SearchConsoleQuery",
  "MerchantCenterAccount",
  "MerchantCenterProduct",
] as const;

function entity(name: string) {
  return base44.entities[name];
}

async function listAll(name: string): Promise<EntityRecord[]> {
  return await entity(name).list(undefined, 5000) as EntityRecord[];
}

function routeToSlug(route: string) {
  return route === "/" ? "home" : route.replace(/^\/+/, "").replace(/\/$/, "");
}

function routeLocale(route: string): "en" | "nl" {
  return route === "/en" || route.startsWith("/en/") ? "en" : "nl";
}

function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasUsableImage(value: unknown) {
  if (!isNonEmptyString(value)) return false;
  const url = String(value).trim();
  return url.startsWith("/images/") || /^https:\/\/media\.base44\.com\//i.test(url);
}

function published(record: EntityRecord) {
  return !record.status || record.status === "published" || record.status === "active";
}

function pageMatches(page: EntityRecord, slug: string) {
  return page.slug === slug && published(page);
}

function structuredMatches(record: EntityRecord, slug: string, locale: string) {
  return record.page_slug === slug && record.locale === locale && published(record);
}

function issue(route: AuditPage) {
  const missing: string[] = [];
  const page = route.page;

  if (!page) return ["WebsitePage"];
  if (!isNonEmptyString(page.title)) missing.push("title");
  if (!isNonEmptyString(page.content)) missing.push("content");
  if (!isNonEmptyString(page.seo_title)) missing.push("seo_title");
  if (!isNonEmptyString(page.meta_description)) missing.push("meta_description");
  if (!isNonEmptyString(page.canonical_url)) missing.push("canonical_url");
  if (!isNonEmptyString(page.focus_keyword)) missing.push("focus_keyword");
  if (typeof page.seo_score !== "number") missing.push("seo_score");
  if (!isNonEmptyString(page.translation_status)) missing.push("translation_status");
  if (route.sections.length === 0) missing.push("sections");
  if (route.cards.length === 0 && route.sections.some((section) => (
    ["card_grid", "brand_grid", "article_grid", "product_grid", "forum_grid"]
      .includes(String(section.section_type || ""))
  ))) {
    missing.push("cards");
  }
  if (
    route.sections.length > 0 &&
    !route.sections.some((section) => hasUsableImage(section.image_url)) &&
    !route.cards.some((card) => hasUsableImage(card.image_url))
  ) {
    missing.push("media");
  }

  return missing;
}

const manifest = JSON.parse(await Deno.readTextFile(manifestPath)) as {
  pages?: Record<string, string>;
};
const routes = Object.keys(manifest.pages || {});

const records = Object.fromEntries(
  await Promise.all(
    entityNames.map(async (name) => [name, await listAll(name)] as const)
  )
) as Record<(typeof entityNames)[number], EntityRecord[]>;

const audits = routes.map((route): AuditPage => {
  const slug = routeToSlug(route);
  const locale = routeLocale(route);
  return {
    route,
    slug,
    locale,
    page: records.WebsitePage.find((page) => pageMatches(page, slug)),
    sections: records.WebsiteSection.filter((section) => structuredMatches(section, slug, locale)),
    cards: records.WebsiteCard.filter((card) => structuredMatches(card, slug, locale)),
  };
});

const problemRoutes = audits
  .map((audit) => ({ route: audit.route, missing: issue(audit) }))
  .filter((audit) => audit.missing.length > 0);

const sampleRouteNames = new Set([
  "/",
  "/merken",
  "/amerikaans",
  "/merken/hummer/h2",
  "/blog",
  "/journal",
  "/shop",
]);
const samples = audits
  .filter((audit) => sampleRouteNames.has(audit.route))
  .map((audit) => ({
    route: audit.route,
    page: audit.page && {
      id: audit.page.id,
      title: audit.page.title,
      slug: audit.page.slug,
      locale: audit.page.locale,
      seo_title: audit.page.seo_title,
      meta_description: audit.page.meta_description,
      content_length: String(audit.page.content || "").length,
    },
    sections: audit.sections.slice(0, 6).map((section) => ({
      id: section.id,
      key: section.section_key,
      type: section.section_type,
      eyebrow: section.eyebrow,
      title: section.title,
      body: section.body,
      image_url: section.image_url,
      cta_label: section.cta_label,
      cta_url: section.cta_url,
      sort_order: section.sort_order,
    })),
    cards: audit.cards.slice(0, 8).map((card) => ({
      id: card.id,
      section_key: card.section_key,
      type: card.card_type,
      title: card.title,
      body: card.body,
      badge: card.badge,
      image_url: card.image_url,
      href: card.href,
      sort_order: card.sort_order,
    })),
  }));

const duplicatePageSlugs = Object.entries(
  records.WebsitePage.reduce<Record<string, number>>((counts, page) => {
    const slug = String(page.slug || "");
    if (slug) counts[slug] = (counts[slug] || 0) + 1;
    return counts;
  }, {})
)
  .filter(([, count]) => count > 1)
  .map(([slug, count]) => ({ slug, count }));

const summary = {
  manifestRoutes: routes.length,
  entityCounts: Object.fromEntries(
    entityNames.map((name) => [name, records[name].length])
  ),
  coverage: {
    websitePages: audits.filter((audit) => audit.page).length,
    structuredPages: audits.filter((audit) => audit.sections.length > 0).length,
    pagesWithCards: audits.filter((audit) => audit.cards.length > 0).length,
    pagesWithStructuredMedia: audits.filter((audit) => (
      audit.sections.some((section) => hasUsableImage(section.image_url)) ||
      audit.cards.some((card) => hasUsableImage(card.image_url))
    )).length,
    seoCompletePages: audits.filter((audit) => (
      audit.page &&
      isNonEmptyString(audit.page.seo_title) &&
      isNonEmptyString(audit.page.meta_description) &&
      isNonEmptyString(audit.page.canonical_url) &&
      typeof audit.page.seo_score === "number"
    )).length,
  },
  duplicatePageSlugs,
  problemRouteCount: problemRoutes.length,
  problemRoutes: problemRoutes.slice(0, 100),
  samples,
};

console.log(JSON.stringify(summary, null, 2));
