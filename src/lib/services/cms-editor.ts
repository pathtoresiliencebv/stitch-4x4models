import "server-only";
import { base44Fetch, base44List } from "@/lib/base44-api";
import {
  calculateSeoScore,
  canonicalForCmsSlug,
  plainText,
} from "@/lib/seo-score";
import type {
  SeoAuditIssue,
  SeoTask,
  TranslationJob,
  WebsiteCard,
  WebsitePage,
  WebsiteSection,
} from "@/types/base44";
import type {
  CmsEditorMutation,
  CmsEditorPage,
  CmsEditorSection,
} from "@/types/cms-editor";

type DatedWebsitePage = WebsitePage & { updated_date?: string };

function cleanText(value: unknown, max = 10_000) {
  return String(value || "").replace(/\u0000/g, "").trim().slice(0, max);
}

function cleanOptional(value: unknown, max?: number) {
  const cleaned = cleanText(value, max);
  return cleaned || undefined;
}

function cleanSlug(value: string) {
  return value.replace(/^\/+|\/+$/g, "") || "home";
}

function cmsScope() {
  return process.env.NEXT_PUBLIC_WEBSHOP_ID
    ? { webshop_id: process.env.NEXT_PUBLIC_WEBSHOP_ID }
    : {};
}

function composePageText(page: CmsEditorMutation["page"], sections: CmsEditorSection[]) {
  return [
    page.title,
    page.meta_description,
    ...sections.flatMap((section) => [
      section.eyebrow,
      section.title,
      section.body,
      ...section.cards.flatMap((card) => [
        card.title,
        card.subtitle,
        card.body,
        card.badge,
        card.meta,
      ]),
    ]),
  ].filter(Boolean).join(" ");
}

function pageHasImage(page: CmsEditorMutation["page"], sections: CmsEditorSection[]) {
  return Boolean(
    page.featured_image_url ||
    sections.some((section) => section.image_url || section.cards.some((card) => card.image_url)),
  );
}

function pageHasLink(sections: CmsEditorSection[]) {
  return sections.some((section) => section.cta_url || section.cards.some((card) => card.href));
}

function pageContentForScoring(
  currentContent: string | undefined,
  page: CmsEditorMutation["page"],
  sections: CmsEditorSection[],
) {
  const markers = [
    pageHasImage(page, sections) ? "<img>" : "",
    pageHasLink(sections) ? "<a>" : "",
    page.title ? "<h1>" : "",
  ].join("");
  return `${currentContent || ""}${markers}`;
}

async function upsertSeoTask(page: WebsitePage, score: number) {
  const { records } = await base44List<SeoTask>("SeoTask", {
    q: { page_slug: page.slug, task_type: "seo_fix", ...cmsScope() },
    limit: 1,
    sort_by: "-updated_date",
  });
  const existing = records[0];
  const payload: Partial<SeoTask> = {
    ...cmsScope(),
    page_slug: page.slug,
    title: `SEO verbeteren: ${page.title}`,
    task_type: "seo_fix",
    priority: score < 65 ? "high" : "medium",
    status: score >= 82 ? "done" : "todo",
    recommendation: score >= 82
      ? "De kerncontroles zijn groen. Controleer periodiek zoekprestaties en actualiteit."
      : "Werk titel, metaomschrijving, inhoud, beeld en interne links bij in het paginabeheer.",
    target_keyword: page.focus_keyword,
    current_score: score,
  };

  if (existing?.id) {
    await base44Fetch(`/entities/SeoTask/${existing.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  } else if (score < 82) {
    await base44Fetch("/entities/SeoTask", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

async function syncSeoIssues(page: WebsitePage, result: ReturnType<typeof calculateSeoScore>, hasImage: boolean) {
  const { records } = await base44List<SeoAuditIssue>("SeoAuditIssue", {
    q: { page_slug: page.slug, ...cmsScope() },
    limit: 100,
  });
  const desired = [
    {
      type: "short_meta",
      active: !result.checks.find((check) => check.key === "description")?.passed,
      severity: "medium",
      title: `Metaomschrijving verbeteren voor ${page.title}`,
      recommendation: "Maak de omschrijving 120-160 tekens en verwerk het hoofdzoekwoord natuurlijk.",
    },
    {
      type: "low_word_count",
      active: result.wordCount < 250,
      severity: "medium",
      title: `Meer inhoud toevoegen aan ${page.title}`,
      recommendation: "Voeg concrete uitleg, specificaties, FAQ of interne links toe.",
    },
    {
      type: "missing_image",
      active: !hasImage,
      severity: "low",
      title: `Beeld toevoegen aan ${page.title}`,
      recommendation: "Kies een passende foto uit de media library en vul een duidelijke alt-tekst in.",
    },
  ];

  for (const issue of desired) {
    const existing = records.find((record) => record.issue_type === issue.type);
    const payload: Partial<SeoAuditIssue> = {
      ...cmsScope(),
      page_slug: page.slug,
      issue_type: issue.type,
      severity: issue.severity,
      title: issue.title,
      recommendation: issue.recommendation,
      status: issue.active ? "open" : "fixed",
      created_for_score: result.score,
    };

    if (existing?.id) {
      await base44Fetch(`/entities/SeoAuditIssue/${existing.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else if (issue.active) {
      await base44Fetch("/entities/SeoAuditIssue", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
  }
}

async function queueEnglishTranslation(page: WebsitePage) {
  if (page.locale !== "nl") return;

  const { records } = await base44List<TranslationJob>("TranslationJob", {
    q: {
      entity_name: "WebsitePage",
      record_id: page.id,
      target_locale: "en",
      ...cmsScope(),
    },
    limit: 1,
    sort_by: "-updated_date",
  });
  const payload: Partial<TranslationJob> = {
    ...cmsScope(),
    entity_name: "WebsitePage",
    record_id: page.id,
    source_locale: "nl",
    target_locale: "en",
    source_title: page.title,
    source_slug: page.slug,
    status: "queued",
    notes: "Opnieuw in de vertaalwachtrij geplaatst na een Nederlandse CMS-wijziging.",
    queued_at: new Date().toISOString(),
  };

  if (records[0]?.id) {
    await base44Fetch(`/entities/TranslationJob/${records[0].id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  } else {
    await base44Fetch("/entities/TranslationJob", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export async function listCmsEditorPages() {
  const { records } = await base44List<DatedWebsitePage>("WebsitePage", {
    q: cmsScope(),
    limit: 500,
    sort_by: "slug",
  });
  return records;
}

export async function getCmsEditorPage(slug: string): Promise<CmsEditorPage | null> {
  const normalizedSlug = cleanSlug(slug);
  const [pageResponse, sectionResponse, cardResponse] = await Promise.all([
    base44List<DatedWebsitePage>("WebsitePage", {
      q: { slug: normalizedSlug, ...cmsScope() },
      limit: 10,
      sort_by: "-updated_date",
    }),
    base44List<WebsiteSection>("WebsiteSection", {
      q: { page_slug: normalizedSlug, ...cmsScope() },
      limit: 300,
      sort_by: "sort_order",
    }),
    base44List<WebsiteCard>("WebsiteCard", {
      q: { page_slug: normalizedSlug, ...cmsScope() },
      limit: 700,
      sort_by: "sort_order",
    }),
  ]);
  const page = pageResponse.records.find((record) => record.slug === normalizedSlug);
  if (!page) return null;

  const visibleSections = sectionResponse.records.filter((section) => section.status !== "archived");
  const visibleCards = cardResponse.records.filter((card) => card.status !== "archived");
  const sections = visibleSections.map((section) => ({
    ...section,
    cards: visibleCards.filter((card) => (
      card.section_id === section.id || card.section_key === section.section_key
    )),
  }));

  return { ...page, sections };
}

export async function saveCmsEditorPage(input: CmsEditorMutation) {
  const current = await getCmsEditorPage(input.page.slug);
  if (!current || current.id !== input.page.id) {
    throw new Error("CMS page not found");
  }

  const slug = cleanSlug(input.page.slug);
  const title = cleanText(input.page.title, 180);
  if (!title) throw new Error("Page title is required");

  const sections = input.sections.map((section, sectionIndex) => ({
    ...section,
    page_slug: slug,
    locale: input.page.locale || current.locale || "nl",
    section_key: cleanText(section.section_key || `section-${sectionIndex + 1}`, 120),
    eyebrow: cleanOptional(section.eyebrow, 180),
    title: cleanOptional(section.title, 240),
    body: cleanOptional(section.body, 20_000),
    image_url: cleanOptional(section.image_url, 2_000),
    image_alt: cleanOptional(section.image_alt, 500),
    cta_label: cleanOptional(section.cta_label, 160),
    cta_url: cleanOptional(section.cta_url, 2_000),
    layout: cleanOptional(section.layout, 120),
    background: cleanOptional(section.background, 120),
    status: section.status === "draft" ? "draft" : "published",
    sort_order: sectionIndex,
    cards: section.cards.map((card, cardIndex) => ({
      ...card,
      page_slug: slug,
      section_key: cleanText(section.section_key || `section-${sectionIndex + 1}`, 120),
      locale: input.page.locale || current.locale || "nl",
      title: cleanText(card.title, 240) || `Kaart ${cardIndex + 1}`,
      subtitle: cleanOptional(card.subtitle, 500),
      body: cleanOptional(card.body, 10_000),
      badge: cleanOptional(card.badge, 180),
      meta: cleanOptional(card.meta, 500),
      image_url: cleanOptional(card.image_url, 2_000),
      image_alt: cleanOptional(card.image_alt, 500),
      href: cleanOptional(card.href, 2_000),
      cta_label: cleanOptional(card.cta_label, 160),
      status: card.status === "draft" ? "draft" : "published",
      sort_order: cardIndex,
    })),
  }));

  const seoTitle = cleanText(input.page.seo_title || title, 70);
  const metaDescription = cleanText(input.page.meta_description, 170);
  const keyword = cleanText(input.page.focus_keyword, 100);
  const pageText = composePageText(input.page, sections);
  const contentForScore = pageContentForScoring(current.content, input.page, sections);
  const score = calculateSeoScore({
    title: seoTitle,
    description: metaDescription,
    keyword,
    text: pageText,
    content: contentForScore,
    hasImage: pageHasImage(input.page, sections),
    hasLink: pageHasLink(sections),
    hasHeading: Boolean(title),
  });
  const canonical = cleanOptional(input.page.canonical_url, 2_000) || canonicalForCmsSlug(slug);
  const pagePayload: Partial<WebsitePage> = {
    title,
    slug,
    locale: input.page.locale || current.locale || "nl",
    status: input.page.status === "draft" ? "draft" : "published",
    seo_title: seoTitle,
    meta_description: metaDescription,
    google_preview_title: seoTitle,
    google_preview_url: canonical,
    google_preview_description: metaDescription,
    canonical_url: canonical,
    focus_keyword: keyword,
    secondary_keywords: (input.page.secondary_keywords || [])
      .map((value) => cleanText(value, 100))
      .filter(Boolean)
      .slice(0, 20),
    featured_image_url: cleanOptional(input.page.featured_image_url, 2_000),
    seo_score: score.score,
    readability_score: score.readability,
    word_count: score.wordCount,
    seo_status: score.score >= 82 ? "ready" : "needs_work",
    translation_status: input.page.locale === "nl" ? "queued" : current.translation_status,
  };

  const savedPage = await base44Fetch<WebsitePage>(`/entities/WebsitePage/${current.id}`, {
    method: "PUT",
    body: JSON.stringify(pagePayload),
  });

  const savedSectionIds = new Set<string>();
  const savedCardIds = new Set<string>();

  for (const section of sections) {
    const { cards, ...sectionPayload } = section;
    delete sectionPayload.editor_key;
    let savedSection: WebsiteSection;
    if (section.id && current.sections.some((item) => item.id === section.id)) {
      savedSection = await base44Fetch<WebsiteSection>(`/entities/WebsiteSection/${section.id}`, {
        method: "PUT",
        body: JSON.stringify(sectionPayload),
      });
    } else {
      const createPayload = { ...sectionPayload };
      delete createPayload.id;
      savedSection = await base44Fetch<WebsiteSection>("/entities/WebsiteSection", {
        method: "POST",
        body: JSON.stringify({ ...createPayload, ...cmsScope() }),
      });
    }
    savedSectionIds.add(savedSection.id);

    for (const card of cards) {
      const cardPayload = { ...card };
      delete cardPayload.editor_key;
      const payload = { ...cardPayload, section_id: savedSection.id };
      let savedCard: WebsiteCard;
      if (card.id && current.sections.some((item) => item.cards.some((entry) => entry.id === card.id))) {
        savedCard = await base44Fetch<WebsiteCard>(`/entities/WebsiteCard/${card.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        const createPayload = { ...payload };
        delete createPayload.id;
        savedCard = await base44Fetch<WebsiteCard>("/entities/WebsiteCard", {
          method: "POST",
          body: JSON.stringify({ ...createPayload, ...cmsScope() }),
        });
      }
      savedCardIds.add(savedCard.id);
    }
  }

  if (input.archiveMissing !== false) {
    const archiveRequests = [
      ...current.sections
        .filter((section) => section.id && !savedSectionIds.has(section.id))
        .map((section) => base44Fetch(`/entities/WebsiteSection/${section.id}`, {
          method: "PUT",
          body: JSON.stringify({ status: "archived" }),
        })),
      ...current.sections.flatMap((section) => section.cards)
        .filter((card) => card.id && !savedCardIds.has(card.id))
        .map((card) => base44Fetch(`/entities/WebsiteCard/${card.id}`, {
          method: "PUT",
          body: JSON.stringify({ status: "archived" }),
        })),
    ];
    await Promise.all(archiveRequests);
  }

  await Promise.all([
    upsertSeoTask({ ...current, ...savedPage, ...pagePayload }, score.score),
    syncSeoIssues(
      { ...current, ...savedPage, ...pagePayload },
      score,
      pageHasImage(input.page, sections),
    ),
    queueEnglishTranslation({ ...current, ...savedPage, ...pagePayload }),
  ]);

  return {
    page: await getCmsEditorPage(slug),
    seo: score,
    textPreview: plainText(pageText).slice(0, 240),
  };
}
