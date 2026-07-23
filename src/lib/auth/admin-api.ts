import "server-only";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/casdoor";

export async function requireAdminApiSession() {
  const session = await getAuthSession();

  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "Authentication required" }, { status: 401 }),
    };
  }

  if (session.user.role !== "admin") {
    return {
      session: null,
      response: NextResponse.json({ error: "Administrator access required" }, { status: 403 }),
    };
  }

  return { session, response: null };
}
