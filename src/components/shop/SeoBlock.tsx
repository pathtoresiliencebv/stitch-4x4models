import { RichContent } from "@/components/shop/RichContent";

export function SeoBlock({ title, html }: { title?: string; html?: string }) {
  if (!html) return null;

  return (
    <section className="border-t border-surface-container-high bg-surface-container-low px-6 py-14">
      <div className="mx-auto max-w-4xl">
        {title ? <h2 className="mb-6 font-headline text-2xl font-bold">{title}</h2> : null}
        <RichContent html={html} />
      </div>
    </section>
  );
}
