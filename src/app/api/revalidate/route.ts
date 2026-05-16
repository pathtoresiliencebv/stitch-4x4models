import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const payload = await req.json().catch(() => ({}));

  if (secret && payload.secret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = payload.type as string | undefined;
  const slug = payload.slug as string | undefined;

  revalidatePath("/");
  if (type === "product" && slug) {
    revalidatePath(`/producten/${slug}`);
    revalidatePath("/producten");
  } else if (type === "category" && slug) {
    revalidatePath(`/collecties/${slug}`);
    revalidatePath("/collecties");
  } else if (type === "blog" && slug) {
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/blog");
  } else if (payload.path) {
    revalidatePath(payload.path);
  } else {
    revalidatePath("/producten");
    revalidatePath("/collecties");
    revalidatePath("/blog");
  }

  return NextResponse.json({ revalidated: true });
}
