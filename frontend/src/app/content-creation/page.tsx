import type { Metadata } from "next";
import { socials } from "@/data/site";
import { videos } from "@/data/content";
import CtaBand from "@/components/ui/CtaBand";
import Hl from "@/components/ui/Hl";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import VideoCard from "@/components/ui/VideoCard";

export const metadata: Metadata = { title: "Content Creation" };

const groups = [...new Set(videos.map((v) => v.group))];

export default function ContentPage() {
  return (
    <>
      <PageHero index="03" title="Content Creation" intro="Videos, vlogs and stories: on YouTube first, and across Facebook, TikTok and Instagram." />

      <Section>
        <SectionHead index="01" kicker="Channels" title="Follow along" aside="04" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {socials.slice(0, 4).map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <a href={s.href} target="_blank" rel="noreferrer" data-view
                className="group flex min-h-[170px] flex-col justify-between rounded-2xl border-t-[3px] border-transparent bg-paper p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-[0_24px_50px_rgba(77,79,83,0.14)]">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-sm font-bold text-paper">{s.icon}</span>
                <span>
                  <span className="font-display block text-3xl text-ink">{s.label}</span>
                  <span className="label text-g500"><Hl>{s.handle}</Hl></span>
                </span>
                <span className="label text-accent-d transition-transform group-hover:translate-x-1">Open ↗</span>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      {groups.map((g, i) => (
        <Section key={g} className={i % 2 === 0 ? "bg-g200" : ""}>
          <SectionHead index={String(i + 2).padStart(2, "0")} kicker="Videos" title={g} aside="Tap to watch on YouTube" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.filter((v) => v.group === g).map((v, k) => (
              <Reveal key={v.title} delay={k * 0.07}><VideoCard video={v} /></Reveal>
            ))}
          </div>
        </Section>
      ))}
      <CtaBand text="Want a video made, or want to collaborate on one?" />
    </>
  );
}
