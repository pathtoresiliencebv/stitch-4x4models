import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { RichContent } from "@/components/shop/RichContent";
import { formatDate } from "@/lib/format";
import { getBlogPostBySlug, getLatestBlogPosts } from "@/lib/base44-data";
import { breadcrumbsJsonLd, metadataFromContent } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getLatestBlogPosts(500);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return metadataFromContent(post, `/blog/${post.slug}`);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-4xl px-6 py-10">
      <Breadcrumbs items={[{ label: "Journal", href: "/blog" }, { label: post.title }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.meta_description,
              image: post.featured_image_url,
              datePublished: post.created_date,
              author: { "@type": "Organization", name: "4x4 Models" },
            },
            breadcrumbsJsonLd([
              { name: "Home", path: "/" },
              { name: "Journal", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ]),
        }}
      />
      <p className="mt-8 text-sm font-bold uppercase tracking-[0.25em] text-primary">{formatDate(post.created_date)}</p>
      <h1 className="mt-3 font-headline text-4xl font-bold uppercase md:text-6xl">{post.title}</h1>
      {post.featured_image_url ? (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-lg">
          <Image src={post.featured_image_url} alt={post.title} fill priority className="object-cover" />
        </div>
      ) : null}
      <RichContent html={post.content} className="mt-10" />
    </article>
  );
}
