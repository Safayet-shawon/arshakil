import Hl from "./Hl";
import Section from "./Section";
import { Apos, ButtonLink } from "./Button";

/** Closing band for inner pages. */
export default function CtaBand({ text = "Have a project, a story or an idea? Tell me about it." }: { text?: string }) {
  return (
    <Section className="bg-ink text-center">
      <h2 className="font-display text-[clamp(36px,6vw,88px)] leading-[0.92] text-g50">Let<Apos />s <Hl>work together.</Hl></h2>
      <p className="mx-auto my-5 max-w-md text-sm leading-[1.6] text-g300"><Hl>{text}</Hl></p>
      <ButtonLink href="/#contact">Get in touch</ButtonLink>
    </Section>
  );
}
