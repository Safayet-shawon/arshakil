import { albumSlug, coverOf } from "@/lib/media";
import { getContent } from "@/lib/server/content";
import type { Sector } from "@/types";
import FeaturedCarousel, { type Slide } from "./FeaturedCarousel";

/** The carousel at the top of a section's page: everything of that section the admin ticked "Section". Nothing is drawn when nothing is. */
export default async function SectionFeatured({ sector }: { sector: Sector }) {
  const c = await getContent();
  let slides: Slide[] = [];
  switch (sector) {
    case "architecture":
      slides = c.projects.filter((p) => p.featuredSection).map((p) => ({ title: p.title, kicker: `${p.type} · ${p.location}`, href: `/architecture/${p.slug}`, photo: coverOf(p) }));
      break;
    case "travel":
      slides = c.places.filter((p) => p.featuredSection).map((p) => ({ title: p.name, kicker: p.region === "abroad" ? `Abroad · ${p.country}` : "Bangladesh", href: `/travel/${p.slug}`, photo: coverOf(p) }));
      break;
    case "author":
      slides = c.books.filter((b) => b.featuredSection).map((b) => ({ title: b.title, kicker: `Book · ${b.language}`, href: `/author#${b.slug}`, photo: b.thumb }));
      break;
    case "social-work":
      slides = c.initiatives.filter((n) => n.featuredSection).map((n) => ({ title: n.title, kicker: n.area, href: `/social-work/${n.slug}`, photo: coverOf(n) }));
      break;
    case "content-creation":
      slides = c.videos.filter((v) => v.featuredSection).map((v) => ({
        title: v.title, kicker: v.group, href: v.youtubeId ? `https://www.youtube.com/watch?v=${v.youtubeId}` : "/content-creation", external: !!v.youtubeId,
        photo: v.thumb || (v.youtubeId ? `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg` : ""),
      }));
      break;
  }
  if (!slides.length) return null;
  return <FeaturedCarousel slides={slides} label="Featured" />;
}

/** The photography page's version: photos ticked "Section" open their album. */
export async function PhotoFeatured() {
  const c = await getContent();
  const slides = c.gallery.filter((g) => g.featuredSection).map((g) => ({ title: g.title, kicker: g.category, href: `/photography/${albumSlug(g.category)}`, photo: g.photo }));
  if (!slides.length) return null;
  return <FeaturedCarousel slides={slides} label="Featured" />;
}
