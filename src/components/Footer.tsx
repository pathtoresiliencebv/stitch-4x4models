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
  const linkClass = "group flex items-center justify-between border-b border-outline-variant/10 py-2 text-sm text-on-surface-variant transition-colors hover:text-primary";
  const headingClass = "mb-4 font-headline text-sm font-bold uppercase text-on-surface";

  return (
    <footer className="premium-section border-t border-outline-variant/15 bg-surface">
      <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="premium-panel grid gap-8 px-5 py-8 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-10">
          <div className="max-w-sm">
            <p className="premium-kicker mb-4">{brandName}</p>
            <h3 className="mb-5 font-headline text-3xl font-bold uppercase leading-tight text-on-surface">
              {brandName}
            </h3>
            <p className="premium-copy text-sm">
              {tagline}
            </p>
          </div>
          <div>
            <h4 className={headingClass}>{labels.explore || "Explore"}</h4>
            <nav className="flex flex-col">
              <Link href={href("/vehicles")} className={linkClass}>{labels.vehicles || "Vehicles"}<span aria-hidden="true">+</span></Link>
              <Link href={href("/gear")} className={linkClass}>{labels.gear || "Gear & Mods"}<span aria-hidden="true">+</span></Link>
              <Link href={href("/journal")} className={linkClass}>{labels.journal || "Journal"}<span aria-hidden="true">+</span></Link>
              <Link href={href("/shop")} className={linkClass}>{labels.shop || "Shop"}<span aria-hidden="true">+</span></Link>
            </nav>
          </div>
          <div>
            <h4 className={headingClass}>{labels.support || "Support"}</h4>
            <nav className="flex flex-col">
              <Link href="#" className={linkClass}>{labels.about || "About"}<span aria-hidden="true">+</span></Link>
              <Link href="#" className={linkClass}>{labels.contact || "Contact"}<span aria-hidden="true">+</span></Link>
              <Link href="#" className={linkClass}>{labels.faq || "FAQ"}<span aria-hidden="true">+</span></Link>
            </nav>
          </div>
          <div>
            <h4 className={headingClass}>{labels.legal || "Legal"}</h4>
            <nav className="flex flex-col">
              <Link href="#" className={linkClass}>{labels.privacy || "Privacy policy"}<span aria-hidden="true">+</span></Link>
              <Link href="#" className={linkClass}>{labels.terms || "Terms of service"}<span aria-hidden="true">+</span></Link>
            </nav>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-outline-variant/10 pt-6 text-xs text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
          <p className="font-label uppercase">{copyright}</p>
          <p className="font-label uppercase text-primary">{brandName}</p>
        </div>
      </div>
    </footer>
  );
}
