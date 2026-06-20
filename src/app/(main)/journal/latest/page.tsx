"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
} from "lucide-react";

const heroArticle = {
  slug: "crossing-great-divide",
  category: "Expedition",
  readTime: "12 MIN READ",
  title: "Crossing the Great Divide: A 3,000 Mile Journey",
  excerpt:
    "When the asphalt ends and the real map begins, preparation is the only currency that matters. We took a heavily modified 79 Series into the heart of the divide to test the limits of modern recovery gear and human endurance.",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBPbN_0dS3v02zzDHRMpHGvqCbZUEVzyXWtXWFd_FlDd6jFFMpNfyLfKgguspn2qkai6HMo2k3Z2ZDXexEaJe66httuk4C4v8jjv4yLbPZNEgL0M_Y3BncUq6xNKdvYMEu4J5ClTTlyCCEprbjuJ5KQvUr0fNVB2Yuk3f6Pni8fcrmO2Yq44hbIb5U2vXY8ZWeUTJOXdNu7JWXUzc2yBCjYVHFKhxky4C6IoJgEO5l5I-Z5o_Zsw4ZhbWn6fRpd7q4LR5zhlfMqLz9n",
  alt: "Dark gray Toyota Land Cruiser driving along a rugged dirt mountain ridge at dusk",
  author: "J. Reynolds",
  date: "OCT 14, 2024",
};

const categories = [
  "All Reports",
  "Adventure",
  "Gear",
  "Technical",
  "Community",
];

const articles = [
  {
    slug: "winch-spooling",
    category: "MAINTENANCE",
    title: "Winch Spooling: The Deadly Sins of Recovery",
    excerpt:
      "A frayed synthetic line isn't just an inconvenience; it's a loaded gun. We break down the absolute necessities of maintaining your primary extraction tool in sandy environments.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6CpxB8WDUpexwHy050cXT5Mue1Cq6TQOYXVPaoC7Pv2JZlHiwXazzZI0oG1sCb1uzsAbleJaRRF9npdsQjPCw_Zg9zP526Cv2KnzL14bmhh5W0z4GNvruJzxJS03qH4hgMX4VU1mToSAmWDl0eT7DLeYhZjDJrMZSEnrypt4iDjJ0y_kPliQf1nsvutSCBO3wOlfs3RK-lAzF1Bd61J9JIAjSxTCfMYdtCS1DB0rOV1k_RHWbYsPgf7-XVJ9Qh3WONREz9YDS3Le1",
    alt: "Close up of mechanical gears and a winch cable on a truck bumper",
    author: "K. Vance",
    readTime: "8 MIN READ",
  },
  {
    slug: "thermal-defiance-tents",
    category: "GEAR",
    title: "Thermal Defiance: Top Tier Hardshell Tents",
    excerpt:
      "When the mercury plummets in the high desert, canvas cuts it no more. We tested three premium hardshell RTTs against freezing winds and relentless grit.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9y4KrRCYFKJrs4UJXSMLp0gIHiGwwBYhyUaxfLeTvc0IzB6ta2mt-_9xQvlskNOtfMxJYW1u8JFEA3ftdlOLrvIOh7lrGKxwIAWLDk3muNkecHa9Pn5ByEMV0fZqXHIru-nsLzO8S4FRQnjdDfBbfOM6rK7mvme7XC4VLKbxa2Xs9UGKIabIcOluX041Q7PoX6lxR-7fxCJ5VWr1SBN-plwfhY8IazyPCDGvJ1wR3EOnBDu-phbORuwkXnJommuAd2G8jJ9a8YYEn",
    alt: "Rooftop tent open on a truck parked in a vast barren desert landscape under a clear night sky",
    author: "M. Chen",
    readTime: "15 MIN READ",
  },
  {
    slug: "kdss-tuning",
    category: "TECHNICAL",
    title: "Kinetic Dynamics: Tuning the KDSS System",
    excerpt:
      "Toyota's Kinetic Dynamic Suspension System is witchcraft to some, but a tunable weapon to others. A deep dive into tricking the system for maximum articulation.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB5qKnq-gssqjP_LydM9loH-MzmdaHjVjqqFaeYXO6UthJLuLYI-Sz5UB4UM9m8Hwttn-M61pa8gPPYStkojAQv2SKDb84p1rhk1ivuyAdFJDaxddHfTG1x52x5iHo8_B_72mBCkDT87PZoxtlzYl8lKQsNM1tu6kQ-iU8RFcuKyiSrTm5Q_PUsFh6jElkYHJodpvwMt8v87FplAv23MtzKBCqqwAlRTL56UqAsoqNpu9teVS8-XszFslhQJHnNC9ODqpXaHsUaFbpJ",
    alt: "Close up of a dirty truck tire deeply articulated over a large rock showing suspension travel",
    author: "D. Barnes",
    readTime: "22 MIN READ",
  },
];

export default function LatestStoriesPage() {
  return (
    <main className="pt-24 md:pt-32 px-6 md:pl-12 lg:pl-24 max-w-[1600px] mx-auto w-full md:w-auto">
      {/* Header */}
      <header className="mb-12 relative z-10">
        <h1 className="font-headline text-[3.5rem] font-bold tracking-tighter text-on-surface uppercase leading-none mb-4">
          TOYOTA RIGS
        </h1>
        <p className="font-body text-tertiary text-lg max-w-2xl">
          Field reports, technical tear-downs, and survival guides from the
          vanguard of modern overlanding.
        </p>
      </header>

      {/* Hero Article */}
      <section className="mb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[614px] bg-surface-container-low rounded-br-lg rounded-bl-lg relative overflow-hidden group">
          {/* Image Side */}
          <div className="lg:col-span-8 lg:order-last h-[409px] lg:h-auto relative overflow-hidden">
            <Image
              src={heroArticle.image}
              alt={heroArticle.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent lg:hidden" />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low to-transparent hidden lg:block" />
          </div>

          {/* Content Side */}
          <div className="lg:col-span-4 flex flex-col justify-end p-8 lg:p-12 relative z-10 bg-surface-container-low">
            <div className="flex items-center space-x-3 mb-6">
              <span className="bg-secondary-container text-on-secondary-container font-label text-xs uppercase tracking-widest px-3 py-1">
                {heroArticle.category}
              </span>
              <span className="text-tertiary font-label text-xs uppercase tracking-widest flex items-center">
                <Clock className="w-3 h-3 mr-1" /> {heroArticle.readTime}
              </span>
            </div>
            <Link href={`/journal/${heroArticle.slug}`}>
              <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter text-on-surface mb-4 leading-tight group-hover:text-primary transition-colors">
                {heroArticle.title}
              </h2>
            </Link>
            <p className="font-body text-on-surface-variant mb-8 line-clamp-3">
              {heroArticle.excerpt}
            </p>
            <div className="flex items-center justify-between border-t border-outline-variant/15 pt-6 mt-auto">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF7XsZH_7PfIL1g1erOXQPyKwinbVHf-FC9fZ23mAnRUWUyDsMrxMJGnxlcCWWIi5QdVg7sHlhdUbS0DErRShNgxnfYioNz_O0O3tZofPGE8RaWxsm-vKoeonIIGY23T7Nr8V0HIxarydvPlVUYNFcKRxc7Tt2voE1Ehjx__3ZhAvFADTmX-naT5q4O_OOqzm4bEdMqvlLuA3fxOrWUT9AMO8--G8Vawiyzr9QrKZWXJpJXJCf07W1N2LWPYnsb9Tk_wJuHoo61wMb"
                    alt="Close up portrait of a rugged man with a short beard"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-on-surface">
                    {heroArticle.author}
                  </p>
                  <p className="font-label text-xs text-tertiary uppercase">
                    {heroArticle.date}
                  </p>
                </div>
              </div>
              <Link
                href={`/journal/${heroArticle.slug}`}
                className="text-secondary hover:text-primary transition-colors flex items-center font-label text-xs uppercase tracking-widest"
              >
                Read Dispatch <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="mb-12 relative z-10">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`bg-surface-container text-tertiary hover:bg-surface-container-high hover:text-on-surface border border-transparent px-6 py-2 rounded-sm font-label text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
                index === 0
                  ? "bg-surface-container-high text-primary border-outline-variant/15"
                  : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mb-20 relative z-10">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="group flex flex-col h-full bg-surface-container-high rounded-b-sm relative"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-t-sm relative">
              <Image
                src={article.image}
                alt={article.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 grayscale hover:grayscale-0"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-surface/80 backdrop-blur-md text-primary font-label text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm border border-outline-variant/20">
                  {article.category}
                </span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <Link href={`/journal/${article.slug}`}>
                <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">
                  {article.title}
                </h3>
              </Link>
              <p className="font-body text-sm text-tertiary mb-6 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between text-xs font-label text-on-surface-variant uppercase tracking-widest border-t border-outline-variant/10 pt-4">
                <span>BY {article.author}</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter Banner */}
      <section className="mb-20 bg-surface-container-lowest p-8 md:p-12 border-l-4 border-primary relative overflow-hidden z-10">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
          <span className="text-[300px] absolute -right-10 -top-20 text-primary/20 font-headline">
            EXPLORE
          </span>
        </div>
        <div className="max-w-2xl relative z-10">
          <h3 className="font-headline text-2xl font-bold text-on-surface uppercase tracking-tight mb-2">
            Join the Dispatch
          </h3>
          <p className="font-body text-tertiary mb-6">
            Receive unfiltered field reports, exclusive gear drops, and
            coordinate waypoints directly to your inbox. No fluff, just the
            trail ahead.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="ENTER YOUR COMMS FREQUENCY (EMAIL)"
              className="bg-surface-container-highest border-b-2 border-transparent focus:border-primary text-on-surface px-4 py-3 font-label text-xs uppercase tracking-widest w-full sm:w-auto flex-grow focus:ring-0 transition-colors placeholder:text-on-surface-variant/50"
            />
            <button
              type="submit"
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-8 py-3 rounded-sm hover:brightness-110 transition-all font-headline uppercase tracking-tight whitespace-nowrap"
            >
              Engage
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
