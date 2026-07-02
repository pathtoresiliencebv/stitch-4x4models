import { describe, expect, it } from "vitest";
import {
  alternateLocalePath,
  hasIncompleteHtmlTag,
  isUsableBase44MirrorContent,
  resolveMirrorContentPathname,
  sanitizeBase44MirrorFragment,
  selectBase44MirrorRecord,
} from "@/app/live-mirror/[[...path]]/route";

describe("live mirror Base44 safety", () => {
  it("uses only the exact WebsitePage slug returned by Base44", () => {
    const records = [
      { id: "home", slug: "home", status: "published", content: "<section>Home</section>" },
      {
        id: "journal",
        slug: "journal/toyota-land-cruiser-250-europa-2026-trims",
        status: "published",
        content: "<article>Journal</article>",
      },
    ];

    expect(selectBase44MirrorRecord(records, "journal/toyota-land-cruiser-250-europa-2026-trims")?.id)
      .toBe("journal");
    expect(selectBase44MirrorRecord(records.slice(0, 1), "journal/toyota-land-cruiser-250-europa-2026-trims"))
      .toBeUndefined();
  });

  it("keeps Base44 fragments from injecting page chrome into main", () => {
    const fragment = sanitizeBase44MirrorFragment(`
      <main><article><h1>Titel</h1></article></main>
      <footer><a class="group no-underline" href="/over-ons">Footer CTA</a></footer>
    `);

    expect(fragment).toContain("<article>");
    expect(fragment).not.toContain("<main");
    expect(fragment).not.toContain("<footer");
    expect(fragment).not.toContain("Footer CTA");
  });

  it("rejects Base44 fragments that end inside a partial HTML tag", () => {
    const fragment = sanitizeBase44MirrorFragment(`
      <main>
        <section><div><div cla
      </main>
    `);

    expect(fragment).toContain("<div cla");
    expect(hasIncompleteHtmlTag(fragment)).toBe(true);
    expect(isUsableBase44MirrorContent(fragment)).toBe(false);
    expect(isUsableBase44MirrorContent("<section><h1>Titel</h1></section>")).toBe(true);
  });

  it("maps language links without changing the current content route", () => {
    expect(alternateLocalePath("/", "en")).toBe("/");
    expect(alternateLocalePath("/", "nl")).toBe("/nl");
    expect(alternateLocalePath("/merken/hummer/h1", "nl")).toBe("/nl/merken/hummer/h1");
    expect(alternateLocalePath("/nl/merken/hummer/h1", "en")).toBe("/merken/hummer/h1");
    expect(alternateLocalePath("/en/journal/toyota-land-cruiser-250-europa-2026-trims", "en"))
      .toBe("/journal/toyota-land-cruiser-250-europa-2026-trims");
  });

  it("uses English mirror pages for unprefixed public URLs when available", () => {
    const pages = {
      "/": "__root__.html",
      "/en": "en.html",
      "/merken/hummer/h2": "h2.html",
      "/en/merken": "en__merken.html",
    };

    expect(resolveMirrorContentPathname("/", pages)).toMatchObject({
      locale: "en",
      publicPathname: "/",
      contentPathname: "/en",
    });
    expect(resolveMirrorContentPathname("/nl", pages)).toMatchObject({
      locale: "nl",
      publicPathname: "/nl",
      contentPathname: "/",
    });
    expect(resolveMirrorContentPathname("/merken", pages)).toMatchObject({
      locale: "en",
      publicPathname: "/merken",
      contentPathname: "/en/merken",
    });
    expect(resolveMirrorContentPathname("/merken/hummer/h2", pages)).toMatchObject({
      locale: "en",
      publicPathname: "/merken/hummer/h2",
      contentPathname: "/merken/hummer/h2",
    });
  });
});
