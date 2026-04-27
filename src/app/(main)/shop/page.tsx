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
                  <div className="size-6 text-primary">
                    <svg
                      fill="none"
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                        fill="currentColor"
                      ></path>
                      <path
                        clipRule="evenodd"
                        d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
                        fill="currentColor"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <h2 className="text-on-surface font-headline text-[1.25rem] font-bold tracking-tight">
                    Toyota Rigs Shop
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
