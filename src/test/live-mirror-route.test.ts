import { describe, expect, it } from "vitest";
import {
  alternateLocalePath,
  hasIncompleteHtmlTag,
  isUsableBase44MirrorContent,
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
    expect(alternateLocalePath("/", "en")).toBe("/en");
    expect(alternateLocalePath("/merken/hummer/h1", "en")).toBe("/en/merken/hummer/h1");
    expect(alternateLocalePath("/en", "nl")).toBe("/");
    expect(alternateLocalePath("/en/journal/toyota-land-cruiser-250-europa-2026-trims", "nl"))
      .toBe("/journal/toyota-land-cruiser-250-europa-2026-trims");
  });
});
