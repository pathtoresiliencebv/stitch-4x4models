import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/auth/admin-api";
import { base44Fetch, base44List } from "@/lib/base44-api";
import { localCmsMediaItems, normalizeCmsImageUrl } from "@/lib/cms-images";
import type { WebshopPhoto } from "@/types/base44";
import type { SiteContent } from "@/types/common";

type MediaItem = {
  id: string;
  title: string;
  url: string;
  alt?: string | null;
  source: "base44" | "local";
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
    source: "base44",
    created_date: record.created_date,
  } as MediaItem;
}

function toWebshopPhotoMediaItem(record: WebshopPhoto & { created_date?: string }): MediaItem | null {
  const url = normalizeCmsImageUrl(record.url);
  if (!url) return null;

  return {
    id: `photo:${record.id}`,
    title: record.title || record.alt || "Webshop photo",
    url,
    alt: record.alt,
    source: "base44",
    created_date: record.created_date,
  };
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
  const webshopId = process.env.NEXT_PUBLIC_WEBSHOP_ID;

  const base44Items = await base44List<SiteContent>("SiteContent", {
    q: { page: "media", section: "library" },
    limit: 500,
    sort_by: "-created_date",
  })
    .then(({ records }) => records.map(toMediaItem).filter((item): item is MediaItem => Boolean(item)))
    .catch(() => []);

  const webshopPhotoItems = await base44List<WebshopPhoto & { created_date?: string }>("WebshopPhoto", {
    ...(webshopId ? { q: { webshop_id: webshopId } } : {}),
    limit: 500,
    sort_by: "-created_date",
  })
    .then(({ records }) => records.map(toWebshopPhotoMediaItem).filter((item): item is MediaItem => Boolean(item)))
    .catch(() => []);

  return NextResponse.json({
    items: dedupeMediaItems([
      ...base44Items,
      ...webshopPhotoItems,
      ...localCmsMediaItems(),
    ]),
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

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

  const webshopId = process.env.NEXT_PUBLIC_WEBSHOP_ID;
  if (webshopId) {
    await base44Fetch<WebshopPhoto>("/entities/WebshopPhoto", {
      method: "POST",
      body: JSON.stringify({
        webshop_id: webshopId,
        title: payload.value,
        url,
        alt: payload.value_long || "",
      }),
    }).catch(() => null);
  }

  return NextResponse.json({ item: toMediaItem(record) });
}
