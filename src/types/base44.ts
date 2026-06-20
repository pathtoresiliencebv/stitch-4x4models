export type Base44Date = string;

export interface Webshop {
  id: string;
  name: string;
  url?: string;
  status?: string;
  description?: string;
  logo_url?: string;
  project_id?: string;
  repo_url?: string;
  vercel_url?: string;
}

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductOptionValue {
  label: string;
  color?: string;
  image_url?: string;
}

export interface ProductOption {
  id: string;
  name: string;
  type: "text" | "color" | "material";
  values: ProductOptionValue[];
}

export interface CustomField {
  id: string;
  type: "text" | "textarea" | "number" | "file" | "select";
  label: string;
  placeholder?: string;
  help_text?: string;
  required?: boolean;
  options?: string[];
  max_length?: number;
  accept?: string;
}

export interface FaqItem {
  question?: string;
  answer?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  locale?: "en" | "nl" | string;
  slug: string;
  content?: string;
  featured_image_url?: string;
  featured_image_alt?: string;
  excerpt?: string;
  meta_description?: string;
  seo_title?: string;
  canonical_url?: string;
  focus_keyword?: string;
  secondary_keywords?: string[];
  seo_score?: number;
  word_count?: number;
  is_product?: boolean;
  price?: number;
  sale_price?: number;
  sku?: string;
  stock?: number;
  track_inventory?: boolean;
  category_id?: string;
  tags?: string[];
  faq_items?: FaqItem[];
  related_vehicle_slugs?: string[];
  related_product_slugs?: string[];
  related_article_slugs?: string[];
  vendor?: string;
  product_type?: string;
  product_images?: ProductImage[];
  video_url?: string;
  options?: ProductOption[];
  is_customizable?: boolean;
  custom_fields?: CustomField[];
  subscriptions?: unknown[];
  bundles?: unknown[];
  offers?: unknown[];
  status?: "active" | "draft" | "archived" | "review" | "published";
  scheduled_date?: Base44Date;
  created_date?: Base44Date;
  updated_date?: Base44Date;
  created_by?: string;
  webshop_id?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string;
  option_values?: Record<string, string>;
  price?: number;
  compare_at_price?: number;
  stock?: number;
  sku?: string;
  barcode?: string;
  image_url?: string;
  weight?: number;
  position?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  content?: string;
  meta_description?: string;
  seo_title?: string;
  canonical_url?: string;
  focus_keyword?: string;
  featured_image_url?: string;
  faq_items?: FaqItem[];
  related_article_slugs?: string[];
  seo_score?: number;
  status?: string;
  webshop_id?: string;
}

export interface ProductTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  content?: string;
  meta_description?: string;
  featured_image_url?: string;
  color?: string;
  status?: string;
  webshop_id?: string;
}

export interface WebsitePage {
  id: string;
  webshop_id?: string;
  title: string;
  slug: string;
  content?: string;
  meta_description?: string;
  focus_keyword?: string;
  seo_score?: number;
  status?: string;
  featured_image_url?: string;
}

export interface WebshopPhoto {
  id: string;
  webshop_id?: string;
  title?: string;
  url: string;
  alt?: string;
}
