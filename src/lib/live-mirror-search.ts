import { readFile } from "node:fs/promises";
import path from "node:path";
import manifest from "@/data/live-mirror/manifest.json";
import { mirrorImageForPath } from "@/data/live-mirror/image-map";
import {
  publicPathForLocale,
  stripSupportedLocalePrefix,
  type Locale,
} from "@/lib/i18n-routing";

type MirrorManifest = {
  pages: Record<string, string>;
};

export type SearchResult = {
  path: string;
  title: string;
  description: string;
  section: string;
  image: string;
  score: number;
};

type SearchDocument = SearchResult & {
  body: string;
  haystack: string;
};

const manifestPages = (manifest as MirrorManifest).pages;
const indexCache = new Map<Locale, Promise<SearchDocument[]>>();

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, " - ")
    .replace(/&ndash;/g, " - ")
    .replace(/&deg;/g, " graden");
}

function stripHtml(value: string) {
  return decodeHtml(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function firstMatch(html: string, pattern: RegExp) {
  return stripHtml(html.match(pattern)?.[1] || "");
}

function normalizeSearchText(value: string) {
  return decodeHtml(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchTokens(query: string) {
  return normalizeSearchText(query)
    .split(" ")
    .filter((token) => token.length >= 2);
}

function sectionForPath(basePath: string, locale: Locale) {
  const labels = locale === "nl"
    ? {
      home: "Overzicht",
      brands: "Merk",
      model: "Model",
      blog: "Blog",
      journal: "Journal",
      collection: "Collectie",
      shop: "Shop",
      forum: "Forum",
      learn: "Kennis",
      american: "Amerikaans",
      page: "Pagina",
    }
    : {
      home: "Overview",
      brands: "Brand",
      model: "Model",
      blog: "Blog",
      journal: "Journal",
      collection: "Collection",
      shop: "Shop",
      forum: "Forum",
      learn: "Knowledge",
      american: "American",
      page: "Page",
    };

  const parts = basePath.split("/").filter(Boolean);
  if (!parts.length) return labels.home;
  if (parts[0] === "merken") return parts.length >= 3 ? labels.model : labels.brands;
  if (parts[0] === "blog") return labels.blog;
  if (parts[0] === "journal") return labels.journal;
  if (parts[0] === "collecties") return labels.collection;
  if (parts[0] === "shop") return labels.shop;
  if (parts[0] === "forum") return labels.forum;
  if (parts[0] === "leren") return labels.learn;
  if (parts[0] === "amerikaans") return labels.american;
  return labels.page;
}

function publicPathForSearch(basePath: string, locale: Locale) {
  return publicPathForLocale(basePath, locale);
}

function chooseContentPath(basePath: string, locale: Locale) {
  const englishPath = basePath === "/" ? "/en" : `/en${basePath}`;
  return locale === "en" && manifestPages[englishPath] ? englishPath : basePath;
}

async function buildSearchIndex(locale: Locale) {
  const basePaths = Array.from(
    new Set(Object.keys(manifestPages).map((route) => stripSupportedLocalePrefix(route)))
  ).sort();

  const documents = await Promise.all(
    basePaths.map(async (basePath) => {
      const contentPath = chooseContentPath(basePath, locale);
      const fileName = manifestPages[contentPath] || manifestPages[basePath];
      if (!fileName) return undefined;

      const html = await readFile(
        path.join(process.cwd(), "src", "data", "live-mirror", "pages", fileName),
        "utf8"
      );
      const title = firstMatch(html, /<title>([\s\S]*?)<\/title>/i)
        .replace(/\s*·\s*4x4models$/i, "")
        .replace(/\s*—\s*4x4models.*$/i, "")
        .trim() || (basePath === "/" ? "4x4models" : basePath);
      const h1 = firstMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
      const description = firstMatch(html, /<meta\s+name="description"\s+content="([^"]*)"/i)
        || firstMatch(html, /<meta\s+property="og:description"\s+content="([^"]*)"/i);
      const mainText = firstMatch(html, /<main\b[^>]*>([\s\S]*?)<\/main>/i);
      const body = [h1, description, mainText].filter(Boolean).join(" ");
      const pathLabel = basePath.replace(/[/-]+/g, " ");
      const pathForLocale = publicPathForSearch(basePath, locale);

      return {
        path: pathForLocale,
        title,
        description: description || h1 || pathForLocale,
        section: sectionForPath(basePath, locale),
        image: mirrorImageForPath(basePath),
        score: 0,
        body,
        haystack: normalizeSearchText([title, h1, description, pathLabel, mainText].join(" ")),
      } satisfies SearchDocument;
    })
  );

  return documents.filter((document): document is SearchDocument => Boolean(document));
}

export function getSearchIndex(locale: Locale) {
  if (!indexCache.has(locale)) {
    indexCache.set(locale, buildSearchIndex(locale));
  }

  return indexCache.get(locale)!;
}

export async function searchLiveMirror(query: string, locale: Locale, limit = 36) {
  const tokens = searchTokens(query);
  if (!tokens.length) return [];

  const exact = normalizeSearchText(query);
  const documents = await getSearchIndex(locale);

  return documents
    .map((document) => {
      let score = 0;
      const title = normalizeSearchText(document.title);
      const description = normalizeSearchText(document.description);
      const pathText = normalizeSearchText(document.path);

      if (title.includes(exact)) score += 26;
      if (description.includes(exact)) score += 12;
      if (pathText.includes(exact)) score += 14;
      if (document.haystack.includes(exact)) score += 10;

      for (const token of tokens) {
        if (title.includes(token)) score += 10;
        if (description.includes(token)) score += 5;
        if (pathText.includes(token)) score += 5;
        if (document.haystack.includes(token)) score += 2;
      }

      return { ...document, score };
    })
    .filter((document) => document.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit)
    .map((document) => ({
      path: document.path,
      title: document.title,
      description: document.description,
      section: document.section,
      image: document.image,
      score: document.score,
    }));
}
