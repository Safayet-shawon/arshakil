import type { Metadata } from "next";
import Link from "next/link";
import { about } from "@/data/content";
import { fields, roles, site, socials } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";
import CtaBand from "@/components/ui/CtaBand";
import Hl from "@/components/ui/Hl";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <section className="bg-[radial-gradient(55%_70%_at_85%_0%,rgba(247,181,0,0.14),transparent_70%)] px-5 pb-[clamp(32px,5vw,72px)] pt-[clamp(110px,16vh,170px)] md:px-[clamp(20px,3.4vw,48px)]">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(240px,420px)_1fr] md:gap-16">
          <Reveal>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[28px] bg-gradient-to-b from-g100 to-[#f1e4b8]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={site.heroImage} alt={`Portrait of ${site.name}`} className="absolute bottom-0 left-1/2 h-[112%] max-w-none -translate-x-1/2" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/" data-link className="label text-g500 transition-colors hover:text-accent-d">← Home</Link>
            <div className="label mt-6 text-g500"><b className="text-accent-d">[ 00 ]</b> <Hl>— About me</Hl></div>
            <h1 className="font-display text-[clamp(44px,8vw,120px)] leading-[0.9] text-ink"><Hl>{site.fullName}</Hl></h1>
            <div className="mt-5 grid max-w-xl gap-4 text-[15px] leading-[1.7] text-g600">
              {about.map((p) => <p key={p}><Hl>{p}</Hl></p>)}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {roles.map((r) => <span key={r} className="rounded-full border border-g300 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-g600">{r}</span>)}
            </div>
          </Reveal>
        </div>
      </section>

      <Section className="bg-g200">
        <SectionHead index="01" kicker="Find me" title="All my links" aside={String(socials.length + 1).padStart(2, "0")} />
        <ul className="grid gap-x-10 md:grid-cols-2">
          <li>
            <a href={`mailto:${site.email}`} data-link className="group flex items-center justify-between border-b-[1.5px] border-g300 py-4 transition-[padding] hover:pl-3">
              <span className="font-display text-2xl text-ink">Email</span>
              <span className="label text-g600 transition-colors group-hover:text-accent-d">{site.email} ↗</span>
            </a>
          </li>
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" data-link className="group flex items-center justify-between border-b-[1.5px] border-g300 py-4 transition-[padding] hover:pl-3">
                <span className="font-display text-2xl text-ink">{s.label}</span>
                <span className="label text-g600 transition-colors group-hover:text-accent-d"><Hl>{s.handle}</Hl> ↗</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHead index="02" kicker="Explore" title="What I do" aside="06" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((f) => (
            <Reveal key={f.slug}>
              <Link href={f.href} data-link className="group block rounded-2xl border-t-[3px] border-transparent bg-paper p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-[0_24px_50px_rgba(77,79,83,0.14)]">
                <h3 className="font-display text-3xl text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-g600"><Hl>{f.blurb}</Hl></p>
                <span className="label mt-4 block text-accent-d transition-transform group-hover:translate-x-1">Open ↗</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-8"><ButtonLink href="/#contact">Send a message</ButtonLink></div>
      </Section>
      <CtaBand />
    </>
  );
}
