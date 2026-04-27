"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  X,
  Truck,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 45; // Free shipping over $500

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface relative overflow-x-hidden flex flex-col">
        <div className="fixed inset-0 pointer-events-none bg-noise z-[-1]" />
        <main className="flex-1 pt-16 pb-32 lg:pb-12 px-4 lg:px-12 max-w-7xl mx-auto w-full flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-tertiary mx-auto mb-4" />
            <h1 className="font-headline text-3xl text-on-surface uppercase tracking-tight mb-4">
              Your Cargo is Empty
            </h1>
            <p className="font-body text-body-md text-tertiary mb-8">
              Time to gear up for your next expedition.
            </p>
            <Link
              href="/shop"
              className="btn-primary-glow inline-flex items-center gap-2 text-on-primary font-headline font-bold uppercase tracking-widest py-4 px-8 rounded no-underline"
            >
              Start Scouting
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none bg-noise z-[-1]" />

      <main className="flex-1 pt-16 pb-32 lg:pb-12 px-4 lg:px-12 max-w-7xl mx-auto w-full">
        <header className="mb-12">
          <h1 className="font-headline text-display-lg text-on-surface uppercase tracking-tighter leading-none mb-4">
            Your Cargo
          </h1>
          <p className="font-body text-body-md text-tertiary">
            Review your gear before heading into the wild.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          {/* Cart Items List */}
          <div className="xl:col-span-8 flex flex-col gap-[2rem]">
            {items.map((item) => (
              <article
                key={item.id}
                className="bg-surface-container-high rounded-lg overflow-hidden flex flex-col sm:flex-row relative group"
              >
                <div className="w-full sm:w-48 h-48 sm:h-auto bg-surface-container-lowest flex-shrink-0 relative">
                  {item.featured_image_url ? (
                    <Image
                      alt={item.title}
                      className="w-full h-full object-cover"
                      src={item.featured_image_url}
                      fill
                      sizes="192px"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-container-low" />
                  )}
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="font-headline text-headline-md text-on-surface uppercase leading-tight mb-1">
                        {item.title}
                      </h3>
                      <p className="font-label text-label-md text-tertiary uppercase tracking-widest">
                        SKU: {item.sku || "N/A"}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                      className="text-outline hover:text-error transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-end justify-between mt-auto gap-6">
                    <div className="bg-surface-container-lowest px-4 py-2 rounded flex items-center gap-4 border border-outline-variant/15">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="text-tertiary hover:text-on-surface transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-headline font-bold text-on-surface w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="text-tertiary hover:text-on-surface transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="font-headline text-xl font-bold text-primary tracking-tight">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </article>
            ))}

            <div className="pt-8 flex justify-start">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-secondary font-label text-label-md uppercase tracking-widest hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Scouting
              </Link>
            </div>
          </div>

          {/* Order Summary Side Panel */}
          <div className="xl:col-span-4">
            <div className="bg-surface-container-low p-8 rounded-lg sticky top-24 border border-outline-variant/15">
              <h2 className="font-headline text-headline-md uppercase text-on-surface mb-8 tracking-tight">
                Order Summary
              </h2>
              <div className="flex flex-col gap-4 mb-8 font-body text-body-md text-tertiary">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="text-on-surface font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping (Estimate)</span>
                  <span className="text-on-surface font-semibold">
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taxes</span>
                  <span className="text-on-surface font-semibold">
                    Calculated at checkout
                  </span>
                </div>
              </div>
              <div className="h-4 bg-surface-container-lowest mb-8"></div>
              <div className="flex justify-between items-end mb-8">
                <span className="font-headline text-lg uppercase text-on-surface">
                  Total
                </span>
                <span className="font-headline text-3xl font-bold text-primary tracking-tighter">
                  ${(subtotal + shipping).toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => router.push("/shop/checkout")}
                className="w-full btn-primary-glow text-on-primary font-headline font-bold uppercase tracking-widest py-4 px-6 rounded flex items-center justify-center gap-2 mb-4 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-start gap-3 mt-6 p-4 bg-surface-container-lowest rounded border border-outline-variant/15 text-sm text-tertiary">
                <Truck className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <p className="font-body leading-tight">
                  {shipping === 0
                    ? "You qualify for free freight shipping on this order."
                    : "Heavy items require freight shipping. Free shipping over $500."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}