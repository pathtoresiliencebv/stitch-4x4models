import { NextResponse, type NextRequest } from "next/server";
import { AUTH_ACCESS_COOKIE, AUTH_REFRESH_COOKIE, AUTH_RETURN_TO_COOKIE } from "@/lib/auth/constants";

export const dynamic = "force-dynamic";

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(AUTH_ACCESS_COOKIE);
  response.cookies.delete(AUTH_REFRESH_COOKIE);
  response.cookies.delete(AUTH_RETURN_TO_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  return clearAuthCookies(NextResponse.redirect(new URL("/", request.url)));
}

export async function POST() {
  return clearAuthCookies(NextResponse.json({ success: true }));
}
