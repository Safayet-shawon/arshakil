import type { Metadata } from "next";
import { places, stories, videos } from "@/data/content";
import CtaBand from "@/components/ui/CtaBand";
import Hl from "@/components/ui/Hl";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import TravelExplorer from "@/components/travel/TravelExplorer";
import VideoCard from "@/components/ui/VideoCard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Travel" };

export default function TravelPage() {
  return (
    <>
      <PageHero index="04" title="Travel" intro="Pick Bangladesh or Abroad, tap a pin on the map and read the post: what to see, how to go and roughly what it costs." />

      <Section>
        <SectionHead index="01" kicker="Places" title="Travel map" aside={String(places.length).padStart(2, "0")} />
        <TravelExplorer />
      </Section>

      <Section className="bg-g200">
        <SectionHead index="02" kicker="On video" title="Travel vlogs" aside="Tap to watch on YouTube" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.filter((v) => v.group === "Travel vlogs").map((v, i) => <Reveal key={v.title} delay={i * 0.07}><VideoCard video={v} /></Reveal>)}
        </div>
      </Section>

      <Section>
        <SectionHead index="03" kicker="Stories" title="History & heritage of Bangladesh" aside={String(stories.length).padStart(2, "0")} />
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
