import { notFound } from "next/navigation";
import { ProductCard } from "@/components/shop/ProductCard";
import { SeoBlock } from "@/components/shop/SeoBlock";
import { getProductsByTag, getTagBySlug, getTags } from "@/lib/base44-data";
import { metadataFromContent } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) return {};
  return metadataFromContent(tag, `/tags/${tag.slug}`);
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();
  const products = await getProductsByTag(tag.name);

  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-6 py-14">
        <h1 className="font-headline text-4xl font-bold uppercase md:text-5xl">{tag.name}</h1>
        {tag.description ? <p className="mt-4 max-w-3xl text-on-surface-variant">{tag.description}</p> : null}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
      <SeoBlock title={tag.name} html={tag.content} />
    </>
  );
}
