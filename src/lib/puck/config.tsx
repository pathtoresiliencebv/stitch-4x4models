import type { Config, CustomField } from "@puckeditor/core";
import type React from "react";
import {
  BookOpen,
  Camera,
  CarFront,
  Compass,
  Grid3X3,
  Image as ImageIcon,
  Mail,
  Mountain,
  Newspaper,
  Package,
  Shield,
  ShoppingBag,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import type { BlogPost } from "@/types/blog";
import type { Product } from "@/types/product";
import type { Vehicle } from "@/types/vehicle";

export type PuckMetadata = {
  lang: "en" | "nl";
  vehicles: Vehicle[];
  products: Product[];
  articles: BlogPost[];
};

type Align = "left" | "center";
type Background = "surface" | "raised" | "muted" | "primary";
type IconName =
  | "compass"
  | "mountain"
  | "shield"
  | "wrench"
  | "zap"
  | "camera"
  | "book"
  | "grid"
  | "package"
  | "bag"
  | "sparkles";

type FeatureItem = {
  icon: IconName;
  title: string;
  body: string;
  url: string;
};

type EditableCard = {
  title: string;
  badge: string;
  body: string;
  url: string;
  imageUrl: string;
  imageAlt: string;
};

type ActionLink = {
  label: string;
  url: string;
};

export type PuckComponents = {
  TextPhotoBlock: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    imageAlt: string;
    ctaLabel: string;
    ctaUrl: string;
    background: Background;
    align: Align;
  };
  PhotoTextBlock: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    imageAlt: string;
    ctaLabel: string;
    ctaUrl: string;
    background: Background;
    align: Align;
  };
  ImageHeroBlock: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    imageAlt: string;
    ctaLabel: string;
    ctaUrl: string;
    overlay: "dark" | "soft" | "none";
    align: Align;
  };
  TextBlock: {
    eyebrow: string;
    title: string;
    body: string;
    ctaLabel: string;
    ctaUrl: string;
    background: Background;
    align: Align;
    padding: "compact" | "standard" | "spacious";
  };
  CardGridBlock: {
    eyebrow: string;
    title: string;
    body: string;
    cards: EditableCard[];
    columns: 2 | 3 | 4;
    showImages: boolean;
    defaultImageUrl: string;
    defaultImageAlt: string;
    background: Background;
  };
  Hero: {
    icon: IconName;
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    imageAlt: string;
    overlay: "dark" | "soft" | "none";
    align: Align;
    height: "compact" | "standard" | "full";
    primaryText: string;
    primaryUrl: string;
    secondaryText: string;
    secondaryUrl: string;
  };
  TextSection: {
    icon: IconName;
    eyebrow: string;
    title: string;
    body: string;
    align: Align;
    background: Background;
    padding: "compact" | "standard" | "spacious";
  };
  FeatureGrid: {
    eyebrow: string;
    title: string;
    body: string;
    background: Background;
    columns: 2 | 3 | 4;
    items: FeatureItem[];
  };
  VehicleIndex: {
    icon: IconName;
    eyebrow: string;
    title: string;
    body: string;
    layout: "cards" | "compact";
    showImages: boolean;
    defaultImageUrl: string;
    defaultImageAlt: string;
    background: Background;
    cards: EditableCard[];
  };
  ProductGrid: {
    eyebrow: string;
    title: string;
    body: string;
    cards: EditableCard[];
    limit: number;
    columns: 2 | 3 | 4;
    showImages: boolean;
    defaultImageUrl: string;
    defaultImageAlt: string;
    background: Background;
    cta: ActionLink;
  };
  ArticleGrid: {
    eyebrow: string;
    title: string;
    body: string;
    cards: EditableCard[];
    limit: number;
    columns: 2 | 3 | 4;
    showImages: boolean;
    defaultImageUrl: string;
    defaultImageAlt: string;
    background: Background;
    cta: ActionLink;
  };
  Newsletter: {
    icon: IconName;
    title: string;
    body: string;
    placeholder: string;
    buttonText: string;
    background: Background;
  };
};

export type PuckRootProps = {
  title?: string;
};

const iconOptions: { label: string; value: IconName }[] = [
  { label: "Compass", value: "compass" },
  { label: "Mountain", value: "mountain" },
  { label: "Shield", value: "shield" },
  { label: "Wrench", value: "wrench" },
  { label: "Lightning", value: "zap" },
  { label: "Camera", value: "camera" },
  { label: "Journal", value: "book" },
  { label: "Grid", value: "grid" },
  { label: "Package", value: "package" },
  { label: "Shop", value: "bag" },
  { label: "Sparkles", value: "sparkles" },
];

const backgroundOptions = [
  { label: "Surface", value: "surface" },
  { label: "Raised", value: "raised" },
  { label: "Muted", value: "muted" },
  { label: "Primary accent", value: "primary" },
] as const;

const Icon = ({ name, className = "h-5 w-5" }: { name?: IconName; className?: string }) => {
  const props = { className, "aria-hidden": true };
  switch (name) {
    case "mountain":
      return <Mountain {...props} />;
    case "shield":
      return <Shield {...props} />;
    case "wrench":
      return <Wrench {...props} />;
    case "zap":
      return <Zap {...props} />;
    case "camera":
      return <Camera {...props} />;
    case "book":
      return <BookOpen {...props} />;
    case "grid":
      return <Grid3X3 {...props} />;
    case "package":
      return <Package {...props} />;
    case "bag":
      return <ShoppingBag {...props} />;
    case "sparkles":
      return <Sparkles {...props} />;
    default:
      return <Compass {...props} />;
  }
};

const iconPickerField = (label = "Icon", labelIcon: React.ReactElement = <Sparkles className="h-4 w-4" />): CustomField<IconName> => ({
  type: "custom",
  label,
  labelIcon,
  render: ({ value, onChange, readOnly }) => (
    <div className="grid grid-cols-2 gap-2">
      {iconOptions.map((option) => {
        const selected = (value || "compass") === option.value;

        return (
          <button
            aria-pressed={selected}
            className={[
              "flex min-h-16 items-center gap-2 rounded border px-3 py-2 text-left text-xs transition",
              selected
                ? "border-blue-500 bg-blue-50 text-blue-900 shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50",
            ].join(" ")}
            disabled={readOnly}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            <span
              className={[
                "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded",
                selected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700",
              ].join(" ")}
            >
              <Icon name={option.value} className="h-4 w-4" />
            </span>
            <span className="font-medium">{option.label}</span>
          </button>
        );
      })}
    </div>
  ),
});

const sectionBg: Record<Background, string> = {
  surface: "bg-surface",
  raised: "bg-surface-container-high/95",
  muted: "bg-surface-container-lowest",
  primary: "bg-primary-container/15",
};

const paddingClass = {
  compact: "py-12",
  standard: "py-20",
  spacious: "py-24",
};

const lorem = {
  eyebrow: "Lorem ipsum",
  title: "Lorem ipsum dolor sit amet",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
  longBody:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus auctor fringilla.",
  cta: "Lorem ipsum",
  imageAlt: "Lorem ipsum image",
};

const demoImageUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBn_uZxJ55ZHov8fGYS1Fv_iE4Z8PTeUobJMAjRyMMHF5GTXjl5oGJvByQDO3cDfTsj0LbPACKMiPzT9MAOP0W0inVCtO3pZzF2ZfmIizNJP5tKvy9g_niE3dOUl9vGQKvv26LUL30ISrBBVWuixGJubPE6P2vXalQONKrVbNBWahoaFhcuYaLqWs39f3sJe6ZMNMQMfP0NoCrEikuuOLwaHmVdSIQbN8HmBj3jeyCotEchiJCS9ij6yP1bPkzxN2Qq0wSsna_p0ydQ";

const demoCards: EditableCard[] = [
  {
    title: "Lorem ipsum",
    badge: "Dolor",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    url: "",
    imageUrl: "",
    imageAlt: "Lorem ipsum",
  },
  {
    title: "Sit amet",
    badge: "Amet",
    body: "Praesent commodo cursus magna, vel scelerisque nisl consectetur.",
    url: "",
    imageUrl: "",
    imageAlt: "Sit amet",
  },
  {
    title: "Consectetur",
    badge: "Elit",
    body: "Donec id elit non mi porta gravida at eget metus.",
    url: "",
    imageUrl: "",
    imageAlt: "Consectetur",
  },
];

const mediaImageField = (label: string): CustomField<string> => ({
  type: "custom",
  label,
  labelIcon: <ImageIcon className="h-4 w-4" />,
  render: ({ id, value, onChange, readOnly }) => {
    const statusId = `${id}-status`;
    const libraryId = `${id}-library`;

    const setStatus = (message: string) => {
      const status = document.getElementById(statusId);
      if (status) status.textContent = message;
    };

    const loadLibrary = async () => {
      setStatus("Loading media...");
      const container = document.getElementById(libraryId);
      if (!container) return;

      const response = await fetch("/api/cms/media");
      const payload = (await response.json()) as {
        items?: { id: string; title: string; url: string; alt?: string | null }[];
      };
      const items = payload.items || [];
      container.innerHTML = "";

      if (items.length === 0) {
        container.textContent = "No images in the media library yet.";
        setStatus("");
        return;
      }

      items.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className =
          "relative h-20 overflow-hidden rounded border border-slate-300 bg-slate-100";
        button.title = item.title;
        button.onclick = () => {
          onChange(item.url);
          setStatus(`Selected: ${item.title}`);
        };

        const img = document.createElement("img");
        img.src = item.url;
        img.alt = item.alt || item.title;
        img.className = "h-full w-full object-cover";
        button.appendChild(img);
        container.appendChild(button);
      });

      setStatus("");
    };

    return (
      <div className="space-y-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" src={value} className="h-32 w-full rounded border border-slate-300 object-cover" />
        ) : null}
        <input
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          disabled={readOnly}
          onChange={(event) => onChange(event.currentTarget.value)}
          placeholder="Paste image URL or upload/select below"
          value={value || ""}
        />
        <input
          accept="image/*"
          disabled={readOnly}
          onChange={async (event) => {
            const file = event.currentTarget.files?.[0];
            if (!file) return;

            setStatus("Uploading image...");
            const formData = new FormData();
            formData.append("file", file);

            const upload = await fetch("/api/cms/upload", {
              method: "POST",
              body: formData,
            });
            const result = (await upload.json()) as { url?: string; error?: string };

            if (!upload.ok || !result.url) {
              setStatus(result.error || "Upload failed. Paste a URL instead.");
              return;
            }

            onChange(result.url);
            await fetch("/api/cms/media", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: file.name,
                url: result.url,
                alt: file.name.replace(/\.[^.]+$/, ""),
              }),
            });
            setStatus("Image uploaded and selected.");
            await loadLibrary();
          }}
          type="file"
        />
        <div className="flex gap-2">
          <button
            className="rounded bg-slate-900 px-3 py-2 text-xs font-bold uppercase text-white"
            disabled={readOnly}
            onClick={loadLibrary}
            type="button"
          >
            Open media library
          </button>
          <button
            className="rounded border border-slate-300 px-3 py-2 text-xs font-bold uppercase text-slate-700"
            disabled={readOnly}
            onClick={() => onChange("")}
            type="button"
          >
            Clear
          </button>
        </div>
        <p id={statusId} className="text-xs text-slate-500" />
        <div id={libraryId} className="grid grid-cols-3 gap-2" />
      </div>
    );
  },
});

const splitBlockFields = {
  eyebrow: { type: "text", label: "Eyebrow", contentEditable: true },
  title: { type: "text", label: "Title", contentEditable: true },
  body: { type: "textarea", label: "Body", contentEditable: true },
  imageUrl: mediaImageField("Image"),
  imageAlt: { type: "text", label: "Image alt text" },
  ctaLabel: { type: "text", label: "Button label", contentEditable: true },
  ctaUrl: { type: "text", label: "Button URL" },
  background: { type: "select", label: "Background", options: backgroundOptions },
  align: {
    type: "radio",
    label: "Text alignment",
    options: [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
    ],
  },
} as const;

const splitBlockDefaultProps = {
  eyebrow: lorem.eyebrow,
  title: lorem.title,
  body: lorem.longBody,
  imageUrl: demoImageUrl,
  imageAlt: lorem.imageAlt,
  ctaLabel: lorem.cta,
  ctaUrl: "#",
  background: "surface" as Background,
  align: "left" as Align,
};

function SplitBlock({
  eyebrow,
  title,
  body,
  imageUrl,
  imageAlt,
  ctaLabel,
  ctaUrl,
  background,
  align,
  imageFirst = false,
}: PuckComponents["TextPhotoBlock"] & { imageFirst?: boolean }) {
  const text = (
    <div className={align === "center" ? "text-center lg:text-left" : ""}>
      <p className="premium-kicker mb-3">{eyebrow}</p>
      <h2 className="premium-heading mb-5 font-headline text-4xl font-bold uppercase leading-tight text-on-surface md:text-5xl">{title}</h2>
      <p className="premium-copy mb-8 text-lg">{body}</p>
      {ctaLabel ? (
        <a className="premium-link inline-flex rounded-sm border border-primary/50 bg-primary/5 px-6 py-3 font-label text-xs font-bold uppercase text-primary hover:bg-primary hover:text-on-primary" href={ctaUrl || "#"}>
          {ctaLabel}
        </a>
      ) : null}
    </div>
  );

  const image = (
    <div className="premium-panel relative min-h-[320px] overflow-hidden bg-surface-container-high md:min-h-[460px]">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={imageAlt || title} src={imageUrl} className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-tr from-surface/55 via-transparent to-primary/10" />
      <div className="absolute inset-x-6 bottom-6 h-px bg-gradient-to-r from-primary/70 to-transparent" />
    </div>
  );

  return (
    <section className={`premium-section ${sectionBg[background || "surface"]} py-16 sm:py-20`}>
      <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        {imageFirst ? image : text}
        {imageFirst ? text : image}
      </div>
    </section>
  );
}

function DemoCardGrid({
  eyebrow,
  title,
  body,
  cards,
  columns,
  showImages,
  defaultImageUrl,
  defaultImageAlt,
  background,
}: PuckComponents["CardGridBlock"]) {
  const visibleCards = cards.length > 0 ? cards : demoCards;

  return (
    <section className={`premium-section ${sectionBg[background || "surface"]} py-16 sm:py-20`}>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
        <GridHeader eyebrow={eyebrow} title={title} body={body} />
        <div className={`grid gap-5 md:grid-cols-2 ${columns === 4 ? "xl:grid-cols-4" : columns === 2 ? "xl:grid-cols-2" : "xl:grid-cols-3"}`}>
          {visibleCards.map((card, index) => (
            <a className="premium-card group" href={card.url || "#"} key={`${card.title}-${index}`}>
              {showImages && (card.imageUrl || defaultImageUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={card.imageAlt || defaultImageAlt || card.title} src={card.imageUrl || defaultImageUrl} className="premium-card-image h-52 w-full object-cover" />
              ) : null}
              <div className="p-6">
                <p className="mb-2 premium-kicker">{card.badge}</p>
                <h3 className="premium-heading mb-3 font-headline text-2xl font-bold uppercase text-on-surface group-hover:text-primary">{card.title}</h3>
                <p className="premium-copy text-sm">{card.body}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export const puckConfig: Config<PuckComponents, PuckRootProps> = {
  root: {
    fields: {
      title: { type: "text", label: "Internal page title" },
    },
  },
  components: {
    TextPhotoBlock: {
      label: "Text / Photo",
      fields: splitBlockFields,
      defaultProps: splitBlockDefaultProps,
      render: (props) => <SplitBlock {...props} />,
    },
    PhotoTextBlock: {
      label: "Photo / Text",
      fields: splitBlockFields,
      defaultProps: splitBlockDefaultProps,
      render: (props) => <SplitBlock {...props} imageFirst />,
    },
    ImageHeroBlock: {
      label: "Image Hero",
      fields: {
        eyebrow: { type: "text", label: "Eyebrow", contentEditable: true },
        title: { type: "text", label: "Title", contentEditable: true },
        body: { type: "textarea", label: "Body", contentEditable: true },
        imageUrl: mediaImageField("Background image"),
        imageAlt: { type: "text", label: "Image alt text" },
        ctaLabel: { type: "text", label: "Button label", contentEditable: true },
        ctaUrl: { type: "text", label: "Button URL" },
        overlay: {
          type: "select",
          label: "Image overlay",
          options: [
            { label: "Dark", value: "dark" },
            { label: "Soft", value: "soft" },
            { label: "None", value: "none" },
          ],
        },
        align: {
          type: "radio",
          label: "Text alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
          ],
        },
      },
      defaultProps: {
        eyebrow: lorem.eyebrow,
        title: lorem.title,
        body: lorem.longBody,
        imageUrl: demoImageUrl,
        imageAlt: lorem.imageAlt,
        ctaLabel: lorem.cta,
        ctaUrl: "#",
        overlay: "dark",
        align: "left",
      },
      render: ({ eyebrow, title, body, imageUrl, imageAlt, ctaLabel, ctaUrl, overlay, align }) => (
        <section className="relative flex min-h-[620px] items-center overflow-hidden bg-surface">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={imageAlt || title} src={imageUrl} className="absolute inset-0 h-full w-full object-cover opacity-70" />
          ) : null}
          {overlay !== "none" ? <div className={`absolute inset-0 ${overlay === "soft" ? "bg-surface/50" : "bg-gradient-to-r from-surface via-surface/80 to-surface/20"}`} /> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
          <div className={`relative z-10 mx-auto w-full max-w-screen-2xl px-6 py-20 ${align === "center" ? "text-center" : ""}`}>
            <p className="mb-4 font-label text-xs uppercase tracking-widest text-primary">{eyebrow}</p>
            <h1 className={`mb-6 font-headline text-5xl font-bold uppercase leading-none text-on-surface md:text-7xl ${align === "center" ? "mx-auto max-w-5xl" : "max-w-4xl"}`}>{title}</h1>
            <p className={`mb-10 text-xl leading-relaxed text-tertiary-fixed-dim ${align === "center" ? "mx-auto max-w-3xl" : "max-w-2xl"}`}>{body}</p>
            {ctaLabel ? (
              <a className="btn-primary-glow inline-flex items-center justify-center rounded-sm px-8 py-4 font-label font-bold uppercase tracking-wider text-on-primary" href={ctaUrl || "#"}>
                {ctaLabel}
              </a>
            ) : null}
          </div>
        </section>
      ),
    },
    TextBlock: {
      label: "Text Block",
      fields: {
        eyebrow: { type: "text", label: "Eyebrow", contentEditable: true },
        title: { type: "text", label: "Title", contentEditable: true },
        body: { type: "textarea", label: "Body", contentEditable: true },
        ctaLabel: { type: "text", label: "Button label", contentEditable: true },
        ctaUrl: { type: "text", label: "Button URL" },
        background: { type: "select", label: "Background", options: backgroundOptions },
        align: {
          type: "radio",
          label: "Text alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
          ],
        },
        padding: { type: "select", label: "Spacing", options: [{ label: "Compact", value: "compact" }, { label: "Standard", value: "standard" }, { label: "Spacious", value: "spacious" }] },
      },
      defaultProps: {
        eyebrow: lorem.eyebrow,
        title: lorem.title,
        body: lorem.longBody,
        ctaLabel: lorem.cta,
        ctaUrl: "#",
        background: "surface",
        align: "center",
        padding: "standard",
      },
      render: ({ eyebrow, title, body, ctaLabel, ctaUrl, background, align, padding }) => (
        <section className={`${sectionBg[background || "surface"]} ${paddingClass[padding || "standard"]}`}>
          <div className={`mx-auto max-w-4xl px-6 ${align === "center" ? "text-center" : ""}`}>
            <p className="mb-3 font-label text-xs uppercase tracking-widest text-primary">{eyebrow}</p>
            <h2 className="mb-5 font-headline text-4xl font-bold uppercase leading-tight text-on-surface md:text-5xl">{title}</h2>
            <p className="mb-8 text-lg leading-relaxed text-tertiary-fixed-dim">{body}</p>
            {ctaLabel ? <a className="inline-flex rounded-sm border border-primary/50 px-6 py-3 font-label text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary hover:text-on-primary" href={ctaUrl || "#"}>{ctaLabel}</a> : null}
          </div>
        </section>
      ),
    },
    CardGridBlock: {
      label: "Card Grid",
      fields: {
        eyebrow: { type: "text", label: "Eyebrow", contentEditable: true },
        title: { type: "text", label: "Title", contentEditable: true },
        body: { type: "textarea", label: "Intro text", contentEditable: true },
        cards: {
          type: "array",
          label: "Cards",
          getItemSummary: (item) => item.title || "Lorem card",
          defaultItemProps: demoCards[0],
          arrayFields: {
            title: { type: "text", label: "Title", contentEditable: true },
            badge: { type: "text", label: "Badge", contentEditable: true },
            body: { type: "textarea", label: "Text", contentEditable: true },
            url: { type: "text", label: "Link URL" },
            imageUrl: mediaImageField("Image"),
            imageAlt: { type: "text", label: "Image alt text" },
          },
        },
        columns: { type: "select", label: "Columns", options: [{ label: "2", value: 2 }, { label: "3", value: 3 }, { label: "4", value: 4 }] },
        showImages: { type: "radio", label: "Show images", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
        defaultImageUrl: mediaImageField("Default card image"),
        defaultImageAlt: { type: "text", label: "Default image alt text" },
        background: { type: "select", label: "Background", options: backgroundOptions },
      },
      defaultProps: {
        eyebrow: lorem.eyebrow,
        title: lorem.title,
        body: lorem.body,
        cards: demoCards,
        columns: 3,
        showImages: true,
        defaultImageUrl: demoImageUrl,
        defaultImageAlt: lorem.imageAlt,
        background: "surface",
      },
      render: (props) => <DemoCardGrid {...props} />,
    },
    Hero: {
      fields: {
        icon: iconPickerField("Section icon"),
        eyebrow: { type: "text", label: "Eyebrow", contentEditable: true },
        title: { type: "text", label: "Headline", contentEditable: true },
        body: { type: "textarea", label: "Body", contentEditable: true },
        imageUrl: mediaImageField("Background image"),
        imageAlt: { type: "text", label: "Image alt text" },
        overlay: {
          type: "select",
          label: "Image overlay",
          options: [
            { label: "Dark", value: "dark" },
            { label: "Soft", value: "soft" },
            { label: "None", value: "none" },
          ],
        },
        align: {
          type: "radio",
          label: "Text alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
          ],
        },
        height: {
          type: "select",
          label: "Height",
          options: [
            { label: "Compact", value: "compact" },
            { label: "Standard", value: "standard" },
            { label: "Full screen", value: "full" },
          ],
        },
        primaryText: { type: "text", label: "Primary button text" },
        primaryUrl: { type: "text", label: "Primary button URL" },
        secondaryText: { type: "text", label: "Secondary button text" },
        secondaryUrl: { type: "text", label: "Secondary button URL" },
      },
      defaultProps: {
        icon: "compass",
        eyebrow: "",
        title: "",
        body: "",
        imageUrl: "",
        imageAlt: "",
        overlay: "dark",
        align: "left",
        height: "standard",
        primaryText: "",
        primaryUrl: "",
        secondaryText: "",
        secondaryUrl: "",
      },
      render: (props) => {
        const height = props.height === "full" ? "min-h-screen" : props.height === "compact" ? "min-h-[460px]" : "min-h-[620px]";
        const centered = props.align === "center";

        return (
          <section className={`premium-section relative flex ${height} items-center overflow-hidden bg-surface`}>
            {props.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={props.imageAlt || props.title}
                src={props.imageUrl}
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />
            ) : null}
            {props.overlay !== "none" ? (
              <div className={`absolute inset-0 ${props.overlay === "soft" ? "bg-surface/58" : "bg-gradient-to-r from-surface via-surface/82 to-surface/18"}`} />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/15" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface to-transparent" />
            <div className={`relative z-10 mx-auto w-full max-w-screen-2xl px-4 py-20 sm:px-6 ${centered ? "text-center" : ""}`}>
              <div className={`reveal-up mb-5 inline-flex h-12 w-12 items-center justify-center rounded-sm border border-primary/35 bg-primary/15 text-primary shadow-[0_0_40px_rgba(255,182,147,0.16)] ${centered ? "mx-auto" : ""}`}>
                <Icon name={props.icon} />
              </div>
              {props.eyebrow ? (
                <p className={`premium-kicker reveal-up mb-4 ${centered ? "justify-center" : ""}`}>
                  {props.eyebrow}
                </p>
              ) : null}
              <h1 className={`premium-heading reveal-up mb-6 font-headline text-5xl font-bold uppercase leading-none text-on-surface md:text-7xl ${centered ? "mx-auto max-w-5xl" : "max-w-4xl"}`}>
                {props.title}
              </h1>
              <p className={`premium-copy reveal-up-delay mb-10 text-lg sm:text-xl ${centered ? "mx-auto max-w-3xl" : "max-w-2xl"}`}>
                {props.body}
              </p>
              <div className={`reveal-up-delay flex flex-col gap-4 sm:flex-row ${centered ? "justify-center" : ""}`}>
                {props.primaryText ? (
                  <a className="premium-link btn-primary-glow inline-flex items-center justify-center rounded-sm px-8 py-4 font-label font-bold uppercase text-on-primary" href={props.primaryUrl || "#"}>
                    {props.primaryText}
                  </a>
                ) : null}
                {props.secondaryText ? (
                  <a className="premium-link inline-flex items-center justify-center rounded-sm border border-outline-variant bg-outline/20 px-8 py-4 font-label font-bold uppercase text-on-surface hover:border-primary hover:text-primary" href={props.secondaryUrl || "#"}>
                    {props.secondaryText}
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        );
      },
    },
    TextSection: {
      fields: {
        icon: iconPickerField(),
        eyebrow: { type: "text", label: "Eyebrow" },
        title: { type: "text", label: "Title", contentEditable: true },
        body: { type: "textarea", label: "Body", contentEditable: true },
        align: { type: "radio", label: "Alignment", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }] },
        background: { type: "select", label: "Background", options: backgroundOptions },
        padding: { type: "select", label: "Spacing", options: [{ label: "Compact", value: "compact" }, { label: "Standard", value: "standard" }, { label: "Spacious", value: "spacious" }] },
      },
      defaultProps: { icon: "compass", eyebrow: "", title: "", body: "", align: "center", background: "surface", padding: "standard" },
      render: ({ icon, eyebrow, title, body, align, background, padding }) => (
        <section className={`premium-section ${sectionBg[background || "surface"]} ${paddingClass[padding || "standard"]}`}>
          <div className={`mx-auto max-w-4xl px-4 sm:px-6 ${align === "center" ? "text-center" : ""}`}>
            <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-sm border border-primary/30 bg-primary/15 text-primary ${align === "center" ? "mx-auto" : ""}`}>
              <Icon name={icon} />
            </div>
            {eyebrow ? <p className={`premium-kicker mb-3 ${align === "center" ? "justify-center" : ""}`}>{eyebrow}</p> : null}
            <h2 className="premium-heading mb-4 font-headline text-4xl font-bold uppercase text-on-surface">{title}</h2>
            <p className="premium-copy text-lg">{body}</p>
          </div>
        </section>
      ),
    },
    FeatureGrid: {
      fields: {
        eyebrow: { type: "text", label: "Eyebrow", contentEditable: true },
        title: { type: "text", label: "Title", contentEditable: true },
        body: { type: "textarea", label: "Intro text", contentEditable: true },
        background: { type: "select", label: "Background", options: backgroundOptions },
        columns: { type: "select", label: "Columns", options: [{ label: "2", value: 2 }, { label: "3", value: 3 }, { label: "4", value: 4 }] },
        items: {
          type: "array",
          label: "Items",
          getItemSummary: (item) => item.title || lorem.title,
          defaultItemProps: { icon: "shield", title: lorem.title, body: lorem.body, url: "" },
          arrayFields: {
            icon: iconPickerField(),
            title: { type: "text", label: "Title", contentEditable: true },
            body: { type: "textarea", label: "Body", contentEditable: true },
            url: { type: "text", label: "Optional URL" },
          },
        },
      },
      defaultProps: { eyebrow: "", title: "", body: "", background: "surface", columns: 3, items: [] },
      render: ({ eyebrow, title, body, background, columns, items }) => (
        <section className={`premium-section ${sectionBg[background || "surface"]} py-16 sm:py-20`}>
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
            <GridHeader eyebrow={eyebrow} title={title} body={body} />
            <div className={`grid gap-5 ${columns === 4 ? "lg:grid-cols-4" : columns === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
              {(items || []).map((item, index) => {
                const inner = (
                  <div className="premium-card h-full p-6">
                    <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-sm bg-primary/15 text-primary">
                      <Icon name={item.icon} />
                    </div>
                    <h3 className="premium-heading mb-3 font-headline text-xl font-bold uppercase text-on-surface">{item.title}</h3>
                    <p className="premium-copy text-sm">{item.body}</p>
                  </div>
                );
                return item.url ? <a href={item.url} key={`${item.title}-${index}`}>{inner}</a> : <div key={`${item.title}-${index}`}>{inner}</div>;
              })}
            </div>
          </div>
        </section>
      ),
    },
    VehicleIndex: {
      fields: {
        icon: iconPickerField("Icon", <CarFront className="h-4 w-4" />),
        eyebrow: { type: "text", label: "Eyebrow", contentEditable: true },
        title: { type: "text", label: "Title", contentEditable: true },
        body: { type: "textarea", label: "Intro text", contentEditable: true },
        cards: {
          type: "array",
          label: "Custom cards",
          getItemSummary: (item) => item.title || "Card",
          defaultItemProps: {
            title: lorem.title,
            badge: "Lorem",
            body: lorem.body,
            url: "",
            imageUrl: "",
            imageAlt: "",
          },
          arrayFields: {
            title: { type: "text", label: "Title", contentEditable: true },
            badge: { type: "text", label: "Badge", contentEditable: true },
            body: { type: "textarea", label: "Text", contentEditable: true },
            url: { type: "text", label: "Link URL" },
            imageUrl: mediaImageField("Image"),
            imageAlt: { type: "text", label: "Image alt text" },
          },
        },
        layout: { type: "radio", label: "Layout", options: [{ label: "Cards", value: "cards" }, { label: "Compact", value: "compact" }] },
        showImages: { type: "radio", label: "Show images", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
        defaultImageUrl: mediaImageField("Default card image"),
        defaultImageAlt: { type: "text", label: "Default image alt text" },
        background: { type: "select", label: "Background", options: backgroundOptions },
      },
      defaultProps: { icon: "grid", eyebrow: "", title: "", body: "", cards: [], layout: "cards", showImages: false, defaultImageUrl: "", defaultImageAlt: "", background: "surface" },
      render: ({ icon, eyebrow, title, body, cards, layout, showImages, defaultImageUrl, defaultImageAlt, background, puck }) => {
        const metadata = puck.metadata as PuckMetadata | undefined;
        const lang = metadata?.lang || "en";
        const catalogCards: EditableCard[] = (metadata?.vehicles || []).map((vehicle) => ({
          title: vehicle.name || "",
          badge: vehicle.badge || "4x4",
          body: vehicle.tagline || vehicle.hero_body || "",
          url: `/${lang}/vehicles/${vehicle.slug}`,
          imageUrl: vehicle.featured_image_url || vehicle.hero_image_url || "",
          imageAlt: vehicle.hero_image_alt || vehicle.name || "",
        }));
        const customCards = cards || [];
        const visibleCards = customCards.length > 0 ? customCards : catalogCards;

        return (
          <section className={`premium-section ${sectionBg[background || "surface"]} py-16 sm:py-20`}>
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
              <GridHeader eyebrow={eyebrow} title={title} body={body} icon={icon} />
              <div className={layout === "compact" ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-4" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
                {visibleCards.map((card, index) => (
                  <a key={`${card.title}-${index}`} href={card.url || "#"} className="premium-card group">
                    {showImages && (card.imageUrl || defaultImageUrl) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={card.imageAlt || defaultImageAlt || card.title || ""} src={card.imageUrl || defaultImageUrl} className={`premium-card-image ${layout === "compact" ? "h-32 w-full object-cover" : "h-56 w-full object-cover"}`} />
                    ) : null}
                    <div className={layout === "compact" ? "p-4" : "p-5"}>
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <h3 className="premium-heading font-headline text-xl font-bold uppercase text-on-surface group-hover:text-primary">{card.title}</h3>
                        {card.badge ? <span className="rounded-sm bg-secondary-container px-2 py-1 text-[10px] font-bold uppercase text-on-secondary-container">{card.badge}</span> : null}
                      </div>
                      <p className="premium-copy text-sm">{card.body}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        );
      },
    },
    ProductGrid: {
      fields: {
        ...gridFields("Products", <Package className="h-4 w-4" />),
        cards: {
          type: "array",
          label: "Custom cards",
          getItemSummary: (item) => item.title || lorem.title,
          defaultItemProps: {
            title: lorem.title,
            badge: "Lorem",
            body: lorem.body,
            url: "",
            imageUrl: "",
            imageAlt: "",
          },
          arrayFields: {
            title: { type: "text", label: "Title", contentEditable: true },
            badge: { type: "text", label: "Badge", contentEditable: true },
            body: { type: "textarea", label: "Text", contentEditable: true },
            url: { type: "text", label: "Link URL" },
            imageUrl: mediaImageField("Image"),
            imageAlt: { type: "text", label: "Image alt text" },
          },
        },
        defaultImageUrl: mediaImageField("Default card image"),
        defaultImageAlt: { type: "text", label: "Default image alt text" },
      },
      defaultProps: { eyebrow: "", title: "", body: "", cards: [], limit: 6, columns: 3, showImages: true, defaultImageUrl: "", defaultImageAlt: "", background: "muted", cta: { label: "", url: "" } },
      render: ({ eyebrow, title, body, cards, limit, columns, showImages, defaultImageUrl, defaultImageAlt, background, cta, puck }) => {
        const metadata = puck.metadata as PuckMetadata | undefined;
        const lang = metadata?.lang || "en";
        const productCards: EditableCard[] = (metadata?.products || []).slice(0, limit || 6).map((product) => ({
          title: product.title || "",
          badge: product.category || product.product_type || "Gear",
          body: product.excerpt || "",
          url: product.slug ? `/${lang}/gear/${product.slug}` : "",
          imageUrl: product.featured_image_url || "",
          imageAlt: product.featured_image_alt || product.title || "",
        }));
        const customCards = (cards || []).slice(0, limit || 6);
        const visibleCards = customCards.length > 0 ? customCards : productCards;

        return (
          <section className={`premium-section ${sectionBg[background || "muted"]} py-16 sm:py-20`}>
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
              <GridHeader eyebrow={eyebrow} title={title} body={body} cta={cta} />
              <div className={`grid gap-6 md:grid-cols-2 ${columns === 4 ? "xl:grid-cols-4" : columns === 2 ? "xl:grid-cols-2" : "xl:grid-cols-3"}`}>
                {visibleCards.map((card, index) => (
                  <a key={`${card.title}-${index}`} href={card.url || "#"} className="premium-card group">
                    {showImages && (card.imageUrl || defaultImageUrl) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={card.imageAlt || defaultImageAlt || card.title || "Product"} src={card.imageUrl || defaultImageUrl} className="premium-card-image h-56 w-full object-cover" />
                    ) : null}
                    <div className="p-6">
                      <p className="premium-kicker mb-2">{card.badge}</p>
                      <h3 className="premium-heading mb-3 font-headline text-xl font-bold uppercase text-on-surface">{card.title}</h3>
                      <p className="premium-copy mb-5 line-clamp-3 text-sm">{card.body}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        );
      },
    },
    ArticleGrid: {
      fields: {
        ...gridFields("Articles", <Newspaper className="h-4 w-4" />),
        cards: {
          type: "array",
          label: "Custom cards",
          getItemSummary: (item) => item.title || lorem.title,
          defaultItemProps: {
            title: lorem.title,
            badge: "Lorem",
            body: lorem.body,
            url: "",
            imageUrl: "",
            imageAlt: "",
          },
          arrayFields: {
            title: { type: "text", label: "Title", contentEditable: true },
            badge: { type: "text", label: "Badge", contentEditable: true },
            body: { type: "textarea", label: "Text", contentEditable: true },
            url: { type: "text", label: "Link URL" },
            imageUrl: mediaImageField("Image"),
            imageAlt: { type: "text", label: "Image alt text" },
          },
        },
        defaultImageUrl: mediaImageField("Default card image"),
        defaultImageAlt: { type: "text", label: "Default image alt text" },
      },
      defaultProps: { eyebrow: "", title: "", body: "", cards: [], limit: 6, columns: 3, showImages: true, defaultImageUrl: "", defaultImageAlt: "", background: "surface", cta: { label: "", url: "" } },
      render: ({ eyebrow, title, body, cards, limit, columns, showImages, defaultImageUrl, defaultImageAlt, background, cta, puck }) => {
        const metadata = puck.metadata as PuckMetadata | undefined;
        const lang = metadata?.lang || "en";
        const articleCards: EditableCard[] = (metadata?.articles || []).slice(0, limit || 6).map((article) => ({
          title: article.title || "",
          badge: article.journal_category || "Journal",
          body: article.excerpt || "",
          url: `/${lang}/journal/${article.slug}`,
          imageUrl: article.featured_image_url || "",
          imageAlt: article.featured_image_alt || article.title || "",
        }));
        const customCards = (cards || []).slice(0, limit || 6);
        const visibleCards = customCards.length > 0 ? customCards : articleCards;

        return (
          <section className={`premium-section ${sectionBg[background || "surface"]} py-16 sm:py-20`}>
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
              <GridHeader eyebrow={eyebrow} title={title} body={body} cta={cta} />
              <div className={`grid gap-6 md:grid-cols-2 ${columns === 4 ? "xl:grid-cols-4" : columns === 2 ? "xl:grid-cols-2" : "xl:grid-cols-3"}`}>
                {visibleCards.map((card, index) => (
                  <a key={`${card.title}-${index}`} href={card.url || "#"} className="premium-card group">
                    {showImages && (card.imageUrl || defaultImageUrl) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={card.imageAlt || defaultImageAlt || card.title || "Article"} src={card.imageUrl || defaultImageUrl} className="premium-card-image h-52 w-full object-cover" />
                    ) : null}
                    <div className="p-6">
                      <p className="premium-kicker mb-2">{card.badge}</p>
                      <h3 className="premium-heading mb-3 font-headline text-xl font-bold uppercase text-on-surface group-hover:text-primary">{card.title}</h3>
                      <p className="premium-copy line-clamp-3 text-sm">{card.body}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        );
      },
    },
    Newsletter: {
      fields: {
        icon: iconPickerField("Icon", <Mail className="h-4 w-4" />),
        title: { type: "text", label: "Title", contentEditable: true },
        body: { type: "textarea", label: "Body", contentEditable: true },
        placeholder: { type: "text", label: "Input placeholder", contentEditable: true },
        buttonText: { type: "text", label: "Button text", contentEditable: true },
        background: { type: "select", label: "Background", options: backgroundOptions },
      },
      defaultProps: { icon: "compass", title: "", body: "", placeholder: "", buttonText: "", background: "surface" },
      render: ({ icon, title, body, placeholder, buttonText, background }) => (
        <section className={`premium-section ${sectionBg[background || "surface"]} py-20`}>
          <div className="premium-panel mx-auto max-w-3xl px-5 py-10 text-center sm:px-10">
            <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-sm border border-primary/30 bg-primary/15 text-primary">
              <Icon name={icon} />
            </div>
            <h2 className="premium-heading mb-4 font-headline text-4xl font-bold uppercase text-on-surface">{title}</h2>
            <p className="premium-copy mb-8 text-lg">{body}</p>
            <form className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row">
              <input className="flex-1 border border-outline-variant/30 bg-surface-container-highest/80 px-5 py-4 text-on-surface outline-none placeholder:text-outline/60 focus:border-primary" placeholder={placeholder} type="email" />
              <button className="premium-link btn-primary-glow rounded-sm px-8 py-4 font-label font-bold uppercase text-on-primary" type="button">
                {buttonText}
              </button>
            </form>
          </div>
        </section>
      ),
    },
  },
};

function gridFields(label: string, icon: React.ReactElement) {
  return {
    eyebrow: { type: "text", label: "Eyebrow", contentEditable: true },
    title: { type: "text", label: "Title", contentEditable: true },
    body: { type: "textarea", label: "Intro text", contentEditable: true },
    limit: { type: "number", label: `${label} limit`, min: 1, max: 24 },
    columns: { type: "select", label: "Columns", labelIcon: icon, options: [{ label: "2", value: 2 }, { label: "3", value: 3 }, { label: "4", value: 4 }] },
    showImages: { type: "radio", label: "Show images", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
    background: { type: "select", label: "Background", options: backgroundOptions },
    cta: {
      type: "object",
      label: "Optional button",
      objectFields: {
        label: { type: "text", label: "Button label" },
        url: { type: "text", label: "Button URL" },
      },
    },
  } as const;
}

function GridHeader({
  eyebrow,
  title,
  body,
  icon,
  cta,
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  icon?: IconName;
  cta?: ActionLink;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-outline-variant/20 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-3">
          {icon ? (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-primary/15 text-primary">
              <Icon name={icon} />
            </span>
          ) : null}
          {eyebrow ? <p className="premium-kicker">{eyebrow}</p> : null}
        </div>
        <h2 className="premium-heading font-headline text-3xl font-bold uppercase text-on-surface md:text-4xl">{title}</h2>
        {body ? <p className="premium-copy mt-2 max-w-3xl">{body}</p> : null}
      </div>
      {cta?.label ? (
        <a className="premium-link inline-flex shrink-0 items-center justify-center rounded-sm border border-outline-variant bg-surface-container-high/60 px-5 py-3 font-label text-xs font-bold uppercase text-on-surface hover:border-primary hover:text-primary" href={cta.url || "#"}>
          {cta.label}
        </a>
      ) : null}
    </div>
  );
}
