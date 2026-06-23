import type { MetadataRoute } from "next";
import { blogService } from "@/lib/services/blog";
import { categoryService, productService, tagService } from "@/lib/services/product";
import { vehicleService } from "@/lib/services/vehicle";
import type { Locale } from "@/types/common";

const locales: Locale[] = ["en", "nl"];
const SITEMAP_ORIGIN = "https://4x4models.com";

function sitemapUrl(path: string) {
  return new URL(path, SITEMAP_ORIGIN).toString();
}

const STATIC_PATHS = [
  "",
  "/vehicles",
  "/journal",
  "/gear",
  "/shop",
  "/login",
  "/register",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicles, enArticles, nlArticles, products, categories, tags] = await Promise.all([
    vehicleService.list(500).catch(() => []),
    blogService.getLatest(500, "en").catch(() => []),
    blogService.getLatest(500, "nl").catch(() => []),
    productService.listPublished({ limit: 500 }).catch(() => { return { records: [], total: 0 }; }),
    categoryService.list().catch(() => []),
    tagService.list().catch(() => []),
  ]);

  const now = new Date();
  const staticEntries = locales.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: sitemapUrl(`/${locale}${path}`),
      lastModified: now,
      changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((other) => [other, sitemapUrl(`/${other}${path}`)])
        ),
      },
    }))
  );

  const vehicleEntries = locales.flatMap((locale) =>
    vehicles
      .filter((vehicle) => vehicle.slug)
      .map((vehicle) => ({
        url: sitemapUrl(`/${locale}/vehicles/${vehicle.slug}`),
        lastModified: vehicle.updated_date ? new Date(vehicle.updated_date) : now,
        changeFrequency: "weekly" as const,
        priority: 0.9,
        images: [vehicle.hero_image_url, vehicle.featured_image_url].filter(Boolean) as string[],
        alternates: {
          languages: Object.fromEntries(
            locales.map((other) => [other, sitemapUrl(`/${other}/vehicles/${vehicle.slug}`)])
          ),
        },
      }))
  );

  const articleEntries = [
    ...enArticles.map((article) => ({ locale: "en" as const, article })),
    ...nlArticles.map((article) => ({ locale: "nl" as const, article })),
  ]
    .filter(({ article }) => article.slug)
    .map(({ locale, article }) => ({
      url: sitemapUrl(`/${locale}/journal/${article.slug}`),
      lastModified: new Date(
        article.updated_date || article.published_at || article.created_date || now.toISOString()
      ),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: article.featured_image_url ? [article.featured_image_url] : undefined,
      alternates: {
        languages: Object.fromEntries(
          locales.map((other) => [other, sitemapUrl(`/${other}/journal/${article.slug}`)])
        ),
      },
    }));

  const productEntries = locales.flatMap((locale) =>
    products.records
      .filter((product) => product.slug)
      .map((product) => ({
        url: sitemapUrl(`/${locale}/shop/${product.slug}`),
        lastModified: product.created_date ? new Date(product.created_date) : now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
        images: [
          product.featured_image_url,
          product.product_images?.[0]?.url,
        ].filter(Boolean) as string[],
        alternates: {
          languages: Object.fromEntries(
            locales.map((other) => [other, sitemapUrl(`/${other}/shop/${product.slug}`)])
          ),
        },
      }))
  );

  const categoryEntries = locales.flatMap((locale) =>
    categories
      .filter((category) => category.slug)
      .map((category) => ({
        url: sitemapUrl(`/${locale}/gear/${category.slug}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
  );

  const tagEntries = locales.flatMap((locale) =>
    tags
      .filter((tag) => tag.slug)
      .map((tag) => ({
        url: sitemapUrl(`/${locale}/tags/${tag.slug}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      }))
  );

  return [
    {
      url: sitemapUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(locales.map((other) => [other, sitemapUrl(`/${other}`)])),
      },
    },
    ...staticEntries,
    ...vehicleEntries,
    ...articleEntries,
    ...productEntries,
    ...categoryEntries,
    ...tagEntries,
  ];
}
