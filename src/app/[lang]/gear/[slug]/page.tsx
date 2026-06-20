import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichContent } from "@/components/shop/RichContent";
import { isLocale, localizedPath } from "@/lib/locale";
import { categoryService, productService } from "@/lib/services/product";
import { breadcrumbsJsonLd, collectionPageJsonLd, faqJsonLd, itemListJsonLd, jsonLd, pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types/common";

type FaqItem = { question?: string; answer?: string };

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/gear/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? (lang as Locale) : "en";
  const category = await categoryService.getBySlug(slug);

  return pageMetadata({
    locale,
    path: `/gear/${slug}`,
    title: category?.seo_title || category?.name || (locale === "nl" ? "Gear collectie" : "Gear collection"),
    description: category?.meta_description || category?.description,
    image: category?.featured_image_url,
  });
}

export default async function GearCategoryPage({
  params,
}: PageProps<"/[lang]/gear/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const category = await categoryService.getBySlug(slug);
  if (!category || category.status === "draft") notFound();

  const products = (await productService.listPublished({ category_id: category.id, limit: 100 })).records;
  const faqItems = ((category as { faq_items?: FaqItem[] }).faq_items || []).filter((item) => item.question && item.answer);
  const pagePath = `/${locale}/gear/${category.slug}`;

  return (
    <main className="bg-noise">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            collectionPageJsonLd({ name: category.name, description: category.meta_description || category.description, path: pagePath }),
            breadcrumbsJsonLd([
              { name: "4x4models", path: `/${locale}` },
              { name: "Gear", path: `/${locale}/gear` },
              { name: category.name, path: pagePath },
            ]),
            itemListJsonLd(products.map((product) => ({
              name: product.title || product.slug || "4x4 gear",
              path: `/${locale}/shop/${product.slug}`,
              image: product.featured_image_url,
            }))),
            faqJsonLd(faqItems),
          ].filter(Boolean)),
        }}
      />

      <section className="relative overflow-hidden bg-surface-container-lowest">
        {category.featured_image_url ? (
          <Image src={category.featured_image_url} alt={category.name} fill priority unoptimized className="object-cover opacity-35" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/85 to-surface/45" />
        <div className="relative mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:py-20">
          <Link href={localizedPath(locale, "/gear")} className="premium-kicker mb-5 inline-block hover:text-secondary">
            {locale === "nl" ? "Gear overzicht" : "Gear overview"}
          </Link>
          <h1 className="max-w-4xl font-headline text-5xl font-bold uppercase leading-none text-on-surface sm:text-6xl">
            {category.name}
          </h1>
          {category.description || category.meta_description ? (
            <p className="mt-5 max-w-2xl text-lg text-tertiary">{category.description || category.meta_description}</p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-outline-variant/15 pb-5">
          <h2 className="font-headline text-2xl font-bold uppercase text-on-surface">
            {locale === "nl" ? "Producten" : "Products"}
          </h2>
          <span className="font-label text-xs uppercase tracking-widest text-primary">{products.length}</span>
        </div>

        {products.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product.id} href={localizedPath(locale, `/shop/${product.slug}`)} className="premium-panel group overflow-hidden">
                <span className="relative block aspect-[4/3] bg-surface-container-low">
                  {product.featured_image_url ? (
                    <Image src={product.featured_image_url} alt={product.featured_image_alt || product.title || ""} fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  ) : null}
                </span>
                <span className="block p-4">
                  <span className="premium-kicker mb-2 block">{product.vendor || product.product_type || category.name}</span>
                  <span className="font-headline text-lg font-bold uppercase text-on-surface">{product.title}</span>
                  {typeof (product.sale_price ?? product.price) === "number" ? (
                    <span className="mt-3 block font-label text-sm font-bold text-secondary">EUR {(product.sale_price ?? product.price)?.toFixed(2)}</span>
                  ) : null}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="premium-panel p-8 text-tertiary">
            {locale === "nl" ? "Nog geen producten in deze collectie." : "No products in this collection yet."}
          </div>
        )}
      </section>

      {category.content ? (
        <section className="mx-auto max-w-screen-lg px-4 pb-14 sm:px-6">
          <div className="premium-panel p-6 sm:p-8">
            <RichContent html={category.content} />
          </div>
        </section>
      ) : null}
    </main>
  );
}
