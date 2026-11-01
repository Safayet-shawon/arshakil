import { site, socials } from "@/data/site";
import { Apos, ButtonLink } from "../ui/Button";
import ContactForm from "../ui/ContactForm";
import Reveal from "../ui/Reveal";

export default function Contact() {
  return (
    <section id="contact" className="bg-[radial-gradient(50%_55%_at_50%_100%,rgba(247,181,0,0.18),transparent_70%)] bg-g200 px-5 py-[clamp(72px,12vw,160px)] text-center md:px-[clamp(20px,3.4vw,48px)]">
      <Reveal><div className="label mb-7 text-g500"><b className="text-accent-d">[ 05 ]</b> — {site.location} · Let’s talk</div></Reveal>
      <Reveal>
        <h2 className="font-display text-[clamp(70px,17vw,280px)] leading-[0.85] text-ink">
          <span className="text-outline">Let<Apos />s</span> talk.
        </h2>
      </Reveal>
      <Reveal>
        <p className="mx-auto my-[22px] max-w-[440px] text-sm leading-[1.6] text-g600">A building, a portrait, a film, a book — tell me about it. I read every message.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href={`mailto:${site.email}`}>{site.email}</ButtonLink>
          {socials.filter((s) => s.label !== "YouTube").map((s) => (
            <ButtonLink key={s.label} href={s.href} variant="ghost" arrow="" target="_blank" rel="noreferrer">{s.label}</ButtonLink>
          ))}
        </div>
      </Reveal>
      <Reveal><ContactForm /></Reveal>
    </section>
  );
}
