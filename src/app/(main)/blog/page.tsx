import Image from "next/image";
import Link from "next/link";
import { getLatestBlogPosts } from "@/lib/base44-data";
import { formatDate } from "@/lib/format";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getLatestBlogPosts(48);

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-14">
      <h1 className="font-headline text-4xl font-bold uppercase md:text-5xl">Journal</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-lg border border-surface-container-high bg-surface-container-low p-5">
            {post.featured_image_url ? (
              <div className="relative mb-5 aspect-video overflow-hidden rounded-md">
                <Image src={post.featured_image_url} alt={post.title} fill className="object-cover" />
              </div>
            ) : null}
            <p className="text-xs uppercase tracking-wider text-primary">{formatDate(post.created_date)}</p>
            <h2 className="mt-2 font-headline text-xl font-bold">{post.title}</h2>
            {post.meta_description ? <p className="mt-2 text-sm text-on-surface-variant">{post.meta_description}</p> : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
