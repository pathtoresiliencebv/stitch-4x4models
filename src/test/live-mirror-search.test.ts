import { describe, expect, it } from "vitest";
import { searchLiveMirror } from "@/lib/live-mirror-search";

describe("live mirror search", () => {
  it("finds model pages from the mirror index", async () => {
    const results = await searchLiveMirror("hummer h2", "nl", 8);

    expect(results.some((result) => result.path === "/nl/merken/hummer/h2")).toBe(true);
  });

  it("keeps English search result URLs unprefixed", async () => {
    const results = await searchLiveMirror("hummer h2", "en", 8);

    expect(results.some((result) => result.path === "/merken/hummer/h2")).toBe(true);
    expect(results.every((result) => !result.path.startsWith("/nl/"))).toBe(true);
  });
});
