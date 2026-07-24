type WebsitePage = {
  id: string;
  slug?: string;
  locale?: "nl" | "en";
  status?: string;
  translation_status?: string;
  translated_from_id?: string;
};

type WebsiteContent = {
  page_slug?: string;
  status?: string;
};

type TranslationJob = {
  id: string;
  record_id?: string;
  translated_record_id?: string;
  target_locale?: string;
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
    WebsiteSection: {
      list(sort?: string, limit?: number): Promise<WebsiteContent[]>;
    };
    WebsiteCard: {
      list(sort?: string, limit?: number): Promise<WebsiteContent[]>;
    };
    TranslationJob: {
      list(sort?: string, limit?: number): Promise<TranslationJob[]>;
      update(id: string, payload: Record<string, unknown>): Promise<TranslationJob>;
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
const sections = await base44.entities.WebsiteSection.list("page_slug", 5000) as WebsiteContent[];
const cards = await base44.entities.WebsiteCard.list("page_slug", 5000) as WebsiteContent[];
const jobs = await base44.entities.TranslationJob.list("record_id", 5000) as TranslationJob[];
const sources = pages.filter((page) => (
  (page.locale || "nl") === "nl"
  && !/^en(?:\/|$)/.test(page.slug || "")
  && page.status !== "archived"
));

function activeCount(records: WebsiteContent[], pageSlug: string | undefined) {
  return records.filter((record) => (
    record.page_slug === pageSlug && record.status !== "archived"
  )).length;
}

const pending = sources.filter((source) => {
  const targetSlug = englishSlug(source.slug);
  const target = pages.find((page) => (
    page.slug === targetSlug || page.translated_from_id === source.id
  ));
  return !target
    || target.locale !== "en"
    || target.translation_status !== "published"
    || activeCount(sections, source.slug) !== activeCount(sections, targetSlug)
    || activeCount(cards, source.slug) !== activeCount(cards, targetSlug);
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

const refreshedPages = await base44.entities.WebsitePage.list("slug", 500) as WebsitePage[];
let jobsBackfilled = 0;
const jobUpdates = sources.flatMap((source) => {
  const target = refreshedPages.find((page) => (
    page.slug === englishSlug(source.slug) || page.translated_from_id === source.id
  ));
  const job = jobs.find((item) => (
    item.record_id === source.id && item.target_locale === "en"
  ));
  if (!target?.id || !job?.id || job.translated_record_id === target.id) {
    return [];
  }

  return [{ jobId: job.id, targetId: target.id }];
});

for (let index = 0; index < jobUpdates.length; index += 8) {
  const batch = jobUpdates.slice(index, index + 8);
  await Promise.all(batch.map(({ jobId, targetId }) => (
    base44.entities.TranslationJob.update(jobId, {
      translated_record_id: targetId,
    })
  )));
  jobsBackfilled += batch.length;
}

console.log(JSON.stringify({
  completed,
  failed: failures.length,
  jobs_backfilled: jobsBackfilled,
  failures,
}, null, 2));

if (failures.length) Deno.exit(1);
