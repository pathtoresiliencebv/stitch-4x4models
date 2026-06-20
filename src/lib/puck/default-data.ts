import type { BlogPost } from "@/types/blog";
import type { LocalizedPageContent, Locale } from "@/types/common";
import type { Product } from "@/types/product";
import type { PuckPageData } from "@/types/puck";
import type { Vehicle } from "@/types/vehicle";
import { contentImage, contentLink, contentText } from "@/lib/content";

const fallbackHero =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBn_uZxJ55ZHov8fGYS1Fv_iE4Z8PTeUobJMAjRyMMHF5GTXjl5oGJvByQDO3cDfTsj0LbPACKMiPzT9MAOP0W0inVCtO3pZzF2ZfmIizNJP5tKvy9g_niE3dOUl9vGQKvv26LUL30ISrBBVWuixGJubPE6P2vXalQONKrVbNBWahoaFhcuYaLqWs39f3sJe6ZMNMQMfP0NoCrEikuuOLwaHmVdSIQbN8HmBj3jeyCotEchiJCS9ij6yP1bPkzxN2Qq0wSsna_p0ydQ";

const fallbackWorkshop =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCFh0HM0cWIZFxyQVyZL27xPsGWEIjTKl0lOr0z6lSu3_yCHj3bVWmXtU-rvkxmNQ-azVwSWrQCo4Y842T6bhU-I777GUUZDqfJjx3puuYSWETtx7iNi5G2dft3xx4B69RCZ3o1_fdOJ-53fwLCEe4hHSL64MgFHc9219TulZrWJl2JlbwsOOMH0ZmXSmHV8AmBSXbwKlLklM6QgKOijOXFJNmL1G6mqjWL1QhUo1QftM_--VKH4Po2B-I2q7f-W4BZzJj3DpbhiU6N";

const fallbackCamp =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBmNRjZHZJa60Fc1DXSHTaItLVi0kbD2I9QPfRTABc2vnBNrWBlAqONJZveRAAmIcEXOaq-pWfwPy2QYFnPIW6DG5U7AhtAkVCVYs85NfOeXQbNP0S6kTlKu0LCnapOtFEJkOTfqtTx-tUs9ipoREkWy4UiccfoJj-KRspjPt2NbimkLw1Ut4TxQydkX-3eJS_Yuw0nHo_dUgs8855hNEAXPGHZ9LnNYgpLMB6RlRqIl5f8sw3MaAUZUD9P9_G9EXK-OIwjM3j7G9LE";

const label = (locale: Locale, en: string, nl: string) => (locale === "nl" ? nl : en);

export function buildDefaultPuckData({
  page,
  locale,
  content,
}: {
  page: string;
  locale: Locale;
  content: LocalizedPageContent;
  vehicles: Vehicle[];
  products: Product[];
  articles: BlogPost[];
}): PuckPageData {
  if (page === "vehicles") {
    return {
      root: { props: { title: "Vehicles" } },
      content: [
        {
          type: "Hero",
          props: {
            id: "vehicles-hero",
            icon: "compass",
            eyebrow: contentText(content, "hero", "eyebrow", label(locale, "Model directory", "Modelcatalogus")),
            title: contentText(content, "hero", "headline", label(locale, "Find the right 4x4 platform", "Vind het juiste 4x4 platform")),
            body: contentText(
              content,
              "hero",
              "body",
              label(
                locale,
                "A compact index of current 4x4 models, brands, trending picks and journal links.",
                "Compacte index met actuele 4x4 modellen, merken, trending keuzes en journal-links."
              )
            ),
            imageUrl: contentImage(content, "hero", "background_image_url", fallbackHero),
            imageAlt: contentText(content, "hero", "image_alt", label(locale, "4x4 catalog hero", "4x4 catalogus hero")),
            overlay: "dark",
            align: "left",
            height: "compact",
            primaryText: contentText(content, "hero", "cta_primary_text", label(locale, "Browse models", "Bekijk modellen")),
            primaryUrl: contentLink(content, "hero", "cta_primary_text", "#vehicles-index"),
            secondaryText: contentText(content, "hero", "cta_secondary_text", label(locale, "Read journal", "Lees journal")),
            secondaryUrl: contentLink(content, "hero", "cta_secondary_text", `/${locale}/journal`),
          },
        },
        {
          type: "VehicleIndex",
          props: {
            id: "vehicles-index",
            icon: "grid",
            eyebrow: contentText(content, "catalog", "eyebrow", label(locale, "All models", "Alle modellen")),
            title: contentText(content, "catalog", "headline", label(locale, "4x4 model index", "4x4 modelindex")),
            body: contentText(
              content,
              "catalog",
              "body",
              label(locale, "A fast brand-led index sorted by trending rank and easy to scan on mobile.", "Een snel overzicht per merk, gesorteerd op trending en eenvoudig scanbaar op mobiel.")
            ),
            layout: "compact",
            showImages: true,
            defaultImageUrl: contentImage(content, "catalog", "default_image_url", fallbackWorkshop),
            defaultImageAlt: contentText(content, "catalog", "default_image_alt", label(locale, "4x4 model", "4x4 model")),
            background: "surface",
            cards: [],
          },
        },
        {
          type: "TextPhotoBlock",
          props: {
            id: "vehicles-guidance",
            eyebrow: contentText(content, "guidance", "eyebrow", label(locale, "Choose with confidence", "Kies met zekerheid")),
            title: contentText(content, "guidance", "headline", label(locale, "Built for comparing real capability", "Gemaakt om echte capaciteit te vergelijken")),
            body: contentText(
              content,
              "guidance",
              "body",
              label(
                locale,
                "Every model page can hold series, specs, pros, cons, imagery and calls to action, so the catalog stays useful as it grows.",
                "Elke modelpagina kan series, specs, pluspunten, aandachtspunten, beeld en acties bevatten, zodat de catalogus waardevol blijft groeien."
              )
            ),
            imageUrl: contentImage(content, "guidance", "image_url", fallbackCamp),
            imageAlt: contentText(content, "guidance", "image_alt", label(locale, "Overland camp", "Overland kamp")),
            ctaLabel: contentText(content, "guidance", "cta_text", label(locale, "Open the journal", "Open de journal")),
            ctaUrl: contentLink(content, "guidance", "cta_text", `/${locale}/journal`),
            background: "raised",
            align: "left",
          },
        },
        {
          type: "ArticleGrid",
          props: {
            id: "vehicles-journal",
            eyebrow: contentText(content, "journal", "eyebrow", "Journal"),
            title: contentText(content, "journal", "headline", label(locale, "Most read", "Meest gelezen")),
            body: contentText(content, "journal", "body", label(locale, "Popular guides and field notes for choosing and improving your rig.", "Populaire gidsen en veldnotities voor kiezen en verbeteren.")),
            cards: [],
            limit: 3,
            columns: 3,
            showImages: true,
            defaultImageUrl: contentImage(content, "journal", "default_image_url", fallbackHero),
            defaultImageAlt: contentText(content, "journal", "default_image_alt", "Journal"),
            background: "surface",
            cta: { label: contentText(content, "journal", "cta_text", label(locale, "View all", "Alles bekijken")), url: `/${locale}/journal` },
          },
        },
      ],
    };
  }

  if (page === "gear") {
    return {
      root: { props: { title: "Gear" } },
      content: [
        {
          type: "Hero",
          props: {
            id: "gear-hero",
            icon: "package",
            eyebrow: contentText(content, "hero", "eyebrow", label(locale, "Gear and upgrades", "Gear en upgrades")),
            title: contentText(content, "hero", "headline", label(locale, "Premium kit for capable builds", "Premium uitrusting voor sterke builds")),
            body: contentText(content, "hero", "body", label(locale, "Shop curated recovery, lighting, camping and workshop gear managed from the catalog.", "Shop zorgvuldig gekozen recovery, verlichting, camping en werkplaatsgear uit de catalogus.")),
            imageUrl: contentImage(content, "hero", "background_image_url", fallbackWorkshop),
            imageAlt: contentText(content, "hero", "image_alt", label(locale, "4x4 gear", "4x4 gear")),
            overlay: "dark",
            align: "left",
            height: "standard",
            primaryText: contentText(content, "hero", "cta_primary_text", label(locale, "Shop gear", "Shop gear")),
            primaryUrl: contentLink(content, "hero", "cta_primary_text", "#gear-products"),
            secondaryText: contentText(content, "hero", "cta_secondary_text", label(locale, "Model catalog", "Modelcatalogus")),
            secondaryUrl: contentLink(content, "hero", "cta_secondary_text", `/${locale}/vehicles`),
          },
        },
        {
          type: "ProductGrid",
          props: {
            id: "gear-products",
            eyebrow: contentText(content, "products", "eyebrow", "Shop"),
            title: contentText(content, "products", "headline", label(locale, "Product catalog", "Productcatalogus")),
            body: contentText(content, "products", "body", label(locale, "A compact overview of active products, with every card managed from the catalog.", "Een compact overzicht van actieve producten, met elke kaart beheerd vanuit de catalogus.")),
            cards: [],
            limit: 12,
            columns: 3,
            showImages: true,
            defaultImageUrl: contentImage(content, "products", "default_image_url", fallbackWorkshop),
            defaultImageAlt: contentText(content, "products", "default_image_alt", label(locale, "4x4 product", "4x4 product")),
            background: "muted",
            cta: { label: "", url: "" },
          },
        },
      ],
    };
  }

  if (page === "journal") {
    return {
      root: { props: { title: "Journal" } },
      content: [
        {
          type: "Hero",
          props: {
            id: "journal-hero",
            icon: "book",
            eyebrow: contentText(content, "hero", "eyebrow", "Journal"),
            title: contentText(content, "hero", "headline", label(locale, "Field notes, guides and build stories", "Veldnotities, gidsen en buildverhalen")),
            body: contentText(content, "hero", "body", label(locale, "Read practical stories for better trail days, smarter upgrades and cleaner preparation.", "Lees praktische verhalen voor betere traildagen, slimmere upgrades en strakkere voorbereiding.")),
            imageUrl: contentImage(content, "hero", "background_image_url", fallbackCamp),
            imageAlt: contentText(content, "hero", "image_alt", label(locale, "4x4 journal", "4x4 journal")),
            overlay: "dark",
            align: "left",
            height: "standard",
            primaryText: contentText(content, "hero", "cta_primary_text", label(locale, "Latest stories", "Laatste verhalen")),
            primaryUrl: contentLink(content, "hero", "cta_primary_text", "#journal-articles"),
            secondaryText: contentText(content, "hero", "cta_secondary_text", label(locale, "Shop gear", "Shop gear")),
            secondaryUrl: contentLink(content, "hero", "cta_secondary_text", `/${locale}/gear`),
          },
        },
        {
          type: "ArticleGrid",
          props: {
            id: "journal-articles",
            eyebrow: contentText(content, "articles", "eyebrow", "Journal"),
            title: contentText(content, "articles", "headline", label(locale, "Latest articles", "Laatste artikelen")),
            body: contentText(content, "articles", "body", label(locale, "Browse the newest guides, trip reports and workshop notes.", "Bekijk de nieuwste gidsen, reisverslagen en werkplaatsnotities.")),
            cards: [],
            limit: 12,
            columns: 3,
            showImages: true,
            defaultImageUrl: contentImage(content, "articles", "default_image_url", fallbackHero),
            defaultImageAlt: contentText(content, "articles", "default_image_alt", "Journal"),
            background: "surface",
            cta: { label: "", url: "" },
          },
        },
      ],
    };
  }

  return {
    root: { props: { title: "Home" } },
    content: [
      {
        type: "Hero",
        props: {
          id: "home-hero",
          icon: "compass",
          eyebrow: contentText(content, "hero", "eyebrow", label(locale, "Built for the trail", "Gemaakt voor de trail")),
          title: contentText(content, "hero", "headline", label(locale, "4x4 models, gear and stories in one place", "4x4 modellen, gear en verhalen op een plek")),
          body: contentText(content, "hero", "body", label(locale, "A premium hub for exploring capable platforms, practical upgrades and field-tested advice.", "Een premium hub voor sterke platforms, praktische upgrades en geteste adviezen.")),
          imageUrl: contentImage(content, "hero", "background_image_url", fallbackHero),
          imageAlt: contentText(content, "hero", "image_alt", "4x4models hero"),
          overlay: "dark",
          align: "left",
          height: "standard",
          primaryText: contentText(content, "hero", "cta_primary_text", label(locale, "Explore models", "Ontdek modellen")),
          primaryUrl: contentLink(content, "hero", "cta_primary_text", `/${locale}/vehicles`),
          secondaryText: contentText(content, "hero", "cta_secondary_text", label(locale, "Shop gear", "Shop gear")),
          secondaryUrl: contentLink(content, "hero", "cta_secondary_text", `/${locale}/gear`),
        },
      },
      {
        type: "VehicleIndex",
        props: {
          id: "home-vehicles",
          icon: "shield",
          eyebrow: contentText(content, "featured_vehicles", "eyebrow", "4x4"),
          title: contentText(content, "featured_vehicles", "headline", label(locale, "Featured platforms", "Uitgelichte platforms")),
          body: contentText(content, "featured_vehicles", "body", label(locale, "Open the models that define the catalog.", "Open de modellen die de catalogus dragen.")),
          layout: "compact",
          showImages: true,
          defaultImageUrl: contentImage(content, "featured_vehicles", "default_image_url", fallbackHero),
          defaultImageAlt: contentText(content, "featured_vehicles", "default_image_alt", label(locale, "4x4 platform", "4x4 platform")),
          background: "surface",
          cards: [],
        },
      },
      {
        type: "PhotoTextBlock",
        props: {
          id: "home-story",
          eyebrow: contentText(content, "story", "eyebrow", label(locale, "Ready for the next build", "Klaar voor de volgende build")),
          title: contentText(content, "story", "headline", label(locale, "From inspiration to parts list", "Van inspiratie naar onderdelenlijst")),
          body: contentText(content, "story", "body", label(locale, "Combine model research, product discovery and journal insight in one managed experience.", "Combineer modelresearch, productontdekking en journal-inzicht in een beheerbare ervaring.")),
          imageUrl: contentImage(content, "story", "image_url", fallbackCamp),
          imageAlt: contentText(content, "story", "image_alt", label(locale, "Trail-ready 4x4", "Trail-ready 4x4")),
          ctaLabel: contentText(content, "story", "cta_text", label(locale, "Read the journal", "Lees de journal")),
          ctaUrl: contentLink(content, "story", "cta_text", `/${locale}/journal`),
          background: "raised",
          align: "left",
        },
      },
      {
        type: "ProductGrid",
        props: {
          id: "home-products",
          eyebrow: contentText(content, "featured_products", "eyebrow", "Shop"),
          title: contentText(content, "featured_products", "headline", label(locale, "Featured gear", "Uitgelichte gear")),
          body: contentText(content, "featured_products", "body", label(locale, "Selected products for capable, organized builds.", "Geselecteerde producten voor sterke, georganiseerde builds.")),
          cards: [],
          limit: 4,
          columns: 4,
          showImages: true,
          defaultImageUrl: contentImage(content, "featured_products", "default_image_url", fallbackWorkshop),
          defaultImageAlt: contentText(content, "featured_products", "default_image_alt", label(locale, "4x4 gear", "4x4 gear")),
          background: "muted",
          cta: { label: contentText(content, "featured_products", "cta_text", label(locale, "Shop all", "Shop alles")), url: `/${locale}/gear` },
        },
      },
      {
        type: "ArticleGrid",
        props: {
          id: "home-articles",
          eyebrow: contentText(content, "latest_articles", "eyebrow", "Journal"),
          title: contentText(content, "latest_articles", "headline", label(locale, "From the journal", "Uit de journal")),
          body: contentText(content, "latest_articles", "body", label(locale, "Fresh field notes and practical build advice.", "Nieuwe veldnotities en praktische buildtips.")),
          cards: [],
          limit: 3,
          columns: 3,
          showImages: true,
          defaultImageUrl: contentImage(content, "latest_articles", "default_image_url", fallbackCamp),
          defaultImageAlt: contentText(content, "latest_articles", "default_image_alt", "Journal"),
          background: "surface",
          cta: { label: contentText(content, "latest_articles", "cta_text", label(locale, "View journal", "Bekijk journal")), url: `/${locale}/journal` },
        },
      },
      {
        type: "Newsletter",
        props: {
          id: "home-newsletter",
          icon: "sparkles",
          title: contentText(content, "newsletter", "headline", label(locale, "Get the trail dispatch", "Ontvang de trail update")),
          body: contentText(content, "newsletter", "body", label(locale, "Occasional build notes, product picks and practical guides.", "Af en toe buildnotities, productkeuzes en praktische gidsen.")),
          placeholder: contentText(content, "newsletter", "placeholder", label(locale, "Enter your email", "Vul je e-mail in")),
          buttonText: contentText(content, "newsletter", "button", label(locale, "Subscribe", "Inschrijven")),
          background: "raised",
        },
      },
    ],
  };
}
