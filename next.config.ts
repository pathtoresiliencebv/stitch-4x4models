import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
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
