"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Plus,
  Minus,
  X,
  Shield,
  Truck,
  CreditCard,
  ChevronRight,
} from "lucide-react";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-surface relative">
      <div className="noise-overlay"></div>
      <div className="relative flex h-auto min-h-screen w-full flex-col z-20">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1 gap-8">
              {/* Header - Minimal Back to Main for Focused View */}
              <header className="flex items-center justify-between whitespace-nowrap py-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-primary hover:text-primary-container transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-label text-label-md tracking-wider uppercase font-medium">
                    Back to Home
                  </span>
                </Link>
                <div className="flex items-center gap-3">
                  <Image src="/images/logo.png" alt="4x4models" width={40} height={40} className="object-contain" />
                  <h2 className="text-on-surface font-headline text-[1.25rem] font-bold tracking-tight">
                    4x4models Shop
                  </h2>
                </div>
              </header>

              {/* Shop Hero Section */}
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-4">
                {/* Left Column: Cargo Items */}
                <div className="flex-1 flex flex-col">
                  <h1 className="font-headline text-[3.5rem] font-bold leading-none tracking-[-0.02em] uppercase text-on-surface mb-8">
                    Your Cargo
                  </h1>
                  <div className="flex flex-col gap-8 bg-surface-container-low p-6 lg:p-8 rounded-lg">
                    {/* Item 1 */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative group">
                      <div className="w-full sm:w-32 aspect-square rounded-t-none rounded-b bg-surface-container-highest shrink-0 overflow-hidden relative">
                        <Image
                          alt="Tactical Recovery Tracks"
                          className="object-cover w-full h-full mix-blend-luminosity opacity-80 group-hover:opacity-100 transition-opacity"
                          data-alt="close up of bright orange off-road recovery tracks lying in coarse desert sand under harsh sunlight"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-73OR-XfRGxOnOjVfkntd4Ru6tyDh7JUMUEzoGkIDLXMYkDwTWBQxBBY5CSkOrYgTmK_lKwwOQMz0OOKYL6PR2SCr9mmUgpMpkzAdObf7JVlCDcnXPiZ6WqctJwn7b1WWxYV9tToMQVapoyz6tjeuvAPphwxRymE9bRqlZeun2sf6eoebk_bkQf98sSFCzMpmFrD4Sh24AdcSmLd14qv_WlmyfhHG6WMg8wJeCpEvjLSccyJB1PcsaRkD-jNKu3lYckTtxh7OS_mW"
                          fill
                          sizes="128px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center min-w-0">
                        <div className="flex justify-between items-start gap-4 mb-1">
                          <h3 className="text-on-surface font-body text-[1.375rem] font-semibold truncate">
                            Tactical Recovery Tracks
                          </h3>
                          <button
                            aria-label="Remove item"
                            className="text-outline hover:text-error transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-secondary font-label text-label-md tracking-wider uppercase mb-3">
                          In Stock
                        </p>
                        <div className="flex items-end justify-between mt-auto">
                          <div className="flex items-center gap-3 bg-surface-container-highest rounded p-1">
                            <button
                              aria-label="Decrease quantity"
                              className="text-on-surface flex h-8 w-8 items-center justify-center rounded bg-surface hover:bg-surface-bright transition-colors cursor-pointer"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              aria-label="Quantity"
                              className="font-body text-[1rem] font-medium w-8 p-0 text-center text-on-surface bg-transparent focus:outline-0 focus:ring-0 focus:border-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              type="number"
                              defaultValue={1}
                            />
                            <button
                              aria-label="Increase quantity"
                              className="text-on-surface flex h-8 w-8 items-center justify-center rounded bg-surface hover:bg-surface-bright transition-colors cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-on-surface font-headline text-[1.5rem] font-bold">
                            $249.99
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Item Gap Trench */}
                    <div className="h-1 w-full bg-surface-container-lowest"></div>
                    {/* Item 2 */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative group">
                      <div className="w-full sm:w-32 aspect-square rounded-t-none rounded-b bg-surface-container-highest shrink-0 overflow-hidden relative">
                        <Image
                          alt="Heavy-Duty Winch"
                          className="object-cover w-full h-full mix-blend-luminosity opacity-80 group-hover:opacity-100 transition-opacity"
                          data-alt="heavy duty industrial winch mounted on a rugged steel bumper, dark metallic textures, outdoor lighting"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFh0HM0cWIZFxyQVyZL27xPsGWEIjTKl0lOr0z6lSu3_yCHj3bVWmXtU-rvkxmNQ-azVwSWrQCo4Y842T6bhU-I777GUUZDqfJjx3puuYSWETtx7iNi5G2dft3xx4B69RCZ3o1_fdOJ-53fwLCEe4hHSL64MgFHc9219TulZrWJl2JlbwsOOMH0ZmXSmHV8AmBSXbwKlLklM6QgKOijOXFJNmL1G6mqjWL1QhUo1QftM_--VKH4Po2B-I2q7f-W4BZzJj3DpbhiU6N"
                          fill
                          sizes="128px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center min-w-0">
                        <div className="flex justify-between items-start gap-4 mb-1">
                          <h3 className="text-on-surface font-body text-[1.375rem] font-semibold truncate">
                            Heavy-Duty Winch 12,000lb
                          </h3>
                          <button
                            aria-label="Remove item"
                            className="text-outline hover:text-error transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-secondary font-label text-label-md tracking-wider uppercase mb-3">
                          In Stock
                        </p>
                        <div className="flex items-end justify-between mt-auto">
                          <div className="flex items-center gap-3 bg-surface-container-highest rounded p-1">
                            <button
                              aria-label="Decrease quantity"
                              className="text-on-surface flex h-8 w-8 items-center justify-center rounded bg-surface hover:bg-surface-bright transition-colors cursor-pointer"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              aria-label="Quantity"
                              className="font-body text-[1rem] font-medium w-8 p-0 text-center text-on-surface bg-transparent focus:outline-0 focus:ring-0 focus:border-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              type="number"
                              defaultValue={1}
                            />
                            <button
                              aria-label="Increase quantity"
                              className="text-on-surface flex h-8 w-8 items-center justify-center rounded bg-surface hover:bg-surface-bright transition-colors cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-on-surface font-headline text-[1.5rem] font-bold">
                            $499.00
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Continue Shopping Link */}
                  <div className="mt-8">
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 text-secondary font-label text-label-md uppercase tracking-widest hover:text-primary transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="w-full lg:w-[400px] shrink-0">
                  <div className="bg-surface-container-high rounded-lg p-6 lg:p-8 sticky top-8">
                    <h2 className="font-headline text-[1.75rem] font-bold text-on-surface mb-6 uppercase">
                      Order Summary
                    </h2>
                    <div className="flex flex-col gap-4 font-body text-[0.875rem]">
                      <div className="flex justify-between items-center text-tertiary">
                        <span>Subtotal (2 Items)</span>
                        <span className="font-medium text-on-surface">$748.99</span>
                      </div>
                      <div className="flex justify-between items-center text-tertiary">
                        <span>Estimated Shipping</span>
                        <span className="font-medium text-on-surface">$45.00</span>
                      </div>
                      <div className="flex justify-between items-center text-tertiary">
                        <span>Taxes</span>
                        <span className="text-outline text-xs">
                          Calculated at checkout
                        </span>
                      </div>
                      {/* Gap Trench */}
                      <div className="h-4"></div>
                      <div className="flex justify-between items-center pt-4 border-t border-outline-variant/15">
                        <span className="font-headline text-[1.375rem] font-bold text-on-surface uppercase">
                          Total
                        </span>
                        <span className="font-headline text-[2rem] font-bold text-primary">
                          $793.99
                        </span>
                      </div>
                    </div>
                    <Link
                      href="/shop/checkout"
                      className="w-full mt-8 flex items-center justify-center gap-2 btn-primary-glow text-on-primary font-body font-bold text-[1rem] py-4 rounded hover:brightness-110 transition-all shadow-[0_0_20px_rgba(255,182,147,0.1)] hover:shadow-[0_0_30px_rgba(255,182,147,0.2)] group cursor-pointer no-underline"
                    >
                      <span>Proceed to Checkout</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <div className="mt-4 flex items-center gap-2 text-tertiary justify-center text-xs">
                      <Shield className="w-4 h-4" />
                      <span>Secure Encrypted Checkout</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 border-t border-surface-container-low">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface uppercase text-sm">
                      Freight Shipping
                    </h3>
                    <p className="text-tertiary text-xs">
                      Heavy items shipped via freight
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface uppercase text-sm">
                      Secure Payment
                    </h3>
                    <p className="text-tertiary text-xs">
                      256-bit SSL encryption
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface uppercase text-sm">
                      Easy Returns
                    </h3>
                    <p className="text-tertiary text-xs">
                      30-day return policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
