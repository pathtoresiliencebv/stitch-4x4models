const root = Deno.cwd();
const write = Deno.env.get("BASE44_WRITE") === "true";
const siteOrigin = Deno.env.get("NEXT_PUBLIC_SITE_URL") || "https://www.4x4models.com";
let activeWebshopId = Deno.env.get("NEXT_PUBLIC_WEBSHOP_ID") || "";
const websitePageContentLimitBytes = 15_000;

const manifestPath = `${root}/src/data/live-mirror/manifest.json`;
const pagesDir = `${root}/src/data/live-mirror/pages`;
const publicImagesDir = `${root}/public/images`;

const stats: Record<string, number> = {
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

function entity(name: string) {
  return base44.entities[name];
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

  return {
    webshop_id: activeWebshopId,
    title: itemTitle,
    slug: routeToSlug(route),
    ...websitePageContentPayload(content),
    meta_description: meta(html, "description"),
    focus_keyword: text(html, "h1"),
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
  const records = await entity(entityName).filter(q, undefined, 1);
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
        await entity(entityName).update(existing.id, payload);
      } catch (error) {
        throw new Error(`${entityName} update failed for ${label} (${contentBytes} content bytes): ${error?.data?.message || error?.message || "unknown error"}`);
      }
      return;
    }
  }

  try {
    await entity(entityName).create(payload);
  } catch (error) {
    throw new Error(`${entityName} create failed for ${label} (${contentBytes} content bytes): ${error?.data?.message || error?.message || "unknown error"}`);
  }
}

async function upsert(entityName: string, q: Record<string, unknown>, payload: Record<string, unknown>) {
  await upsertByQueries(entityName, [q], payload);
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

await resolveWebshopId();

const homeFileName = pages["/"];
if (homeFileName) {
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

for (const [route, fileName] of Object.entries<string>(pages)) {
  const html = await Deno.readTextFile(`${pagesDir}/${fileName}`);
  const slug = routeToSlug(route);

  await upsert("WebsitePage", { slug }, toWebsitePage(route, html));

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

const images = await listImageFiles(publicImagesDir);
for (const url of images) {
  const imageTitle = url.split("/").pop()?.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") || url;
  await upsert("WebshopPhoto", { url }, {
    webshop_id: activeWebshopId,
    title: imageTitle,
    url,
    alt: imageTitle,
  });
}

console.log(JSON.stringify({
  mode: write ? "write" : "dry-run",
  pages: Object.keys(pages).length,
  ...stats,
}, null, 2));
