export interface VehicleSeries {
  id?: string;
  name?: string;
  slug?: string;
  badge?: string;
  description?: string;
  image_url?: string | null;
  cta_text?: string;
}

export interface VehicleSpec {
  feature?: string;
  value?: string;
}

export interface VehicleGalleryImage {
  url?: string;
  alt?: string;
}

export interface Vehicle {
  id: string;
  webshop_id?: string | null;
  name?: string;
  brand?: string | null;
  segment?: string | null;
  market_region?: string | null;
  trending_rank?: number | null;
  price_from?: number | null;
  use_cases?: string[];
  gallery_images?: VehicleGalleryImage[];
  slug?: string;
  tagline?: string | null;
  badge?: string | null;
  hero_headline?: string | null;
  hero_body?: string | null;
  hero_image_url?: string | null;
  hero_image_alt?: string | null;
  featured_image_url?: string | null;
  featured_image_alt?: string | null;
  description?: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  cta_primary_text?: string | null;
  cta_primary_url?: string | null;
  cta_secondary_text?: string | null;
  cta_secondary_url?: string | null;
  series?: VehicleSeries[];
  pros?: string[];
  cons?: string[];
  specs?: VehicleSpec[];
  faq_items?: Array<{
    question?: string;
    answer?: string;
  }>;
  related_product_slugs?: string[];
  related_article_slugs?: string[];
  sort_order?: number | null;
  status?: "draft" | "published" | "active" | "inactive" | string;
  created_date?: string;
  updated_date?: string;
}
