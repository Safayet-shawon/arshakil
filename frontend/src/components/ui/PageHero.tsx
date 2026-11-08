import Breadcrumbs from "./Breadcrumbs";
import type { ReactNode } from "react";
import Hl from "./Hl";
import T from "./T";
import Reveal from "./Reveal";

/** Top of every inner page: back link, kicker, big title, intro. */
export default function PageHero({ index, title, intro }: { index: string; title: string; intro: ReactNode }) {
  return (
    <section className="bg-[radial-gradient(55%_70%_at_85%_0%,rgba(247,181,0,0.14),transparent_70%)] px-5 pb-[clamp(18px,3vw,40px)] pt-[clamp(96px,13vh,130px)] md:px-[clamp(20px,3.4vw,48px)]">
      <Reveal>
        <Breadcrumbs title={title} />
        <div className="label mt-6 text-g500"><b className="text-accent-d">[ {index} ]</b> <Hl>— Fields of work</Hl></div>
        <h1 className="font-display text-[clamp(40px,7.4vw,116px)] leading-[0.88] text-ink"><T>{title}</T></h1>
        <p className="mt-5 max-w-xl text-[15px] leading-[1.65] text-g600">{typeof intro === "string" ? <T>{intro}</T> : <Hl>{intro}</Hl>}</p>
      </Reveal>
    </section>
  );
}
