import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/auth/admin-api";
import { syncSearchConsoleToCms } from "@/lib/services/search-console";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST() {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const result = await syncSearchConsoleToCms();
    revalidatePath("/admin");
    revalidatePath("/admin/seo");
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Search Console sync failed",
    }, { status: 424 });
  }
}
