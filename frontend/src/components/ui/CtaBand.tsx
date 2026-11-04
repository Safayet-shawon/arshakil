import Link from "next/link";
import { fields } from "@/data/site";
import Hl from "./Hl";
import T from "./T";
import Section from "./Section";
import { Apos, ButtonLink } from "./Button";

/** Closing band for inner pages. */
export default function CtaBand({ text = "Have a project, a story or an idea? Tell me about it." }: { text?: string }) {
  return (
    <Section className="bg-ink text-center">
      <h2 className="font-display text-[clamp(36px,6vw,88px)] leading-[0.92] text-g50">Let<Apos />s <Hl>work together.</Hl></h2>
      <p className="mx-auto my-5 max-w-md text-sm leading-[1.6] text-g300"><T>{text}</T></p>
      <ButtonLink href="/#contact" variant="accent" className="px-8 py-4 text-sm">Get in touch</ButtonLink>
      <nav aria-label="Explore more" className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-2">
        {fields.map((f) => <Link key={f.slug} href={f.href} data-link className="label text-g300 transition-colors hover:text-accent">{f.title}</Link>)}
        <Link href="/about" data-link className="label text-g300 transition-colors hover:text-accent">About</Link>
      </nav>
    </Section>
  );
}
