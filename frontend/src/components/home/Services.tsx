import { getContent } from "@/lib/server/content";
import { site } from "@/data/site";
import { usd } from "@/lib/utils";
import Hl from "../ui/Hl";
import RequestButton from "../ui/RequestButton";
import Reveal from "../ui/Reveal";
import Section from "../ui/Section";
import SectionHead from "../ui/SectionHead";
import { cn } from "@/lib/utils";

/** "Hire me as ...": fixed-rate cards show a price, custom ones are quoted after a request. */
export default async function Services() {
  const { services } = await getContent();
  return (
    <Section id="services">
      <SectionHead index="04" kicker="Hire me" title="Services & Fees" aside="Available for commissions" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((s, i) => (
          <Reveal key={s.slug} delay={i * 0.07}>
            <article data-link className="flex h-full min-h-[320px] flex-col gap-3.5 rounded-[14px] border-t-[3px] border-transparent bg-paper p-[26px] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-2 hover:border-accent hover:shadow-[0_24px_50px_rgba(77,79,83,0.14)]">
              <span className={cn("label w-fit rounded-full border px-3 py-1 text-[10px]", s.rate === "fixed" ? "border-g300 text-g600" : "border-accent text-accent-d")}>
                {s.rate === "fixed" ? "Fixed rate" : "Custom quote"}
              </span>
              <h3 className="font-display text-[26px] leading-[1.02] text-ink">Hire me as <br />{s.hire}</h3>
              <p className="text-[13px] leading-[1.55] text-g600"><Hl>{s.description}</Hl></p>
              {s.rate === "fixed" && s.priceFromUsd ? (
                <div className="font-display text-[34px] text-ink">{usd(s.priceFromUsd)}
                  <small className="ml-1.5 font-body text-[11px] font-bold uppercase tracking-[0.08em] text-g500">{s.unit}</small>
                </div>
              ) : (
                <div className="font-display text-[22px] leading-tight text-g600">Quoted on request</div>
              )}
              <ul className="grid gap-1.5 text-xs text-g600">
                {s.includes.map((x) => <li key={x}><span className="text-accent">— </span><Hl>{x}</Hl></li>)}
              </ul>
              <div className="mt-auto grid gap-2 pt-2">
                <RequestButton service={s.hire} label={s.rate === "fixed" ? "Book this" : "Send a request"} />
                {s.phone && (
                  <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} data-link className="label text-g600 transition-colors hover:text-accent-d">Or call {site.phone} ↗</a>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
