"use client";
import { motion, type MotionValue } from "framer-motion";
import { useIntroDone } from "@/lib/intro";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;
const INK = "#4d4f53";
const MUSTARD = "#f7b500";

/** A plain word: slides up out of its mask; second words also fade grey -> charcoal. */
function Word({ children, delay, outline, fade }: { children: string; delay: number; outline?: boolean; fade?: boolean }) {
  const entered = useIntroDone();
  return (
    <motion.span
      initial={{ y: "110%", opacity: 0, color: fade ? "#dedede" : undefined }}
      animate={entered ? { y: 0, opacity: 1, color: fade ? INK : undefined } : {}}
      transition={{ duration: 1.1, delay, ease, color: { duration: 1.4, delay } }}
      className={cn("inline-block", outline ? "text-outline" : "text-ink")}>
      {children}
    </motion.span>
  );
}

/**
 * First word of the name. It arrives as "ARCHITECT" in mustard, then `morphed` collapses
 * "CHITECT", turns "AR" charcoal and drops in the mustard ".":  ARCHITECT -> AR.
 */
function ArchitectWord({ morphed }: { morphed: boolean }) {
  const entered = useIntroDone();
  return (
    <motion.span className="inline-flex"
      initial={{ y: "110%", opacity: 0 }} animate={entered ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 1.1, delay: 0.2, ease }}>
      <motion.span animate={{ color: morphed ? INK : MUSTARD }} initial={{ color: MUSTARD }}
        transition={{ duration: 0.9, ease }}>AR</motion.span>
      <motion.span aria-hidden className="overflow-hidden whitespace-nowrap" style={{ color: MUSTARD }}
        initial={{ width: "auto", opacity: 1 }}
        animate={{ width: morphed ? 0 : "auto", opacity: morphed ? 0 : 1 }}
        transition={{ duration: 1, ease: [0.77, 0, 0.18, 1] }}>CHITECT</motion.span>
      <motion.i className="not-italic" style={{ color: MUSTARD, display: "inline-block" }}
        initial={{ scale: 0, opacity: 0, width: 0 }}
        animate={morphed ? { scale: 1, opacity: 1, width: "auto" } : {}}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.55 }}>.</motion.i>
    </motion.span>
  );
}

/** The hero name block (two rows). Starts scaled down so the long ARCHITECT row fits, grows to full size on morph. */
export default function HeroName({ morphed, x, y }: { morphed: boolean; x: MotionValue<number>; y: MotionValue<number> }) {
  const [row1, row2] = site.heroName;
  return (
    <motion.h1 aria-label={site.fullName} style={{ x, y, transformOrigin: "50% 0%" }}
      initial={{ scale: 0.66 }} animate={{ scale: morphed ? 1 : 0.66 }} transition={{ duration: 1.15, ease: [0.77, 0, 0.18, 1] }}
      className="font-display pointer-events-none absolute inset-x-0 top-[12vh] z-[3] flex select-none flex-col items-center text-center leading-[0.9] whitespace-nowrap md:top-[13vh]">
      <span className="block w-max overflow-hidden py-[.05em] text-[clamp(34px,min(12.4vw,18vh),230px)]" aria-hidden>
        <ArchitectWord morphed={morphed} />
        <span className="ml-[.22em]"><Word delay={0.35} fade>{row1[1]}</Word></span>
      </span>
      <span className="block w-max overflow-hidden py-[.05em] text-[clamp(34px,min(12.4vw,18vh),230px)]" aria-hidden>
        <Word delay={0.5} outline>{row2[0]}</Word>
        <span className="ml-[.22em]"><Word delay={0.65} fade>{row2[1]}</Word></span>
      </span>
    </motion.h1>
  );
}
