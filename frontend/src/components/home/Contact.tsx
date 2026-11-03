import { site, socials } from "@/data/site";
import { ButtonLink } from "../ui/Button";
import ContactForm from "../ui/ContactForm";
import Hl from "../ui/Hl";
import Reveal from "../ui/Reveal";
import T from "../ui/T";
import Section from "../ui/Section";

export default function Contact() {
  return (
    <Section id="contact" className="bg-[radial-gradient(50%_55%_at_50%_100%,rgba(247,181,0,0.18),transparent_70%)] bg-g200 text-center">
      <Reveal><div className="label mb-5 text-g500"><b className="text-accent-d">[ 05 ]</b> <Hl>— {site.location} · Let's talk</Hl></div></Reveal>
      <Reveal>
        {/* the apostrophe is a plain mustard glyph with no outline, so it never doubles up */}
        <h2 className="font-display text-[clamp(64px,14vw,220px)] leading-[0.88] text-ink">
          <span className="text-outline">LET<span className="mx-[0.02em] text-accent [-webkit-text-stroke:0]">&apos;</span>S</span> TALK<span className="text-accent">.</span>
        </h2>
      </Reveal>
      <Reveal>
        <p className="mx-auto my-5 max-w-[440px] text-sm leading-[1.6] text-g600"><T>A building, a portrait, a film, a book — tell me about it. I read every message.</T></p>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href={`mailto:${site.email}`}>{site.email}</ButtonLink>
          <ButtonLink href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} variant="ghost" arrow="">{site.phone}</ButtonLink>
          {socials.slice(1).map((s) => (
            <ButtonLink key={s.label} href={s.href} variant="ghost" arrow="" target="_blank" rel="noreferrer">{s.label}</ButtonLink>
          ))}
        </div>
      </Reveal>
      <Reveal><ContactForm /></Reveal>
    </Section>
  );
}
