export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  focus_keyword?: string;
  secondary_keywords?: string[];
  seo_score?: number;
  readability_score?: number;
  status: 'draft' | 'review' | 'published';
  featured_image_url?: string;
  word_count?: number;
  scheduled_date?: string;
  tags?: string[];
  project_id?: string;
  created_date: string;
  updated_date: string;
  created_by?: string;
}

export interface BlogListParams {
  status?: 'draft' | 'review' | 'published';
  project_id?: string;
  limit?: number;
  skip?: number;
  sort_by?: string;
}
