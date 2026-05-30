import { base44List } from "@/lib/base44-api";
import type { Vehicle } from "@/types/vehicle";

export const vehicleService = {
  async list(limit = 100) {
    const published = await base44List<Vehicle>("Vehicle", {
      q: { status: "published" },
      limit,
      sort_by: "sort_order",
    });

    if (published.records.length > 0) return published.records;

    const active = await base44List<Vehicle>("Vehicle", {
      q: { status: "active" },
      limit,
      sort_by: "sort_order",
    });

    return active.records;
  },

  async getBySlug(slug: string) {
    const published = await base44List<Vehicle>("Vehicle", {
      q: { slug, status: "published" },
      limit: 1,
    });

    if (published.records[0]) return published.records[0];

    const anyStatus = await base44List<Vehicle>("Vehicle", {
      q: { slug },
      limit: 1,
    });

    return anyStatus.records[0] || null;
  },
};
