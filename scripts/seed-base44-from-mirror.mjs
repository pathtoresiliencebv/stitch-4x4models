import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { JSDOM } from "jsdom";

const root = process.cwd();
const manifestPath = path.join(root, "src/data/live-mirror/manifest.json");
const pagesDir = path.join(root, "src/data/live-mirror/pages");
const publicImagesDir = path.join(root, "public/images");

const apiUrl =
  process.env.BASE44_API_URL ||
  process.env.NEXT_PUBLIC_BASE44_API_URL ||
  "https://stimulating-growth-suite-ai.base44.app/api";
const apiKey = process.env.BASE44_API_KEY;
let activeWebshopId = process.env.NEXT_PUBLIC_WEBSHOP_ID || "";
const write = process.argv.includes("--write");
const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || "https://www.4x4models.com";
const websitePageContentLimitBytes = 15_000;

const stats = {
  WebsitePage: 0,
  WebsitePageContentSkipped: 0,
  SiteContent: 0,
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

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.records)) return payload.records;
  return [];
}

function routeToSlug(route) {
  return route === "/" ? "home" : route.replace(/^\/+/, "");
}

function lastSegment(route) {
  return route.split("/").filter(Boolean).at(-1) || "home";
}

function canonicalUrlForRoute(route, document) {
  const routePath = route === "/" ? "/" : route;
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
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

function vehicleSlug(route) {
  const parts = route.split("/").filter(Boolean);
  return slugify(parts.slice(1).join("-") || lastSegment(route));
}

function inferLocale(route, document) {
  const htmlLang = document.documentElement.getAttribute("lang");
  if (htmlLang) return htmlLang;
  return route.startsWith("/en") ? "en" : "nl";
}

function text(document, selector) {
  return document.querySelector(selector)?.textContent?.replace(/\s+/g, " ").trim() || "";
}

function meta(document, name) {
  return (
    document.querySelector(`meta[name="${name}"]`)?.getAttribute("content") ||
    document.querySelector(`meta[property="${name}"]`)?.getAttribute("content") ||
    ""
  );
}

function pageBodyExcerpt(document) {
  const source = document.querySelector("main")?.textContent || document.body?.textContent || "";
  return source.replace(/\s+/g, " ").trim().slice(0, 5000);
}

function mirrorContentForBase44(html, document) {
  return document.querySelector("main")?.innerHTML?.trim() || html;
}

function websitePageContentPayload(content) {
  if (Buffer.byteLength(content) > websitePageContentLimitBytes) {
    stats.WebsitePageContentSkipped += 1;
    return {};
  }

  return { content };
}

function numberFromText(value) {
  const match = value.replace(/\./g, "").replace(",", ".").match(/(?:€|\bEUR\b)?\s*(\d+(?:\.\d+)?)/i);
  return match ? Number(match[1]) : undefined;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferProductMeta(route, title) {
  const value = `${route} ${title}`.toLowerCase();

  if (/hoodie|shirt|t-shirt|cap/.test(value)) {
    return { category: "Kleding & merch", product_type: "apparel", tags: ["apparel", "overlanding"] };
  }

  if (/boek|book|voucher|streaming/.test(value)) {
    return { category: "Boeken & media", product_type: "media", tags: ["books", "overlanding"] };
  }

  if (/1-18|1-24|model|schaal|bronco|wrangler|troopcarrier|defender-90/.test(value)) {
    const brandTag = value.includes("jeep") ? "jeep" : value.includes("ford") ? "ford" : value.includes("land-cruiser") ? "toyota" : value.includes("defender") ? "land-rover" : "scale-model";
    return { category: "Schaalmodellen", product_type: "scale-model", tags: ["scale-model", brandTag] };
  }

  const tags = ["recovery", "overlanding"];
  if (/light|led/.test(value)) tags.push("lighting");
  if (/warn|lier|kit|recovery/.test(value)) tags.push("recovery");

  return { category: "Gear & herstel", product_type: "gear", tags: Array.from(new Set(tags)) };
}

function toWebsitePage(route, html, document) {
  const content = mirrorContentForBase44(html, document);

  return {
    webshop_id: activeWebshopId,
    title: document.title || text(document, "h1") || routeToSlug(route),
    slug: routeToSlug(route),
    ...websitePageContentPayload(content),
    meta_description: meta(document, "description"),
    focus_keyword: text(document, "h1"),
    seo_score: undefined,
    status: "published",
  };
}

function toBlogPost(route, document, isProduct) {
  const title = text(document, "h1") || document.title || lastSegment(route);
  const image = document.querySelector('img[src^="/images/"]');
  const productMeta = isProduct ? inferProductMeta(route, title) : {};

  return {
    ...(activeWebshopId ? { webshop_id: activeWebshopId } : {}),
    title,
    slug: lastSegment(route),
    locale: inferLocale(route, document),
    excerpt: meta(document, "description") || text(document, "main p"),
    content: pageBodyExcerpt(document),
    meta_description: meta(document, "description"),
    seo_title: document.title,
    canonical_url: canonicalUrlForRoute(route, document),
    focus_keyword: title,
    featured_image_url: image?.getAttribute("src") || undefined,
    featured_image_alt: image?.getAttribute("alt") || undefined,
    is_product: isProduct,
    status: isProduct ? "active" : "published",
    ...(isProduct ? {
      price: numberFromText(document.body.textContent || ""),
      sku: `4X4-${slugify(lastSegment(route)).slice(0, 24).toUpperCase()}`,
      ...productMeta,
    } : {}),
  };
}

function toVehicle(route, document) {
  const parts = route.split("/").filter(Boolean);
  const brand = parts[1];
  const image = document.querySelector('img[src^="/images/"]');
  const title = text(document, "h1") || document.title || lastSegment(route);

  return {
    ...(activeWebshopId ? { webshop_id: activeWebshopId } : {}),
    name: title,
    brand,
    slug: vehicleSlug(route),
    hero_headline: title,
    hero_body: meta(document, "description") || text(document, "main p"),
    hero_image_url: image?.getAttribute("src") || undefined,
    hero_image_alt: image?.getAttribute("alt") || undefined,
    description: document.querySelector("main")?.textContent?.replace(/\s+/g, " ").trim().slice(0, 1200) || "",
    seo_title: document.title,
    meta_description: meta(document, "description"),
    canonical_url: canonicalUrlForRoute(route, document),
    status: "published",
  };
}

function toGlobalSiteContent(document) {
  const navLinks = Array.from(document.querySelectorAll("header a[href]"))
    .map((link, index) => ({
      label: link.textContent?.replace(/\s+/g, " ").trim() || "",
      href: link.getAttribute("href") || "",
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

async function base44Fetch(endpoint, options = {}) {
  if (!apiKey) throw new Error("BASE44_API_KEY is required for --write");

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      api_key: apiKey,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`${endpoint} failed (${response.status}) ${message}`);
  }

  if (response.status === 204) return undefined;
  return response.json();
}

async function findExisting(entity, q) {
  const params = new URLSearchParams({ q: JSON.stringify(q), limit: "1" });
  const payload = await base44Fetch(`/entities/${entity}?${params}`);
  return normalizeList(payload)[0];
}

function compactQuery(q) {
  return Object.fromEntries(
    Object.entries(q).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

async function upsertByQueries(entity, queries, payload) {
  stats[entity] += 1;
  if (!write) return;

  const normalizedQueries = queries.map(compactQuery).filter((q) => Object.keys(q).length > 0);
  for (const query of normalizedQueries) {
    const existing = await findExisting(entity, query);
    if (existing?.id) {
      await base44Fetch(`/entities/${entity}/${existing.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      return;
    }
  }

  await base44Fetch(`/entities/${entity}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function upsert(entity, q, payload) {
  return upsertByQueries(entity, [q], payload);
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
  const created = await base44Fetch("/entities/Webshop", {
    method: "POST",
    body: JSON.stringify({
      name: "4x4models",
      url: "https://4x4models.com",
      status: "actief",
      description: "Premium automotive 4x4 knowledge base and webshop.",
      logo_url: "/images/brand/logo.png",
      repo_url: "https://github.com/pathtoresiliencebv/stitch-4x4models",
      vercel_url: "https://4x4models.com",
    }),
  });

  activeWebshopId = created.id;
  return activeWebshopId;
}

async function listImageFiles(dir, prefix = "/images") {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const publicPath = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...await listImageFiles(fullPath, publicPath));
    } else if (/\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name)) {
      files.push(publicPath);
    }
  }

  return files;
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const pages = manifest.pages || {};

  if (write && !apiKey) {
    throw new Error("Refusing to write without BASE44_API_KEY");
  }

  await resolveWebshopId();

  const homeFileName = pages["/"];
  if (homeFileName) {
    const homeHtml = await readFile(path.join(pagesDir, homeFileName), "utf8");
    const homeDom = new JSDOM(homeHtml);
    for (const entry of toGlobalSiteContent(homeDom.window.document)) {
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

  for (const [route, fileName] of Object.entries(pages)) {
    const html = await readFile(path.join(pagesDir, fileName), "utf8");
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const slug = routeToSlug(route);

    await upsert("WebsitePage", { slug }, toWebsitePage(route, html, document));

    if (/^\/(?:en\/)?(?:blog|journal)\/[^/]+$/.test(route)) {
      const post = toBlogPost(route, document, false);
      await upsertByQueries("BlogPost", [
        { canonical_url: post.canonical_url },
        { slug: post.slug, is_product: false, locale: post.locale },
        { slug: lastSegment(route), is_product: false },
      ], post);
    }

    if (/^\/(?:en\/)?shop\/[^/]+$/.test(route)) {
      const product = toBlogPost(route, document, true);
      await upsertByQueries("BlogPost", [
        { canonical_url: product.canonical_url },
        { slug: product.slug, is_product: true, locale: product.locale },
        { slug: lastSegment(route), is_product: true },
      ], product);
    }

    if (/^\/merken\/[^/]+\/[^/]+$/.test(route)) {
      const vehicle = toVehicle(route, document);
      await upsertByQueries("Vehicle", [
        { canonical_url: vehicle.canonical_url },
        { slug: vehicle.slug },
        { brand: vehicle.brand, slug: lastSegment(route) },
      ], vehicle);
    }
  }

  const images = await listImageFiles(publicImagesDir);
  for (const url of images) {
    const title = path.basename(url).replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    await upsert("WebshopPhoto", { url }, {
      webshop_id: activeWebshopId,
      title,
      url,
      alt: title,
    });
  }

  console.log(JSON.stringify({
    mode: write ? "write" : "dry-run",
    apiUrl,
    pages: Object.keys(pages).length,
    ...stats,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
