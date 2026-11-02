"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Flat grey palette for the intro scenes, with mustard as the only colour. */
export const C = {
  paper: "#ffffff",
  fill: "#d2d2d2",
  fill2: "#b9b9b9",
  fill3: "#9d9d9f",
  stroke: "#808080",
  ink: "#4d4f53",
  accent: "#f7b500",
} as const;

/** Lets SVG shapes scale / rotate around their own centre. */
export const origin = { transformBox: "fill-box", transformOrigin: "center" } as const;

/** Springy pop-in; `i` staggers siblings. */
export const popIn = (i = 0, base = 0.05) => ({
  initial: { scale: 0, opacity: 0, rotate: -14 },
  animate: { scale: 1, opacity: 1, rotate: 0 },
  transition: { type: "spring" as const, stiffness: 260, damping: 13, delay: base + i * 0.07 },
  style: origin,
});

/** Stroke draws itself. */
export const drawIn = (delay = 0, duration = 0.8) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { duration, delay, ease: "easeInOut" as const }, opacity: { duration: 0.01, delay } },
});

/** Slow vertical bob so popped-up elements feel alive. */
export function Float({ i = 0, amp = 8, children }: { i?: number; amp?: number; children: ReactNode }) {
  return (
    <motion.g animate={{ y: [0, -amp, 0] }} transition={{ duration: 2.4 + (i % 4) * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}>
      {children}
    </motion.g>
  );
}

/** Heart centred on (0, 0), about 70 wide. Use inside <g transform=...>. */
export const HEART = "M0 -8 C-4 -32 -36 -32 -36 -6 C-36 14 -10 28 0 42 C10 28 36 14 36 -6 C36 -32 4 -32 0 -8Z";

/** Full-bleed scene canvas: 800 x 600 viewBox, centred, fades on exit. */
export function SceneArt({ children }: { children: ReactNode }) {
  return (
    <motion.div aria-hidden className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.3 }}>
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" className="h-full w-full overflow-visible">{children}</svg>
    </motion.div>
  );
}
