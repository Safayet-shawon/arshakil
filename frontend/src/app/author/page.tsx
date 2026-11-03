import type { Metadata } from "next";
import { getContent } from "@/lib/server/content";
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
  const specs = [["Pages", String(b.pages || "—")], ["Language", b.language], ["Format", "Read online"], ["Price", `৳ ${b.priceBdt}`]];
  const inside = b.content.split("\n").filter(Boolean);
  return (
    <Reveal>
      <article className="grid items-center gap-8 border-b border-g300 py-10 last:border-0 md:grid-cols-[minmax(220px,340px)_1fr] md:gap-14">
        <div className={cn("relative mx-auto w-full max-w-[320px] shadow-[12px_14px_0_rgba(247,181,0,0.4)]", n % 2 === 1 && "md:order-2")}>
          <Photo name={b.thumb} alt={b.title} ratio="3/4" />
        </div>

        <div>
          <div className="label text-accent-d">Book {String(n + 1).padStart(2, "0")} · {b.year}</div>
          <h3 className="font-display mt-1 text-[clamp(34px,4vw,60px)] leading-[0.95] text-ink"><Hl>{b.title}</Hl></h3>
          <p className="mt-1 text-g500"><Hl>{b.subtitle}</Hl></p>
          <p className="mt-4 max-w-lg text-sm leading-[1.7] text-g600"><Hl>{b.summary}</Hl></p>
          {inside.length > 0 && (
            <div className="mt-4 max-w-lg">
              <div className="label text-g500">Inside</div>
              <ul className="mt-1 grid gap-1 text-sm text-g600">{inside.map((l) => <li key={l}><span className="text-accent">— </span><Hl>{l}</Hl></li>)}</ul>
            </div>
          )}
          <dl className="mt-6 grid max-w-lg grid-cols-2 border-y border-g300 sm:grid-cols-4">
            {specs.map(([k, v]) => (
              <div key={k} className="border-g300 px-1 py-3 sm:border-r sm:last:border-r-0">
                <dt className="label text-[10px] text-g500">{k}</dt>
                <dd className="font-display text-2xl text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink href={`/author/${b.slug}/read`} arrow="→">Read the first 5% free</ButtonLink>
            <span className="label text-g500">The full book needs an access code</span>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default async function AuthorPage() {
  const { books } = await getContent();
  return (
    <>
      <PageHero index="05" title="Author" intro="Books and essays on design, place and a life in motion. Read the first pages free; ask for access to read the whole book." />
      <div className="group h-[clamp(160px,28vw,360px)]"><Photo name="author-notebook" alt="Notebook and pen" className="h-full" /></div>
      <Section>
        <SectionHead index="01" kicker="Library" title="Books" aside={String(books.length).padStart(2, "0")} />
        {books.map((b, i) => <BookRow key={b.slug} b={b} n={i} />)}
      </Section>
      <CtaBand text="Want a talk, a signed copy or a commissioned essay? Get in touch." />
    </>
  );
}
