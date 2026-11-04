import type { Metadata } from "next";
import Link from "next/link";
import { coverOf } from "@/lib/media";
import { getContent } from "@/lib/server/content";
import { ButtonLink } from "@/components/ui/Button";
import Albums from "@/components/ui/Albums";
import CtaBand from "@/components/ui/CtaBand";
import Hl from "@/components/ui/Hl";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

export const metadata: Metadata = { title: "Social Work" };

export default async function SocialWorkPage() {
  const { initiatives } = await getContent();
  return (
    <>
      <PageHero index="06" title="Social Work" intro="Design is only useful if it reaches people. Pick an initiative to read more about it." />
      <div className="group h-[clamp(180px,32vw,420px)]"><Photo name="social-volunteers" alt="Volunteers working together" className="h-full" /></div>

      <Section>
        <SectionHead index="01" kicker="What we do" title="Initiatives" aside={String(initiatives.length).padStart(2, "0")} />
        <div className="grid gap-x-6 gap-y-10 md:grid-cols-3">
          {initiatives.map((n, i) => (
            <Reveal key={n.slug} delay={i * 0.08}>
              <Link href={`/social-work/${n.slug}`} data-view className="group block">
                <Photo name={coverOf(n)} alt={n.title} ratio="4/3" />
                <div className="label mt-3 text-accent-d">{n.area}</div>
                <h3 className="font-display text-3xl text-ink transition-colors group-hover:text-accent-d">{n.title} <span aria-hidden className="text-accent">↗</span></h3>
                <p className="mt-2 text-sm leading-relaxed text-g600"><Hl>{n.blurb}</Hl></p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-g200 text-center">
        <Reveal>
          <h2 className="font-display text-[clamp(32px,5vw,72px)] leading-[0.95] text-ink"><Hl>Want to volunteer, donate or partner?</Hl></h2>
          <p className="mx-auto my-4 max-w-md text-sm leading-relaxed text-g600"><Hl>Every project starts with a conversation. Say hello and we will find a way to help together.</Hl></p>
          <ButtonLink href="/#contact">Get involved</ButtonLink>
        </Reveal>
      </Section>
      <Albums sector="social-work" />
      <CtaBand text="Looking for a design partner for a community project? Tell me about it." />
    </>
  );
}
