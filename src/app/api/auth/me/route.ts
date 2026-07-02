import { NextResponse } from "next/server";
import { getAuthSession, isCasdoorConfigured } from "@/lib/auth/casdoor";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAuthSession();

  return NextResponse.json({
    configured: isCasdoorConfigured(),
    isAuthenticated: Boolean(session),
    user: session?.user || null,
  });
}
