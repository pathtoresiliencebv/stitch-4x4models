import { base44List } from "@/lib/base44-api";
import { groupSiteContent } from "@/lib/content";
import { defaultLocale, type Locale } from "@/lib/locale";
import type { LocalizedPageContent, SiteContent } from "@/types/common";

export const siteContentService = {
  async getPage(page: string, locale: Locale): Promise<LocalizedPageContent> {
    const localized = await base44List<SiteContent>("SiteContent", {
      q: { page, locale },
      limit: 200,
      sort_by: "sort_order",
    });

    if (localized.records.length > 0 || locale === defaultLocale) {
      return groupSiteContent(localized.records);
    }

    const fallback = await base44List<SiteContent>("SiteContent", {
      q: { page, locale: defaultLocale },
      limit: 200,
      sort_by: "sort_order",
    });

    return groupSiteContent(fallback.records);
  },

  async getPages(pages: string[], locale: Locale) {
    const entries = await Promise.all(
      pages.map(async (page) => [page, await this.getPage(page, locale)] as const)
    );
    return Object.fromEntries(entries) as Record<string, LocalizedPageContent>;
  },
};
