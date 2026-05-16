import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories, getLatestBlogPosts, getProducts, getWebshop } from "@/lib/base44-data";
import { ProductCard } from "@/components/shop/ProductCard";
import { formatDate } from "@/lib/format";

export const revalidate = 60;

export default async function HomePage() {
  const [webshop, products, categories, posts] = await Promise.all([
    getWebshop(),
    getProducts(8),
    getCategories(),
    getLatestBlogPosts(3),
  ]);
  const hero = products[0];
  const heroImage = hero?.featured_image_url || hero?.product_images?.[0]?.url || webshop?.logo_url;

  return (
    <div className="bg-noise">
      <section className="relative min-h-[76vh] overflow-hidden">
        {heroImage ? (
          <Image src={heroImage} alt={hero?.title || webshop?.name || "4x4 Models"} fill priority className="object-cover opacity-50" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-surface/20" />
        <div className="relative mx-auto flex min-h-[76vh] max-w-screen-2xl flex-col justify-center px-6 py-20">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-primary">{webshop?.name || "4x4 Models"}</p>
          <h1 className="max-w-4xl font-headline text-5xl font-bold uppercase leading-none tracking-tight md:text-7xl">
            {webshop?.description || "Premium 4x4 gear and field-tested stories"}
          </h1>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/producten" className="rounded-md bg-primary px-6 py-4 font-bold uppercase text-on-primary">
              Shop products
            </Link>
            <Link href="/blog" className="rounded-md border border-outline-variant px-6 py-4 font-bold uppercase text-on-surface">
              Read journal
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <h2 className="font-headline text-3xl font-bold uppercase">Featured products</h2>
            <p className="mt-2 text-on-surface-variant">Loaded directly from Base44.</p>
          </div>
          <Link href="/producten" className="hidden items-center gap-2 text-sm font-bold uppercase text-secondary sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="bg-surface-container-low px-6 py-16">
        <div className="mx-auto max-w-screen-2xl">
          <h2 className="font-headline text-3xl font-bold uppercase">Collections</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {categories.slice(0, 6).map((category) => (
              <Link key={category.id} href={`/collecties/${category.slug}`} className="rounded-lg border border-surface-container-high p-6 transition hover:border-primary">
                <h3 className="font-headline text-xl font-bold">{category.name}</h3>
                {category.description ? <p className="mt-2 text-sm text-on-surface-variant">{category.description}</p> : null}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-6 py-20">
        <h2 className="font-headline text-3xl font-bold uppercase">Latest journal</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block rounded-lg border border-surface-container-high bg-surface-container-low p-5">
              {post.featured_image_url ? (
                <div className="relative mb-5 aspect-video overflow-hidden rounded-md">
                  <Image src={post.featured_image_url} alt={post.title} fill className="object-cover transition group-hover:scale-105" />
                </div>
              ) : null}
              <p className="text-xs uppercase tracking-wider text-primary">{formatDate(post.created_date)}</p>
              <h3 className="mt-2 font-headline text-xl font-bold">{post.title}</h3>
              {post.meta_description ? <p className="mt-2 text-sm text-on-surface-variant">{post.meta_description}</p> : null}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
