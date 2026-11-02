import type { Metadata } from "next";
import CtaBand from "@/components/ui/CtaBand";
import Gallery from "@/components/ui/Gallery";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { gallery } from "@/data/content";

export const metadata: Metadata = { title: "Photography" };

export default function PhotographyPage() {
  return (
    <>
      <PageHero index="02" title="Photography" intro="Buildings, people and places, one frame at a time. A gallery of the work: tap a frame to view it large." />
      <Section className="bg-ink">
        <SectionHead index="01" kicker="The gallery" title="Frames" tone="dark" aside={String(gallery.length).padStart(2, "0")} />
        <Gallery />
      </Section>
      <CtaBand text="Need architectural, travel or editorial photography? Tell me about it." />
    </>
  );
}
