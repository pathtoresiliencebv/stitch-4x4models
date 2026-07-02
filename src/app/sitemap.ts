import type { MetadataRoute } from "next";
import manifest from "@/data/live-mirror/manifest.json";
import { mirrorImageForPath } from "@/data/live-mirror/image-map";
import { publicPathForLocale, stripSupportedLocalePrefix } from "@/lib/i18n-routing";

type MirrorManifest = {
  pages: Record<string, string>;
};

const SITEMAP_ORIGIN = "https://www.4x4models.com";
const routes = Object.keys((manifest as MirrorManifest).pages).sort();
const publicRoutes = Array.from(new Set(
  routes.flatMap((path) => {
    const basePath = stripSupportedLocalePrefix(path);
    return [
      publicPathForLocale(basePath, "en"),
      publicPathForLocale(basePath, "nl"),
    ];
  })
)).sort();

function sitemapUrl(path: string) {
  return new URL(path, SITEMAP_ORIGIN).toString();
}

function localizedAlternates(path: string) {
  const basePath = stripSupportedLocalePrefix(path);
  const enPath = publicPathForLocale(basePath, "en");
  const nlPath = publicPathForLocale(basePath, "nl");

  return {
    languages: {
      en: sitemapUrl(enPath),
      nl: sitemapUrl(nlPath),
      "x-default": sitemapUrl(enPath),
    },
  };
}

function routePriority(path: string) {
  const basePath = stripSupportedLocalePrefix(path);
  if (basePath === "/") return 1;
  if (["/merken", "/amerikaans", "/collecties", "/blog", "/journal", "/shop", "/forum"].includes(basePath)) return 0.9;
  if (basePath.split("/").length <= 3) return 0.75;
  return 0.62;
}

function changeFrequency(path: string): MetadataRoute.Sitemap[number]["changeFrequency"] {
  const basePath = stripSupportedLocalePrefix(path);
  if (basePath === "/" || basePath === "/journal" || basePath.startsWith("/journal/")) return "daily";
  if (basePath === "/blog" || basePath.startsWith("/blog/") || basePath === "/shop" || basePath.startsWith("/shop/")) return "weekly";
  return "monthly";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return publicRoutes.map((path) => {
    const image = mirrorImageForPath(stripSupportedLocalePrefix(path));

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
