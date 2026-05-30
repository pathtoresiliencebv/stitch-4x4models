export interface BlogPost {
  id: string;
  project_id?: string;
  webshop_id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  meta_description?: string;
  focus_keyword?: string;
  secondary_keywords?: string[];
  seo_score?: number;
  readability_score?: number;
  status?: 'draft' | 'active' | 'archived' | 'review' | 'published';
  featured_image_url?: string | null;
  featured_image_alt?: string | null;
  word_count?: number;
  scheduled_date?: string;
  published_at?: string | null;
  author?: string;
  author_image_url?: string;
  author_role?: string;
  read_time?: string;
  journal_category?: 'EXPEDITION' | 'TECH' | 'TRAILS' | 'GEAR' | 'MAINTENANCE';
  is_product?: boolean;
  price?: number;
  sale_price?: number;
  rating?: number;
  reviews_count?: number;
  sku?: string;
  stock?: number;
  category_id?: string;
  tags?: string[];
  vendor?: string;
  product_type?: string;
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
  variants?: Array<{
    name?: string;
    options?: string[];
  }>;
  subscriptions?: Array<{
    name?: string;
    price?: number;
    duration?: string;
  }>;
  bundles?: Array<{
    name?: string;
    items?: string[];
    bundle_price?: number;
  }>;
  offers?: Array<{
    name?: string;
    discount_percent?: number;
    start_date?: string;
    end_date?: string;
  }>;
  created_date?: string;
  updated_date?: string;
}

export interface BlogListParams {
  status?: string;
  project_id?: string;
  limit?: number;
  skip?: number;
  sort_by?: string;
}
