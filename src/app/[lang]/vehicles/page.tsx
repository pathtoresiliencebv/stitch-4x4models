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

export async function generateMetadata({ params }: PageProps<"/[lang]/vehicles">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? (lang as Locale) : "en";
  const content = await siteContentService.getPage("vehicles", locale);

  return pageMetadata({
    locale,
    path: "/vehicles",
    title: contentText(content, "seo", "title", locale === "nl" ? "4x4 modelcatalogus" : "4x4 model catalog"),
    description: contentText(
      content,
      "seo",
      "description",
      locale === "nl"
        ? "Vergelijk populaire 4x4 modellen, merken, segmenten en off-road toepassingen."
        : "Compare popular 4x4 models, brands, segments, and off-road use cases."
    ),
  });
}

export default async function VehiclesPage({ params }: PageProps<"/[lang]/vehicles">) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;

  const locale = lang as Locale;
  const [content, vehicles, products, articles, puckData] = await Promise.all([
    siteContentService.getPage("vehicles", locale),
    vehicleService.list(100),
    productService.listPublished({ limit: 100 }),
    blogService.getLatest(100, locale),
    getPuckPageData("vehicles", locale),
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
      page: "vehicles",
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
              name: contentText(content, "seo", "title", locale === "nl" ? "4x4 modelcatalogus" : "4x4 model catalog"),
              description: contentText(content, "seo", "description", "Compare 4x4 models and off-road use cases."),
              path: `/${locale}/vehicles`,
            }),
            itemListJsonLd(vehicles.map((vehicle) => ({
              name: vehicle.name || vehicle.slug || "4x4 model",
              path: `/${locale}/vehicles/${vehicle.slug}`,
              image: vehicle.featured_image_url || vehicle.hero_image_url,
            }))),
          ]),
        }}
      />
      <PuckPageRenderer data={data} metadata={metadata} />
    </>
  );
}
