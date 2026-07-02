import Image from "next/image";
import Link from "next/link";

const navItems = [
  ["Merken", "/merken"],
  ["Amerikaans", "/amerikaans"],
  ["Collecties", "/collecties"],
  ["Blog", "/blog"],
  ["Journal", "/journal"],
  ["Forum", "/forum"],
  ["Shop", "/shop"],
  ["Leren", "/leren"],
  ["Over ons", "/over-ons"],
] as const;

const brands = [
  {
    title: "BYD (Yangwang / Fang Cheng Bao)",
    href: "/merken/byd",
    image: "/images/brands/byd.jpg",
    count: "4 modellen",
    text: "China's eerste high-end elektrische off-road-portfolio.",
  },
  {
    title: "Chevrolet / GMC",
    href: "/merken/chevrolet-gmc",
    image: "/images/brands/chevrolet-gmc.jpg",
    count: "7 modellen",
    text: "GM's off-road-zwaargewicht: ZR2 Bison, AT4X AEV en de elektrische Hummer EV Pickup.",
  },
  {
    title: "Dacia",
    href: "/merken/dacia",
    image: "/images/brands/dacia.jpg",
    count: "3 modellen",
    text: "Betaalbare vierwielaandrijving met de Duster als nuchtere publieksheld.",
  },
  {
    title: "Ford",
    href: "/merken/ford",
    image: "/images/brands/ford.jpg",
    count: "8 modellen",
    text: "Bronco, Raptor en Super Duty: Amerikaanse 4x4's met een lange terreintraditie.",
  },
  {
    title: "Hummer",
    href: "/merken/hummer",
    image: "/images/brands/hummer.jpg",
    count: "5 modellen",
    text: "Van militaire HMMWV tot elektrische supertruck: excessief, herkenbaar en compromisloos.",
  },
  {
    title: "INEOS",
    href: "/merken/ineos",
    image: "/images/brands/ineos.jpg",
    count: "2 modellen",
    text: "Moderne utilitaire terreinwagens met klassieke ladderframe-logica.",
  },
] as const;

const collections = [
  {
    title: "Amerikaanse 4x4 V8 Legacy",
    image: "/images/collections/amerikaanse-4x4-v8-legacy.jpg",
    href: "/collecties/amerikaanse-4x4-v8-legacy",
    text: "V8's, lange motorkappen en off-roadpakketten die de woestijn als meetlat gebruiken.",
  },
  {
    title: "Beste 4x4 voor de woestijn",
    image: "/images/collections/beste-4x4-woestijn.jpg",
    href: "/collecties/beste-4x4-woestijn",
    text: "Modellen met koeling, bodemvrijheid en stabiliteit voor zand, hitte en lange afstanden.",
  },
  {
    title: "Beste 4x4 voor overlanding",
    image: "/images/collections/beste-4x4-voor-overlanding.jpg",
    href: "/collecties/beste-4x4-voor-overlanding",
    text: "Betrouwbare reiswagens voor weken buiten de kaart: draagvermogen, bereik en eenvoud.",
  },
] as const;

const articles = [
  {
    title: "Waarom Amerikaanse V8-4x4's terreinrijden anders benaderen",
    image: "/images/blog/amerikaanse-v8-4x4-ford-raptor-ram-trx.jpg",
    href: "/blog/amerikaanse-v8-4x4-ford-raptor-ram-trx",
    text: "Ford Raptor, Ram TRX en GM's AT4X-lijn laten zien hoe vermogen en veerweg een eigen off-roadcultuur vormen.",
  },
  {
    title: "De beste 4x4's voor Texaanse woestijnroutes",
    image: "/images/blog/beste-4x4-texaanse-woestijn-sasquatch.jpg",
    href: "/blog/beste-4x4-texaanse-woestijn-sasquatch",
    text: "Wat je nodig hebt voor rots, stof en lange hitte: banden, koeling, approach angle en herstelpunten.",
  },
  {
    title: "Approach angle, departure angle en wading depth uitgelegd",
    image: "/images/blog/approach-angle-departure-angle-wading-depth.jpg",
    href: "/blog/approach-angle-departure-angle-wading-depth",
    text: "De technische termen die bepalen waar een 4x4 echt doorheen komt, zonder marketingmist.",
  },
] as const;

const products = [
  {
    title: '32" LED lightbar — Combo beam',
    image: "/images/shop/32-inch-led-lightbar-combo.jpg",
    href: "/shop/32-inch-led-lightbar-combo",
    price: "€ 189",
    label: "Verlichting",
    status: "Op voorraad",
    text: "Brede spreiding voor de berm en punch naar voren voor onverlichte trails.",
  },
  {
    title: "4x4models cap — Trail tested, oker",
    image: "/images/shop/cap-trail-tested-oker.jpg",
    href: "/shop/cap-trail-tested-oker",
    price: "€ 29",
    label: "Kleding & merch",
    status: "Op voorraad",
    text: "Katoenen six-panel cap met geborduurd embleem en verstelbare sluiting.",
  },
  {
    title: "4x4models hoodie — Oker, geborduurd embleem",
    image: "/images/shop/hoodie-oker-embreidery.jpg",
    href: "/shop/hoodie-oker-embreidery",
    price: "€ 75",
    label: "Kleding & merch",
    status: "Pre-order",
    text: "400 grams fleece, geborduurd embleem en gebouwd voor koude garagedagen.",
  },
] as const;

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-wide items-center justify-between gap-6 px-6 sm:h-20 sm:px-10">
        <Link href="/" aria-label="4x4models — terug naar home" className="group flex shrink-0 items-center gap-2.5 no-underline">
          <Image src="/images/brand/logo.svg" alt="" width={120} height={40} priority className="h-7 w-auto transition-transform duration-200 group-hover:scale-[1.04] sm:h-9" />
          <span className="hidden text-base font-medium tracking-tightest text-ink transition-colors group-hover:text-accent sm:inline sm:text-lg">
            4x4models<span className="text-accent">.</span>
          </span>
        </Link>
        <div className="hidden items-center gap-5 md:flex sm:gap-7">
          <nav aria-label="Hoofdnavigatie">
            <ul className="flex items-center gap-5 text-sm font-normal text-ink-soft sm:gap-8 sm:text-[15px]">
              {navItems.map(([label, href]) => (
                <li key={href}>
                  <Link className="whitespace-nowrap no-underline transition-colors duration-150 hover:text-accent" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-l border-rule pl-5 sm:pl-7">
            <button type="button" aria-label="Taal" className="inline-flex items-center gap-1.5 text-sm font-normal uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-accent">
              <span aria-hidden="true">🌐</span>
              <span>NL</span>
              <span aria-hidden="true" className="text-[10px]">▾</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <button type="button" aria-label="Taal" className="inline-flex items-center gap-1.5 text-sm uppercase tracking-[0.18em] text-ink-soft">
            <span aria-hidden="true">🌐</span>
            <span>NL</span>
            <span aria-hidden="true" className="text-[10px]">▾</span>
          </button>
          <button type="button" aria-label="Menu openen" className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-rule/50">
            <span className="sr-only">Menu</span>
            <span className="block h-3.5 w-5 border-y-2 border-current before:mt-[5px] before:block before:border-t-2 before:border-current" />
          </button>
        </div>
      </div>
    </header>
  );
}

function ImageCard({
  title,
  href,
  image,
  eyebrow,
  text,
  square = false,
}: {
  title: string;
  href: string;
  image: string;
  eyebrow?: string;
  text: string;
  square?: boolean;
}) {
  return (
    <Link href={href} className="group block h-full rounded-[2px] no-underline transition-transform duration-200 ease-out-soft hover:scale-[1.02] hover:shadow-[0_18px_40px_-18px_rgba(12,12,12,0.45)]">
      <div className={`relative w-full overflow-hidden bg-ink ${square ? "aspect-square" : "aspect-[4/3]"}`}>
        <Image src={image} alt={`${title} — header`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-slow ease-out-soft group-hover:scale-[1.05]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
        {eyebrow ? <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="mb-1.5 text-[11px] uppercase tracking-[0.22em] text-white/75">{eyebrow}</div>
          <h3 className="text-xl font-medium leading-tight tracking-tightest text-white sm:text-2xl">{title}</h3>
        </div> : null}
      </div>
      <div className="pt-4 sm:pt-5">
        {!eyebrow ? <h3 className="mb-2 text-lg font-medium leading-snug tracking-tightest text-ink transition-colors group-hover:text-accent sm:text-xl">{title}</h3> : null}
        <p className="text-sm leading-relaxed text-ink-soft sm:text-[15px]">{text}</p>
      </div>
    </Link>
  );
}

function SectionHeading({
  title,
  href,
  linkText,
}: {
  title: string;
  href: string;
  linkText: string;
}) {
  return (
    <div className="mb-10 flex items-baseline justify-between sm:mb-12">
      <h2 className="text-2xl font-medium tracking-tightest sm:text-3xl">{title}</h2>
      <Link className="text-sm text-accent no-underline hover:underline" href={href}>
        {linkText} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-rule sm:mt-32">
      <div className="mx-auto max-w-wide px-6 py-12 sm:px-10 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-4 sm:gap-12">
          <div className="space-y-3">
            <div className="text-base font-medium tracking-tightest text-ink">4x4models<span className="text-accent">.</span></div>
            <p className="max-w-xs text-sm text-ink-muted">Een onafhankelijk kenniscentrum over 4x4-modellen: merken, techniek en erfgoed.</p>
            <Link href="/over-ons" className="mt-4 inline-flex items-center gap-2 text-sm text-ink no-underline transition-colors hover:text-accent">
              Schrijf je in voor de update <span aria-hidden="true" className="text-accent">→</span>
            </Link>
          </div>
          <nav aria-label="Modellen" className="text-sm">
            <h4 className="mb-4 text-xs uppercase tracking-[0.18em] text-ink-muted">Modellen</h4>
            <ul className="space-y-2.5">
              <li><Link href="/merken" className="no-underline hover:text-accent">Alle merken</Link></li>
              <li><Link href="/amerikaans" className="no-underline hover:text-accent">Amerikaans</Link></li>
              <li><Link href="/collecties" className="no-underline hover:text-accent">Collecties</Link></li>
              <li><Link href="/journal" className="no-underline hover:text-accent">Journal</Link></li>
            </ul>
          </nav>
          <nav aria-label="Kennis" className="text-sm">
            <h4 className="mb-4 text-xs uppercase tracking-[0.18em] text-ink-muted">Kennis</h4>
            <ul className="space-y-2.5">
              <li><Link href="/blog" className="no-underline hover:text-accent">Blog</Link></li>
              <li><Link href="/forum" className="no-underline hover:text-accent">Forum</Link></li>
              <li><Link href="/shop" className="no-underline hover:text-accent">Shop</Link></li>
              <li><Link href="/leren" className="no-underline hover:text-accent">Kenniscentrum</Link></li>
              <li><Link href="/over-ons" className="no-underline hover:text-accent">Over ons</Link></li>
            </ul>
          </nav>
          <div className="text-sm">
            <h4 className="mb-4 text-xs uppercase tracking-[0.18em] text-ink-muted">Colofon</h4>
            <p className="leading-relaxed text-ink-muted">Statische site. Geen tracking, geen cookies, geen reclame.<br />Brongegevens: openbare merkhistories en persberichten.</p>
            <div className="mt-5 flex items-center gap-2" aria-label="Volg 4x4models op social media">
              {["X", "IG", "YT", "M"].map((item) => (
                <a key={item} href="#" className="inline-flex h-9 w-9 items-center justify-center border border-rule text-xs text-ink-muted no-underline transition-all hover:-translate-y-px hover:border-accent hover:text-accent">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-rule pt-6 text-xs text-ink-muted sm:flex-row sm:items-center">
          <span>© 2026 4x4models. Alle rechten voorbehouden. · 18 merken</span>
          <span>Gebouwd met Next.js · Statisch gegenereerd</span>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-ink">
          <div className="absolute inset-0">
            <Image src="/images/hero/homepage.jpg" alt="Rij iconische 4x4-modellen op een woestijnplateau bij zonsondergang." fill priority sizes="100vw" className="animate-ken-burns object-cover will-change-transform" />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/55" />
          <div className="relative h-full">
            <div className="mx-auto flex h-full max-w-wide flex-col justify-end px-6 pb-14 sm:px-10 sm:pb-20">
              <div className="max-w-3xl">
                <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-white/80 sm:mb-4 sm:text-xs">Kenniscentrum · 91 modellen · 18 merken</p>
                <h1 className="text-4xl font-medium leading-[1.02] tracking-tightest text-white sm:text-6xl lg:text-7xl">Vier wielen, één planeet.</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-content px-6 pb-10 pt-20 sm:px-10 sm:pt-28">
          <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-7">
              <h2 className="text-3xl leading-[1.05] tracking-tightest text-ink sm:text-5xl">De 4x4-modellen die de wereld vormden.</h2>
            </div>
            <div className="md:col-span-5">
              <p className="text-[15px] leading-relaxed text-ink-soft sm:text-base">Van de Willys MB uit 1941 tot de nieuwe generatie elektrische terreinwagens — wij verzamelen verhalen, techniek en specificaties van de meest iconische 4x4-modellen aller tijden. Onafhankelijk, zonder reclame, zonder poespas.</p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-content px-6 sm:px-10"><div className="divider" /></div>

        <section className="relative overflow-hidden bg-rust-soft" aria-labelledby="stats-heading">
          <div aria-hidden="true" className="live-pattern absolute inset-0 pointer-events-none" />
          <div className="relative mx-auto max-w-content px-6 py-16 sm:px-10 sm:py-24">
            <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-rust">In cijfers</p>
            <h2 id="stats-heading" className="max-w-3xl text-3xl leading-[1.05] tracking-tightest text-ink sm:text-5xl">Een kenniscentrum dat <span className="text-accent">blijft groeien</span>.</h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-base">Drie getallen die de omvang van ons dossier samenvatten — bijgewerkt met elke nieuwe release.</p>
            <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 md:grid-cols-3 md:gap-0">
              {[
                ["18", "Merken"],
                ["91+", "Modellen"],
                ["17", "Artikelen"],
              ].map(([number, label], index) => (
                <div key={label} className={`${index === 0 ? "md:pr-10" : index === 1 ? "md:border-r md:border-rust/30 md:px-10" : "md:pl-10"} ${index < 2 ? "md:border-r md:border-rust/30" : ""}`}>
                  <div className="font-display text-6xl leading-none tracking-tightest text-accent sm:text-7xl md:text-8xl">{number}</div>
                  <div className="mt-3 text-sm tracking-tight text-ink-soft sm:text-base">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-content px-6 pb-10 pt-16 sm:px-10 sm:pt-20">
          <SectionHeading title="Uitgelichte merken" href="/merken" linkText="Alle merken" />
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-3">
            {brands.map((brand) => (
              <ImageCard key={brand.href} title={brand.title} href={brand.href} image={brand.image} eyebrow={brand.count} text={brand.text} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-content px-6 pb-10 pt-16 sm:px-10 sm:pt-20">
          <SectionHeading title="Collecties" href="/collecties" linkText="Alle collecties" />
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-3">
            {collections.map((collection) => (
              <ImageCard key={collection.href} {...collection} text={collection.text} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-content px-6 pb-10 pt-16 sm:px-10 sm:pt-20">
          <SectionHeading title="Laatste artikelen" href="/blog" linkText="Alle artikelen" />
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-3">
            {articles.map((article) => (
              <ImageCard key={article.href} {...article} text={article.text} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-content px-6 pb-10 pt-16 sm:px-10 sm:pt-20">
          <SectionHeading title="Shop" href="/shop" linkText="Naar shop" />
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-3">
            {products.map((product) => (
              <Link key={product.href} href={product.href} className="group flex h-full flex-col rounded-[2px] no-underline transition-transform duration-200 ease-out-soft hover:scale-[1.02] hover:shadow-[0_18px_40px_-18px_rgba(12,12,12,0.45)]">
                <div className="relative aspect-square w-full overflow-hidden bg-ink">
                  <Image src={product.image} alt={`${product.title} — productafbeelding`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-slow ease-out-soft group-hover:scale-[1.05]" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 inline-flex bg-paper/95 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-ink ring-1 ring-ink/15">{product.label}</span>
                  <span className="absolute right-3 top-3 inline-flex bg-paper/95 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-accent ring-1 ring-accent/50">{product.status}</span>
                </div>
                <div className="flex grow flex-col gap-2 pt-4 sm:pt-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium tracking-tightest text-ink">{product.price}</span>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">SKU 4X4</span>
                  </div>
                  <h3 className="text-base font-medium leading-snug tracking-tightest text-ink transition-colors group-hover:text-accent sm:text-lg">{product.title}</h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-ink-soft">{product.text}</p>
                  <span className="mt-auto inline-flex gap-2 pt-3 text-sm text-accent">Bekijk <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-content px-6 pb-20 pt-16 sm:px-10 sm:pt-24">
          <div className="border border-rule bg-white/40 p-8 sm:p-14">
            <h2 className="max-w-2xl text-2xl leading-tight tracking-tightest sm:text-4xl">Op zoek naar een specifiek model?</h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-base">Blader door ons volledige merkenoverzicht met technische specificaties, productiehistories en off-road-capaciteiten van 18 merken.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/merken" className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm tracking-tight text-paper no-underline transition-colors hover:bg-accent">Bekijk alle merken <span aria-hidden="true">→</span></Link>
              <Link href="/leren" className="inline-flex items-center gap-2 border border-ink px-6 py-3 text-sm tracking-tight text-ink no-underline transition-colors hover:bg-ink hover:text-paper">Kenniscentrum <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
