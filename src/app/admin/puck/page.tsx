import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import PuckEditorClient from "@/components/puck/PuckEditorClient";
import { getAuthSession } from "@/lib/auth/casdoor";
import { isLocale } from "@/lib/locale";
import { buildDefaultPuckData } from "@/lib/puck/default-data";
import { getPuckPageData } from "@/lib/services/puck-page";
import {
  imageForArticleRecord,
  imageForProductRecord,
  imageForVehicleRecord,
  imageWithFallback,
} from "@/lib/cms-images";
import { blogService } from "@/lib/services/blog";
import { productService } from "@/lib/services/product";
import { siteContentService } from "@/lib/services/site-content";
import { vehicleService } from "@/lib/services/vehicle";
import type { Locale } from "@/types/common";
import type { PuckComponents } from "@/lib/puck/config";
import type { ManagedPage, PuckPageData } from "@/types/puck";

const pages: ManagedPage[] = ["home", "vehicles", "journal", "gear"];

type EditableCard = PuckComponents["CardGridBlock"]["cards"][number];

export const dynamic = "force-dynamic";

function makeEditableData({
  data,
  lang,
  vehicles,
  products,
  articles,
}: {
  data: PuckPageData;
  lang: Locale;
  vehicles: Awaited<ReturnType<typeof vehicleService.list>>;
  products: Awaited<ReturnType<typeof productService.listPublished>>["records"];
  articles: Awaited<ReturnType<typeof blogService.getLatest>>;
}): PuckPageData {
  const normalizeCards = (cards: EditableCard[]) => (
    cards.map((card) => ({
      ...card,
      imageUrl: imageWithFallback(card.imageUrl, card.url),
    }))
  );

  return {
    ...data,
    content: data.content.map((block) => {
      if (block.type === "TextPhotoBlock") {
        return {
          ...block,
          props: {
            ...block.props,
            imageUrl: imageWithFallback(block.props.imageUrl),
          },
        };
      }

      if (block.type === "PhotoTextBlock") {
        return {
          ...block,
          props: {
            ...block.props,
            imageUrl: imageWithFallback(block.props.imageUrl),
          },
        };
      }

      if (block.type === "ImageHeroBlock") {
        return {
          ...block,
          props: {
            ...block.props,
            imageUrl: imageWithFallback(block.props.imageUrl),
          },
        };
      }

      if (block.type === "Hero") {
        return {
          ...block,
          props: {
            ...block.props,
            imageUrl: imageWithFallback(block.props.imageUrl),
          },
        };
      }

      if (block.type === "CardGridBlock") {
        return {
          ...block,
          props: {
            ...block.props,
            cards: normalizeCards(block.props.cards || []),
            defaultImageUrl: imageWithFallback(block.props.defaultImageUrl),
          },
        };
      }

      if (block.type === "VehicleIndex") {
        const cards = vehicles.map((vehicle) => ({
          title: vehicle.name || "",
          badge: vehicle.badge || "4x4",
          body: vehicle.tagline || vehicle.hero_body || "",
          url: vehicle.slug ? `/${lang}/vehicles/${vehicle.slug}` : "",
          imageUrl: imageForVehicleRecord(vehicle),
          imageAlt: vehicle.hero_image_alt || vehicle.name || "",
        }));

        const visibleCards = block.props.cards?.length ? block.props.cards : cards;

        return {
          ...block,
          props: {
            ...block.props,
            cards: normalizeCards(visibleCards),
            defaultImageUrl: imageWithFallback(block.props.defaultImageUrl, "/merken"),
            defaultImageAlt: block.props.defaultImageAlt || "",
          },
        };
      }

      if (block.type === "ArticleGrid") {
        const cards = articles.map((article) => ({
          title: article.title || "",
          badge: article.journal_category || "Journal",
          body: article.excerpt || "",
          url: article.slug ? `/${lang}/journal/${article.slug}` : "",
          imageUrl: imageForArticleRecord(article),
          imageAlt: article.featured_image_alt || article.title || "",
        }));

        const visibleCards = block.props.cards?.length ? block.props.cards : cards;

        return {
          ...block,
          props: {
            ...block.props,
            cards: normalizeCards(visibleCards),
            defaultImageUrl: imageWithFallback(block.props.defaultImageUrl, "/journal"),
            defaultImageAlt: block.props.defaultImageAlt || "",
          },
        };
      }

      if (block.type === "ProductGrid") {
        const cards = products.map((product) => ({
          title: product.title || "",
          badge: product.category || product.product_type || "Gear",
          body: product.excerpt || "",
          url: product.slug ? `/${lang}/gear/${product.slug}` : `/${lang}/gear`,
          imageUrl: imageForProductRecord(product),
          imageAlt: product.featured_image_alt || product.title || "",
        }));

        const visibleCards = block.props.cards?.length ? block.props.cards : cards;

        return {
          ...block,
          props: {
            ...block.props,
            cards: normalizeCards(visibleCards),
            defaultImageUrl: imageWithFallback(block.props.defaultImageUrl, "/shop"),
            defaultImageAlt: block.props.defaultImageAlt || "",
          },
        };
      }

      return block;
    }),
  };
}

export default async function PuckAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; locale?: string }>;
}) {
  const session = await getAuthSession();
  if (!session) redirect("/api/auth/login?returnTo=/admin/puck");
  if (session.user.role !== "admin") notFound();

  const params = await searchParams;
  const page = (params.page || "home") as ManagedPage;
  const locale = params.locale || "en";

  if (!pages.includes(page) || !isLocale(locale)) notFound();

  const lang = locale as Locale;
  const [content, vehicles, products, articles, existingData] = await Promise.all([
    siteContentService.getPage(page, lang),
    vehicleService.list(100),
    productService.listPublished({ limit: 100 }),
    blogService.getLatest(100),
    getPuckPageData(page, lang),
  ]);

  const metadata = {
    lang,
    vehicles,
    products: products.records,
    articles,
  };

  const rawInitialData =
    existingData ||
    buildDefaultPuckData({
      page,
      locale: lang,
      content,
      vehicles,
      products: products.records,
      articles,
    });
  const initialData = makeEditableData({
    data: rawInitialData,
    lang,
    vehicles,
    products: products.records,
    articles,
  });

  return (
    <PuckEditorClient
      initialData={initialData}
      metadata={metadata}
      page={page}
      locale={lang}
    />
  );
}
