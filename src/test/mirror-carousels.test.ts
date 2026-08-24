import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { applyVehicleCarousels } from "@/lib/mirror-carousels";

const vehicleCards = Array.from({ length: 5 }, (_, index) => `
  <div>
    <a class="group block no-underline" href="/merken/toyota/model-${index + 1}">
      <div><h3>Model ${index + 1}</h3></div>
    </a>
  </div>
`).join("");

const shell = `<!doctype html>
<html lang="nl"><head><title>Modellen</title></head><body><main>
  <section>
    <div><h2>Meerdere 4x4-modellen</h2></div>
    <div class="grid grid-cols-3">${vehicleCards}</div>
  </section>
  <section>
    <h2>Artikelen</h2>
    <div class="grid"><a href="/blog/een">Een</a><a href="/blog/twee">Twee</a></div>
  </section>
</main></body></html>`;

describe("accessible 4x4 carousels", () => {
  it("turns multi-model grids into a labelled carousel with native buttons", () => {
    const result = applyVehicleCarousels(shell, "nl");
    expect(result.applied).toBe(1);
    expect(result.html).toContain('aria-roledescription="carrousel"');
    expect(result.html).toContain('data-carousel-previous="true"');
    expect(result.html).toContain('aria-label="Vorige modellen"');
    expect(result.html).toContain('aria-label="Volgende modellen"');
    expect(result.html.match(/class="mirror-carousel__slide"/g)).toHaveLength(5);
    expect(result.html).toContain('src="/mirror-carousel.js"');
  });

  it("keeps unrelated article grids out of the carousel pattern", () => {
    const result = applyVehicleCarousels(shell, "nl");
    expect(result.html.match(/data-mirror-carousel="true"/g)).toHaveLength(1);
  });

  it("enhances the real mirrored homepage model grid", () => {
    const homepage = readFileSync("src/data/live-mirror/pages/__root__.html", "utf8");
    const result = applyVehicleCarousels(homepage, "nl");
    expect(result.applied).toBeGreaterThan(0);
    expect(result.html).toContain("Uitgelichte merken");
    expect(result.html).toContain("mirror-carousel__track");
  });

  it("enhances the flatter card structure on the real brands page", () => {
    const brandsPage = readFileSync("src/data/live-mirror/pages/merken.html", "utf8");
    const result = applyVehicleCarousels(brandsPage, "nl");
    expect(result.applied).toBe(1);
    expect(result.html.match(/mirror-carousel__slide/g)).toHaveLength(18);
    expect(result.html).toContain('aria-label="4x4-modellen"');
    expect(result.html).not.toContain('aria-labelledby="mirror-carousel-models-1-title"');
  });

  it("removes off-screen slide actions from the tab order at runtime without autoplay", () => {
    const runtime = readFileSync("public/mirror-carousel.js", "utf8");
    expect(runtime).toContain('slide.setAttribute("aria-hidden"');
    expect(runtime).toContain('element.setAttribute("tabindex", "-1")');
    expect(runtime).toContain('window.matchMedia("(prefers-reduced-motion: reduce)")');
    expect(runtime).not.toContain("setInterval");
  });
});
