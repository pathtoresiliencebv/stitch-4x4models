"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Weight, Ruler, Thermometer } from "lucide-react";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCoiaG2PJZnCmL8Xpndhru6ZEwShqFL68Mfm3JbGeJKjoAc9XsUFbxTIhlc5xjLh5PKWMkhP1_toZJljSgbaBorGzu2wm3ne247OP45S1-GJSnSghH1TdZ4tGrRZyT8uptaf3lx7fSG3pVcJR1Cqd9bOjV5XkiCVYPgWfeZNpssd6LmcCLV9zdXsCe9BT4k2EP6i2gNynooBB7tXzJrY_SavG4_dJaiA1urbPd6awvsseaAzNTXVhbI42Kg4Lrcy4UXoTmlrSAnlSu-";

const macroImages = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ5Gwmj80Olzfv7N7zBKvy1r7DNYbcJWxohhf92Ib8854tBP3HeBS2YGuf8qVYgZR3LtCq0A82xWwsPveD6uQsRN05jtebX0gTPtXRC2drZ1zrAY8m_MSslw_UvRB--Be_OKBQ2AY2o90-HTWuvpwCtoAjSG3kV9pHqp5aFgaSKWSdlId_L4TrNWAk487-OeFJwte5mP5Nvi8Auyl5FMCPust9TsTcC2tA0dA9ViVejRkszN5iMByJBPchWFkChB-W8xWsIhP_cyZH",
    alt: "Extreme close-up macro photography of heavy-duty black textured polymer, showing sharp machined cleats and rough industrial surface finish under harsh lighting.",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgmc1rF6cMecbODPybz6kNwYc-k2ngFJthNrgF2MSi27blpI4UsdQjqbsRgr8cR8DPHWJFAfNEqgrZbcUPEolkb-wYB4NJ9XskHRAkySMrLFBruCl2BcVhPgUdaj0YyljcklgG17Iu-bO_5lWcxQS5H1oVyY-hL4yuIXe7WX5-g2uj23V-qb2SGqmS_b__mMtaevLiU_SZFjs02-dhyzrijilEvIYNftZucu6yIdi0QTzQeKiKrADGTRjRsQMWQ5CfRV8ecFNQ56ms",
    alt: "Close-up of matte black industrial structural webbing, showing precise geometric engineering patterns and high-tension material properties.",
  },
];

const specRows = [
  {
    icon: Weight,
    label: "Load Capacity",
    value: "24,000 LBS",
  },
  {
    icon: Ruler,
    label: "Dimensions",
    value: '48" x 13" x 2.5"',
  },
  {
    icon: Thermometer,
    label: "Operating Temp",
    value: "-40°C to 120°C",
  },
];

export default function SleekEditionPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[819px] w-full flex items-end mb-24">
        <div className="absolute inset-0 z-0 bg-surface-container-lowest">
          <Image
            src={heroImage}
            alt="Cinematic high-contrast shot of rugged black recovery tracks stuck in deep desert sand, dramatic side lighting casting long shadows"
            fill
            className="object-cover opacity-60 mix-blend-luminosity"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 pb-16 flex flex-col md:flex-row justify-between items-end">
          <div className="max-w-2xl">
            <h1 className="font-headline text-[3.5rem] leading-none font-bold uppercase tracking-tight mb-4 text-on-surface">
              Tactical Recovery Tracks
            </h1>
            <p className="font-body text-title-lg text-tertiary max-w-xl">
              Forged for the unforgiving. Engineered to extract heavy monolithic
              vehicles from the deepest quagmires on earth.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-3">
            <Link
              href="/gear/tactical-recovery-tracks/modern-edition"
              className="bg-surface-container-high/80 backdrop-blur text-on-surface font-body text-sm font-medium uppercase tracking-widest px-5 py-3 rounded-sm hover:bg-surface-container transition-colors border border-outline-variant/15"
            >
              Modern Edition
            </Link>
            <Link
              href="/gear/tactical-recovery-tracks"
              className="bg-surface-container-high/80 backdrop-blur text-on-surface font-body text-sm font-medium uppercase tracking-widest px-5 py-3 rounded-sm hover:bg-surface-container transition-colors border border-outline-variant/15"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* Product Details / Asymmetric Layout */}
      <section className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-16">
        {/* Left Column: Content & Specs */}
        <div className="md:col-span-8 space-y-24">
          {/* Description */}
          <div className="space-y-6">
            <h2 className="font-headline text-headline-md font-bold text-on-surface">
              Precision Extraction
            </h2>
            <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
              We abandoned conventional plastic molds. The Obsidian Tactical
              Recovery Tracks utilize a proprietary high-density structural
              polymer infused with basalt fibers, offering unmatched shear
              strength while maintaining necessary flex under extreme load. The
              aggressive, asymmetric cleat pattern is machined, not stamped,
              ensuring maximum kinetic transfer between tire and substrate.
            </p>
          </div>

          {/* Macro Imagery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {macroImages.map((img, i) => (
              <div
                key={i}
                className="aspect-square bg-surface-container-low overflow-hidden rounded-sm"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover grayscale contrast-125"
                />
              </div>
            ))}
          </div>

          {/* Technical Specs */}
          <div className="space-y-8 border-t border-outline-variant/15 pt-12">
            <h3 className="font-headline text-headline-md font-bold text-on-surface">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {specRows.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between p-6 bg-surface-container-highest border-l-2 border-primary/20 hover:border-primary transition-colors rounded-sm"
                >
                  <div className="flex items-center gap-4">
                    <spec.icon size={20} className="text-tertiary" />
                    <span className="font-body text-title-lg text-on-surface">
                      {spec.label}
                    </span>
                  </div>
                  <span className="font-headline text-headline-md font-bold text-secondary">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Fixed Sidebar / CTA */}
        <div className="md:col-span-4 relative">
          <div className="sticky top-32 p-8 bg-surface-container-low border border-outline-variant/15 shadow-[0_40px_80px_-10px_rgba(14,14,14,0.4)] rounded-sm">
            <div className="mb-8">
              <span className="font-body text-label-md uppercase tracking-widest text-primary mb-2 block">
                In Stock
              </span>
              <h2 className="font-headline text-headline-md font-bold text-on-surface mb-4">
                Obsidian Sleek Edition
              </h2>
              <div className="font-headline text-[2.5rem] font-bold text-secondary leading-none">
                $349.00
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-body-md text-on-surface-variant border-b border-outline-variant/15 pb-2">
                <span>Material</span>
                <span className="text-on-surface font-medium">
                  Basalt-Polymer Blend
                </span>
              </div>
              <div className="flex justify-between items-center text-body-md text-on-surface-variant border-b border-outline-variant/15 pb-2">
                <span>Color</span>
                <span className="text-on-surface font-medium">
                  Matte Obsidian
                </span>
              </div>
              <div className="flex justify-between items-center text-body-md text-on-surface-variant border-b border-outline-variant/15 pb-2">
                <span>Edition</span>
                <span className="text-on-surface font-medium">Sleek</span>
              </div>
            </div>

            <button className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold uppercase tracking-widest py-4 px-6 rounded-sm hover:brightness-110 transition-all duration-300 flex justify-center items-center gap-2">
              <ShoppingCart size={18} />
              <span>Add to Arsenal</span>
            </button>

            <p className="font-body text-[0.7rem] text-tertiary mt-4 text-center uppercase tracking-wider">
              Free Shipping on Continental Orders
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
