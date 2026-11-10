import { coverOf } from "./media";
import { videoOf } from "./video";
import type { BestOf, SiteContent } from "@/types";

/** The home page's "Selected work": everything ticked as Featured in the admin. Before anything is, the sample list. */
export function featuredWork(c: SiteContent): BestOf[] {
  const out: BestOf[] = [
    ...c.projects.filter((p) => p.featured).map((p) => ({ category: "Architecture", title: p.title, meta: `${p.type} — ${p.location}`, year: p.year, href: "/architecture", photo: coverOf(p) })),
    ...c.gallery.filter((p) => p.featured).map((p) => ({ category: "Architectural Photography", title: p.title, meta: p.category, year: "", href: "/photography", photo: p.photo })),
    ...c.videos.filter((v) => v.featured).map((v) => ({ category: "Content Creation", title: v.title, meta: v.group, year: "", href: "/content-creation",
      photo: v.thumb || videoOf(v)?.thumb || "" })),
    ...c.places.filter((p) => p.featured).map((p) => ({ category: "Travel", title: p.name, meta: p.region === "abroad" ? `Abroad — ${p.country}` : "Bangladesh", year: "", href: `/travel/${p.slug}`, photo: coverOf(p) })),
    ...c.books.filter((b) => b.featured).map((b) => ({ category: "Author", title: b.title, meta: "Book", year: b.year, href: "/author", photo: b.thumb })),
    ...c.initiatives.filter((n) => n.featured).map((n) => ({ category: "Social Work", title: n.title, meta: n.area, year: "", href: `/social-work/${n.slug}`, photo: coverOf(n) })),
  ];
  return out;
}
