import type { ReactNode } from "react";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

/** "[ 01 ] — Kicker" + big display title, with the short mustard bar under the rule. */
export default function SectionHead({ index, kicker, title, aside, tone = "light" }: {
  index: string; kicker: string; title: ReactNode; aside?: ReactNode; tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <Reveal>
      <div className={cn("relative mb-[clamp(28px,4vw,56px)] flex items-end justify-between gap-5 border-b-[1.5px] pb-4",
        dark ? "border-white/25" : "border-g300")}>
        <div>
          <div className={cn("label", dark ? "text-g300" : "text-g500")}>
            <b className={dark ? "text-accent" : "text-accent-d"}>[ {index} ]</b> — {kicker}
          </div>
          <h2 className={cn("font-display text-[clamp(40px,7vw,104px)] leading-[0.9]", dark ? "text-g50" : "text-ink")}>{title}</h2>
        </div>
        {aside && <div className={cn("label", dark ? "text-g300" : "text-g600")}>{aside}</div>}
        <span className="absolute -bottom-[1.5px] left-0 h-[3px] w-[72px] bg-accent" />
      </div>
    </Reveal>
  );
}
