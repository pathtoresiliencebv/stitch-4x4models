import { unstable_cache } from "next/cache";
import "server-only";
import { base44List } from "@/lib/base44-api";
import type {
  BlogPost,
  ProductCategory,
  ProductTag,
  ProductVariant,
  WebsitePage,
  Webshop,
} from "@/types/base44";

export const webshopId = process.env.NEXT_PUBLIC_WEBSHOP_ID;

function withWebshop<T extends Record<string, unknown>>(query: T) {
  return webshopId ? { ...query, webshop_id: webshopId } : query;
}

async function safeBase44<T>(loader: () => Promise<T>, fallback: T) {
  try {
    return await loader();
  } catch (error) {
    console.warn("Base44 public read failed", error);
    return fallback;
  }
}

async function firstRecord<T>(
  entity: string,
  q: Record<string, unknown>,
  sort_by = "-created_date"
) {
  const { records } = await base44List<T>(entity, { q, sort_by, limit: 1 });
  return records[0];
}

export const getWebshop = unstable_cache(
  async () => {
    return safeBase44(async () => {
      if (webshopId) {
        return firstRecord<Webshop>("Webshop", { id: webshopId });
      }

      return firstRecord<Webshop>("Webshop", { status: "actief" });
    }, undefined);
  },
  ["webshop"],
  { revalidate: 60 }
);

export const getProducts = unstable_cache(
  async (limit = 24, skip = 0, sort: string = "-created_date") => {
    return safeBase44(
      async () =>
        (await base44List<BlogPost>("BlogPost", {
          q: withWebshop({ is_product: true, status: "active" }),
          sort_by: sort,
          limit,
          skip,
        })).records,
      []
    );
  },
  ["products"],
  { revalidate: 60 }
);

export async function getProductBySlug(slug: string) {
  return safeBase44(
    () => firstRecord<BlogPost>("BlogPost", withWebshop({ slug, is_product: true, status: "active" })),
    undefined
  );
}

export async function getProductVariants(productId: string) {
  return safeBase44(
    async () =>
      (await base44List<ProductVariant>("ProductVariant", {
        q: { product_id: productId },
        sort_by: "position",
        limit: 100,
      })).records,
    []
  );
}

export const getCategories = unstable_cache(
  async () => {
    return safeBase44(
      async () =>
        (await base44List<ProductCategory>("ProductCategory", {
          q: withWebshop({ status: "published" }),
          sort_by: "name",
          limit: 100,
        })).records,
      []
    );
  },
  ["categories"],
  { revalidate: 60 }
);

export async function getCategoryBySlug(slug: string) {
  return safeBase44(
    () => firstRecord<ProductCategory>("ProductCategory", withWebshop({ slug, status: "published" }), "name"),
    undefined
  );
}

export async function getProductsByCategory(categoryId: string, limit = 48) {
  return safeBase44(
    async () =>
      (await base44List<BlogPost>("BlogPost", {
        q: withWebshop({ is_product: true, status: "active", category_id: categoryId }),
        sort_by: "-created_date",
        limit,
      })).records,
    []
  );
}

export const getTags = unstable_cache(
  async () => {
    return safeBase44(
      async () =>
        (await base44List<ProductTag>("ProductTag", {
          q: { status: "active" },
          sort_by: "name",
          limit: 100,
        })).records,
      []
    );
  },
  ["tags"],
  { revalidate: 60 }
);

export async function getTagBySlug(slug: string) {
  return safeBase44(
    () => firstRecord<ProductTag>("ProductTag", { slug, status: "active" }, "name"),
    undefined
  );
}

export async function getProductsByTag(tagName: string, limit = 48) {
  const products = await getProducts(200);
  return products.filter((product) => product.tags?.includes(tagName)).slice(0, limit);
}

export const getLatestBlogPosts = unstable_cache(
  async (limit = 3) => {
    return safeBase44(
      async () =>
        (await base44List<BlogPost>("BlogPost", {
          q: withWebshop({ is_product: false, status: "published" }),
          sort_by: "-created_date",
          limit,
        })).records,
      []
    );
  },
  ["latest-blog-posts"],
  { revalidate: 60 }
);

export async function getBlogPostBySlug(slug: string) {
  return safeBase44(
    () => firstRecord<BlogPost>("BlogPost", withWebshop({ slug, is_product: false, status: "published" })),
    undefined
  );
}

export async function getWebsitePageBySlug(slug: string) {
  return safeBase44(
    () => firstRecord<WebsitePage>("WebsitePage", withWebshop({ slug, status: "published" })),
    undefined
  );
}
