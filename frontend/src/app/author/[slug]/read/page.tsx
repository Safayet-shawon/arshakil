import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/server/content";
import Reader from "@/components/author/Reader";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const b = (await getContent()).books.find((x) => x.slug === slug);
  return { title: b ? `Read ${b.title}` : "Author", robots: { index: false } };
}

export default async function ReadPage({ params }: Props) {
  const { slug } = await params;
  const b = (await getContent()).books.find((x) => x.slug === slug);
  if (!b || !b.pdf) notFound();
  return (
    <>
      <PageHero index="05" title={b.title} intro={b.subtitle} />
      <Section className="bg-g200">
        <Reader slug={b.slug} />
      </Section>
    </>
  );
}
