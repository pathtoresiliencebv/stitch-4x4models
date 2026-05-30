import Image from "next/image";
import { notFound } from "next/navigation";
import { contentText } from "@/lib/content";
import { isLocale } from "@/lib/locale";
import { blogService } from "@/lib/services/blog";
import { siteContentService } from "@/lib/services/site-content";
import type { Locale } from "@/types/common";

export default async function JournalDetailPage({
  params,
}: PageProps<"/[lang]/journal/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const [article, content] = await Promise.all([
    blogService.getBySlug(slug),
    siteContentService.getPage("journal-detail", locale),
  ]);
  if (!article) notFound();

  return (
    <article className="bg-noise">
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
          <p className="text-xl text-tertiary">{article.excerpt}</p>
        </div>
      </section>
      <section className="bg-surface py-16">
        <div
          className="prose prose-invert mx-auto max-w-4xl px-6 text-on-surface-variant prose-headings:font-headline prose-headings:uppercase prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: article.content || `<p>${article.excerpt || ""}</p>` }}
        />
      </section>
    </article>
  );
}
