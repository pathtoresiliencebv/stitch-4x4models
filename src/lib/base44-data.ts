import { unstable_cache } from "next/cache";
import { base44 } from "@/lib/base44";
import type {
  BlogPost,
  ProductCategory,
  ProductTag,
  ProductVariant,
  WebsitePage,
  Webshop,
} from "@/types/base44";

export const webshopId = process.env.NEXT_PUBLIC_WEBSHOP_ID;
const hasBase44App = Boolean(process.env.NEXT_PUBLIC_BASE44_APP_ID);

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

export const getWebshop = unstable_cache(
  async () => {
    if (!hasBase44App) return undefined;
    return safeBase44(async () => {
      if (webshopId) {
        const [webshop] = await base44.entities.Webshop.filter({ id: webshopId });
        return webshop as Webshop | undefined;
      }

      const [webshop] = await base44.entities.Webshop.filter({ status: "active" }, "-created_date", 1);
      return webshop as Webshop | undefined;
    }, undefined);
  },
  ["webshop"],
  { revalidate: 60 }
);

export const getProducts = unstable_cache(
  async (limit = 24, skip = 0, sort: string = "-created_date") => {
    if (!hasBase44App) return [];
    return safeBase44(
      async () =>
        (await base44.entities.BlogPost.filter(
          withWebshop({ is_product: true, status: "active" }),
          sort,
          limit,
          skip
        )) as BlogPost[],
      []
    );
  },
  ["products"],
  { revalidate: 60 }
);

export async function getProductBySlug(slug: string) {
  if (!hasBase44App) return undefined;
  return safeBase44(async () => {
    const [product] = (await base44.entities.BlogPost.filter(
      withWebshop({ slug, is_product: true, status: "active" }),
      "-created_date",
      1
    )) as BlogPost[];
    return product;
  }, undefined);
}

export async function getProductVariants(productId: string) {
  if (!hasBase44App) return [];
  return safeBase44(
    async () =>
      (await base44.entities.ProductVariant.filter(
        { product_id: productId },
        "position",
        100
      )) as ProductVariant[],
    []
  );
}

export const getCategories = unstable_cache(
  async () => {
    if (!hasBase44App) return [];
    return safeBase44(
      async () =>
        (await base44.entities.ProductCategory.filter(
          withWebshop({ status: "active" }),
          "name",
          100
        )) as ProductCategory[],
      []
    );
  },
  ["categories"],
  { revalidate: 60 }
);

export async function getCategoryBySlug(slug: string) {
  if (!hasBase44App) return undefined;
  return safeBase44(async () => {
    const [category] = (await base44.entities.ProductCategory.filter(
      withWebshop({ slug, status: "active" }),
      "name",
      1
    )) as ProductCategory[];
    return category;
  }, undefined);
}

export async function getProductsByCategory(categoryId: string, limit = 48) {
  if (!hasBase44App) return [];
  return safeBase44(
    async () =>
      (await base44.entities.BlogPost.filter(
        withWebshop({ is_product: true, status: "active", category_id: categoryId }),
        "-created_date",
        limit
      )) as BlogPost[],
    []
  );
}

export const getTags = unstable_cache(
  async () => {
    if (!hasBase44App) return [];
    return safeBase44(
      async () => (await base44.entities.ProductTag.filter({ status: "active" }, "name", 100)) as ProductTag[],
      []
    );
  },
  ["tags"],
  { revalidate: 60 }
);

export async function getTagBySlug(slug: string) {
  if (!hasBase44App) return undefined;
  return safeBase44(async () => {
    const [tag] = (await base44.entities.ProductTag.filter({ slug, status: "active" }, "name", 1)) as ProductTag[];
    return tag;
  }, undefined);
}

export async function getProductsByTag(tagName: string, limit = 48) {
  const products = await getProducts(200);
  return products.filter((product) => product.tags?.includes(tagName)).slice(0, limit);
}

export const getLatestBlogPosts = unstable_cache(
  async (limit = 3) => {
    if (!hasBase44App) return [];
    return safeBase44(
      async () =>
        (await base44.entities.BlogPost.filter(
          withWebshop({ is_product: false, status: "published" }),
          "-created_date",
          limit
        )) as BlogPost[],
      []
    );
  },
  ["latest-blog-posts"],
  { revalidate: 60 }
);

export async function getBlogPostBySlug(slug: string) {
  if (!hasBase44App) return undefined;
  return safeBase44(async () => {
    const [post] = (await base44.entities.BlogPost.filter(
      withWebshop({ slug, is_product: false, status: "published" }),
      "-created_date",
      1
    )) as BlogPost[];
    return post;
  }, undefined);
}

export async function getWebsitePageBySlug(slug: string) {
  if (!hasBase44App) return undefined;
  return safeBase44(async () => {
    const [page] = (await base44.entities.WebsitePage.filter(
      withWebshop({ slug, status: "active" }),
      "-created_date",
      1
    )) as WebsitePage[];
    return page;
  }, undefined);
}
