import type { Metadata } from "next";
import type { BlogPost, ProductCategory, ProductTag, WebsitePage } from "@/types/base44";
import type { Locale } from "@/types/common";
import type { Vehicle } from "@/types/vehicle";

type SeoPost = {
  id?: string;
  title?: string;
  slug?: string;
  content?: string;
  meta_description?: string;
  excerpt?: string;
  featured_image_url?: string | null;
  featured_image_alt?: string | null;
  journal_category?: string;
  author?: string;
  created_by?: string;
  created_date?: string;
  updated_date?: string;
  published_at?: string | null;
  sku?: string;
  vendor?: string;
  product_images?: Array<{ url?: string; alt?: string }>;
  stock?: number;
};

export const defaultSiteTitle = "4x4models";
export const defaultSiteDescription =
  "4x4models is the home for off-road enthusiasts: in-depth Toyota Land Cruiser, Hilux, Tacoma and 4Runner guides, vetted overlanding gear, recovery, suspension and lighting reviews, and field-tested trail stories — all curated for serious 4x4 builds.";
export const defaultSiteKeywords = [
  "4x4",
  "off-road",
  "overlanding",
  "Toyota Land Cruiser",
  "Toyota Hilux",
  "Toyota Tacoma",
  "Toyota 4Runner",
  "Jeep Wrangler",
  "Ford Bronco",
  "recovery gear",
  "suspension kits",
  "all-terrain tires",
  "auxiliary lighting",
  "rooftop tent",
  "trail stories",
];

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_VERCEL_URL ||
  "https://4x4models.com";

export function absoluteUrl(path: string) {
  const base = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
  return new URL(path, base).toString();
}

export function localePath(locale: Locale, path = "") {
  const normalized = path ? `/${path.replace(/^\/+/, "")}` : "";
  return `/${locale}${normalized}`;
}

export function localeAlternates(locale: Locale, path = "") {
  return {
    canonical: localePath(locale, path),
    languages: {
      en: localePath("en", path),
      nl: localePath("nl", path),
    },
  };
}

export function pageMetadata({
  title,
  description,
  locale,
  path = "",
  image,
  type = "website",
}: {
  title: string;
  description?: string | null;
  locale: Locale;
  path?: string;
  image?: string | null;
  type?: "website" | "article";
}): Metadata {
  const cleanDescription = description || defaultSiteDescription;
  const url = absoluteUrl(localePath(locale, path));

  return {
    title,
    description: cleanDescription,
    alternates: localeAlternates(locale, path),
    openGraph: {
      title,
      description: cleanDescription,
      url,
      siteName: defaultSiteTitle,
      locale,
      type,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: cleanDescription,
      images: image ? [image] : undefined,
    },
  };
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

export function productJsonLd(product: SeoPost, path: string, price?: number, stock?: number) {
  const images = product.product_images?.map((image) => image.url).filter(Boolean) || [];
  if (product.featured_image_url) images.unshift(product.featured_image_url);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.meta_description || product.content,
    image: images,
    sku: product.sku,
    brand: product.vendor ? { "@type": "Brand", name: product.vendor } : undefined,
    offers:
      typeof price === "number"
        ? {
            "@type": "Offer",
            url: absoluteUrl(path),
            priceCurrency: "EUR",
            price,
            availability:
              typeof stock === "number" && stock <= 0
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
          }
        : undefined,
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

export function itemListJsonLd(items: Array<{ name: string; path: string; image?: string | null }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(item.path),
      name: item.name,
      image: item.image || undefined,
    })),
  };
}

export function articleJsonLd(article: SeoPost, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.meta_description || article.excerpt,
    image: article.featured_image_url ? [article.featured_image_url] : undefined,
    datePublished: article.created_date,
    dateModified: article.updated_date || article.created_date,
    mainEntityOfPage: absoluteUrl(path),
    author: article.author || article.created_by ? { "@type": "Person", name: article.author || article.created_by } : undefined,
    publisher: organizationJsonLd(),
  };
}

export function webPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description?: string | null;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: defaultSiteTitle,
      url: absoluteUrl("/"),
    },
  };
}

export function collectionPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description?: string | null;
  path: string;
}) {
  return {
    ...webPageJsonLd({ name, description, path }),
    "@type": "CollectionPage",
  };
}

export function vehicleArticleJsonLd(vehicle: Vehicle, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: vehicle.hero_headline || vehicle.name,
    description: vehicle.description || vehicle.hero_body || vehicle.tagline,
    image: [vehicle.hero_image_url, vehicle.featured_image_url].filter(Boolean),
    dateModified: vehicle.updated_date,
    mainEntityOfPage: absoluteUrl(path),
    about: [
      vehicle.brand ? { "@type": "Brand", name: vehicle.brand } : undefined,
      vehicle.segment ? { "@type": "Thing", name: vehicle.segment } : undefined,
    ].filter(Boolean),
    publisher: organizationJsonLd(),
  };
}

export function faqJsonLd(items?: Array<{ question?: string; answer?: string }>) {
  const questions = (items || []).filter((item) => item.question && item.answer);
  if (!questions.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    name: defaultSiteTitle,
    url: absoluteUrl("/"),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: defaultSiteTitle,
    url: absoluteUrl("/"),
    inLanguage: ["en", "nl"],
  };
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
