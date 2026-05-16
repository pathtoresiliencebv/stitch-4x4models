import type { MetadataRoute } from "next";
import { getCategories, getLatestBlogPosts, getProducts, getTags } from "@/lib/base44-data";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, tags, posts] = await Promise.all([
    getProducts(500),
    getCategories(),
    getTags(),
    getLatestBlogPosts(500),
  ]);

  return [
    { url: absoluteUrl("/") },
    { url: absoluteUrl("/producten") },
    { url: absoluteUrl("/collecties") },
    { url: absoluteUrl("/blog") },
    ...products.map((product) => ({ url: absoluteUrl(`/producten/${product.slug}`), lastModified: product.updated_date })),
    ...categories.map((category) => ({ url: absoluteUrl(`/collecties/${category.slug}`) })),
    ...tags.map((tag) => ({ url: absoluteUrl(`/tags/${tag.slug}`) })),
    ...posts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.updated_date })),
  ];
}
