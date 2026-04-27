"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Filter, ExternalLink, ShoppingCart, Truck } from "lucide-react";

export default function MerchPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Promotional Banner */}
      <div className="bg-surface-container-high border-l-4 border-primary w-full pt-20">
        <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between sm:justify-center gap-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L6.5 11h11L12 2zm0 3.5L15.5 9H8.5L12 5.5zM4 13l1.5 7h13L20 13H4zm6 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm8 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
            </svg>
            <span className="font-label text-sm tracking-widest uppercase text-on-surface font-semibold">
              10% off for Newsletter Subscribers. <span className="hidden sm:inline text-tertiary-fixed-dim font-normal">Use code OUTBACK10 at checkout.</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-16">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-2xl">
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight uppercase text-on-surface mb-4 leading-none">
              Tactical <br />
              <span className="text-primary">Supply</span>
            </h1>
            <p className="font-body text-lg text-tertiary-fixed-dim leading-relaxed">
              Built for the elements. Designed for the enthusiast. Premium apparel and gear to complement your rig.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="bg-surface-container-lowest px-4 py-2 border border-outline-variant/30 rounded font-label text-xs uppercase tracking-widest text-secondary flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </div>
          </div>
        </section>

        {/* Storefront Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured Item (Spans 2 columns) */}
          <article className="col-span-1 md:col-span-2 bg-surface-container-high rounded-t-none rounded-b flex flex-col md:flex-row group overflow-hidden relative">
            <div className="md:w-3/5 overflow-hidden relative bg-surface-container-lowest min-h-[300px]">
              <Image
                alt="Person wearing a rugged dark grey vintage t-shirt standing near a dusty off-road trail"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsH3BWPQpIYyeiAETHHE7bi8kJBrs6rXLw_9jfmapEmLGbNCOLBpjsEi_Wc4KAQKvgyspMYebOxD4WmS2h0jmu2_meQJA_1HJu2t7yS2nfvQ3FEViJHFXywvHhlxZMD1sRy3yOrK-7msVhkFoe78bwl4ELueagAQY-d-vykpkP9M51zCq7e9Iv6aHrxWBLXHc3-TfDJidd0Pxo3df92dUuE5h_xofogtQINhw9a5ZlR8Rv4wb8H3ljfnizndS2UIYbAm6mDPRaYnyZ"
                width={600}
                height={300}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 absolute inset-0"
              />
            </div>
            <div className="md:w-2/5 p-8 flex flex-col justify-between gap-6 border-l border-outline-variant/10">
              <div>
                <div className="inline-block bg-secondary-container text-on-secondary-container font-label text-[10px] tracking-widest uppercase px-2 py-1 mb-4 rounded-sm">Featured</div>
                <h2 className="font-headline text-2xl font-bold text-on-surface mb-2 leading-tight">Vintage Land Cruiser Tee</h2>
                <p className="font-body text-tertiary-fixed-dim text-sm leading-relaxed mb-6">
                  Heavyweight 100% cotton grit. Washed for that perfect broken-in feel straight out of the package. Features our classic schematic graphic.
                </p>
                <div className="font-headline text-2xl text-primary">$35.00</div>
              </div>
              <button className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 px-6 rounded font-label uppercase tracking-widest text-sm hover:brightness-110 hover:shadow-[0_0_20px_rgba(255,182,147,0.3)] transition-all flex items-center justify-between group/btn">
                <span>Get it on Etsy</span>
                <ExternalLink className="w-5 h-5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </article>

          {/* Standard Card 1 */}
          <article className="bg-surface-container-high rounded-t-none rounded-b flex flex-col group overflow-hidden">
            <div className="aspect-square overflow-hidden relative bg-surface-container-lowest">
              <Image
                alt="Close up of an embroidered patch with an off-road vehicle silhouette"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuACJAzflwGTJL_H3O1N_97kF35IxKzvsZTDwWOOTqgnfXGDXlA4im_ypwgmtehwzs8CIu6azBzj3LsbdA1tkEO8rGM4HxHoBxEv19Agi7fzO7_-iM7C9E0H1MDXQlknPg8b2HX7TJC6pRtnpID7fHgegLVBEX_JXLDmRFD90SfT1-4LIvFjvgJ5Uc8GuliFeHTmM1vKoJiTP98hXROrGDVaFQzIiWC1PoaqkCdEoydWS8KV_Y631qBcEfKWgUR383qDfMUZloRgL3pA"
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 absolute inset-0"
              />
            </div>
            <div className="p-6 flex flex-col grow justify-between gap-6">
              <div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-1">Overland Patch</h3>
                <p className="font-body text-tertiary-fixed-dim text-sm line-clamp-2">Velcro-backed morale patch. Show your allegiance on your headliner or gear bag.</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-headline text-xl text-secondary">$12.00</span>
                <button className="border border-outline-variant/30 text-secondary hover:bg-surface-container-highest hover:text-primary transition-colors py-2 px-4 rounded font-label uppercase tracking-widest text-xs flex items-center gap-2">
                  Buy <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>

          {/* Standard Card 2 */}
          <article className="bg-surface-container-high rounded-t-none rounded-b flex flex-col group overflow-hidden">
            <div className="aspect-square overflow-hidden relative bg-surface-container-lowest">
              <Image
                alt="Matte black steel camp mug resting on a rocky surface"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtsSqwwP3EMK6XQPZ1UIQNhq-DZh65b2B-qEc7bo2bl6O4FsZTlepqej3xODx7wf9QyadOfbh7n1esIImEvN6KRpa9-6n7sCc49siuYjv_SWuZy0-YcqSkwsD42vH-DtKR3sio_zn2_yecXXoNdTWFUUgZ6SMj0nYQeljjE1viRx_jKytIaz_oEuk85bqZ5BlTGV59HCHsEN_qjhLi90Jp7a2eFga8XTbvB7unRol3_y5RWY5M2kwf-6avm2TENEYoJtztunqtExlG"
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 absolute inset-0"
              />
            </div>
            <div className="p-6 flex flex-col grow justify-between gap-6">
              <div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-1">Tactical Camp Mug</h3>
                <p className="font-body text-tertiary-fixed-dim text-sm line-clamp-2">Double-walled stainless steel. Keeps your morning brew hot while you air down.</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-headline text-xl text-secondary">$28.00</span>
                <button className="border border-outline-variant/30 text-secondary hover:bg-surface-container-highest hover:text-primary transition-colors py-2 px-4 rounded font-label uppercase tracking-widest text-xs flex items-center gap-2">
                  Buy <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>

          {/* Standard Card 3 */}
          <article className="bg-surface-container-high rounded-t-none rounded-b flex flex-col group overflow-hidden">
            <div className="aspect-[4/3] md:aspect-square overflow-hidden relative bg-surface-container-lowest">
              <Image
                alt="Heavy duty olive drab canvas duffel bag"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVkeZybrtS5QSUP6ThJuvPsxsVXlOJgAgbbLcXoiUt3zEUB9U2zAIZjh6MLHyJ64Hy0z9iDIhtvMTdW8NdgHsyyT6FH2bbZW2lSE3f7un2neM3QGGV40hBlCf-LTDMyTm2DAMo_e_oJMbwGb8GGSJTVuOtsSBytvL6z6iNH2yq8jkAfHxGrRfd75A4C6yqG2_QXC5XUI7nUzdYyw5LFnTp5jb2pqedInit3J-ScwjlSrs52D8zZJiDCICdvul_OVJUvGYw3ed9kxln"
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 absolute inset-0"
              />
            </div>
            <div className="p-6 flex flex-col grow justify-between gap-6">
              <div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-1">Recovery Gear Duffel</h3>
                <p className="font-body text-tertiary-fixed-dim text-sm line-clamp-2">1000D Cordura nylon. Purpose-built to organize your straps, shackles, and blocks.</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-headline text-xl text-secondary">$85.00</span>
                <button className="border border-outline-variant/30 text-secondary hover:bg-surface-container-highest hover:text-primary transition-colors py-2 px-4 rounded font-label uppercase tracking-widest text-xs flex items-center gap-2">
                  Buy <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>

          {/* Shipping Feature Card */}
          <article className="bg-surface-container-highest rounded flex flex-col justify-center items-center p-12 text-center relative overflow-hidden border border-outline-variant/20">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-lowest/50 z-0" />
            <div className="relative z-10 flex flex-col items-center">
              <Truck className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Worldwide Shipping</h3>
              <p className="font-body text-tertiary-fixed-dim text-sm mb-6 max-w-xs">
                From the Outback to the Rockies. We ship our gear wherever your trail leads. Check Etsy for rates.
              </p>
              <Link className="text-secondary font-label uppercase tracking-widest text-xs hover:text-primary transition-colors flex items-center gap-1 border-b border-secondary hover:border-primary pb-1" href="#">
                Shipping Policy <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
