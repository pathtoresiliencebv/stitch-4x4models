import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { ProductCard } from "@/components/shop/ProductCard";
import { SeoBlock } from "@/components/shop/SeoBlock";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/base44-data";
import { breadcrumbsJsonLd, metadataFromContent } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return metadataFromContent(category, `/collecties/${category.slug}`);
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const products = await getProductsByCategory(category.id);

  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-6 py-10">
        <Breadcrumbs items={[{ label: "Collections", href: "/collecties" }, { label: category.name }]} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsJsonLd([
              { name: "Home", path: "/" },
              { name: "Collections", path: "/collecties" },
              { name: category.name, path: `/collecties/${category.slug}` },
            ])),
          }}
        />
        <h1 className="mt-8 font-headline text-4xl font-bold uppercase md:text-5xl">{category.name}</h1>
        {category.description ? <p className="mt-4 max-w-3xl text-on-surface-variant">{category.description}</p> : null}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
      <SeoBlock title={category.focus_keyword || category.name} html={category.content} />
    </>
  );
}
