import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import { imageWithFallback, normalizeCmsImageUrl } from "@/lib/cms-images";
import type { WebsiteCard, WebsitePage, WebsiteSection } from "@/types/base44";
import type { SiteContent } from "@/types/common";

export type MirrorCmsBundle = {
  page?: Partial<WebsitePage> & Pick<WebsitePage, "id" | "slug">;
  sections: WebsiteSection[];
  cards: WebsiteCard[];
  globalContent: SiteContent[];
  pageContent: SiteContent[];
};

export type MirrorCmsApplyResult = {
  html: string;
  applied: {
    page: boolean;
    sections: number;
    cards: number;
    globals: number;
  };
};

function plainText(value?: string | null) {
  if (!value) return "";
  return cheerio.load(value, null, false).text().replace(/\s+/g, " ").trim();
}

function slugify(value?: string | null) {
  return plainText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sortOrder(record: { sort_order?: number }) {
  return typeof record.sort_order === "number" ? record.sort_order : 0;
}

function cleanPublicHref(value?: string | null) {
  const href = plainText(value);
  if (!href) return "";

  try {
    const url = new URL(href, "https://www.4x4models.com");
    if (!["4x4models.com", "www.4x4models.com"].includes(url.hostname)) return href;
    let pathname = url.pathname.replace(/\/$/, "") || "/";
    if (pathname === "/en" || pathname === "/nl") pathname = "/";
    if (pathname.startsWith("/en/") || pathname.startsWith("/nl/")) {
      pathname = pathname.slice(3) || "/";
    }
    return `${pathname}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

function canonicalForPublicPath(value: string | undefined, publicPathname: string) {
  if (!value) return "";

  try {
    const url = new URL(value, "https://www.4x4models.com");
    const normalizedPublicPath = publicPathname.replace(/\/$/, "") || "/";
    const normalizedCanonicalPath = url.pathname.replace(/\/$/, "") || "/";
    if (
      !["4x4models.com", "www.4x4models.com"].includes(url.hostname) ||
      normalizedCanonicalPath !== normalizedPublicPath
    ) {
      return "";
    }
    return `https://www.4x4models.com${normalizedCanonicalPath}`;
  } catch {
    return "";
  }
}

function setMeta(
  $: cheerio.CheerioAPI,
  selector: string,
  attributes: Record<string, string>,
) {
  const existing = $(selector).first();
  if (existing.length) {
    for (const [name, value] of Object.entries(attributes)) existing.attr(name, value);
    return;
  }

  $("<meta>").attr(attributes).appendTo("head");
}

function mergeCardImageStyle(existingStyle: string | undefined, imageUrl: string) {
  const cleanStyle = (existingStyle || "")
    .replace(/--card-photo\s*:[^;]+;?/gi, "")
    .replace(/--forum-photo\s*:[^;]+;?/gi, "")
    .replace(/--forum-category-photo\s*:[^;]+;?/gi, "")
    .trim();
  const escapedUrl = imageUrl.replace(/['"\\]/g, "");
  const imageVars = [
    `--card-photo: url('${escapedUrl}')`,
    `--forum-photo: url('${escapedUrl}')`,
    `--forum-category-photo: url('${escapedUrl}')`,
  ].join("; ");

  return `${cleanStyle}${cleanStyle && !cleanStyle.endsWith(";") ? ";" : ""} ${imageVars};`.trim();
}

function directTextParagraph(
  $: cheerio.CheerioAPI,
  section: cheerio.Cheerio<Element>,
) {
  return section.find("p").filter((_index, element) => (
    $(element).closest("a").length === 0 &&
    !String($(element).attr("class") || "").includes("uppercase")
  )).first();
}

function sectionKey(
  $: cheerio.CheerioAPI,
  section: cheerio.Cheerio<Element>,
  index: number,
) {
  return slugify(
    section.attr("id") ||
    section.find("h1, h2, h3").first().text() ||
    `section-${index + 1}`
  );
}

function cardCandidates(
  $: cheerio.CheerioAPI,
  section: cheerio.Cheerio<Element>,
) {
  return section.find("a").filter((_index, element) => {
    const anchor = $(element);
    return anchor.find("h2, h3, h4").length > 0 ||
      (
        anchor.hasClass("group") &&
        anchor.hasClass("no-underline") &&
        anchor.find("p, img").length > 0
      );
  });
}

function findCardAnchor(
  $: cheerio.CheerioAPI,
  candidates: cheerio.Cheerio<Element>,
  card: WebsiteCard,
  fallbackIndex: number,
) {
  const href = cleanPublicHref(card.href);
  if (href) {
    const byHref = candidates.filter((_index, element) => (
      cleanPublicHref($(element).attr("href")) === href
    )).first();
    if (byHref.length) return byHref;
  }

  const title = plainText(card.title).toLowerCase();
  if (title) {
    const byTitle = candidates.filter((_index, element) => (
      plainText($(element).find("h2, h3, h4").first().text()).toLowerCase() === title
    )).first();
    if (byTitle.length) return byTitle;
  }

  return candidates.eq(fallbackIndex);
}

function applyCard(
  $: cheerio.CheerioAPI,
  anchor: cheerio.Cheerio<Element>,
  card: WebsiteCard,
) {
  if (!anchor.length) return false;

  anchor.attr("data-cms-card-id", card.id);
  anchor.attr("data-cms-card-type", card.card_type || "link");

  if (card.href) anchor.attr("href", plainText(card.href));
  if (card.title) {
    anchor.find("h2, h3, h4").first().text(plainText(card.title));
    anchor.attr("aria-label", `${plainText(card.title)} - ${plainText(card.cta_label) || "bekijk"}`);
  }

  if (card.body) {
    const body = anchor.find("p").first();
    if (body.length) body.text(plainText(card.body));
  }

  if (card.badge) {
    const badge = anchor
      .find("span, p")
      .filter((_index, element) => String($(element).attr("class") || "").includes("uppercase"))
      .first();
    if (badge.length) badge.text(plainText(card.badge));
  }

  const normalizedImage = normalizeCmsImageUrl(card.image_url);
  if (normalizedImage) {
    const image = anchor.find("img").first();
    if (image.length) {
      image.attr("src", normalizedImage);
      image.removeAttr("srcset");
      if (card.image_alt || card.title) {
        image.attr("alt", plainText(card.image_alt || card.title));
      }
    }
    anchor.attr("style", mergeCardImageStyle(anchor.attr("style"), normalizedImage));
    anchor.attr("data-cms-image", normalizedImage);
  }

  if (card.cta_label) {
    const cta = anchor
      .find("span")
      .filter((_index, element) => /bekijk|view|lees|read|meer|more/i.test($(element).text()))
      .last();
    if (cta.length) cta.text(`${plainText(card.cta_label)} →`);
  }

  return true;
}

function applySection(
  $: cheerio.CheerioAPI,
  element: Element,
  section: WebsiteSection,
  cards: WebsiteCard[],
) {
  const target = $(element);
  target.attr("data-cms-section-id", section.id);
  target.attr("data-cms-section-key", section.section_key);
  target.attr("data-cms-section-type", section.section_type || "text");

  const heading = target.find("h1, h2, h3").first();
  if (section.title && heading.length) heading.text(plainText(section.title));

  const body = directTextParagraph($, target);
  if (section.body && body.length) body.text(plainText(section.body));

  if (section.eyebrow) {
    const eyebrow = target
      .find("p, span, small")
      .filter((_index, item) => (
        $(item).closest("a").length === 0 &&
        (
          String($(item).attr("class") || "").includes("uppercase") ||
          item.tagName === "small"
        )
      ))
      .first();
    if (eyebrow.length) eyebrow.text(plainText(section.eyebrow));
  }

  const normalizedImage = normalizeCmsImageUrl(section.image_url);
  if (normalizedImage) {
    const image = target.find("img").filter((_index, item) => $(item).closest("a").length === 0).first();
    if (image.length) {
      image.attr("src", normalizedImage);
      image.removeAttr("srcset");
      if (section.image_alt || section.title) {
        image.attr("alt", plainText(section.image_alt || section.title));
      }
    }
    target.attr("data-cms-image", normalizedImage);
    target.css("--cms-section-photo", `url('${normalizedImage.replace(/['"\\]/g, "")}')`);
  }

  if (section.cta_url) {
    const normalizedCta = cleanPublicHref(section.cta_url);
    const cta = target.find("a").filter((_index, item) => (
      cleanPublicHref($(item).attr("href")) === normalizedCta
    )).first();
    if (cta.length) {
      cta.attr("href", plainText(section.cta_url));
      if (section.cta_label && cta.find("h2, h3, h4").length === 0) {
        cta.text(plainText(section.cta_label));
      }
    }
  }

  const candidates = cardCandidates($, target);
  let appliedCards = 0;
  cards
    .filter((card) => !card.status || card.status === "published" || card.status === "active")
    .sort((left, right) => sortOrder(left) - sortOrder(right))
    .forEach((card, index) => {
      if (applyCard($, findCardAnchor($, candidates, card, index), card)) {
        appliedCards += 1;
      }
    });

  return appliedCards;
}

function applyPageMetadata(
  $: cheerio.CheerioAPI,
  page: Partial<WebsitePage> & Pick<WebsitePage, "id" | "slug">,
  publicPathname: string,
) {
  const title = plainText(page.seo_title || page.google_preview_title || page.title);
  const description = plainText(
    page.meta_description || page.google_preview_description
  );

  if (title) {
    $("title").first().text(title);
    setMeta($, 'meta[property="og:title"]', { property: "og:title", content: title });
    setMeta($, 'meta[name="twitter:title"]', { name: "twitter:title", content: title });
  }
  if (description) {
    setMeta($, 'meta[name="description"]', { name: "description", content: description });
    setMeta($, 'meta[property="og:description"]', { property: "og:description", content: description });
    setMeta($, 'meta[name="twitter:description"]', { name: "twitter:description", content: description });
  }

  const canonical = canonicalForPublicPath(page.canonical_url, publicPathname);
  if (canonical) $("link[rel='canonical']").first().attr("href", canonical);

  $("body")
    .attr("data-cms-page-id", page.id)
    .attr("data-cms-page-slug", page.slug)
    .attr("data-cms-seo-score", String(page.seo_score ?? ""));
}

function applyGlobalContent(
  $: cheerio.CheerioAPI,
  records: SiteContent[],
) {
  let applied = 0;
  const logo = records.find((record) => (
    record.section === "brand" && record.key === "logo_url"
  ));
  const logoUrl = normalizeCmsImageUrl(logo?.image_url || logo?.value);
  if (logoUrl) {
    $("header img, footer img").filter((_index, image) => (
      /logo|4x4models/i.test(`${$(image).attr("src") || ""} ${$(image).attr("alt") || ""}`)
    )).attr("src", logoUrl);
    applied += 1;
  }

  const navigation = records.find((record) => (
    record.section === "navigation" && record.key === "main_links"
  ));
  if (navigation?.value_long) {
    try {
      const links = JSON.parse(navigation.value_long) as Array<{
        label?: string;
        href?: string;
      }>;
      const navAnchors = $("header nav a");
      links.forEach((link, index) => {
        const anchor = navAnchors.eq(index);
        if (!anchor.length) return;
        if (link.label) anchor.text(plainText(link.label));
        if (link.href) anchor.attr("href", plainText(link.href));
      });
      applied += 1;
    } catch {
      // Keep the Vercel navigation fallback when the managed JSON is invalid.
    }
  }

  const poweredBy = records.find((record) => (
    record.section === "footer" && record.key === "powered_by"
  ));
  if (poweredBy) {
    const link = $(".powered-by-link").first();
    if (link.length) {
      if (poweredBy.value) link.text(plainText(poweredBy.value));
      if (poweredBy.link_url) link.attr("href", plainText(poweredBy.link_url));
      applied += 1;
    }
  }

  return applied;
}

function applyPageContentOverrides(
  sections: WebsiteSection[],
  pageContent: SiteContent[],
) {
  const overrides = pageContent.filter((record) => record.section && record.section !== "puck");
  if (!overrides.length) return sections;

  return sections.map((section) => {
    const records = overrides.filter((record) => record.section === section.section_key);
    if (!records.length) return section;

    const value = (key: string) => records.find((record) => record.key === key);
    const title = value("title") || value("headline");
    const body = value("body") || value("description") || value("intro");
    const eyebrow = value("eyebrow") || value("label");
    const image = value("image_url") || records.find((record) => record.image_url);
    const ctaLabel = value("cta_label") || value("cta_text");
    const ctaUrl = value("cta_url") || records.find((record) => record.link_url);

    return {
      ...section,
      title: title?.value || title?.value_long || section.title,
      body: body?.value_long || body?.value || section.body,
      eyebrow: eyebrow?.value || section.eyebrow,
      image_url: image?.image_url || image?.value || section.image_url,
      cta_label: ctaLabel?.value || section.cta_label,
      cta_url: ctaUrl?.link_url || ctaUrl?.value || section.cta_url,
    };
  });
}

export function applyMirrorCmsContent(
  html: string,
  bundle: MirrorCmsBundle,
  publicPathname: string,
): MirrorCmsApplyResult {
  const $ = cheerio.load(html);
  const sections = applyPageContentOverrides(bundle.sections, bundle.pageContent)
    .filter((section) => !section.status || section.status === "published")
    .sort((left, right) => sortOrder(left) - sortOrder(right));
  const domSections = $("main section");
  const usedDomSections = new Set<number>();
  let appliedSections = 0;
  let appliedCards = 0;

  if (bundle.page) applyPageMetadata($, bundle.page, publicPathname);

  sections.forEach((section, sectionIndex) => {
    let matchIndex = -1;
    domSections.each((domIndex, element) => {
      if (matchIndex >= 0 || usedDomSections.has(domIndex)) return;
      if (sectionKey($, $(element), domIndex) === section.section_key) {
        matchIndex = domIndex;
      }
    });

    if (matchIndex < 0 && sectionIndex < domSections.length && !usedDomSections.has(sectionIndex)) {
      matchIndex = sectionIndex;
    }
    if (matchIndex < 0) return;

    usedDomSections.add(matchIndex);
    const sectionCards = bundle.cards.filter((card) => (
      card.section_id === section.id || card.section_key === section.section_key
    ));
    appliedCards += applySection($, domSections.get(matchIndex)!, section, sectionCards);
    appliedSections += 1;
  });

  const appliedGlobals = applyGlobalContent($, bundle.globalContent);

  return {
    html: $.html(),
    applied: {
      page: Boolean(bundle.page),
      sections: appliedSections,
      cards: appliedCards,
      globals: appliedGlobals,
    },
  };
}

export function mirrorCmsFallbackBundle(): MirrorCmsBundle {
  return {
    sections: [],
    cards: [],
    globalContent: [],
    pageContent: [],
  };
}

export function imageForManagedCard(card: WebsiteCard) {
  return imageWithFallback(card.image_url, card.href);
}
