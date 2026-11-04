import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/ui/CtaBand";
import Gallery from "@/components/ui/Gallery";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { albumSlug, photoSrc } from "@/lib/media";
import { getContent } from "@/lib/server/content";

export const metadata: Metadata = pageMeta({ title: "Architectural Photography", description: "Architectural photography by Shakil: buildings, streets, portraits and travel, in albums you can browse and view large.", path: "/photography" });

/** The gallery as albums: a cover for each, then the first few frames of every album with a link to see them all. */
export default async function PhotographyPage() {
  const { gallery, categories } = await getContent();
  const albums = categories
    .map((c) => ({ name: c.name, slug: albumSlug(c.name), items: gallery.filter((g) => g.category === c.name) }))
    .filter((a) => a.items.length > 0);

  return (
    <>
      <PageHero index="02" title="Architectural Photography" intro="Buildings, light and the people inside them, one frame at a time. Open an album to see every frame." />

      <Section>
        <SectionHead index="01" kicker="The albums" title="Browse by album" aside={String(albums.length).padStart(2, "0")} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {albums.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 4) * 0.06}>
              <Link href={`/photography/${a.slug}`} data-link className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-g200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoSrc(a.items[0].photo)} alt={`${a.name} photography album cover`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="font-display block text-[clamp(26px,3vw,38px)] leading-none text-g50">{a.name}</span>
                  <span className="label mt-1 block text-accent">{a.items.length} photo{a.items.length === 1 ? "" : "s"}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-ink">
        <SectionHead index="02" kicker="A taste of each" title="Frames" tone="dark" aside={String(gallery.length).padStart(2, "0")} />
        <div className="grid gap-16">
          {albums.map((a) => (
            <div key={a.slug} id={a.slug}>
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/15 pb-3">
                <h3 className="font-display text-[clamp(32px,4.4vw,60px)] leading-none text-g50">{a.name}</h3>
                <Link href={`/photography/${a.slug}`} data-link className="label whitespace-nowrap text-accent transition-colors hover:text-g50">See all {a.items.length} →</Link>
              </div>
              <Gallery items={a.items.slice(0, 6)} layout="mosaic" />
              {a.items.length > 6 && (
                <Link href={`/photography/${a.slug}`} data-link className="label mt-5 inline-block rounded-full border border-white/25 px-5 py-2.5 text-g300 transition-colors hover:border-accent hover:text-accent">
                  See all {a.items.length} photos in {a.name} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </Section>
      <CtaBand text="Need architectural photography for a building, a studio or a publication? Tell me about it." />
    </>
  );
}
