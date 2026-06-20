import type { Metadata } from "next";
import CartClient, { type CartLabels } from "@/components/commerce/CartClient";
import { contentText } from "@/lib/content";
import { isLocale } from "@/lib/locale";
import { siteContentService } from "@/lib/services/site-content";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types/common";

const label = (locale: Locale, en: string, nl: string) => (locale === "nl" ? nl : en);

export async function generateMetadata({ params }: PageProps<"/[lang]/shop/cart">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? (lang as Locale) : "en";
  const content = await siteContentService.getPage("cart", locale);

  return pageMetadata({
    locale,
    path: "/shop/cart",
    title: contentText(content, "seo", "title", label(locale, "Cart", "Winkelwagen")),
    description: contentText(content, "seo", "description", label(locale, "Review your selected 4x4 gear.", "Controleer je geselecteerde 4x4 gear.")),
  });
}

export default async function CartPage({ params }: PageProps<"/[lang]/shop/cart">) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;

  const locale = lang as Locale;
  const content = await siteContentService.getPage("cart", locale);
  const labels: CartLabels = {
    emptyTitle: contentText(content, "empty", "title", label(locale, "Your cart is empty", "Je winkelwagen is leeg")),
    emptyCta: contentText(content, "empty", "cta", label(locale, "Browse gear", "Bekijk gear")),
    title: contentText(content, "cart", "title", label(locale, "Your cart", "Je winkelwagen")),
    summary: contentText(content, "summary", "title", label(locale, "Order summary", "Orderoverzicht")),
    subtotal: contentText(content, "summary", "subtotal", "Subtotal"),
    shipping: contentText(content, "summary", "shipping", "Shipping"),
    free: contentText(content, "summary", "free", label(locale, "Free", "Gratis")),
    total: contentText(content, "summary", "total", "Total"),
    checkout: contentText(content, "summary", "checkout", label(locale, "Proceed to checkout", "Naar afrekenen")),
    removeItem: contentText(content, "actions", "remove_item", label(locale, "Remove item", "Verwijder item")),
    decreaseQuantity: contentText(content, "actions", "decrease_quantity", label(locale, "Decrease quantity", "Aantal verlagen")),
    increaseQuantity: contentText(content, "actions", "increase_quantity", label(locale, "Increase quantity", "Aantal verhogen")),
    sku: contentText(content, "item", "sku", "SKU"),
    unavailableSku: contentText(content, "item", "unavailable_sku", label(locale, "N/A", "N.v.t.")),
  };

  return <CartClient lang={locale} labels={labels} />;
}
