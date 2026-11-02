"use client";
import { motion } from "framer-motion";
import { C, SceneArt, drawIn, popIn } from "./art";

const rise = (d: number) => ({
  initial: { y: 160, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { type: "spring" as const, stiffness: 110, damping: 15, delay: d },
});

/** Mountains rising behind the word, a mustard sun, a summit flag, a winding trail and a plane crossing over. */
export default function Traveller() {
  return (
    <SceneArt>
      {/* sun */}
      <motion.circle cx={575} cy={200} r={74} fill={C.accent} {...popIn(0, 0.05)} />

      {/* plane + trail */}
      <motion.g initial={{ x: -260, y: 20, opacity: 0 }} animate={{ x: 820, y: -10, opacity: 1 }} transition={{ duration: 2.2, delay: 0.1, ease: "easeInOut" }}>
        <path d="M-120 82 H-12" stroke={C.fill3} strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" />
        <path d="M0 80 L46 70 L74 40 L88 40 L74 70 L102 70 L112 56 L122 56 L116 80 L122 104 L112 104 L102 90 L74 90 L88 120 L74 120 L46 90 Z" fill={C.paper} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
      </motion.g>

      {/* mountains, back to front */}
      <motion.path d="M0 440 L120 320 L200 390 L320 250 L450 410 L560 340 L690 450 L800 350 V600 H0Z" fill={C.fill} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" {...rise(0.1)} />
      <motion.g {...rise(0.25)}>
        <path d="M90 600 L350 180 L430 290 L490 235 L760 600Z" fill={C.fill2} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
        <path d="M350 180 L312 242 L338 232 L358 262 L384 238 L410 252Z" fill={C.paper} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
        <path d="M490 235 L462 280 L484 272 L500 292 L520 274 L540 284Z" fill={C.paper} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
      </motion.g>

      {/* summit flag */}
      <motion.g {...popIn(0, 0.9)}>
        <path d="M350 180 V120" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
        <path d="M352 122 L398 138 L352 156Z" fill={C.accent} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
      </motion.g>

      {/* trail */}
      <motion.path d="M430 600 C470 540 380 520 415 470 C450 420 360 400 385 335 C400 300 352 280 352 232" fill="none" stroke={C.paper} strokeWidth={6} strokeDasharray="2 14" strokeLinecap="round" {...drawIn(0.6, 1.1)} />

      {/* pines */}
      {[{ x: 60, y: 560, s: 1 }, { x: 120, y: 575, s: 0.8 }, { x: 700, y: 565, s: 1.1 }, { x: 650, y: 580, s: 0.8 }].map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
          <motion.g {...popIn(i, 0.8)}>
            <path d="M0 -70 L26 -22 H10 L32 14 H-32 L-10 -22 H-26Z" fill={C.fill3} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
            <path d="M0 14 V30" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
          </motion.g>
        </g>
      ))}

      {/* compass */}
      <motion.g {...popIn(0, 1.0)}>
        <circle cx={150} cy={190} r={46} fill={C.paper} stroke={C.ink} strokeWidth={4} />
        <path d="M150 156 L162 190 L150 224 L138 190Z" fill={C.fill2} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
        <path d="M150 156 L162 190 L138 190Z" fill={C.accent} />
        <circle cx={150} cy={190} r={4} fill={C.ink} />
      </motion.g>
    </SceneArt>
  );
}
