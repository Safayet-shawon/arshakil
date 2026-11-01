import { fields } from "@/data/site";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";

export default function FieldsList() {
  return (
    <section id="fields" className="px-5 py-[clamp(72px,12vw,160px)] md:px-[clamp(20px,3.4vw,48px)]">
      <SectionHead index="01" kicker="Fields of work" title={<>One eye,<br />six crafts</>} aside="06" />
      <Reveal>
        <ul>
          {fields.map((f, i) => (
            <li key={f.slug} data-link
              className="group relative grid grid-cols-[36px_1fr] items-center gap-5 border-b-[1.5px] border-g300 py-[26px] transition-[padding,background] duration-300 hover:bg-gradient-to-r hover:from-accent/[0.12] hover:to-transparent hover:to-60% hover:pl-[18px] md:grid-cols-[70px_1fr_minmax(0,380px)_30px]">
              <span className="label tracking-[0.14em] text-g500 transition-colors group-hover:text-accent-d">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-[clamp(30px,5vw,72px)] leading-none text-ink">{f.title}</h3>
              <p className="max-w-[380px] text-right text-[13px] leading-[1.55] text-g600 max-md:hidden">{f.blurb}</p>
              <span aria-hidden className="text-[22px] text-g600 transition-[transform,color] duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent-d max-md:hidden">↗</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
