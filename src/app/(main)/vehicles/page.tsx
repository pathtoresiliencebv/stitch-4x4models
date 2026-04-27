"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, User, Search, Menu } from "lucide-react";
import { useState } from "react";

export default function VehiclesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-noise">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-surface-container-lowest">
        <Image
          alt="Toyota Off-Road"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrjVDKX9KCaJy6eqZnFKxu8vqXGziuSMqocITVNjaUDzxiZstfyWF_F1aR4wrMrTB8_-CdW5PFm4r5RkEo0DTzZ-Je0asp1n7m7FzAikezP8GnFpyTWfFyaELQ-3IVI5vq2Om8FgJ0IgyBmocA40EQDD6z-5wmeHuZUqKRTdgFljh_k71aohApcAyU8Equ5RHrmjFinQ8b3DeBg-51ltoZpiPsqHqrumKBP2bkNHDruACkXXSlZRjyoZJdDb3PFXjoePYhj4-Y7yTZ"
          fill
          className="object-cover opacity-60 mix-blend-luminosity"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="font-headline text-5xl md:text-7xl font-bold uppercase tracking-tighter text-on-surface mb-6 leading-tight"
              style={{ textShadow: "0 0 20px rgba(234, 107, 30, 0.5)" }}>
            Fuel Your Off-Road<br />
            <span className="text-primary-container">Adventure</span>
          </h1>
          <p className="font-body text-xl text-on-surface-variant max-w-2xl mb-10 leading-relaxed">
            The ultimate destination for Toyota enthusiasts. Build guides, gear reviews, and a community of overlanders ready for the dirt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline uppercase font-bold py-4 px-8 rounded-lg tracking-wide hover:brightness-110 transition-all duration-300">
              Read the Latest
            </button>
            <button className="bg-outline/20 border border-outline-variant text-on-surface font-headline uppercase font-bold py-4 px-8 rounded-lg tracking-wide hover:bg-outline/30 transition-all duration-300">
              Join the Community
            </button>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Grid */}
      <section className="py-24 px-6 max-w-screen-2xl mx-auto bg-surface relative z-20">
        <div className="mb-12">
          <h2 className="font-headline text-3xl font-bold uppercase tracking-tight text-on-surface mb-2">Featured Rigs</h2>
          <div className="h-1 w-16 bg-primary-container" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tacoma Card */}
          <Link href="/vehicles/tacoma" className="bg-surface-container-high group cursor-pointer block">
            <div className="h-64 overflow-hidden relative rounded-t-none">
              <Image
                alt="Highly modified Toyota Tacoma front grille and suspension setup covered in mud"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhAOANAf18k1ZdMs7RE3gq9g2ie86m7ntgcwiatfiSOsPFT-lEEEc5iIue2b-d50UCX_odMYPDlXjjkDNAnGcQINN2SINnLbF-k3rh-W8jHTjf7L6E1q1UFx2FJJrodoqWXY1JhyifjuA4yPR7C3T-gxt_5yUUs6e0UYzem5xqFONMLHkd5AIWWCWDBGDbJhs3PyrswvXWplkpU3_smOMwDtcAhvbVEg-IRhtxVnj6xft0OD-JRyu8bUI85AhTyNJS6EPPOVP_Pa3j"
                width={400}
                height={256}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md px-3 py-1 font-label text-primary-container rounded-sm text-xs uppercase tracking-widest">Tacoma</div>
            </div>
            <div className="p-6">
              <h3 className="font-headline text-xl font-bold text-on-surface mb-2">The Desert Runner Build</h3>
              <p className="font-body text-on-surface-variant text-sm mb-4 line-clamp-2">Complete breakdown of long-travel suspension geometry and tire selection for high-speed desert operations.</p>
              <span className="text-secondary font-headline text-sm font-bold uppercase flex items-center gap-1 group-hover:text-primary transition-colors">
                View Specs <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Land Cruiser Card - offset up */}
          <Link href="/vehicles/land-cruiser" className="bg-surface-container-high group cursor-pointer block md:-translate-y-8">
            <div className="h-80 overflow-hidden relative rounded-t-none">
              <Image
                alt="Toyota Land Cruiser 70 series traversing a steep rocky mountain pass"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDut52pJzs4ibQNEALtrDy7mmDztgckBO8JG6mgLq7y8IcaXDGRPB4n-Tyfvz4k3t4L1Jh0pILtbA6v-OKr6cKfoFuz-c8HM8LvEjBrHBHmcmg9B-qxO4rVwV59H9Lf2puXgeKIBeEGm7QkNtswmx6jrtEhHT1NhxlXBgUXiruciymUJ-lksgr6ffP8fqnNKrhojXmrkyB1fcfcKabmwGgdEREsKNMsmVCImOagg5qzJVNcdR-sKhOmCmwrhKk5zwzxiIKeb3nfFeMi"
                width={400}
                height={320}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md px-3 py-1 font-label text-primary-container rounded-sm text-xs uppercase tracking-widest">Land Cruiser</div>
            </div>
            <div className="p-6">
              <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Heritage Expedition</h3>
              <p className="font-body text-on-surface-variant text-sm mb-4 line-clamp-2">Restoring and modernizing a 70-series for extended off-grid capability without losing its mechanical soul.</p>
              <span className="text-secondary font-headline text-sm font-bold uppercase flex items-center gap-1 group-hover:text-primary transition-colors">
                View Specs <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Hilux Card */}
          <Link href="#" className="bg-surface-container-high group cursor-pointer block">
            <div className="h-64 overflow-hidden relative rounded-t-none">
              <Image
                alt="Toyota Hilux parked by a river at a campsite with a rooftop tent deployed"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFXE77FHj-vJcSvNFZSVgl4lIorMhz5UbTCRtZCeLrekRxoAyaDNDiO0KPnp2X3LsgAzd9aqX837oh8xjZAzETJgo9svAdme3E1_VPOK5Pr1GgveNQhbj9qt5DmdMYRl1aqbOc_SczOYIasGJO_A3I2ku2L07ScrwyezEx_fsHOlOnu75aY_SgvXcGrz8xpd8-_BQMD9J5YaA8pNBdOkQ5QG05COzsITsLvNgA2NCa3Nxcv5gcsi8e_RlZOjuLw2NL2fbngzS8Oatr"
                width={400}
                height={256}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md px-3 py-1 font-label text-primary-container rounded-sm text-xs uppercase tracking-widest">Hilux</div>
            </div>
            <div className="p-6">
              <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Weekend Warrior Setup</h3>
              <p className="font-body text-on-surface-variant text-sm mb-4 line-clamp-2">Balancing daily drivability with weekend camping utility. A masterclass in modular packing.</p>
              <span className="text-secondary font-headline text-sm font-bold uppercase flex items-center gap-1 group-hover:text-primary transition-colors">
                View Specs <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Newsletter Banner */}
      <section className="bg-surface-container-highest py-20 px-6 my-12 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 hidden lg:block">
          <Image
            alt="Abstract topographical map lines"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeQwuYrwMVA_OA_nDdEC_Ri_sQyt4yrxN6Y06Ncogq61Cx-OPKjyH4sthHYhNN_pBbsgyhJ28ob_Dpwpk4jid0CcWyVUdFYQKqVNwflHjpA4UtVYuer6XATSKRPhbNVBNxW144mgX6iIGJ-hMLKg4NbWx2A8Q-aFa88ua-ypxocXGLT-Y1UQFgkUJPhMZO4T6tqDaSvYywIempjcMhtC0n4X8rQX7aTnaoGoUGmIMhHsSA4MDdJn9k26Um_jJlKEtTuNWsErvAJfIk"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-screen-xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-sm font-label mb-4 text-xs uppercase tracking-widest"
                 style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0 100%)" }}>
              FREE GUIDE
            </div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-4 uppercase tracking-tight">The Overland Packing Manual</h2>
            <p className="font-body text-on-surface-variant mb-8 text-lg">Subscribe to the dispatch and get our 24-page guide to essential recovery gear, tools, and comms for your next major trip.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                className="bg-surface-container-lowest border-b-2 border-surface-container-lowest focus:border-primary text-on-surface px-4 py-3 outline-none font-body text-sm w-full transition-colors placeholder:text-outline/50"
                placeholder="YOUR EMAIL ADDRESS"
                type="email"
              />
              <button
                className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline uppercase font-bold py-3 px-8 rounded-lg tracking-wide hover:brightness-110 transition-all whitespace-nowrap"
                type="submit"
              >
                Send It
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden bg-surface-container-high fixed bottom-0 left-0 w-full flex justify-around items-center h-20 pb-safe px-4 z-50 border-t-4 border-surface-container-lowest shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
        <Link className="flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-sm px-4 py-1 transition-all duration-200" href="/">
          <Home className="w-5 h-5" />
          <span className="font-label text-[10px] uppercase font-medium tracking-widest mt-1">Home</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-outline px-4 py-1 hover:text-on-surface transition-colors" href="#">
          <Search className="w-5 h-5" />
          <span className="font-label text-[10px] uppercase font-medium tracking-widest mt-1">Explore</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-outline px-4 py-1 hover:text-on-surface transition-colors" href="#">
          <Menu className="w-5 h-5" />
          <span className="font-label text-[10px] uppercase font-medium tracking-widest mt-1">Garage</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-outline px-4 py-1 hover:text-on-surface transition-colors" href="#">
          <User className="w-5 h-5" />
          <span className="font-label text-[10px] uppercase font-medium tracking-widest mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
