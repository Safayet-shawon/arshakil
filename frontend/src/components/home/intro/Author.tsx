"use client";
import { motion } from "framer-motion";
import { C, Float, SceneArt, origin, popIn } from "./art";

const glyphs = [
  { t: "A", x: 150, y: 190, s: 110, r: -12, c: C.fill3 },
  { t: "¶", x: 640, y: 150, s: 120, r: 10, c: C.accent },
  { t: "“", x: 250, y: 120, s: 130, r: -6, c: C.fill2 },
  { t: "&", x: 690, y: 330, s: 100, r: 14, c: C.fill3 },
  { t: "Aa", x: 120, y: 360, s: 80, r: 8, c: C.fill2 },
  { t: "”", x: 560, y: 230, s: 110, r: -10, c: C.fill2 },
];

const pages = [
  { x: 520, y: 90, r: 18 },
  { x: 190, y: 250, r: -16 },
  { x: 600, y: 400, r: 12 },
];

/** Open book, a stack of books and a quill, with letters and loose pages scattering out of it. */
export default function Author() {
  return (
    <SceneArt>
      {/* scattered letters */}
      {glyphs.map((g, i) => (
        <Float key={g.t + i} i={i}>
          <g transform={`rotate(${g.r} ${g.x} ${g.y})`}>
            <motion.text x={g.x} y={g.y} fontSize={g.s} fontFamily="Impact, sans-serif" fill={g.c} textAnchor="middle" {...popIn(i, 0.25)} style={origin}>{g.t}</motion.text>
          </g>
        </Float>
      ))}
      {/* loose pages */}
      {pages.map((p, i) => (
        <Float key={i} i={i + 2}>
          <g transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}>
            <motion.g {...popIn(i + 3, 0.3)}>
              <rect width={78} height={102} rx={6} fill={C.paper} stroke={C.ink} strokeWidth={3.5} />
              <path d="M14 24 h50 M14 42 h50 M14 60 h34" stroke={C.fill2} strokeWidth={5} strokeLinecap="round" />
            </motion.g>
          </g>
        </Float>
      ))}

      {/* stack of books */}
      <motion.g {...popIn(0, 0.0)}>
        <rect x={70} y={470} width={190} height={40} rx={6} fill={C.fill2} stroke={C.ink} strokeWidth={4} />
        <rect x={92} y={430} width={160} height={40} rx={6} fill={C.fill} stroke={C.ink} strokeWidth={4} />
        <rect x={60} y={390} width={180} height={40} rx={6} fill={C.fill3} stroke={C.ink} strokeWidth={4} />
        <rect x={60} y={404} width={180} height={10} fill={C.accent} />
      </motion.g>

      {/* open book */}
      <motion.g {...popIn(1, 0.0)}>
        <path d="M250 540 Q330 505 400 535 L400 420 Q330 390 250 424 Z" fill={C.paper} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
        <path d="M550 540 Q470 505 400 535 L400 420 Q470 390 550 424 Z" fill={C.paper} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
        <path d="M280 450 Q330 436 380 452 M280 476 Q330 462 380 478 M280 502 Q330 488 380 504 M420 452 Q470 436 520 450 M420 478 Q470 462 520 476" stroke={C.fill2} strokeWidth={6} strokeLinecap="round" fill="none" />
        <path d="M400 420 V535" stroke={C.ink} strokeWidth={4} />
      </motion.g>

      {/* quill */}
      <Float i={1} amp={6}>
        <motion.g {...popIn(2, 0.1)}>
          <path d="M520 360 C560 250 640 200 730 200 C720 270 650 340 540 392 Z" fill={C.paper} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
          <path d="M545 385 C600 320 660 260 725 205" fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
          <path d="M520 360 L498 420 L548 396 Z" fill={C.accent} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
        </motion.g>
      </Float>
    </SceneArt>
  );
}
