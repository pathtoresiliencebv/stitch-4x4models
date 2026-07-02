import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const liveOrigin = "https://www.4x4models.com";
const sitemapUrl = `${liveOrigin}/sitemap.xml`;
const mirrorRoot = path.join(process.cwd(), "src", "data", "live-mirror");
const pagesRoot = path.join(mirrorRoot, "pages");
const assetsRoot = path.join(process.cwd(), "public", "mirror-next-static");
const publicRoot = path.join(process.cwd(), "public");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizePathname(value) {
  const url = new URL(value.replace("https://4x4models.example", liveOrigin));
  let pathname = decodeURIComponent(url.pathname);
  if (pathname !== "/" && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
  return pathname || "/";
}

function pageKey(pathname) {
  if (pathname === "/") return "__root__.html";
  return `${pathname.slice(1).replaceAll("/", "__")}.html`;
}

function assetPathFromUrl(value) {
  const clean = value
    .replaceAll("&amp;", "&")
    .replaceAll("&#x2F;", "/")
    .replace(/\\+$/g, "")
    .replace(/\/+$/g, "");
  const url = new URL(clean, liveOrigin);
  return url.pathname + url.search;
}

function staticAssetFilePath(assetPath) {
  const url = new URL(assetPath, liveOrigin);
  return path.join(assetsRoot, url.pathname.replace(/^\/_next\/static\//, ""));
}

function publicImageFilePath(assetPath) {
  const url = new URL(assetPath, liveOrigin);
  return path.join(publicRoot, decodeURIComponent(url.pathname.slice(1)));
}

function rewriteHtml(html) {
  return html
    .replace(/<link\b[^>]*\bas=["']script["'][^>]*>/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replaceAll("https://4x4models.example", "https://4x4models.com")
    .replaceAll("http://4x4models.example", "https://4x4models.com")
    .replaceAll('"/_next/static/', '"/mirror-next-static/')
    .replaceAll("'/_next/static/", "'/mirror-next-static/")
    .replaceAll("url(/_next/static/", "url(/mirror-next-static/")
    .replaceAll("&quot;/_next/static/", "&quot;/mirror-next-static/");
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Codex live mirror builder",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.text();
}

async function fetchBytes(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Codex live mirror builder",
      accept: "*/*",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

function collectAssets(html) {
  const staticAssets = new Set();
  const imageAssets = new Set();
  const searchable = html
    .replaceAll("\\/", "/")
    .replaceAll("\\u002F", "/")
    .replaceAll("%2F", "/")
    .replaceAll("%2f", "/");

  const addImageAsset = (value) => {
    if (!value || value.startsWith("data:") || value.startsWith("blob:")) return;

    const decoded = value
      .replaceAll("&amp;", "&")
      .replaceAll("&quot;", '"')
      .replaceAll("&#x27;", "'")
      .replaceAll("&#x2F;", "/")
      .replaceAll("\\/", "/")
      .replaceAll("\\u002F", "/")
      .replaceAll("%2F", "/")
      .replaceAll("%2f", "/");

    try {
      const url = new URL(decoded, liveOrigin);

      if (url.pathname === "/_next/image" && url.searchParams.has("url")) {
        addImageAsset(url.searchParams.get("url"));
        return;
      }

      if ((url.hostname === "4x4models.com" || url.hostname === "www.4x4models.com") && url.pathname.startsWith("/images/")) {
        const pathname = url.pathname
          .replace(/(\.(?:avif|gif|jpe?g|png|svg|webp)).*$/i, "$1")
          .replace(/\/+$/g, "");
        imageAssets.add(pathname);
      }
    } catch {
      // Ignore malformed snippets that only look like URLs.
    }
  };

  for (const match of searchable.matchAll(/["'](\/_next\/static\/[^"']+)["']/g)) {
    staticAssets.add(assetPathFromUrl(match[1]));
  }

  for (const match of searchable.matchAll(/url\((\/_next\/static\/[^)]+)\)/g)) {
    staticAssets.add(assetPathFromUrl(match[1].replaceAll('"', "").replaceAll("'", "")));
  }

  for (const match of searchable.matchAll(/(?:src|href|content)=["']([^"']+)["']/g)) {
    addImageAsset(match[1]);
  }

  for (const match of searchable.matchAll(/srcset=["']([^"']+)["']/g)) {
    for (const candidate of match[1].split(",")) {
      addImageAsset(candidate.trim().split(/\s+/)[0]);
    }
  }

  for (const match of searchable.matchAll(/url\(([^)]+)\)/g)) {
    addImageAsset(match[1].trim().replace(/^["']|["']$/g, ""));
  }

  for (const match of searchable.matchAll(/["'](https?:\/\/(?:www\.)?4x4models\.com\/images\/[^"']+)["']/g)) {
    addImageAsset(match[1]);
  }

  for (const match of searchable.matchAll(/["'](\/images\/[^"']+)["']/g)) {
    addImageAsset(match[1]);
  }

  for (const match of searchable.matchAll(/url=\/images\/([^&"'\\]+)/g)) {
    addImageAsset(`/images/${decodeURIComponent(match[1])}`);
  }

  for (const match of searchable.matchAll(/\/images\/[^\s"'\\)<>{}]+/g)) {
    addImageAsset(match[0]);
  }

  return { staticAssets, imageAssets };
}

async function saveStaticAsset(assetPath) {
  const filePath = staticAssetFilePath(assetPath);
  const bytes = await fetchBytes(new URL(assetPath, liveOrigin));
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, bytes);
  return bytes;
}

async function saveImageAsset(assetPath) {
  const filePath = publicImageFilePath(assetPath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, await fetchBytes(new URL(assetPath, liveOrigin)));
}

async function main() {
  await mkdir(pagesRoot, { recursive: true });
  await mkdir(assetsRoot, { recursive: true });

  const sitemap = await fetchText(sitemapUrl);
  const paths = [
    ...new Set(
      [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
        .map((match) => normalizePathname(match[1]))
        .filter((pathname) => !pathname.startsWith("/api"))
    ),
  ].sort();

  const allStaticAssets = new Set();
  const allImageAssets = new Set();
  const manifest = {};

  for (const [index, pathname] of paths.entries()) {
    const url = new URL(pathname, liveOrigin);
    const html = await fetchText(url);
    const rewritten = rewriteHtml(html);
    const key = pageKey(pathname);
    await writeFile(path.join(pagesRoot, key), rewritten);
    manifest[pathname] = key;

    const { staticAssets, imageAssets } = collectAssets(html);
    staticAssets.forEach((asset) => allStaticAssets.add(asset));
    imageAssets.forEach((asset) => allImageAssets.add(asset));

    console.log(`[page ${index + 1}/${paths.length}] ${pathname}`);
    await sleep(40);
  }

  await writeFile(
    path.join(mirrorRoot, "manifest.json"),
    JSON.stringify(
      {
        mirroredAt: new Date().toISOString(),
        source: liveOrigin,
        pages: manifest,
      },
      null,
      2
    )
  );

  for (const [index, asset] of [...allStaticAssets].sort().entries()) {
    const bytes = await saveStaticAsset(asset);
    const { imageAssets } = collectAssets(bytes.toString("utf8"));
    imageAssets.forEach((imageAsset) => allImageAssets.add(imageAsset));
    console.log(`[static ${index + 1}/${allStaticAssets.size}] ${asset}`);
    await sleep(20);
  }

  for (const [index, asset] of [...allImageAssets].sort().entries()) {
    await saveImageAsset(asset);
    console.log(`[image ${index + 1}/${allImageAssets.size}] ${asset}`);
    await sleep(20);
  }

  console.log(`Mirrored ${paths.length} pages, ${allStaticAssets.size} static assets, ${allImageAssets.size} images.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
