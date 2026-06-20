import type { Metadata } from "next";
import GearPage from "../gear/page";
import { isLocale } from "@/lib/locale";
import { siteContentService } from "@/lib/services/site-content";
import { contentText } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types/common";

export async function generateMetadata({ params }: PageProps<"/[lang]/shop">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? (lang as Locale) : "en";
  const content = await siteContentService.getPage("gear", locale);

  return pageMetadata({
    locale,
    path: "/shop",
    title: contentText(content, "seo", "shop_title", locale === "nl" ? "4x4 shop" : "4x4 shop"),
    description: contentText(
      content,
      "seo",
      "shop_description",
      locale === "nl" ? "Shop compacte 4x4 gear en overlanding essentials." : "Shop compact 4x4 gear and overlanding essentials."
    ),
  });
}

export default async function ShopPage(props: PageProps<"/[lang]/shop">) {
  return GearPage(props as unknown as PageProps<"/[lang]/gear">);
}
