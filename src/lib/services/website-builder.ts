import { base44List } from "@/lib/base44-api";
import type { WebsiteCard, WebsiteSection } from "@/types/base44";

export type WebsiteSectionWithCards = WebsiteSection & {
  cards: WebsiteCard[];
};

function scopedQuery(pageSlug: string, locale?: string) {
  return {
    page_slug: pageSlug,
    status: "published",
    ...(locale ? { locale } : {}),
    ...(process.env.NEXT_PUBLIC_WEBSHOP_ID ? { webshop_id: process.env.NEXT_PUBLIC_WEBSHOP_ID } : {}),
  };
}

async function safeList<T>(loader: () => Promise<T[]>) {
  try {
    return await loader();
  } catch {
    return [];
  }
}

export const websiteBuilderService = {
  async getPage(pageSlug: string, locale?: string): Promise<WebsiteSectionWithCards[]> {
    const [sections, cards] = await Promise.all([
      safeList(() =>
        base44List<WebsiteSection>("WebsiteSection", {
          q: scopedQuery(pageSlug, locale),
          limit: 200,
          sort_by: "sort_order",
        }).then((response) => response.records)
      ),
      safeList(() =>
        base44List<WebsiteCard>("WebsiteCard", {
          q: scopedQuery(pageSlug, locale),
          limit: 500,
          sort_by: "sort_order",
        }).then((response) => response.records)
      ),
    ]);

    return sections.map((section) => ({
      ...section,
      cards: cards.filter((card) => (
        card.section_id === section.id ||
        card.section_key === section.section_key
      )),
    }));
  },

  async listOverview(locale?: string) {
    const [sections, cards] = await Promise.all([
      safeList(() =>
        base44List<WebsiteSection>("WebsiteSection", {
          q: {
            status: "published",
            ...(locale ? { locale } : {}),
            ...(process.env.NEXT_PUBLIC_WEBSHOP_ID ? { webshop_id: process.env.NEXT_PUBLIC_WEBSHOP_ID } : {}),
          },
          limit: 500,
          sort_by: "page_slug",
        }).then((response) => response.records)
      ),
      safeList(() =>
        base44List<WebsiteCard>("WebsiteCard", {
          q: {
            status: "published",
            ...(locale ? { locale } : {}),
            ...(process.env.NEXT_PUBLIC_WEBSHOP_ID ? { webshop_id: process.env.NEXT_PUBLIC_WEBSHOP_ID } : {}),
          },
          limit: 500,
          sort_by: "page_slug",
        }).then((response) => response.records)
      ),
    ]);

    return { sections, cards };
  },
};
