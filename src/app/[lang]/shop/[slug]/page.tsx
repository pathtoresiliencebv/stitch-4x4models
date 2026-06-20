import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import AddToCartButton from "@/components/commerce/AddToCartButton";
import { RichContent } from "@/components/shop/RichContent";
import { isLocale, localizedPath } from "@/lib/locale";
import { productService } from "@/lib/services/product";
import { breadcrumbsJsonLd, faqJsonLd, jsonLd, pageMetadata, productJsonLd } from "@/lib/seo";
import type { Locale } from "@/types/common";

type FaqItem = { question?: string; answer?: string };

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/shop/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? (lang as Locale) : "en";
  const product = await productService.getBySlug(slug);

  return pageMetadata({
    locale,
    path: `/shop/${slug}`,
    title: product?.seo_title || product?.title || (locale === "nl" ? "Product" : "Product"),
    description: product?.meta_description || product?.excerpt,
    image: product?.featured_image_url,
  });
}

export default async function LocalizedProductPage({
  params,
}: PageProps<"/[lang]/shop/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const product = await productService.getBySlug(slug);
  if (!product) notFound();

  const relatedProducts = (await productService.listPublished({ limit: 5 })).records.filter((item) => item.slug !== product.slug);
  const images = (
    product.product_images?.length
      ? product.product_images
      : [{ url: product.featured_image_url || "", alt: product.featured_image_alt || product.title }]
  ).filter((image): image is { url: string; alt?: string } => Boolean(image.url));
  const leadImage = images[0];
  const price = product.sale_price ?? product.price;
  const comparePrice = product.sale_price ? product.price : undefined;
  const faqItems = ((product as { faq_items?: FaqItem[] }).faq_items || []).filter((item) => item.question && item.answer);
  const jsonLdItems = [
    productJsonLd(product, `/${locale}/shop/${product.slug}`, price, product.stock),
    breadcrumbsJsonLd([
      { name: "4x4models", path: `/${locale}` },
      { name: locale === "nl" ? "Gear" : "Gear", path: `/${locale}/gear` },
      { name: product.title || "Product", path: `/${locale}/shop/${product.slug}` },
    ]),
    faqJsonLd(faqItems),
  ].filter(Boolean);

  return (
    <div className="premium-section bg-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(jsonLdItems) }} />
      <section className="mx-auto grid max-w-screen-2xl gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)]">
        <div className="premium-panel overflow-hidden">
          {leadImage?.url ? (
            <div className="relative aspect-[4/3]">
              <Image src={leadImage.url} alt={leadImage.alt || product.title || ""} fill priority unoptimized className="premium-card-image object-cover" />
            </div>
          ) : (
            <div className="aspect-[4/3] bg-surface-container-low" />
          )}
          {images.length > 1 ? (
            <div className="grid grid-cols-4 gap-2 p-3">
              {images.slice(0, 4).map((image, index) => (
                <span
                  key={`${image.url}-${index}`}
                  className="relative block aspect-square w-full overflow-hidden border border-outline-variant/10"
                >
                  <Image src={image.url} alt={image.alt || product.title || ""} fill unoptimized className="object-cover" />
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="premium-panel self-start px-5 py-6 sm:px-7 lg:sticky lg:top-24">
          <p className="premium-kicker mb-4">{product.product_type || product.vendor || (locale === "nl" ? "Gear" : "Gear")}</p>
          <h1 className="premium-heading mb-5 font-headline text-4xl font-bold uppercase leading-tight text-on-surface sm:text-5xl">
            {product.title}
          </h1>
          {product.excerpt || product.meta_description ? (
            <p className="premium-copy mb-7 text-lg">{product.excerpt || product.meta_description}</p>
          ) : null}

          {typeof price === "number" ? (
            <div className="mb-7 flex items-end gap-3 border-y border-outline-variant/10 py-5">
              <span className="font-headline text-4xl font-bold text-on-surface">EUR {price.toFixed(2)}</span>
              {typeof comparePrice === "number" ? (
                <span className="pb-1 text-sm text-on-surface-variant line-through">EUR {comparePrice.toFixed(2)}</span>
              ) : null}
            </div>
          ) : null}

          <AddToCartButton product={product} />

          <div className="mt-7 grid grid-cols-3 gap-2 border-y border-outline-variant/10 py-4 text-center">
            {[
              locale === "nl" ? "Veilig afrekenen" : "Secure checkout",
              product.stock && product.stock > 0 ? (locale === "nl" ? "Op voorraad" : "In stock") : locale === "nl" ? "Voorraadstatus" : "Stock status",
              locale === "nl" ? "CMS beheerd" : "CMS managed",
            ].map((label) => (
              <span key={label} className="rounded-sm bg-surface-container-low px-2 py-3 font-label text-[10px] uppercase tracking-wider text-on-surface-variant">
                {label}
              </span>
            ))}
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {[
              ["SKU", product.sku],
              [locale === "nl" ? "Merk" : "Vendor", product.vendor],
              [locale === "nl" ? "Type" : "Type", product.product_type],
              [locale === "nl" ? "Voorraad" : "Stock", typeof product.stock === "number" ? String(product.stock) : undefined],
            ].filter((item): item is [string, string] => Boolean(item[1])).map(([label, value]) => (
              <div key={label} className="border border-outline-variant/10 bg-surface-container-low p-3">
                <dt className="font-label text-[10px] uppercase tracking-widest text-primary">{label}</dt>
                <dd className="mt-1 text-on-surface">{value}</dd>
              </div>
            ))}
          </dl>

          {product.tags?.length ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {product.tags.slice(0, 6).map((tag) => (
                <span key={tag} className="border border-outline-variant/15 bg-surface-container-low px-3 py-2 font-label text-xs uppercase text-on-surface-variant">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </aside>
      </section>

      {product.content ? (
        <section className="mx-auto max-w-screen-2xl px-4 pb-10 sm:px-6">
          <div className="premium-panel px-5 py-8 sm:px-8 lg:px-10">
            <RichContent html={product.content} />
          </div>
        </section>
      ) : null}

      {faqItems.length ? (
        <section className="mx-auto max-w-screen-2xl px-4 pb-10 sm:px-6">
          <div className="premium-panel px-5 py-8 sm:px-8">
            <h2 className="mb-6 font-headline text-2xl font-bold uppercase text-on-surface">FAQ</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {faqItems.map((item) => (
                <article key={item.question} className="border border-outline-variant/10 bg-surface-container-low p-4">
                  <h3 className="font-headline text-base font-bold uppercase text-on-surface">{item.question}</h3>
                  <p className="mt-2 text-sm text-tertiary">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedProducts.length ? (
        <section className="mx-auto max-w-screen-2xl px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="font-headline text-2xl font-bold uppercase text-on-surface">
              {locale === "nl" ? "Gerelateerde gear" : "Related gear"}
            </h2>
            <Link href={localizedPath(locale, "/gear")} className="font-label text-xs uppercase tracking-widest text-secondary hover:text-primary">
              {locale === "nl" ? "Alles bekijken" : "View all"}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.slice(0, 4).map((item) => (
              <Link key={item.id} href={localizedPath(locale, `/shop/${item.slug}`)} className="premium-panel group overflow-hidden">
                <span className="relative block aspect-[4/3] bg-surface-container-low">
                  {item.featured_image_url ? (
                    <Image src={item.featured_image_url} alt={item.featured_image_alt || item.title || ""} fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  ) : null}
                </span>
                <span className="block p-4">
                  <span className="premium-kicker mb-2 block">{item.product_type || "Gear"}</span>
                  <span className="font-headline text-lg font-bold uppercase text-on-surface">{item.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
