import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "@/lib/locale";
import { getPuckPageData, savePuckPageData } from "@/lib/services/puck-page";
import type { Locale } from "@/types/common";
import type { PuckPageData } from "@/types/puck";

function readParams(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page") || "home";
  const locale = request.nextUrl.searchParams.get("locale") || "en";

  if (!isLocale(locale)) {
    return { error: "Unsupported locale" as const };
  }

  return { page, locale: locale as Locale };
}

export async function GET(request: NextRequest) {
  const params = readParams(request);
  if ("error" in params) {
    return NextResponse.json({ error: params.error }, { status: 400 });
  }

  const data = await getPuckPageData(params.page, params.locale);
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  const params = readParams(request);
  if ("error" in params) {
    return NextResponse.json({ error: params.error }, { status: 400 });
  }

  const body = (await request.json()) as { data?: PuckPageData };
  if (!body.data || !Array.isArray(body.data.content)) {
    return NextResponse.json({ error: "Invalid Puck payload" }, { status: 400 });
  }

  await savePuckPageData(params.page, params.locale, body.data);
  return NextResponse.json({ ok: true });
}
