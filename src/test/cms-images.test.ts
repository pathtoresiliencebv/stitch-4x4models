import { describe, expect, it } from "vitest";
import {
  imageForArticleRecord,
  imageForProductRecord,
  imageForVehicleRecord,
  localCmsMediaItems,
  normalizeCmsImageUrl,
} from "@/lib/cms-images";

describe("CMS image helpers", () => {
  it("normalizes Next image optimizer URLs back to local public images", () => {
    expect(normalizeCmsImageUrl("/_next/image?url=%2Fimages%2Fbrands%2Fhummer.jpg&w=1200&q=75"))
      .toBe("/images/brands/hummer.jpg");
  });

  it("rejects expired demo images so admin previews can fall back", () => {
    expect(normalizeCmsImageUrl("https://lh3.googleusercontent.com/aida-public/demo"))
      .toBe("");
  });

  it("falls back to known local route images for admin records", () => {
    expect(imageForVehicleRecord({ brand: "Hummer", slug: "h2" })).toBe("/images/brands/hummer.jpg");
    expect(imageForArticleRecord({ slug: "defender-octa-2026-update", journal_category: "TECH" }))
      .toBe("/images/journal/defender-octa-2026-update.jpg");
    expect(imageForProductRecord({ slug: "warn-zeon-12-s-lier" })).toBe("/images/shop/warn-zeon-12-s-lier.jpg");
  });

  it("exposes local public images to the admin media library", () => {
    expect(localCmsMediaItems().some((item) => item.url === "/images/brands/hummer.jpg")).toBe(true);
  });
});
