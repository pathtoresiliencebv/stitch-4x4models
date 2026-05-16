import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductPurchasePanel } from "@/components/shop/ProductPurchasePanel";
import { RichContent } from "@/components/shop/RichContent";
import { getProductBySlug, getProducts, getProductVariants } from "@/lib/base44-data";
import { breadcrumbsJsonLd, metadataFromContent, productJsonLd } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts(500);
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return metadataFromContent(product, `/producten/${product.slug}`);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const variants = await getProductVariants(product.id);
  const images = product.product_images?.length
    ? product.product_images
    : [{ url: product.featured_image_url || "", alt: product.title }].filter((image) => image.url);
  const price = variants[0]?.price ?? product.sale_price ?? product.price ?? 0;
  const stock = variants[0]?.stock ?? product.stock;

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-10">
      <Breadcrumbs items={[{ label: "Products", href: "/producten" }, { label: product.title }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            productJsonLd(product, `/producten/${product.slug}`, price, stock),
            breadcrumbsJsonLd([
              { name: "Home", path: "/" },
              { name: "Products", path: "/producten" },
              { name: product.title, path: `/producten/${product.slug}` },
            ]),
          ]),
        }}
      />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery images={images} title={product.title} />
        <ProductPurchasePanel product={product} variants={variants} />
      </div>
      <section className="mt-14 max-w-4xl">
        <RichContent html={product.content} />
      </section>
    </div>
  );
}
