import type { Metadata } from "next";
import { site } from "@/data/site";

/** The public address of the site. Set NEXT_PUBLIC_SITE_URL when a custom domain is connected. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://architectshakil.com").replace(/\/$/, "");

/** Makes a path absolute: "/a" -> "https://site/a". Full URLs are left alone. */
export const abs = (p: string) => (p.startsWith("http") ? p : `${SITE_URL}${p.startsWith("/") ? "" : "/"}${p}`);

/** Cut a text to a search-result friendly description (about 155 characters), on a word boundary. */
export const clip = (text: string, max = 155) => {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
};

/**
 * Title, description, canonical address, Open Graph and Twitter card for one page.
 * `title` gets the site name added by the layout; `image` is a path or URL (falls back to the generated card at /opengraph-image).
 */
export function pageMeta({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  const desc = clip(description);
  const full = `${title} — ${site.name}`;
  const images = [{ url: abs(image || "/opengraph-image"), alt: title }];
  return {
    title,
    description: desc,
    alternates: { canonical: abs(path) },
    openGraph: { type: "website", url: abs(path), siteName: site.fullName, title: full, description: desc, images },
    twitter: { card: "summary_large_image", title: full, description: desc, images: images.map((i) => i.url) },
  };
}
