"use client";
import { motion } from "framer-motion";
import { C, SceneArt, drawIn, popIn } from "./art";

/** A building that draws itself like a blueprint, with dimension lines and a drafting compass. */
function Block({ x, y, w, h, d, fill }: { x: number; y: number; w: number; h: number; d: number; fill: string }) {
  return (
    <motion.rect x={x} y={y} width={w} height={h} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" fill={fill}
      initial={{ pathLength: 0, fillOpacity: 0 }} animate={{ pathLength: 1, fillOpacity: 1 }}
      transition={{ pathLength: { duration: 0.7, delay: d, ease: "easeInOut" }, fillOpacity: { duration: 0.35, delay: d + 0.45 } }} />
  );
}

export default function Architect() {
  const windows = Array.from({ length: 6 }, (_, r) => Array.from({ length: 3 }, (_, c) => ({ r, c }))).flat();
  return (
    <SceneArt>
      {/* faint blueprint grid */}
      {[100, 200, 300, 400, 500].map((y, i) => <motion.line key={y} x1={40} x2={760} y1={y} y2={y} stroke={C.fill2} strokeWidth={1} strokeDasharray="4 8" {...drawIn(i * 0.05, 0.6)} />)}
      {[120, 240, 360, 480, 600, 720].map((x, i) => <motion.line key={x} y1={50} y2={520} x1={x} x2={x} stroke={C.fill2} strokeWidth={1} strokeDasharray="4 8" {...drawIn(i * 0.05, 0.6)} />)}

      <Block x={210} y={320} w={120} h={185} d={0.25} fill={C.fill3} />
      <Block x={460} y={230} w={100} h={275} d={0.15} fill={C.fill} />
      <Block x={340} y={110} w={110} h={395} d={0.05} fill={C.fill2} />
      {/* house */}
      <motion.polygon points="565,335 630,272 695,335" fill={C.fill} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" {...drawIn(0.35, 0.6)} />
      <Block x={578} y={335} w={104} h={170} d={0.4} fill={C.paper} />

      {/* windows pop on the tower */}
      {windows.map(({ r, c }, i) => (
        <motion.rect key={i} x={356 + c * 32} y={132 + r * 56} width={18} height={30} rx={3} fill={r === 2 && c === 1 ? C.accent : C.paper} {...popIn(i * 0.35, 0.7)} />
      ))}

      <motion.line x1={60} x2={740} y1={505} y2={505} stroke={C.ink} strokeWidth={4} strokeLinecap="round" {...drawIn(0, 0.7)} />

      {/* dimension lines (mustard) */}
      <motion.path d="M296 110 V505 M286 110 H306 M286 505 H306" stroke={C.accent} strokeWidth={3.5} fill="none" strokeLinecap="round" {...drawIn(0.9, 0.7)} />
      <motion.path d="M340 545 H450 M340 535 V555 M450 535 V555" stroke={C.accent} strokeWidth={3.5} fill="none" strokeLinecap="round" {...drawIn(1.0, 0.6)} />
      <motion.text x={270} y={320} fontSize={22} fontFamily="Impact, sans-serif" fill={C.ink} transform="rotate(-90 270 320)" textAnchor="middle"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>38.00 m</motion.text>
      <motion.text x={395} y={580} fontSize={22} fontFamily="Impact, sans-serif" fill={C.ink} textAnchor="middle"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>11.00</motion.text>

      {/* drafting compass */}
      <motion.g {...popIn(0, 0.6)}>
        <path d="M660 160 L628 250 M660 160 L694 250" stroke={C.ink} strokeWidth={6} strokeLinecap="round" fill="none" />
        <circle cx={660} cy={150} r={20} fill={C.paper} stroke={C.ink} strokeWidth={4} />
        <circle cx={660} cy={150} r={7} fill={C.accent} />
        <path d="M628 250 l-3 12" stroke={C.accent} strokeWidth={4} strokeLinecap="round" />
      </motion.g>

      {/* set square */}
      <motion.path d="M90 120 V280 H250 Z M120 175 V240 H185 Z" fill={C.fill} stroke={C.ink} strokeWidth={3.5} fillRule="evenodd" strokeLinejoin="round" {...popIn(2, 0.5)} />
    </SceneArt>
  );
}
