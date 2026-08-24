import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import type { Locale } from "@/lib/i18n-routing";

export type MirrorCarouselApplyResult = {
  html: string;
  applied: number;
};

function isVehicleHref(href?: string) {
  if (!href) return false;
  return href.replace(/^\/(?:nl|en)/, "").startsWith("/merken/");
}

function cardTrack(
  $: cheerio.CheerioAPI,
  section: cheerio.Cheerio<Element>,
) {
  const firstCard = section.find("a[href]").filter((_index, element) => (
    isVehicleHref($(element).attr("href"))
  )).first();
  if (!firstCard.length) return undefined;
  const wrapper = firstCard.parent();
  const parent = wrapper.parent();
  const wrapperVehicleCount = wrapper.find("a[href]").filter((_index, element) => (
    isVehicleHref($(element).attr("href"))
  )).length;
  if (wrapperVehicleCount >= 4) return wrapper as cheerio.Cheerio<Element>;
  return (parent.find("a[href]").filter((_index, element) => (
    isVehicleHref($(element).attr("href"))
  )).length >= 4 ? parent : wrapper) as cheerio.Cheerio<Element>;
}

function safeId(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "models";
}

export function applyVehicleCarousels(
  html: string,
  locale: Locale,
): MirrorCarouselApplyResult {
  const $ = cheerio.load(html);
  let applied = 0;
  const usedTracks = new Set<Element>();

  $("main section").each((_sectionIndex, sectionElement) => {
    const section = $(sectionElement);
    const vehicleLinks = section.find("a[href]").filter((_index, element) => (
      isVehicleHref($(element).attr("href"))
    ));
    if (vehicleLinks.length < 4) return;
    const track = cardTrack($, section);
    const trackElement = track?.get(0);
    if (!track?.length || !trackElement || usedTracks.has(trackElement)) return;

    track.children("a[href]").filter((_index, element) => (
      isVehicleHref($(element).attr("href"))
    )).each((_index, element) => {
      $(element).wrap('<div class="mirror-carousel__item"></div>');
    });

    const slides = track.children().filter((_index, element) => (
      $(element).find("a[href]").filter((_linkIndex, link) => (
        isVehicleHref($(link).attr("href"))
      )).length > 0
    ));
    if (slides.length < 4) return;

    usedTracks.add(trackElement);
    const trackHeadings = new Set(track.find("h1, h2, h3").toArray());
    const heading = section.find("h1, h2, h3").filter((_index, element) => (
      !trackHeadings.has(element)
    )).first();
    const headingText = heading.text().replace(/\s+/g, " ").trim();
    const carouselId = `mirror-carousel-${safeId(headingText)}-${applied + 1}`;
    const headingId = heading.length ? (heading.attr("id") || `${carouselId}-title`) : "";
    if (heading.length) heading.attr("id", headingId);
    const regionAttributes: Record<string, string> = {
      role: "region",
      "aria-roledescription": locale === "nl" ? "carrousel" : "carousel",
      "data-mirror-carousel": "true",
    };
    if (headingId) regionAttributes["aria-labelledby"] = headingId;
    else regionAttributes["aria-label"] = locale === "nl" ? "4x4-modellen" : "4x4 models";
    section
      .addClass("mirror-carousel-section")
      .attr(regionAttributes);
    track
      .addClass("mirror-carousel__track")
      .attr({ id: `${carouselId}-track`, "data-carousel-track": "true" });
    slides.each((slideIndex, slideElement) => {
      $(slideElement)
        .addClass("mirror-carousel__slide")
        .attr({
          role: "group",
          "aria-roledescription": locale === "nl" ? "slide" : "slide",
          "aria-label": locale === "nl"
            ? `${slideIndex + 1} van ${slides.length}`
            : `${slideIndex + 1} of ${slides.length}`,
        });
    });

    const previousLabel = locale === "nl" ? "Vorige modellen" : "Previous models";
    const nextLabel = locale === "nl" ? "Volgende modellen" : "Next models";
    const controls = $("<div>").addClass("mirror-carousel__controls").attr("data-carousel-controls", "true");
    $("<p>")
      .addClass("mirror-carousel__status sr-only")
      .attr({ id: `${carouselId}-status`, role: "status", "aria-live": "polite", "aria-atomic": "true" })
      .appendTo(controls);
    const buttons = $("<div>").addClass("mirror-carousel__buttons");
    $("<button>")
      .addClass("mirror-carousel__button mirror-carousel__button--previous")
      .attr({ type: "button", "aria-label": previousLabel, "aria-controls": `${carouselId}-track`, "data-carousel-previous": "true" })
      .html('<span aria-hidden="true">←</span>')
      .appendTo(buttons);
    $("<button>")
      .addClass("mirror-carousel__button mirror-carousel__button--next")
      .attr({ type: "button", "aria-label": nextLabel, "aria-controls": `${carouselId}-track`, "data-carousel-next": "true" })
      .html('<span aria-hidden="true">→</span>')
      .appendTo(buttons);
    controls.append(buttons);
    track.before(controls);
    applied += 1;
  });

  if (applied && !$('script[src="/mirror-carousel.js"]').length) {
    $("<script>").attr({ src: "/mirror-carousel.js", defer: "" }).appendTo("body");
  }

  return { html: $.html(), applied };
}
