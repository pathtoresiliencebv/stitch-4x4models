import type { MetadataRoute } from "next";
import manifest from "@/data/live-mirror/manifest.json";
import { mirrorImageForPath } from "@/data/live-mirror/image-map";

type MirrorManifest = {
  pages: Record<string, string>;
};

const SITEMAP_ORIGIN = "https://www.4x4models.com";
const routes = Object.keys((manifest as MirrorManifest).pages).sort();

function sitemapUrl(path: string) {
  return new URL(path, SITEMAP_ORIGIN).toString();
}

function localizedAlternates(path: string) {
  const withoutLocale = path.startsWith("/en/") ? path.slice(3) : path === "/en" ? "/" : path;
  const enPath = withoutLocale === "/" ? "/en" : `/en${withoutLocale}`;

  if (!routes.includes(enPath) && !routes.includes(withoutLocale)) return undefined;

  return {
    languages: {
      nl: sitemapUrl(withoutLocale),
      en: sitemapUrl(enPath),
      "x-default": sitemapUrl(withoutLocale),
    },
  };
}

function routePriority(path: string) {
  if (path === "/") return 1;
  if (["/merken", "/amerikaans", "/collecties", "/blog", "/journal", "/shop", "/forum"].includes(path)) return 0.9;
  if (path.split("/").length <= 3) return 0.75;
  return 0.62;
}

function changeFrequency(path: string): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (path === "/" || path === "/journal" || path.startsWith("/journal/")) return "daily";
  if (path === "/blog" || path.startsWith("/blog/") || path === "/shop" || path.startsWith("/shop/")) return "weekly";
  return "monthly";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((path) => {
    const image = mirrorImageForPath(path);

    return {
      url: sitemapUrl(path),
      lastModified: now,
      changeFrequency: changeFrequency(path),
      priority: routePriority(path),
      images: image ? [sitemapUrl(image)] : undefined,
      alternates: localizedAlternates(path),
    };
  });
}
