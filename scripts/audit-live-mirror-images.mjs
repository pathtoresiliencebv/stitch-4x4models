import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const manifestPath = path.join(root, "src/data/live-mirror/manifest.json");
const pagesDir = path.join(root, "src/data/live-mirror/pages");
const publicDir = path.join(root, "public");
const publicImagesDir = path.join(publicDir, "images");

async function listFiles(dir, prefix = "") {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const publicPath = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...await listFiles(fullPath, publicPath));
    } else if (/\.(avif|gif|jpe?g|png|svg|webp)$/i.test(entry.name)) {
      files.push(publicPath.replace(/^\//, ""));
    }
  }

  return files;
}

function decodeNextImageUrl(value) {
  try {
    const url = new URL(value, "https://www.4x4models.com");
    const nested = url.searchParams.get("url");
    return nested ? decodeURIComponent(nested) : value;
  } catch {
    return value;
  }
}

function extractImageReferences(html) {
  const refs = new Set();
  const patterns = [
    /src="([^"]+)"/g,
    /url\(["']?([^"')]+)["']?\)/g,
    /\/_next\/image\?url=([^&"'\s)]+)[^"'\s)]*/g,
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const raw = match[0].startsWith("/_next/image") ? match[0] : match[1];
      const ref = decodeNextImageUrl(raw.replaceAll("&amp;", "&"));
      if (/\.(avif|gif|jpe?g|png|svg|webp)(\?|$)/i.test(ref) || ref.startsWith("/images/")) {
        refs.add(ref.split("?")[0]);
      }
    }
  }

  return refs;
}

function extractCardHrefs(html) {
  const refs = new Set();
  const pattern = /<a\b(?=[^>]*\bclass="[^"]*\bgroup\b[^"]*\bno-underline\b[^"]*")(?=[^>]*\bhref="([^"]+)")[^>]*>/g;

  for (const match of html.matchAll(pattern)) {
    const href = match[1];
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      continue;
    }

    const pathname = href.startsWith("http")
      ? new URL(href).pathname
      : href.split("?")[0].split("#")[0];

    if (pathname === "/over-ons" || pathname === "/en/over-ons") continue;
    refs.add(href);
  }

  return refs;
}

async function existsPublicPath(publicPath) {
  try {
    await access(path.join(publicDir, publicPath.replace(/^\//, "")));
    return true;
  } catch {
    return false;
  }
}

function fallbackImageForRoute(route, localImages) {
  const slug = route.split("/").filter(Boolean).at(-1) || "homepage";
  const brand = route.startsWith("/merken/") ? route.split("/").filter(Boolean)[1] : "";
  const candidates = [
    `images/blog/${slug}.jpg`,
    `images/journal/${slug}.jpg`,
    `images/collections/${slug}.jpg`,
    `images/shop/${slug}.jpg`,
    `images/explainers/${slug}.jpg`,
    brand ? `images/brands/${brand === "ineos-fusilier" ? "ineos" : brand}.jpg` : "",
    "images/hero/homepage.jpg",
  ].filter(Boolean);

  return candidates.find((candidate) => localImages.has(candidate)) || "images/hero/homepage.jpg";
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const imageMap = await import(pathToFileURL(path.join(root, "src/data/live-mirror/image-map.ts")));
  const localImages = new Set(await listFiles(publicImagesDir, "images"));
  const referenced = new Set();
  const cardHrefs = new Set();

  for (const fileName of Object.values(manifest.pages || {})) {
    const html = await readFile(path.join(pagesDir, fileName), "utf8");
    for (const ref of extractImageReferences(html)) {
      if (ref.startsWith("/images/")) referenced.add(ref.slice(1));
    }
    for (const href of extractCardHrefs(html)) cardHrefs.add(href);
  }

  const missingReferenced = [];
  for (const ref of referenced) {
    if (!(await existsPublicPath(ref))) missingReferenced.push(ref);
  }

  const missingCardImages = [];
  const defaultCardImages = [];
  for (const href of cardHrefs) {
    const image = imageMap.mirrorImageForPath(href);
    const publicPath = image.replace(/^\//, "");

    if (!(await existsPublicPath(publicPath))) {
      missingCardImages.push({ href, image });
    } else if (image === imageMap.DEFAULT_MIRROR_IMAGE) {
      defaultCardImages.push({ href, image });
    }
  }

  const routeFallbackMissing = Object.keys(manifest.pages || {}).filter((route) => {
    const fallback = fallbackImageForRoute(route, localImages);
    return !localImages.has(fallback);
  });

  console.log(JSON.stringify({
    routes: Object.keys(manifest.pages || {}).length,
    localImages: localImages.size,
    referencedLocalImages: referenced.size,
    cardImageLinks: cardHrefs.size,
    missingReferenced: missingReferenced.sort(),
    missingCardImages: missingCardImages.sort((a, b) => a.href.localeCompare(b.href)),
    defaultCardImages: defaultCardImages.sort((a, b) => a.href.localeCompare(b.href)),
    routeFallbackMissing,
  }, null, 2));

  if (missingReferenced.length || missingCardImages.length || defaultCardImages.length || routeFallbackMissing.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
