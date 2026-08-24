import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as cheerio from "cheerio";
import { GET } from "@/app/live-mirror/[[...path]]/route";

const publishedPost = {
  id: "live-blog",
  title: "Automatisch gepubliceerd vanuit Base44",
  slug: "automatisch-gepubliceerd",
  locale: "nl",
  status: "published",
  is_product: false,
  excerpt: "Deze kaart en detailpagina komen rechtstreeks uit BlogPost.",
  content: "<p>Volledige backendinhoud.</p>",
  featured_image_url: "/images/brands/toyota.jpg",
  published_at: "2026-08-24T12:00:00.000Z",
};

function responseForUrl(url: string) {
  if (url.includes("/entities/BlogPost?")) {
    return new Response(JSON.stringify({ records: [publishedPost] }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ records: [] }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

describe("live mirror BlogPost integration", () => {
  beforeEach(() => {
    process.env.BASE44_API_KEY = "test-key";
    process.env.BASE44_MIRROR_ENABLED = "false";
    vi.stubGlobal("fetch", vi.fn((input: string | URL | Request) => (
      Promise.resolve(responseForUrl(String(input)))
    )));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.BASE44_API_KEY;
    delete process.env.BASE44_MIRROR_ENABLED;
  });

  it("adds a published backend article to the real Dutch homepage", async () => {
    const response = await GET(
      new Request("https://www.4x4models.com/nl"),
      { params: Promise.resolve({ path: ["nl"] }) },
    );
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(response.headers.get("x-cms-blogposts")).toBe("1");
    expect(response.headers.get("x-cms-blog-read")).toBe("ok");
    expect(html).toContain("Automatisch gepubliceerd vanuit Base44");
    expect(html).toContain('href="/nl/blog/automatisch-gepubliceerd"');

    const blogCall = vi.mocked(fetch).mock.calls.find(([input]) => (
      String(input).includes("/entities/BlogPost?")
    ));
    const blogUrl = new URL(String(blogCall?.[0]));
    expect(JSON.parse(blogUrl.searchParams.get("q") || "{}")).toEqual({
      status: "published",
      is_product: false,
    });
  });

  it("serves a new BlogPost slug even when no static mirror file exists", async () => {
    const response = await GET(
      new Request("https://www.4x4models.com/nl/blog/automatisch-gepubliceerd"),
      { params: Promise.resolve({ path: ["nl", "blog", "automatisch-gepubliceerd"] }) },
    );
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(response.headers.get("x-cms-blogposts")).toBe("1");
    expect(html).toContain("cms-blog-detail");
    expect(html).toContain("Volledige backendinhoud.");
  });

  it("updates the public listing count after inserting the backend article", async () => {
    const response = await GET(
      new Request("https://www.4x4models.com/nl/blog"),
      { params: Promise.resolve({ path: ["nl", "blog"] }) },
    );
    const html = await response.text();
    const $ = cheerio.load(html);
    const counter = $("main section").first().find("p").first().text().replace(/\s+/g, " ").trim();
    expect(response.status).toBe(200);
    expect(counter).toBe("18 artikelen");
  });
});
