import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  BookOpen,
  CarFront,
  Database,
  ExternalLink,
  FilePenLine,
  Images,
  LayoutDashboard,
  ShieldCheck,
  Store,
  TrendingUp,
  Languages,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import manifest from "@/data/live-mirror/manifest.json";
import { base44List } from "@/lib/base44-api";
import { getAuthSession } from "@/lib/auth/casdoor";
import {
  imageForArticleRecord,
  imageForProductRecord,
  imageForVehicleRecord,
  localCmsMediaItems,
  normalizeCmsImageUrl,
} from "@/lib/cms-images";
import { blogService } from "@/lib/services/blog";
import { productService } from "@/lib/services/product";
import { vehicleService } from "@/lib/services/vehicle";
import { websiteBuilderService } from "@/lib/services/website-builder";
import type {
  MerchantCenterAccount,
  MerchantCenterProduct,
  SearchConsoleSnapshot,
  SeoAuditIssue,
  SeoTask,
  TranslationJob,
  WebshopPhoto,
  WebsitePage,
} from "@/types/base44";
import type { SiteContent } from "@/types/common";

export const dynamic = "force-dynamic";

type MirrorManifest = {
  pages: Record<string, string>;
};

type AdminWebsitePage = WebsitePage & {
  updated_date?: string;
};

type AdminWebshopPhoto = WebshopPhoto & {
  created_date?: string;
};

const editorPages = [
  {
    page: "home",
    cmsSlug: "home",
    title: "Homepage",
    body: "Hero, uitgelichte modellen, shopblokken en journal-inhoud.",
    livePath: "/",
    image: "/images/hero/homepage.jpg",
  },
  {
    page: "vehicles",
    cmsSlug: "merken",
    title: "Model hub",
    body: "Visuele modelblokken, indexkaarten en algemene catalogustekst.",
    livePath: "/merken",
    image: "/images/brands/hummer.jpg",
  },
  {
    page: "journal",
    cmsSlug: "journal",
    title: "Journal",
    body: "Artikeloverzichten, editorial hero en contentblokken.",
    livePath: "/journal",
    image: "/images/journal/toyota-land-cruiser-250-europa-2026-trims.jpg",
  },
  {
    page: "gear",
    cmsSlug: "shop",
    title: "Shop / gear",
    body: "Productkaarten, gear hero en merchandising modules.",
    livePath: "/shop",
    image: "/images/shop/warn-zeon-12-s-lier.jpg",
  },
] as const;

const livePages = [
  { title: "Home", path: "/" },
  { title: "Merken", path: "/merken" },
  { title: "Amerikaans", path: "/amerikaans" },
  { title: "Collecties", path: "/collecties" },
  { title: "Blog", path: "/blog" },
  { title: "Journal", path: "/journal" },
  { title: "Forum", path: "/forum" },
  { title: "Shop", path: "/shop" },
  { title: "Leren", path: "/leren" },
  { title: "Over ons", path: "/over-ons" },
] as const;

function liveUrl(pathname: string) {
  return `https://www.4x4models.com${pathname === "/" ? "/" : pathname}`;
}

function routeToSlug(pathname: string) {
  return pathname === "/" ? "home" : pathname.replace(/^\/+/, "");
}

function normalizeSlug(slug?: string) {
  const clean = (slug || "").replace(/^\/+/, "");
  return clean || "home";
}

function formatDate(value?: string) {
  if (!value) return "Nog niet bijgewerkt";

  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function hasLegacyImage(value?: string | null) {
  return Boolean(value && !normalizeCmsImageUrl(value));
}

function formatNumber(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return "0";
  return new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 2 }).format(value);
}

function seoBadgeClass(score?: number) {
  const base = "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]";
  if (typeof score !== "number") return `${base} bg-[#f3eee5] text-[#675f55]`;
  if (score >= 82) return `${base} bg-emerald-50 text-emerald-700`;
  if (score >= 65) return `${base} bg-amber-50 text-amber-700`;
  return `${base} bg-red-50 text-red-700`;
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = "light",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone?: "light" | "dark" | "success" | "warning";
}) {
  const dark = tone === "dark";
  const success = tone === "success";
  const warning = tone === "warning";

  return (
    <div
      className={[
        "rounded-lg border p-5 shadow-sm",
        dark
          ? "border-[#2f281f] bg-[#171411] text-[#fbfaf7]"
          : success
            ? "border-emerald-200 bg-emerald-50 text-[#171411]"
            : warning
              ? "border-amber-200 bg-amber-50 text-[#171411]"
          : "border-[#e4ded2] bg-white text-[#171411]",
      ].join(" ")}
    >
      <div className="mb-6 flex items-center justify-between">
        <span
          className={[
            "inline-flex h-10 w-10 items-center justify-center rounded-md",
            dark
              ? "bg-white/10 text-[#d3a35b]"
              : success
                ? "bg-white/80 text-emerald-700"
                : warning
                  ? "bg-white/80 text-amber-700"
                  : "bg-[#f2eadc] text-[#a3681a]",
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className={dark ? "text-xs uppercase tracking-[0.18em] text-white/45" : "text-xs uppercase tracking-[0.18em] text-[#8c8174]"}>
          Admin
        </span>
      </div>
      <p className={dark ? "text-sm text-white/60" : "text-sm text-[#675f55]"}>{label}</p>
      <p className="mt-1 text-4xl font-semibold tracking-tight">{value}</p>
      <p className={dark ? "mt-3 text-sm leading-relaxed text-white/55" : "mt-3 text-sm leading-relaxed text-[#675f55]"}>
        {detail}
      </p>
    </div>
  );
}

function DashboardButton({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    "inline-flex items-center justify-center gap-2 rounded-md border border-[#d8cfc0] bg-white px-4 py-2 text-sm font-semibold text-[#171411] shadow-sm transition hover:border-[#a3681a] hover:text-[#a3681a]";

  if (external) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <ExternalLink className="h-4 w-4" />
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const session = await getAuthSession();
  if (!session) redirect("/api/auth/login?returnTo=/admin");
  if (session.user.role !== "admin") notFound();

  const appId = process.env.NEXT_PUBLIC_BASE44_APP_ID || "699871557dfcaafa02868052";
  const base44EditorUrl = `https://app.base44.com/apps/${appId}/editor/preview`;
  const base44Configured = Boolean(process.env.BASE44_API_KEY);
  const mirrorEnabled = process.env.BASE44_MIRROR_ENABLED === "true";
  const webshopId = process.env.NEXT_PUBLIC_WEBSHOP_ID;

  const [
    websitePages,
    puckRecords,
    mediaRecords,
    webshopPhotos,
    structuredContent,
    vehicles,
    products,
    articles,
    seoTasks,
    seoIssues,
    translationJobs,
    searchConsoleSnapshots,
    merchantAccounts,
    merchantProducts,
  ] = await Promise.all([
    base44List<AdminWebsitePage>("WebsitePage", {
      q: { status: "published" },
      limit: 500,
      sort_by: "slug",
    }).then((response) => response.records),
    base44List<SiteContent>("SiteContent", {
      q: { section: "puck", key: "data" },
      limit: 100,
      sort_by: "page",
    }).then((response) => response.records),
    base44List<SiteContent>("SiteContent", {
      q: { page: "media", section: "library" },
      limit: 500,
      sort_by: "-created_date",
    }).then((response) => response.records),
    base44List<AdminWebshopPhoto>("WebshopPhoto", {
      ...(webshopId ? { q: { webshop_id: webshopId } } : {}),
      limit: 500,
      sort_by: "-created_date",
    }).then((response) => response.records),
    websiteBuilderService.listOverview(),
    vehicleService.list(250),
    productService.listPublished({ limit: 250 }).then((response) => response.records),
    blogService.getLatest(250),
    base44List<SeoTask>("SeoTask", {
      limit: 500,
      sort_by: "-current_score",
    }).then((response) => response.records),
    base44List<SeoAuditIssue>("SeoAuditIssue", {
      q: { status: "open" },
      limit: 500,
      sort_by: "severity",
    }).then((response) => response.records),
    base44List<TranslationJob>("TranslationJob", {
      limit: 500,
      sort_by: "-queued_at",
    }).then((response) => response.records),
    base44List<SearchConsoleSnapshot>("SearchConsoleSnapshot", {
      limit: 1,
      sort_by: "-synced_at",
    }).then((response) => response.records),
    base44List<MerchantCenterAccount>("MerchantCenterAccount", {
      limit: 10,
      sort_by: "-synced_at",
    }).then((response) => response.records),
    base44List<MerchantCenterProduct>("MerchantCenterProduct", {
      limit: 500,
      sort_by: "-synced_at",
    }).then((response) => response.records),
  ]);

  const manifestPages = Object.keys((manifest as MirrorManifest).pages);
  const pageBySlug = new Map(websitePages.map((page) => [normalizeSlug(page.slug), page]));
  const localMediaCount = localCmsMediaItems().length;
  const base44MediaCount =
    mediaRecords.filter((record) => normalizeCmsImageUrl(record.image_url)).length +
    webshopPhotos.filter((record) => normalizeCmsImageUrl(record.url)).length;
  const legacyImageCount =
    vehicles.filter((record) => hasLegacyImage(record.hero_image_url || record.featured_image_url)).length +
    articles.filter((record) => hasLegacyImage(record.featured_image_url)).length +
    products.filter((record) => hasLegacyImage(record.featured_image_url)).length;

  const previewVehicles = vehicles.slice(0, 3);
  const previewArticles = articles.slice(0, 3);
  const previewProducts = products.slice(0, 3);
  const lowSeoPages = websitePages.filter((page) => typeof page.seo_score === "number" && page.seo_score < 82).length;
  const averageSeoScore = websitePages.length
    ? Math.round(
        websitePages.reduce((total, page) => total + (typeof page.seo_score === "number" ? page.seo_score : 0), 0) /
          websitePages.length
      )
    : 0;
  const openSeoTasks = seoTasks.filter((task) => !["done", "ready"].includes(String(task.status || ""))).length;
  const queuedTranslations = translationJobs.filter((job) => !["published"].includes(String(job.status || ""))).length;
  const latestSearchConsole = searchConsoleSnapshots[0];
  const merchantProductCount =
    merchantAccounts.reduce((total, account) => total + (account.product_count || 0), 0) || merchantProducts.length;
  const merchantClicks = merchantProducts.reduce((total, product) => total + (product.clicks || 0), 0);
  const merchantImpressions = merchantProducts.reduce((total, product) => total + (product.impressions || 0), 0);
  const pinnedMediaItems = [
    ...webshopPhotos.map((photo) => ({
      id: `photo-${photo.id}`,
      title: photo.title || photo.alt || "Media",
      url: normalizeCmsImageUrl(photo.url),
      source: "CRM",
    })),
    ...mediaRecords.map((record) => ({
      id: `media-${record.id}`,
      title: record.value || record.key || "Media",
      url: normalizeCmsImageUrl(record.image_url),
      source: "CRM",
    })),
    ...localCmsMediaItems().map((item) => ({
      id: item.id,
      title: item.title,
      url: normalizeCmsImageUrl(item.url),
      source: "Lokaal",
    })),
  ]
    .filter((item) => Boolean(item.url))
    .filter((item, index, all) => all.findIndex((candidate) => candidate.url === item.url) === index)
    .slice(0, 12);

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#171411]">
      <section className="border-b border-[#e4ded2] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <Link href="/" className="inline-flex items-center" aria-label="4x4models live site">
              <Image
                src="/images/brand/logo.png"
                alt="4x4models"
                width={240}
                height={48}
                priority
                className="h-10 w-auto"
              />
            </Link>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#675f55]">
              <span className="rounded-full border border-[#e4ded2] bg-[#fbfaf7] px-3 py-1">
                {session.user.full_name}
              </span>
              <span
                className={[
                  "rounded-full border px-3 py-1 font-semibold",
                  base44Configured
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700",
                ].join(" ")}
              >
                {base44Configured ? "CMS gekoppeld" : "CMS key ontbreekt lokaal"}
              </span>
            </div>
          </div>

          <div className="grid gap-8 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#a3681a]">
                4x4models website beheer
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
                Een cockpit voor content, media en live pagina&apos;s.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#675f55] sm:text-lg">
                De CRM-laag beheert de records, Vercel bewaakt de styling en fallback. Admins kunnen vanaf hier naar de visuele editor,
                live mirror pagina&apos;s, media en de beheeromgeving.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <DashboardButton href={base44EditorUrl} external>
                  Open CRM admin
                </DashboardButton>
                <DashboardButton href="/admin/puck?page=home&locale=nl">
                  Bewerk homepage
                </DashboardButton>
                <DashboardButton href="https://www.4x4models.com/" external>
                  Bekijk live
                </DashboardButton>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#e4ded2] bg-[#171411] shadow-sm">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/images/hero/homepage.jpg"
                  alt="4x4models dashboard preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d3a35b]">
                    Live mirror status
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {mirrorEnabled ? "CRM rendering aan" : "Lokale mirror fallback actief"}
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-white/70">
                    Aanpassingen in de CRM worden zichtbaar op de live site zodra CRM rendering aan staat; Vercel fallback blijft behouden.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:px-8 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Database}
          label="Pagina's in beheer"
          value={`${websitePages.length}/${manifestPages.length}`}
          detail="Live mirror pagina's die vanuit de CRM gevuld kunnen worden."
          tone="dark"
        />
        <StatCard
          icon={LayoutDashboard}
          label="Secties & cards"
          value={`${structuredContent.sections.length}/${structuredContent.cards.length}`}
          detail={`Pagina-builder onderdelen. Visuele editor records: ${puckRecords.length}/8.`}
        />
        <StatCard
          icon={Images}
          label="Media library"
          value={`${base44MediaCount + localMediaCount}`}
          detail={`${base44MediaCount} uit de CRM, ${localMediaCount} lokale veilige fallbacks.`}
        />
        <StatCard
          icon={ShieldCheck}
          label="Afbeelding cleanup"
          value={legacyImageCount ? `${legacyImageCount}` : "OK"}
          detail={legacyImageCount ? "Oude demo-afbeeldingen worden in admin vervangen door lokale previews." : "Geen kapotte demo-links in de geladen previews."}
        />
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-8 sm:px-8 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label="SEO score"
          value={averageSeoScore ? `${averageSeoScore}/100` : "Nog meten"}
          detail={lowSeoPages ? `${lowSeoPages} pagina's hebben nog SEO-aandacht nodig.` : "Alle gemeten pagina's zitten netjes in de groene zone."}
          tone={averageSeoScore >= 82 ? "success" : "warning"}
        />
        <StatCard
          icon={FilePenLine}
          label="SEO taken"
          value={`${openSeoTasks}`}
          detail={`${seoIssues.length} open auditpunten staan klaar voor verbetering en planning.`}
          tone={openSeoTasks ? "warning" : "success"}
        />
        <StatCard
          icon={Languages}
          label="Vertaalwachtrij"
          value={`${queuedTranslations}`}
          detail="Eigenaar schrijft NL; Engelse versies worden vanuit deze wachtrij voorbereid."
        />
        <StatCard
          icon={Store}
          label="Merchant Center"
          value={`${merchantProductCount}`}
          detail={
            merchantProducts.length
              ? `${merchantClicks} klikken, ${merchantImpressions} vertoningen in de laatste syncperiode.`
              : "Merchant Center is gekoppeld, maar er zijn nog geen producten geladen."
          }
          tone={merchantProducts.length ? "success" : "warning"}
        />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-lg border border-[#e4ded2] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a3681a]">SEO cockpit</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Scores, previews en acties</h2>
            </div>
            <TrendingUp className="h-5 w-5 text-[#a3681a]" />
          </div>
          <div className="grid gap-3">
            {websitePages
              .filter((page) => typeof page.seo_score === "number")
              .sort((a, b) => (a.seo_score || 0) - (b.seo_score || 0))
              .slice(0, 4)
              .map((page) => (
                <div key={page.id} className="rounded-md border border-[#eee7db] bg-[#fbfaf7] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{page.title}</p>
                      <p className="mt-1 text-xs text-[#8c8174]">{page.google_preview_url || page.canonical_url || `/${page.slug}`}</p>
                    </div>
                    <span className={seoBadgeClass(page.seo_score)}>
                      {page.seo_score}/100
                    </span>
                  </div>
                  <div className="mt-4 rounded border border-[#dfe7f6] bg-white px-4 py-3">
                    <p className="truncate text-base text-[#1a0dab]">{page.google_preview_title || page.seo_title || page.title}</p>
                    <p className="truncate text-sm text-[#006621]">{page.google_preview_url || page.canonical_url || `https://www.4x4models.com/${page.slug}`}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#545454]">{page.google_preview_description || page.meta_description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#e4ded2] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a3681a]">Zoekdata</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Search Console & Merchant</h2>
            </div>
            <Store className="h-5 w-5 text-[#a3681a]" />
          </div>
          <div className="space-y-4">
            <div className="rounded-md border border-[#eee7db] bg-[#fbfaf7] p-4">
              <p className="text-sm font-semibold">Search Console</p>
              {latestSearchConsole ? (
                <p className="mt-2 text-sm leading-6 text-[#675f55]">
                  {latestSearchConsole.clicks || 0} klikken, {latestSearchConsole.impressions || 0} vertoningen,
                  positie {formatNumber(latestSearchConsole.position)}.
                </p>
              ) : (
                <p className="mt-2 text-sm leading-6 text-[#675f55]">
                  Search Console koppeling vereist. Koppel `google-search-console` in Maton/OAuth om echte zoekquery&apos;s en pagina&apos;s te laden.
                </p>
              )}
            </div>
            <div className="rounded-md border border-[#eee7db] bg-[#fbfaf7] p-4">
              <p className="text-sm font-semibold">Merchant Center</p>
              <p className="mt-2 text-sm leading-6 text-[#675f55]">
                {merchantAccounts.length} account, {merchantProductCount} producten, {merchantClicks} klikken en {merchantImpressions} vertoningen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
        <div className="overflow-hidden rounded-lg border border-[#e4ded2] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eee7db] bg-[#fbfaf7] px-5 py-4 sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a3681a]">
                Vastgezette media library
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Foto&apos;s klaar voor pagina&apos;s, cards en producten</h2>
            </div>
            <DashboardButton href="/admin/content?slug=home">
              Open paginabeheer
            </DashboardButton>
            <DashboardButton href="/admin/seo">
              Open SEO tools
            </DashboardButton>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6 lg:grid-cols-6">
            {pinnedMediaItems.map((item) => (
              <div key={item.id} className="group overflow-hidden rounded-md border border-[#eee7db] bg-[#171411]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 12rem"
                    className="object-cover transition duration-200 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#171411]">
                    {item.source}
                  </span>
                </div>
                <div className="bg-white px-3 py-2">
                  <p className="truncate text-sm font-semibold text-[#171411]">{item.title}</p>
                  <p className="mt-1 truncate text-xs text-[#8c8174]">{item.url}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-8 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-[#e4ded2] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a3681a]">
                Snelle bewerking
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Visuele pagina&apos;s</h2>
            </div>
            <Wrench className="h-5 w-5 text-[#a3681a]" />
          </div>
          <div className="grid gap-4">
            {editorPages.map((item) => (
              <div key={item.page} className="grid gap-4 rounded-md border border-[#eee7db] bg-[#fbfaf7] p-3 sm:grid-cols-[8rem_1fr]">
                <div className="relative aspect-[4/3] overflow-hidden rounded bg-[#171411]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="8rem"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#675f55]">{item.body}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      className="rounded-md bg-[#171411] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#a3681a]"
                      href={`/admin/content?slug=${encodeURIComponent(item.cmsSlug)}`}
                    >
                      NL bewerken
                    </Link>
                    <Link
                      className="rounded-md border border-[#d8cfc0] bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#171411] transition hover:border-[#a3681a] hover:text-[#a3681a]"
                      href={`/admin/content?slug=${encodeURIComponent(`en/${item.cmsSlug === "home" ? "" : item.cmsSlug}`.replace(/\/$/, ""))}`}
                    >
                      EN bewerken
                    </Link>
                    <a
                      className="rounded-md border border-[#d8cfc0] bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#675f55] transition hover:border-[#a3681a] hover:text-[#a3681a]"
                      href={liveUrl(item.livePath)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live preview
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#e4ded2] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a3681a]">
                Live mirror
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Belangrijke publieke pagina&apos;s</h2>
            </div>
            <FilePenLine className="h-5 w-5 text-[#a3681a]" />
          </div>
          <div className="overflow-hidden rounded-md border border-[#eee7db]">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[#f3eee5] text-xs uppercase tracking-[0.14em] text-[#675f55]">
                <tr>
                  <th className="px-4 py-3 font-bold">Pagina</th>
                  <th className="px-4 py-3 font-bold">CMS</th>
                  <th className="px-4 py-3 font-bold">Update</th>
                  <th className="px-4 py-3 font-bold">Actie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee7db]">
                {livePages.map((page) => {
                  const record = pageBySlug.get(routeToSlug(page.path));
                  const status = record?.status || "fallback";

                  return (
                    <tr key={page.path} className="bg-white">
                      <td className="px-4 py-3">
                        <p className="font-semibold">{page.title}</p>
                        <p className="text-xs text-[#8c8174]">{page.path}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            "rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em]",
                            record
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700",
                          ].join(" ")}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#675f55]">{formatDate(record?.updated_date)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <a
                            className="rounded border border-[#d8cfc0] px-2.5 py-1.5 text-xs font-semibold text-[#171411] hover:border-[#a3681a] hover:text-[#a3681a]"
                            href={liveUrl(page.path)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Bekijk
                          </a>
                          <Link
                            className="rounded border border-[#d8cfc0] px-2.5 py-1.5 text-xs font-semibold text-[#171411] hover:border-[#a3681a] hover:text-[#a3681a]"
                            href={`/admin/content?slug=${encodeURIComponent(routeToSlug(page.path))}`}
                          >
                            Bewerk
                          </Link>
                          <a
                            className="rounded border border-[#d8cfc0] px-2.5 py-1.5 text-xs font-semibold text-[#171411] hover:border-[#a3681a] hover:text-[#a3681a]"
                            href={base44EditorUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            CMS
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-12 sm:px-8 lg:grid-cols-3">
        <ContentPreviewCard
          icon={CarFront}
          title="Voertuigen"
          count={vehicles.length}
          items={previewVehicles.map((vehicle) => ({
            title: vehicle.name || "Vehicle",
            meta: vehicle.brand || "4x4",
            image: imageForVehicleRecord(vehicle),
          }))}
          href={base44EditorUrl}
        />
        <ContentPreviewCard
          icon={BookOpen}
          title="Blog & journal"
          count={articles.length}
          items={previewArticles.map((article) => ({
            title: article.title || "Article",
            meta: article.journal_category || article.locale || "Journal",
            image: imageForArticleRecord(article),
          }))}
          href={base44EditorUrl}
        />
        <ContentPreviewCard
          icon={Store}
          title="Shop producten"
          count={products.length}
          items={previewProducts.map((product) => ({
            title: product.title || "Product",
            meta: product.sku || product.product_type || "Shop",
            image: imageForProductRecord(product),
          }))}
          href={base44EditorUrl}
        />
      </section>
    </main>
  );
}

function ContentPreviewCard({
  icon: Icon,
  title,
  count,
  items,
  href,
}: {
  icon: LucideIcon;
  title: string;
  count: number;
  items: Array<{ title: string; meta: string; image: string }>;
  href: string;
}) {
  return (
    <div className="rounded-lg border border-[#e4ded2] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a3681a]">{count} records</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#f2eadc] text-[#a3681a]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={`${item.title}-${item.image}`} className="flex gap-3 rounded-md border border-[#eee7db] bg-[#fbfaf7] p-2">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded bg-[#171411]">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="5rem"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 py-1">
                <p className="truncate font-semibold">{item.title}</p>
                <p className="mt-1 truncate text-xs uppercase tracking-[0.14em] text-[#8c8174]">{item.meta}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-md border border-dashed border-[#d8cfc0] bg-[#fbfaf7] px-4 py-8 text-center text-sm text-[#675f55]">
            Geen records gevonden in deze lokale omgeving.
          </div>
        )}
      </div>
      <a
        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#a3681a] hover:text-[#171411]"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in CMS
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}
