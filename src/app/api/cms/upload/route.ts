import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@base44/sdk";

export const runtime = "nodejs";

const APP_ID = process.env.NEXT_PUBLIC_BASE44_APP_ID || "699871557dfcaafa02868052";

async function withTimeout<T>(promise: Promise<T>, ms: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Upload timed out")), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file selected" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are supported" }, { status: 400 });
  }

  const serviceToken = process.env.BASE44_API_KEY;
  if (!serviceToken) {
    return NextResponse.json({ error: "Upload is not configured" }, { status: 500 });
  }

  try {
    const cms = createClient({ appId: APP_ID, serviceToken });
    const result = await withTimeout(
      cms.asServiceRole.integrations.Core.UploadFile({ file }),
      30000
    );

    return NextResponse.json({ url: result.file_url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
