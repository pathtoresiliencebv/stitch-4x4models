"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  ChevronRight,
  ArrowRight,
  User,
} from "lucide-react";

// Mock data for deep dive article
const article = {
  slug: "simpson-desert-sand-survival",
  category: "Editor's Choice",
  categoryTag: "Technical Guide",
  title: "The Simpson Desert: Sand, Sweat & Survival",
  subtitle:
    "A grueling 500-kilometer trek across the world's largest parallel sand dune desert. We put the new monolithic suspension systems to the ultimate test.",
  author: {
    name: "Jack Reynolds",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAmB-Rhsd8msTvJgS39O0hjKoE8b0bq9liZVsdBkCqT1LCrSkqgSBfdwrI404ML6512Et8BPmj-0Id8Ypq0_bju7h1gTOQWKIkUOuXPoxfG3dAmQoM0AI75UJaUCmaL60RlnLNLttAHMQdG3PurMxnFhqp8GzoFttuLR4CvHiXUbQHcqZKooiflHrO7K5DUBsnpIqKcWtjtfPBXN_zla4GboRass0R0yo10tl1NNpxYemQEpao-DKjj1dwR1sxfBYwSv-z_tdu2IwBI",
    role: "Expedition Lead",
  },
  date: "Oct 12, 2024",
  heroImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD5z8Exqfm0yU6ev8HYk_mJP5aCvQo8D9XhWNzyh2q-o8xNnpfLxyYr8lKb5MN36axDIMKXmnWjbI3G55RccMXCebCBr0H9vdtvGYXDN00O2bg_J4SEBcKpUrIUI_rzT2lVdSKVPU00gvDIT1WnYWPRfsQmNzQampru9GaozOEb6v_SIoTcFdAAFTOzi3E9GW4PuvK9lL3D-RNHBbf2YNQ72Y1v-KXEo-P2bngq4cd12NkaFZ_okPCVs1BX58cez58Z4DFVRI-jKJqT",
  heroAlt:
    "Rugged 4x4 vehicle tackling a steep, rocky mountain pass at sunset, dust kicking up, dramatic lighting",
};

const sitreps = [
  {
    type: "Gear Update",
    title: "New Titanium Recovery Tracks Announced",
    excerpt: "Lighter, stronger, and more expensive. Are they worth the upgrade?",
    borderColor: "border-primary-container",
  },
  {
    type: "Route Condition",
    title: "Canning Stock Route Washouts",
    excerpt:
      "Recent rains have severely degraded sections 12-15. Proceed with extreme caution.",
    borderColor: "border-surface-bright",
  },
  {
    type: "Vehicle News",
    title: "Defender V8 Altitude Tests",
    excerpt:
      "Initial reports from the Andes show promising torque retention at 4000m.",
    borderColor: "border-surface-bright",
  },
  {
    type: "Event",
    title: "Overland Expo West 2025",
    excerpt:
      "Dates confirmed. Prepare for the largest gathering of rigs in North America.",
    borderColor: "border-surface-bright",
  },
];

const deepDives = [
  {
    slug: "offline-navigation",
    category: "Technical Guide",
    title: "Mastering Offline Navigation: Beyond the GPS",
    excerpt:
      "When the satellites fail and the screen goes dark, true navigators rely on topography, dead reckoning, and instinct.",
    author: "Sarah Jenkins",
    readTime: "15 Min Read",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkpWlJdrLM1D2UWZvh5h8dxWOfSrnmLh3OeOg__Q7t2O9n8NrY2UNHvyguGaBzDMTJ6Nw_dO6_WcfQNAV5dV0NptwnqlM_kJZzxfZ9sPDlmIhf8iKbbMoqeLCKxwPAaqdjLMWiOECjSU242ZeH14sTKGcmCT3BZF7y7v-zM2X1BLfa8I2xd4qW25lT0tocSq7CXa0UKn85aSexHQpWMqE9Ws1iOU-wSSv2Tqsm-Ezo6ILpgPM2leEi4jcwpPvS0EwcHSkzdEETaXob",
    alt: "Close up of a complex GPS navigation system mounted on a rugged vehicle dashboard",
  },
  {
    slug: "70-series-land-cruiser",
    category: "Vehicle Build",
    title: "The 70 Series Land Cruiser: A Monolith Reborn",
    excerpt:
      "Examining a restomod that costs more than a supercar, built entirely for enduring the harshest environments on Earth.",
    date: "Oct 08, 2024",
    borderColor: "border-outline-variant/10",
  },
  {
    slug: "water-filtration",
    category: "Survival",
    title: "Water Filtration in Extreme Alkaline Environments",
    excerpt:
      "Standard filters fail when the pH spikes. How to process water from desert pans without destroying your kidneys.",
    date: "Oct 05, 2024",
    borderColor: "border-outline-variant/10",
  },
];

const archives = [
  {
    slug: "minimalist-camp",
    category: "Campcraft",
    title: "The Minimalist Camp: Cutting the Fat",
    excerpt:
      "Why half the gear you carry is a liability, and how to embrace a leaner, faster camp setup.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVgi6VF1IURJ0oPbPljt5TgwXC5pS2aN_KShTSzrke5QphBHo76L7wM00QGFky2kyhsJK-9LSNs6BsD3tHtogQZAdqhM7v3skDVuqlq229oBJ5GbNfN5XOd0vvjqbW7WDcN1pSqOuFfsvyZl1FgKw64e0bl0iYZ3ZxO9Vaw4meQMQILLTtoyhgbNUwLQOgIKZePElS9-G_e8WDieHNcv-EOsrmnOwXi11T-zgVRiTddVKbdg_8yaxlykiEnB3y6HW3UDfXejYnuIBI",
    alt: "Minimalist camp setup with a canvas tent and fire pit in a vast desert landscape at dusk",
  },
  {
    slug: "tire-pressure",
    category: "Maintenance",
    title: "Tire Pressure Anatomy: The 1 PSI Difference",
    excerpt:
      "A technical deep dive into carcass flex, footprint elongation, and the physics of traction in deep sand.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAAcgoc0ixvwwl7Gd09pYXK4h1NvS5FHkcr-6Uw3LCqwJM-0D3k539EFBJkyzVlLPemCVcdEduAw1nVPic8HfBewG0Dz6Rs5s1up-feNzAjWBOKYyXRb55Wvdz5e5LUxgzp42c3fFvrcHVoXbAQQL-sYe1s9I8vO9QT66sHCgWD8dDKIsAAOtximfypGUil-ALpM-_cEqh5nqXHoZrhrQenaeRz1YLui8dmmfO_Q4uOdEUMXovXvOVDvILC-hW39jBSsmB0TSiSIce7",
    alt: "Close up of aggressive mud-terrain tire treads caked in dry clay and dirt",
  },
  {
    slug: "sub-zero-operations",
    category: "Expedition",
    title: "Sub-Zero Operations: The Arctic Challenge",
    excerpt:
      "Fluid management and battery survival when temperatures drop below -30°C.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPCrFSc2e2Rk0dEf1cheDPZHfbKZGRoaYez5eMjdeEV9OJHX3kYBjWr9wJl3x7umTGbL57TNAU0i2mHn7P2FTzx93U_BbSHYn0EkTbvEwOybNoQDqo4AfeQD8hxwkXSJR-OXcfeLdZmxpmWvuZoHGHXZmfFsme9QndOVIfb8jBPFQv5T4sC7v1uM87b0qPNJKtwFZhuMFZK3Tc4wz6I-YjTfV4dnlnJNVTXWI3yHCkwUgrlGR4L8iqo5Ccs9UWTKPXmAFI3GHDK9Rg",
    alt: "4x4 vehicle driving through a blizzard in a dense pine forest, headlights cutting through snow",
  },
];

export default function JournalArticlePage() {
  return (
    <main className="flex-grow pt-20">
      {/* Editor's Choice Hero */}
      <section className="relative w-full h-[716px] min-h-[600px] flex items-end mb-8 bg-surface-container-lowest">
        <div className="absolute inset-0 z-0">
          <Image
            src={article.heroImage}
            alt={article.heroAlt}
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 pb-16 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-3xl">
            <span className="inline-block bg-secondary-container text-on-secondary-container font-label text-xs uppercase tracking-widest px-3 py-1 mb-4 rounded-sm">
              {article.category}
            </span>
            <h1 className="font-headline font-bold text-display-lg text-on-surface leading-none tracking-tighter mb-6 uppercase">
              {article.title}
            </h1>
            <p className="font-body text-title-lg text-on-surface-variant max-w-2xl mb-8">
              {article.subtitle}
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant/30">
                <Image
                  src={article.author.avatar}
                  alt={`Portrait of ${article.author.name}`}
                  width={48}
                  height={48}
                  className="object-cover grayscale"
                />
              </div>
              <div>
                <p className="font-body font-bold text-on-surface">
                  {article.author.name}
                </p>
                <p className="font-label text-tertiary uppercase tracking-widest text-[10px]">
                  {article.author.role} • {article.date}
                </p>
              </div>
            </div>
          </div>
          <Link
            href="#"
            className="group flex items-center justify-center w-16 h-16 bg-surface-container-high rounded-full border border-outline-variant/20 hover:bg-primary-container transition-colors duration-300"
          >
            <ExternalLink className="w-6 h-6 text-on-surface group-hover:text-on-primary transition-colors" />
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 w-full flex flex-col gap-16 pb-24">
        {/* Quick Sitreps (Horizontal) */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-headline font-bold text-headline-md uppercase text-on-surface tracking-tight">
              Field Sitreps
            </h2>
            <Link
              href="#"
              className="font-label text-secondary uppercase tracking-widest text-xs flex items-center gap-1 hover:text-primary transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {sitreps.map((sitrep, index) => (
              <div
                key={index}
                className={`bg-surface-container p-5 border-l-2 ${sitrep.borderColor} hover:bg-surface-container-high transition-colors`}
              >
                <span className="font-label text-tertiary uppercase tracking-widest text-[10px] mb-2 block">
                  {sitrep.type}
                </span>
                <h3 className="font-body font-bold text-on-surface mb-2 leading-tight">
                  {sitrep.title}
                </h3>
                <p className="font-body text-sm text-on-surface-variant">
                  {sitrep.excerpt}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Deep Dives (Bento Grid Style) */}
        <section>
          <div className="flex justify-between items-end mb-8 border-b border-surface-container-lowest pb-4">
            <h2 className="font-headline font-bold text-headline-md uppercase text-on-surface tracking-tight">
              Deep Dives
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Feature Card */}
            <article className="md:col-span-8 bg-surface-container-high rounded-none relative group overflow-hidden min-h-[400px] flex flex-col justify-end">
              <Image
                src={deepDives[0].image!}
                alt={deepDives[0].alt!}
                fill
                className="absolute inset-0 object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
              <div className="relative z-10 p-8">
                <span className="inline-block bg-surface/80 backdrop-blur-md text-primary font-label text-[10px] uppercase tracking-widest px-2 py-1 mb-3 rounded-sm border border-outline-variant/30">
                  {deepDives[0].category}
                </span>
                <Link href={`/journal/${deepDives[0].slug}`}>
                  <h3 className="font-headline font-bold text-3xl uppercase tracking-tight text-on-surface mb-3 group-hover:text-primary transition-colors">
                    {deepDives[0].title}
                  </h3>
                </Link>
                <p className="font-body text-on-surface-variant mb-6 max-w-xl">
                  {deepDives[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-tertiary" />
                    <span className="font-label text-xs uppercase tracking-widest text-tertiary">
                      {deepDives[0].author}
                    </span>
                  </div>
                  <span className="font-label text-xs uppercase tracking-widest text-tertiary">
                    {deepDives[0].readTime}
                  </span>
                </div>
              </div>
            </article>

            <div className="md:col-span-4 flex flex-col gap-6">
              {/* Medium Card 1 */}
              <article className="flex-1 bg-surface-container-low border border-outline-variant/10 hover:border-outline-variant/30 transition-all p-6 flex flex-col justify-between group">
                <div>
                  <span className="font-label text-[10px] uppercase tracking-widest text-secondary mb-2 block">
                    {deepDives[1].category}
                  </span>
                  <Link href={`/journal/${deepDives[1].slug}`}>
                    <h3 className="font-body font-bold text-title-lg text-on-surface mb-3 leading-tight group-hover:text-primary transition-colors">
                      {deepDives[1].title}
                    </h3>
                  </Link>
                  <p className="font-body text-sm text-on-surface-variant line-clamp-3">
                    {deepDives[1].excerpt}
                  </p>
                </div>
                <div className="mt-6 flex justify-between items-center pt-4 border-t border-surface-container-lowest">
                  <span className="font-label text-[10px] uppercase tracking-widest text-tertiary">
                    {deepDives[1].date}
                  </span>
                  <ArrowRight className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
                </div>
              </article>

              {/* Medium Card 2 */}
              <article className="flex-1 bg-surface-container-highest border border-outline-variant/10 hover:border-outline-variant/30 transition-all p-6 flex flex-col justify-between group">
                <div>
                  <span className="font-label text-[10px] uppercase tracking-widest text-secondary mb-2 block">
                    {deepDives[2].category}
                  </span>
                  <Link href={`/journal/${deepDives[2].slug}`}>
                    <h3 className="font-body font-bold text-title-lg text-on-surface mb-3 leading-tight group-hover:text-primary transition-colors">
                      {deepDives[2].title}
                    </h3>
                  </Link>
                  <p className="font-body text-sm text-on-surface-variant line-clamp-3">
                    {deepDives[2].excerpt}
                  </p>
                </div>
                <div className="mt-6 flex justify-between items-center pt-4 border-t border-surface-container-lowest">
                  <span className="font-label text-[10px] uppercase tracking-widest text-tertiary">
                    {deepDives[2].date}
                  </span>
                  <ArrowRight className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
                </div>
              </article>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Recommended List (2 Columns) */}
          <section className="md:col-span-2">
            <h2 className="font-headline font-bold text-xl uppercase text-on-surface tracking-tight mb-6 pb-2 border-b border-surface-container-lowest">
              From the Archives
            </h2>
            <div className="flex flex-col gap-8">
              {archives.map((item) => (
                <article
                  key={item.slug}
                  className="flex gap-6 group cursor-pointer"
                >
                  <div className="w-24 h-24 bg-surface-container-highest flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-label text-[10px] uppercase tracking-widest text-tertiary mb-1">
                      {item.category}
                    </span>
                    <Link href={`/journal/${item.slug}`}>
                      <h4 className="font-body font-bold text-lg text-on-surface mb-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                    </Link>
                    <p className="font-body text-sm text-on-surface-variant line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* SITREP Newsletter Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-surface-container-high p-8 border-t-4 border-primary relative overflow-hidden h-full flex flex-col justify-center">
              {/* Abstract Graphic Element */}
              <div className="absolute -right-8 -top-8 w-32 h-32 border-4 border-surface-container-lowest rounded-full opacity-50" />
              <div className="absolute -right-4 -top-4 w-16 h-16 border-2 border-primary/20 rounded-full" />

              <div className="relative z-10">
                <h3 className="font-headline font-bold text-2xl uppercase tracking-tighter text-on-surface mb-2">
                  The Sitrep
                </h3>
                <p className="font-body text-sm text-on-surface-variant mb-6">
                  Field intelligence, gear reviews, and expedition logs delivered
                  directly to your comms terminal weekly.
                </p>
                <form className="flex flex-col gap-4">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="ENTER COMM-LINK (EMAIL)"
                      className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-label text-xs uppercase tracking-widest py-3 px-0 placeholder:text-outline-variant/50 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-container to-primary text-on-primary font-headline font-bold uppercase tracking-widest py-4 mt-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(234,107,30,0.2)]"
                  >
                    Initialize Uplink
                  </button>
                </form>
                <p className="font-label text-[9px] uppercase tracking-widest text-tertiary mt-4 text-center">
                  Encrypted transmission. No spam.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
