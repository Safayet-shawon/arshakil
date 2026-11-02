import Link from "next/link";
import { fields } from "@/data/site";
import Hl from "../ui/Hl";
import Reveal from "../ui/Reveal";
import Section from "../ui/Section";
import SectionHead from "../ui/SectionHead";

/** Each row opens that field's page. */
export default function FieldsList() {
  return (
    <Section id="fields">
      <SectionHead index="01" kicker="Fields of work" title={<>One eye,<br />six crafts</>} aside="06" outline />
      <Reveal>
        <ul>
          {fields.map((f, i) => (
            <li key={f.slug}>
              <Link href={f.href} data-link
                className="group grid grid-cols-[36px_1fr] items-center gap-5 border-b-[1.5px] border-g300 py-5 transition-[padding,background] duration-300 hover:bg-gradient-to-r hover:from-accent/[0.12] hover:to-transparent hover:to-60% hover:pl-[18px] md:grid-cols-[70px_1fr_minmax(0,380px)_30px]">
                <span className="label tracking-[0.14em] text-g500 transition-colors group-hover:text-accent-d">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-[clamp(28px,4.4vw,64px)] leading-none text-ink">{f.title}</h3>
                <p className="max-w-[380px] text-right text-[13px] leading-[1.55] text-g600 max-md:hidden"><Hl>{f.blurb}</Hl></p>
                <span aria-hidden className="text-[22px] text-g600 transition-[transform,color] duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent-d max-md:hidden">↗</span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
