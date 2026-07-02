import { NextRequest, NextResponse } from "next/server";
import { base44Fetch, base44List } from "@/lib/base44-api";
import { localCmsMediaItems, normalizeCmsImageUrl } from "@/lib/cms-images";
import type { SiteContent } from "@/types/common";

type MediaItem = {
  id: string;
  title: string;
  url: string;
  alt?: string | null;
  created_date?: string;
};

function toMediaItem(record: SiteContent): MediaItem | null {
  const url = normalizeCmsImageUrl(record.image_url);
  if (!url) return null;

  return {
    id: record.id,
    title: record.value || record.key || "Image",
    url,
    alt: record.value_long,
    created_date: record.created_date,
  } as MediaItem;
}

function dedupeMediaItems(items: MediaItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

export async function GET() {
  const base44Items = await base44List<SiteContent>("SiteContent", {
    q: { page: "media", section: "library" },
    limit: 100,
    sort_by: "-created_date",
  })
    .then(({ records }) => records.map(toMediaItem).filter((item): item is MediaItem => Boolean(item)))
    .catch(() => []);

  return NextResponse.json({
    items: dedupeMediaItems([
      ...base44Items,
      ...localCmsMediaItems(),
    ]),
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    title?: string;
    url?: string;
    alt?: string;
  };

  const url = normalizeCmsImageUrl(body.url);
  if (!url) {
    return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
  }

  const payload: Partial<SiteContent> = {
    page: "media",
    locale: "en",
    section: "library",
    key: `image-${Date.now()}`,
    value: body.title || "Uploaded image",
    value_long: body.alt || "",
    image_url: url,
    notes: "CMS media library",
  };

  const record = await base44Fetch<SiteContent>("/entities/SiteContent", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return NextResponse.json({ item: toMediaItem(record) });
}
