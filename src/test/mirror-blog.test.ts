import { describe, expect, it } from "vitest";
import * as cheerio from "cheerio";
import {
  applyPublishedBlogPosts,
  blogSurfaceForPost,
  extractStructuredArticleContent,
  needsStructuredArticleFallback,
  publishedPostsForLocale,
} from "@/lib/mirror-blog";
import type { BlogPost } from "@/types/blog";

const shell = `<!doctype html>
<html lang="nl">
  <head>
    <title>4x4models</title>
    <meta name="description" content="Fallback">
    <link rel="canonical" href="https://www.4x4models.com/blog">
  </head>
  <body>
    <main>
      <section><p>1 artikelen</p><h1>Verhalen over vierwielaandrijving.</h1></section>
      <section>
        <div class="grid grid-cols-3">
          <div><a class="group block no-underline" href="/blog/bestaand"><div><h3>Bestaand</h3></div></a></div>
        </div>
      </section>
    </main>
  </body>
</html>`;

const records: BlogPost[] = [
  {
    id: "published-blog",
    title: "Nieuwe gepubliceerde 4x4-test",
    slug: "nieuwe-4x4-test",
    locale: "nl",
    status: "published",
    is_product: false,
    excerpt: "Deze publicatie moet direct op de voorkant staan.",
    content: '<p>Veilige inhoud.</p><h1>Technische details</h1><table><tr><th>Model</th></tr><tr><td>Land Cruiser</td></tr></table><img src="/images/brands/toyota.jpg"><a href="https://example.com" target="_blank">Bron</a><script>alert("no")</script>',
    featured_image_url: "/images/brands/toyota.jpg",
    featured_image_alt: "Toyota op een terreinroute",
    published_at: "2026-08-24T10:00:00.000Z",
    author: "4x4models",
    author_role: "Redactie",
    faq_items: [{ question: "Is dit getest?", answer: "Ja, in de publieke route." }],
  },
  {
    id: "published-journal",
    title: "Trailnieuws",
    slug: "trailnieuws",
    locale: "nl",
    status: "published",
    is_product: false,
    journal_category: "TRAILS",
    published_at: "2026-08-23T10:00:00.000Z",
  },
  {
    id: "draft",
    title: "Nog niet publiceren",
    slug: "concept",
    locale: "nl",
    status: "draft",
    is_product: false,
  },
  {
    id: "product",
    title: "Geen artikel",
    slug: "product",
    locale: "nl",
    status: "published",
    is_product: true,
  },
];

describe("published Base44 blog rendering", () => {
  it("selects only published editorial records for the active locale", () => {
    const selected = publishedPostsForLocale(records, "nl");
    expect(selected.map((post) => post.id)).toEqual(["published-blog", "published-journal"]);
    expect(blogSurfaceForPost(selected[0])).toBe("blog");
    expect(blogSurfaceForPost(selected[1])).toBe("journal");
  });

  it("puts newly published blog cards before the local mirror fallback", () => {
    const result = applyPublishedBlogPosts(shell, records, "/nl/blog", "nl");
    expect(result.applied).toBe(1);
    expect(result.detail).toBe(false);
    expect(result.html).toContain("Nieuwe gepubliceerde 4x4-test");
    expect(result.html).toContain('href="/blog/nieuwe-4x4-test"');
    expect(result.html).toContain("2 artikelen");
    expect(result.html.indexOf("Nieuwe gepubliceerde 4x4-test")).toBeLessThan(
      result.html.indexOf("Bestaand"),
    );
    expect(result.html).not.toContain("Nog niet publiceren");
  });

  it("updates the journal message counter after inserting CMS records", () => {
    const journalShell = shell
      .replace("1 artikelen", "1 berichten · nieuws en analyse")
      .replaceAll("/blog/", "/journal/");
    const result = applyPublishedBlogPosts(journalShell, records, "/nl/journal", "nl");

    expect(result.applied).toBe(1);
    expect(result.html).toContain("2 berichten");
    expect(result.html).not.toContain("1 berichten · nieuws en analyse");
  });

  it("renders a safe dynamic detail page from the published BlogPost record", () => {
    const result = applyPublishedBlogPosts(shell, records, "/nl/blog/nieuwe-4x4-test", "nl");
    expect(result.applied).toBe(1);
    expect(result.detail).toBe(true);
    expect(result.html).toContain("cms-blog-detail");
    expect(result.html).toContain("Veilige inhoud.");
    expect(result.html).not.toContain("alert(");
    expect(result.html).toContain('href="https://www.4x4models.com/nl/blog/nieuwe-4x4-test"');
    expect(result.html).toContain('property="og:type" content="article"');
    expect(result.html).toContain("cms-blog-detail__layout");
    expect(result.html).toContain("cms-blog-detail__faq");
    expect(result.html).toContain("cms-blog-detail__table-scroll");
    expect(result.html).toContain('rel="noopener noreferrer"');

    const $ = cheerio.load(result.html);
    expect($("main h1")).toHaveLength(1);
    expect($(".cms-blog-detail__content h2").text()).toBe("Technische details");
    expect($(".cms-blog-detail__content img").attr("alt")).toBe("Afbeelding bij Nieuwe gepubliceerde 4x4-test");
  });

  it("turns plain-text CMS copy into readable paragraphs", () => {
    const plainTextRecords: BlogPost[] = [{
      ...records[0],
      content: "Eerste alinea met < en > als gewone tekst.\n\nTweede alinea.",
    }];
    const result = applyPublishedBlogPosts(shell, plainTextRecords, "/nl/blog/nieuwe-4x4-test", "nl");
    const $ = cheerio.load(result.html);

    expect($(".cms-blog-detail__content > p")).toHaveLength(2);
    expect($(".cms-blog-detail__content > p").first().text()).toContain("< en >");
  });

  it("does not publish a journal record on a duplicate blog URL", () => {
    const result = applyPublishedBlogPosts(shell, records, "/nl/blog/trailnieuws", "nl");
    expect(result.applied).toBe(0);
    expect(result.detail).toBe(false);
  });

  it("recognizes flattened legacy CMS articles and extracts structured fallback copy", () => {
    const flattened = `<p>${"Een lange ongestructureerde zin. ".repeat(40)}</p>`;
    const localPage = `
      <article>
        <div class="prose-article">
          <p>Inleiding met context.</p>
          <h2>Wat krijg je?</h2>
          <p>De inhoud blijft netjes gestructureerd.</p>
        </div>
      </article>
    `;

    expect(needsStructuredArticleFallback(flattened)).toBe(true);
    expect(needsStructuredArticleFallback("<p>Intro.</p><h2>Kop</h2><p>Inhoud.</p>")).toBe(false);
    expect(extractStructuredArticleContent(localPage)).toContain("Wat krijg je?");
    expect(blogSurfaceForPost({
      id: "legacy-journal",
      _mirror_surface: "journal",
    } as BlogPost)).toBe("journal");
  });
});
