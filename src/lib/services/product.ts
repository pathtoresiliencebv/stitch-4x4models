import { fetchAPI } from '../api-config';
import type { Product, ProductCategory, ProductListParams } from '@/types/product';

interface ProductsResponse {
  records: Product[];
  total: number;
}

interface CategoriesResponse {
  records: ProductCategory[];
}

// Product Service - Products are BlogPost entities with is_product: true and status: "active"
export const productService = {
  async list(params: ProductListParams = {}): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();

    const filter: Record<string, unknown> = { is_product: true, status: 'active' };
    if (params.category_id) filter.category_id = params.category_id;
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.skip) searchParams.set('skip', params.skip.toString());
    if (params.sort_by) searchParams.set('sort_by', params.sort_by);

    searchParams.set('q', JSON.stringify(filter));

    return fetchAPI<ProductsResponse>(`/entities/BlogPost?${searchParams}`);
  },

  async get(id: string): Promise<Product> {
    return fetchAPI<Product>(`/entities/BlogPost/${id}`);
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const { records } = await fetchAPI<ProductsResponse>(
      `/entities/BlogPost?q=${JSON.stringify({ slug, is_product: true, status: 'active' })}`
    );
    return records[0] || null;
  },

  async create(data: Partial<Product>): Promise<Product> {
    return fetchAPI<Product>('/entities/BlogPost', {
      method: 'POST',
      body: JSON.stringify({ ...data, is_product: true, status: 'active' }),
    });
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    return fetchAPI<Product>(`/entities/BlogPost/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return fetchAPI<void>(`/entities/BlogPost/${id}`, { method: 'DELETE' });
  },
};

// Category Service
export const categoryService = {
  async list(): Promise<ProductCategory[]> {
    const { records } = await fetchAPI<CategoriesResponse>('/entities/ProductCategory?q=status=published');
    return records;
  },

  async get(id: string): Promise<ProductCategory> {
    return fetchAPI<ProductCategory>(`/entities/ProductCategory/${id}`);
  },

  async getBySlug(slug: string): Promise<ProductCategory | null> {
    const { records } = await fetchAPI<CategoriesResponse>(
      `/entities/ProductCategory?q=${JSON.stringify({ slug })}`
    );
    return records[0] || null;
  },

  async create(data: Partial<ProductCategory>): Promise<ProductCategory> {
    return fetchAPI<ProductCategory>('/entities/ProductCategory', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<ProductCategory>): Promise<ProductCategory> {
    return fetchAPI<ProductCategory>(`/entities/ProductCategory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
