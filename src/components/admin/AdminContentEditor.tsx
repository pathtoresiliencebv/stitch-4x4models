"use client";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Languages,
  LayoutGrid,
  Link2,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  SearchCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import MediaImagePicker from "@/components/puck/MediaImagePicker";
import { calculateSeoScore, canonicalForCmsSlug } from "@/lib/seo-score";
import type {
  CmsEditorCard,
  CmsEditorMutation,
  CmsEditorPage,
  CmsEditorSection,
} from "@/types/cms-editor";

type PageOption = {
  id: string;
  slug: string;
  title: string;
  locale?: string;
  status?: string;
  seo_score?: number;
  updated_date?: string;
};

type EditorTab = "content" | "seo" | "preview";

function editorKey(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function livePath(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

function scoreTone(score: number) {
  if (score >= 82) return "bg-emerald-100 text-emerald-800";
  if (score >= 65) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

function fieldClass() {
  return "w-full rounded-md border border-[#d8cfc0] bg-white px-3 py-2.5 text-sm text-[#171411] outline-none transition placeholder:text-[#a49b90] focus:border-[#a3681a] focus:ring-2 focus:ring-[#a3681a]/15";
}

function FieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.12em] text-[#675f55]">
        {children}
        {hint ? <span className="font-normal normal-case tracking-normal text-[#9b9186]">{hint}</span> : null}
      </span>
    </label>
  );
}

function CardEditor({
  card,
  index,
  onChange,
  onRemove,
}: {
  card: CmsEditorCard;
  index: number;
  onChange: (patch: Partial<CmsEditorCard>) => void;
  onRemove: () => void;
}) {
  const key = card.id || card.editor_key || `card-${index}`;

  return (
    <details className="overflow-hidden rounded-md border border-[#ddd4c7] bg-white" open={index === 0}>
      <summary className="flex cursor-pointer list-none items-center gap-3 bg-[#fbfaf7] px-4 py-3">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#171411] text-white">
          {index + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{card.title || "Nieuwe kaart"}</span>
          <span className="block truncate text-xs text-[#8c8174]">{card.href || "Nog geen link"}</span>
        </span>
        <ChevronDown className="h-4 w-4 text-[#8c8174]" />
      </summary>

      <div className="grid gap-5 border-t border-[#eee7db] p-4 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel>Titel</FieldLabel>
            <input className={fieldClass()} value={card.title || ""} onChange={(event) => onChange({ title: event.target.value })} />
          </div>
          <div>
            <FieldLabel>Label / badge</FieldLabel>
            <input className={fieldClass()} value={card.badge || ""} onChange={(event) => onChange({ badge: event.target.value })} />
          </div>
          <div>
            <FieldLabel>Metadata</FieldLabel>
            <input className={fieldClass()} value={card.meta || ""} onChange={(event) => onChange({ meta: event.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel>Tekst</FieldLabel>
            <textarea className={`${fieldClass()} min-h-28 resize-y`} value={card.body || ""} onChange={(event) => onChange({ body: event.target.value })} />
          </div>
          <div>
            <FieldLabel>Knoptekst</FieldLabel>
            <input className={fieldClass()} value={card.cta_label || ""} onChange={(event) => onChange({ cta_label: event.target.value })} placeholder="Bekijk model" />
          </div>
          <div>
            <FieldLabel>Knoplink</FieldLabel>
            <span className="flex items-center rounded-md border border-[#d8cfc0] bg-white pl-3 focus-within:border-[#a3681a] focus-within:ring-2 focus-within:ring-[#a3681a]/15">
              <Link2 className="h-4 w-4 shrink-0 text-[#8c8174]" />
              <input className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm outline-none" value={card.href || ""} onChange={(event) => onChange({ href: event.target.value })} placeholder="/merken/ford" />
            </span>
          </div>
          <div className="sm:col-span-2">
            <FieldLabel>Alt-tekst foto</FieldLabel>
            <input className={fieldClass()} value={card.image_alt || ""} onChange={(event) => onChange({ image_alt: event.target.value })} />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button className="inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-red-700 hover:bg-red-50" onClick={onRemove} type="button">
              <Trash2 className="h-4 w-4" />
              Kaart verwijderen
            </button>
          </div>
        </div>

        <div>
          <MediaImagePicker id={`card-image-${key}`} value={card.image_url} onChange={(image_url) => onChange({ image_url })} />
        </div>
      </div>
    </details>
  );
}

function SectionEditor({
  section,
  index,
  onChange,
  onRemove,
}: {
  section: CmsEditorSection;
  index: number;
  onChange: (next: CmsEditorSection) => void;
  onRemove: () => void;
}) {
  const key = section.id || section.editor_key || `section-${index}`;

  function updateCard(cardIndex: number, patch: Partial<CmsEditorCard>) {
    const cards = section.cards.map((card, indexValue) => (
      indexValue === cardIndex ? { ...card, ...patch } : card
    ));
    onChange({ ...section, cards });
  }

  function addCard() {
    onChange({
      ...section,
      cards: [
        ...section.cards,
        {
          editor_key: editorKey("card"),
          page_slug: section.page_slug,
          section_key: section.section_key,
          locale: section.locale,
          title: "Nieuwe kaart",
          body: "",
          cta_label: "Bekijk",
          href: "",
          image_url: "",
          image_alt: "",
          card_type: "link",
          status: "published",
          sort_order: section.cards.length,
        },
      ],
    });
  }

  return (
    <details className="overflow-hidden rounded-lg border border-[#d8cfc0] bg-[#f5f1ea]" open={index === 0}>
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 sm:px-5">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#a3681a] text-white">
          <LayoutGrid className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">{section.title || section.section_key || "Nieuwe sectie"}</span>
          <span className="block text-xs uppercase tracking-[0.12em] text-[#8c8174]">
            {section.section_type || "content"} · {section.cards.length} kaarten
          </span>
        </span>
        <ChevronDown className="h-5 w-5 text-[#675f55]" />
      </summary>

      <div className="space-y-5 border-t border-[#d8cfc0] bg-white p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Interne sectiesleutel</FieldLabel>
              <input className={fieldClass()} value={section.section_key || ""} onChange={(event) => onChange({ ...section, section_key: event.target.value })} />
            </div>
            <div>
              <FieldLabel>Type</FieldLabel>
              <select className={fieldClass()} value={section.section_type || "card_grid"} onChange={(event) => onChange({ ...section, section_type: event.target.value })}>
                <option value="hero">Hero</option>
                <option value="text">Tekst</option>
                <option value="card_grid">Kaarten</option>
                <option value="brand_grid">Merken</option>
                <option value="article_grid">Artikelen</option>
                <option value="product_grid">Producten</option>
                <option value="feature">Feature</option>
                <option value="cta">CTA</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Kleine bovenregel</FieldLabel>
              <input className={fieldClass()} value={section.eyebrow || ""} onChange={(event) => onChange({ ...section, eyebrow: event.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Sectietitel</FieldLabel>
              <input className={`${fieldClass()} text-lg font-semibold`} value={section.title || ""} onChange={(event) => onChange({ ...section, title: event.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Tekst</FieldLabel>
              <textarea className={`${fieldClass()} min-h-32 resize-y leading-6`} value={section.body || ""} onChange={(event) => onChange({ ...section, body: event.target.value })} />
            </div>
            <div>
              <FieldLabel>Knoptekst</FieldLabel>
              <input className={fieldClass()} value={section.cta_label || ""} onChange={(event) => onChange({ ...section, cta_label: event.target.value })} />
            </div>
            <div>
              <FieldLabel>Knoplink</FieldLabel>
              <input className={fieldClass()} value={section.cta_url || ""} onChange={(event) => onChange({ ...section, cta_url: event.target.value })} placeholder="/contact" />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Alt-tekst foto</FieldLabel>
              <input className={fieldClass()} value={section.image_alt || ""} onChange={(event) => onChange({ ...section, image_alt: event.target.value })} />
            </div>
          </div>
          <MediaImagePicker id={`section-image-${key}`} value={section.image_url} onChange={(image_url) => onChange({ ...section, image_url })} />
        </div>

        <div className="border-t border-[#eee7db] pt-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#a3681a]">Kaarten</p>
              <p className="mt-1 text-sm text-[#675f55]">Foto, tekst en knop worden samen op de publieke kaart verwerkt.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-md bg-[#171411] px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-[#a3681a]" onClick={addCard} type="button">
              <Plus className="h-4 w-4" />
              Kaart toevoegen
            </button>
          </div>
          <div className="space-y-3">
            {section.cards.map((card, cardIndex) => (
              <CardEditor
                card={card}
                index={cardIndex}
                key={card.id || card.editor_key || `${key}-${cardIndex}`}
                onChange={(patch) => updateCard(cardIndex, patch)}
                onRemove={() => onChange({
                  ...section,
                  cards: section.cards.filter((_, itemIndex) => itemIndex !== cardIndex),
                })}
              />
            ))}
            {!section.cards.length ? (
              <div className="rounded-md border border-dashed border-[#d8cfc0] bg-[#fbfaf7] px-5 py-8 text-center text-sm text-[#675f55]">
                Deze sectie heeft geen kaarten. Voeg alleen kaarten toe als dit blok ze nodig heeft.
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end border-t border-[#eee7db] pt-4">
          <button className="inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-red-700 hover:bg-red-50" onClick={onRemove} type="button">
            <Trash2 className="h-4 w-4" />
            Sectie verwijderen
          </button>
        </div>
      </div>
    </details>
  );
}

export default function AdminContentEditor({
  initialPage,
  pages,
}: {
  initialPage: CmsEditorPage;
  pages: PageOption[];
}) {
  const [page, setPage] = useState(initialPage);
  const [tab, setTab] = useState<EditorTab>("content");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState("");
  const [error, setError] = useState("");
  const [previewVersion, setPreviewVersion] = useState(0);

  const seo = useMemo(() => {
    const text = [
      page.title,
      page.meta_description,
      ...page.sections.flatMap((section) => [
        section.eyebrow,
        section.title,
        section.body,
        ...section.cards.flatMap((card) => [
          card.title,
          card.subtitle,
          card.body,
          card.badge,
          card.meta,
        ]),
      ]),
    ].filter(Boolean).join(" ");
    const hasImage = Boolean(
      page.featured_image_url ||
      page.sections.some((section) => section.image_url || section.cards.some((card) => card.image_url)),
    );
    const hasLink = page.sections.some((section) => section.cta_url || section.cards.some((card) => card.href));

    return calculateSeoScore({
      title: page.seo_title || page.title,
      description: page.meta_description || "",
      keyword: page.focus_keyword || "",
      text,
      hasImage,
      hasLink,
      hasHeading: Boolean(page.title),
      content: page.content || "",
    });
  }, [page]);

  function updateSection(index: number, next: CmsEditorSection) {
    setPage((current) => ({
      ...current,
      sections: current.sections.map((section, itemIndex) => itemIndex === index ? next : section),
    }));
  }

  function addSection() {
    setPage((current) => ({
      ...current,
      sections: [
        ...current.sections,
        {
          editor_key: editorKey("section"),
          page_slug: current.slug,
          locale: current.locale,
          section_key: `section-${current.sections.length + 1}`,
          section_type: "card_grid",
          title: "Nieuwe sectie",
          body: "",
          status: "published",
          sort_order: current.sections.length,
          cards: [],
        },
      ],
    }));
  }

  async function save() {
    setSaving(true);
    setError("");

    const payload: CmsEditorMutation = {
      page: {
        id: page.id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        locale: page.locale,
        seo_title: page.seo_title,
        meta_description: page.meta_description,
        focus_keyword: page.focus_keyword,
        secondary_keywords: page.secondary_keywords,
        canonical_url: page.canonical_url,
        featured_image_url: page.featured_image_url,
      },
      sections: page.sections,
      archiveMissing: true,
    };

    try {
      const response = await fetch("/api/cms/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { page?: CmsEditorPage; error?: string };
      if (!response.ok || !result.page) throw new Error(result.error || "Opslaan is mislukt");

      setPage(result.page);
      setSavedAt(new Intl.DateTimeFormat("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date()));
      setPreviewVersion((version) => version + 1);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Opslaan is mislukt");
    } finally {
      setSaving(false);
    }
  }

  const canonical = page.canonical_url || canonicalForCmsSlug(page.slug);
  const pagePath = livePath(page.slug);

  return (
    <main className="min-h-screen bg-[#f3eee5] text-[#171411]">
      <header className="sticky top-0 z-40 border-b border-[#ded5c8] bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#ddd4c7] text-[#675f55] hover:border-[#a3681a] hover:text-[#a3681a]" href="/admin" title="Terug naar dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a3681a]">Websitebeheer</p>
            <h1 className="truncate text-lg font-semibold">{page.title}</h1>
          </div>
          <select
            className="min-w-52 rounded-md border border-[#d8cfc0] bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#a3681a]"
            onChange={(event) => {
              window.location.href = `/admin/content?slug=${encodeURIComponent(event.target.value)}`;
            }}
            value={page.slug}
          >
            {pages.map((option) => (
              <option key={option.id} value={option.slug}>
                {option.locale?.toUpperCase() || "NL"} · {option.title}
              </option>
            ))}
          </select>
          <a className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d8cfc0] bg-white px-3 text-sm font-semibold hover:border-[#a3681a] hover:text-[#a3681a]" href={pagePath} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            Live
          </a>
          <button className="inline-flex h-10 items-center gap-2 rounded-md bg-[#171411] px-4 text-sm font-bold text-white transition hover:bg-[#a3681a] disabled:opacity-60" disabled={saving} onClick={save} type="button">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Opslaan..." : "Publiceren"}
          </button>
        </div>
        <div className="mx-auto flex max-w-[1600px] gap-1 overflow-x-auto px-4 sm:px-6">
          {([
            ["content", FileText, "Inhoud"],
            ["seo", SearchCheck, "SEO"],
            ["preview", RefreshCw, "Live preview"],
          ] as const).map(([value, Icon, label]) => (
            <button
              className={[
                "inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold",
                tab === value ? "border-[#a3681a] text-[#a3681a]" : "border-transparent text-[#675f55] hover:text-[#171411]",
              ].join(" ")}
              key={value}
              onClick={() => setTab(value)}
              type="button"
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
          <span className="ml-auto hidden items-center gap-2 py-3 text-xs text-[#675f55] sm:flex">
            <Languages className="h-4 w-4" />
            Bron: {page.locale === "nl" ? "Nederlands · Engelse vertaling wordt opnieuw klaargezet" : "Engels"}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] p-4 sm:p-6">
        {error ? <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}
        {savedAt ? (
          <div className="mb-5 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            <Check className="h-4 w-4" />
            Pagina, SEO en vertaalwachtrij bijgewerkt om {savedAt}.
          </div>
        ) : null}

        {tab === "content" ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="space-y-5">
              <section className="rounded-lg border border-[#d8cfc0] bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#171411] text-white">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold">Pagina-instellingen</p>
                    <p className="text-sm text-[#675f55]">Titel, status en hoofdbeeld.</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FieldLabel>Paginatitel</FieldLabel>
                    <input className={`${fieldClass()} text-xl font-semibold`} value={page.title || ""} onChange={(event) => setPage({ ...page, title: event.target.value })} />
                  </div>
                  <div>
                    <FieldLabel>Route</FieldLabel>
                    <input className={`${fieldClass()} bg-[#f6f2eb]`} readOnly value={page.slug} />
                  </div>
                  <div>
                    <FieldLabel>Status</FieldLabel>
                    <select className={fieldClass()} value={page.status || "published"} onChange={(event) => setPage({ ...page, status: event.target.value })}>
                      <option value="published">Gepubliceerd</option>
                      <option value="draft">Concept</option>
                    </select>
                  </div>
                </div>
              </section>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a3681a]">{page.sections.length} secties</p>
                  <h2 className="mt-1 text-2xl font-semibold">Visuele pagina-opbouw</h2>
                </div>
                <button className="inline-flex items-center gap-2 rounded-md bg-[#a3681a] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#855311]" onClick={addSection} type="button">
                  <Plus className="h-4 w-4" />
                  Sectie toevoegen
                </button>
              </div>

              {page.sections.map((section, index) => (
                <SectionEditor
                  index={index}
                  key={section.id || section.editor_key || `section-${index}`}
                  section={section}
                  onChange={(next) => updateSection(index, next)}
                  onRemove={() => setPage((current) => ({
                    ...current,
                    sections: current.sections.filter((_, itemIndex) => itemIndex !== index),
                  }))}
                />
              ))}
            </div>

            <aside className="space-y-5 xl:sticky xl:top-36 xl:self-start">
              <div className="rounded-lg border border-[#d8cfc0] bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-[#a3681a]" />
                  <p className="text-sm font-bold">Hoofdbeeld pagina</p>
                </div>
                <MediaImagePicker id="page-featured-image" value={page.featured_image_url} onChange={(featured_image_url) => setPage({ ...page, featured_image_url })} />
              </div>
              <div className="rounded-lg border border-[#d8cfc0] bg-[#171411] p-5 text-white shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d3a35b]">Publicatiecheck</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4"><dt className="text-white/60">Secties</dt><dd className="font-semibold">{page.sections.length}</dd></div>
                  <div className="flex items-center justify-between gap-4"><dt className="text-white/60">Kaarten</dt><dd className="font-semibold">{page.sections.reduce((total, section) => total + section.cards.length, 0)}</dd></div>
                  <div className="flex items-center justify-between gap-4"><dt className="text-white/60">SEO</dt><dd className={`rounded px-2 py-1 text-xs font-bold ${scoreTone(seo.score)}`}>{seo.score}/100</dd></div>
                  <div className="flex items-center justify-between gap-4"><dt className="text-white/60">Taal</dt><dd className="font-semibold uppercase">{page.locale || "nl"}</dd></div>
                </dl>
              </div>
            </aside>
          </div>
        ) : null}

        {tab === "seo" ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_28rem]">
            <section className="rounded-lg border border-[#d8cfc0] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a3681a]">SEO-editor</p>
                  <h2 className="mt-2 text-2xl font-semibold">Zoekresultaat en inhoudskwaliteit</h2>
                </div>
                <span className={`rounded-full px-4 py-2 text-sm font-bold ${scoreTone(seo.score)}`}>{seo.score}/100</span>
              </div>
              <div className="space-y-5">
                <div>
                  <FieldLabel hint={`${(page.seo_title || "").length}/70`}>SEO-titel</FieldLabel>
                  <input className={fieldClass()} maxLength={70} value={page.seo_title || ""} onChange={(event) => setPage({ ...page, seo_title: event.target.value })} />
                </div>
                <div>
                  <FieldLabel hint={`${(page.meta_description || "").length}/160`}>Metaomschrijving</FieldLabel>
                  <textarea className={`${fieldClass()} min-h-28 resize-y`} maxLength={170} value={page.meta_description || ""} onChange={(event) => setPage({ ...page, meta_description: event.target.value })} />
                </div>
                <div>
                  <FieldLabel>Hoofdzoekwoord</FieldLabel>
                  <input className={fieldClass()} value={page.focus_keyword || ""} onChange={(event) => setPage({ ...page, focus_keyword: event.target.value })} />
                </div>
                <div>
                  <FieldLabel>Secundaire zoekwoorden <span className="normal-case tracking-normal">(komma gescheiden)</span></FieldLabel>
                  <input
                    className={fieldClass()}
                    value={(page.secondary_keywords || []).join(", ")}
                    onChange={(event) => setPage({
                      ...page,
                      secondary_keywords: event.target.value.split(",").map((value) => value.trim()).filter(Boolean),
                    })}
                  />
                </div>
                <div>
                  <FieldLabel>Canonical URL</FieldLabel>
                  <input className={fieldClass()} value={page.canonical_url || ""} onChange={(event) => setPage({ ...page, canonical_url: event.target.value })} placeholder={canonicalForCmsSlug(page.slug)} />
                </div>
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-lg border border-[#dfe7f6] bg-white p-5 shadow-sm">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#675f55]">Google-preview</p>
                <p className="line-clamp-2 text-xl leading-6 text-[#1a0dab]">{page.seo_title || page.title}</p>
                <p className="mt-1 truncate text-sm text-[#006621]">{canonical}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-5 text-[#545454]">{page.meta_description || "Voeg een metaomschrijving toe om hier de Google-preview te zien."}</p>
              </div>
              <div className="rounded-lg border border-[#d8cfc0] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="font-semibold">Live controles</p>
                  <span className="text-xs text-[#675f55]">{seo.wordCount} woorden · leesbaarheid {seo.readability}</span>
                </div>
                <div className="space-y-2">
                  {seo.checks.map((check) => (
                    <div className="flex items-center gap-3 rounded-md bg-[#fbfaf7] px-3 py-2.5 text-sm" key={check.key}>
                      <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${check.passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {check.passed ? <Check className="h-3.5 w-3.5" /> : <span className="text-xs font-bold">!</span>}
                      </span>
                      <span className="flex-1">{check.label}</span>
                      <span className="text-xs font-semibold text-[#8c8174]">+{check.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        ) : null}

        {tab === "preview" ? (
          <section className="overflow-hidden rounded-lg border border-[#d8cfc0] bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee7db] bg-[#fbfaf7] px-4 py-3">
              <div>
                <p className="text-sm font-semibold">{pagePath}</p>
                <p className="text-xs text-[#675f55]">De preview vernieuwt na publiceren.</p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-md border border-[#d8cfc0] bg-white px-3 py-2 text-sm font-semibold hover:border-[#a3681a] hover:text-[#a3681a]" onClick={() => setPreviewVersion((version) => version + 1)} type="button">
                <RefreshCw className="h-4 w-4" />
                Vernieuwen
              </button>
            </div>
            <iframe className="h-[calc(100vh-15rem)] min-h-[620px] w-full bg-white" key={previewVersion} src={`${pagePath}?cmsPreview=${previewVersion}`} title={`Preview van ${page.title}`} />
          </section>
        ) : null}
      </div>
    </main>
  );
}
