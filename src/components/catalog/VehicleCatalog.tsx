"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Locale } from "@/types/common";
import type { Vehicle } from "@/types/vehicle";

type VehicleCatalogProps = {
  lang: Locale;
  vehicles: Vehicle[];
  labels: {
    search: string;
    allModels: string;
    noResults: string;
  };
};

export default function VehicleCatalog({ lang, vehicles, labels }: VehicleCatalogProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return vehicles;

    return vehicles.filter((vehicle) =>
      [vehicle.name, vehicle.tagline, vehicle.badge, vehicle.hero_body]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized))
    );
  }, [query, vehicles]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, Vehicle[]>>((acc, vehicle) => {
      const firstLetter = (vehicle.name || "#").charAt(0).toUpperCase();
      acc[firstLetter] ||= [];
      acc[firstLetter].push(vehicle);
      return acc;
    }, {});
  }, [filtered]);

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto grid max-w-screen-2xl gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="mb-8 flex flex-col gap-4 border-b border-outline-variant/25 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-label text-xs uppercase tracking-widest text-primary">
                {labels.allModels}
              </p>
              <h2 className="font-headline text-3xl font-bold uppercase tracking-tight text-on-surface">
                4x4 Model Index
              </h2>
            </div>
            <label className="flex min-h-12 w-full items-center gap-3 border border-outline-variant/30 bg-surface-container-low px-4 md:w-80">
              <Search className="h-4 w-4 text-primary" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-outline"
                placeholder={labels.search}
                type="search"
              />
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="border border-outline-variant/25 bg-surface-container-low p-10 text-center text-on-surface-variant">
              {labels.noResults}
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(grouped)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([letter, items]) => (
                  <div key={letter} className="grid gap-4 md:grid-cols-[80px_1fr]">
                    <div className="font-headline text-5xl font-bold text-primary/70">
                      {letter}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {items.map((vehicle) => (
                        <Link
                          key={vehicle.id}
                          href={`/${lang}/vehicles/${vehicle.slug}`}
                          className="group border border-outline-variant/20 bg-surface-container-high p-5 transition-colors hover:border-primary/50"
                        >
                          <div className="mb-3 flex items-start justify-between gap-4">
                            <h3 className="font-headline text-xl font-bold uppercase tracking-tight text-on-surface group-hover:text-primary">
                              {vehicle.name}
                            </h3>
                            <span className="shrink-0 rounded-sm bg-secondary-container px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-on-secondary-container">
                              {vehicle.badge || "4x4"}
                            </span>
                          </div>
                          <p className="text-sm text-tertiary-fixed-dim">
                            {vehicle.tagline || vehicle.hero_body || "Explore this 4x4 platform."}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="border border-outline-variant/20 bg-surface-container-low p-6">
            <h3 className="mb-4 font-headline text-lg font-bold uppercase text-on-surface">
              Trending
            </h3>
            <div className="space-y-3">
              {vehicles.slice(0, 5).map((vehicle, index) => (
                <Link
                  key={vehicle.id}
                  href={`/${lang}/vehicles/${vehicle.slug}`}
                  className="flex items-center gap-3 border-b border-outline-variant/15 pb-3 text-sm text-on-surface-variant last:border-0 last:pb-0 hover:text-primary"
                >
                  <span className="font-headline text-lg font-bold text-primary">
                    {index + 1}
                  </span>
                  {vehicle.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
