import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/checkout", "/shop/cart", "/shop/checkout", "/shop/order-confirmed"],
      },
      {
        // Major AI crawlers and search bots
        userAgent: [
          "Googlebot",
          "Googlebot-Image",
          "Googlebot-News",
          "Googlebot-Video",
          "Bingbot",
          "Slurp",
          "DuckDuckBot",
          "Baiduspider",
          "YandexBot",
          "Applebot",
          "GPTBot",
          "PerplexityBot",
          "ClaudeBot",
          "CCBot",
        ],
        allow: "/",
      },
    ],
    sitemap: [
      absoluteUrl("/sitemap.xml"),
      absoluteUrl("/sitemap-0.xml"),
    ],
    host: absoluteUrl("/"),
  };
}