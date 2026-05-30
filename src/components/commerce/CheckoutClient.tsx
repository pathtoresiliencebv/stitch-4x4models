"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import type { Locale } from "@/types/common";

export type CheckoutLabels = {
  title: string;
  intro: string;
  contactTitle: string;
  orderSummary: string;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  free: string;
  complete: string;
  fields: string[];
};

export default function CheckoutClient({ lang, labels }: { lang: Locale; labels: CheckoutLabels }) {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 45;
  const tax = subtotal * 0.21;
  const total = subtotal + shipping + tax;
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(lang === "nl" ? "nl-NL" : "en-US", {
      style: "currency",
      currency: "EUR",
    }).format(value);

  return (
    <div className="bg-noise">
      <main className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-9 max-w-3xl">
          <h1 className="mb-3 font-headline text-4xl font-bold uppercase tracking-tight text-on-surface sm:text-5xl">
            {labels.title}
          </h1>
          <p className="text-base leading-relaxed text-tertiary sm:text-lg">{labels.intro}</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <form className="grid gap-5 border border-outline-variant/20 bg-surface-container-high p-5 sm:p-6">
            <h2 className="font-headline text-xl font-bold uppercase text-on-surface">{labels.contactTitle}</h2>
            {labels.fields.map((field) => (
              <label key={field} className="grid gap-2">
                <span className="font-label text-xs uppercase tracking-widest text-tertiary">{field}</span>
                <input required className="border-b border-outline-variant bg-surface-container-highest px-3 py-3 text-on-surface outline-none focus:border-primary" />
              </label>
            ))}
          </form>
          <aside className="h-fit border border-outline-variant/20 bg-surface-container-low p-6 lg:sticky lg:top-24">
            <h2 className="mb-5 font-headline text-xl font-bold uppercase">{labels.orderSummary}</h2>
            <div className="mb-6 space-y-3 text-sm text-tertiary">
              <div className="flex justify-between gap-6">
                <span>{labels.subtotal}</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>{labels.shipping}</span>
                <span>{shipping === 0 ? labels.free : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>{labels.tax}</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            </div>
            <div className="mb-6 flex justify-between gap-6 border-t border-outline-variant/20 pt-4 font-headline text-xl font-bold text-primary">
              <span>{labels.total}</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <button
              onClick={() => {
                sessionStorage.setItem(
                  "order_confirmation",
                  JSON.stringify({
                    order_number: `TRX-${Date.now().toString(36).toUpperCase()}`,
                    items,
                    subtotal,
                    shipping_cost: shipping,
                    tax,
                    total,
                    created_date: new Date().toISOString(),
                  })
                );
                clearCart();
                router.push(`/${lang}/shop/order-confirmed`);
              }}
              className="btn-primary-glow w-full rounded-sm px-6 py-4 font-headline text-sm font-bold uppercase tracking-widest text-on-primary"
              type="button"
            >
              {labels.complete}
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
