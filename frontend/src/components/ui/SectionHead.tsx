import type { ReactNode } from "react";
import Hl from "./Hl";
import T from "./T";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

/**
 * "[ 01 ] — Kicker" + big display title, with the short mustard bar under the rule.
 * `outline` draws the title as a light-mustard outline with a transparent fill.
 */
export default function SectionHead({ index, kicker, title, aside, tone = "light", outline }: {
  index: string; kicker: string; title: ReactNode; aside?: ReactNode; tone?: "light" | "dark"; outline?: boolean;
}) {
  const dark = tone === "dark";
  return (
    <Reveal>
      <div className={cn("relative mb-[clamp(24px,3.4vw,44px)] flex items-end justify-between gap-5 border-b-[1.5px] pb-4",
        dark ? "border-white/25" : "border-g300")}>
        <div>
          <div className={cn("label", dark ? "text-g300" : "text-g500")}>
            <b className={dark ? "text-accent" : "text-accent-d"}>[ {index} ]</b> <Hl>— {kicker}</Hl>
          </div>
          <h2 className={cn("font-display text-[clamp(36px,6vw,92px)] leading-[0.9]", outline ? "text-transparent" : dark ? "text-g50" : "text-ink")}
            style={outline ? { WebkitTextStroke: "1.6px var(--color-accent-soft)" } : undefined}>
            {typeof title === "string" ? <T>{title}</T> : <Hl>{title}</Hl>}
          </h2>
        </div>
        {aside && <div className={cn("label", dark ? "text-g300" : "text-g600")}>{aside}</div>}
        <span className="absolute -bottom-[1.5px] left-0 h-[3px] w-[72px] bg-accent" />
      </div>
    </Reveal>
  );
}
