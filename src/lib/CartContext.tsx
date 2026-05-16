"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  id: string;
  productId: string;
  product_id?: string;
  variantId: string | null;
  title: string;
  image: string;
  featured_image_url?: string;
  price: number;
  quantity: number;
  sku?: string;
  customization?: Record<string, string>;
  customizationFiles?: Record<string, string>;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: (Omit<CartItem, "id" | "quantity"> & { quantity?: number }) | LegacyCartInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "4x4models_cart";

type LegacyCartInput = {
  product_id: string;
  title: string;
  price: number;
  featured_image_url?: string;
  sku?: string;
  quantity?: number;
};

function sameCustomization(a?: Record<string, string>, b?: Record<string, string>) {
  return JSON.stringify(a || {}) === JSON.stringify(b || {});
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }
  });
  const [isLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isLoading]);

  const addItem = useCallback((item: (Omit<CartItem, "id" | "quantity"> & { quantity?: number }) | LegacyCartInput) => {
    const isModern = "productId" in item;
    const normalized = {
      ...item,
      productId: isModern ? item.productId : item.product_id,
      product_id: isModern ? item.product_id || item.productId : item.product_id,
      variantId: isModern ? item.variantId : null,
      image: isModern ? item.image : item.featured_image_url || "",
      featured_image_url: isModern ? item.featured_image_url || item.image : item.featured_image_url,
      customization: isModern ? item.customization : undefined,
      customizationFiles: isModern ? item.customizationFiles : undefined,
    };

    setItems((prev) => {
      const existing = prev.find(
        (cartItem) =>
          cartItem.productId === normalized.productId &&
          cartItem.variantId === normalized.variantId &&
          sameCustomization(cartItem.customization, normalized.customization) &&
          sameCustomization(cartItem.customizationFiles, normalized.customizationFiles)
      );

      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === existing.id
            ? { ...cartItem, quantity: cartItem.quantity + (normalized.quantity || 1) }
            : cartItem
        );
      }

      return [...prev, { ...normalized, id: crypto.randomUUID(), quantity: normalized.quantity || 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
