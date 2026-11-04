import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBand from "@/components/ui/CtaBand";
import Gallery from "@/components/ui/Gallery";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { albumSlug, photoSrc } from "@/lib/media";
import { getContent } from "@/lib/server/content";

type Props = { params: Promise<{ album: string }> };

async function find({ params }: Props) {
  const { album } = await params;
  const c = await getContent();
  const cat = c.categories.find((x) => albumSlug(x.name) === album);
  return { cat, items: cat ? c.gallery.filter((g) => g.category === cat.name) : [] };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { cat, items } = await find(props);
  if (!cat) return { title: "Photography" };
  const { album } = await props.params;
  return pageMeta({ title: `${cat.name} photography`, description: `${cat.name} photographs by Shakil: ${items.length} frame${items.length === 1 ? "" : "s"}, each viewable large.`, path: `/photography/${album}`, image: items[0] ? photoSrc(items[0].photo) : undefined });
}

/** Every frame of one album. */
export default async function AlbumPage(props: Props) {
  const { cat, items } = await find(props);
  if (!cat) notFound();
  return (
    <>
      <PageHero index="02" title={cat.name} intro={`${items.length} photo${items.length === 1 ? "" : "s"}. Tap a frame to view it large.`} />
      <Section className="bg-ink">
        {items.length ? <Gallery items={items} layout="masonry" /> : <p className="text-sm text-g300">No photos in this album yet.</p>}
        <Link href="/photography" data-link className="label mt-10 inline-block text-accent transition-colors hover:text-g50">← All albums</Link>
      </Section>
      <CtaBand text="Need architectural photography for a building, a studio or a publication? Tell me about it." />
    </>
  );
}
