import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

type RevalidatePayload = {
  secret?: string;
  type?: string;
  slug?: string;
  path?: string;
};

export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const payload = (await req.json().catch(() => ({}))) as RevalidatePayload;

  if (secret && payload.secret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = payload.type;
  const slug = payload.slug;

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
