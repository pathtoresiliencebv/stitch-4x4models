import { describe, expect, it } from "vitest";
import { normalizeListResponse } from "@/lib/base44-api";

describe("normalizeListResponse", () => {
  it("normalizes the live CMS array response", () => {
    const result = normalizeListResponse<{ id: string }>([{ id: "one" }, { id: "two" }]);

    expect(result.records).toEqual([{ id: "one" }, { id: "two" }]);
    expect(result.total).toBe(2);
  });

  it("normalizes an empty response shape", () => {
    expect(normalizeListResponse(null)).toEqual({ records: [], total: 0 });
  });

  it("keeps legacy records response compatibility", () => {
    const result = normalizeListResponse<{ id: string }>({
      records: [{ id: "one" }],
      total: 12,
    });

    expect(result.records).toEqual([{ id: "one" }]);
    expect(result.total).toBe(12);
  });
});
