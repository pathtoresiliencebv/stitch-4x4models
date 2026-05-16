import type { Metadata } from "next";
import type { BlogPost, ProductCategory, ProductTag, WebsitePage } from "@/types/base44";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "";

export function absoluteUrl(path: string) {
  if (!siteUrl) return path;
  const base = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
  return new URL(path, base).toString();
}

export function metadataFromContent(
  item: BlogPost | ProductCategory | ProductTag | WebsitePage,
  path: string
): Metadata {
  const image = "featured_image_url" in item ? item.featured_image_url : undefined;
  const title = "title" in item ? item.title : item.name;
  const description = item.meta_description || ("description" in item ? item.description : undefined);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined,
      url: absoluteUrl(path),
    },
    alternates: {
      canonical: path,
    },
  };
}

export function productJsonLd(product: BlogPost, path: string, price: number, stock?: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.meta_description,
    image: product.product_images?.map((image) => image.url) || [product.featured_image_url].filter(Boolean),
    sku: product.sku,
    brand: product.vendor ? { "@type": "Brand", name: product.vendor } : undefined,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(path),
      priceCurrency: "EUR",
      price,
      availability: stock && stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
}

export function breadcrumbsJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
