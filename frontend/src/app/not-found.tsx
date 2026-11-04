import type { Metadata } from "next";
import Link from "next/link";
import { fields } from "@/data/site";
import Hl from "@/components/ui/Hl";
import Section from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

/** Shown for any address that does not exist; sends visitors on to the real pages. */
export default function NotFound() {
  return (
    <Section className="flex min-h-[100svh] flex-col justify-center bg-[radial-gradient(55%_70%_at_85%_0%,rgba(247,181,0,0.16),transparent_70%)] pt-[clamp(110px,16vh,170px)]">
      <div className="label text-g500"><b className="text-accent-d">[ 404 ]</b> <Hl>— Lost on the way</Hl></div>
      <h1 className="font-display text-[clamp(64px,13vw,200px)] leading-[0.88] text-ink">Page not <span className="text-outline">found</span><span className="text-accent">.</span></h1>
      <p className="mt-5 max-w-md text-[15px] leading-[1.65] text-g600">That address does not exist, or it has moved. Head home, or pick one of the fields below.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Back home</ButtonLink>
        <ButtonLink href="/#contact" variant="ghost">Contact</ButtonLink>
      </div>
      <nav aria-label="Pages" className="mt-12 flex flex-wrap gap-x-6 gap-y-2">
        {fields.map((f) => <Link key={f.slug} href={f.href} data-link className="label text-g600 transition-colors hover:text-accent-d">{f.title} →</Link>)}
      </nav>
    </Section>
  );
}
