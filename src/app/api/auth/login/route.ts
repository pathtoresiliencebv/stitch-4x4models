import { NextResponse, type NextRequest } from "next/server";
import { AUTH_RETURN_TO_COOKIE } from "@/lib/auth/constants";
import {
  authCookieOptions,
  getCasdoorCallbackUrl,
  getCasdoorSdk,
  isCasdoorConfigured,
  sanitizeReturnTo,
} from "@/lib/auth/casdoor";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const returnTo = sanitizeReturnTo(request.nextUrl.searchParams.get("returnTo"));

  if (!isCasdoorConfigured()) {
    return NextResponse.redirect(new URL(`/login?auth=not-configured&returnTo=${encodeURIComponent(returnTo)}`, request.url));
  }

  const signInUrl = getCasdoorSdk().getSignInUrl(getCasdoorCallbackUrl(request.url));
  const response = NextResponse.redirect(signInUrl);
  response.cookies.set(AUTH_RETURN_TO_COOKIE, returnTo, authCookieOptions(60 * 10));
  return response;
}
