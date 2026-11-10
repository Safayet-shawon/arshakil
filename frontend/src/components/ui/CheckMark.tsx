"use client";
import { motion, useReducedMotion } from "framer-motion";

/** A mustard circle that draws itself, then the tick. Used for "message sent". */
export default function CheckMark({ size = 64, className }: { size?: number; className?: string }) {
  const still = useReducedMotion();
  const t = (duration: number, delay = 0) => (still ? { duration: 0 } : { duration, delay, ease: [0.16, 1, 0.3, 1] as const });
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" aria-hidden className={className}>
      <motion.circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: still ? 1 : 0 }} animate={{ pathLength: 1 }} transition={t(0.7)} />
      <motion.path d="M19 33.5l9.5 9.5L45.5 24" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: still ? 1 : 0 }} animate={{ pathLength: 1 }} transition={t(0.45, 0.5)} />
    </svg>
  );
}
