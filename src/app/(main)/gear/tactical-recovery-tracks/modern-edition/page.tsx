"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Weight, Thermometer, Layers, Shovel, CheckCircle, Search, User, Menu } from "lucide-react";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD0YKoIeWfP6F-4M5pJ5sCbtWPAfU4lgV0m_EDYee2bmcYPRsJVXDHHcnfmqyCA6EozUGp6EiAskOPBOfEAkQEzl4VU6RZA8DZbTp7laZSCIEys5RFaVNxZi_ESSLeal0yCdJbKx_WO8kD-AHxahwt9BM1-uh-UD_kj0trJ8hc8XbDlb155iJAD0yvwPgSYFHhLZi1DJAyUJEdutmY4YW_kjJTYLS7t-9LKKeMhfvN1K9NpRZtLYBPxiavqFkKYAibj9900z07tYLoK";

const cleatDetailImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDnn7bd7FW5fN-YB-DWRSEUhGScHWyH8QuzaRUWB-hmrVSjE9lwiid-d7LFsIKJWeZt0XPD5huyuFM7uzi33hY1LQU4E3Vd3SfRdt49fP7A1_FlrVnfrJeHyHvHqVWbQ8_UDOEeFguOA5WFOH1-THEOIJarDgDhqsVcRJvMuLfrRFJp42ssaDSWIgpQCBSIdQepr__QCcr0LDTtGYP8j5ATj_eGR8GW8cGwfj3NSEVIGwqlkfl_XQ2HeuqsmrU8Fx0StI0N3ntn9tEl";

const materialSpecs = [
  { label: "Base Polymer", value: "Nylon-66 Blend" },
  { label: "Reinforcement", value: "Basalt Fiber (15%)" },
  { label: "UV Resistance", value: "Stabilized up to 10 YRS" },
  { label: "Flex Temp Range", value: "-40°C to +80°C" },
];

const features = [
  {
    icon: Layers,
    title: "Stackable Profile",
    description: "Ultra-low 3.5\" nested height for streamlined roof mounting.",
  },
  {
    icon: Shovel,
    title: "Built-in Shovel",
    description: "Ergonomic grip handles double as an effective digging tool.",
  },
  {
    icon: CheckCircle,
    title: "Lifetime Structural Warranty",
    description: "If you break them recovering your rig, we replace them.",
    highlight: true,
  },
];

export default function ModernEditionPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[870px] flex items-center bg-surface-container-lowest overflow-hidden">
        <div className="absolute inset-0 md:w-2/3 right-0 z-0 bg-surface">
          <Image
            src={heroImage}
            alt="Dark, cinematic low-angle shot of a rugged 4x4 truck tire pressing into deep mud, with a highly textured bright orange recovery track wedged beneath it."
            fill
            className="object-cover object-right opacity-80"
            sizes="(max-width: 768px) 100vw, 66vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6 flex flex-col justify-center py-12">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-secondary font-body text-xs uppercase tracking-widest bg-secondary-container/30 px-3 py-1 rounded-sm border border-outline-variant/15">
                Heavy Duty Recovery
              </span>
              <span className="text-tertiary font-body text-xs uppercase tracking-widest">
                SKU: TR-OBS-01
              </span>
            </div>

            <h1 className="font-headline text-5xl md:text-7xl lg:text-[5rem] font-bold tracking-tighter leading-[0.9] text-on-surface mb-6 uppercase">
              Tactical
              <br />
              <span className="text-surface-variant line-through decoration-primary decoration-4">
                Stuck
              </span>
              <br />
              <span className="text-primary">Recovery Tracks</span>
            </h1>

            <p className="font-body text-lg text-tertiary max-w-md mb-10 leading-relaxed">
              Engineered with a proprietary basalt-polymer blend. Designed for
              the unforgiving outback, these tracks offer maximum traction when
              momentum fails.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="flex flex-col">
                <span className="font-headline text-3xl font-bold text-on-surface">
                  $285.00
                </span>
                <span className="font-body text-xs text-tertiary uppercase tracking-widest">
                  Pair (2 Tracks)
                </span>
              </div>
              <button className="btn-primary-glow text-on-primary font-headline font-bold uppercase tracking-tight py-4 px-8 rounded-sm shadow-[0_0_40px_-10px_rgba(234,107,30,0.4)] transition-all duration-300 flex items-center space-x-2 w-full sm:w-auto justify-center">
                <ShoppingCart size={18} />
                <span>Add to Arsenal</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs Bento */}
      <section className="py-24 bg-surface relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold uppercase tracking-tight text-on-surface mb-2">
                Technical Specs
              </h2>
              <div className="w-16 h-1 bg-primary-container" />
            </div>
            <p className="font-body text-sm text-tertiary max-w-sm">
              No compromises. Every metric is calibrated for extreme conditions
              and maximum vehicle weight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Load Rating Card */}
            <div className="md:col-span-4 bg-surface-container-low p-8 rounded-lg flex flex-col justify-between group hover:bg-surface-container transition-colors border border-outline-variant/15">
              <div className="mb-8">
                <Weight size={36} className="text-primary mb-4" />
                <h3 className="font-headline text-xl font-bold text-on-surface mb-2">
                  Load Rating
                </h3>
                <p className="font-body text-sm text-tertiary">
                  Tested to withstand immense point-loading without catastrophic
                  failure.
                </p>
              </div>
              <div className="font-headline text-4xl font-bold text-secondary">
                10,000{" "}
                <span className="text-lg text-surface-variant">LBS</span>
              </div>
            </div>

            {/* Cleat Detail Image Card */}
            <div className="md:col-span-8 bg-surface-container-high rounded-lg overflow-hidden relative min-h-[300px]">
              <Image
                src={cleatDetailImage}
                alt="Close up macro shot of the aggressive, jagged cleats on an orange recovery track covered in wet mud and sand"
                fill
                className="object-cover rounded-t-none rounded-b-lg opacity-70 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest via-surface-container-high/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
                <div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface uppercase mb-1">
                    Aggressive Cleat Pattern
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant max-w-md">
                    Interlocking tooth design bites into tire tread while
                    anchoring into mud, sand, or snow below.
                  </p>
                </div>
                <button className="bg-surface-container-lowest/80 backdrop-blur-md p-3 rounded-full text-primary hover:text-primary-container transition-colors border border-outline-variant/30">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Material Composition */}
            <div className="md:col-span-6 bg-surface-container-low p-8 rounded-lg border border-outline-variant/15 mt-4">
              <h3 className="font-headline text-xl font-bold text-on-surface mb-6 uppercase border-b border-surface-variant pb-4">
                Material Composition
              </h3>
              <ul className="space-y-4 font-body text-sm">
                {materialSpecs.map((spec) => (
                  <li
                    key={spec.label}
                    className="flex justify-between items-center bg-surface p-4 rounded-sm"
                  >
                    <span className="text-tertiary">{spec.label}</span>
                    <span className="text-on-surface font-mono tracking-wider text-xs">
                      {spec.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features Grid */}
            <div className="md:col-span-6 mt-4 grid grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className={`bg-surface-container p-6 rounded-lg flex flex-col justify-center ${
                    feature.highlight
                      ? "border-l-4 border-l-primary-container border border-outline-variant/15"
                      : "border border-outline-variant/15"
                  }`}
                >
                  <feature.icon size={28} className="text-secondary mb-3" />
                  <h4 className="font-headline font-bold text-on-surface mb-1">
                    {feature.title}
                  </h4>
                  <p className="font-body text-xs text-tertiary">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
