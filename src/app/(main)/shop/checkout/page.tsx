"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Truck, CreditCard, Lock, Shield, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useCart, CartItem } from "@/lib/CartContext";
import type { ShippingAddress } from "@/types/order";

type CheckoutStep = "shipping" | "review";

export default function CheckoutPage() {
  const { items, total } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [isLoading, setIsLoading] = useState(false);

  // Shipping form state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US",
  });

  const [useSameAddress, setUseSameAddress] = useState(true);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 500 ? 0 : 45;
  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;
  const grandTotal = subtotal + shippingCost + tax;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && typeof window !== "undefined") {
      router.replace("/shop/cart");
    }
  }, [items.length, router]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store shipping data in sessionStorage for payment step
    sessionStorage.setItem(
      "checkout_shipping",
      JSON.stringify({
        shipping_address: shippingAddress,
        subtotal,
        shipping_cost: shippingCost,
        tax,
        total: grandTotal,
      })
    );
    setStep("review");
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Get checkout data from sessionStorage
      const checkoutData = sessionStorage.getItem("checkout_shipping");
      if (!checkoutData) {
        throw new Error("Checkout data not found");
      }

      const { shipping_address } = JSON.parse(checkoutData);

      // Create order items from cart
      const orderItems = items.map((item) => ({
        product_id: item.product_id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        featured_image_url: item.featured_image_url,
        sku: item.sku,
      }));

      // Generate order number
      const orderNumber = `TRX-${Date.now().toString(36).toUpperCase()}`;

      // Create order via API (would integrate with payment processor here)
      // For now, we'll just simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store order confirmation data
      sessionStorage.setItem(
        "order_confirmation",
        JSON.stringify({
          order_number: orderNumber,
          items: orderItems,
          subtotal,
          shipping_cost: shippingCost,
          tax,
          total: grandTotal,
          shipping_address,
          created_date: new Date().toISOString(),
        })
      );

      // Clear cart
      sessionStorage.removeItem("4x4_cart");
      window.location.href = "/shop/order-confirmed";
    } catch (error) {
      console.error("Payment failed:", error);
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased">
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="font-headline text-3xl md:text-4xl font-bold uppercase tracking-tight text-on-surface">
            {step === "shipping" ? "Secure Checkout" : "Review Order"}
          </h1>
          <p className="font-body text-sm text-tertiary mt-2">
            {step === "shipping"
              ? "Complete your order to begin the next expedition."
              : "Verify your order details before payment."}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === "shipping" ? "text-primary" : "text-success"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "shipping" ? "bg-primary text-on-primary" : "bg-success text-on-primary"}`}>
              {step === "review" ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <span className="font-label text-sm uppercase tracking-widest">Shipping</span>
          </div>
          <div className="flex-1 h-px bg-outline-variant" />
          <div className={`flex items-center gap-2 ${step === "review" ? "text-primary" : "text-tertiary"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "review" ? "bg-primary text-on-primary" : "bg-surface-container-high text-tertiary"}`}>
              2
            </div>
            <span className="font-label text-sm uppercase tracking-widest">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
            {step === "shipping" ? (
              <>
                {/* Shipping Info */}
                <section className="bg-surface-container-high rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6 border-b-4 border-surface-container-lowest pb-4">
                    <Truck className="w-6 h-6 text-primary" />
                    <h2 className="font-headline text-xl font-bold text-on-surface">
                      Shipping Details
                    </h2>
                  </div>
                  <form onSubmit={handleShippingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block font-label text-xs uppercase tracking-widest text-tertiary mb-2">
                        Email Address
                      </label>
                      <input
                        required
                        className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-b-2 focus:border-primary text-on-surface rounded-none px-0 py-2 focus:ring-0 transition-all font-body text-sm"
                        placeholder="adventurer@example.com"
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 mt-4">
                      <label className="block font-label text-xs uppercase tracking-widest text-tertiary mb-2">
                        Shipping Address
                      </label>
                    </div>
                    <div className="col-span-1 md:col-span-1">
                      <input
                        required
                        className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-b-2 focus:border-primary text-on-surface rounded-none px-0 py-2 focus:ring-0 transition-all font-body text-sm"
                        placeholder="First Name"
                        type="text"
                        value={shippingAddress.first_name}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, first_name: e.target.value })}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-1">
                      <input
                        required
                        className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-b-2 focus:border-primary text-on-surface rounded-none px-0 py-2 focus:ring-0 transition-all font-body text-sm"
                        placeholder="Last Name"
                        type="text"
                        value={shippingAddress.last_name}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, last_name: e.target.value })}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <input
                        required
                        className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-b-2 focus:border-primary text-on-surface rounded-none px-0 py-2 focus:ring-0 transition-all font-body text-sm"
                        placeholder="Street Address"
                        type="text"
                        value={shippingAddress.address_line1}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address_line1: e.target.value })}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <input
                        className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-b-2 focus:border-primary text-on-surface rounded-none px-0 py-2 focus:ring-0 transition-all font-body text-sm"
                        placeholder="Apartment, suite, etc. (optional)"
                        type="text"
                        value={shippingAddress.address_line2}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address_line2: e.target.value })}
                      />
                    </div>
                    <div className="col-span-1">
                      <input
                        required
                        className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-b-2 focus:border-primary text-on-surface rounded-none px-0 py-2 focus:ring-0 transition-all font-body text-sm"
                        placeholder="City"
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      />
                    </div>
                    <div className="col-span-1 grid grid-cols-2 gap-4">
                      <input
                        required
                        className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-b-2 focus:border-primary text-on-surface rounded-none px-0 py-2 focus:ring-0 transition-all font-body text-sm"
                        placeholder="State/Province"
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      />
                      <input
                        required
                        className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-b-2 focus:border-primary text-on-surface rounded-none px-0 py-2 focus:ring-0 transition-all font-body text-sm"
                        placeholder="Zip/Postal"
                        type="text"
                        value={shippingAddress.postal_code}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 pt-4">
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-lg uppercase py-4 rounded-lg hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 no-underline btn-primary-glow"
                      >
                        Continue to Payment
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </section>
              </>
            ) : (
              <>
                {/* Review Order */}
                <section className="bg-surface-container-high rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6 border-b-4 border-surface-container-lowest pb-4">
                    <Check className="w-6 h-6 text-success" />
                    <h2 className="font-headline text-xl font-bold text-on-surface">
                      Order Review
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-label text-xs uppercase tracking-widest text-tertiary mb-2">Shipping Address</h3>
                      <p className="font-body text-sm text-on-surface">
                        {shippingAddress.first_name} {shippingAddress.last_name}<br />
                        {shippingAddress.address_line1}<br />
                        {shippingAddress.address_line2 && <>{shippingAddress.address_line2}<br /></>}
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}<br />
                        {shippingAddress.email}
                      </p>
                      <button
                        onClick={() => setStep("shipping")}
                        className="text-primary text-sm font-label mt-2 uppercase tracking-widest hover:underline"
                      >
                        Edit
                      </button>
                    </div>

                    <div>
                      <h3 className="font-label text-xs uppercase tracking-widest text-tertiary mb-2">Items</h3>
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-surface-container-lowest rounded overflow-hidden relative">
                              {item.featured_image_url && (
                                <Image
                                  alt={item.title}
                                  src={item.featured_image_url}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-body text-sm text-on-surface font-semibold">{item.title}</p>
                              <p className="font-label text-xs text-tertiary uppercase">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-body text-sm text-on-surface">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Payment Section */}
                <section className="bg-surface-container-high rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6 border-b-4 border-surface-container-lowest pb-4">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <h2 className="font-headline text-xl font-bold text-on-surface">
                      Payment Method
                    </h2>
                  </div>
                  <div className="bg-surface-container-lowest p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="w-5 h-5 text-tertiary" />
                      <span className="font-label text-sm text-tertiary uppercase tracking-widest">
                        Secure Payment (Demo Mode)
                      </span>
                    </div>
                    <p className="font-body text-sm text-tertiary">
                      In production, this would integrate with a payment processor like Stripe.
                      For this demo, clicking "Complete Purchase" will simulate a successful payment.
                    </p>
                  </div>
                </section>

                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-lg uppercase py-4 rounded-lg hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 no-underline btn-primary-glow disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Complete Purchase — ${grandTotal.toFixed(2)}
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStep("shipping")}
                  className="text-secondary font-label text-sm uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Shipping
                </button>
              </>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-surface-container-lowest p-6 rounded-lg sticky top-24">
              <h2 className="font-headline text-xl font-bold text-on-surface mb-6 uppercase">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center border-b-4 border-surface pb-4">
                    <div className="w-16 h-16 object-cover rounded-sm relative overflow-hidden bg-surface-container-high">
                      {item.featured_image_url ? (
                        <Image
                          alt={item.title}
                          src={item.featured_image_url}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-container-low" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-body text-sm font-semibold text-on-surface">{item.title}</h3>
                      <p className="font-label text-xs text-tertiary uppercase mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="font-body text-sm text-on-surface font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 font-body text-sm mb-6 border-b-4 border-surface pb-6">
                <div className="flex justify-between text-tertiary">
                  <span>Subtotal</span>
                  <span className="text-on-surface">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-tertiary">
                  <span>Freight Shipping</span>
                  <span className="text-on-surface">{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-tertiary">
                  <span>Tax (8%)</span>
                  <span className="text-on-surface">${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-8">
                <span className="font-headline text-lg font-bold uppercase text-on-surface">
                  Total
                </span>
                <span className="font-headline text-2xl font-bold text-primary">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              <p className="text-center font-label text-xs text-tertiary mt-4 uppercase tracking-widest flex items-center justify-center gap-1">
                <Shield className="w-4 h-4" />
                Secure Encrypted Transaction
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}