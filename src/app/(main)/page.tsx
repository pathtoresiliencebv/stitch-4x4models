"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Map, Share, Store } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-noise">
      {/* Hero Section */}
      <section className="relative min-h-[921px] flex items-center justify-start overflow-hidden pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            alt="Toyota Land Cruiser traversing a rugged, dusty desert landscape at sunset"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn_uZxJ55ZHov8fGYS1Fv_iE4Z8PTeUobJMAjRyMMHF5GTXjl5oGJvByQDO3cDfTsj0LbPACKMiPzT9MAOP0W0inVCtO3pZzF2ZfmIizNJP5tKvy9g_niE3dOUl9vGQKvv26LUL30ISrBBVWuixGJubPE6P2vXalQONKrVbNBWahoaFhcuYaLqWs39f3sJe6ZMNMQMfP0NoCrEikuuOLwaHmVdSIQbN8HmBj3jeyCotEchiJCS9ij6yP1bPkzxN2Qq0wSsna_p0ydQ"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 py-20 lg:w-2/3">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/images/logo.png"
              alt="4x4models"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
            <span className="px-3 py-1 rounded-sm bg-secondary-container text-on-secondary-container font-label text-xs uppercase tracking-widest">
              Global Community
            </span>
          </div>
          <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold text-on-surface uppercase leading-none tracking-tight mb-6">
            Fuel Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-container">
              Off-Road
            </span>{" "}
            Adventure
          </h1>
          <p className="font-body text-xl md:text-2xl text-tertiary-fixed-dim mb-10 max-w-xl">
            4x4models is your ultimate hub for off-road enthusiasts. Discover premium gear, explore legendary builds, and join a community that lives for the trail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              className="inline-flex items-center justify-center px-8 py-4 rounded-sm bg-gradient-to-br from-primary to-primary-container text-on-primary font-label uppercase font-bold tracking-wider transition-all duration-300 btn-primary-glow"
              href="/journal"
            >
              Explore the Journal
            </Link>
            <Link
              className="inline-flex items-center justify-center px-8 py-4 rounded-sm bg-outline/20 border border-outline-variant text-on-surface font-label uppercase font-bold tracking-wider hover:bg-surface-container-high transition-all duration-300"
              href="/shop"
            >
              Shop Gear
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Grid */}
      <section className="py-24 bg-surface-container-lowest">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-surface-container-highest/30 pb-8">
            <div>
              <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface uppercase tracking-tight">
                Legendary Rigs
              </h2>
              <p className="font-body text-tertiary-fixed-dim mt-2">
                Explore the platforms that define off-road capability.
              </p>
            </div>
            <Link
              className="text-secondary hover:text-primary transition-colors font-label text-sm uppercase tracking-wider flex items-center gap-2 group"
              href="/vehicles"
            >
              View All Models <ArrowRight className="group-hover:translate-x-1 transition-transform w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Land Cruiser */}
            <div className="group relative aspect-[4/5] bg-surface-container-high overflow-hidden rounded-b-lg">
              <Image
                alt="Dark grey Toyota Land Cruiser 200 series parked on rocky terrain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHi50SljpCqz6JX3ZELuXwAjUD4wTKsKLo9naZ2h9zJp2Z0HuAHW_Ov56XjgeW75Q6ttXk7w9sm8aolSbKsBTsbbEQ_LnN_7SaCWKmpNeVnW9InN0ka8NqJYo7_2GP4Z7n8D8JzHlyqj7gRWla-w32VBoqBkHPY4owtVqufx_ksHH5OxzWxvE48vn66DQAsT3CgjPR-4PWmz77MAouaJgtxVW8De2gkO29rjzQTsbI_ytZxybMBMG7uka9MAXTguP68W-naucbecfI"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/50 to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="text-primary font-label text-xs uppercase tracking-widest mb-2 block">
                  The Benchmark
                </span>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
                  Land Cruiser
                </h3>
                <Link
                  className="inline-flex items-center gap-2 text-secondary text-sm font-label uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  href="/vehicles/land-cruiser"
                >
                  Explore Build <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Tacoma */}
            <div className="group relative aspect-[4/5] bg-surface-container-high overflow-hidden rounded-b-lg md:-translate-y-8">
              <Image
                alt="Customized Toyota Tacoma TRD Pro with roof tent"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqxqDunaN9NntqfuKdzKLOGb-okdwb2X8gSZBj3wKNl-rMIPnlS5rmJ9qalCALnxuI2ayzvHLjj73V2noEMbqiCqlbXT_te8BpplEeQFF3CH-HZCF3bQ2SYWuI6W0tPioJE-o2dPjE9KQCGOH2DOg7tZrhpDehUtoxtdRrpXst3DCMGl9v0w2Y8xNeORzH0qFT6EaasizMVmQegmPRk2u5niMwTOzwHckNDgflLvLheCXKoJswgCflcjdQBNCvggECP6gwWKP8ccLD"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/50 to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="text-primary font-label text-xs uppercase tracking-widest mb-2 block">
                  The Overlander
                </span>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
                  Tacoma
                </h3>
                <Link
                  className="inline-flex items-center gap-2 text-secondary text-sm font-label uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  href="/vehicles/tacoma"
                >
                  Explore Build <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Hilux */}
            <div className="group relative aspect-[4/5] bg-surface-container-high overflow-hidden rounded-b-lg">
              <Image
                alt="Toyota Hilux splashing through muddy water"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8VxwUx6IYyB4v2VACr-PejA-4EXMAsiXGRUwEwKusAWtyL8ZU9gMxhbDe4xDFuNfuaH1OkS6wXRrSdTpsk0JI3ZXg6pRzbbJwfUNOw439zGK1afObApNZEXwSHJhtykRUOWmdtqp82wrDm_WNqjbzVpObcvkDSM5GYbmQ6s5wVQ5Gvsa0FKKgtmW5bxbaV43HRWLI5i8pbFkblFzPuf9IorbnVhhNPT-6kkQ7Mg5z8e1Vpki6uHoyyCU2cw4RdqWizpA77SqsVZIE"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/50 to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="text-primary font-label text-xs uppercase tracking-widest mb-2 block">
                  The Indestructible
                </span>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
                  Hilux
                </h3>
                <Link
                  className="inline-flex items-center gap-2 text-secondary text-sm font-label uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  href="/vehicles/hilux"
                >
                  Explore Build <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest to-surface opacity-50 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="inline-block p-4 rounded-full bg-surface-container-high text-primary mb-8 shadow-[0_0_40px_-10px_rgba(234,107,30,0.15)]">
            <Map className="w-10 h-10" />
          </span>
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-on-surface uppercase tracking-tight mb-4">
            Prep For The Trail
          </h2>
          <p className="font-body text-xl text-tertiary-fixed-dim mb-10 max-w-2xl mx-auto">
            Sign up for the dispatch and get our free{" "}
            <span className="text-secondary font-medium">Overland Packing Guide</span> delivered instantly.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              className="flex-grow bg-surface-container-highest border-b-2 border-outline-variant text-on-surface focus:ring-0 focus:border-primary font-label text-sm uppercase tracking-wider px-6 py-4 rounded-t-sm outline-none transition-colors placeholder:text-outline/50"
              placeholder="ENTER YOUR EMAIL"
              type="email"
            />
            <button
              className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-label uppercase font-bold tracking-wider rounded-sm transition-all duration-300 btn-primary-glow shrink-0"
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
