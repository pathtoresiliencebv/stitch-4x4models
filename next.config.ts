import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      { source: "/blog", destination: "/en/journal", permanent: true },
      { source: "/blog/:slug", destination: "/en/journal/:slug", permanent: true },
      { source: "/journal", destination: "/en/journal", permanent: true },
      { source: "/journal/:slug", destination: "/en/journal/:slug", permanent: true },
      { source: "/producten", destination: "/en/gear", permanent: true },
      { source: "/producten/:slug", destination: "/en/shop/:slug", permanent: true },
      { source: "/collecties", destination: "/en/gear", permanent: true },
      { source: "/collecties/:slug", destination: "/en/gear/:slug", permanent: true },
      { source: "/tags/:slug", destination: "/en/journal", permanent: true },
      { source: "/gear", destination: "/en/gear", permanent: true },
      { source: "/shop", destination: "/en/shop", permanent: true },
      { source: "/shop/cart", destination: "/en/shop/cart", permanent: true },
      { source: "/shop/checkout", destination: "/en/shop/checkout", permanent: true },
      { source: "/vehicles", destination: "/en/vehicles", permanent: true },
      { source: "/vehicles/:slug", destination: "/en/vehicles/:slug", permanent: true },
      { source: "/winkelwagen", destination: "/en/shop/cart", permanent: true },
      { source: "/checkout", destination: "/en/shop/checkout", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "media.base44.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "stimulating-growth-suite-ai.base44.app",
      },
      {
        protocol: "https",
        hostname: "base44.com",
      },
      {
        protocol: "https",
        hostname: "**.base44.app",
      },
    ],
  },
};

export default nextConfig;
