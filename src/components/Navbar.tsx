"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";

type NavbarProps = {
  lang?: "en" | "nl";
  brandName?: string;
  logoUrl?: string;
  labels?: Partial<Record<"vehicles" | "gear" | "journal" | "shop" | "signIn" | "signOut", string>>;
};

export default function Navbar({ lang = "en", brandName = "4x4models", logoUrl = "/images/logo.png", labels = {} }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const href = (path: string) => `/${lang}${path}`;
  const text = {
    vehicles: labels.vehicles || "Vehicles",
    gear: labels.gear || "Gear & Mods",
    journal: labels.journal || "Journal",
    shop: labels.shop || "Shop",
    signIn: labels.signIn || "Sign In",
    signOut: labels.signOut || "Sign Out",
  };

  return (
    <header className="glass-nav fixed top-0 w-full z-50 transition-all duration-300 border-b border-surface-container-highest/20">
      <div className="flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto">
        <Link href={`/${lang}`} className="flex items-center">
          <Image src={logoUrl} alt={brandName} width={40} height={40} className="object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 font-headline font-bold tracking-tighter uppercase text-sm">
          <Link className="text-on-surface hover:text-primary transition-colors duration-300" href={href("/vehicles")}>
            {text.vehicles}
          </Link>
          <Link className="text-on-surface hover:text-primary transition-colors duration-300" href={href("/gear")}>
            {text.gear}
          </Link>
          <Link className="text-on-surface hover:text-primary transition-colors duration-300" href={href("/journal")}>
            {text.journal}
          </Link>
          <Link className="text-on-surface hover:text-primary transition-colors duration-300" href={href("/shop")}>
            {text.shop}
          </Link>
        </nav>

        <div className="flex gap-4 items-center">
          <Link href={href("/shop/cart")} className="relative text-on-surface hover:text-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-on-surface-variant text-sm">{user?.full_name}</span>
              <button
                onClick={logout}
                className="text-on-surface hover:text-primary transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block text-on-surface hover:text-primary transition-colors">
              <User className="w-5 h-5" />
            </Link>
          )}

          <button
            className="md:hidden text-on-surface hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-surface border-t border-surface-container-high">
          <nav className="flex flex-col p-6 gap-4 font-headline font-bold tracking-tighter uppercase text-sm">
            <Link className="text-on-surface hover:text-primary transition-colors" href={href("/vehicles")} onClick={() => setIsOpen(false)}>
              {text.vehicles}
            </Link>
            <Link className="text-on-surface hover:text-primary transition-colors" href={href("/gear")} onClick={() => setIsOpen(false)}>
              {text.gear}
            </Link>
            <Link className="text-on-surface hover:text-primary transition-colors" href={href("/journal")} onClick={() => setIsOpen(false)}>
              {text.journal}
            </Link>
            <Link className="text-on-surface hover:text-primary transition-colors" href={href("/shop")} onClick={() => setIsOpen(false)}>
              {text.shop}
            </Link>

            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="text-left text-on-surface hover:text-primary transition-colors"
              >
                {text.signOut}
              </button>
            ) : (
              <Link className="text-on-surface hover:text-primary transition-colors" href="/login" onClick={() => setIsOpen(false)}>
                {text.signIn}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
