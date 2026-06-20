import { base44Fetch, base44List, normalizeListResponse } from "@/lib/base44-api";
import type { BlogPost, BlogListParams } from '@/types/blog';

interface BlogResponse {
  records: BlogPost[];
  total: number;
}

export const blogService = {
  async list(params: BlogListParams = {}): Promise<BlogResponse> {
    const searchParams = new URLSearchParams();

    const filter: Record<string, unknown> = { is_product: false };
    if (params.status) filter.status = params.status;
    if (params.locale) filter.locale = params.locale;
    if (params.project_id) filter.project_id = params.project_id;

    searchParams.set('q', JSON.stringify(filter));
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.skip) searchParams.set('skip', params.skip.toString());
    if (params.sort_by) searchParams.set('sort_by', params.sort_by);

    const payload = await base44Fetch<unknown>(`/entities/BlogPost?${searchParams}`);
    return normalizeListResponse<BlogPost>(payload);
  },

  async get(id: string): Promise<BlogPost> {
    return base44Fetch<BlogPost>(`/entities/BlogPost/${id}`);
  },

  async getBySlug(slug: string, locale?: string): Promise<BlogPost | null> {
    const { records } = await base44List<BlogPost>("BlogPost", {
      q: { slug, is_product: false, status: "published", ...(locale ? { locale } : {}) },
      limit: 1,
    });
    return records[0] || null;
  },

  async getLatest(limit = 10, locale?: string): Promise<BlogPost[]> {
    const { records } = await base44List<BlogPost>("BlogPost", {
      q: { status: "published", is_product: false, ...(locale ? { locale } : {}) },
      limit,
      sort_by: "-created_date",
    });
    return records;
  },

  async create(data: Partial<BlogPost>): Promise<BlogPost> {
    return base44Fetch<BlogPost>('/entities/BlogPost', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    return base44Fetch<BlogPost>(`/entities/BlogPost/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return base44Fetch<void>(`/entities/BlogPost/${id}`, { method: 'DELETE' });
  },
};
