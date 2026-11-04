/** `arch-house-1` -> the bundled stock photo; a path or URL (an upload) is used as is. */
export const photoSrc = (v: string) => (!v ? "" : v.startsWith("/") || v.startsWith("http") ? v : `/photos/${v}.jpg`);

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";

export const placeMapUrl = (name: string, country: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${country}`)}`;

/** Stable address of a travel post; posts saved before slugs existed get one from their title. */
export const postSlug = (p: { slug?: string; title: string }) => p.slug || slugify(p.title);

interface Cover { photo?: string; photos?: string[]; video?: string; videoPoster?: string; videoThumb?: boolean }
const videoLeads = (i: Cover) => !!(i.videoThumb && i.video && i.videoPoster);

/** An item's thumbnail: its photo, or the video's first picture when the admin chose that. */
export const coverOf = (i: Cover) => (videoLeads(i) ? i.videoPoster! : i.photo ?? "");

/** The photos on an item's own page. When the video took over as thumbnail, the thumbnail photo counts as a photo. */
export const galleryOf = (i: Cover) => {
  const extra = (i.photos ?? []).filter(Boolean);
  return videoLeads(i) && i.photo ? [i.photo, ...extra] : extra;
};

/** Address of a photography album (a section of the gallery). */
export const albumSlug = (name: string) => slugify(name);
