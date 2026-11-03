import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // the sample book is read from disk by the book routes, so ship it with them
  outputFileTracingIncludes: { "/api/books/**": ["./private/**"] },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "img.youtube.com" }],
  },
};

export default nextConfig;
