"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Compass, User } from "lucide-react";

export default function LandCruiserPage() {
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
              <Link className="text-primary border-b-2 border-primary pb-1" href="/vehicles/land-cruiser">
                Land Cruiser
              </Link>
            </li>
            <li>
              <Link className="text-on-surface hover:text-primary transition-colors pb-1" href="/vehicles/tacoma">
                Tacoma
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
      <main className="flex-1 z-10 pt-24">
      {/* Hero Section */}
      <section className="relative h-[819px] flex items-center bg-surface-container-lowest overflow-hidden">
        {/* Bleed Image - right 70% */}
        <div className="absolute inset-0 w-full h-full md:w-[70%] ml-auto right-0 z-0">
          <Image
            alt="Rugged Toyota Land Cruiser tackling steep desert terrain at sunset"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9hg-db0Bxon54ms-R7qJWBEH1DTruyUzCn0d3F9a0w0igjf38d44ZPtSqXG_kOl98vG8gwchwsrrmkqbO_1mIBr3dOQdncM0rDU9uGlOqIpxfrk1J36mZjbXOD0vgRFrTGIpkRJGOSPMZSazVcxKv204_f1aoT9_FxRFAdL8eTtMtQ00GHeluVRQ05NY4-ElnpjitmsCQZFREIPxxUQOzwn61yywpvCaPpLXc7OMA8sdjwbXUDJfc9KPFYwJoj7ICUaXmgESTHz8p"
            fill
            className="object-cover object-right"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full md:w-1/2">
          <div className="inline-flex items-center px-3 py-1 mb-6 bg-secondary-container text-on-secondary-container text-xs font-label uppercase tracking-widest rounded-sm"
               style={{ clipPath: "polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)" }}>
            <Compass className="w-4 h-4 mr-2" />
            Expedition Ready
          </div>

          <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold text-on-surface leading-none mb-6 uppercase tracking-tight">
            THE APEX<br />PREDATOR
          </h1>

          <p className="font-body text-xl text-tertiary mb-10 max-w-lg">
            Engineered for the unforgiving. The Land Cruiser stands as a monolithic testament to mechanical endurance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              className="px-8 py-4 rounded-sm bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-sm tracking-widest uppercase inline-flex items-center justify-center transition-all duration-300 hover:brightness-110"
              href="#build"
            >
              Build Your Rig
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              className="bg-outline/20 border border-outline-variant px-8 py-4 rounded-sm text-secondary font-headline font-bold text-sm tracking-widest uppercase hover:bg-outline/30 transition-colors inline-flex items-center justify-center"
              href="#specs"
            >
              View Specs
            </Link>
          </div>
        </div>
      </section>

      {/* Trench Separator */}
      <div className="h-1 bg-surface-container-lowest w-full" />

      {/* Build Your Rig Slider Section */}
      <section className="py-24 bg-surface" id="build">
        <div className="container mx-auto px-6 lg:px-12 mb-12 flex justify-between items-end">
          <div>
            <h2 className="font-headline text-3xl font-bold text-on-surface uppercase mb-2">Build Your Rig</h2>
            <p className="font-body text-tertiary">Select a platform to begin customization.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button className="w-10 h-10 bg-surface-container-high rounded-sm flex items-center justify-center text-on-surface hover:text-primary transition-colors border border-outline-variant/15">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-surface-container-high rounded-sm flex items-center justify-center text-on-surface hover:text-primary transition-colors border border-outline-variant/15">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll */}
        <div className="w-full overflow-x-auto pb-8 pl-6 lg:pl-12 hide-scrollbar">
          <div className="flex gap-8 w-max pr-6 lg:pr-12">
            {/* 300 Series Card */}
            <div className="w-[300px] md:w-[400px] bg-surface-container-high rounded-b flex flex-col group border border-outline-variant/15">
              <div className="h-[250px] w-full overflow-hidden relative">
                <Image
                  alt="Toyota Land Cruiser 300 Series in dark setting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB11rCcHk9ksCOpmVsCy3DcsA295xicUjvjvOaWNGpOfO3KQCCLxhAPoN4Jr-ODLQDmLdznX0eRJcTcN_venpacf2AE0iv9O_zkSHIF4u7OCqdMWmxvFw0rhCpLSXiQUFmPfvLwxED8sb8TQE515PZb2B2I0MzpIS5ZAM8PnX7G9BCujHs1ZYW6ABJ3fRyfCzputRiRRvxjuSqDZbR1eDW1xsJ9BeNfZopg4T0akfIGpCBXfYiCa5vYaJ-xhlmEw7n3bNSI3sOtKKQd"
                  width={400}
                  height={250}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-t-none"
                />
                <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md px-2 py-1 rounded-sm border border-outline-variant/30 text-xs font-label text-primary uppercase">Flagship</div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-headline text-xl font-bold text-on-surface uppercase mb-1">300 Series</h3>
                <p className="font-body text-tertiary mb-6 flex-grow">The ultimate synthesis of luxury and unyielding off-road capability.</p>
                <button className="w-full text-center bg-outline/20 border border-outline-variant px-4 py-3 rounded-sm text-secondary font-headline font-bold text-xs tracking-widest uppercase hover:bg-outline/30 transition-colors">
                  Configure 300
                </button>
              </div>
            </div>

            {/* 70 Series Card */}
            <div className="w-[300px] md:w-[400px] bg-surface-container-high rounded-b flex flex-col group border border-outline-variant/15">
              <div className="h-[250px] w-full overflow-hidden relative">
                <Image
                  alt="Vintage Toyota Land Cruiser 70 Series in desert"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxd19M8uyNUkSsAwf1NJ0kpL8NCHFZ332lM1u5q45jHLuHGJq8rr0h7KcapAiiCw4HPySJ9XWZMnViM8gC-_qmS3NdRE8ItmInHGc-AoCWFAe6qzsCGSSdNiFmcFvnAEax3QZlMa5U5SMlwnnjz287MnTUeAtVyZ7IcGNZBR-db7sal0cIk3zAdsFtQoD5CpiEWxvpLy10LbrzsyvJBIqc0j5INm2p4QHNM4rqaVdGCS5-5H27gl3oqppkD00Mttiwe_olUvPvzXTP"
                  width={400}
                  height={250}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-t-none"
                />
                <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md px-2 py-1 rounded-sm border border-outline-variant/30 text-xs font-label text-primary uppercase">Heritage</div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-headline text-xl font-bold text-on-surface uppercase mb-1">70 Series</h3>
                <p className="font-body text-tertiary mb-6 flex-grow">A utilitarian workhorse. Stripped down, reinforced, ready for anything.</p>
                <button className="w-full text-center bg-outline/20 border border-outline-variant px-4 py-3 rounded-sm text-secondary font-headline font-bold text-xs tracking-widest uppercase hover:bg-outline/30 transition-colors">
                  Configure 70
                </button>
              </div>
            </div>

            {/* Tacoma Card */}
            <div className="w-[300px] md:w-[400px] bg-surface-container-high rounded-b flex flex-col group border border-outline-variant/15">
              <div className="h-[250px] w-full overflow-hidden relative">
                <Image
                  alt="Toyota Tacoma truck on dirt road"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3CBp7qikCd3kZxJOKM5hUdAC0hngbZzDReNjjE6fZ03qdyze7DhyCor062eDOsrBbhCFRwc-7Uj051-ZkGI7HynrABeFXKIwJ5YEahHSuREhgnDIl4AJQhn-72PtmhmZijVv6Bb8ene2zOihJgA8nhoh3ZRp5b44kPiBqZ3B6utuDHCK2v8P7AY24H9YZGWgDQnoz9WbUOAziS7CiRPaRG2D4f7ai0N7ggAdEdNf7fLqps0e7Yqkx70PkQqANdDrxN_H_GX0kQJ79"
                  width={400}
                  height={250}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-t-none"
                />
                <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md px-2 py-1 rounded-sm border border-outline-variant/30 text-xs font-label text-primary uppercase">Agile</div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-headline text-xl font-bold text-on-surface uppercase mb-1">Tacoma</h3>
                <p className="font-body text-tertiary mb-6 flex-grow">Mid-size agility meets heavy-duty overlanding potential.</p>
                <button className="w-full text-center bg-outline/20 border border-outline-variant px-4 py-3 rounded-sm text-secondary font-headline font-bold text-xs tracking-widest uppercase hover:bg-outline/30 transition-colors">
                  Configure Tacoma
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trench Separator */}
      <div className="h-1 bg-surface-container-lowest w-full" />

      {/* Latest from the Journal */}
      <section className="py-24 bg-surface-container-low" id="specs">
        <div className="container mx-auto px-6 lg:px-12 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline text-3xl font-bold text-on-surface uppercase">Latest from the Journal</h2>
            <Link className="text-secondary font-label text-sm uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1" href="/journal">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Journal Article 1 */}
            <article className="bg-surface-container-high rounded-b overflow-hidden border border-outline-variant/15 group cursor-pointer">
              <div className="h-48 w-full overflow-hidden">
                <Image
                  alt="Snow capped jagged mountain peaks at dawn"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-pu4ivvwb_5BKLCSGcX3mSfKY9loPIC_3eDv_QOdJGUZ9z6f5Mx533IcA7yvEYfAVKS8mAuOdHOISwxsDWxV4NPjSg-OYm26GNyWpWsl5vSEEzquhqMppWeeVr-UPBK3CpiLUA1ykA8FtUibZwSN4PQUmRESmgDZ1wC6DLCsGY5hv7fuCWh7OE4Y-uZfee4j8GbvlGJyhPBZyenY8UCYtkqDZayu6s2eyGaO-jKGej5MFN5c7MVu-QfC8_8JYqi7mZ-prMbV7cA6R"
                  width={400}
                  height={192}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-t-none"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-label text-tertiary uppercase tracking-widest">Route Guide</span>
                  <span className="w-1 h-1 bg-primary rounded-full" />
                  <span className="text-xs font-label text-tertiary uppercase tracking-widest">12 Min Read</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">Navigating the High Sierras in Winter</h3>
                <p className="font-body text-tertiary text-sm line-clamp-2 mb-4">A tactical breakdown of essential gear and modifications required for sub-zero high-altitude expeditions.</p>
                <span className="text-secondary font-label text-xs uppercase tracking-widest inline-flex items-center mt-2 group-hover:text-primary transition-colors">
                  Read Dispatch <ArrowRight className="ml-1 w-3 h-3" />
                </span>
              </div>
            </article>

            {/* Journal Article 2 */}
            <article className="bg-surface-container-high rounded-b overflow-hidden border border-outline-variant/15 group cursor-pointer">
              <div className="h-48 w-full overflow-hidden">
                <Image
                  alt="Mechanic hands installing suspension"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuACOD39fCqoN3ZWHJuHqgbJ3V3udxDKD22MITcE3bamEHQpyNgAv9MdquSaxy5yD11wjUdzAit5p8PCNjhcanAOj29ZfRZOuvuOXF7AbOn4y3plWW4jXv7WtfGQGPU2imk6H5jv99qsNQNwCh44pL0MlRWLA0Z1dhh7jXCOOPyCXVTzcbBjOA67t6B_Hxyxz2McXE8vbkaqSBIVC_9yquCt3wdQXBhn1QxT4Zp6hY6udhAgBzPoXbRaGtr8tLYscAWk6uQIB8L3L_SN"
                  width={400}
                  height={192}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-t-none"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-label text-tertiary uppercase tracking-widest">Tech Brief</span>
                  <span className="w-1 h-1 bg-primary rounded-full" />
                  <span className="text-xs font-label text-tertiary uppercase tracking-widest">8 Min Read</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">Suspension Geometry 101</h3>
                <p className="font-body text-tertiary text-sm line-clamp-2 mb-4">Understanding the critical balance between articulation, payload capacity, and highway stability.</p>
                <span className="text-secondary font-label text-xs uppercase tracking-widest inline-flex items-center mt-2 group-hover:text-primary transition-colors">
                  Read Dispatch <ArrowRight className="ml-1 w-3 h-3" />
                </span>
              </div>
            </article>

            {/* Journal Article 3 */}
            <article className="bg-surface-container-high rounded-b overflow-hidden border border-outline-variant/15 group cursor-pointer hidden md:block">
              <div className="h-48 w-full overflow-hidden">
                <Image
                  alt="Small campfire burning in dark desert"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsr9HenFlzRBOpqCwwkUp2uEZ6ybxkH5dRHaE4Pmm6fznINhdz-CKLri1dxVc3tByWIQj_R7JPQkeZKRv-Y2dyGye8wae99PAedxFyH2uRCKA5RMEaTGMGVuKLJc3OyHqwSsT1V26cYapaUAK8hSTx8O76yg4f5JJHMOcyPrP17ZlHiD-vhi6q8xYDEGdLAaruoQs4XTQ6j6o0eDryignII68xXTtsdXe7EEB9sWBgfKNqmO_Y5TdhVSE_sIAWO4GNJVb2UZPYEej1"
                  width={400}
                  height={192}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-t-none"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-label text-tertiary uppercase tracking-widest">Field Notes</span>
                  <span className="w-1 h-1 bg-primary rounded-full" />
                  <span className="text-xs font-label text-tertiary uppercase tracking-widest">5 Min Read</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">The Solitude of the Salt Flats</h3>
                <p className="font-body text-tertiary text-sm line-clamp-2 mb-4">Reflections on a three-day solo crossing of the Mojave desert and the silence it brings.</p>
                <span className="text-secondary font-label text-xs uppercase tracking-widest inline-flex items-center mt-2 group-hover:text-primary transition-colors">
                  Read Dispatch <ArrowRight className="ml-1 w-3 h-3" />
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>
      </main>
    </div>
  );
}
