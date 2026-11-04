import type { MetadataRoute } from "next";
import { albumSlug, postSlug } from "@/lib/media";
import { SITE_URL } from "@/lib/seo";
import { getContent } from "@/lib/server/content";

/** Every public page, including each project, place, travel post, album and initiative added in the admin. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getContent();
  const now = new Date();
  const url = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") =>
    ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority });

  return [
    url("", 1, "weekly"),
    url("/about", 0.7),
    url("/architecture", 0.9, "weekly"),
    url("/photography", 0.9, "weekly"),
    url("/content-creation", 0.8, "weekly"),
    url("/travel", 0.9, "weekly"),
    url("/author", 0.8),
    url("/social-work", 0.8),
    url("/privacy", 0.2, "yearly"),
    ...c.projects.map((p) => url(`/architecture/${p.slug}`, 0.7)),
    ...c.categories.filter((k) => c.gallery.some((g) => g.category === k.name)).map((k) => url(`/photography/${albumSlug(k.name)}`, 0.6)),
    ...c.albums.filter((a) => a.photos.length > 0).map((a) => url(`/album/${a.slug}`, 0.6)),
    ...c.places.map((p) => url(`/travel/${p.slug}`, 0.7)),
    ...c.placePosts.filter((p) => c.places.some((x) => x.slug === p.place)).map((p) => url(`/travel/${p.place}/${postSlug(p)}`, 0.6)),
    ...c.initiatives.map((i) => url(`/social-work/${i.slug}`, 0.6)),
  ];
}
