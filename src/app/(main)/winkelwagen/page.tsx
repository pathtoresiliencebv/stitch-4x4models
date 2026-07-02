"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { formatCurrency } from "@/lib/format";

type CheckoutResponse = {
  checkoutUrl?: string;
  order_id?: string;
  error?: string;
};

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (window.self !== window.top) {
      setError("Checkout only works from the published site.");
      return;
    }

    setLoading(true);
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
    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    if (!data.checkoutUrl) {
      setError("Checkout could not be started.");
      setLoading(false);
      return;
    }

    if (data.order_id) sessionStorage.setItem("checkout_order_id", data.order_id);
    window.location.href = data.checkoutUrl;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="font-headline text-4xl font-bold uppercase">Cart</h1>
      {!items.length ? (
        <div className="mt-10 rounded-lg border border-surface-container-high p-8">
          <p className="text-on-surface-variant">Your cart is empty.</p>
          <Link href="/producten" className="mt-5 inline-block rounded-md bg-primary px-5 py-3 font-bold uppercase text-on-primary">
            Shop products
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-[88px_1fr] gap-4 rounded-lg border border-surface-container-high bg-surface-container-low p-4 sm:grid-cols-[100px_1fr_auto]">
                <div className="relative aspect-square overflow-hidden rounded-md bg-surface-container">
                  {item.image ? <Image src={item.image} alt={item.title} fill className="object-cover" /> : null}
                </div>
                <div>
                  <h2 className="font-headline text-lg font-bold">{item.title}</h2>
                  <p className="mt-1 text-secondary">{formatCurrency(item.price)}</p>
                  {item.customization ? (
                    <dl className="mt-3 text-xs text-on-surface-variant">
                      {Object.entries(item.customization).map(([key, value]) => value ? <div key={key}>{key}: {value}</div> : null)}
                    </dl>
                  ) : null}
                </div>
                <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
                  <input
                    aria-label="Quantity"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                    className="w-20 rounded-md border border-outline-variant bg-surface p-2"
                  />
                  <button onClick={() => removeItem(item.id)} className="text-error" aria-label="Remove item">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-lg border border-surface-container-high bg-surface-container-low p-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <form onSubmit={handleCheckout} className="mt-6 space-y-4">
              {[
                ["name", "Full name", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone", "tel"],
              ].map(([name, label, type]) => (
                <label key={name} className="block">
                  <span className="mb-2 block text-sm font-bold">{label}</span>
                  <input
                    required
                    name={name}
                    type={type}
                    className="w-full rounded-md border border-outline-variant bg-surface p-3 outline-none focus:border-primary"
                  />
                </label>
              ))}
              {error ? <p className="text-sm text-error">{error}</p> : null}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-primary px-6 py-4 text-center font-bold uppercase text-on-primary disabled:opacity-50"
              >
                {loading ? "Starting checkout..." : "Checkout"}
              </button>
            </form>
            <Link href="/checkout" className="mt-4 block text-center text-sm text-on-surface-variant hover:text-primary">
              Open full checkout page
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
