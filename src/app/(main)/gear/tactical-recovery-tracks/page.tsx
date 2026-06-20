"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";

const galleryImages = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGYM-QBBRPW4q1hkmM8GXWJPwpnUETqX5vONqo6fPbPSuaypWuXK5hYEB_jyq343b5XfxWULdCfw_WMJEC4Xlhw6q0pbWYJ3Y7AMHXQTta2gu46lpnmciRoQuEeiRnO8gOfilPIil4eGVLSMLpsMvLUtSkAmV4AVtawyElGAwiQkhrVR8xmlL4JY0liIgFCyTtTmPXk3ZROPTs_PTrevWwkPwR2hkrKdqcAAcIj9Y1CPGrLIFAVBxDR3r0cT-GviznJGVVkcD-1CUO",
    alt: "Close up of rugged burnt orange recovery tracks covered in dry desert sand with deep tire treads visible under harsh midday sun",
  },
];

const gridImages = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOD0lLRzjGfBvMnA9Gv2RHbLCWxp0BZM1h_FVjJQk77d-KvkEZvdVdXPZYy0N77DCclMEM6riBiat9FxcMUge3W-P_aJjTGyNqWrU8oG3UW0YDEIgnpsLsodHHTd50WhLSOdq-oDUjvGahGftUeopvttAlCzgmDGovXYuyZfb4qKjF3EoPoZbhdKGJDXzGVMoBvMnj2Q97KxKp_nyaEX-DLc-A5kOt940WLL6i8fZwZ_OIc_GLvYPpbzDnqJcYg9yVzxEpsRJ2NuAH",
    alt: "Action shot of a muddy 4x4 off-road vehicle deep in an Australian outback trench struggling for traction",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHjhP93Gvct7A6zArysg2ibZr1Izi1tTvuv0Bnf1qjANO7WZNsoReuPjEkn5YGbPaCRiK5E2mSuW1wpab3lzZzO8kwu_5GyQRSEzMeo0H1YxaolmT00RmMqNPfPDOmYnNJktriiYjcij5vyr8zl_WY7KcMJTDFoJirejpR1LXbfKG4LaVECoAsaua3Pe1l9h-KB6AlQxQkvsjtmqv3OOLQlyzHT3SK7EG7irRfzOXdY_VmbmIEi4HSLhjOI3a_EiVjFqKXFpDtGRyr",
    alt: "Detail shot of the aggressive interlocking nylon cleats on tactical recovery gear casting strong shadows",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJTu62xox3Mb5tkpTCUKIP0PyxP17ItDQixl9aQg1WMmUR1fBZeOZPAX21v6WESCjuIzgi96OeH_sfq7QVpw0iAXSWWfygkHU2h7RptRCvy8AuIQ9ta1gIfHV_ETfK8h457AzgvbBdVWgWweiIs6BMPBgDDGFiIv8R1RGzKCw8fNLz_hoiqn3CRhtvYSTIumeWKbQt7JWieHwHejcFRFNYXaYz1MFhkC--k6IdazifR5D0NCG5xyihs5PpFPwtayVXiKNm85Rba-Zy",
    alt: "Heavy duty matte black overland vehicle roof rack loaded with extreme expedition equipment and recovery boards",
  },
];

const specRows = [
  {
    label: "Material Matrix",
    value:
      "Engineering-grade, fiber-reinforced Nylon. Extreme temperature resistance core operational between -30°C to +80°C.",
  },
  {
    label: "Physical Profile",
    value:
      "1150mm x 330mm x 85mm. Engineered with interlocking geometry for seamless stacking and minimal aerodynamic drag when roof-mounted. Weight: 3.2kg per unit.",
  },
];

const tractionNodes = ["Aggressive Cleats", "Self-Cleaning", "Dual Ramps"];

const ratingBreakdown = [
  { stars: 5, pct: 75 },
  { stars: 4, pct: 15 },
  { stars: 3, pct: 5 },
  { stars: 2, pct: 3 },
  { stars: 1, pct: 2 },
];

export default function TacticalRecoveryTracksPage() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full">
      {/* Product Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-3 p-4 mt-6 max-w-screen-2xl mx-auto">
        <div className="relative aspect-video overflow-hidden rounded-sm">
          <Image
            src={galleryImages[0].src}
            alt={galleryImages[0].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="grid grid-rows-2 gap-3">
          {gridImages.map((img, i) => (
            <div key={i} className="relative aspect-auto overflow-hidden rounded-sm">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 lg:px-40">
        <div className="flex flex-col max-w-[960px] flex-1">
          {/* Header */}
          <h1 className="text-on-surface uppercase tracking-[-0.02em] font-headline text-[3.5rem] font-bold leading-tight px-4 text-left pb-3 pt-6">
            Tactical Recovery Tracks
          </h1>

          {/* Reviews */}
          <div className="flex flex-wrap gap-x-8 gap-y-6 p-4 border-b border-outline-variant/15 pb-8">
            <div className="flex flex-col gap-2">
              <p className="text-on-surface text-4xl font-headline font-black leading-tight tracking-[-0.033em]">
                4.8
              </p>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i <= 4
                        ? "fill-primary text-primary"
                        : "text-primary/30"
                    }
                  />
                ))}
              </div>
              <p className="text-tertiary text-base font-normal leading-normal">
                342 reviews
              </p>
            </div>

            <div className="grid min-w-[200px] max-w-[400px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-y-3">
              {ratingBreakdown.map((r) => (
                <div key={r.stars} className="contents">
                  <p className="text-on-surface text-sm font-normal leading-normal">
                    {r.stars}
                  </p>
                  <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
                    <div
                      className="rounded-full bg-primary"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                  <p className="text-tertiary-fixed-dim text-sm font-normal leading-normal text-right">
                    {r.pct}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price & CTA */}
          <div className="p-4 mt-8">
            <div className="bg-surface-container-high rounded-lg p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full ml-auto md:w-11/12 border border-outline-variant/15 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
              <div className="relative z-10">
                <p className="text-tertiary font-body text-[0.75rem] uppercase tracking-[0.05em] mb-2 font-medium">
                  Expedition Grade
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-on-surface font-headline text-[3.5rem] font-bold tracking-[-0.02em] leading-none">
                    $295
                  </span>
                  <span className="text-on-surface-variant font-body text-xl">
                    .00
                  </span>
                </div>
                <p className="text-surface-variant text-sm mt-2 font-body">
                  Free shipping to mainland outposts.
                </p>
              </div>
              <button className="w-full md:w-auto bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold py-4 px-8 rounded-sm flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-[0_40px_40px_-10px_rgba(14,14,14,0.4)] relative z-10 group">
                <ShoppingCart size={20} className="transition-transform group-hover:scale-110" />
                <span>Add to Arsenal</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 mt-12 flex flex-col gap-6">
            <h2 className="text-on-surface font-headline text-[1.75rem] font-bold">
              Built for the Unforgiving.
            </h2>
            <p className="text-on-surface-variant font-body text-[0.875rem] leading-[1.6] max-w-2xl">
              Engineered for the harshest environments on earth. Whether you are
              bogged in the deep coastal sands of Fraser Island or axle-deep in
              volcanic mud, the Tactical Monolith Recovery Tracks provide the
              ultimate traction matrix. Forged from impact-resistant,
              UV-stabilized nylon, these tracks are designed to flex under
              extreme pressure without catastrophic failure, wrapping the
              kinetic energy of your vehicle into pure forward momentum.
            </p>
            <p className="text-on-surface-variant font-body text-[0.875rem] leading-[1.6] max-w-2xl">
              The asymmetrical cleat pattern locks onto tire tread blocks
              instantly, preventing wheel spin and mechanical burning. Do not
              leave base camp without them.
            </p>
          </div>

          {/* Technical Specs */}
          <div className="p-4 mt-16 mb-24">
            <h2 className="text-on-surface font-headline text-[1.75rem] font-bold mb-8">
              Technical Diagnostics
            </h2>
            <div className="flex flex-col gap-8 bg-surface-container-low p-6 md:p-8 rounded-lg border border-outline-variant/15">
              {specRows.map((spec) => (
                <div key={spec.label} className="flex flex-col sm:flex-row gap-2 sm:gap-12">
                  <div className="w-48 font-body text-[0.75rem] text-tertiary uppercase tracking-[0.05em] font-medium pt-1 shrink-0">
                    {spec.label}
                  </div>
                  <div className="flex-1 text-on-surface font-body text-[0.875rem] leading-[1.6]">
                    {spec.value}
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-12">
                <div className="w-48 font-body text-[0.75rem] text-tertiary uppercase tracking-[0.05em] font-medium pt-1 shrink-0">
                  Traction Nodes
                </div>
                <div className="flex-1 flex flex-wrap gap-3">
                  {tractionNodes.map((node) => (
                    <div
                      key={node}
                      className="bg-secondary-container text-on-secondary-container px-4 py-1.5 text-xs font-body uppercase tracking-widest"
                      style={{
                        clipPath:
                          "polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)",
                      }}
                    >
                      {node}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Edition Variants */}
          <div className="p-4 mb-16">
            <h2 className="text-on-surface font-headline text-[1.75rem] font-bold mb-8">
              Explore Editions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/gear/tactical-recovery-tracks/modern-edition"
                className="group bg-surface-container-high rounded-lg overflow-hidden flex flex-col border border-outline-variant/15 hover:border-primary transition-colors"
              >
                <div className="h-48 bg-surface-container-lowest relative overflow-hidden">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGYM-QBBRPW4q1hkmM8GXWJPwpnUETqX5vONqo6fPbPSuaypWuXK5hYEB_jyq343b5XfxWULdCfw_WMJEC4Xlhw6q0pbWYJ3Y7AMHXQTta2gu46lpnmciRoQuEeiRnO8gOfilPIil4eGVLSMLpsMvLUtSkAmV4AVtawyElGAwiQkhrVR8xmlL4JY0liIgFCyTtTmPXk3ZROPTs_PTrevWwkPwR2hkrKdqcAAcIj9Y1CPGrLIFAVBxDR3r0cT-GviznJGVVkcD-1CUO"
                    alt="Tactical Recovery Tracks Modern Edition"
                    fill
                    className="object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-headline text-headline-md text-on-surface mb-1">
                    Modern Edition
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    Enhanced basalt-polymer construction with UV-stabilized
                    coating.
                  </p>
                  <p className="text-secondary font-headline font-bold mt-3">
                    From $295.00
                  </p>
                </div>
              </Link>

              <Link
                href="/gear/tactical-recovery-tracks/sleek-edition"
                className="group bg-surface-container-high rounded-lg overflow-hidden flex flex-col border border-outline-variant/15 hover:border-primary transition-colors"
              >
                <div className="h-48 bg-surface-container-lowest relative overflow-hidden">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOD0lLRzjGfBvMnA9Gv2RHbLCWxp0BZM1h_FVjJQk77d-KvkEZvdVdXPZYy0N77DCclMEM6riBiat9FxcMUge3W-P_aJjTGyNqWrU8oG3UW0YDEIgnpsLsodHHTd50WhLSOdq-oDUjvGahGftUeopvttAlCzgmDGovXYuyZfb4qKjF3EoPoZbhdKGJDXzGVMoBvMnj2Q97KxKp_nyaEX-DLc-A5kOt940WLL6i8fZwZ_OIc_GLvYPpbzDnqJcYg9yVzxEpsRJ2NuAH"
                    alt="Tactical Recovery Tracks Sleek Edition"
                    fill
                    className="object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-headline text-headline-md text-on-surface mb-1">
                    Sleek Edition
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    Streamlined profile with integrated mounting brackets and
                    carry handles.
                  </p>
                  <p className="text-secondary font-headline font-bold mt-3">
                    From $349.00
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
