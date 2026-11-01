import Intro from "@/components/home/Intro";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import FieldsList from "@/components/home/FieldsList";
import Approach from "@/components/home/Approach";
import Work from "@/components/home/Work";
import Services from "@/components/home/Services";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Intro />
      <Hero />
      <Marquee />
      <FieldsList />
      <Approach />
      <Work />
      <Services />
      <Contact />
    </>
  );
}
