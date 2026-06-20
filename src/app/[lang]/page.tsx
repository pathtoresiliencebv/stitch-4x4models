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

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? (lang as Locale) : "en";
  const content = await siteContentService.getPage("home", locale);

  return pageMetadata({
    locale,
    title: contentText(content, "seo", "title", "4x4models"),
    description: contentText(
      content,
      "seo",
      "description",
      locale === "nl"
        ? "Premium 4x4 modellen, off-road gear en overlanding verhalen."
        : "Premium 4x4 models, off-road gear, and overlanding stories."
    ),
  });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;

  const locale = lang as Locale;
  const [content, vehicles, products, articles, puckData] = await Promise.all([
    siteContentService.getPage("home", locale),
    vehicleService.list(100),
    productService.listPublished({ limit: 100 }),
    blogService.getLatest(100, locale),
    getPuckPageData("home", locale),
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
      page: "home",
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
              name: contentText(content, "seo", "title", "4x4models"),
              description: contentText(content, "seo", "description", "Premium 4x4 models, gear, and journal stories."),
              path: `/${locale}`,
            }),
            itemListJsonLd(vehicles.slice(0, 12).map((vehicle) => ({
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
