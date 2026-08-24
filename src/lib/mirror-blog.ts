import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import { imageWithFallback, normalizeCmsImageUrl } from "@/lib/cms-images";
import type { Locale } from "@/lib/i18n-routing";
import type { BlogPost } from "@/types/blog";

export type BlogSurface = "blog" | "journal";

export type MirrorBlogApplyResult = {
  html: string;
  applied: number;
  detail: boolean;
};

const SITE_ORIGIN = "https://www.4x4models.com";

function plainText(value?: string | null) {
  if (!value) return "";
  return cheerio.load(value, null, false).text().replace(/\s+/g, " ").trim();
}

function safeHtml(
  value: string | null | undefined,
  fallbackImageAlt: string,
  tableLabel: string,
) {
  if (!value) return "";
  const containsMarkup = /<[a-z][\s\S]*>/i.test(value);
  const source = containsMarkup ? value : (() => {
    const plainFragment = cheerio.load("", null, false);
    value.split(/\n{2,}/).forEach((paragraph) => {
      const text = paragraph.replace(/\s*\n\s*/g, " ").trim();
      if (text) plainFragment("<p>").text(text).appendTo(plainFragment.root());
    });
    return plainFragment.root().html() || "";
  })();
  const fragment = cheerio.load(source, null, false);
  fragment("script, style, iframe, object, embed, form, link, meta").remove();
  fragment("*").each((_index, element) => {
    const node = fragment(element);
    const attributes = (element as Element).attribs || {};
    Object.keys(attributes).forEach((attribute) => {
      if (/^on/i.test(attribute)) node.removeAttr(attribute);
    });
    node.removeAttr("style");
    ["href", "src"].forEach((attribute) => {
      const attributeValue = node.attr(attribute);
      if (attributeValue && /^\s*(?:javascript|data:text\/html):/i.test(attributeValue)) {
        node.removeAttr(attribute);
      }
    });
  });

  fragment("h1").each((_index, element) => {
    const heading = fragment(element);
    heading.replaceWith(fragment("<h2>").html(heading.html() || ""));
  });
  fragment("a[target='_blank']").attr("rel", "noopener noreferrer");
  fragment("img").each((_index, element) => {
    const image = fragment(element);
    image.attr({
      alt: plainText(image.attr("alt")) || fallbackImageAlt,
      loading: "lazy",
      decoding: "async",
    });
  });
  fragment("table").each((_index, element) => {
    const table = fragment(element);
    table.wrap(
      fragment("<div>")
        .addClass("cms-blog-detail__table-scroll")
        .attr({ tabindex: "0", role: "region", "aria-label": tableLabel }),
    );
  });
  return fragment.root().html() || "";
}

function timestamp(post: BlogPost) {
  const value = post.published_at || post.created_date || post.updated_date || "";
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}

export function blogSurfaceForPost(post: BlogPost): BlogSurface {
  return post.journal_category ? "journal" : "blog";
}

export function publishedPostsForLocale(posts: BlogPost[], locale: Locale) {
  const candidates = posts.filter((post) => (
    post.status === "published" &&
    post.is_product !== true &&
    Boolean(plainText(post.title)) &&
    Boolean(plainText(post.slug))
  ));
  const localized = candidates.filter((post) => post.locale === locale);
  const selected = localized.length
    ? localized
    : candidates.filter((post) => !post.locale || post.locale === "nl");
  const bySlug = new Map<string, BlogPost>();

  selected
    .sort((left, right) => timestamp(right) - timestamp(left))
    .forEach((post) => {
      const slug = plainText(post.slug);
      if (!bySlug.has(slug)) bySlug.set(slug, post);
    });

  return [...bySlug.values()];
}

function stripLocale(pathname: string) {
  if (pathname === "/nl" || pathname === "/en") return "/";
  if (pathname.startsWith("/nl/") || pathname.startsWith("/en/")) {
    return pathname.slice(3) || "/";
  }
  return pathname || "/";
}

function publicPostPath(post: BlogPost) {
  return `/${blogSurfaceForPost(post)}/${plainText(post.slug)}`;
}

function formatDate(post: BlogPost, locale: Locale) {
  const value = post.published_at || post.created_date || post.updated_date;
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function createPostCard(
  $: cheerio.CheerioAPI,
  post: BlogPost,
  locale: Locale,
) {
  const title = plainText(post.title);
  const excerpt = plainText(post.excerpt || post.meta_description || post.content);
  const href = publicPostPath(post);
  const image = imageWithFallback(post.featured_image_url, href);
  const imageAlt = plainText(post.featured_image_alt || post.title) || "4x4models";
  const category = plainText(post.journal_category) || (locale === "nl" ? "Artikel" : "Article");
  const action = locale === "nl" ? "Lees artikel" : "Read article";
  const card = $("<div>").addClass("cms-blog-card-slide");
  const anchor = $("<a>")
    .addClass("cms-blog-card group block no-underline")
    .attr({
      href,
      "aria-label": `${title} — ${action}`,
      "data-cms-blog-slug": plainText(post.slug),
    });
  const media = $("<div>").addClass("cms-blog-card__media relative w-full overflow-hidden bg-ink");
  $("<img>")
    .attr({ src: image, alt: imageAlt, loading: "lazy", decoding: "async" })
    .appendTo(media);
  $("<span>").addClass("cms-blog-card__overlay").attr("aria-hidden", "true").appendTo(media);
  const headline = $("<span>").addClass("cms-blog-card__headline");
  $("<span>").addClass("cms-blog-card__eyebrow uppercase").text(category).appendTo(headline);
  $("<h3>").text(title).appendTo(headline);
  headline.appendTo(media);
  media.appendTo(anchor);

  const summary = $("<span>").addClass("cms-blog-card__summary");
  if (excerpt) $("<span>").addClass("cms-blog-card__excerpt").text(excerpt).appendTo(summary);
  const meta = [formatDate(post, locale), plainText(post.read_time)].filter(Boolean).join(" · ");
  if (meta) $("<span>").addClass("cms-blog-card__meta").text(meta).appendTo(summary);
  anchor.append(summary);
  card.append(anchor);
  return card;
}

function sectionHeading(section: cheerio.Cheerio<Element>) {
  return plainText(section.find("h1, h2, h3").first().text()).toLowerCase();
}

function findHomeSection(
  $: cheerio.CheerioAPI,
  surface: BlogSurface,
) {
  const labels = surface === "journal"
    ? ["uit het journal", "from the journal"]
    : ["uitgelichte artikelen", "featured articles"];
  return $("main section").filter((_index, element) => (
    labels.some((label) => sectionHeading($(element)).includes(label))
  )).first();
}

function findListingSection(
  $: cheerio.CheerioAPI,
  surface: BlogSurface,
) {
  const sections = $("main section");
  let best = sections.last();
  let bestCount = -1;
  sections.each((_index, element) => {
    const section = $(element);
    const count = section.find(`a[href^="/${surface}/"], a[href^="/nl/${surface}/"], a[href^="/en/${surface}/"]`).length;
    if (count > bestCount) {
      best = section;
      bestCount = count;
    }
  });
  return best;
}

function cardGrid(
  $: cheerio.CheerioAPI,
  section: cheerio.Cheerio<Element>,
  surface: BlogSurface,
) {
  const firstCard = section
    .find(`a[href^="/${surface}/"], a[href^="/nl/${surface}/"], a[href^="/en/${surface}/"], a.group.no-underline`)
    .first();
  if (!firstCard.length) return undefined;
  const wrapper = firstCard.parent();
  const parent = wrapper.parent();
  return (parent.find("a.group.no-underline").length > 1 ? parent : wrapper) as cheerio.Cheerio<Element>;
}

function applyPostCards(
  $: cheerio.CheerioAPI,
  section: cheerio.Cheerio<Element>,
  posts: BlogPost[],
  locale: Locale,
  surface: BlogSurface,
  limit?: number,
) {
  if (!section.length || !posts.length) return 0;
  const grid = cardGrid($, section, surface);
  if (!grid?.length) return 0;
  const selected = posts
    .filter((post) => blogSurfaceForPost(post) === surface)
    .slice(0, limit || posts.length);
  if (!selected.length) return 0;

  selected.forEach((post) => {
    const slug = plainText(post.slug);
    grid.find("a[href]").filter((_index, element) => {
      const href = $(element).attr("href") || "";
      return href.replace(/^\/(?:nl|en)/, "") === `/${surface}/${slug}`;
    }).each((_index, element) => {
      const anchor = $(element);
      const wrapper = anchor.parent();
      if (wrapper.parent().is(grid)) wrapper.remove();
      else anchor.remove();
    });
  });

  const cards = selected.map((post) => createPostCard($, post, locale));
  for (let index = cards.length - 1; index >= 0; index -= 1) {
    grid.prepend(cards[index]);
  }
  grid.attr("data-cms-blog-grid", surface);
  return selected.length;
}

function updateListingCount(
  $: cheerio.CheerioAPI,
  surface: BlogSurface,
  locale: Locale,
) {
  const hrefs = new Set<string>();
  $("main").find(`a[href^="/${surface}/"], a[href^="/nl/${surface}/"], a[href^="/en/${surface}/"]`)
    .each((_index, element) => {
      const href = ($(element).attr("href") || "").replace(/^\/(?:nl|en)/, "").split(/[?#]/)[0];
      if (href) hrefs.add(href);
    });
  if (!hrefs.size) return;
  const counter = $("main").find("p, span").filter((_index, element) => (
    /\b\d+\s+(?:artikelen|articles)\b/i.test($(element).text().replace(/\s+/g, " "))
  )).first();
  if (counter.length) {
    counter.text(locale === "nl" ? `${hrefs.size} artikelen` : `${hrefs.size} articles`);
  }
}

function setMeta(
  $: cheerio.CheerioAPI,
  selector: string,
  attributes: Record<string, string>,
) {
  const existing = $(selector).first();
  if (existing.length) {
    Object.entries(attributes).forEach(([name, value]) => existing.attr(name, value));
    return;
  }
  $("<meta>").attr(attributes).appendTo("head");
}

function renderPostDetail(
  $: cheerio.CheerioAPI,
  post: BlogPost,
  locale: Locale,
) {
  const surface = blogSurfaceForPost(post);
  const title = plainText(post.title);
  const excerpt = plainText(post.excerpt || post.meta_description);
  const description = plainText(post.meta_description || post.excerpt || post.content);
  const href = publicPostPath(post);
  const localizedHref = locale === "nl" ? `/nl${href}` : href;
  const canonical = `${SITE_ORIGIN}${localizedHref}`;
  const image = normalizeCmsImageUrl(post.featured_image_url) || imageWithFallback(undefined, href);
  const imageAlt = plainText(post.featured_image_alt || post.title) || "4x4models";
  const category = plainText(post.journal_category) || (locale === "nl" ? "Artikel" : "Article");
  const backLabel = surface === "journal"
    ? (locale === "nl" ? "Terug naar het journal" : "Back to the journal")
    : (locale === "nl" ? "Terug naar alle artikelen" : "Back to all articles");
  const bodyHtml = safeHtml(
    post.content,
    locale === "nl" ? `Afbeelding bij ${title}` : `Image for ${title}`,
    locale === "nl" ? "Tabel in dit artikel" : "Table in this article",
  ) || (excerpt ? `<p>${cheerio.load(excerpt, null, false).text()}</p>` : "");
  const article = $("<article>").addClass("cms-blog-detail").attr("data-cms-blog-slug", plainText(post.slug));
  const hero = $("<header>").addClass("cms-blog-detail__hero");
  $("<img>").attr({ src: image, alt: imageAlt, decoding: "async", fetchpriority: "high" }).appendTo(hero);
  $("<span>").addClass("cms-blog-detail__overlay").attr("aria-hidden", "true").appendTo(hero);
  const heroInner = $("<div>").addClass("cms-blog-detail__hero-inner");
  $("<a>")
    .addClass("cms-blog-detail__hero-back")
    .attr("href", `/${surface}`)
    .text(surface === "journal" ? "← Journal" : "← Blog")
    .appendTo(heroInner);
  $("<p>").addClass("cms-blog-detail__eyebrow uppercase").text(category).appendTo(heroInner);
  $("<h1>").text(title).appendTo(heroInner);
  if (excerpt) $("<p>").addClass("cms-blog-detail__intro").text(excerpt).appendTo(heroInner);
  hero.append(heroInner);
  article.append(hero);

  const body = $("<div>").addClass("cms-blog-detail__body");
  const metaText = [formatDate(post, locale), plainText(post.author), plainText(post.read_time)]
    .filter(Boolean)
    .join(" · ");
  const layout = $("<div>").addClass("cms-blog-detail__layout");
  const aside = $("<aside>")
    .addClass("cms-blog-detail__aside")
    .attr("aria-label", locale === "nl" ? "Artikelinformatie" : "Article information");
  $("<p>")
    .addClass("cms-blog-detail__aside-label")
    .text(locale === "nl" ? "Over dit artikel" : "About this article")
    .appendTo(aside);
  const authorImage = normalizeCmsImageUrl(post.author_image_url);
  if (authorImage) {
    $("<img>")
      .addClass("cms-blog-detail__author-image")
      .attr({
        src: authorImage,
        alt: "",
        loading: "lazy",
        decoding: "async",
      })
      .appendTo(aside);
  }
  if (post.author) $("<p>").addClass("cms-blog-detail__author").text(plainText(post.author)).appendTo(aside);
  if (post.author_role) $("<p>").addClass("cms-blog-detail__author-role").text(plainText(post.author_role)).appendTo(aside);
  if (metaText) $("<p>").addClass("cms-blog-detail__meta").text(metaText).appendTo(aside);
  layout.append(aside);

  const readingColumn = $("<div>").addClass("cms-blog-detail__reading-column");
  $("<div>").addClass("cms-managed-richtext cms-blog-detail__content").html(bodyHtml).appendTo(readingColumn);
  const faqItems = (post.faq_items || []).filter((item) => plainText(item.question) && plainText(item.answer));
  if (faqItems.length) {
    const faqId = `faq-${plainText(post.slug).replace(/[^a-z0-9-]/gi, "-")}`;
    const faq = $("<section>").addClass("cms-blog-detail__faq").attr("aria-labelledby", faqId);
    $("<h2>")
      .attr("id", faqId)
      .text(locale === "nl" ? "Veelgestelde vragen" : "Frequently asked questions")
      .appendTo(faq);
    const list = $("<dl>");
    faqItems.forEach((item) => {
      const entry = $("<div>");
      $("<dt>").text(plainText(item.question)).appendTo(entry);
      $("<dd>").text(plainText(item.answer)).appendTo(entry);
      list.append(entry);
    });
    faq.append(list);
    readingColumn.append(faq);
  }
  if (post.tags?.length) {
    const tags = $("<ul>").addClass("cms-blog-detail__tags").attr("aria-label", locale === "nl" ? "Onderwerpen" : "Topics");
    post.tags.filter(Boolean).forEach((tag) => $("<li>").text(plainText(tag)).appendTo(tags));
    readingColumn.append(tags);
  }
  $("<a>").addClass("cms-blog-detail__back").attr("href", `/${surface}`).text(`← ${backLabel}`).appendTo(readingColumn);
  layout.append(readingColumn);
  body.append(layout);
  article.append(body);
  $("main").html(article);

  const seoTitle = plainText(post.seo_title || post.title);
  if (seoTitle) $("title").first().text(seoTitle);
  if (description) {
    setMeta($, 'meta[name="description"]', { name: "description", content: description });
    setMeta($, 'meta[property="og:description"]', { property: "og:description", content: description });
  }
  setMeta($, 'meta[property="og:title"]', { property: "og:title", content: seoTitle || title });
  setMeta($, 'meta[property="og:type"]', { property: "og:type", content: "article" });
  setMeta($, 'meta[property="og:image"]', { property: "og:image", content: image });
  const canonicalLink = $('link[rel="canonical"]').first();
  if (canonicalLink.length) canonicalLink.attr("href", canonical);
  else $("<link>").attr({ rel: "canonical", href: canonical }).appendTo("head");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: [image],
    datePublished: post.published_at || post.created_date,
    dateModified: post.updated_date || post.published_at || post.created_date,
    author: post.author ? { "@type": "Person", name: plainText(post.author) } : undefined,
    mainEntityOfPage: canonical,
  };
  $("<script>")
    .attr("type", "application/ld+json")
    .text(JSON.stringify(jsonLd).replace(/</g, "\\u003c"))
    .appendTo("head");
}

export function applyPublishedBlogPosts(
  html: string,
  posts: BlogPost[],
  publicPathname: string,
  locale: Locale,
): MirrorBlogApplyResult {
  if (!posts.length) return { html, applied: 0, detail: false };
  const published = publishedPostsForLocale(posts, locale);
  if (!published.length) return { html, applied: 0, detail: false };
  const basePathname = stripLocale(publicPathname).replace(/\/$/, "") || "/";
  const detailMatch = basePathname.match(/^\/(blog|journal)\/([^/]+)$/);
  const $ = cheerio.load(html);

  if (detailMatch) {
    const surface = detailMatch[1] as BlogSurface;
    const slug = decodeURIComponent(detailMatch[2]);
    const post = published.find((item) => (
      plainText(item.slug) === slug && blogSurfaceForPost(item) === surface
    ));
    if (!post) return { html, applied: 0, detail: false };
    renderPostDetail($, post, locale);
    return { html: $.html(), applied: 1, detail: true };
  }

  let applied = 0;
  if (basePathname === "/") {
    applied += applyPostCards($, findHomeSection($, "journal"), published, locale, "journal", 6);
    applied += applyPostCards($, findHomeSection($, "blog"), published, locale, "blog", 6);
  } else if (basePathname === "/blog" || basePathname === "/journal") {
    const surface = basePathname.slice(1) as BlogSurface;
    applied += applyPostCards($, findListingSection($, surface), published, locale, surface);
    if (applied) updateListingCount($, surface, locale);
  }

  return { html: $.html(), applied, detail: false };
}

export function isBlogPublicSurface(pathname: string) {
  const basePathname = stripLocale(pathname).replace(/\/$/, "") || "/";
  return basePathname === "/" || /^\/(?:blog|journal)(?:\/[^/]+)?$/.test(basePathname);
}
