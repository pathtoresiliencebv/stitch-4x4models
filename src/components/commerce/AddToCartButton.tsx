"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import type { Product } from "@/types/product";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        addItem({
          product_id: product.id || product.slug || product.title || "product",
          title: product.title || "Product",
          price: product.price || 0,
          featured_image_url: product.featured_image_url || null,
          sku: product.sku || product.slug,
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary/10 px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-on-primary"
      type="button"
    >
      <ShoppingCart className="h-4 w-4" />
      {added ? "Added" : "Add"}
    </button>
  );
}
