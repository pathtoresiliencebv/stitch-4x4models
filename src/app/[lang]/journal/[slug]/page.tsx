import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contentText } from "@/lib/content";
import { isLocale, localizedPath } from "@/lib/locale";
import { blogService } from "@/lib/services/blog";
import { productService } from "@/lib/services/product";
import { siteContentService } from "@/lib/services/site-content";
import { vehicleService } from "@/lib/services/vehicle";
import { articleJsonLd, breadcrumbsJsonLd, jsonLd, pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types/common";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/journal/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? (lang as Locale) : "en";
  const article = await blogService.getBySlug(slug, locale);

  return pageMetadata({
    locale,
    path: `/journal/${slug}`,
    title: article?.seo_title || article?.title || (locale === "nl" ? "Journal artikel" : "Journal article"),
    description: article?.meta_description || article?.excerpt,
    image: article?.featured_image_url,
    type: "article",
  });
}

export default async function JournalDetailPage({
  params,
}: PageProps<"/[lang]/journal/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const [article, content, relatedArticles, products, vehicles] = await Promise.all([
    blogService.getBySlug(slug, locale),
    siteContentService.getPage("journal-detail", locale),
    blogService.getLatest(4, locale),
    productService.listPublished({ limit: 100 }),
    vehicleService.list(100),
  ]);
  if (!article) notFound();
  const related = relatedArticles.filter((item) => item.slug !== article.slug).slice(0, 3);
  const relatedProducts = products.records.filter((item) => article.related_product_slugs?.includes(item.slug || "")).slice(0, 3);
  const relatedVehicles = vehicles.filter((item) => article.related_vehicle_slugs?.includes(item.slug || "")).slice(0, 3);
  const schemaPath = `/${locale}/journal/${article.slug}`;

  return (
    <article className="bg-noise">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            articleJsonLd(article, schemaPath),
            breadcrumbsJsonLd([
              { name: "4x4models", path: `/${locale}` },
              { name: "Journal", path: `/${locale}/journal` },
              { name: article.title || "Article", path: schemaPath },
            ]),
          ]),
        }}
      />
      <section className="relative flex min-h-[520px] items-end overflow-hidden bg-surface-container-lowest">
        {article.featured_image_url ? (
          <Image
            src={article.featured_image_url}
            alt={article.featured_image_alt || article.title || contentText(content, "hero", "image_alt", "Journal")}
            fill
            className="object-cover opacity-55"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-16">
          <span className="mb-4 inline-block font-label text-xs uppercase tracking-widest text-primary">
            {article.journal_category || contentText(content, "hero", "fallback_badge", "Journal")}
          </span>
          <h1 className="mb-5 font-headline text-5xl font-bold uppercase leading-tight text-on-surface">{article.title}</h1>
          <div className="mb-5 flex flex-wrap gap-3 font-label text-xs uppercase tracking-widest text-on-surface-variant">
            {article.author ? <span>{article.author}</span> : null}
            {article.read_time ? <span>{article.read_time}</span> : null}
            {article.published_at || article.created_date ? <span>{new Date(article.published_at || article.created_date || "").toLocaleDateString(locale)}</span> : null}
          </div>
          <p className="text-xl text-tertiary">{article.excerpt}</p>
        </div>
      </section>
      <section className="bg-surface py-16">
        <div
          className="prose prose-invert mx-auto max-w-4xl px-6 text-on-surface-variant prose-headings:font-headline prose-headings:uppercase prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: article.content || `<p>${article.excerpt || ""}</p>` }}
        />
      </section>
      {(relatedVehicles.length || relatedProducts.length) ? (
        <section className="bg-surface py-14">
          <div className="mx-auto grid max-w-screen-xl gap-4 px-6 md:grid-cols-2">
            {relatedVehicles.length ? (
              <div className="premium-panel p-5">
                <h2 className="mb-5 font-headline text-2xl font-bold uppercase text-on-surface">
                  {locale === "nl" ? "Modellen in dit artikel" : "Models in this article"}
                </h2>
                <div className="grid gap-3">
                  {relatedVehicles.map((vehicle) => (
                    <Link key={vehicle.id} href={localizedPath(locale, `/vehicles/${vehicle.slug}`)} className="flex items-center justify-between border border-outline-variant/10 bg-surface-container-low p-4 hover:border-primary/40">
                      <span className="font-headline font-bold uppercase text-on-surface">{vehicle.name}</span>
                      <span className="premium-kicker">{vehicle.brand}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
            {relatedProducts.length ? (
              <div className="premium-panel p-5">
                <h2 className="mb-5 font-headline text-2xl font-bold uppercase text-on-surface">
                  {locale === "nl" ? "Gear in dit artikel" : "Gear in this article"}
                </h2>
                <div className="grid gap-3">
                  {relatedProducts.map((product) => (
                    <Link key={product.id} href={localizedPath(locale, `/shop/${product.slug}`)} className="border border-outline-variant/10 bg-surface-container-low p-4 hover:border-primary/40">
                      <span className="premium-kicker mb-2 block">{product.product_type || "Gear"}</span>
                      <span className="font-headline font-bold uppercase text-on-surface">{product.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
      {related.length ? (
        <section className="bg-surface-container-low py-14">
          <div className="mx-auto max-w-screen-xl px-6">
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-outline-variant/20 pb-5">
              <h2 className="font-headline text-2xl font-bold uppercase text-on-surface">
                {locale === "nl" ? "Verder lezen" : "Related reading"}
              </h2>
              <Link href={localizedPath(locale, "/journal")} className="font-label text-xs uppercase tracking-widest text-secondary hover:text-primary">
                {locale === "nl" ? "Alle artikelen" : "All articles"}
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.id} href={localizedPath(locale, `/journal/${item.slug}`)} className="premium-panel p-5 hover:border-primary/40">
                  <span className="premium-kicker mb-3 block">{item.journal_category || "Journal"}</span>
                  <span className="font-headline text-lg font-bold uppercase text-on-surface">{item.title}</span>
                  <span className="mt-3 line-clamp-2 block text-sm text-tertiary">{item.excerpt}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
