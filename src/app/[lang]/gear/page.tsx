import PuckPageRenderer from "@/components/puck/PuckPageRenderer";
import { isLocale } from "@/lib/locale";
import { buildDefaultPuckData } from "@/lib/puck/default-data";
import { blogService } from "@/lib/services/blog";
import { getPuckPageData } from "@/lib/services/puck-page";
import { productService } from "@/lib/services/product";
import { siteContentService } from "@/lib/services/site-content";
import { vehicleService } from "@/lib/services/vehicle";
import type { Locale } from "@/types/common";

export default async function GearPage({ params }: PageProps<"/[lang]/gear">) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;

  const locale = lang as Locale;
  const [content, vehicles, products, articles, puckData] = await Promise.all([
    siteContentService.getPage("gear", locale),
    vehicleService.list(100),
    productService.listPublished({ limit: 100 }),
    blogService.getLatest(100),
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

  return <PuckPageRenderer data={data} metadata={metadata} />;
}
