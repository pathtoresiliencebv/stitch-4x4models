"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  CheckCircle2,
  Database,
  FolderOpen,
  Image as ImageIcon,
  Link2,
  Loader2,
  RefreshCw,
  Search,
  UploadCloud,
  X,
} from "lucide-react";
import {
  DEFAULT_CMS_IMAGE,
  imageWithFallback,
  normalizeCmsImageUrl,
} from "@/lib/cms-images";

type MediaItem = {
  id: string;
  title: string;
  url: string;
  alt?: string | null;
  source?: "base44" | "local";
  created_date?: string;
};

let mediaLibraryCache: MediaItem[] | null = null;
let mediaLibraryPromise: Promise<MediaItem[]> | null = null;

async function fetchMediaLibrary(force = false) {
  if (!force && mediaLibraryCache) return mediaLibraryCache;
  if (!force && mediaLibraryPromise) return mediaLibraryPromise;

  mediaLibraryPromise = fetch("/api/cms/media", { cache: "no-store" })
    .then(async (response) => {
      const payload = (await response.json()) as { items?: MediaItem[]; error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not load media library");
      mediaLibraryCache = payload.items || [];
      return mediaLibraryCache;
    })
    .finally(() => {
      mediaLibraryPromise = null;
    });

  return mediaLibraryPromise;
}

function mediaCategory(url: string) {
  if (url.includes("/images/shop/")) return "Shop";
  if (url.includes("/images/brands/")) return "Brand";
  if (url.includes("/images/journal/")) return "Journal";
  if (url.includes("/images/blog/")) return "Blog";
  if (url.includes("/images/collections/")) return "Collection";
  if (url.includes("/images/hero/")) return "Hero";
  if (url.includes("/images/explainers/")) return "Guide";
  return "Image";
}

export default function MediaImagePicker({
  id,
  value,
  onChange,
  readOnly,
}: {
  id: string;
  value?: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) {
  const [items, setItems] = useState<MediaItem[]>(() => mediaLibraryCache || []);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!mediaLibraryCache);
  const [uploading, setUploading] = useState(false);
  const selectedUrl = normalizeCmsImageUrl(value) || "";
  const previewUrl = selectedUrl || "";

  useEffect(() => {
    let active = true;

    async function loadInitialMedia() {
      setLoading(true);
      setError("");

      try {
        const media = await fetchMediaLibrary();
        if (active) setItems(media);
      } catch (loadError) {
        if (active) {
          const message = loadError instanceof Error ? loadError.message : "Could not load media library";
          setError(message);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (!mediaLibraryCache) {
      loadInitialMedia();
    }

    return () => {
      active = false;
    };
  }, []);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items
      .filter((item) => {
        if (!normalizedQuery) return true;
        const haystack = [
          item.title,
          item.alt || "",
          item.url,
          item.source || "",
          mediaCategory(item.url),
        ].join(" ").toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .sort((a, b) => {
        const aSelected = normalizeCmsImageUrl(a.url) === selectedUrl ? 0 : 1;
        const bSelected = normalizeCmsImageUrl(b.url) === selectedUrl ? 0 : 1;
        if (aSelected !== bSelected) return aSelected - bSelected;
        if ((a.source || "local") !== (b.source || "local")) {
          return a.source === "base44" ? -1 : 1;
        }
        return a.title.localeCompare(b.title);
      });
  }, [items, query, selectedUrl]);

  async function refreshLibrary(force = true) {
    setLoading(true);
    setError("");

    try {
      const media = await fetchMediaLibrary(force);
      setItems(media);
      setStatus("Media library refreshed.");
    } catch (refreshError) {
      const message = refreshError instanceof Error ? refreshError.message : "Could not refresh media library";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    setStatus(`Uploading ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const upload = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });
      const result = (await upload.json()) as { url?: string; error?: string };

      if (!upload.ok || !result.url) {
        throw new Error(result.error || "Upload failed");
      }

      const nextUrl = normalizeCmsImageUrl(result.url) || imageWithFallback(result.url);
      onChange(nextUrl);

      const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      await fetch("/api/cms/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          url: nextUrl,
          alt: title,
        }),
      }).catch(() => null);

      await refreshLibrary(true);
      setStatus("Image uploaded and selected.");
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Upload failed";
      setError(message);
      setStatus("");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3 rounded border border-slate-200 bg-white p-3 shadow-sm">
      <div className="overflow-hidden rounded border border-slate-200 bg-slate-950">
        <div className="relative flex h-36 items-center justify-center">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=""
              src={previewUrl}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = DEFAULT_CMS_IMAGE;
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <ImageIcon className="h-7 w-7" />
              <span className="text-xs font-semibold uppercase tracking-wide">No image selected</span>
            </div>
          )}
          {previewUrl ? (
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent p-2 text-[11px] font-semibold text-white">
              <span className="truncate">{previewUrl}</span>
              <span className="shrink-0 rounded bg-white/15 px-2 py-1 uppercase">{mediaCategory(previewUrl)}</span>
            </div>
          ) : null}
        </div>
      </div>

      <label className="block">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Direct image URL</span>
        <span className="flex items-center gap-2 rounded border border-slate-300 bg-slate-50 px-3 py-2 focus-within:border-slate-500">
          <Link2 className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            disabled={readOnly}
            onBlur={(event) => {
              const normalized = normalizeCmsImageUrl(event.currentTarget.value);
              if (normalized && normalized !== event.currentTarget.value) onChange(normalized);
            }}
            onChange={(event) => onChange(event.currentTarget.value)}
            placeholder="/images/shop/example.jpg"
            value={value || ""}
          />
          {value ? (
            <button
              aria-label="Clear image"
              className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              disabled={readOnly}
              onClick={() => onChange("")}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </span>
      </label>

      <label
        className={[
          "flex min-h-16 cursor-pointer items-center gap-3 rounded border border-dashed px-3 py-3 text-sm transition",
          readOnly
            ? "border-slate-200 bg-slate-50 text-slate-400"
            : "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-500 hover:bg-white",
        ].join(" ")}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-slate-900 text-white">
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
        </span>
        <span className="min-w-0">
          <span className="block font-bold">{uploading ? "Uploading image" : "Upload new image"}</span>
          <span className="block text-xs text-slate-500">JPG, PNG, WebP or GIF</span>
        </span>
        <input
          accept="image/*"
          className="sr-only"
          disabled={readOnly || uploading}
          onChange={uploadImage}
          type="file"
        />
      </label>

      <div className="rounded border border-slate-200 bg-slate-50 p-2">
        <div className="mb-2 flex items-center gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded border border-slate-200 bg-white px-2 py-2">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Search media..."
              type="search"
              value={query}
            />
          </label>
          <button
            aria-label="Refresh media library"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-950"
            disabled={readOnly || loading}
            onClick={() => refreshLibrary(true)}
            title="Refresh media library"
            type="button"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </button>
        </div>

        {loading && visibleItems.length === 0 ? (
          <div className="flex h-32 items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading media
          </div>
        ) : visibleItems.length ? (
          <div className="grid max-h-80 grid-cols-3 gap-2 overflow-y-auto pr-1">
            {visibleItems.map((item) => {
              const normalizedItemUrl = normalizeCmsImageUrl(item.url) || imageWithFallback(item.url);
              const selected = normalizeCmsImageUrl(item.url) === selectedUrl;
              const sourceLabel = item.source === "base44" ? "CRM" : "Lokaal";

              return (
                <button
                  aria-pressed={selected}
                  className={[
                    "group relative aspect-[4/3] overflow-hidden rounded border bg-slate-100 text-left transition",
                    selected
                      ? "border-emerald-500 ring-2 ring-emerald-200"
                      : "border-slate-200 hover:border-slate-500 hover:ring-2 hover:ring-slate-200",
                  ].join(" ")}
                  disabled={readOnly}
                  key={item.id}
                  onClick={() => {
                    onChange(normalizedItemUrl);
                    setStatus(`Selected ${item.title}.`);
                  }}
                  title={item.title}
                  type="button"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={item.alt || item.title}
                    src={normalizedItemUrl}
                    className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.src = DEFAULT_CMS_IMAGE;
                    }}
                  />
                  <span className="absolute left-1 top-1 inline-flex items-center gap-1 rounded bg-black/70 px-1.5 py-1 text-[10px] font-bold uppercase text-white">
                    {item.source === "base44" ? <Database className="h-3 w-3" /> : <FolderOpen className="h-3 w-3" />}
                    {sourceLabel}
                  </span>
                  {selected ? (
                    <span className="absolute right-1 top-1 rounded-full bg-emerald-500 p-1 text-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                  ) : null}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2 text-[11px] font-semibold text-white">
                    <span className="block truncate">{item.title}</span>
                    <span className="block text-[10px] uppercase text-white/70">{mediaCategory(item.url)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded border border-dashed border-slate-300 bg-white px-4 text-center text-xs text-slate-500">
            No images match this search.
          </div>
        )}
      </div>

      {error ? <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</p> : null}
      {status ? <p id={`${id}-status`} className="text-xs font-medium text-slate-500">{status}</p> : null}
    </div>
  );
}
