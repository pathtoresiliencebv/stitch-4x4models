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

export async function generateMetadata({ params }: PageProps<"/[lang]/journal">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? (lang as Locale) : "en";
  const content = await siteContentService.getPage("journal", locale);

  return pageMetadata({
    locale,
    path: "/journal",
    title: contentText(content, "seo", "title", locale === "nl" ? "4x4 journal" : "4x4 journal"),
    description: contentText(
      content,
      "seo",
      "description",
      locale === "nl"
        ? "Lees gidsen, vergelijkingen en compacte off-road verhalen voor 4x4 rijders."
        : "Read guides, comparisons, and compact off-road stories for 4x4 drivers."
    ),
  });
}

export default async function JournalPage({ params }: PageProps<"/[lang]/journal">) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;

  const locale = lang as Locale;
  const [content, vehicles, products, articles, puckData] = await Promise.all([
    siteContentService.getPage("journal", locale),
    vehicleService.list(100),
    productService.listPublished({ limit: 100 }),
    blogService.getLatest(100, locale),
    getPuckPageData("journal", locale),
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
      page: "journal",
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
              name: contentText(content, "seo", "title", locale === "nl" ? "4x4 journal" : "4x4 journal"),
              description: contentText(content, "seo", "description", "4x4 guides, comparisons, and stories."),
              path: `/${locale}/journal`,
            }),
            itemListJsonLd(articles.map((article) => ({
              name: article.title || article.slug || "Journal article",
              path: `/${locale}/journal/${article.slug}`,
              image: article.featured_image_url,
            }))),
          ]),
        }}
      />
      <PuckPageRenderer data={data} metadata={metadata} />
    </>
  );
}
