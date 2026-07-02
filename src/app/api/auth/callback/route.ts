import { NextResponse, type NextRequest } from "next/server";
import { AUTH_ACCESS_COOKIE, AUTH_REFRESH_COOKIE, AUTH_RETURN_TO_COOKIE } from "@/lib/auth/constants";
import {
  authCookieOptions,
  getCasdoorSdk,
  isCasdoorConfigured,
  sanitizeReturnTo,
  toAuthUser,
} from "@/lib/auth/casdoor";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const returnTo = sanitizeReturnTo(request.cookies.get(AUTH_RETURN_TO_COOKIE)?.value);

  if (!isCasdoorConfigured() || !code) {
    return NextResponse.redirect(new URL(`/login?auth=failed&returnTo=${encodeURIComponent(returnTo)}`, request.url));
  }

  try {
    const sdk = getCasdoorSdk();
    const token = await sdk.getAuthToken(code);
    const user = toAuthUser(sdk.parseJwtToken(token.access_token));

    const response = NextResponse.redirect(new URL(returnTo, request.url));
    response.cookies.set(AUTH_ACCESS_COOKIE, token.access_token, authCookieOptions());
    response.cookies.set(AUTH_REFRESH_COOKIE, token.refresh_token, authCookieOptions(60 * 60 * 24 * 30));
    response.cookies.delete(AUTH_RETURN_TO_COOKIE);
    response.headers.set("x-auth-user", user.role);
    return response;
  } catch {
    return NextResponse.redirect(new URL(`/login?auth=failed&returnTo=${encodeURIComponent(returnTo)}`, request.url));
  }
}
