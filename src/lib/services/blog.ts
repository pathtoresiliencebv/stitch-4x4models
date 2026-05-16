import { fetchAPI } from '../api-config';
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
    if (params.project_id) filter.project_id = params.project_id;

    searchParams.set('q', JSON.stringify(filter));
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.skip) searchParams.set('skip', params.skip.toString());
    if (params.sort_by) searchParams.set('sort_by', params.sort_by);

    return fetchAPI<BlogResponse>(`/entities/BlogPost?${searchParams}`);
  },

  async get(id: string): Promise<BlogPost> {
    return fetchAPI<BlogPost>(`/entities/BlogPost/${id}`);
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const { records } = await fetchAPI<BlogResponse>(
      `/entities/BlogPost?q=${JSON.stringify({ slug, is_product: false })}`
    );
    return records[0] || null;
  },

  async getLatest(limit = 10): Promise<BlogPost[]> {
    const { records } = await fetchAPI<BlogResponse>(
      `/entities/BlogPost?q=${JSON.stringify({ status: 'published', is_product: false })}&limit=${limit}&sort_by=-created_date`
    );
    return records;
  },

  async create(data: Partial<BlogPost>): Promise<BlogPost> {
    return fetchAPI<BlogPost>('/entities/BlogPost', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    return fetchAPI<BlogPost>(`/entities/BlogPost/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return fetchAPI<void>(`/entities/BlogPost/${id}`, { method: 'DELETE' });
  },
};
