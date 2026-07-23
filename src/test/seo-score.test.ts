import { describe, expect, it } from "vitest";
import {
  calculateSeoScore,
  canonicalForCmsSlug,
  plainText,
} from "@/lib/seo-score";

describe("SEO score", () => {
  it("scores a complete managed page and exposes every check", () => {
    const keyword = "hummer h2";
    const paragraph = "De Hummer H2 combineert terreinvaardigheid met een herkenbaar Amerikaans ontwerp en praktische modelinformatie.";
    const result = calculateSeoScore({
      title: "Hummer H2: uitvoeringen, techniek en modelgeschiedenis",
      description: "Bekijk de Hummer H2 uitvoeringen, techniek, afmetingen en modelgeschiedenis in het onafhankelijke 4x4models kenniscentrum voor liefhebbers.",
      keyword,
      text: Array.from({ length: 80 }, () => paragraph).join(" "),
      content: '<h1>Hummer H2</h1><img src="/images/h2.jpg"><a href="/merken/hummer">Hummer</a><script type="application/ld+json">{"@context":"https://schema.org"}</script>',
    });

    expect(result.score).toBe(100);
    expect(result.wordCount).toBeGreaterThan(700);
    expect(result.checks).toHaveLength(10);
    expect(result.checks.every((check) => check.passed)).toBe(true);
  });

  it("keeps weak pages out of the green zone", () => {
    const result = calculateSeoScore({
      title: "H2",
      description: "Kort.",
      keyword: "hummer h2",
      text: "Korte pagina.",
      hasImage: false,
      hasLink: false,
      hasHeading: true,
    });

    expect(result.score).toBeLessThan(65);
    expect(result.checks.find((check) => check.key === "description")?.passed).toBe(false);
  });

  it("normalizes canonical routes and managed text", () => {
    expect(canonicalForCmsSlug("home")).toBe("https://www.4x4models.com/");
    expect(canonicalForCmsSlug("/nl/merken/ford/")).toBe("https://www.4x4models.com/nl/merken/ford");
    expect(plainText("<p>Ford &amp; Hummer &#x27;models&#x27;</p>")).toBe("Ford & Hummer 'models'");
  });
});
