const apiUrl =
  process.env.BASE44_API_URL ||
  process.env.NEXT_PUBLIC_BASE44_API_URL ||
  "https://stimulating-growth-suite-ai.base44.app/api";
const apiKey = process.env.BASE44_API_KEY;
const webshopId = process.env.NEXT_PUBLIC_WEBSHOP_ID || "";
const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || "https://www.4x4models.com";
const write = process.argv.includes("--write");
const onlyRouteArg = process.argv.find((arg) => arg.startsWith("--route="));
const onlyRoute = onlyRouteArg?.split("=").slice(1).join("=").replace(/^\/?/, "/");

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.records)) return payload.records;
  return [];
}

function routeToSlug(route) {
  return route === "/" ? "home" : route.replace(/^\/+/, "").replace(/\/$/, "");
}

function routeFromCanonical(value) {
  if (!value) return undefined;

  try {
    const url = new URL(value, siteOrigin);
    return url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function setAttribute(tag, name, value) {
  if (!value) return tag;
  const escaped = escapeAttribute(value);
  const attributePattern = new RegExp(`\\s${name}="[^"]*"`, "i");

  if (attributePattern.test(tag)) {
    return tag.replace(attributePattern, ` ${name}="${escaped}"`);
  }

  return tag.endsWith("/>")
    ? tag.replace(/\/>$/, ` ${name}="${escaped}"/>`)
    : tag.replace(/>$/, ` ${name}="${escaped}">`);
}

function replaceTagText(html, tag, value) {
  if (!value) return html;
  const pattern = new RegExp(`(<${tag}\\b[^>]*>)[\\s\\S]*?(<\\/${tag}>)`, "i");
  return html.replace(pattern, (_match, open, close) => `${open}${escapeHtml(value)}${close}`);
}

function upsertMeta(html, selector, attribute, value) {
  if (!value) return html;
  const escaped = escapeAttribute(value);
  const metaPattern = new RegExp(`<meta\\b(?=[^>]*${selector})[^>]*>`, "i");

  if (metaPattern.test(html)) {
    return html.replace(metaPattern, (tag) => setAttribute(tag, attribute, value));
  }

  if (!html.includes("</head>")) return html;
  return html.replace("</head>", `<meta ${selector} ${attribute}="${escaped}"/></head>`);
}

function replaceFirstImage(html, url, alt) {
  if (!url) return html;

  return html.replace(/<img\b[^>]*>/i, (tag) => {
    let next = setAttribute(tag, "src", url);
    if (alt) next = setAttribute(next, "alt", alt);
    return next;
  });
}

function applyStructuredFields(html, source) {
  const title = source.seo_title || source.title || source.hero_headline || source.name;
  const h1 = source.hero_headline || source.title || source.name;
  const description = source.meta_description || source.excerpt || source.hero_body;
  const imageUrl = source.hero_image_url || source.featured_image_url;
  const imageAlt = source.hero_image_alt || source.featured_image_alt || h1;

  let next = html;
  next = replaceTagText(next, "title", title);
  next = replaceTagText(next, "h1", h1);
  next = upsertMeta(next, 'name="description"', "content", description);
  next = upsertMeta(next, 'property="og:title"', "content", title);
  next = upsertMeta(next, 'property="og:description"', "content", description);
  next = replaceFirstImage(next, imageUrl, imageAlt);

  return next;
}

async function base44Fetch(endpoint, options = {}) {
  if (!apiKey) throw new Error("BASE44_API_KEY is required for Base44 page sync");

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      api_key: apiKey,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`${endpoint} failed (${response.status}) ${message}`);
  }

  if (response.status === 204) return undefined;
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

async function firstRecord(entity, q) {
  const params = new URLSearchParams({
    q: JSON.stringify(q),
    limit: "1",
  });
  const payload = await base44Fetch(`/entities/${entity}?${params}`);
  return normalizeList(payload)[0];
}

async function updateWebsitePage(page, content) {
  if (!write) return;

  await base44Fetch(`/entities/WebsitePage/${page.id}`, {
    method: "PUT",
    body: JSON.stringify({ ...page, content }),
  });
}

async function syncRecord(entity, record) {
  const route = routeFromCanonical(record.canonical_url);
  if (!route) return { skipped: true, reason: "missing canonical_url" };
  if (onlyRoute && route !== onlyRoute) return { skipped: true, reason: "route filter" };

  const slug = routeToSlug(route);
  const pageQuery = { slug, status: "published" };
  if (webshopId) pageQuery.webshop_id = webshopId;

  const page = await firstRecord("WebsitePage", pageQuery);
  if (!page?.id || !page.content) return { skipped: true, route, reason: "missing WebsitePage" };

  const nextContent = applyStructuredFields(page.content, record);
  if (nextContent === page.content) return { changed: false, route, entity };

  await updateWebsitePage(page, nextContent);
  return { changed: true, route, entity, pageId: page.id };
}

async function main() {
  const scoped = webshopId ? { webshop_id: webshopId } : {};
  const vehicles = await listAll("Vehicle", scoped);
  const posts = await listAll("BlogPost", scoped);
  const results = [];

  for (const vehicle of vehicles) {
    results.push(await syncRecord("Vehicle", vehicle));
  }

  for (const post of posts) {
    results.push(await syncRecord("BlogPost", post));
  }

  const report = {
    mode: write ? "write" : "dry-run",
    apiUrl,
    routeFilter: onlyRoute || null,
    recordsChecked: results.length,
    changed: results.filter((result) => result.changed).length,
    unchanged: results.filter((result) => result.changed === false).length,
    skipped: results.filter((result) => result.skipped).length,
    changes: results.filter((result) => result.changed).slice(0, 25),
  };

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
