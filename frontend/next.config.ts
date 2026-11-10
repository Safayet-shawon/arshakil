import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // the sample book is read from disk by the book routes, so ship it with them
  outputFileTracingIncludes: { "/api/books/**": ["./private/**"] },
  async redirects() {
    const go = (from: string, to: string) => ({ source: from, destination: to, statusCode: 301 as const });
    // one address for the site: the old vercel.app address and www all lead to architectshakil.com
    const host = (h: string) => ({ source: "/:path*", has: [{ type: "host" as const, value: h }], destination: "https://architectshakil.com/:path*", statusCode: 301 as const });
    return [
      host("arshakil.vercel.app"), host("www.architectshakil.com"),
      go("/projects", "/architecture"), go("/projects/:slug", "/architecture/:slug"), go("/portfolio", "/architecture"),
      go("/photos", "/photography"), go("/gallery", "/photography"), go("/photography/albums", "/photography"),
      go("/videos", "/content-creation"), go("/content", "/content-creation"), go("/blog", "/travel"), go("/trips", "/travel"),
      go("/books", "/author"), go("/book", "/author"), go("/social", "/social-work"), go("/volunteer", "/social-work"),
      go("/about-me", "/about"), go("/bio", "/about"), go("/contact", "/#contact"), go("/hire", "/#services"), go("/services", "/#services"),
      go("/privacy-policy", "/privacy"),
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "img.youtube.com" }],
  },
};

export default nextConfig;
