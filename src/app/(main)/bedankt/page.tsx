"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCart } from "@/lib/CartContext";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [storedOrderId] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("checkout_order_id") || "";
  });
  const orderId = searchParams.get("order_id") || searchParams.get("order") || storedOrderId;
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    sessionStorage.removeItem("checkout_order_id");
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Order received</p>
      <h1 className="mt-4 font-headline text-4xl font-bold uppercase md:text-5xl">Thank you! Order received</h1>
      <p className="mt-5 text-on-surface-variant">
        Your payment has been received. The confirmation email will be sent automatically.
      </p>
      {orderId ? <p className="mt-4 text-sm text-secondary">Order: {orderId}</p> : null}
      {sessionId ? <p className="mt-2 text-xs text-on-surface-variant">Stripe session: {sessionId}</p> : null}
      <Link href="/producten" className="mt-8 inline-block rounded-md bg-primary px-6 py-4 font-bold uppercase text-on-primary">
        Continue shopping
      </Link>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouContent />
    </Suspense>
  );
}
