import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "@/components/commerce/AddToCartButton";
import { RichContent } from "@/components/shop/RichContent";
import { isLocale } from "@/lib/locale";
import { productService } from "@/lib/services/product";
import type { Locale } from "@/types/common";

export default async function LocalizedProductPage({
  params,
}: PageProps<"/[lang]/shop/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const product = await productService.getBySlug(slug);
  if (!product) notFound();

  const images = (
    product.product_images?.length
      ? product.product_images
      : [{ url: product.featured_image_url || "", alt: product.featured_image_alt || product.title }]
  ).filter((image): image is { url: string; alt?: string } => Boolean(image.url));
  const leadImage = images[0];
  const price = product.sale_price ?? product.price;
  const comparePrice = product.sale_price ? product.price : undefined;

  return (
    <div className="premium-section bg-surface">
      <section className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.08fr_0.92fr]">
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

        <aside className="premium-panel self-start px-5 py-7 sm:px-8">
          <p className="premium-kicker mb-4">{product.product_type || product.vendor || (locale === "nl" ? "Gear" : "Gear")}</p>
          <h1 className="premium-heading mb-5 font-headline text-4xl font-bold uppercase leading-tight text-on-surface sm:text-5xl">
            {product.title}
          </h1>
          {product.excerpt || product.meta_description ? (
            <p className="premium-copy mb-7 text-lg">{product.excerpt || product.meta_description}</p>
          ) : null}

          {typeof price === "number" ? (
            <div className="mb-7 flex items-end gap-3 border-y border-outline-variant/10 py-5">
              <span className="font-headline text-4xl font-bold text-on-surface">€{price.toFixed(2)}</span>
              {typeof comparePrice === "number" ? (
                <span className="pb-1 text-sm text-on-surface-variant line-through">€{comparePrice.toFixed(2)}</span>
              ) : null}
            </div>
          ) : null}

          <AddToCartButton product={product} />

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
        <section className="mx-auto max-w-screen-2xl px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="premium-panel px-5 py-8 sm:px-8">
            <RichContent html={product.content} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
