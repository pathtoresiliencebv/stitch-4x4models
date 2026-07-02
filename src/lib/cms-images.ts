import {
  DEFAULT_MIRROR_IMAGE,
  knownMirrorImagePaths,
  mirrorImageForPath,
} from "@/data/live-mirror/image-map";

export const DEFAULT_CMS_IMAGE = DEFAULT_MIRROR_IMAGE;

type ImageRecord = {
  featured_image_url?: string | null;
  hero_image_url?: string | null;
  slug?: string | null;
};

function slugify(value?: string | null) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function decodeNextImageUrl(pathname: string, search: string) {
  if (pathname !== "/_next/image") return "";
  const encoded = new URLSearchParams(search).get("url");
  if (!encoded) return "";

  try {
    const decoded = decodeURIComponent(encoded);
    return decoded.startsWith("/images/") ? decoded : "";
  } catch {
    return "";
  }
}

function isLikelyExpiredDemoImage(value: string) {
  return /lh3\.googleusercontent\.com\/aida-public/i.test(value) ||
    /\/placeholders?\//i.test(value) ||
    /(?:^|\/)(?:lorem|demo|sample)-/i.test(value);
}

export function normalizeCmsImageUrl(value?: string | null) {
  const trimmed = (value || "").trim();
  if (!trimmed || isLikelyExpiredDemoImage(trimmed)) return "";

  if (trimmed.startsWith("/_next/image")) {
    const decoded = decodeNextImageUrl("/_next/image", trimmed.split("?")[1] || "");
    return decoded || "";
  }

  if (trimmed.startsWith("/images/")) return trimmed;
  if (trimmed.startsWith("images/")) return `/${trimmed}`;

  try {
    const url = new URL(trimmed);
    if (url.hostname === "4x4models.com" || url.hostname === "www.4x4models.com") {
      const decoded = decodeNextImageUrl(url.pathname, url.search);
      if (decoded) return decoded;
      if (url.pathname.startsWith("/images/")) return url.pathname;
    }

    return trimmed;
  } catch {
    return trimmed;
  }
}

export function imageWithFallback(value: string | null | undefined, fallbackHref?: string) {
  return normalizeCmsImageUrl(value) || mirrorImageForPath(fallbackHref) || DEFAULT_CMS_IMAGE;
}

export function imageForVehicleRecord(record: ImageRecord & { brand?: string | null }) {
  const brandSlug = slugify(record.brand);
  const slug = slugify(record.slug);
  const fallbackHref = brandSlug
    ? `/merken/${brandSlug}${slug ? `/${slug}` : ""}`
    : slug
      ? `/merken/${slug}`
      : "/merken";

  return imageWithFallback(record.featured_image_url || record.hero_image_url, fallbackHref);
}

export function imageForArticleRecord(record: ImageRecord & { journal_category?: string | null }) {
  const slug = slugify(record.slug);
  const fallbackHref = record.journal_category ? `/journal/${slug}` : `/blog/${slug}`;
  return imageWithFallback(record.featured_image_url || record.hero_image_url, fallbackHref);
}

export function imageForProductRecord(record: ImageRecord) {
  const slug = slugify(record.slug);
  return imageWithFallback(record.featured_image_url || record.hero_image_url, `/shop/${slug}`);
}

export function titleFromImagePath(imagePath: string) {
  const name = imagePath.split("/").pop()?.replace(/\.[^.]+$/, "") || "Image";
  return name
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function localCmsMediaItems() {
  return knownMirrorImagePaths.map((url) => ({
    id: `local:${url}`,
    title: titleFromImagePath(url),
    url,
    alt: titleFromImagePath(url),
    source: "local" as const,
  }));
}
