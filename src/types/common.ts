export type Locale = "en" | "nl";

export interface ApiListResponse<T> {
  records: T[];
  total: number;
}

export interface SiteContent {
  id: string;
  webshop_id?: string | null;
  page: string;
  section?: string | null;
  key: string;
  value?: string | null;
  value_long?: string | null;
  image_url?: string | null;
  link_url?: string | null;
  locale?: Locale | string | null;
  sort_order?: number | null;
  notes?: string | null;
  created_date?: string;
  updated_date?: string;
}

export type LocalizedPageContent = Record<string, Record<string, SiteContent>>;
