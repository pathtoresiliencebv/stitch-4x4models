"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Check, ShoppingCart, Store, X, Menu, User } from "lucide-react";

export default function TacomaPage() {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Ambient Noise Layer */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-noise mix-blend-overlay opacity-5" />

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl">
        <div className="flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto">
          <Link href="/vehicles" className="flex items-center">
            <Image src="/images/logo.png" alt="4x4models" width={40} height={40} className="object-contain" />
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex gap-8 font-headline tracking-tight uppercase text-sm">
            <li>
              <Link className="text-on-surface hover:text-primary transition-colors pb-1" href="/vehicles">
                Explore
              </Link>
            </li>
            <li>
              <Link className="text-primary border-b-2 border-primary pb-1" href="/vehicles/tacoma">
                Reviews
              </Link>
            </li>
            <li>
              <Link className="text-on-surface hover:text-primary transition-colors pb-1" href="/vehicles/merch">
                Merch
              </Link>
            </li>
          </ul>

          {/* Trailing Actions */}
          <div className="flex items-center gap-4">
            <button className="text-on-surface hover:text-primary transition-all duration-300 p-2 rounded scale-95 active:opacity-80">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="bg-surface-container-high h-[1px] w-full" />
      </nav>

      {/* Main Content */}
      <main className="flex-1 z-10 pt-24 pb-24">
        {/* Hero Title Area */}
        <header className="max-w-screen-2xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7 pb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 text-xs font-label uppercase tracking-widest rounded-sm"
                    style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0 100%)" }}>
                Lighting
              </span>
              <span className="text-tertiary text-xs font-label uppercase tracking-widest">Field Tested</span>
            </div>

            <h1 className="font-headline text-4xl md:text-6xl leading-none tracking-tight text-on-surface uppercase mb-6">
              Piercing the <br />
              <span className="text-primary">Outback Dark</span>
            </h1>

            <p className="font-body text-xl text-tertiary-fixed-dim max-w-2xl leading-relaxed">
              A comprehensive review of the ARB Intensity V2 LED Driving Lights. Do they live up to the rugged reputation?
            </p>

            {/* Metadata */}
            <div className="flex items-center gap-6 mt-8 border-l-4 border-surface-container-high pl-6 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden">
                  <Image
                    alt="Author portrait"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU19dRQf21HmdNGTc96RxZsZJ_ghahyG6iM0eLx_5iuYaBkScDdsFyEndDCcqIQqO3IcgVXfjK_F4DqYKwNoGXmbUUxYMftoB8GoX8Hwr6Uk_PngvPrBi1-Jdfy0ep9fDXWPOpOITdZA0rujHu2zrA8uF2Iu1JONtIajOEBMyN5ryKZxM0vdsDEDqVXqth_srBmIqXxkVuF7SgMJZ7XJk520GpWpG7yX_t9Y3T_76y7F-QCzx2plp10hcEjF3tww4CN5cX4nfvK1Oz"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-label text-sm text-on-surface uppercase tracking-wider">Commander</p>
                  <p className="font-label text-xs text-tertiary uppercase">4x4 Enthusiast</p>
                </div>
              </div>

              <div className="h-8 w-px bg-surface-container-highest hidden sm:block" />

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <p className="font-label text-sm text-on-surface uppercase tracking-wider">Oct 12, 2024</p>
              </div>

              <div className="h-8 w-px bg-surface-container-highest hidden sm:block" />

              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <p className="font-label text-sm text-on-surface uppercase tracking-wider">8 Min Read</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-5 h-[400px] lg:h-[600px] relative -mx-6 lg:mx-0 lg:-mr-12 rounded-l-xl lg:rounded-l-none overflow-hidden bg-surface-container-low">
            <Image
              alt="X-up of ARB LED driving lights mounted on front bullbar at dusk"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnwuAoUQYBWqomJO3XPksrHwXJmZqdZj3KBauiASCP-mz7m8S5EyzG9l4Q0ERfMdiSn8aktCHzFb9JiRrAQ0sCvYaL-UqDfeD8hL9_Nh5NgKh16zcDWBUxD6J-Co-549xs8jAOTYU2MBSrAe5u0-d30lr8_vXkNqoNZwl6UYB6RtTKOOPwY6OsmwARjsQsYfjhwzoJ0H3PEdlxnUXDME_C2rvnEcJVwIOqrA6F_sS6A4FmB1ZNClPWPcXvEY16OxK3nkMjkSW75IjH"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent opacity-80 lg:opacity-100" />
          </div>
        </header>

        {/* Article Container */}
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
          {/* Sticky TOC (Left Column) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 bg-surface-container-lowest p-6 rounded-xl">
              <h4 className="font-headline text-lg font-bold text-on-surface uppercase tracking-tight mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                Contents
              </h4>
              <ul className="flex flex-col gap-4 font-label text-sm tracking-wide">
                <li>
                  <a className="text-secondary hover:text-primary transition-colors flex items-center gap-2" href="#build">
                    <span className="w-1 h-1 bg-primary rounded-full" /> Build Quality
                  </a>
                </li>
                <li>
                  <a className="text-tertiary hover:text-on-surface transition-colors flex items-center gap-2" href="#performance">
                    <span className="w-1 h-1 bg-outline rounded-full" /> Illumination Performance
                  </a>
                </li>
                <li>
                  <a className="text-tertiary hover:text-on-surface transition-colors flex items-center gap-2" href="#installation">
                    <span className="w-1 h-1 bg-outline rounded-full" /> Installation Process
                  </a>
                </li>
                <li>
                  <a className="text-tertiary hover:text-on-surface transition-colors flex items-center gap-2" href="#specs">
                    <span className="w-1 h-1 bg-outline rounded-full" /> Technical Specs
                  </a>
                </li>
                <li>
                  <a className="text-tertiary hover:text-on-surface transition-colors flex items-center gap-2" href="#verdict">
                    <span className="w-1 h-1 bg-outline rounded-full" /> Final Verdict
                  </a>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <article className="lg:col-span-9 space-y-12">
            {/* Pros & Cons Box */}
            <div className="bg-surface-container-high p-8 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <h3 className="font-headline text-xl font-bold text-primary flex items-center gap-2 mb-4 uppercase">
                  <Check className="w-5 h-5" />
                  The Good
                </h3>
                <ul className="space-y-3 font-body text-on-surface-variant">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    Machined aluminum housing is virtually indestructible.
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    Exceptional throw distance; turns night into day.
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    Waterproofing handles deep river crossings flawlessly.
                  </li>
                </ul>
              </div>

              <div className="bg-surface-container p-6 rounded-lg">
                <h3 className="font-headline text-xl font-bold text-error flex items-center gap-2 mb-4 uppercase">
                  <X className="w-5 h-5" />
                  The Bad
                </h3>
                <ul className="space-y-3 font-body text-tertiary">
                  <li className="flex items-start gap-3">
                    <X className="w-4 h-4 text-error mt-0.5 shrink-0" />
                    Premium price point isn&apos;t for casual weekenders.
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-4 h-4 text-error mt-0.5 shrink-0" />
                    Significant weight requires sturdy bullbar mounting.
                  </li>
                </ul>
              </div>
            </div>

            {/* Content Block 1 */}
            <section id="build">
              <h2 className="font-headline text-3xl font-bold text-on-surface uppercase tracking-tight mb-6">Built Like a Tank</h2>
              <p className="font-body text-on-surface-variant leading-relaxed mb-6">
                When navigating treacherous corrugated roads or dense bushland, fragile gear is a liability. The V2&apos;s die-cast aluminum housing feels like a solid block of machined steel. There are no flimsy plastic bezels here; everything is bolted, sealed, and braced for impact.
              </p>
              <div className="h-64 md:h-96 w-full bg-surface-container-low rounded-t-none rounded-b-xl overflow-hidden mb-6">
                <Image
                  alt="Extreme close-up of textured black powder-coated metal housing with heavy-duty stainless steel hex bolts"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJfqWKzH7yCd45F7VJ_xn5CeZ5FdHoWPnVeqOz1qeEH33Iy9cwdXAaLFdmZ1wiDkP3cvxRLYOJCwClNfthBKRDfh2wah11mQ38E_Fl-NDa_MVmBIpCWCezb59sainJn88slYuEAiONRRwW1erOuxIIbMiDXFHSWncdnsZrvwCy0RkC6VqA7p0HqeUydzDpn3YIVo1nW7z8cN-ow6Ga2PV2pYgKnGe38vLUMOnO9a28WruUtaXg8tyUxiU7kjSEWR6iun__NSAXs7vw"
                  width={800}
                  height={384}
                  className="w-full h-full object-cover"
                />
              </div>
            </section>

            {/* Technical Specs Table */}
            <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_40px_40px_-10px_rgba(14,14,14,0.4)]" id="specs">
              <h3 className="font-headline text-xl font-bold text-on-surface uppercase mb-6 flex items-center gap-3">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                </svg>
                Technical Specifications
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body border-collapse">
                  <thead>
                    <tr className="text-tertiary uppercase text-xs tracking-widest border-b border-outline-variant/15">
                      <th className="py-4 font-label">Feature</th>
                      <th className="py-4 font-label">Specification</th>
                    </tr>
                  </thead>
                  <tbody className="text-on-surface-variant">
                    <tr className="bg-surface-container/50">
                      <td className="py-4 px-2">Lumen Output</td>
                      <td className="py-4 px-2 font-medium text-on-surface">20,000 Lumens (Pair)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-2">Color Temperature</td>
                      <td className="py-4 px-2 font-medium text-on-surface">5700K (Daylight)</td>
                    </tr>
                    <tr className="bg-surface-container/50">
                      <td className="py-4 px-2">Ingress Protection</td>
                      <td className="py-4 px-2 font-medium text-on-surface">IP68 (Dust/Waterproof)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-2">Current Draw</td>
                      <td className="py-4 px-2 font-medium text-on-surface">11.5 Amps @ 13.2V</td>
                    </tr>
                    <tr className="bg-surface-container/50">
                      <td className="py-4 px-2">Housing Material</td>
                      <td className="py-4 px-2 font-medium text-on-surface">High-Pressure Die-Cast Aluminum</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Affiliate CTAs */}
            <section className="flex flex-col sm:flex-row gap-6 mt-12 pt-12 border-t-4 border-surface-container-lowest">
              <button className="flex-1 bg-gradient-to-br from-primary to-primary-container text-on-primary font-label font-bold text-sm uppercase tracking-widest py-4 px-6 rounded-lg flex justify-center items-center gap-3 transition-all duration-300 hover:brightness-110 btn-primary-glow">
                <ShoppingCart className="w-5 h-5" />
                Check Price on Amazon
              </button>
              <button className="flex-1 bg-outline/10 border border-outline-variant/30 text-on-surface font-label font-bold text-sm uppercase tracking-widest py-4 px-6 rounded-lg flex justify-center items-center gap-3 transition-all duration-300 hover:bg-surface-container-high">
                <Store className="w-5 h-5" />
                Find on Our Shop
              </button>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
