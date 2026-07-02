import { describe, expect, it } from "vitest";
import {
  isLegacyEnglishPath,
  localeForPublicPathname,
  preferredLocaleFromAcceptLanguage,
  publicPathForLocale,
  stripSupportedLocalePrefix,
} from "@/lib/i18n-routing";

describe("4x4models public locale routing", () => {
  it("treats unprefixed URLs as English and /nl URLs as Dutch", () => {
    expect(localeForPublicPathname("/")).toBe("en");
    expect(localeForPublicPathname("/merken/hummer/h2")).toBe("en");
    expect(localeForPublicPathname("/nl")).toBe("nl");
    expect(localeForPublicPathname("/nl/merken/hummer/h2")).toBe("nl");
  });

  it("maps public locale paths without keeping the legacy /en prefix", () => {
    expect(stripSupportedLocalePrefix("/en/merken")).toBe("/merken");
    expect(stripSupportedLocalePrefix("/nl/merken")).toBe("/merken");
    expect(publicPathForLocale("/en/merken", "en")).toBe("/merken");
    expect(publicPathForLocale("/merken", "nl")).toBe("/nl/merken");
    expect(isLegacyEnglishPath("/en/merken")).toBe(true);
  });

  it("detects Dutch browser preference from Accept-Language", () => {
    expect(preferredLocaleFromAcceptLanguage("nl-NL,nl;q=0.9,en;q=0.8")).toBe("nl");
    expect(preferredLocaleFromAcceptLanguage("en-US,en;q=0.8,nl;q=0.5")).toBe("en");
    expect(preferredLocaleFromAcceptLanguage(null)).toBe("en");
  });
});
