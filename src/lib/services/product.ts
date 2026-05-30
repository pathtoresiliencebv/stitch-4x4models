import { base44Fetch, base44List } from "@/lib/base44-api";
import type { Product, ProductCategory, ProductListParams } from '@/types/product';

interface ProductsResponse {
  records: Product[];
  total: number;
}

// Product Service - Products are BlogPost entities with is_product: true.
export const productService = {
  async list(params: ProductListParams = {}): Promise<ProductsResponse> {
    const filter: Record<string, unknown> = { is_product: true };
    if (params.status) filter.status = params.status;
    if (params.category_id) filter.category_id = params.category_id;

    return base44List<Product>("BlogPost", {
      q: filter,
      limit: params.limit,
      skip: params.skip,
      sort_by: params.sort_by,
    });
  },

  async listPublished(params: ProductListParams = {}): Promise<ProductsResponse> {
    const active = await this.list({ ...params, status: "active" });
    if (active.records.length > 0) return active;
    return this.list({ ...params, status: "published" });
  },

  async get(id: string): Promise<Product> {
    return base44Fetch<Product>(`/entities/BlogPost/${id}`);
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const { records } = await base44List<Product>("BlogPost", {
      q: { slug, is_product: true },
      limit: 1,
    });
    return records[0] || null;
  },

  async create(data: Partial<Product>): Promise<Product> {
    return base44Fetch<Product>('/entities/BlogPost', {
      method: 'POST',
      body: JSON.stringify({ ...data, is_product: true, status: 'active' }),
    });
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    return base44Fetch<Product>(`/entities/BlogPost/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return base44Fetch<void>(`/entities/BlogPost/${id}`, { method: 'DELETE' });
  },
};

// Category Service
export const categoryService = {
  async list(): Promise<ProductCategory[]> {
    const { records } = await base44List<ProductCategory>("ProductCategory", {
      q: { status: "published" },
      sort_by: "sort_order",
    });
    return records;
  },

  async get(id: string): Promise<ProductCategory> {
    return base44Fetch<ProductCategory>(`/entities/ProductCategory/${id}`);
  },

  async getBySlug(slug: string): Promise<ProductCategory | null> {
    const { records } = await base44List<ProductCategory>("ProductCategory", {
      q: { slug },
      limit: 1,
    });
    return records[0] || null;
  },

  async create(data: Partial<ProductCategory>): Promise<ProductCategory> {
    return base44Fetch<ProductCategory>('/entities/ProductCategory', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<ProductCategory>): Promise<ProductCategory> {
    return base44Fetch<ProductCategory>(`/entities/ProductCategory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
