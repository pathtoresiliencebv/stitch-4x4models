import { fetchAPI } from './api-config';
import type { Product, ProductCategory, ProductListParams } from '@/types/product';

interface ProductsResponse {
  records: Product[];
  total: number;
}

interface CategoriesResponse {
  records: ProductCategory[];
}

// Product Service
export const productService = {
  async list(params: ProductListParams = {}): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();

    if (params.category_id) searchParams.set('q', JSON.stringify({ category_id: params.category_id }));
    if (params.status) searchParams.set('q', JSON.stringify({ status: params.status, is_product: true }));
    else searchParams.set('q', JSON.stringify({ is_product: true }));
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.skip) searchParams.set('skip', params.skip.toString());
    if (params.sort_by) searchParams.set('sort_by', params.sort_by);

    return fetchAPI<ProductsResponse>(`/entities/Product?${searchParams}`);
  },

  async get(id: string): Promise<Product> {
    return fetchAPI<Product>(`/entities/Product/${id}`);
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const { records } = await fetchAPI<ProductsResponse>(
      `/entities/Product?q=${JSON.stringify({ slug, is_product: true })}`
    );
    return records[0] || null;
  },

  async create(data: Partial<Product>): Promise<Product> {
    return fetchAPI<Product>('/entities/Product', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    return fetchAPI<Product>(`/entities/Product/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return fetchAPI<void>(`/entities/Product/${id}`, { method: 'DELETE' });
  },
};

// Category Service
export const categoryService = {
  async list(): Promise<ProductCategory[]> {
    const { records } = await fetchAPI<CategoriesResponse>('/entities/ProductCategory');
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
