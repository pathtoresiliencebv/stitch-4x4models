const root = Deno.cwd();
const write = Deno.env.get("BASE44_WRITE") === "true";
const updateLimit = Number(Deno.env.get("CRM_MEDIA_UPDATE_LIMIT") || "0");
const publicImagesDir = `${root}/public/images`;

type EntityRecord = Record<string, unknown> & { id?: string };

const stats: Record<string, number> = {
  WebsiteSectionScanned: 0,
  WebsiteSectionUpdated: 0,
  WebsiteCardScanned: 0,
  WebsiteCardUpdated: 0,
  BlogPostScanned: 0,
  BlogPostUpdated: 0,
  VehicleScanned: 0,
  VehicleUpdated: 0,
};

let localImagePaths = new Set<string>();
let updatesThisRun = 0;

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
  const delays = [2500, 6000, 12000, 24000, 45000];

  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    if (attempt === 0) await sleep(175);

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

function slugify(value?: unknown) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeInternalHref(href?: unknown) {
  const value = String(href || "").trim();
  if (!value || value.startsWith("#") || value.startsWith("mailto:") || value.startsWith("tel:")) return "";
  if (value.startsWith("/")) return value;

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      const allowedHosts = new Set(["4x4models.com", "www.4x4models.com"]);
      if (!allowedHosts.has(url.hostname)) return "";
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return "";
    }
  }

  return value;
}

function firstExistingImage(candidates: string[]) {
  return candidates.find((candidate) => localImagePaths.has(candidate)) || "/images/hero/homepage.jpg";
}

function fallbackImageForHref(href?: unknown) {
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

function routeForRecord(record: EntityRecord) {
  const href = normalizeInternalHref(record.href);
  if (href) return href;

  const pageSlug = String(record.page_slug || record.slug || "").replace(/^\/+/, "");
  if (pageSlug) return pageSlug === "home" ? "/" : `/${pageSlug}`;

  const brand = slugify(record.brand);
  const slug = slugify(record.slug || record.name || record.title);
  if (brand) return `/merken/${brand}${slug ? `/${slug}` : ""}`;
  if (record.is_product) return `/shop/${slug}`;
  if (record.journal_category) return `/journal/${slug}`;
  return `/blog/${slug}`;
}

function needsImage(record: EntityRecord, fields: string[]) {
  return fields.every((field) => {
    const value = String(record[field] || "").trim();
    return !value ||
      !value.startsWith("/images/") ||
      /^\/images\/brand\/logo\.(svg|png)$/i.test(value);
  });
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

async function fillEntity(
  entityName: string,
  statsPrefix: string,
  imageFields: string[],
  altField: string
) {
  const records = await entity(entityName).list(undefined, 5000) as EntityRecord[];
  stats[`${statsPrefix}Scanned`] = records.length;

  for (const record of records) {
    if (updateLimit && updatesThisRun >= updateLimit) return;
    if (!record.id || !needsImage(record, imageFields)) continue;

    const image = fallbackImageForHref(routeForRecord(record));
    const title = String(record.title || record.name || record.section_key || image.split("/").pop() || "4x4models");
    const payload: EntityRecord = {
      [imageFields[0]]: image,
      [altField]: title,
    };

    if (write) {
      await withRetry(
        () => entity(entityName).update(record.id, payload),
        `${entityName} media update`
      );
    }
    stats[`${statsPrefix}Updated`] += 1;
    updatesThisRun += 1;
  }
}

localImagePaths = new Set(await listImageFiles(publicImagesDir));

await fillEntity("WebsiteSection", "WebsiteSection", ["image_url"], "image_alt");
await fillEntity("WebsiteCard", "WebsiteCard", ["image_url"], "image_alt");
await fillEntity("BlogPost", "BlogPost", ["featured_image_url", "hero_image_url"], "featured_image_alt");
await fillEntity("Vehicle", "Vehicle", ["hero_image_url"], "hero_image_alt");

console.log(JSON.stringify({
  mode: write ? "write" : "dry-run",
  localImages: localImagePaths.size,
  updateLimit,
  updatesThisRun,
  ...stats,
}, null, 2));
