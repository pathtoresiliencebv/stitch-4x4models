import { NextResponse, type NextRequest } from "next/server";
import { AUTH_ACCESS_COOKIE } from "@/lib/auth/constants";
import {
  isLegacyEnglishPath,
  LOCALE_COOKIE,
  preferredLocaleFromAcceptLanguage,
  publicPathForLocale,
  type Locale,
} from "@/lib/i18n-routing";

const passThroughPrefixes = [
  "/live-mirror",
  "/api",
  "/admin",
  "/_next",
  "/mirror-next-static",
  "/images",
  "/favicons",
  "/brand-kit",
];

const passThroughFiles = [
  "/favicon.ico",
  "/mirror-overrides.css",
  "/robots.txt",
  "/sitemap.xml",
];

function localeOverrideFromRequest(request: NextRequest): Locale | undefined {
  const value = request.nextUrl.searchParams.get("lang") || request.nextUrl.searchParams.get("locale");
  return value === "en" || value === "nl" ? value : undefined;
}

function redirectToLocale(request: NextRequest, locale: Locale) {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = publicPathForLocale(request.nextUrl.pathname, locale);
  redirectUrl.searchParams.delete("lang");
  redirectUrl.searchParams.delete("locale");

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}

function shouldRedirectToDutch(request: NextRequest) {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;

  if (cookieLocale === "en") return false;
  if (cookieLocale === "nl") return true;

  return preferredLocaleFromAcceptLanguage(request.headers.get("accept-language")) === "nl";
}

export const config = {
  matcher: [
    "/((?!live-mirror|api|_next|mirror-next-static|images|favicons|brand-kit|favicon\\.ico|mirror-overrides\\.css|robots\\.txt|sitemap\\.xml).*)",
  ],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const hasSession = Boolean(request.cookies.get(AUTH_ACCESS_COOKIE)?.value);
    if (!hasSession) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/api/auth/login";
      loginUrl.search = `?returnTo=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(loginUrl);
    }
  }

  if (
    passThroughFiles.includes(pathname) ||
    passThroughPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  ) {
    return NextResponse.next();
  }

  const localeOverride = localeOverrideFromRequest(request);
  if (localeOverride) {
    return redirectToLocale(request, localeOverride);
  }

  if (isLegacyEnglishPath(pathname)) {
    return redirectToLocale(request, "en");
  }

  if (pathname !== "/nl" && !pathname.startsWith("/nl/") && shouldRedirectToDutch(request)) {
    return redirectToLocale(request, "nl");
  }

  const target = request.nextUrl.clone();
  target.pathname = pathname === "/" ? "/live-mirror" : `/live-mirror${pathname}`;
  const response = NextResponse.rewrite(target);

  if (pathname === "/nl" || pathname.startsWith("/nl/")) {
    response.cookies.set(LOCALE_COOKIE, "nl", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}
