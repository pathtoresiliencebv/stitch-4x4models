import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contentImage, contentText } from "@/lib/content";
import { isLocale, locales } from "@/lib/locale";
import { blogService } from "@/lib/services/blog";
import { productService } from "@/lib/services/product";
import { siteContentService } from "@/lib/services/site-content";
import { vehicleService } from "@/lib/services/vehicle";
import type { Locale } from "@/types/common";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const globalContent = await siteContentService.getPage("global", lang as Locale);
  const [vehicles, articles, products] = await Promise.all([
    vehicleService.list(6).catch(() => []),
    blogService.getLatest(6).catch(() => []),
    productService.listPublished({ limit: 6 }).then((response) => response.records).catch(() => []),
  ]);
  const brandName = contentText(globalContent, "brand", "name", "4x4models");
  const logoUrl = contentImage(globalContent, "brand", "logo", "/images/logo.png");

  const navLabels = {
    vehicles: contentText(globalContent, "nav", "vehicles", lang === "nl" ? "Modellen" : "Vehicles"),
    gear: contentText(globalContent, "nav", "gear", lang === "nl" ? "Gear & Mods" : "Gear & Mods"),
    journal: contentText(globalContent, "nav", "journal", "Journal"),
    shop: contentText(globalContent, "nav", "shop", "Shop"),
    signIn: contentText(globalContent, "nav", "sign_in", lang === "nl" ? "Inloggen" : "Sign In"),
    signOut: contentText(globalContent, "nav", "sign_out", lang === "nl" ? "Uitloggen" : "Sign Out"),
    menu: contentText(globalContent, "nav", "menu", "Menu"),
    overview: contentText(globalContent, "nav", "overview", lang === "nl" ? "Overzicht" : "Overview"),
    popularModels: contentText(globalContent, "nav", "popular_models", lang === "nl" ? "Populaire modellen" : "Popular models"),
    latestStories: contentText(globalContent, "nav", "latest_stories", lang === "nl" ? "Laatste verhalen" : "Latest stories"),
    featuredGear: contentText(globalContent, "nav", "featured_gear", lang === "nl" ? "Uitgelichte gear" : "Featured gear"),
    viewAll: contentText(globalContent, "nav", "view_all", lang === "nl" ? "Bekijk alles" : "View all"),
    search: contentText(globalContent, "nav", "search", "Search"),
    cart: contentText(globalContent, "nav", "cart", lang === "nl" ? "Winkelwagen" : "Cart"),
    account: contentText(globalContent, "nav", "account", "Account"),
    language: contentText(globalContent, "nav", "language", lang === "nl" ? "Taal" : "Language"),
    emptyMenu: contentText(globalContent, "nav", "empty_menu", lang === "nl" ? "Content wordt gevuld." : "Content is being curated."),
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        lang={lang as Locale}
        brandName={brandName}
        logoUrl={logoUrl}
        labels={navLabels}
        menu={{
          vehicles: vehicles
            .filter((vehicle) => vehicle.name && vehicle.slug)
            .map((vehicle) => ({
              title: vehicle.name || "",
              href: `/${lang}/vehicles/${vehicle.slug}`,
              label: vehicle.badge || vehicle.tagline || undefined,
              imageUrl: vehicle.featured_image_url || vehicle.hero_image_url || null,
            })),
          articles: articles
            .filter((article) => article.title && article.slug)
            .map((article) => ({
              title: article.title || "",
              href: `/${lang}/journal/${article.slug}`,
              label: article.journal_category || article.read_time || undefined,
              imageUrl: article.featured_image_url || null,
            })),
          products: products
            .filter((product) => product.title && product.slug)
            .map((product) => ({
              title: product.title || "",
              href: `/${lang}/shop/${product.slug}`,
              label: product.product_type || product.vendor || undefined,
              imageUrl: product.featured_image_url || product.product_images?.[0]?.url || null,
            })),
        }}
      />
      <main className="flex-1 pt-16">{children}</main>
      <Footer
        lang={lang as Locale}
        brandName={brandName}
        tagline={contentText(
          globalContent,
          "footer",
          "tagline",
          lang === "nl"
            ? "Alles voor 4x4 schaalmodellen, builds, gear en inspiratie."
            : "Fuel your off-road adventure with the ultimate Toyota 4x4 community."
        )}
        copyright={contentText(
          globalContent,
          "footer",
          "copyright",
          "© 2026 4x4models. All rights reserved."
        )}
        labels={{
          explore: contentText(globalContent, "footer", "explore", lang === "nl" ? "Ontdek" : "Explore"),
          support: contentText(globalContent, "footer", "support", "Support"),
          legal: contentText(globalContent, "footer", "legal", "Legal"),
          about: contentText(globalContent, "footer", "about", lang === "nl" ? "Over ons" : "About"),
          contact: contentText(globalContent, "footer", "contact", "Contact"),
          faq: contentText(globalContent, "footer", "faq", "FAQ"),
          privacy: contentText(globalContent, "footer", "privacy", lang === "nl" ? "Privacybeleid" : "Privacy policy"),
          terms: contentText(globalContent, "footer", "terms", lang === "nl" ? "Voorwaarden" : "Terms of service"),
          ...navLabels,
        }}
      />
    </div>
  );
}
