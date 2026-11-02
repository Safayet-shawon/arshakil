import type { Metadata } from "next";
import { books } from "@/data/content";
import { site } from "@/data/site";
import type { Book } from "@/types";
import { ButtonLink } from "@/components/ui/Button";
import CtaBand from "@/components/ui/CtaBand";
import Hl from "@/components/ui/Hl";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Author" };

function BookRow({ b, n }: { b: Book; n: number }) {
  const specs = [["Pages", String(b.pages)], ["Language", b.language], ["Format", "PDF"], ["Year", b.year]];
  return (
    <Reveal>
      <article className="grid items-center gap-8 border-b border-g300 py-10 last:border-0 md:grid-cols-[minmax(220px,340px)_1fr] md:gap-14">
        {/* typographic cover */}
        <div className={cn("relative mx-auto aspect-[3/4] w-full max-w-[320px] bg-gradient-to-br from-ink to-g600 p-6 text-paper shadow-[12px_14px_0_rgba(247,181,0,0.4)]", n % 2 === 1 && "md:order-2")}>
          <span className="absolute inset-y-0 left-3 w-px bg-white/20" />
          <div className="label text-accent">PDF · {b.year}</div>
          <div className="font-display mt-10 text-[clamp(32px,3.4vw,46px)] leading-[0.95]">{b.title}</div>
          <div className="mt-3 text-sm text-g200">{b.subtitle}</div>
          <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
            <span className="h-[3px] w-12 bg-accent" />
            <span className="label text-g300">{site.name}</span>
          </div>
        </div>

        <div>
          <div className="label text-accent-d">Book {String(n + 1).padStart(2, "0")}</div>
          <h3 className="font-display mt-1 text-[clamp(34px,4vw,60px)] leading-[0.95] text-ink"><Hl>{b.title}</Hl></h3>
          <p className="mt-1 text-g500"><Hl>{b.subtitle}</Hl></p>
          <p className="mt-4 max-w-lg text-sm leading-[1.7] text-g600"><Hl>{b.summary}</Hl></p>
          <dl className="mt-6 grid max-w-lg grid-cols-2 border-y border-g300 sm:grid-cols-4">
            {specs.map(([k, v]) => (
              <div key={k} className="border-g300 px-1 py-3 sm:border-r sm:last:border-r-0">
                <dt className="label text-[10px] text-g500">{k}</dt>
                <dd className="font-display text-2xl text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={b.pdf} target="_blank" rel="noreferrer" arrow="↗">Read PDF</ButtonLink>
            <ButtonLink href={b.pdf} download variant="ghost" arrow="↓">Download</ButtonLink>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function AuthorPage() {
  return (
    <>
      <PageHero index="05" title="Author" intro="Books and essays on design, place and a life in motion. Read them here or download the PDF." />
      <div className="group h-[clamp(160px,28vw,360px)]"><Photo name="author-notebook" alt="Notebook and pen" className="h-full" /></div>
      <Section>
        <SectionHead index="01" kicker="Library" title="Books" aside={String(books.length).padStart(2, "0")} />
        {books.map((b, i) => <BookRow key={b.slug} b={b} n={i} />)}
      </Section>
      <CtaBand text="Want a talk, a signed copy or a commissioned essay? Get in touch." />
    </>
  );
}
