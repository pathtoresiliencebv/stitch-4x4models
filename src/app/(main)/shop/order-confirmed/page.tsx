"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Compass, FileText, Truck, Loader } from "lucide-react";
import { useCart } from "@/lib/CartContext";

interface OrderConfirmation {
  order_number: string;
  items: Array<{
    product_id: string;
    title: string;
    price: number;
    quantity: number;
    featured_image_url?: string;
    sku?: string;
  }>;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  shipping_address: {
    first_name: string;
    last_name: string;
    address_line1: string;
    city: string;
    state: string;
    postal_code: string;
  };
  created_date: string;
}

export default function OrderConfirmedPage() {
  const { clearCart } = useCart();
  const [order] = useState<OrderConfirmation | null>(() => {
    if (typeof window === "undefined") return null;
    const orderData = sessionStorage.getItem("order_confirmation");
    if (!orderData) return null;
    try {
      return JSON.parse(orderData);
    } catch (e) {
      console.error("Failed to parse order data", e);
      return null;
    }
  });
  const [loading] = useState(false);

  useEffect(() => {
    // Clear cart when arriving at confirmation
    clearCart();

    // Clean up session storage
    sessionStorage.removeItem("order_confirmation");
    sessionStorage.removeItem("checkout_shipping");
  }, [clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center justify-center p-8">
        <h1 className="font-headline text-3xl text-on-surface uppercase tracking-tight mb-4">
          Order Not Found
        </h1>
        <p className="font-body text-body-md text-tertiary mb-8">
          We could not find your order confirmation. Please check your email for details.
        </p>
        <Link
          href="/shop"
          className="btn-primary-glow inline-flex items-center gap-2 text-on-primary font-headline font-bold uppercase tracking-widest py-4 px-8 rounded no-underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const statusMessages = [
    "Awaiting Cargo Load",
    "Preparing Shipment",
    "In Transit",
    "Out for Delivery",
    "Delivered",
  ];

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body relative overflow-x-hidden selection:bg-primary-container selection:text-on-primary">
      {/* Background layers */}
      <div className="fixed inset-0 pointer-events-none bg-noise z-[-1]"></div>
      <div className="fixed inset-0 pointer-events-none topographic-texture z-[-2]"></div>

      <main className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center justify-center min-h-screen relative z-10">
        {/* Hero Section */}
        <div className="w-full max-w-4xl text-center mb-16 relative">
          <CheckCircle className="w-[80px] md:w-[120px] text-primary mx-auto mb-6" />
          <h1 className="font-headline font-bold text-5xl md:text-7xl uppercase tracking-tighter text-on-surface mb-4 leading-none">
            Mission Accomplished
          </h1>
          <p className="font-body text-xl md:text-2xl text-tertiary max-w-2xl mx-auto leading-relaxed">
            Your coordinates are locked. Your gear is being prepped for dispatch.
            Prepare for extraction.
          </p>
        </div>

        {/* Order Detail Cards (Bento/Asymmetric Layout) */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          {/* Order Summary Info */}
          <div className="md:col-span-5 bg-surface-container-high rounded-xl p-8 lg:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8"></div>
            <h2 className="font-headline font-bold text-2xl uppercase tracking-tight text-on-surface mb-8">
              Dispatch Manifest
            </h2>
            <div className="space-y-6">
              <div className="flex flex-col">
                <span className="font-label text-xs uppercase tracking-widest text-tertiary mb-1">
                  Order Designation
                </span>
                <span className="font-headline text-2xl text-primary-fixed">
                  #{order.order_number}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label text-xs uppercase tracking-widest text-tertiary mb-1">
                  Status
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-body text-lg text-on-surface">
                    {statusMessages[0]}
                  </span>
                </div>
              </div>
              <div className="flex flex-col pt-4">
                <span className="font-label text-xs uppercase tracking-widest text-tertiary mb-1">
                  Estimated Drop
                </span>
                <span className="font-headline text-xl text-on-surface">
                  {estimatedDelivery.toLocaleDateString("en-US", { month: "short", day: "numeric" })} —{" "}
                  {new Date(estimatedDelivery.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          {/* Items Summary List */}
          <div className="md:col-span-7 bg-surface-container-low rounded-xl p-8 lg:p-12">
            <h3 className="font-headline font-bold text-xl uppercase tracking-tight text-on-surface mb-6 flex items-center justify-between">
              <span>Secured Assets</span>
              <span className="font-body text-sm text-tertiary normal-case">
                {order.items.length} Item{order.items.length !== 1 ? "s" : ""}
              </span>
            </h3>
            <div className="space-y-8">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-surface-container-lowest rounded-sm flex-shrink-0 relative overflow-hidden">
                    {item.featured_image_url ? (
                      <Image
                        alt={item.title}
                        className="w-full h-full object-cover"
                        src={item.featured_image_url}
                        fill
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container-low" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between h-full">
                    <div>
                      <h4 className="font-headline font-bold text-lg leading-tight text-on-surface">
                        {item.title}
                      </h4>
                      <p className="font-label text-xs text-tertiary mt-1 uppercase tracking-wider">
                        SKU: {item.sku || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-body text-sm text-on-surface-variant">
                        Qty: {item.quantity}
                      </span>
                      <span className="font-headline font-bold text-primary-fixed">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 flex justify-between items-end border-t border-outline-variant/15 border-dashed">
              <span className="font-label text-sm uppercase tracking-widest text-tertiary">
                Total Payload
              </span>
              <span className="font-headline font-bold text-3xl text-on-surface">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl">
          <Link
            href="#"
            className="w-full sm:w-auto bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-lg uppercase tracking-wider py-4 px-10 rounded-sm hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-3 no-underline btn-primary-glow"
          >
            <Truck className="w-6 h-6" />
            Track Expedition
          </Link>
          <Link
            href="/journal"
            className="w-full sm:w-auto bg-outline/20 border border-outline-variant text-on-surface font-headline font-bold text-lg uppercase tracking-wider py-4 px-10 rounded-sm hover:bg-outline/30 transition-all duration-300 flex items-center justify-center gap-3 no-underline"
          >
            <FileText className="w-6 h-6" />
            Back to Journal
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#584238]/15 bg-[#0e0e0e] flex flex-col md:flex-row justify-between items-center px-12 py-16 gap-8 relative z-10">
        <div className="font-headline font-bold text-[#e5e2e1]">TOYOTA RIGS</div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="#"
            className="font-body text-[0.75rem] tracking-wider uppercase text-[#d0c5b5] opacity-60 hover:text-[#e5e2e1] hover:opacity-100 transition-colors no-underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="font-body text-[0.75rem] tracking-wider uppercase text-[#d0c5b5] opacity-60 hover:text-[#e5e2e1] hover:opacity-100 transition-colors no-underline"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="font-body text-[0.75rem] tracking-wider uppercase text-[#d0c5b5] opacity-60 hover:text-[#e5e2e1] hover:opacity-100 transition-colors no-underline"
          >
            Support
          </Link>
          <Link
            href="#"
            className="font-body text-[0.75rem] tracking-wider uppercase text-[#d0c5b5] opacity-60 hover:text-[#e5e2e1] hover:opacity-100 transition-colors no-underline"
          >
            Affiliates
          </Link>
        </div>
        <div className="font-body text-[0.75rem] tracking-wider uppercase text-[#ea6b1e]">
          © 2026 Toyota Rigs. Engineered for the Outback.
        </div>
      </footer>
    </div>
  );
}
