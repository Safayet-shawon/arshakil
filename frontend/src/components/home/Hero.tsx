"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useIntroDone } from "@/lib/intro";
import { site, socials } from "@/data/site";
import { Apos, ButtonLink } from "../ui/Button";
import RoleSwipe from "./RoleSwipe";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/** One word of the name. Slides up from a mask; the second word of each row also fades grey -> charcoal. */
function Word({ children, delay, outline, fade, dot }: {
  children: string; delay: number; outline?: boolean; fade?: boolean; dot?: boolean;
}) {
  const entered = useIntroDone();
  return (
    <motion.span
      initial={{ y: "110%", opacity: 0, color: fade ? "#dedede" : undefined }}
      animate={entered ? { y: 0, opacity: 1, color: fade ? "#4d4f53" : undefined } : {}}
      transition={{ duration: 1.1, delay, ease, color: { duration: 1.4, delay } }}
      className={cn("inline-block", outline ? "text-outline" : "text-ink")}>
      {children}{dot && <i className="not-italic text-accent">.</i>}
    </motion.span>
  );
}

/**
 * Hero, laid out like the Dribbble shot: name across the top, portrait rising behind it,
 * role swipe + intro bottom-left, social stack bottom-right.
 * Entry order: nav -> name -> text -> socials -> portrait.
 */
export default function Hero() {
  const entered = useIntroDone();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 20 });
  const sy = useSpring(my, { stiffness: 90, damping: 20 });
  // portrait drifts the opposite way for a little depth
  const px = useTransform(sx, (n) => -n * 1.4);
  const py = useTransform(sy, (n) => -n);
  const [row1, row2] = site.heroName;

  const onMove = (e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth - 0.5) * 14);
    my.set((e.clientY / window.innerHeight - 0.5) * 8);
  };

  return (
    <section id="top" onMouseMove={onMove}
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[radial-gradient(60%_46%_at_50%_64%,rgba(247,181,0,0.13),transparent_72%),linear-gradient(to_bottom,#fff_0%,#fff_72%,var(--color-g100)_100%)]">
      {/* name — sits in front of the portrait */}
      <motion.h1 aria-label={site.fullName} style={{ x: sx, y: sy }}
        className="font-display pointer-events-none absolute inset-x-0 top-[12vh] z-[3] select-none text-center leading-[0.9] whitespace-nowrap md:top-[13vh]">
        {[row1, row2].map((row, r) => (
          <span key={r} className="block overflow-hidden py-[.05em] text-[clamp(34px,min(12.4vw,18vh),230px)]">
            {row.map((w, i) => (
              <span key={w} className={i ? "ml-[.22em]" : ""} aria-hidden>
                <Word delay={0.45 + r * 0.25 + i * 0.15} outline={r === 1 && i === 0} fade={i === 1} dot={w === "AR."}>
                  {w === "AR." ? "AR" : w}
                </Word>
              </span>
            ))}
          </span>
        ))}
      </motion.h1>

      {/* portrait — rises last, sits behind the name at reduced opacity */}
      <motion.div className="absolute left-1/2 top-[39vh] z-[2] h-[92vh] max-md:top-[28vh] max-md:h-[72vh]"
        style={{ aspectRatio: "1176/1338", x: "-50%" }}
        initial={{ opacity: 0, y: "18vh", filter: "blur(12px)" }}
        animate={entered ? { opacity: 0.62, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 1.7, delay: 1.55, ease, opacity: { duration: 1.2, delay: 1.55 } }}>
        <motion.div style={{ x: px, y: py }} className="h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.heroImage} alt={`Portrait of ${site.name}`} className="block h-full w-full" />
        </motion.div>
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[28vh] bg-gradient-to-t from-white from-[4%] to-transparent" />

      {/* left: role swipe + intro */}
      <div className="absolute left-5 top-[61vh] z-[4] md:left-[clamp(20px,6.5vw,110px)] max-md:right-5 max-md:top-[62vh]">
        <motion.span initial={{ opacity: 0, y: 22 }} animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1.05, ease }} className="mb-3 block h-[3px] w-[38px] bg-accent" />
        <motion.div initial={{ opacity: 0, y: 22 }} animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1.05, ease }}>
          <RoleSwipe />
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 22 }} animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1.2, ease }} className="mb-[22px] mt-3 max-w-[300px] text-[13px] leading-[1.55] text-g600">
          {site.intro}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 22 }} animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1.35, ease }}>
          <ButtonLink href="#work">Let<Apos />s collaborate</ButtonLink>
        </motion.div>
      </div>

      {/* right: socials */}
      <div className="absolute right-[clamp(20px,6.5vw,110px)] top-[64vh] z-[4] flex min-w-[150px] flex-col gap-2 max-md:hidden">
        {socials.map((s, i) => (
          <motion.a key={s.label} href={s.href} data-link target="_blank" rel="noreferrer"
            initial={{ opacity: 0, x: 26 }} animate={entered ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.25 + i * 0.1, ease }} whileHover={{ x: -6 }}
            className="flex items-center gap-2.5 rounded-xl border border-g200 bg-paper px-4 py-2.5 text-xs font-bold tracking-[0.04em] text-g600 shadow-[0_8px_28px_rgba(77,79,83,0.08)]">
            <span aria-hidden>{s.icon}</span>{s.label}
          </motion.a>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={entered ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 2.2 }}
        className="label absolute bottom-5 left-1/2 z-[4] -translate-x-1/2 text-[10px] tracking-[0.2em] text-g500 max-md:hidden">
        Scroll to explore ↓
      </motion.div>
    </section>
  );
}
