import { services } from "@/data/content";
import { usd } from "@/lib/utils";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";

export default function Services() {
  return (
    <section id="services" className="px-5 py-[clamp(72px,12vw,160px)] md:px-[clamp(20px,3.4vw,48px)]">
      <SectionHead index="04" kicker="Work with me" title={<>Services &amp; fees</>} aside="Available for commissions" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((s, i) => (
          <Reveal key={s.slug} delay={i * 0.07}>
            <article data-link className="flex min-h-[300px] flex-col gap-3.5 rounded-[14px] border-t-[3px] border-transparent bg-paper p-[26px] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-2 hover:border-accent hover:shadow-[0_24px_50px_rgba(77,79,83,0.14)]">
              <h3 className="font-display text-[28px] leading-none text-ink">{s.title}</h3>
              <p className="text-[13px] leading-[1.55] text-g600">{s.description}</p>
              <div className="font-display text-[34px] text-ink">{usd(s.priceFromUsd)}
                <small className="ml-1.5 font-body text-[11px] font-bold uppercase tracking-[0.08em] text-g500">{s.unit}</small>
              </div>
              <ul className="mt-auto grid gap-1.5 text-xs text-g600">
                {s.includes.map((x) => <li key={x}><span className="text-g400">— </span>{x}</li>)}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
