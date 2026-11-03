import type { Metadata } from "next";
import { projects } from "@/data/content";
import type { Project } from "@/types";
import CtaBand from "@/components/ui/CtaBand";
import Hl from "@/components/ui/Hl";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

export const metadata: Metadata = { title: "Architecture" };

function ProjectCard({ p, index }: { p: Project; index: number }) {
  return (
    <Reveal delay={(index % 2) * 0.08}>
      <article className="group" data-view>
        <Photo name={p.photo} alt={p.title} ratio="4/3" />
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-3xl text-ink"><Hl>{p.title}</Hl></h3>
          <span className="label text-g500">{p.year}</span>
        </div>
        <p className="label mt-1 text-g500"><Hl>{p.type} — {p.location}</Hl></p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-g600"><Hl>{p.summary}</Hl></p>
      </article>
    </Reveal>
  );
}

export default function ArchitecturePage() {
  return (
    <>
      <PageHero index="01" title="Architecture" intro="Spaces shaped by light, material and silence: selected projects from Kolpo and Studio Karu." />
      <Section>
        <SectionHead index="01" kicker="Kolpo & Studio Karu" title="Selected projects" aside={String(projects.length).padStart(2, "0")} />
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">{projects.map((p, i) => <ProjectCard key={p.slug} p={p} index={i} />)}</div>
      </Section>
      <CtaBand text="Planning a house, a library or a small public space? Tell me about it." />
    </>
  );
}
