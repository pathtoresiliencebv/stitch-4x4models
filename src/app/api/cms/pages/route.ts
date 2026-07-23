import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/auth/admin-api";
import {
  getCmsEditorPage,
  listCmsEditorPages,
  saveCmsEditorPage,
} from "@/lib/services/cms-editor";
import type { CmsEditorMutation } from "@/types/cms-editor";

export const runtime = "nodejs";

function requestedSlug(request: NextRequest) {
  return request.nextUrl.searchParams.get("slug")?.replace(/^\/+|\/+$/g, "") || "home";
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  const slug = requestedSlug(request);
  const [page, pages] = await Promise.all([
    getCmsEditorPage(slug),
    listCmsEditorPages(),
  ]);

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json({
    page,
    pages: pages.map((record) => ({
      id: record.id,
      slug: record.slug,
      title: record.title,
      locale: record.locale,
      status: record.status,
      seo_score: record.seo_score,
      updated_date: record.updated_date,
    })),
  });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const body = (await request.json()) as CmsEditorMutation;
    if (!body?.page?.id || !body.page.slug || !Array.isArray(body.sections)) {
      return NextResponse.json({ error: "Invalid CMS page payload" }, { status: 400 });
    }

    const result = await saveCmsEditorPage(body);
    const slug = body.page.slug.replace(/^\/+|\/+$/g, "") || "home";
    revalidatePath(slug === "home" ? "/" : `/${slug}`);
    revalidatePath("/admin");
    revalidatePath("/admin/content");

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save CMS page";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
