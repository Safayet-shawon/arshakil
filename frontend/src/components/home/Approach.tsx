import { approach } from "@/data/content";
import T from "../ui/T";
import Hl from "../ui/Hl";
import Reveal from "../ui/Reveal";
import Section from "../ui/Section";

/** Short statement. The word "unfamiliar" is outlined in mustard. */
export default function Approach() {
  const [before, after] = approach.split("unfamiliar");
  return (
    <Section className="bg-g200 !py-[clamp(32px,4.5vw,60px)]">
      <div className="grid gap-[clamp(16px,3vw,48px)] md:grid-cols-[1fr_3fr]">
        <Reveal><div className="label text-g500"><b className="text-accent-d">[ 02 ]</b> <Hl>— Approach</Hl></div></Reveal>
        <Reveal>
          <h2 className="font-display text-[clamp(22px,3vw,44px)] leading-[1.05] text-ink">
            <T>{before}</T>
            <em className="text-outline-soft not-italic [-webkit-text-stroke:1.2px_var(--color-accent)]">unfamiliar</em>
            <T>{after}</T>
          </h2>
        </Reveal>
      </div>
    </Section>
  );
}
