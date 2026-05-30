"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import type { Locale } from "@/types/common";

export type CartLabels = {
  emptyTitle: string;
  emptyCta: string;
  title: string;
  summary: string;
  subtotal: string;
  shipping: string;
  free: string;
  total: string;
  checkout: string;
  removeItem: string;
  decreaseQuantity: string;
  increaseQuantity: string;
  sku: string;
  unavailableSku: string;
};

export default function CartClient({ lang, labels }: { lang: Locale; labels: CartLabels }) {
  const { items, updateQuantity, removeItem } = useCart();
  const router = useRouter();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 45;
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(lang === "nl" ? "nl-NL" : "en-US", {
      style: "currency",
      currency: "EUR",
    }).format(value);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-noise px-4 py-14 sm:px-6">
        <div className="max-w-md border border-outline-variant/20 bg-surface-container-low/80 p-8 text-center sm:p-10">
          <ShoppingCart className="mx-auto mb-5 h-14 w-14 text-primary" />
          <h1 className="mb-5 font-headline text-3xl font-bold uppercase tracking-tight text-on-surface sm:text-4xl">
            {labels.emptyTitle}
          </h1>
          <Link
            className="btn-primary-glow inline-flex items-center justify-center gap-2 rounded-sm px-7 py-4 font-headline text-sm font-bold uppercase tracking-widest text-on-primary"
            href={`/${lang}/gear`}
          >
            {labels.emptyCta}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-noise">
      <main className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="mb-8 font-headline text-4xl font-bold uppercase tracking-tight text-on-surface sm:text-5xl">
          {labels.title}
        </h1>
        <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
          <div className="space-y-4 sm:space-y-6">
            {items.map((item) => (
              <article
                key={item.id}
                className="grid overflow-hidden border border-outline-variant/20 bg-surface-container-high sm:grid-cols-[180px_1fr]"
              >
                <div className="relative aspect-[4/3] bg-surface-container-lowest sm:aspect-auto sm:min-h-44">
                  {item.featured_image_url ? (
                    <Image alt={item.title} src={item.featured_image_url} fill className="object-cover" sizes="(max-width: 640px) 100vw, 180px" />
                  ) : null}
                </div>
                <div className="flex flex-col justify-between gap-6 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-headline text-xl font-bold uppercase leading-tight text-on-surface">{item.title}</h2>
                      <p className="mt-1 font-label text-xs uppercase tracking-widest text-tertiary">
                        {labels.sku}: {item.sku || labels.unavailableSku}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-sm p-2 text-outline transition-colors hover:bg-surface-container-highest hover:text-error"
                      type="button"
                      aria-label={labels.removeItem}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-5">
                    <div className="flex items-center gap-4 border border-outline-variant/15 bg-surface-container-lowest px-4 py-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} type="button" aria-label={labels.decreaseQuantity}>
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} type="button" aria-label={labels.increaseQuantity}>
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-headline text-xl font-bold text-primary">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit border border-outline-variant/20 bg-surface-container-low p-6 sm:p-8 xl:sticky xl:top-24">
            <h2 className="mb-6 font-headline text-xl font-bold uppercase text-on-surface">{labels.summary}</h2>
            <div className="mb-6 space-y-3 text-sm text-tertiary">
              <div className="flex justify-between gap-6">
                <span>{labels.subtotal}</span>
                <span className="text-on-surface">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>{labels.shipping}</span>
                <span className="text-on-surface">{shipping === 0 ? labels.free : formatCurrency(shipping)}</span>
              </div>
            </div>
            <div className="mb-8 flex justify-between gap-6 border-t border-outline-variant/20 pt-5">
              <span className="font-headline font-bold uppercase">{labels.total}</span>
              <span className="font-headline text-2xl font-bold text-primary">{formatCurrency(subtotal + shipping)}</span>
            </div>
            <button
              onClick={() => router.push(`/${lang}/shop/checkout`)}
              className="btn-primary-glow flex w-full items-center justify-center gap-2 rounded-sm px-6 py-4 font-headline text-sm font-bold uppercase tracking-widest text-on-primary"
              type="button"
            >
              {labels.checkout}
              <ArrowRight className="h-5 w-5" />
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
