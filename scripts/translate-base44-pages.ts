type WebsitePage = {
  id: string;
  slug?: string;
  locale?: "nl" | "en";
  status?: string;
  translation_status?: string;
  translated_from_id?: string;
};

type TranslationResult = {
  errors?: Array<{ error?: string }>;
};

export {};

declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
  exit(code: number): never;
};

declare const base44: {
  entities: {
    WebsitePage: {
      list(sort?: string, limit?: number): Promise<WebsitePage[]>;
    };
  };
  functions: {
    invoke(name: string, payload: Record<string, unknown>): Promise<{
      data?: TranslationResult;
      errors?: TranslationResult["errors"];
    }>;
  };
};

const DEFAULT_CONCURRENCY = 4;

function englishSlug(sourceSlug: string | undefined) {
  const clean = String(sourceSlug || "home").replace(/^\/+|\/+$/g, "") || "home";
  return clean === "home" ? "en" : `en/${clean.replace(/^en\//, "")}`;
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const concurrency = Math.min(
  8,
  positiveInteger(Deno.env.get("BASE44_TRANSLATION_CONCURRENCY"), DEFAULT_CONCURRENCY),
);
const limit = positiveInteger(Deno.env.get("BASE44_TRANSLATION_LIMIT"), Number.MAX_SAFE_INTEGER);

const pages = await base44.entities.WebsitePage.list("slug", 500) as WebsitePage[];
const sources = pages.filter((page) => (
  (page.locale || "nl") === "nl"
  && !/^en(?:\/|$)/.test(page.slug || "")
  && page.status !== "archived"
));
const pending = sources.filter((source) => {
  const targetSlug = englishSlug(source.slug);
  const target = pages.find((page) => (
    page.slug === targetSlug || page.translated_from_id === source.id
  ));
  return !target || target.locale !== "en" || target.translation_status !== "published";
}).slice(0, limit);

console.log(JSON.stringify({
  source_pages: sources.length,
  pending_pages: pending.length,
  concurrency,
  limit: Number.isFinite(limit) ? limit : null,
}));

let cursor = 0;
let completed = 0;
const failures: Array<{ id: string; slug: string; error: string }> = [];

async function worker(workerNumber: number) {
  while (true) {
    const index = cursor;
    cursor += 1;
    const source = pending[index];
    if (!source) return;

    try {
      const response = await base44.functions.invoke("translateWebsitePages", {
        source_page_id: source.id,
        auto_publish: true,
      });
      const result = (response?.data || response) as TranslationResult;
      if (result?.errors?.length) {
        throw new Error(result.errors[0]?.error || "Vertaalfunctie rapporteerde een fout");
      }
      completed += 1;
      console.log(
        `[${completed}/${pending.length}] worker ${workerNumber}: /${source.slug || "home"} vertaald`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ id: source.id, slug: source.slug || "home", error: message });
      console.error(
        `[${completed}/${pending.length}] worker ${workerNumber}: /${source.slug || "home"} MISLUKT: ${message}`,
      );
    }
  }
}

await Promise.all(
  Array.from({ length: Math.min(concurrency, pending.length) }, (_, index) => worker(index + 1)),
);

console.log(JSON.stringify({
  completed,
  failed: failures.length,
  failures,
}, null, 2));

if (failures.length) Deno.exit(1);
