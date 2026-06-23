export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  content?: string;
  meta_description?: string;
  seo_title?: string;
  canonical_url?: string;
  focus_keyword?: string;
  featured_image_url?: string;
  faq_items?: Array<{
    question?: string;
    answer?: string;
  }>;
  related_article_slugs?: string[];
  seo_score?: number;
  webshop_id?: string;
  status?: string;
  sort_order?: number;
  created_date?: string;
}

export interface ProductTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  content?: string;
  meta_description?: string;
  featured_image_url?: string | null;
  color?: string;
  status?: string;
  webshop_id?: string;
}

export interface Product {
  id: string;
  webshop_id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  meta_description?: string;
  seo_title?: string;
  canonical_url?: string;
  focus_keyword?: string;
  secondary_keywords?: string[];
  featured_image_url?: string | null;
  featured_image_alt?: string | null;
  author?: string;
  category?: string;
  product_type?: string;
  is_product?: boolean;
  price?: number;
  sale_price?: number;
  rating?: number;
  reviews_count?: number;
  status?: string;
  created_date?: string;
  vendor?: string;
  sku?: string;
  stock?: number;
  category_id?: string;
  tags?: string[];
  faq_items?: Array<{
    question?: string;
    answer?: string;
  }>;
  related_vehicle_slugs?: string[];
  related_product_slugs?: string[];
  related_article_slugs?: string[];
  track_inventory?: boolean;
  video_url?: string;
  product_images?: Array<{
    url?: string;
    alt?: string;
  }>;
  options?: Array<{
    name?: string;
    type?: "text" | "color" | "material" | string;
    values?: Array<{
      label?: string;
      color?: string;
      image_url?: string;
    }>;
  }>;
  is_customizable?: boolean;
  custom_fields?: Array<{
    type?: "text" | "textarea" | "file" | "select" | "number" | string;
    label?: string;
    placeholder?: string;
    help_text?: string;
    required?: boolean;
    options?: string[];
    max_length?: number;
    accept?: string;
  }>;
}

export interface ProductListParams {
  category_id?: string;
  status?: 'draft' | 'review' | 'published' | 'active';
  limit?: number;
  skip?: number;
  sort_by?: string;
}
