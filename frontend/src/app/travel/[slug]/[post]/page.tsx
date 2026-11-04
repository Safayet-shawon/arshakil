import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { coverOf, photoSrc, postSlug } from "@/lib/media";
import { getContent } from "@/lib/server/content";
import CtaBand from "@/components/ui/CtaBand";
import Hl from "@/components/ui/Hl";
import MediaBlock from "@/components/ui/MediaBlock";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";

type Props = { params: Promise<{ slug: string; post: string }> };

async function find({ params }: Props) {
  const { slug, post } = await params;
  const c = await getContent();
  const place = c.places.find((x) => x.slug === slug);
  const found = c.placePosts.find((x) => x.place === slug && postSlug(x) === post);
  return { place, found };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { place, found } = await find(props);
  if (!found || !place) return { title: "Travel" };
  const { slug, post } = await props.params;
  const text = (found.text || "").replace(/\s+/g, " ").trim();
  const cover = found.photos?.[0] || coverOf(place);
  return pageMeta({ title: found.title, description: found.summary || text || `${found.title}: a travel post from ${place.name}.`, path: `/travel/${slug}/${post}`, image: photoSrc(cover) });
}

/** One travel blog post: written on the site, or an uploaded PDF shown in the page. */
export default async function PostPage(props: Props) {
  const { place, found } = await find(props);
  if (!place || !found) notFound();
  const paragraphs = (found.text || "").split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);

  return (
    <>
      <PageHero index="04" title={found.title} intro={found.summary || place.name} />
      <Section>
        <div className="mx-auto max-w-[760px]">
          <div className="label text-accent-d">{place.region === "bangladesh" ? "Bangladesh" : "Abroad"} · {place.name}</div>
          {found.kind === "pdf" && found.pdf ? (
            <div className="mt-6">
              <iframe src={`/api/media/${found.pdf}`} title={found.title} className="h-[78svh] w-full rounded-2xl border border-g200 bg-g100" />
              <a href={`/api/media/${found.pdf}`} target="_blank" rel="noreferrer" data-link className="label mt-4 inline-block text-accent-d hover:text-ink">Open the PDF in a new tab ↗</a>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 text-[17px] leading-relaxed text-g600">
              {paragraphs.map((t, i) => <p key={i}><Hl>{t}</Hl></p>)}
            </div>
          )}
          <div className="mt-8"><MediaBlock media={found} title={found.title} /></div>
          <Link href={`/travel/${place.slug}`} data-link className="label mt-10 inline-block text-g600 transition-colors hover:text-accent-d">← Back to {place.name}</Link>
        </div>
      </Section>
      <CtaBand text={`Planning a trip to ${place.name}? Tell me about it.`} />
    </>
  );
}
