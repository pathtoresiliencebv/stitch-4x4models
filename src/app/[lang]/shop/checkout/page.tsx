import type { Metadata } from "next";
import CheckoutClient, { type CheckoutLabels } from "@/components/commerce/CheckoutClient";
import { contentText } from "@/lib/content";
import { isLocale } from "@/lib/locale";
import { siteContentService } from "@/lib/services/site-content";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types/common";

const label = (locale: Locale, en: string, nl: string) => (locale === "nl" ? nl : en);

export async function generateMetadata({ params }: PageProps<"/[lang]/shop/checkout">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? (lang as Locale) : "en";
  const content = await siteContentService.getPage("checkout", locale);

  return pageMetadata({
    locale,
    path: "/shop/checkout",
    title: contentText(content, "seo", "title", label(locale, "Secure checkout", "Veilig afrekenen")),
    description: contentText(content, "seo", "description", label(locale, "Complete your 4x4 gear order.", "Rond je 4x4 gear bestelling af.")),
  });
}

export default async function CheckoutPage({ params }: PageProps<"/[lang]/shop/checkout">) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;

  const locale = lang as Locale;
  const content = await siteContentService.getPage("checkout", locale);
  const labels: CheckoutLabels = {
    title: contentText(content, "hero", "title", label(locale, "Secure checkout", "Veilig afrekenen")),
    intro: contentText(
      content,
      "hero",
      "intro",
      label(locale, "Review your order and pay securely online.", "Controleer je order en betaal veilig online.")
    ),
    contactTitle: contentText(content, "form", "title", label(locale, "Contact and delivery", "Contact en levering")),
    orderSummary: contentText(content, "summary", "title", label(locale, "Order summary", "Orderoverzicht")),
    subtotal: contentText(content, "summary", "subtotal", "Subtotal"),
    shipping: contentText(content, "summary", "shipping", "Shipping"),
    tax: contentText(content, "summary", "tax", "Tax"),
    total: contentText(content, "summary", "total", "Total"),
    free: contentText(content, "summary", "free", label(locale, "Free", "Gratis")),
    complete: contentText(content, "summary", "complete", label(locale, "Complete purchase", "Bestelling afronden")),
    fields: [
      contentText(content, "fields", "email", "Email"),
      contentText(content, "fields", "first_name", label(locale, "First name", "Voornaam")),
      contentText(content, "fields", "last_name", label(locale, "Last name", "Achternaam")),
      contentText(content, "fields", "street", label(locale, "Street address", "Straat en huisnummer")),
      contentText(content, "fields", "city", "City"),
      contentText(content, "fields", "postal_code", label(locale, "Postal code", "Postcode")),
      contentText(content, "fields", "country", "Country"),
    ],
  };

  return <CheckoutClient lang={locale} labels={labels} />;
}
