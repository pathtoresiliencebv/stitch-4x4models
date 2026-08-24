(() => {
  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]",
  ].join(",");

  const setSlideVisibility = (slide, isVisible) => {
    const containsFocus = slide.contains(document.activeElement);
    const visible = isVisible || containsFocus;
    slide.setAttribute("aria-hidden", visible ? "false" : "true");
    slide.querySelectorAll(focusableSelector).forEach((element) => {
      if (visible) {
        const previous = element.dataset.carouselTabindex;
        if (previous === "__none__") element.removeAttribute("tabindex");
        else if (previous !== undefined) element.setAttribute("tabindex", previous);
        delete element.dataset.carouselTabindex;
        return;
      }
      if (element.dataset.carouselTabindex === undefined) {
        element.dataset.carouselTabindex = element.hasAttribute("tabindex")
          ? element.getAttribute("tabindex") || ""
          : "__none__";
      }
      element.setAttribute("tabindex", "-1");
    });
  };

  const initializeCarousel = (carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    const previous = carousel.querySelector("[data-carousel-previous]");
    const next = carousel.querySelector("[data-carousel-next]");
    const status = carousel.querySelector(".mirror-carousel__status");
    const slides = Array.from(track?.querySelectorAll(":scope > .mirror-carousel__slide") || []);
    if (!track || !previous || !next || slides.length < 2) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let hasInteracted = false;

    const update = () => {
      frame = 0;
      const trackRect = track.getBoundingClientRect();
      const visibleIndexes = [];
      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const visibleWidth = Math.max(0, Math.min(rect.right, trackRect.right) - Math.max(rect.left, trackRect.left));
        const isVisible = visibleWidth >= rect.width * 0.75;
        if (isVisible) visibleIndexes.push(index);
        setSlideVisibility(slide, isVisible);
      });

      const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= maximum - 2;
      const first = visibleIndexes[0] ?? 0;
      const last = visibleIndexes[visibleIndexes.length - 1] ?? first;
      if (status && hasInteracted) {
        const isDutch = document.documentElement.lang === "nl";
        status.textContent = isDutch
          ? `Modellen ${first + 1} tot en met ${last + 1} van ${slides.length}`
          : `Models ${first + 1} through ${last + 1} of ${slides.length}`;
      }
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    const move = (direction) => {
      hasInteracted = true;
      const firstSlide = slides[0];
      const slideWidth = firstSlide.getBoundingClientRect().width;
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      const pageSize = Math.max(1, Math.floor((track.clientWidth + gap) / (slideWidth + gap)));
      const current = slides.findIndex((slide) => slide.getBoundingClientRect().left >= track.getBoundingClientRect().left - 2);
      const targetIndex = Math.min(
        slides.length - 1,
        Math.max(0, (current < 0 ? 0 : current) + direction * pageSize),
      );
      const trackRect = track.getBoundingClientRect();
      const targetRect = slides[targetIndex].getBoundingClientRect();
      track.scrollTo({
        left: track.scrollLeft + targetRect.left - trackRect.left,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
      window.setTimeout(requestUpdate, reducedMotion.matches ? 0 : 260);
    };

    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    track.addEventListener("scroll", requestUpdate, { passive: true });
    track.addEventListener("focusin", requestUpdate);
    if ("ResizeObserver" in window) new ResizeObserver(requestUpdate).observe(track);
    update();
  };

  const initialize = () => {
    document.querySelectorAll("[data-mirror-carousel]").forEach(initializeCarousel);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
