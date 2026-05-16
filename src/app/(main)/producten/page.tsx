import { ProductCard } from "@/components/shop/ProductCard";
import { getCategories, getProducts, getProductsByCategory, getProductsByTag, getTags } from "@/lib/base44-data";
import Link from "next/link";

export const revalidate = 60;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; tag?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);
  const category = categories.find((item) => item.slug === params.categorie);
  const tag = tags.find((item) => item.slug === params.tag);
  const sort = params.sort === "prijs-oplopend" ? "price" : params.sort === "prijs-aflopend" ? "-price" : "-created_date";
  const products = category
    ? await getProductsByCategory(category.id)
    : tag
      ? await getProductsByTag(tag.name)
      : await getProducts(48, 0, sort);

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-14">
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Shop</p>
        <h1 className="mt-3 font-headline text-4xl font-bold uppercase md:text-5xl">
          {category?.name || tag?.name || "Products"}
        </h1>
      </div>

      <div className="mb-8 flex flex-wrap gap-3 text-sm">
        <Link href="/producten" className="rounded-full border border-outline-variant px-4 py-2">All</Link>
        {categories.map((item) => (
          <Link key={item.id} href={`/producten?categorie=${item.slug}`} className="rounded-full border border-outline-variant px-4 py-2">
            {item.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}
