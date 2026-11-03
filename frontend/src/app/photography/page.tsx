import type { Metadata } from "next";
import CtaBand from "@/components/ui/CtaBand";
import Gallery from "@/components/ui/Gallery";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { gallery } from "@/data/content";

export const metadata: Metadata = { title: "Architectural Photography" };

export default function PhotographyPage() {
  return (
    <>
      <PageHero index="02" title="Architectural Photography" intro="Buildings, light and the people inside them, one frame at a time. Tap a frame to view it large." />
      <Section className="bg-ink">
        <SectionHead index="01" kicker="The gallery" title="Frames" tone="dark" aside={String(gallery.length).padStart(2, "0")} />
        <Gallery />
      </Section>
      <CtaBand text="Need architectural photography for a building, a studio or a publication? Tell me about it." />
    </>
  );
}
