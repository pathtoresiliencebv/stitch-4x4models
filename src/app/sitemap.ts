import type { MetadataRoute } from "next";
import { blogService } from "@/lib/services/blog";
import { categoryService, productService } from "@/lib/services/product";
import { vehicleService } from "@/lib/services/vehicle";
import { absoluteUrl } from "@/lib/seo";
import type { Locale } from "@/types/common";

const locales: Locale[] = ["en", "nl"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicles, enArticles, nlArticles, products, categories] = await Promise.all([
    vehicleService.list(500),
    blogService.getLatest(500, "en"),
    blogService.getLatest(500, "nl"),
    productService.listPublished({ limit: 500 }),
    categoryService.list(),
  ]);

  const staticPaths = locales.flatMap((locale) => [
    `/${locale}`,
    `/${locale}/vehicles`,
    `/${locale}/journal`,
    `/${locale}/gear`,
    `/${locale}/shop`,
    `/${locale}/shop/cart`,
    `/${locale}/shop/checkout`,
  ]);

  const vehiclePaths = locales.flatMap((locale) =>
    vehicles
      .filter((vehicle) => vehicle.slug)
      .map((vehicle) => ({
        url: absoluteUrl(`/${locale}/vehicles/${vehicle.slug}`),
        lastModified: vehicle.updated_date,
      }))
  );

  const articlePaths = [
    ...enArticles.map((article) => ({ locale: "en" as const, article })),
    ...nlArticles.map((article) => ({ locale: "nl" as const, article })),
  ]
    .filter(({ article }) => article.slug)
    .map(({ locale, article }) => ({
      url: absoluteUrl(`/${locale}/journal/${article.slug}`),
      lastModified: article.updated_date || article.published_at || article.created_date,
    }));

  const productPaths = locales.flatMap((locale) =>
    products.records
      .filter((product) => product.slug)
      .map((product) => ({
        url: absoluteUrl(`/${locale}/shop/${product.slug}`),
        lastModified: product.created_date,
      }))
  );
  const categoryPaths = locales.flatMap((locale) =>
    categories
      .filter((category) => category.slug)
      .map((category) => ({
        url: absoluteUrl(`/${locale}/gear/${category.slug}`),
      }))
  );

  return [
    ...staticPaths.map((path) => ({ url: absoluteUrl(path) })),
    ...categoryPaths,
    ...vehiclePaths,
    ...articlePaths,
    ...productPaths,
  ];
}
