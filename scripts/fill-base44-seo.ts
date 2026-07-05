const write = Deno.env.get("BASE44_WRITE") === "true";
const canonicalOrigin = "https://www.4x4models.com";
const webshopName = "4x4models";

type EntityRecord = Record<string, unknown> & { id?: string };

const stats: Record<string, number | string> = {
  write: write ? "true" : "false",
  WebsitePageScanned: 0,
  WebsitePageUpdated: 0,
  SeoTaskUpserted: 0,
  SeoAuditIssueUpserted: 0,
  TranslationJobUpserted: 0,
};

function entity(name: string) {
  return base44.entities[name];
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRateLimitError(error: unknown) {
  const maybe = error as { status?: number; data?: { message?: string }; message?: string };
  return maybe?.status === 429 ||
    /rate limit/i.test(maybe?.message || "") ||
    /rate limit/i.test(maybe?.data?.message || "");
}

async function withRetry<T>(operation: () => Promise<T>, label: string): Promise<T> {
  const delays = [1500, 3500, 8000, 16000, 30000];

  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    if (attempt === 0) await sleep(120);

    try {
      return await operation();
    } catch (error) {
      if (!isRateLimitError(error) || attempt === delays.length) throw error;
      console.warn(`${label} hit rate limit; retrying in ${delays[attempt]}ms`);
      await sleep(delays[attempt]);
    }
  }

  throw new Error(`${label} failed after retries`);
}

async function listAll(entityName: string) {
  return await withRetry(
    () => entity(entityName).list(undefined, 5000) as Promise<EntityRecord[]>,
    `${entityName}.list`,
  );
}

async function updateRecord(entityName: string, id: string, payload: EntityRecord) {
  if (!write) return;
  await withRetry(() => entity(entityName).update(id, payload), `${entityName}.update`);
}

async function createRecord(entityName: string, payload: EntityRecord) {
  if (!write) return payload;
  return await withRetry(() => entity(entityName).create(payload), `${entityName}.create`);
}

async function upsert(entityName: string, records: EntityRecord[], match: (record: EntityRecord) => boolean, payload: EntityRecord) {
  const existing = records.find(match);
  if (existing?.id) {
    await updateRecord(entityName, existing.id, payload);
    return existing;
  }

  const created = await createRecord(entityName, payload);
  records.push(created as EntityRecord);
  return created;
}

function stripTags(value = "") {
  return value
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function words(text: string) {
  return text.toLowerCase().match(/[a-z0-9À-ÿ'-]+/gi) || [];
}

function slugToKeyword(slug: string, title: string) {
  const fromSlug = slug
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean)
    .at(-1)
    ?.replace(/-/g, " ");
  const candidate = fromSlug || title;
  return candidate
    .replace(/\b(en|de|het|een|voor|van|met|the|and|or|of|to|in)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80) || "4x4models";
}

function descriptionFrom(text: string, fallback: string) {
  const clean = text || fallback;
  if (clean.length <= 155) return clean;
  return `${clean.slice(0, 152).replace(/\s+\S*$/, "")}...`;
}

function scorePage(input: {
  title: string;
  description: string;
  keyword: string;
  text: string;
  content: string;
}) {
  let score = 20;
  const title = input.title.toLowerCase();
  const description = input.description.toLowerCase();
  const keyword = input.keyword.toLowerCase();
  const wordCount = words(input.text).length;

  if (input.title.length >= 35 && input.title.length <= 70) score += 15;
  if (input.description.length >= 120 && input.description.length <= 160) score += 18;
  if (keyword && title.includes(keyword.split(" ")[0])) score += 12;
  if (keyword && description.includes(keyword.split(" ")[0])) score += 10;
  if (wordCount >= 250) score += 14;
  if (wordCount >= 700) score += 6;
  if (/<img\b/i.test(input.content)) score += 6;
  if (/<a\b/i.test(input.content)) score += 7;
  if (/<h1\b/i.test(input.content)) score += 6;
  if (input.content.includes("schema.org")) score += 6;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function readability(text: string) {
  const sentences = text.split(/[.!?]+/).filter((part) => part.trim().length > 0).length || 1;
  const wordCount = words(text).length;
  const averageSentence = wordCount / sentences;
  if (averageSentence <= 14) return 92;
  if (averageSentence <= 19) return 82;
  if (averageSentence <= 25) return 70;
  return 58;
}

function canonicalFor(slug: string) {
  const path = slug === "home" ? "/" : `/${slug.replace(/^\/+/, "")}`;
  return new URL(path, canonicalOrigin).toString();
}

function hash(value: string) {
  let h = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    h ^= value.charCodeAt(index);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return (h >>> 0).toString(16);
}

async function main() {
  const webshops = await listAll("Webshop");
  const webshop = webshops.find((record) => record.name === webshopName) || webshops[0];
  const webshopId = String(webshop?.id || "");
  const [pages, tasks, issues, jobs] = await Promise.all([
    listAll("WebsitePage"),
    listAll("SeoTask"),
    listAll("SeoAuditIssue"),
    listAll("TranslationJob"),
  ]);

  const now = new Date().toISOString();

  for (const page of pages) {
    stats.WebsitePageScanned = Number(stats.WebsitePageScanned) + 1;
    if (page.status && page.status !== "published") continue;

    const slug = String(page.slug || "home").replace(/^\/+|\/+$/g, "") || "home";
    const title = String(page.title || slug);
    const content = String(page.content || "");
    const text = stripTags(content || title);
    const keyword = String(page.focus_keyword || slugToKeyword(slug, title));
    const description = descriptionFrom(String(page.meta_description || ""), text || title);
    const seoTitle = String(page.seo_title || title).slice(0, 70);
    const pageScore = scorePage({ title: seoTitle, description, keyword, text, content });
    const readScore = readability(text);
    const wordCount = words(text).length;
    const canonicalUrl = canonicalFor(slug);
    const seoStatus = pageScore >= 82 ? "ready" : "needs_work";

    await updateRecord("WebsitePage", String(page.id), {
      webshop_id: page.webshop_id || webshopId,
      locale: page.locale || "nl",
      source_locale: page.source_locale || "nl",
      translation_status: page.translation_status || "source",
      focus_keyword: keyword,
      secondary_keywords: page.secondary_keywords || [],
      meta_description: description,
      seo_title: seoTitle,
      google_preview_title: seoTitle,
      google_preview_url: canonicalUrl,
      google_preview_description: description,
      canonical_url: canonicalUrl,
      seo_score: pageScore,
      readability_score: readScore,
      word_count: wordCount,
      seo_status: seoStatus,
    });
    stats.WebsitePageUpdated = Number(stats.WebsitePageUpdated) + 1;

    const recommendations: Array<{ type: string; severity: string; title: string; body: string }> = [];
    if (description.length < 120) {
      recommendations.push({
        type: "short_meta",
        severity: "medium",
        title: `Metaomschrijving uitbreiden voor ${title}`,
        body: "Maak de omschrijving 120-160 tekens en zet het hoofdzoekwoord erin.",
      });
    }
    if (wordCount < 250) {
      recommendations.push({
        type: "low_word_count",
        severity: "medium",
        title: `Meer inhoud toevoegen aan ${title}`,
        body: "Voeg concrete uitleg, specificaties, FAQ of interne links toe zodat de pagina sterker rankt.",
      });
    }
    if (!content.includes("<img")) {
      recommendations.push({
        type: "missing_image",
        severity: "low",
        title: `Beeld controleren voor ${title}`,
        body: "Koppel een passende foto uit de media library en geef die een duidelijke alt-tekst.",
      });
    }

    for (const recommendation of recommendations) {
      await upsert(
        "SeoAuditIssue",
        issues,
        (record) => record.page_slug === slug && record.issue_type === recommendation.type,
        {
          webshop_id: webshopId,
          page_slug: slug,
          issue_type: recommendation.type,
          severity: recommendation.severity,
          title: recommendation.title,
          recommendation: recommendation.body,
          status: "open",
          created_for_score: pageScore,
        },
      );
      stats.SeoAuditIssueUpserted = Number(stats.SeoAuditIssueUpserted) + 1;
    }

    if (pageScore < 82) {
      await upsert(
        "SeoTask",
        tasks,
        (record) => record.page_slug === slug && record.task_type === "seo_fix",
        {
          webshop_id: webshopId,
          page_slug: slug,
          title: `SEO verbeteren: ${title}`,
          task_type: "seo_fix",
          priority: pageScore < 65 ? "high" : "medium",
          status: "todo",
          recommendation: recommendations[0]?.body || "Controleer titel, metaomschrijving, zoekwoord en interne links.",
          target_keyword: keyword,
          current_score: pageScore,
        },
      );
      stats.SeoTaskUpserted = Number(stats.SeoTaskUpserted) + 1;
    }

    await upsert(
      "TranslationJob",
      jobs,
      (record) => record.entity_name === "WebsitePage" && record.record_id === page.id && record.target_locale === "en",
      {
        webshop_id: webshopId,
        entity_name: "WebsitePage",
        record_id: page.id,
        source_locale: "nl",
        target_locale: "en",
        source_title: title,
        source_slug: slug,
        status: page.translation_status === "published" ? "published" : "queued",
        source_hash: hash(`${title}\n${description}\n${content}`),
        notes: "Eigenaar schrijft Nederlands; Engelse publicatie wordt vanuit deze wachtrij voorbereid.",
        queued_at: now,
      },
    );
    stats.TranslationJobUpserted = Number(stats.TranslationJobUpserted) + 1;
  }

  console.log(JSON.stringify(stats, null, 2));
}

await main();
