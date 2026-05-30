import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { notFound } from "next/navigation";
import { contentText } from "@/lib/content";
import { isLocale, localizedPath } from "@/lib/locale";
import { blogService } from "@/lib/services/blog";
import { siteContentService } from "@/lib/services/site-content";
import { vehicleService } from "@/lib/services/vehicle";
import type { Locale } from "@/types/common";

const fallbackHero =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB9hg-db0Bxon54ms-R7qJWBEH1DTruyUzCn0d3F9a0w0igjf38d44ZPtSqXG_kOl98vG8gwchwsrrmkqbO_1mIBr3dOQdncM0rDU9uGlOqIpxfrk1J36mZjbXOD0vgRFrTGIpkRJGOSPMZSazVcxKv204_f1aoT9_FxRFAdL8eTtMtQ00GHeluVRQ05NY4-ElnpjitmsCQZFREIPxxUQOzwn61yywpvCaPpLXc7OMA8sdjwbXUDJfc9KPFYwJoj7ICUaXmgESTHz8p";

export default async function VehicleDetailPage({
  params,
}: PageProps<"/[lang]/vehicles/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const [vehicle, latestArticles, content] = await Promise.all([
    vehicleService.getBySlug(slug),
    blogService.getLatest(3),
    siteContentService.getPage("vehicle-detail", locale),
  ]);

  if (!vehicle) notFound();

  return (
    <div className="bg-noise">
      <section className="relative flex min-h-[720px] items-center overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 md:left-[30%]">
          <Image
            alt={vehicle.hero_image_alt || vehicle.name || "4x4 model"}
            src={vehicle.hero_image_url || fallbackHero}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 py-20">
          <div className="mb-6 inline-flex items-center rounded-sm bg-secondary-container px-3 py-1 font-label text-xs uppercase tracking-widest text-on-secondary-container">
            <Compass className="mr-2 h-4 w-4" />
            {vehicle.badge || vehicle.tagline || "4x4"}
          </div>
          <h1 className="mb-6 max-w-3xl font-headline text-5xl font-bold uppercase leading-none tracking-tight text-on-surface md:text-7xl">
            {vehicle.hero_headline || vehicle.name}
          </h1>
          <p className="mb-10 max-w-xl text-xl text-tertiary">
            {vehicle.hero_body || vehicle.description || vehicle.tagline}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-sm bg-gradient-to-br from-primary to-primary-container px-8 py-4 font-headline text-sm font-bold uppercase tracking-widest text-on-primary"
              href={vehicle.cta_primary_url || "#series"}
            >
              {vehicle.cta_primary_text || contentText(content, "hero", "primary_cta", locale === "nl" ? "Bekijk build" : "Build your rig")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-sm border border-outline-variant bg-outline/20 px-8 py-4 font-headline text-sm font-bold uppercase tracking-widest text-secondary"
              href={vehicle.cta_secondary_url || "#specs"}
            >
              {vehicle.cta_secondary_text || contentText(content, "hero", "secondary_cta", locale === "nl" ? "Specificaties" : "View specs")}
            </Link>
          </div>
        </div>
      </section>

      <section id="series" className="bg-surface py-20">
        <div className="mx-auto max-w-screen-2xl px-6">
          <div className="mb-10">
            <h2 className="font-headline text-3xl font-bold uppercase text-on-surface">
              {contentText(content, "series", "headline", locale === "nl" ? "Series en varianten" : "Series and variants")}
            </h2>
            <p className="mt-2 text-tertiary">{vehicle.description || vehicle.tagline}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {(vehicle.series || []).length > 0 ? (
              vehicle.series?.map((series) => (
                <article key={series.id || series.slug || series.name} className="border border-outline-variant/20 bg-surface-container-high p-6">
                  <span className="mb-4 inline-block rounded-sm bg-surface-container-highest px-2 py-1 font-label text-xs uppercase tracking-widest text-primary">
                    {series.badge || contentText(content, "series", "fallback_badge", "Series")}
                  </span>
                  <h3 className="mb-3 font-headline text-xl font-bold uppercase text-on-surface">{series.name}</h3>
                  <p className="mb-6 text-sm text-tertiary">{series.description}</p>
                  <span className="font-label text-xs font-bold uppercase tracking-widest text-secondary">
                    {series.cta_text || contentText(content, "series", "fallback_cta", locale === "nl" ? "Configureren" : "Configure")}
                  </span>
                </article>
              ))
            ) : (
              <article className="border border-outline-variant/20 bg-surface-container-high p-6 md:col-span-3">
                <h3 className="mb-3 font-headline text-xl font-bold uppercase text-on-surface">{vehicle.name}</h3>
                <p className="text-sm text-tertiary">
                  {vehicle.hero_body ||
                    vehicle.description ||
                    contentText(content, "series", "empty", locale === "nl" ? "Nog geen series ingesteld." : "No series configured yet.")}
                </p>
              </article>
            )}
          </div>
        </div>
      </section>

      <section id="specs" className="bg-surface-container-low py-20">
        <div className="mx-auto grid max-w-screen-2xl gap-8 px-6 lg:grid-cols-2">
          <div className="border border-outline-variant/20 bg-surface-container-high p-6">
            <h2 className="mb-5 font-headline text-2xl font-bold uppercase text-on-surface">
              {contentText(content, "specs", "headline", locale === "nl" ? "Specificaties" : "Technical specs")}
            </h2>
            <div className="divide-y divide-outline-variant/15">
              {(vehicle.specs || []).map((spec) => (
                <div key={`${spec.feature}-${spec.value}`} className="flex justify-between gap-6 py-3 text-sm">
                  <span className="text-tertiary">{spec.feature}</span>
                  <span className="font-bold text-on-surface">{spec.value}</span>
                </div>
              ))}
              {(vehicle.specs || []).length === 0 ? (
                <p className="text-sm text-tertiary">
                  {contentText(content, "specs", "empty", locale === "nl" ? "Nog geen specificaties ingesteld." : "No specs configured yet.")}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ProsCons
              emptyLabel={contentText(content, "pros_cons", "empty", locale === "nl" ? "Nog niet ingesteld." : "Not configured yet.")}
              title={contentText(content, "pros_cons", "pros_title", locale === "nl" ? "Sterk" : "Strengths")}
              items={vehicle.pros || []}
            />
            <ProsCons
              emptyLabel={contentText(content, "pros_cons", "empty", locale === "nl" ? "Nog niet ingesteld." : "Not configured yet.")}
              title={contentText(content, "pros_cons", "cons_title", locale === "nl" ? "Let op" : "Watch points")}
              items={vehicle.cons || []}
            />
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-screen-2xl px-6">
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-outline-variant/20 pb-6">
            <h2 className="font-headline text-3xl font-bold uppercase text-on-surface">
              {contentText(content, "journal", "headline", locale === "nl" ? "Laatste uit de journal" : "Latest from the journal")}
            </h2>
            <Link href={localizedPath(locale, "/journal")} className="font-label text-xs uppercase tracking-widest text-secondary hover:text-primary">
              {contentText(content, "journal", "cta", locale === "nl" ? "Alles bekijken" : "View all")}
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {latestArticles.map((article) => (
              <Link key={article.id} href={localizedPath(locale, `/journal/${article.slug}`)} className="border border-outline-variant/20 bg-surface-container-high p-6 hover:border-primary/40">
                <span className="mb-3 inline-block font-label text-xs uppercase tracking-widest text-primary">{article.journal_category || "Journal"}</span>
                <h3 className="mb-3 font-headline text-xl font-bold text-on-surface">{article.title}</h3>
                <p className="line-clamp-2 text-sm text-tertiary">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProsCons({
  title,
  items,
  emptyLabel,
}: {
  title: string;
  items: string[];
  emptyLabel: string;
}) {
  return (
    <div className="border border-outline-variant/20 bg-surface-container-high p-6">
      <h3 className="mb-4 font-headline text-xl font-bold uppercase text-on-surface">{title}</h3>
      <ul className="space-y-3 text-sm text-tertiary">
        {items.length > 0 ? items.map((item) => <li key={item}>{item}</li>) : <li>{emptyLabel}</li>}
      </ul>
    </div>
  );
}
