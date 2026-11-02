"use client";
import { motion } from "framer-motion";
import { C, Float, HEART, SceneArt, origin, popIn } from "./art";

/** A row of people holding hands under a big mustard heart, with care icons popping around (home, water, book, health). */
const people = [
  { x: 170, h: 1.0, f: C.fill2 },
  { x: 285, h: 0.72, f: C.fill },
  { x: 400, h: 1.15, f: C.accent },
  { x: 515, h: 0.8, f: C.fill },
  { x: 630, h: 1.0, f: C.fill2 },
];
const GROUND = 520;

function Person({ x, h, f, i }: { x: number; h: number; f: string; i: number }) {
  const body = 120 * h, head = 30 * h;
  return (
    <motion.g initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
      transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.05 + i * 0.09 }}>
      <path d={`M${x - 34 * h} ${GROUND} C${x - 34 * h} ${GROUND - body} ${x - 24 * h} ${GROUND - body - 6} ${x} ${GROUND - body - 6} C${x + 24 * h} ${GROUND - body - 6} ${x + 34 * h} ${GROUND - body} ${x + 34 * h} ${GROUND}Z`}
        fill={f} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={x} cy={GROUND - body - head - 10} r={head} fill={C.paper} stroke={C.ink} strokeWidth={4} />
      <circle cx={x - head * 0.35} cy={GROUND - body - head - 14} r={2.8} fill={C.ink} />
      <circle cx={x + head * 0.35} cy={GROUND - body - head - 14} r={2.8} fill={C.ink} />
      <path d={`M${x - head * 0.35} ${GROUND - body - head + 2} Q${x} ${GROUND - body - head + 12} ${x + head * 0.35} ${GROUND - body - head + 2}`} fill="none" stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
    </motion.g>
  );
}

export default function SocialWorker() {
  return (
    <SceneArt>
      <motion.line x1={60} x2={740} y1={GROUND} y2={GROUND} stroke={C.ink} strokeWidth={4} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />

      {/* joined hands */}
      {people.slice(0, -1).map((p, i) => {
        const q = people[i + 1];
        const y1 = GROUND - 70 * p.h, y2 = GROUND - 70 * q.h;
        return <motion.path key={i} d={`M${p.x + 30 * p.h} ${y1} Q${(p.x + q.x) / 2} ${Math.max(y1, y2) + 14} ${q.x - 30 * q.h} ${y2}`} fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }} />;
      })}
      {people.map((p, i) => <Person key={i} {...p} i={i} />)}

      {/* big heart above the middle person */}
      <Float i={0} amp={10}>
        <motion.g transform="translate(400 150) scale(2.3)">
          <motion.path d={HEART} fill={C.accent} stroke={C.ink} strokeWidth={2.5} strokeLinejoin="round" {...popIn(0, 0.7)} style={origin} />
        </motion.g>
      </Float>

      {/* care icons, scattered */}
      <Float i={1}>
        <motion.g {...popIn(1, 0.8)}>
          <path d="M100 250 L150 205 L200 250 V300 H100Z" fill={C.paper} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
          <rect x={138} y={262} width={24} height={38} fill={C.accent} stroke={C.ink} strokeWidth={3} />
        </motion.g>
      </Float>
      <Float i={2}>
        <motion.g {...popIn(2, 0.8)}>
          <path d="M660 200 C660 200 622 250 622 275 C622 296 639 312 660 312 C681 312 698 296 698 275 C698 250 660 200 660 200Z" fill={C.paper} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
          <path d="M645 280 C645 292 652 298 662 298" fill="none" stroke={C.fill3} strokeWidth={4} strokeLinecap="round" />
        </motion.g>
      </Float>
      <Float i={3}>
        <motion.g {...popIn(3, 0.8)}>
          <rect x={565} y={90} width={76} height={92} rx={8} fill={C.paper} stroke={C.ink} strokeWidth={4} />
          <path d="M586 90 V182" stroke={C.ink} strokeWidth={4} />
          <path d="M600 112 h28 M600 130 h28 M600 148 h18" stroke={C.fill3} strokeWidth={5} strokeLinecap="round" />
        </motion.g>
      </Float>
      <Float i={4}>
        <motion.g {...popIn(4, 0.8)}>
          <circle cx={190} cy={130} r={40} fill={C.paper} stroke={C.ink} strokeWidth={4} />
          <path d="M190 108 V152 M168 130 H212" stroke={C.accent} strokeWidth={12} strokeLinecap="round" />
        </motion.g>
      </Float>
      {[{ x: 90, y: 400, s: 0.4 }, { x: 720, y: 420, s: 0.5 }, { x: 330, y: 70, s: 0.35 }, { x: 500, y: 60, s: 0.4 }].map((h, i) => (
        <Float key={i} i={i + 5}>
          <motion.g transform={`translate(${h.x} ${h.y}) scale(${h.s})`}>
            <motion.path d={HEART} fill={C.accent} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" {...popIn(i + 4, 0.9)} style={origin} />
          </motion.g>
        </Float>
      ))}
    </SceneArt>
  );
}
