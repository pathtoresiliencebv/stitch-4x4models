import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichContent } from "@/components/shop/RichContent";
import { isLocale, localizedPath, locales } from "@/lib/locale";
import { productService, tagService } from "@/lib/services/product";
import { breadcrumbsJsonLd, collectionPageJsonLd, itemListJsonLd, jsonLd, pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types/common";

export async function generateStaticParams() {
  const tags = await tagService.list().catch(() => []);
  return locales.flatMap((lang) => tags.map((tag) => ({ lang, slug: tag.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/tags/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? (lang as Locale) : "en";
  const tag = await tagService.getBySlug(slug);

  return pageMetadata({
    locale,
    path: `/tags/${slug}`,
    title: tag?.name ? `${tag.name} 4x4 gear` : locale === "nl" ? "4x4 tag" : "4x4 tag",
    description: tag?.meta_description || tag?.description,
    image: tag?.featured_image_url,
  });
}

export default async function TagPage({ params }: PageProps<"/[lang]/tags/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const tag = await tagService.getBySlug(slug);
  if (!tag) notFound();

  const products = await productService.listPublished({ limit: 500 });
  const taggedProducts = products.records.filter((product) =>
    product.tags?.some((item) => item.toLowerCase() === tag.name.toLowerCase())
  );
  const pagePath = `/${locale}/tags/${tag.slug}`;

  return (
    <main className="bg-noise">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            collectionPageJsonLd({ name: tag.name, description: tag.meta_description || tag.description, path: pagePath }),
            breadcrumbsJsonLd([
              { name: "4x4models", path: `/${locale}` },
              { name: locale === "nl" ? "Tags" : "Tags", path: `/${locale}/gear` },
              { name: tag.name, path: pagePath },
            ]),
            itemListJsonLd(taggedProducts.map((product) => ({
              name: product.title || product.slug || tag.name,
              path: `/${locale}/shop/${product.slug}`,
              image: product.featured_image_url,
            }))),
          ]),
        }}
      />

      <section className="relative overflow-hidden bg-surface-container-lowest">
        {tag.featured_image_url ? (
          <Image src={tag.featured_image_url} alt={tag.name} fill priority unoptimized className="object-cover opacity-30" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/90 to-surface/55" />
        <div className="relative mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 sm:py-16">
          <Link href={localizedPath(locale, "/gear")} className="premium-kicker mb-4 inline-block hover:text-secondary">
            {locale === "nl" ? "Gear overzicht" : "Gear overview"}
          </Link>
          <h1 className="max-w-4xl font-headline text-4xl font-bold uppercase leading-none text-on-surface sm:text-6xl">
            {tag.name}
          </h1>
          {tag.description || tag.meta_description ? (
            <p className="mt-4 max-w-2xl text-base leading-7 text-tertiary sm:text-lg">
              {tag.description || tag.meta_description}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-5 flex items-end justify-between gap-4 border-b border-outline-variant/15 pb-4">
          <h2 className="font-headline text-2xl font-bold uppercase text-on-surface">
            {locale === "nl" ? "Gear met deze tag" : "Gear with this tag"}
          </h2>
          <span className="font-label text-xs uppercase tracking-widest text-primary">{taggedProducts.length}</span>
        </div>

        {taggedProducts.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {taggedProducts.map((product) => (
              <Link key={product.id} href={localizedPath(locale, `/shop/${product.slug}`)} className="premium-panel group overflow-hidden">
                <span className="relative block aspect-[4/3] bg-surface-container-low">
                  {product.featured_image_url ? (
                    <Image src={product.featured_image_url} alt={product.featured_image_alt || product.title || ""} fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  ) : null}
                </span>
                <span className="block p-3 sm:p-4">
                  <span className="premium-kicker mb-2 block">{product.vendor || product.product_type || tag.name}</span>
                  <span className="line-clamp-2 font-headline text-sm font-bold uppercase leading-tight text-on-surface sm:text-lg">{product.title}</span>
                  {typeof (product.sale_price ?? product.price) === "number" ? (
                    <span className="mt-3 block font-label text-xs font-bold text-secondary sm:text-sm">EUR {(product.sale_price ?? product.price)?.toFixed(2)}</span>
                  ) : null}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="premium-panel p-6 text-sm text-tertiary sm:p-8">
            {locale === "nl" ? "Nog geen producten met deze tag." : "No products with this tag yet."}
          </div>
        )}
      </section>

      {tag.content ? (
        <section className="mx-auto max-w-screen-lg px-4 pb-12 sm:px-6 sm:pb-16">
          <div className="premium-panel p-5 sm:p-8">
            <RichContent html={tag.content} />
          </div>
        </section>
      ) : null}
    </main>
  );
}
