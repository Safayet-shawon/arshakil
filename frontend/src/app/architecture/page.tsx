import SectionFeatured from "@/components/ui/SectionFeatured";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { coverOf } from "@/lib/media";
import { getContent } from "@/lib/server/content";
import type { Project } from "@/types";
import Albums from "@/components/ui/Albums";
import CtaBand from "@/components/ui/CtaBand";
import Hl from "@/components/ui/Hl";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

export const metadata: Metadata = pageMeta({ title: "Architecture", description: "Selected architecture projects by AR. Shakhaouth Hossain Shakil through Kolpo (Dhaka) and Studio Karu (Chittagong): homes, libraries, workplaces and public places.", path: "/architecture" });

function ProjectCard({ p, index }: { p: Project; index: number }) {
  return (
    <Reveal delay={(index % 2) * 0.08}>
      <Link href={`/architecture/${p.slug}`} data-link className="group block" data-view>
        <Photo name={coverOf(p)} alt={p.title} ratio="3/2" />
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[clamp(22px,2vw,28px)] leading-none text-ink"><Hl>{p.title}</Hl></h3>
          <span className="label text-g500">{p.year}</span>
        </div>
        <p className="label mt-1 text-g500"><Hl>{p.type} — {p.location}</Hl></p>
        <p className="mt-2 line-clamp-2 max-w-md text-[13px] leading-relaxed text-g600"><Hl>{p.summary}</Hl></p>
      </Link>
    </Reveal>
  );
}

export default async function ArchitecturePage() {
  const { projects } = await getContent();
  return (
    <>
      <PageHero index="01" title="Architecture" intro="Spaces shaped by light, material and silence: selected projects from Kolpo and Studio Karu." />
      <SectionFeatured sector="architecture" />
      <Section>
        <SectionHead index="01" kicker="Kolpo & Studio Karu" title="Selected projects" aside={String(projects.length).padStart(2, "0")} />
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{projects.map((p, i) => <ProjectCard key={p.slug} p={p} index={i} />)}</div>
      </Section>
      <Albums sector="architecture" />
      <CtaBand text="Planning a house, a library or a small public space? Tell me about it." />
    </>
  );
}
