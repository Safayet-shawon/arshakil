import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { placeMapUrl } from "@/lib/media";
import { getContent } from "@/lib/server/content";
import CtaBand from "@/components/ui/CtaBand";
import Hl from "@/components/ui/Hl";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import VideoCard from "@/components/ui/VideoCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getContent()).places.find((x) => x.slug === slug);
  return { title: p ? p.name : "Travel" };
}

/** One place: the overview, then everything posted from it (notes and videos), all managed in the admin panel. */
export default async function PlacePage({ params }: Props) {
  const { slug } = await params;
  const c = await getContent();
  const p = c.places.find((x) => x.slug === slug);
  if (!p) notFound();
  const posts = c.placePosts.filter((x) => x.place === p.slug);

  return (
    <>
      <PageHero index="04" title={p.name} intro={p.summary} />
      <div className="group h-[clamp(200px,36vw,480px)]"><Photo name={p.photo} alt={p.name} className="h-full" /></div>

      <Section>
        <Reveal>
          <div className="label text-accent-d">{p.region === "bangladesh" ? "Bangladesh" : `Abroad · ${p.country}`}</div>
          <h2 className="font-display mt-2 text-[clamp(30px,4vw,56px)] leading-[0.95] text-ink">Things to do</h2>
          <ul className="mt-6 grid max-w-2xl gap-3 text-sm leading-relaxed text-g600">
            {p.ideas.map((x) => <li key={x}><span className="text-accent">— </span><Hl>{x}</Hl></li>)}
          </ul>
          <p className="label mt-6 text-g600">Estimated cost · {p.cost}</p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <a href={placeMapUrl(p.name, p.country)} target="_blank" rel="noreferrer" data-link className="label text-accent-d transition-colors hover:text-ink">Open in Google Maps ↗</a>
            <Link href="/travel" data-link className="label text-g600 transition-colors hover:text-accent-d">← All places</Link>
          </div>
        </Reveal>
      </Section>

      <Section className="bg-g200">
        <SectionHead index="02" kicker="From this place" title="Posts & videos" aside={String(posts.length).padStart(2, "0")} />
        {posts.length === 0 ? (
          <p className="max-w-md text-sm leading-relaxed text-g600">Nothing posted from {p.name} yet. Stories and videos will appear here.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.title + i} delay={i * 0.07}>
                {post.youtubeId ? (
                  <VideoCard video={{ title: post.title, group: p.name, thumb: p.photo, youtubeId: post.youtubeId }} />
                ) : (
                  <article className="h-full rounded-2xl border border-g200 bg-paper p-6">
                    <h3 className="font-display text-2xl text-ink">{post.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-g600"><Hl>{post.text}</Hl></p>
                  </article>
                )}
              </Reveal>
            ))}
          </div>
        )}
      </Section>
      <CtaBand text={`Planning a trip to ${p.name}? Tell me about it.`} />
    </>
  );
}
