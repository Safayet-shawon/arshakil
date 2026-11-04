import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { coverOf, photoSrc } from "@/lib/media";
import { getContent } from "@/lib/server/content";
import { ButtonLink } from "@/components/ui/Button";
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
  const n = (await getContent()).initiatives.find((i) => i.slug === slug);
  return n ? pageMeta({ title: n.title, description: `${n.blurb} ${n.points.join(". ")}`, path: `/social-work/${slug}`, image: photoSrc(coverOf(n)) }) : { title: "Social Work" };
}

export default async function InitiativePage({ params }: Props) {
  const { slug } = await params;
  const n = (await getContent()).initiatives.find((i) => i.slug === slug);
  if (!n) notFound();

  return (
    <>
      <PageHero index="06" title={n.title} intro={n.blurb} />
      <div className="group h-[clamp(200px,36vw,480px)]"><Photo name={coverOf(n)} alt={n.title} className="h-full" /></div>
      <Section>
        <Reveal>
          <div className="label text-accent-d">{n.area}</div>
          <h2 className="font-display mt-2 text-[clamp(30px,4vw,56px)] leading-[0.95] text-ink">What this initiative does</h2>
          <ul className="mt-6 grid max-w-2xl gap-3 text-sm leading-relaxed text-g600">
            {n.points.map((p) => <li key={p}><span className="text-accent">— </span><Hl>{p}</Hl></li>)}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/#contact">Get involved</ButtonLink>
            <Link href="/social-work" data-link className="label self-center text-g600 transition-colors hover:text-accent-d">← All initiatives</Link>
          </div>
        </Reveal>
        <div className="mt-10"><MediaBlock media={n} title={n.title} /></div>
      </Section>
      <CtaBand text="Want to support or partner on this? Tell me about it." />
    </>
  );
}
