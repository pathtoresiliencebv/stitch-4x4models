import { NextRequest, NextResponse } from "next/server";
import { base44Fetch, base44List } from "@/lib/base44-api";
import type { SiteContent } from "@/types/common";

type MediaItem = {
  id: string;
  title: string;
  url: string;
  alt?: string | null;
  created_date?: string;
};

function toMediaItem(record: SiteContent): MediaItem | null {
  if (!record.image_url) return null;

  return {
    id: record.id,
    title: record.value || record.key || "Image",
    url: record.image_url,
    alt: record.value_long,
    created_date: record.created_date,
  } as MediaItem;
}

export async function GET() {
  const { records } = await base44List<SiteContent>("SiteContent", {
    q: { page: "media", section: "library" },
    limit: 100,
    sort_by: "-created_date",
  });

  return NextResponse.json({
    items: records.map(toMediaItem).filter(Boolean),
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    title?: string;
    url?: string;
    alt?: string;
  };

  if (!body.url) {
    return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
  }

  const payload: Partial<SiteContent> = {
    page: "media",
    locale: "en",
    section: "library",
    key: `image-${Date.now()}`,
    value: body.title || "Uploaded image",
    value_long: body.alt || "",
    image_url: body.url,
    notes: "CMS media library",
  };

  const record = await base44Fetch<SiteContent>("/entities/SiteContent", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return NextResponse.json({ item: toMediaItem(record) });
}
