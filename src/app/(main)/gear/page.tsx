"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, Check } from "lucide-react";
import { productService } from "@/lib/services/product";

interface Product {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  price: number;
  rating: number;
  reviews_count: number;
  featured_image_url: string;
  featured_image_alt: string;
}

const brands = ["ARB", "TJM", "Old Man Emu"];
const vehicleModels = ["Land Cruiser 70", "Hilux", "Tacoma"];
const gearTypes = ["Suspension", "Tires", "Camping", "Recovery", "Lighting"];

export default function GearPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await productService.list({ limit: 50 });
        setProducts(data.records);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);
  return (
    <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-label-md text-tertiary mb-6 uppercase tracking-widest font-medium">
        <Link href="/" className="hover:text-secondary transition-colors">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="text-on-surface">Gear & Mods</span>
      </div>

      {/* Header */}
      <header className="mb-12">
        <h1 className="font-headline text-display-lg font-bold uppercase tracking-tighter text-on-surface leading-none">
          GEAR{" "}
          <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
            &amp; MODS
          </span>
        </h1>
        <p className="text-title-lg font-body text-on-surface-variant mt-4 max-w-2xl">
          Engineer your rig for the uncompromising outback. Curated, tested, and
          battle-ready components.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Grid */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-surface-container-high rounded-lg h-96 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-surface-container-high rounded-lg p-12 text-center">
              <span className="text-error font-label uppercase tracking-widest">{error}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {products.map((product) => (
                <article
                  key={product.slug}
                  className="bg-surface-container-high rounded-lg overflow-hidden flex flex-col group relative"
                >
                  <div className="h-64 w-full bg-surface-container-lowest relative overflow-hidden rounded-t-none">
                    <Image
                      src={product.featured_image_url}
                      alt={product.featured_image_alt || product.title}
                      fill
                      className="object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500 scale-105 group-hover:scale-100"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4 bg-secondary-container text-on-secondary-container text-label-md px-3 py-1 font-label uppercase tracking-widest font-medium rounded-sm">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-headline-md font-headline text-on-surface mb-2 line-clamp-2">
                      {product.title}
                    </h2>
                    <div className="flex items-center gap-1 text-primary mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.floor(product.rating)
                              ? "fill-primary text-primary"
                              : i === Math.floor(product.rating) && product.rating % 1 >= 0.5
                              ? "fill-primary/50 text-primary"
                              : "text-primary/30"
                          }
                        />
                      ))}
                      <span className="text-body-md text-on-surface-variant ml-2">
                        {product.rating} ({product.reviews_count} Reviews)
                      </span>
                    </div>
                    <p className="text-body-md text-on-surface-variant mb-6 flex-1">
                      {product.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto border-t border-outline-variant/15 pt-4">
                      <span className="text-title-lg font-bold font-body text-on-surface">
                        ${product.price.toFixed(2)}
                      </span>
                      <Link
                        href={`/gear/${product.slug}`}
                        className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2 rounded-sm font-label uppercase tracking-widest text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2"
                      >
                        Details{" "}
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        {/* Sidebar Filter */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-surface-container-low border border-outline-variant/15 rounded-lg sticky top-28 h-fit">
          <div className="flex flex-col gap-4 p-6 w-full">
            <div className="mb-6 border-b border-outline-variant/15 pb-4">
              <h3 className="text-lg font-bold text-on-surface font-headline uppercase tracking-tight">
                FILTER GEAR
              </h3>
              <p className="text-sm font-medium uppercase tracking-widest text-tertiary mt-1">
                Precision selection
              </p>
            </div>

            {/* Brand Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Check size={14} className="text-primary-container" />
                <h4 className="font-body text-sm font-medium uppercase tracking-widest text-on-surface">
                  Brand
                </h4>
              </div>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="bg-surface-container-lowest border-outline-variant/50 text-primary rounded-sm focus:ring-primary focus:ring-offset-surface"
                    />
                    <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Vehicle Model Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Check size={14} className="text-primary-container" />
                <h4 className="font-body text-sm font-medium uppercase tracking-widest text-on-surface">
                  Vehicle Model
                </h4>
              </div>
              <div className="space-y-2">
                {vehicleModels.map((model) => (
                  <label
                    key={model}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="bg-surface-container-lowest border-outline-variant/50 text-primary rounded-sm focus:ring-primary focus:ring-offset-surface"
                    />
                    <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                      {model}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gear Type Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Check size={14} className="text-primary-container" />
                <h4 className="font-body text-sm font-medium uppercase tracking-widest text-on-surface">
                  Gear Type
                </h4>
              </div>
              <div className="space-y-2">
                {gearTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="bg-surface-container-lowest border-outline-variant/50 text-primary rounded-sm focus:ring-primary focus:ring-offset-surface"
                    />
                    <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-outline-variant/15">
              <button className="w-full bg-primary-container text-on-primary-container font-bold rounded-sm py-3 font-body text-sm uppercase tracking-widest hover:brightness-110 transition-all">
                Apply Filters
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
