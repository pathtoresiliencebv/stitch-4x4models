import { describe, expect, it } from "vitest";
import { contentText, groupSiteContent } from "@/lib/content";
import type { SiteContent } from "@/types/common";

describe("site content helpers", () => {
  it("groups content by section and key", () => {
    const content = groupSiteContent([
      { id: "1", page: "home", section: "hero", key: "headline", value: "Hello" },
    ] as SiteContent[]);

    expect(content.hero.headline.value).toBe("Hello");
  });

  it("prefers long values and falls back when missing", () => {
    const content = groupSiteContent([
      { id: "1", page: "home", section: "hero", key: "body", value: "Short", value_long: "Long" },
    ] as SiteContent[]);

    expect(contentText(content, "hero", "body", "Fallback")).toBe("Long");
    expect(contentText(content, "hero", "missing", "Fallback")).toBe("Fallback");
  });
});
