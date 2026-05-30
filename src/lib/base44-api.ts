import "server-only";
import type { ApiListResponse } from "@/types/common";

const BASE44_BASE_URL =
  process.env.NEXT_PUBLIC_BASE44_API_URL ||
  "https://stimulating-growth-suite-ai.base44.app/api";

function getApiKey() {
  const apiKey = process.env.BASE44_API_KEY;
  if (!apiKey) {
    throw new Error("BASE44_API_KEY is not configured");
  }
  return apiKey;
}

function hasApiKey() {
  return Boolean(process.env.BASE44_API_KEY);
}

export function normalizeListResponse<T>(payload: unknown): ApiListResponse<T> {
  if (Array.isArray(payload)) {
    return { records: payload as T[], total: payload.length };
  }

  if (payload && typeof payload === "object" && "records" in payload) {
    const response = payload as { records?: unknown; total?: unknown };
    const records = Array.isArray(response.records)
      ? (response.records as T[])
      : [];
    const total =
      typeof response.total === "number"
        ? response.total
        : records.length;

    return { records, total };
  }

  return { records: [], total: 0 };
}

export function buildEntityQuery(
  entity: string,
  params: {
    q?: Record<string, unknown>;
    limit?: number;
    skip?: number;
    sort_by?: string;
  } = {}
) {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set("q", JSON.stringify(params.q));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.skip) searchParams.set("skip", String(params.skip));
  if (params.sort_by) searchParams.set("sort_by", params.sort_by);

  const suffix = searchParams.toString();
  return `/entities/${entity}${suffix ? `?${suffix}` : ""}`;
}

export async function base44Fetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE44_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      api_key: getApiKey(),
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "API Error" }));
    throw new Error(error.message || `CMS request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function base44List<T>(
  entity: string,
  params: Parameters<typeof buildEntityQuery>[1] = {}
): Promise<ApiListResponse<T>> {
  if (!hasApiKey()) {
    return { records: [], total: 0 };
  }

  const payload = await base44Fetch<unknown>(buildEntityQuery(entity, params));
  return normalizeListResponse<T>(payload);
}
