import { describe, expect, it } from "vitest";
import {
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
});
