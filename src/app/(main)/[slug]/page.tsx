import { notFound } from "next/navigation";
import { RichContent } from "@/components/shop/RichContent";
import { getBlogPostBySlug, getWebsitePageBySlug } from "@/lib/base44-data";
import { metadataFromContent } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getWebsitePageBySlug(slug);
  if (page) return metadataFromContent(page, `/${page.slug}`);
  const post = await getBlogPostBySlug(slug);
  if (post) return metadataFromContent(post, `/${post.slug}`);
  return {};
}

export default async function RootSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getWebsitePageBySlug(slug);
  const content = page || await getBlogPostBySlug(slug);
  if (!content) notFound();

  return (
    <article className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="font-headline text-4xl font-bold uppercase md:text-5xl">{content.title}</h1>
      <RichContent html={content.content} className="mt-8" />
    </article>
  );
}
