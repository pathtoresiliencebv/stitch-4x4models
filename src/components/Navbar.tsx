"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import type { ProductCategory, Webshop } from "@/types/base44";

export default function Navbar({ webshop, categories = [] }: { webshop?: Webshop; categories?: ProductCategory[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const name = webshop?.name || "4x4 Models";

  const links = [
    { href: "/producten", label: "Products" },
    { href: "/collecties", label: "Collections" },
    { href: "/blog", label: "Journal" },
  ];

  return (
    <header className="glass-nav fixed top-0 z-50 w-full border-b border-surface-container-highest/20">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-headline text-xl font-bold uppercase tracking-tight text-primary">
          {name}
        </Link>

        <nav className="hidden items-center gap-7 font-headline text-sm font-bold uppercase tracking-tight md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-on-surface transition hover:text-primary">
              {link.label}
            </Link>
          ))}
          {categories.slice(0, 3).map((category) => (
            <Link key={category.id} href={`/collecties/${category.slug}`} className="text-on-surface-variant transition hover:text-primary">
              {category.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/winkelwagen" className="relative text-on-surface transition hover:text-primary" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-on-primary">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            ) : null}
          </Link>
          <button className="text-on-surface md:hidden" onClick={() => setIsOpen((value) => !value)} aria-label="Open menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav className="border-t border-surface-container-high bg-surface px-6 py-5 font-headline text-sm font-bold uppercase tracking-tight md:hidden">
          <div className="flex flex-col gap-4">
            {[...links, ...categories.map((category) => ({ href: `/collecties/${category.slug}`, label: category.name }))].map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-on-surface transition hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
