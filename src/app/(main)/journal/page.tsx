"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Bookmark,
  Rss,
  ChevronRight,
  User,
} from "lucide-react";
import { blogService } from "@/lib/services/blog";

// Types for article from API
interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  featured_image_url: string;
  featured_image_alt: string;
  author: string;
  created_at: string;
  status: string;
}

const latestNews = [
  {
    title: "ARB Releases New Summit Bar for LC300",
    daysAgo: "2 DAYS AGO",
  },
  {
    title: "Toyota Announces Solid Axle Concept",
    daysAgo: "5 DAYS AGO",
  },
  {
    title: "Baja 1000: Tacoma Takes Class Win",
    daysAgo: "1 WEEK AGO",
  },
];

const vehicleFilters = [
  "Land Cruiser (70/80/100/200/300)",
  "Hilux",
  "Tacoma",
  "FJ Cruiser",
];

const categoryFilters = ["EXPEDITION", "TECH", "TRAILS", "GEAR", "MAINTENANCE"];

export default function JournalPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const data = await blogService.list({ status: "published" });
        setArticles(data.records);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const toggleVehicle = (vehicle: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicle)
        ? prev.filter((v) => v !== vehicle)
        : [...prev, vehicle]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(article.category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Ambient Noise Layer */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-noise mix-blend-overlay opacity-5" />

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl">
        <div className="flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto">
          <Link href="/" className="flex items-center">
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
              <Link className="text-on-surface hover:text-primary transition-colors pb-1" href="/journal">
                Journal
              </Link>
            </li>
            <li>
              <Link className="text-on-surface hover:text-primary transition-colors pb-1" href="/shop">
                Shop
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
      <main className="flex-1 z-10 pt-24 pb-24">
      <div className="container mx-auto px-4 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      {/* Main Content Area */}
      <main className="w-full lg:w-2/3 flex flex-col gap-12">
        {/* Hero Post */}
        {loading ? (
          <div className="h-96 bg-surface-container-high rounded-lg animate-pulse flex items-center justify-center">
            <span className="text-tertiary font-label uppercase tracking-widest">Loading...</span>
          </div>
        ) : error ? (
          <div className="h-96 bg-surface-container-high rounded-lg flex items-center justify-center">
            <span className="text-error font-label uppercase tracking-widest">{error}</span>
          </div>
        ) : articles.length > 0 ? (
          <article className="bg-surface-container-high rounded-lg overflow-hidden flex flex-col group cursor-pointer relative">
            <div className="relative h-96 w-full overflow-hidden rounded-t-none">
              <Image
                src={articles[0].featured_image_url}
                alt={articles[0].featured_image_alt || articles[0].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dim to-transparent opacity-80" />
            </div>
            <div className="absolute bottom-0 left-0 p-8 w-full z-10 bg-surface/80 backdrop-blur-xl border-t border-outline-variant/15">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-secondary-container text-on-secondary-container text-xs font-label uppercase px-3 py-1 rounded-sm tracking-widest">
                  {articles[0].category}
                </span>
                <span className="text-tertiary text-sm font-label uppercase">
                  {new Date(articles[0].created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
                </span>
              </div>
              <Link href={`/journal/${articles[0].slug}`}>
                <h1 className="text-4xl lg:text-5xl font-headline font-bold tracking-tighter mb-4 text-on-surface group-hover:text-primary transition-colors">
                  {articles[0].title}
                </h1>
              </Link>
              <p className="text-on-surface-variant font-body text-base leading-relaxed mb-6 max-w-3xl">
                {articles[0].excerpt}
              </p>
              <Link
                href={`/journal/${articles[0].slug}`}
                className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold py-3 px-6 rounded-sm hover:brightness-110 transition-all flex items-center gap-2 w-fit"
              >
                READ FULL REPORT
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        ) : (
          <div className="h-96 bg-surface-container-high rounded-lg flex items-center justify-center">
            <span className="text-tertiary font-label uppercase tracking-widest">No articles yet</span>
          </div>
        )}

        {/* Grid Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {!loading && !error && filteredArticles.slice(1).map((article) => (
            <article
              key={article.slug}
              className="bg-surface-container-high rounded-lg flex flex-col h-full group cursor-pointer border border-outline-variant/15 hover:border-primary/30 transition-colors"
            >
              <div className="h-48 w-full overflow-hidden rounded-t-none relative">
                <Image
                  src={article.featured_image_url}
                  alt={article.featured_image_alt || article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-surface-container-highest text-primary text-xs font-label uppercase px-2 py-1 rounded-sm tracking-widest">
                    {article.category}
                  </span>
                </div>
                <Link href={`/journal/${article.slug}`}>
                  <h3 className="text-xl font-headline font-bold mb-3 text-on-surface group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-on-surface-variant font-body text-sm leading-relaxed mb-4 flex-grow">
                  {article.excerpt}
                </p>
                <div className="text-tertiary text-xs font-label uppercase mt-auto pt-4 border-t border-outline-variant/15 flex justify-between items-center">
                  <span>BY {article.author}</span>
                  <Bookmark className="w-4 h-4" />
                </div>
              </div>
            </article>
          ))}
          {loading && (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-surface-container-high rounded-lg h-80 animate-pulse" />
              ))}
            </>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button className="bg-transparent border border-outline-variant text-secondary font-label uppercase font-bold py-3 px-8 rounded-sm hover:bg-surface-container-high transition-all tracking-widest text-sm">
            LOAD OLDER POSTS
          </button>
        </div>
      </main>

      {/* Sidebar */}
      <aside className="w-full lg:w-1/3 flex flex-col gap-8 bg-surface-container-lowest p-6 border-l border-outline-variant/15 h-fit lg:sticky lg:top-28">
        <div className="mb-4 border-b border-outline-variant/15 pb-4">
          <h2 className="text-primary font-headline text-lg font-bold tracking-tight uppercase mb-1">
            FILTERS
          </h2>
          <p className="text-tertiary font-label text-xs uppercase tracking-widest">
            REFINE SEARCH
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Journal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-highest border-b-2 border-transparent border-b-outline-variant focus:border-b-primary focus:ring-0 text-on-surface px-4 py-3 font-body text-sm transition-colors rounded-t-sm outline-none"
          />
          <Search className="absolute right-3 top-3 w-5 h-5 text-on-surface-variant" />
        </div>

        {/* Models Filter */}
        <div className="flex flex-col gap-3">
          <h3 className="font-headline text-sm font-bold text-on-surface uppercase tracking-wider mb-2">
            Models
          </h3>
          {vehicleFilters.map((vehicle) => (
            <label
              key={vehicle}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedVehicles.includes(vehicle)}
                onChange={() => toggleVehicle(vehicle)}
                className="form-checkbox bg-surface-container-highest border-outline-variant text-primary rounded-sm focus:ring-primary focus:ring-offset-surface-container-lowest h-4 w-4"
              />
              <span className="text-on-surface-variant font-body text-sm group-hover:text-on-surface transition-colors">
                {vehicle}
              </span>
            </label>
          ))}
        </div>

        {/* Categories Filter */}
        <div className="flex flex-col gap-3">
          <h3 className="font-headline text-sm font-bold text-on-surface uppercase tracking-wider mb-2">
            Categories
          </h3>
          {categoryFilters.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="form-checkbox bg-surface-container-highest border-outline-variant text-primary rounded-sm focus:ring-primary focus:ring-offset-surface-container-lowest h-4 w-4"
              />
              <span className="text-on-surface-variant font-body text-sm group-hover:text-on-surface transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>

        <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold py-3 px-4 rounded-sm hover:brightness-110 transition-all w-full text-sm tracking-wider uppercase mt-4">
          APPLY FILTERS
        </button>

        {/* Latest News */}
        <div className="mt-8 pt-8 border-t border-outline-variant/15 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Rss className="w-4 h-4" />
            <h3 className="font-headline text-sm font-bold uppercase tracking-wider">
              LATEST NEWS
            </h3>
          </div>
          {latestNews.map((news, index) => (
            <Link key={index} href="#" className="group block">
              <h4 className="text-on-surface font-body text-sm font-semibold group-hover:text-primary transition-colors">
                {news.title}
              </h4>
              <span className="text-tertiary text-xs font-label uppercase mt-1 block">
                {news.daysAgo}
              </span>
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-8 bg-surface-container p-6 rounded-lg border border-outline-variant/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-2 relative z-10">
            THE SITREP
          </h3>
          <p className="text-on-surface-variant text-sm font-body mb-4 relative z-10">
            Get technical guides and trail reports delivered directly to your
            inbox. No spam, just grit.
          </p>
          <div className="flex flex-col gap-3 relative z-10">
            <input
              type="email"
              placeholder="CALLSIGN (EMAIL)"
              className="w-full bg-surface-container-highest border-b border-outline-variant focus:border-b-primary focus:ring-0 text-on-surface px-4 py-2 font-body text-sm transition-colors rounded-t-sm outline-none"
            />
            <button className="bg-surface-container-highest border border-outline-variant text-primary font-bold py-2 px-4 rounded-sm hover:bg-primary hover:text-on-primary transition-all text-sm tracking-wider uppercase">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </aside>
      </div>
      </main>
    </div>
  );
}
