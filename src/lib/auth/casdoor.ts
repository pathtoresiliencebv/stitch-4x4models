import "server-only";
import { cookies } from "next/headers";
import { SDK } from "casdoor-nodejs-sdk";
import type { Config } from "casdoor-nodejs-sdk/lib/cjs/config";
import type { User as CasdoorUser } from "casdoor-nodejs-sdk/lib/cjs/user";
import { AUTH_ACCESS_COOKIE, AUTH_REFRESH_COOKIE } from "@/lib/auth/constants";

export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "user";
  avatar?: string;
  name?: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
};

const requiredCasdoorEnv = [
  "CASDOOR_ENDPOINT",
  "CASDOOR_CLIENT_ID",
  "CASDOOR_CLIENT_SECRET",
  "CASDOOR_CERTIFICATE",
  "CASDOOR_ORG_NAME",
  "CASDOOR_APP_NAME",
] as const;

export function isCasdoorConfigured() {
  return requiredCasdoorEnv.every((key) => Boolean(process.env[key]));
}

export function getSiteOrigin(requestUrl?: string) {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (requestUrl) {
    return new URL(requestUrl).origin;
  }

  return "https://www.4x4models.com";
}

export function getCasdoorCallbackUrl(requestUrl?: string) {
  return `${getSiteOrigin(requestUrl)}/api/auth/callback`;
}

export function getCasdoorSdk() {
  if (!isCasdoorConfigured()) {
    throw new Error("Casdoor is not configured");
  }

  const config: Config = {
    endpoint: process.env.CASDOOR_ENDPOINT || "",
    clientId: process.env.CASDOOR_CLIENT_ID || "",
    clientSecret: process.env.CASDOOR_CLIENT_SECRET || "",
    certificate: (process.env.CASDOOR_CERTIFICATE || "").replace(/\\n/g, "\n"),
    orgName: process.env.CASDOOR_ORG_NAME || "",
    appName: process.env.CASDOOR_APP_NAME || "",
  };

  return new SDK(config);
}

export function toAuthUser(user: CasdoorUser): AuthUser {
  const displayName = user.displayName || [user.firstName, user.lastName].filter(Boolean).join(" ");
  const fullName = displayName || user.name || user.email || "4x4models gebruiker";

  return {
    id: user.id || user.name || user.email || "casdoor-user",
    email: user.email || "",
    full_name: fullName,
    role: user.isAdmin ? "admin" : "user",
    avatar: user.avatar || user.permanentAvatar,
    name: user.name,
  };
}

export function parseAuthToken(accessToken: string) {
  return toAuthUser(getCasdoorSdk().parseJwtToken(accessToken));
}

export async function getAuthSession(): Promise<AuthSession | null> {
  if (!isCasdoorConfigured()) return null;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  try {
    return {
      accessToken,
      refreshToken: cookieStore.get(AUTH_REFRESH_COOKIE)?.value,
      user: parseAuthToken(accessToken),
    };
  } catch {
    return null;
  }
}

export function sanitizeReturnTo(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.startsWith("/api/auth/")) return "/";
  return value;
}

export function authCookieOptions(maxAge = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
