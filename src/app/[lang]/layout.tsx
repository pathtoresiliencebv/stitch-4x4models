import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contentImage, contentText } from "@/lib/content";
import { isLocale, locales } from "@/lib/locale";
import { siteContentService } from "@/lib/services/site-content";
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
  const brandName = contentText(globalContent, "brand", "name", "4x4models");
  const logoUrl = contentImage(globalContent, "brand", "logo", "/images/logo.png");

  const navLabels = {
    vehicles: contentText(globalContent, "nav", "vehicles", lang === "nl" ? "Modellen" : "Vehicles"),
    gear: contentText(globalContent, "nav", "gear", lang === "nl" ? "Gear & Mods" : "Gear & Mods"),
    journal: contentText(globalContent, "nav", "journal", "Journal"),
    shop: contentText(globalContent, "nav", "shop", "Shop"),
    signIn: contentText(globalContent, "nav", "sign_in", lang === "nl" ? "Inloggen" : "Sign In"),
    signOut: contentText(globalContent, "nav", "sign_out", lang === "nl" ? "Uitloggen" : "Sign Out"),
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar lang={lang as Locale} brandName={brandName} logoUrl={logoUrl} labels={navLabels} />
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
