"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { formatCurrency } from "@/lib/format";

type CheckoutResponse = {
  checkoutUrl?: string;
  order_id?: string;
  error?: string;
};

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    if (window.self !== window.top) {
      setError("Checkout only works from the published site.");
      setLoading(false);
      return;
    }
    const form = new FormData(event.currentTarget);
    const cartItems = items.map((item) => ({
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      customization: item.customization,
    }));
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartItems,
        customer: {
          email: form.get("email"),
          name: form.get("name"),
          phone: form.get("phone"),
        },
      }),
    });
    const data = (await res.json()) as CheckoutResponse;
    if (data.checkoutUrl) {
      if (data.order_id) sessionStorage.setItem("checkout_order_id", data.order_id);
      window.location.href = data.checkoutUrl;
      return;
    }
    setError(data.error || "Checkout could not be started.");
    setLoading(false);
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="font-headline text-4xl font-bold uppercase">Checkout</h1>
        <p className="mt-6 text-on-surface-variant">Your cart is empty.</p>
        <Link href="/producten" className="mt-5 inline-block rounded-md bg-primary px-5 py-3 font-bold uppercase text-on-primary">Shop products</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-6 py-14 lg:grid-cols-[1fr_340px]">
      <form onSubmit={submit} className="space-y-5 rounded-lg border border-surface-container-high bg-surface-container-low p-6">
        <h1 className="font-headline text-4xl font-bold uppercase">Checkout</h1>
        {[
          ["name", "Full name"],
          ["email", "Email"],
          ["phone", "Phone"],
        ].map(([name, label]) => (
          <label key={name} className="block">
            <span className="mb-2 block text-sm font-bold">{label}</span>
            <input required name={name} type={name === "email" ? "email" : "text"} className="w-full rounded-md border border-outline-variant bg-surface p-3 outline-none focus:border-primary" />
          </label>
        ))}
        {error ? <p className="text-error">{error}</p> : null}
        <button disabled={loading} className="w-full rounded-md bg-primary px-6 py-4 font-bold uppercase text-on-primary disabled:opacity-50">
          {loading ? "Starting checkout..." : "Pay securely"}
        </button>
      </form>
      <aside className="h-fit rounded-lg border border-surface-container-high bg-surface-container-low p-6">
        <h2 className="font-headline text-xl font-bold">Order summary</h2>
        <div className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <span>{item.quantity}x {item.title}</span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between border-t border-surface-container-high pt-4 text-lg font-bold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </aside>
    </div>
  );
}
