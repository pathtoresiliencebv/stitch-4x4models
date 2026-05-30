import CheckoutClient, { type CheckoutLabels } from "@/components/commerce/CheckoutClient";
import { contentText } from "@/lib/content";
import { isLocale } from "@/lib/locale";
import { siteContentService } from "@/lib/services/site-content";
import type { Locale } from "@/types/common";

const label = (locale: Locale, en: string, nl: string) => (locale === "nl" ? nl : en);

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
      label(locale, "Review your order and complete the demo checkout.", "Controleer je order en rond de demo checkout af.")
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
