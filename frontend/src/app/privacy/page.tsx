import Link from "next/link";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import CtaBand from "@/components/ui/CtaBand";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";

export const metadata = pageMeta({
  title: "Privacy policy",
  description: `How ${site.fullName}'s website handles your information: contact messages, book access requests, cookies and analytics.`,
  path: "/privacy",
});

const UPDATED = "November 2026";

const blocks: { h: string; body: string[] }[] = [
  { h: "Who runs this site", body: [`This website belongs to ${site.fullName} (${site.firm}), ${site.location}. Questions about your data: write to ${site.email}.`] },
  { h: "What I collect", body: [
    "Contact form: your name, email address, the service you are asking about and your message. I use it only to reply to you.",
    "Book access requests: your name, your phone or email, and the payment transaction ID you send, so I can check the payment and give you an access code.",
    "Visit statistics: if analytics is switched on, Google Analytics records anonymous information such as the pages viewed, the country and the type of device. IP addresses are anonymised.",
  ] },
  { h: "Cookies and storage", body: [
    "Visitors get no tracking cookies from me. The site remembers small things in your browser only to work properly, for example that the opening animation has played.",
    "The admin area uses a sign-in cookie that only I have. If analytics is on, Google may set its own cookies; you can block them in your browser settings.",
  ] },
  { h: "Who sees your information", body: [
    "Only me. Messages and requests are stored privately on the hosting service I use (Vercel). I never sell your information or use it for advertising. I share it only if the law requires me to.",
  ] },
  { h: "How long I keep it", body: ["Messages and requests are kept for as long as they are useful for the conversation or the book access, then deleted. You can ask me to delete yours at any time."] },
  { h: "Your choices", body: [`You can ask to see, correct or delete what I hold about you by writing to ${site.email}. You can also block cookies in your browser; the site keeps working.`] },
  { h: "Changes", body: ["If this policy changes, the new version will appear on this page with a new date."] },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero index="§" title="Privacy policy" intro={`How this website handles your information. Last updated ${UPDATED}.`} />
      <Section>
        <div className="mx-auto grid max-w-3xl gap-10">
          {blocks.map((b) => (
            <section key={b.h}>
              <h2 className="font-display text-[clamp(26px,3vw,40px)] leading-none text-ink">{b.h}</h2>
              {b.body.map((t) => <p key={t} className="mt-3 text-[15px] leading-[1.7] text-g600">{t}</p>)}
            </section>
          ))}
          <p className="text-sm text-g500">Questions? <Link href="/#contact" data-link className="font-bold text-accent-d">Send a message</Link>.</p>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
