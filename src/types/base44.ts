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
  seo_title?: string;
  google_preview_title?: string;
  google_preview_url?: string;
  google_preview_description?: string;
  canonical_url?: string;
  focus_keyword?: string;
  secondary_keywords?: string[];
  seo_score?: number;
  readability_score?: number;
  word_count?: number;
  locale?: "en" | "nl" | string;
  source_locale?: "en" | "nl" | string;
  translation_status?: "source" | "queued" | "translated" | "review" | "published" | string;
  translated_from_id?: string;
  search_console_clicks?: number;
  search_console_impressions?: number;
  search_console_ctr?: number;
  search_console_position?: number;
  last_search_console_sync?: Base44Date;
  seo_status?: "needs_work" | "ready" | "scheduled" | "published" | string;
  status?: string;
  featured_image_url?: string;
}

export interface SearchConsoleSnapshot {
  id: string;
  webshop_id?: string;
  site_url: string;
  domain?: string;
  period_start: string;
  period_end: string;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
  sitemap_url?: string;
  sitemap_status?: string;
  verified_sites?: string[];
  synced_at?: Base44Date;
}

export interface SearchConsoleQuery {
  id: string;
  webshop_id?: string;
  site_url?: string;
  record_type?: "query" | "page" | string;
  query?: string;
  page_url?: string;
  page_slug?: string;
  period_start?: string;
  period_end?: string;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
  opportunity_score?: number;
  synced_at?: Base44Date;
}

export interface MerchantCenterAccount {
  id: string;
  webshop_id?: string;
  account_resource: string;
  account_name?: string;
  domain?: string;
  language_code?: string;
  time_zone?: string;
  product_count?: number;
  synced_at?: Base44Date;
  status?: "active" | "needs_review" | string;
}

export interface MerchantCenterProduct {
  id: string;
  webshop_id?: string;
  account_resource?: string;
  product_resource: string;
  offer_id?: string;
  title?: string;
  brand?: string;
  link?: string;
  image_url?: string;
  availability?: string;
  price?: string;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  period_start?: string;
  period_end?: string;
  synced_at?: Base44Date;
  status?: "active" | "inactive" | "needs_review" | string;
}

export interface SeoTask {
  id: string;
  webshop_id?: string;
  page_slug?: string;
  title: string;
  task_type?: string;
  priority?: "low" | "medium" | "high" | string;
  status?: "todo" | "in_progress" | "ready" | "scheduled" | "done" | string;
  due_date?: string;
  scheduled_date?: Base44Date;
  recommendation?: string;
  target_keyword?: string;
  current_score?: number;
}

export interface SeoAuditIssue {
  id: string;
  webshop_id?: string;
  page_slug?: string;
  issue_type?: string;
  severity?: "low" | "medium" | "high" | string;
  title: string;
  recommendation?: string;
  status?: "open" | "in_progress" | "fixed" | "ignored" | string;
  created_for_score?: number;
}

export interface TranslationJob {
  id: string;
  webshop_id?: string;
  entity_name: string;
  record_id: string;
  source_locale?: "nl" | "en" | string;
  target_locale?: "en" | "nl" | string;
  source_title?: string;
  source_slug?: string;
  status?: "queued" | "translated" | "review" | "published" | "failed" | string;
  source_hash?: string;
  translated_record_id?: string;
  notes?: string;
  queued_at?: Base44Date;
  completed_at?: Base44Date;
}

export interface WebsiteSection {
  id: string;
  webshop_id?: string;
  page_slug: string;
  locale?: "en" | "nl" | string;
  section_key: string;
  section_type?:
    | "hero"
    | "card_grid"
    | "brand_grid"
    | "article_grid"
    | "product_grid"
    | "feature"
    | "text"
    | "media"
    | "cta"
    | "forum_grid"
    | string;
  eyebrow?: string;
  title?: string;
  body?: string;
  image_url?: string;
  image_alt?: string;
  cta_label?: string;
  cta_url?: string;
  layout?: string;
  background?: string;
  status?: "draft" | "published" | "archived" | string;
  sort_order?: number;
  notes?: string;
  created_date?: Base44Date;
  updated_date?: Base44Date;
}

export interface WebsiteCard {
  id: string;
  webshop_id?: string;
  page_slug: string;
  section_key: string;
  section_id?: string;
  source_entity?: string;
  source_record_id?: string;
  locale?: "en" | "nl" | string;
  card_type?:
    | "brand"
    | "model"
    | "article"
    | "journal"
    | "collection"
    | "product"
    | "forum"
    | "link"
    | "feature"
    | string;
  title: string;
  subtitle?: string;
  body?: string;
  badge?: string;
  meta?: string;
  image_url?: string;
  image_alt?: string;
  href?: string;
  cta_label?: string;
  status?: "draft" | "published" | "archived" | string;
  sort_order?: number;
  created_date?: Base44Date;
  updated_date?: Base44Date;
}

export interface WebshopPhoto {
  id: string;
  webshop_id?: string;
  title?: string;
  url: string;
  alt?: string;
}
