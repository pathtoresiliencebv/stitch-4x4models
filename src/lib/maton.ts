import "server-only";

/**
 * Thin client for the Maton API Gateway (https://api.maton.ai).
 *
 * - Treats MATON_API_KEY as a server-side secret. Never import this module
 *   from a "use client" file or you'll leak the key to the browser bundle.
 * - Supports Google Analytics (Admin + Data) and Google Search Console.
 *   See https://clawhub.ai/byungkyu/skills/api-gateway for the protocol.
 *
 * Usage:
 *   const sites = await matonGet("/google-search-console/webmasters/v3/sites");
 *   await matonSend("PUT", `/google-search-console/webmasters/v3/sites/${u}/sitemaps/${p}`);
 */

const MATON_BASE_URL = process.env.MATON_API_URL || "https://api.maton.ai";

function getApiKey(): string {
  const key = process.env.MATON_API_KEY;
  if (!key) {
    throw new Error(
      "MATON_API_KEY is not configured. Set it in Vercel environment variables (Production + Preview)."
    );
  }
  return key;
}

function getConnectionId(): string | undefined {
  return process.env.MATON_GOOGLE_CONNECTION_ID || undefined;
}

type MatonOptions = {
  /** Optional connection id when multiple Google accounts are linked in Maton. */
  connectionId?: string;
  /** AbortSignal for timeouts. */
  signal?: AbortSignal;
  /** Fetch revalidate hint for Next.js Data Cache (route handlers only). */
  next?: { revalidate?: number; tags?: string[] };
};

async function matonFetch(
  method: string,
  path: string,
  body?: unknown,
  options: MatonOptions = {}
): Promise<Response> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${getApiKey()}`,
    Accept: "application/json",
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const connectionId = options.connectionId ?? getConnectionId();
  if (connectionId) headers["Maton-Connection"] = connectionId;

  const url = `${MATON_BASE_URL}${path}`;
  const init: RequestInit & { next?: MatonOptions["next"] } = {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };
  if (options.signal) init.signal = options.signal;
  if (options.next) (init as { next?: MatonOptions["next"] }).next = options.next;

  return fetch(url, init);
}

export async function matonGet<T = unknown>(path: string, options?: MatonOptions): Promise<T> {
  const res = await matonFetch("GET", path, undefined, options);
  if (!res.ok) await throwMatonError(res, "GET", path);
  return (await res.json()) as T;
}

export async function matonSend<T = unknown>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
  options?: MatonOptions
): Promise<T> {
  const res = await matonFetch(method, path, body, options);
  if (!res.ok) await throwMatonError(res, method, path);
  // Some Maton endpoints return empty bodies (e.g. sitemap submit/delete).
  const text = await res.text();
  return (text ? JSON.parse(text) : ({} as T)) as T;
}

async function throwMatonError(res: Response, method: string, path: string): Promise<never> {
  let detail = "";
  try {
    const data = await res.json();
    detail =
      typeof data === "string"
        ? data
        : data?.error?.message || data?.message || JSON.stringify(data).slice(0, 500);
  } catch {
    detail = await res.text().catch(() => "");
  }
  throw new Error(`Maton ${method} ${path} failed (${res.status}): ${detail || res.statusText}`);
}

/** True when MATON_API_KEY is configured. Used to gate UI hints. */
export function hasMatonKey(): boolean {
  return Boolean(process.env.MATON_API_KEY);
}