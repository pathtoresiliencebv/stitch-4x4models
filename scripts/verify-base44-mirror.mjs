import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "src/data/live-mirror/manifest.json");
const apiUrl =
  process.env.BASE44_API_URL ||
  process.env.NEXT_PUBLIC_BASE44_API_URL ||
  "https://stimulating-growth-suite-ai.base44.app/api";
const apiKey = process.env.BASE44_API_KEY;
const webshopId = process.env.NEXT_PUBLIC_WEBSHOP_ID || "";

const samples = ["home", "merken/hummer/h1", "amerikaans", "forum", "shop"];

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.records)) return payload.records;
  return [];
}

function routeToSlug(route) {
  return route === "/" ? "home" : route.replace(/^\/+/, "");
}

function contentMode(content = "") {
  if (/<html(?:\s|>)/i.test(content) && /<\/html>/i.test(content)) return "full";
  if (/<(?:main|section|article|div|header|footer|h1|p)(?:\s|>)/i.test(content)) return "fragment";
  return "empty";
}

async function base44Fetch(endpoint) {
  if (!apiKey) throw new Error("BASE44_API_KEY is required for Base44 verification");

  const response = await fetch(`${apiUrl}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      api_key: apiKey,
    },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`${endpoint} failed (${response.status}) ${message}`);
  }

  return response.json();
}

async function listAll(entity, q = {}) {
  const records = [];
  const limit = 100;

  for (let skip = 0; ; skip += limit) {
    const params = new URLSearchParams({
      q: JSON.stringify(q),
      limit: String(limit),
      skip: String(skip),
    });
    const payload = await base44Fetch(`/entities/${entity}?${params}`);
    const batch = normalizeList(payload);
    records.push(...batch);
    if (batch.length < limit) break;
  }

  return records;
}

function duplicates(values) {
  const seen = new Set();
  const duplicated = new Set();

  for (const value of values.filter(Boolean)) {
    if (seen.has(value)) duplicated.add(value);
    seen.add(value);
  }

  return Array.from(duplicated).sort();
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const manifestSlugs = Object.keys(manifest.pages || {}).map(routeToSlug);
  const pageQuery = webshopId ? { webshop_id: webshopId, status: "published" } : { status: "published" };
  const pages = await listAll("WebsitePage", pageQuery);
  const pageSlugs = new Set(pages.map((page) => page.slug).filter(Boolean));

  const samplePages = samples.map((slug) => {
    const page = pages.find((record) => record.slug === slug);
    return {
      slug,
      found: Boolean(page),
      title: page?.title || "",
      mode: contentMode(page?.content),
      contentBytes: page?.content?.length || 0,
    };
  });

  const vehicles = await listAll("Vehicle", webshopId ? { webshop_id: webshopId } : {});
  const missingPageSlugs = manifestSlugs.filter((slug) => !pageSlugs.has(slug)).sort();

  const report = {
    apiUrl,
    webshopScoped: Boolean(webshopId),
    manifestPages: manifestSlugs.length,
    websitePages: pages.length,
    missingPageSlugs,
    samples: samplePages,
    vehicles: vehicles.length,
    duplicateVehicleSlugs: duplicates(vehicles.map((vehicle) => vehicle.slug)),
    fullHtmlPages: pages.filter((page) => contentMode(page.content) === "full").length,
    fragmentPages: pages.filter((page) => contentMode(page.content) === "fragment").length,
    emptyPages: pages.filter((page) => contentMode(page.content) === "empty").length,
  };

  console.log(JSON.stringify(report, null, 2));

  if (missingPageSlugs.length || report.emptyPages || report.duplicateVehicleSlugs.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
