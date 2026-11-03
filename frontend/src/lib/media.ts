/** `arch-house-1` -> the bundled stock photo; a path or URL (an upload) is used as is. */
export const photoSrc = (v: string) => (!v ? "" : v.startsWith("/") || v.startsWith("http") ? v : `/photos/${v}.jpg`);

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";

export const placeMapUrl = (name: string, country: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${country}`)}`;

/** Stable address of a travel post; posts saved before slugs existed get one from their title. */
export const postSlug = (p: { slug?: string; title: string }) => p.slug || slugify(p.title);
