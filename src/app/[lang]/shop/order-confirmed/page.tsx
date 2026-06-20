import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle } from "lucide-react";
import { contentText } from "@/lib/content";
import { isLocale } from "@/lib/locale";
import { siteContentService } from "@/lib/services/site-content";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types/common";

const label = (locale: Locale, en: string, nl: string) => (locale === "nl" ? nl : en);

export async function generateMetadata({ params }: PageProps<"/[lang]/shop/order-confirmed">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? (lang as Locale) : "en";
  const content = await siteContentService.getPage("order-confirmed", locale);

  return pageMetadata({
    locale,
    path: "/shop/order-confirmed",
    title: contentText(content, "seo", "title", label(locale, "Order confirmed", "Bestelling bevestigd")),
    description: contentText(content, "seo", "description", label(locale, "Your order confirmation.", "Je orderbevestiging.")),
  });
}

export default async function OrderConfirmedPage({
  params,
}: PageProps<"/[lang]/shop/order-confirmed">) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;

  const locale = lang as Locale;
  const content = await siteContentService.getPage("order-confirmed", locale);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-noise px-4 py-14 sm:px-6">
      <div className="max-w-xl border border-outline-variant/20 bg-surface-container-low/80 p-8 text-center sm:p-10">
        <CheckCircle className="mx-auto mb-6 h-16 w-16 text-primary sm:h-20 sm:w-20" />
        <h1 className="mb-4 font-headline text-4xl font-bold uppercase text-on-surface sm:text-5xl">
          {contentText(content, "hero", "title", label(locale, "Order confirmed", "Bestelling bevestigd"))}
        </h1>
        <p className="mb-8 text-tertiary">
          {contentText(
            content,
            "hero",
            "body",
            label(locale, "Your order is saved and ready for follow-up.", "Je order is opgeslagen en klaar voor opvolging.")
          )}
        </p>
        <Link
          href={`/${locale}/gear`}
          className="btn-primary-glow inline-flex rounded-sm px-8 py-4 font-headline text-sm font-bold uppercase tracking-widest text-on-primary"
        >
          {contentText(content, "hero", "cta", label(locale, "Continue shopping", "Verder winkelen"))}
        </Link>
      </div>
    </div>
  );
}
