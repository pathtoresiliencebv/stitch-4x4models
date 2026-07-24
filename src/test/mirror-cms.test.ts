import { describe, expect, it } from "vitest";
import { applyMirrorCmsContent, mirrorCmsFallbackBundle } from "@/lib/mirror-cms";

const shell = `<!doctype html>
<html lang="nl">
  <head>
    <title>Lokale titel</title>
    <meta name="description" content="Lokale omschrijving">
    <link rel="canonical" href="https://www.4x4models.com/merken">
  </head>
  <body>
    <header>
      <img src="/images/brand/logo.png" alt="4x4models">
      <nav><a href="/merken">Merken</a><a href="/blog">Blog</a></nav>
    </header>
    <main>
      <section>
        <h1>Alle merken.</h1>
        <p>Lokale intro</p>
      </section>
      <section id="brand-grid">
        <h2>Lokale sectie</h2>
        <p>Lokale body</p>
        <div>
          <a class="group no-underline" href="/merken/toyota">
            <div><img src="/images/brands/toyota.jpg" alt="Toyota"></div>
            <div><h3>Toyota</h3><p>Lokale kaarttekst</p><span>Bekijk</span></div>
          </a>
        </div>
      </section>
    </main>
    <footer>
      <a class="powered-by-link" href="https://example.com">Voorbeeld</a>
    </footer>
  </body>
</html>`;

describe("mirror CMS structured rendering", () => {
  it("applies page SEO, sections, cards, images, buttons, and global content", () => {
    const result = applyMirrorCmsContent(shell, {
      page: {
        id: "page-1",
        slug: "merken",
        title: "Merken",
        seo_title: "Alle 4x4 merken | 4x4models",
        meta_description: "Vind alle belangrijke 4x4 merken.",
        canonical_url: "https://www.4x4models.com/merken",
        seo_score: 91,
      },
      sections: [
        {
          id: "section-1",
          page_slug: "merken",
          section_key: "brand-grid",
          section_type: "brand_grid",
          title: "Merken uit het CRM",
          body: "Deze tekst komt uit de beheeromgeving.",
          status: "published",
          sort_order: 20,
        },
      ],
      cards: [
        {
          id: "card-1",
          page_slug: "merken",
          section_key: "brand-grid",
          card_type: "brand",
          title: "Toyota Land Cruiser",
          body: "Beheerbare kaarttekst.",
          image_url: "/images/brands/hummer.jpg",
          image_alt: "Toyota Land Cruiser in terrein",
          href: "/merken/toyota/land-cruiser-300",
          cta_label: "Bekijk model",
          status: "published",
          sort_order: 10,
        },
      ],
      globalContent: [
        {
          id: "nav",
          page: "global",
          section: "navigation",
          key: "main_links",
          value_long: JSON.stringify([
            { label: "4x4 merken", href: "/merken" },
            { label: "Verhalen", href: "/blog" },
          ]),
        },
        {
          id: "powered",
          page: "global",
          section: "footer",
          key: "powered_by",
          value: "jasonmohabali.com",
          link_url: "https://jasonmohabali.com",
        },
      ],
      pageContent: [],
    }, "/merken");

    expect(result.html).toContain("<title>Alle 4x4 merken | 4x4models</title>");
    expect(result.html).toContain('content="Vind alle belangrijke 4x4 merken."');
    expect(result.html).toContain("Merken uit het CRM");
    expect(result.html).toContain("Deze tekst komt uit de beheeromgeving.");
    expect(result.html).toContain("Toyota Land Cruiser");
    expect(result.html).toContain("Beheerbare kaarttekst.");
    expect(result.html).toContain('href="/merken/toyota/land-cruiser-300"');
    expect(result.html).toContain('src="/images/brands/hummer.jpg"');
    expect(result.html).toContain("--card-photo: url('/images/brands/hummer.jpg')");
    expect(result.html).toContain(">4x4 merken</a>");
    expect(result.html).toContain('href="https://jasonmohabali.com"');
    expect(result.applied).toEqual({
      page: true,
      sections: 1,
      cards: 1,
      globals: 2,
    });
  });

  it("keeps the local mirror untouched when managed data is absent", () => {
    const result = applyMirrorCmsContent(shell, mirrorCmsFallbackBundle(), "/merken");

    expect(result.html).toContain("Lokale sectie");
    expect(result.html).toContain("Lokale kaarttekst");
    expect(result.applied).toEqual({
      page: false,
      sections: 0,
      cards: 0,
      globals: 0,
    });
  });

  it("adds, removes, and reorders managed sections and cards", () => {
    const result = applyMirrorCmsContent(shell, {
      page: {
        id: "page-1",
        slug: "merken",
        title: "Beheerbare merken",
        featured_image_url: "/images/brands/ford.jpg",
      },
      sections: [
        {
          id: "new-section",
          page_slug: "merken",
          section_key: "nieuw",
          section_type: "card_grid",
          eyebrow: "Nieuw",
          title: "Toegevoegd in Base44",
          body: "Deze sectie bestond niet in de lokale mirror.",
          cta_label: "Alle modellen",
          cta_url: "/merken",
          status: "published",
          sort_order: 10,
        },
        {
          id: "section-1",
          page_slug: "merken",
          section_key: "brand-grid",
          section_type: "brand_grid",
          title: "Bestaande sectie",
          status: "published",
          sort_order: 20,
        },
      ],
      cards: [
        {
          id: "new-card",
          page_slug: "merken",
          section_key: "nieuw",
          section_id: "new-section",
          card_type: "model",
          title: "Nieuwe Ford-kaart",
          body: "Volledig toegevoegd vanuit het CMS.",
          image_url: "/images/brands/ford.jpg",
          href: "/merken/ford",
          cta_label: "Open Ford",
          status: "published",
          sort_order: 10,
        },
      ],
      globalContent: [],
      pageContent: [],
    }, "/merken");

    expect(result.html.indexOf("Toegevoegd in Base44")).toBeLessThan(
      result.html.indexOf("Bestaande sectie"),
    );
    expect(result.html).toContain("Nieuwe Ford-kaart");
    expect(result.html).toContain("Volledig toegevoegd vanuit het CMS.");
    expect(result.html).toContain('href="/merken/ford"');
    expect(result.html).toContain("Open Ford →");
    expect(result.html).not.toContain("Toyota</h3>");
    expect(result.html).not.toContain("Alle merken.</h1>");
    expect(result.applied.sections).toBe(2);
    expect(result.applied.cards).toBe(1);
  });

  it("renders safe rich text from the WYSIWYG editor", () => {
    const result = applyMirrorCmsContent(shell, {
      page: { id: "page-1", slug: "merken", title: "Merken" },
      sections: [
        {
          id: "text-section",
          page_slug: "merken",
          section_key: "brand-grid",
          section_type: "text",
          title: "Beheerbare tekst",
          body: '<h3>Subkop</h3><p>Tekst met <strong>opmaak</strong> en <a href="/merken/ford">een link</a>.</p><script>alert("no")</script>',
          status: "published",
          sort_order: 10,
        },
      ],
      cards: [],
      globalContent: [],
      pageContent: [],
    }, "/merken");

    expect(result.html).toContain("<h3>Subkop</h3>");
    expect(result.html).toContain("<strong>opmaak</strong>");
    expect(result.html).toContain('href="/merken/ford"');
    expect(result.html).not.toContain("<script>");
    expect(result.html).not.toContain("alert(");
  });
});
