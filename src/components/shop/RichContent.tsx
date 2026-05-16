export function RichContent({ html, className = "" }: { html?: string; className?: string }) {
  if (!html) return null;

  return (
    <div
      className={`prose prose-invert max-w-none prose-headings:font-headline prose-a:text-primary prose-strong:text-on-surface ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
