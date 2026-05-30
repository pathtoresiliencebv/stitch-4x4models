import Link from "next/link";

type FooterProps = {
  lang?: "en" | "nl";
  brandName?: string;
  tagline?: string;
  copyright?: string;
  labels?: Partial<
    Record<
      | "explore"
      | "support"
      | "legal"
      | "vehicles"
      | "gear"
      | "journal"
      | "shop"
      | "about"
      | "contact"
      | "faq"
      | "privacy"
      | "terms",
      string
    >
  >;
};

export default function Footer({
  lang = "en",
  brandName = "4x4models",
  tagline = "Fuel your off-road adventure with the ultimate Toyota 4x4 community.",
  copyright = "© 2026 4x4models. All rights reserved.",
  labels = {},
}: FooterProps) {
  const href = (path: string) => `/${lang}${path}`;

  return (
    <footer className="bg-surface-container-low border-t border-surface-container-high">
      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-headline font-bold tracking-tighter text-primary uppercase mb-4">
              {brandName}
            </h3>
            <p className="text-on-surface-variant text-sm">
              {tagline}
            </p>
          </div>
          <div>
            <h4 className="font-headline font-bold tracking-tighter uppercase text-sm mb-4">{labels.explore || "Explore"}</h4>
            <nav className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <Link href={href("/vehicles")} className="hover:text-primary transition-colors">{labels.vehicles || "Vehicles"}</Link>
              <Link href={href("/gear")} className="hover:text-primary transition-colors">{labels.gear || "Gear & Mods"}</Link>
              <Link href={href("/journal")} className="hover:text-primary transition-colors">{labels.journal || "Journal"}</Link>
              <Link href={href("/shop")} className="hover:text-primary transition-colors">{labels.shop || "Shop"}</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-headline font-bold tracking-tighter uppercase text-sm mb-4">{labels.support || "Support"}</h4>
            <nav className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <Link href="#" className="hover:text-primary transition-colors">{labels.about || "About"}</Link>
              <Link href="#" className="hover:text-primary transition-colors">{labels.contact || "Contact"}</Link>
              <Link href="#" className="hover:text-primary transition-colors">{labels.faq || "FAQ"}</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-headline font-bold tracking-tighter uppercase text-sm mb-4">{labels.legal || "Legal"}</h4>
            <nav className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <Link href="#" className="hover:text-primary transition-colors">{labels.privacy || "Privacy policy"}</Link>
              <Link href="#" className="hover:text-primary transition-colors">{labels.terms || "Terms of service"}</Link>
            </nav>
          </div>
        </div>
        <div className="border-t border-surface-container-high mt-8 pt-8 text-center text-sm text-on-surface-variant">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
