import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const root = process.cwd();
const manifestPath = path.join(root, "src/data/live-mirror/manifest.json");
const publicDir = path.join(root, "public");
const allowedHostnames = new Set(["4x4models.com", "www.4x4models.com"]);
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const baseUrl = args.get("base") || "https://www.4x4models.com";
const dryRun = args.get("dry-run") !== "false";
const limit = Number(args.get("limit") || "0");

function isAllowedUrl(value) {
  try {
    const url = new URL(value, baseUrl);
    return allowedHostnames.has(url.hostname) && url.pathname.startsWith("/images/");
  } catch {
    return false;
  }
}

function decodeNextImageUrl(value) {
  try {
    const url = new URL(value, baseUrl);
    const nested = url.searchParams.get("url");
    return nested ? decodeURIComponent(nested) : value;
  } catch {
    return value;
  }
}

function extractImageUrls(html) {
  const urls = new Set();
  const patterns = [
    /src="([^"]+)"/g,
    /url\(["']?([^"')]+)["']?\)/g,
    /\/_next\/image\?url=([^&"'\s)]+)[^"'\s)]*/g,
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const raw = match[0].startsWith("/_next/image") ? match[0] : match[1];
      const candidate = decodeNextImageUrl(raw.replaceAll("&amp;", "&"));
      if (isAllowedUrl(candidate)) urls.add(new URL(candidate, baseUrl).toString());
    }
  }

  return urls;
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} failed (${response.status})`);
  return response.text();
}

async function fetchImage(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} failed (${response.status})`);
  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const routes = Object.keys(manifest.pages || {});
  const imageUrls = new Set();

  for (const route of routes) {
    const html = await fetchText(new URL(route, baseUrl).toString());
    for (const url of extractImageUrls(html)) imageUrls.add(url);
    if (limit && imageUrls.size >= limit) break;
  }

  const seenHashes = new Set();
  const downloaded = [];
  for (const url of imageUrls) {
    if (limit && downloaded.length >= limit) break;
    const parsed = new URL(url);
    const target = path.join(publicDir, parsed.pathname.replace(/^\//, ""));

    if (dryRun) {
      downloaded.push(parsed.pathname);
      continue;
    }

    const image = await fetchImage(url);
    const hash = createHash("sha256").update(image).digest("hex");
    if (seenHashes.has(hash)) continue;
    seenHashes.add(hash);

    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, image);
    downloaded.push(parsed.pathname);
  }

  console.log(JSON.stringify({
    baseUrl,
    dryRun,
    discovered: imageUrls.size,
    saved: downloaded.length,
    images: downloaded.sort(),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
