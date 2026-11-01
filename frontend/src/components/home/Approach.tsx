import { approach } from "@/data/content";
import Reveal from "../ui/Reveal";

/** Big statement. The word "unfamiliar" is outlined, the rest is solid. */
export default function Approach() {
  const [before, after] = approach.split("unfamiliar");
  return (
    <section className="bg-g200 px-5 py-[clamp(72px,12vw,160px)] md:px-[clamp(20px,3.4vw,48px)]">
      <div className="grid gap-[clamp(24px,5vw,80px)] md:grid-cols-[1fr_2.2fr]">
        <Reveal><div className="label text-g500"><b className="text-accent-d">[ 02 ]</b> — Approach</div></Reveal>
        <Reveal>
          <h2 className="font-display text-[clamp(34px,5.4vw,84px)] leading-[0.98] text-ink">
            {before}<em className="text-outline-soft not-italic [-webkit-text-stroke-color:var(--color-g600)]">unfamiliar</em>{after}
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
