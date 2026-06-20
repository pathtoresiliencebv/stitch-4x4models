import type { Metadata } from "next";
import PuckPageRenderer from "@/components/puck/PuckPageRenderer";
import { contentText } from "@/lib/content";
import { isLocale } from "@/lib/locale";
import { buildDefaultPuckData } from "@/lib/puck/default-data";
import { blogService } from "@/lib/services/blog";
import { getPuckPageData } from "@/lib/services/puck-page";
import { productService } from "@/lib/services/product";
import { siteContentService } from "@/lib/services/site-content";
import { vehicleService } from "@/lib/services/vehicle";
import { collectionPageJsonLd, itemListJsonLd, jsonLd, pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types/common";

export async function generateMetadata({ params }: PageProps<"/[lang]/gear">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? (lang as Locale) : "en";
  const content = await siteContentService.getPage("gear", locale);

  return pageMetadata({
    locale,
    path: "/gear",
    title: contentText(content, "seo", "title", locale === "nl" ? "Off-road gear" : "Off-road gear"),
    description: contentText(
      content,
      "seo",
      "description",
      locale === "nl"
        ? "Compacte gids voor 4x4 gear, herstelmateriaal, camp setup en productkeuzes."
        : "A compact guide to 4x4 gear, recovery equipment, camp setup, and product picks."
    ),
  });
}

export default async function GearPage({ params }: PageProps<"/[lang]/gear">) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;

  const locale = lang as Locale;
  const [content, vehicles, products, articles, puckData] = await Promise.all([
    siteContentService.getPage("gear", locale),
    vehicleService.list(100),
    productService.listPublished({ limit: 100 }),
    blogService.getLatest(100, locale),
    getPuckPageData("gear", locale),
  ]);

  const metadata = {
    lang: locale,
    vehicles,
    products: products.records,
    articles,
  };

  const data =
    puckData ||
    buildDefaultPuckData({
      page: "gear",
      locale,
      content,
      vehicles,
      products: products.records,
      articles,
    });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            collectionPageJsonLd({
              name: contentText(content, "seo", "title", locale === "nl" ? "Off-road gear" : "Off-road gear"),
              description: contentText(content, "seo", "description", "4x4 gear and product picks."),
              path: `/${locale}/gear`,
            }),
            itemListJsonLd(products.records.map((product) => ({
              name: product.title || product.slug || "4x4 gear",
              path: `/${locale}/shop/${product.slug}`,
              image: product.featured_image_url,
            }))),
          ]),
        }}
      />
      <PuckPageRenderer data={data} metadata={metadata} />
    </>
  );
}
