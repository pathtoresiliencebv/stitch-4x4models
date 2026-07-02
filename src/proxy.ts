import { NextResponse, type NextRequest } from "next/server";
import { AUTH_ACCESS_COOKIE } from "@/lib/auth/constants";

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

  const target = request.nextUrl.clone();
  target.pathname = pathname === "/" ? "/live-mirror" : `/live-mirror${pathname}`;
  return NextResponse.rewrite(target);
}
