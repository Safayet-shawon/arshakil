import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBand from "@/components/ui/CtaBand";
import Gallery from "@/components/ui/Gallery";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { SECTORS, photoSrc } from "@/lib/media";
import { getContent } from "@/lib/server/content";

type Props = { params: Promise<{ slug: string }> };

async function find({ params }: Props) {
  const { slug } = await params;
  return (await getContent()).albums.find((a) => a.slug === slug);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const a = await find(props);
  if (!a) return { title: "Album" };
  const { slug } = await props.params;
  return pageMeta({ title: a.name, description: a.description || `${a.name}: a photo album with ${a.photos.length} photo${a.photos.length === 1 ? "" : "s"} by Shakil.`, path: `/album/${slug}`, image: a.photos[0] ? photoSrc(a.photos[0].photo) : undefined });
}

/** Every photo of one album, with the same large viewer as the photography page. */
export default async function AlbumPage(props: Props) {
  const a = await find(props);
  if (!a) notFound();
  const sector = SECTORS.find((s) => s.key === a.sector);
  const items = a.photos.map((p) => ({ photo: p.photo, title: p.title || a.name, description: p.description, category: a.name }));
  return (
    <>
      <PageHero index="★" title={a.name} intro={a.description || `${items.length} photo${items.length === 1 ? "" : "s"}. Tap a frame to view it large.`} />
      <Section className="bg-ink">
        {items.length ? <Gallery items={items} layout="masonry" /> : <p className="text-sm text-g300">No photos in this album yet.</p>}
        {sector && <Link href={sector.href} data-link className="label mt-10 inline-block text-accent transition-colors hover:text-g50">← Back to {sector.label}</Link>}
      </Section>
      <CtaBand text="Like what you see? Let's work on something together." />
    </>
  );
}
