import Link from "next/link";
import { photoSrc } from "@/lib/media";
import { getContent } from "@/lib/server/content";
import type { Sector } from "@/types";
import Reveal from "./Reveal";
import Section from "./Section";
import SectionHead from "./SectionHead";

/** The photo albums of one sector: each a small stack of its own photos, opening the full album. Nothing is shown until an album has photos. */
export default async function Albums({ sector }: { sector: Sector }) {
  const albums = (await getContent()).albums.filter((a) => a.sector === sector && a.photos.length > 0);
  if (!albums.length) return null;
  return (
    <Section className="bg-g200">
      <SectionHead index="★" kicker="Photo albums" title="Albums" aside={String(albums.length).padStart(2, "0")} />
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((a, i) => {
          const [cover, second, third] = a.photos;
          return (
            <Reveal key={a.slug} delay={(i % 3) * 0.07}>
              <Link href={`/album/${a.slug}`} data-link className="group block">
                <div className="relative aspect-[4/3]">
                  {third && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoSrc(third.photo)} alt="" loading="lazy" className="absolute inset-0 h-full w-full rotate-[5deg] rounded-2xl border-4 border-paper object-cover shadow-md transition-transform duration-500 group-hover:rotate-[8deg] group-hover:translate-x-2" />
                  )}
                  {second && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoSrc(second.photo)} alt="" loading="lazy" className="absolute inset-0 h-full w-full -rotate-[3deg] rounded-2xl border-4 border-paper object-cover shadow-md transition-transform duration-500 group-hover:-rotate-[6deg] group-hover:-translate-x-2" />
                  )}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl border-4 border-paper bg-g200 shadow-[0_14px_36px_rgba(77,79,83,0.22)] transition-transform duration-500 group-hover:-translate-y-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoSrc(cover.photo)} alt={a.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  </div>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-[clamp(26px,2.6vw,36px)] leading-none text-ink transition-colors group-hover:text-accent-d">{a.name}</h3>
                  <span className="label whitespace-nowrap text-g500">{a.photos.length} photo{a.photos.length === 1 ? "" : "s"}</span>
                </div>
                {a.description && <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-g600">{a.description}</p>}
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
