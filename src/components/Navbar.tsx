"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ChevronDown,
  Compass,
  Globe2,
  LogOut,
  Menu,
  Newspaper,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";

type MenuItem = {
  title: string;
  href: string;
  label?: string;
  imageUrl?: string | null;
};

type NavbarProps = {
  lang?: "en" | "nl";
  brandName?: string;
  logoUrl?: string;
  labels?: Partial<
    Record<
      | "vehicles"
      | "gear"
      | "journal"
      | "shop"
      | "signIn"
      | "signOut"
      | "menu"
      | "overview"
      | "popularModels"
      | "latestStories"
      | "featuredGear"
      | "viewAll"
      | "search"
      | "cart"
      | "account"
      | "language"
      | "emptyMenu",
      string
    >
  >;
  menu?: {
    vehicles?: MenuItem[];
    articles?: MenuItem[];
    products?: MenuItem[];
  };
};

type MenuKey = "vehicles" | "gear" | "journal" | "shop";

const menuIcons = {
  vehicles: Compass,
  gear: Package,
  journal: Newspaper,
  shop: ShoppingCart,
};

export default function Navbar({
  lang = "en",
  brandName = "4x4models",
  logoUrl = "https://media.base44.com/images/public/699871557dfcaafa02868052/8ae82d41d_4x4models.png",
  labels = {},
  menu = {},
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const href = (path: string) => `/${lang}${path}`;
  const iconButton =
    "inline-flex h-11 w-11 items-center justify-center border border-outline-variant/20 bg-surface-container-low/85 text-on-surface transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary";
  const text = {
    vehicles: labels.vehicles || "Vehicles",
    gear: labels.gear || "Gear & Mods",
    journal: labels.journal || "Journal",
    shop: labels.shop || "Shop",
    signIn: labels.signIn || "Sign In",
    signOut: labels.signOut || "Sign Out",
    menu: labels.menu || "Menu",
    overview: labels.overview || "Overview",
    popularModels: labels.popularModels || "Popular models",
    latestStories: labels.latestStories || "Latest stories",
    featuredGear: labels.featuredGear || "Featured gear",
    viewAll: labels.viewAll || "View all",
    search: labels.search || "Search",
    cart: labels.cart || "Cart",
    account: labels.account || "Account",
    language: labels.language || (lang === "nl" ? "Taal" : "Language"),
    emptyMenu: labels.emptyMenu || "Content is being curated.",
  };

  const primaryNav: Array<{ key: MenuKey; label: string; href: string }> = [
    { key: "vehicles", label: text.vehicles, href: href("/vehicles") },
    { key: "gear", label: text.gear, href: href("/gear") },
    { key: "journal", label: text.journal, href: href("/journal") },
    { key: "shop", label: text.shop, href: href("/shop") },
  ];

  const menuItems = (key: MenuKey) => {
    if (key === "vehicles") return menu.vehicles || [];
    if (key === "journal") return menu.articles || [];
    return menu.products || [];
  };

  const sectionTitle = (key: MenuKey) => {
    if (key === "vehicles") return text.popularModels;
    if (key === "journal") return text.latestStories;
    return text.featuredGear;
  };

  const closeMenu = () => {
    setIsOpen(false);
    setActiveMenu(null);
  };

  const languageHref = (nextLang: "en" | "nl") => {
    const path = pathname || `/${lang}`;
    const segments = path.split("/");
    if (segments[1] === "en" || segments[1] === "nl") {
      segments[1] = nextLang;
      return segments.join("/") || `/${nextLang}`;
    }
    return `/${nextLang}${path.startsWith("/") ? path : `/${path}`}`;
  };

  return (
    <header
      className="fixed top-0 z-50 w-full border-b border-outline-variant/15 bg-surface/82 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition-all duration-300"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-2.5 sm:px-6">
        <Link href={`/${lang}`} className="group flex items-center gap-3" onClick={closeMenu}>
          <span className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden border border-primary/35 bg-gradient-to-br from-primary/20 via-surface-container-high to-surface-container-low shadow-[0_0_30px_rgba(216,122,63,0.16)]">
            <Image src={logoUrl} alt={brandName} width={38} height={38} className="object-contain transition-transform duration-300 group-hover:scale-105" />
          </span>
          <span className="hidden font-headline text-sm font-bold uppercase text-on-surface transition-colors group-hover:text-primary sm:block">
            {brandName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-sm border border-outline-variant/15 bg-surface-container-low/80 p-1 font-headline text-sm font-bold uppercase shadow-inner lg:flex">
          {primaryNav.map((item) => {
            const Icon = menuIcons[item.key];
            const isActive = activeMenu === item.key;
            return (
              <div key={item.key} className="relative">
                <button
                  className={`inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-on-surface transition-colors duration-300 hover:border-primary/25 hover:bg-primary/10 hover:text-primary ${isActive ? "border-primary/30 bg-primary/10 text-primary" : "border-transparent"}`}
                  onClick={() => setActiveMenu(isActive ? null : item.key)}
                  onFocus={() => setActiveMenu(item.key)}
                  onMouseEnter={() => setActiveMenu(item.key)}
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isActive ? "rotate-180" : ""}`} />
                </button>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={href("/journal")}
            className={`hidden sm:inline-flex ${iconButton}`}
            aria-label={text.search}
          >
            <Search className="h-5 w-5" />
          </Link>

          <Link href={href("/shop/cart")} className={`relative ${iconButton}`} aria-label={text.cart}>
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-on-primary">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden items-center gap-3 md:flex">
              <span className="max-w-32 truncate text-sm text-on-surface-variant">{user?.full_name}</span>
              <button
                onClick={logout}
                className={iconButton}
                title={text.signOut}
                type="button"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link href="/login" className={`hidden md:inline-flex ${iconButton}`} aria-label={text.account}>
              <User className="h-5 w-5" />
            </Link>
          )}

          <button
            className="inline-flex h-11 items-center gap-2 border border-outline-variant/20 bg-surface-container-low/85 px-3 text-on-surface transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={text.menu}
            type="button"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="hidden font-headline text-xs font-bold uppercase sm:inline">{text.menu}</span>
          </button>

          <LanguageSwitcher
            currentLang={lang}
            getHref={languageHref}
            label={text.language}
            onClick={closeMenu}
            variant="desktop"
          />
        </div>
      </div>

      {activeMenu ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="hidden border-t border-outline-variant/10 bg-surface/96 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:block"
          initial={reduced ? false : { opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <div className="mx-auto grid max-w-screen-2xl grid-cols-[0.72fr_2fr] gap-6 px-6 py-5">
            <div className="premium-panel bg-gradient-to-br from-surface-container-high to-surface-container-low p-6">
              <p className="premium-kicker mb-4">{primaryNav.find((item) => item.key === activeMenu)?.label}</p>
              <Link
                href={primaryNav.find((item) => item.key === activeMenu)?.href || `/${lang}`}
                className="group flex items-end justify-between gap-4 border-t border-outline-variant/10 pt-5"
                onClick={closeMenu}
              >
                <span>
                  <span className="block font-headline text-3xl font-bold uppercase text-on-surface group-hover:text-primary">
                    {text.overview}
                  </span>
                  <span className="mt-2 block text-sm text-on-surface-variant">
                    {sectionTitle(activeMenu)}
                  </span>
                </span>
                <ArrowUpRight className="h-6 w-6 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="premium-kicker">{sectionTitle(activeMenu)}</p>
                <Link href={primaryNav.find((item) => item.key === activeMenu)?.href || `/${lang}`} className="premium-link text-xs font-bold uppercase text-primary" onClick={closeMenu}>
                  {text.viewAll}
                </Link>
              </div>
              {menuItems(activeMenu).length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {menuItems(activeMenu).slice(0, 6).map((item) => (
                    <MenuPreviewCard key={`${activeMenu}-${item.href}-${item.title}`} item={item} onClick={closeMenu} reduced={reduced} />
                  ))}
                </div>
              ) : (
                <div className="premium-panel px-5 py-8 text-sm text-on-surface-variant">{text.emptyMenu}</div>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}

      {isOpen ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-outline-variant/15 bg-surface/98 lg:hidden"
          initial={reduced ? false : { opacity: 0, y: -8 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          <div className="space-y-3 p-4">
            <LanguageSwitcher
              currentLang={lang}
              getHref={languageHref}
              label={text.language}
              onClick={closeMenu}
              variant="mobile"
            />

            {primaryNav.map((section, index) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                key={section.key}
                transition={{ delay: reduced ? 0 : index * 0.035, duration: 0.18, ease: "easeOut" }}
              >
                <MobileMenuSection
                  title={section.label}
                  href={section.href}
                  items={menuItems(section.key).slice(0, 4)}
                  viewAll={text.viewAll}
                  emptyText={text.emptyMenu}
                  onClick={closeMenu}
                />
              </motion.div>
            ))}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link href={href("/shop/cart")} onClick={closeMenu} className="border border-outline-variant/15 bg-surface-container-low px-4 py-4 font-headline text-sm font-bold uppercase text-on-surface">
                {text.cart}
              </Link>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="border border-outline-variant/15 bg-surface-container-low px-4 py-4 text-left font-headline text-sm font-bold uppercase text-on-surface"
                  type="button"
                >
                  {text.signOut}
                </button>
              ) : (
                <Link href="/login" onClick={closeMenu} className="border border-outline-variant/15 bg-surface-container-low px-4 py-4 font-headline text-sm font-bold uppercase text-on-surface">
                  {text.signIn}
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </header>
  );
}

function LanguageSwitcher({
  currentLang,
  getHref,
  label,
  onClick,
  variant,
}: {
  currentLang: "en" | "nl";
  getHref: (lang: "en" | "nl") => string;
  label: string;
  onClick: () => void;
  variant: "desktop" | "mobile";
}) {
  const langs = ["en", "nl"] as const;
  const isMobile = variant === "mobile";

  return (
    <nav
      aria-label={label}
      className={
        isMobile
          ? "flex items-center justify-between border border-outline-variant/15 bg-surface-container-low/85 p-1"
          : "hidden items-center gap-1 border border-outline-variant/20 bg-surface-container-low/85 p-1 md:flex"
      }
    >
      <span className={isMobile ? "flex items-center gap-2 px-3 font-label text-xs font-bold uppercase text-tertiary" : "sr-only"}>
        <Globe2 className="h-4 w-4 text-primary" aria-hidden="true" />
        {label}
      </span>
      <span className={isMobile ? "flex gap-1" : "flex gap-1"}>
        {langs.map((item) => {
          const active = currentLang === item;
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`relative inline-flex h-9 min-w-10 items-center justify-center px-3 font-headline text-xs font-bold uppercase transition-colors ${
                active
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-primary/10 hover:text-primary"
              }`}
              href={getHref(item)}
              key={item}
              onClick={onClick}
            >
              {item}
            </Link>
          );
        })}
      </span>
    </nav>
  );
}

function MenuPreviewCard({ item, onClick, reduced }: { item: MenuItem; onClick: () => void; reduced: boolean | null }) {
  return (
    <motion.div whileHover={reduced ? undefined : { y: -3 }} whileTap={reduced ? undefined : { scale: 0.99 }} transition={{ duration: 0.16 }}>
      <Link href={item.href} onClick={onClick} className="premium-card group block overflow-hidden border-outline-variant/15 transition-colors hover:border-primary/40">
        {item.imageUrl ? (
          <span className="relative block h-32 overflow-hidden">
            <Image src={item.imageUrl} alt={item.title} fill unoptimized className="premium-card-image object-cover" />
          </span>
        ) : null}
        <span className="block p-4">
          {item.label ? <span className="premium-kicker mb-2">{item.label}</span> : null}
          <span className="flex items-start justify-between gap-3">
            <span className="font-headline text-lg font-bold uppercase leading-tight text-on-surface group-hover:text-primary">
              {item.title}
            </span>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

function MobileMenuSection({
  title,
  href,
  items,
  viewAll,
  emptyText,
  onClick,
}: {
  title: string;
  href: string;
  items: MenuItem[];
  viewAll: string;
  emptyText: string;
  onClick: () => void;
}) {
  return (
    <section className="premium-panel p-3">
      <Link href={href} onClick={onClick} className="flex min-h-12 items-center justify-between border-b border-outline-variant/10 px-1 pb-3">
        <span className="font-headline text-xl font-bold uppercase text-on-surface">{title}</span>
        <span className="font-label text-xs font-bold uppercase text-primary">{viewAll}</span>
      </Link>
      {items.length > 0 ? (
        <div className="mt-3 grid gap-2">
          {items.map((item) => (
            <Link key={`${href}-${item.href}-${item.title}`} href={item.href} onClick={onClick} className="flex min-h-12 items-center justify-between gap-3 bg-surface-container-low/70 px-3 py-3.5 text-on-surface transition-colors hover:border-primary/30 hover:bg-primary/10">
              <span>
                {item.label ? <span className="block font-label text-[10px] font-bold uppercase text-primary">{item.label}</span> : null}
                <span className="block font-headline text-sm font-bold uppercase">{item.title}</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-primary" />
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-on-surface-variant">{emptyText}</p>
      )}
    </section>
  );
}
