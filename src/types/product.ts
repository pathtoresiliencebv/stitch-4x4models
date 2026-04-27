export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_date: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  focus_keyword?: string;
  featured_image_url?: string;
  price: number;
  sale_price?: number;
  sku?: string;
  stock: number;
  category_id?: string;
  category?: ProductCategory;
  tags?: string[];
  status: 'draft' | 'review' | 'published';
  created_date: string;
  updated_date: string;
  created_by?: string;
}

export interface ProductListParams {
  category_id?: string;
  status?: 'draft' | 'review' | 'published';
  limit?: number;
  skip?: number;
  sort_by?: string;
}
