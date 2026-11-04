import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { coverOf } from "@/lib/media";
import { getContent } from "@/lib/server/content";
import CtaBand from "@/components/ui/CtaBand";
import Hl from "@/components/ui/Hl";
import MediaBlock from "@/components/ui/MediaBlock";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getContent()).projects.find((x) => x.slug === slug);
  return { title: p ? p.title : "Architecture" };
}

/** One project: the main photo, the details, then every extra photo and the short video. */
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = (await getContent()).projects.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <>
      <PageHero index="01" title={p.title} intro={p.summary} />
      <div className="group h-[clamp(200px,36vw,480px)]"><Photo name={coverOf(p)} alt={p.title} className="h-full" /></div>
      <Section>
        <Reveal>
          <div className="label text-accent-d">{p.type} · {p.location} · {p.year}</div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-g600"><Hl>{p.summary}</Hl></p>
        </Reveal>
        <div className="mt-10"><MediaBlock media={p} title={p.title} /></div>
        <Link href="/architecture" data-link className="label mt-10 inline-block text-g600 transition-colors hover:text-accent-d">← All projects</Link>
      </Section>
      <CtaBand text="Planning a house, a library or a small public space? Tell me about it." />
    </>
  );
}
