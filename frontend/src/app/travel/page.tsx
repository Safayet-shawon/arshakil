import type { Metadata } from "next";
import { destinations, stories, videos } from "@/data/content";
import CtaBand from "@/components/ui/CtaBand";
import Hl from "@/components/ui/Hl";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import VideoCard from "@/components/ui/VideoCard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Travel" };

export default function TravelPage() {
  return (
    <>
      <PageHero index="04" title="Travel" intro="Cities, landscapes and the history behind them: documented in photographs, vlogs and short stories." />

      <Section>
        <SectionHead index="01" kicker="Places" title="Destinations" aside={String(destinations.length).padStart(2, "0")} />
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
          {destinations.map((d, i) => (
            <Reveal key={d.title} delay={(i % 2) * 0.08}>
              <article className="group" data-view>
                <Photo name={d.photo} alt={d.title} ratio="3/2" />
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-3xl text-ink"><Hl>{d.title}</Hl></h3>
                  <span className="label text-g500">{d.year}</span>
                </div>
                <p className="label mt-1 text-g500">{d.place}</p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-g600"><Hl>{d.note}</Hl></p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-g200">
        <SectionHead index="02" kicker="On video" title="Travel vlogs" aside="Tap to watch on YouTube" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.filter((v) => v.group === "Travel vlogs").map((v, i) => <Reveal key={v.title} delay={i * 0.07}><VideoCard video={v} /></Reveal>)}
        </div>
      </Section>

      <Section>
        <SectionHead index="03" kicker="Stories" title="History & heritage" aside={String(stories.length).padStart(2, "0")} />
        <div className="grid gap-12">
          {stories.map((s, i) => (
            <Reveal key={s.title}>
              <article className="group grid items-center gap-6 md:grid-cols-2 md:gap-12">
                <Photo name={s.photo} alt={s.title} ratio="4/3" className={cn(i % 2 === 1 && "md:order-2")} />
                <div>
                  <div className="label text-accent-d">{s.era} · {s.place}</div>
                  <h3 className="font-display mt-2 text-[clamp(30px,4vw,56px)] leading-[0.95] text-ink"><Hl>{s.title}</Hl></h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-g600"><Hl>{s.blurb}</Hl></p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
      <CtaBand text="Planning a trip, a talk or a story together? Let's plan it." />
    </>
  );
}
