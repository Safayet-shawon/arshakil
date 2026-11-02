"use client";
import { motion } from "framer-motion";
import { C, Float, HEART, SceneArt, origin, popIn } from "./art";

/** A vlogger: ring light, headphones, phone on a selfie arm, and likes / LIVE / play badges popping around. */
export default function Creator() {
  const hearts = [{ x: 215, y: 190, s: 0.9 }, { x: 610, y: 105, s: 0.7 }, { x: 150, y: 400, s: 0.6 }, { x: 690, y: 350, s: 0.8 }];
  return (
    <SceneArt>
      {/* ring light */}
      <motion.g {...popIn(0, 0.0)}>
        <circle cx={400} cy={270} r={158} fill="none" stroke={C.paper} strokeWidth={22} />
        <circle cx={400} cy={270} r={158} fill="none" stroke={C.fill2} strokeWidth={4} />
        <circle cx={400} cy={270} r={147} fill="none" stroke={C.fill3} strokeWidth={2} strokeDasharray="2 10" strokeLinecap="round" />
      </motion.g>

      {/* shoulders + head */}
      <motion.g {...popIn(1, 0.0)}>
        <path d="M230 560 C230 440 320 405 400 405 C480 405 570 440 570 560 Z" fill={C.fill3} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
        <rect x={376} y={350} width={48} height={60} rx={18} fill={C.fill} stroke={C.ink} strokeWidth={4} />
        <circle cx={400} cy={285} r={72} fill={C.paper} stroke={C.ink} strokeWidth={4} />
        <path d="M326 280 C322 205 478 205 474 280 C452 246 348 246 326 280Z" fill={C.ink} />
        <path d="M322 285 C316 190 484 190 478 285" fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
        <rect x={310} y={268} width={22} height={48} rx={10} fill={C.accent} stroke={C.ink} strokeWidth={4} />
        <rect x={468} y={268} width={22} height={48} rx={10} fill={C.accent} stroke={C.ink} strokeWidth={4} />
        <circle cx={377} cy={290} r={5} fill={C.ink} />
        <circle cx={423} cy={290} r={5} fill={C.ink} />
        <path d="M376 316 Q400 338 424 316" fill="none" stroke={C.ink} strokeWidth={4.5} strokeLinecap="round" />
      </motion.g>

      {/* arm + phone */}
      <motion.g {...popIn(2, 0.0)}>
        <path d="M520 470 C590 440 612 380 622 330" fill="none" stroke={C.fill3} strokeWidth={34} strokeLinecap="round" />
        <path d="M520 470 C590 440 612 380 622 330" fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" opacity={0.0} />
        <rect x={585} y={170} width={100} height={168} rx={16} fill={C.ink} />
        <rect x={595} y={184} width={80} height={140} rx={8} fill={C.paper} />
        <polygon points="620,228 620,274 658,251" fill={C.accent} />
        <circle cx={603} cy={194} r={4.5} fill={C.accent} />
        <text x={612} y={199} fontSize={12} fontFamily="Impact, sans-serif" fill={C.ink}>REC</text>
        <circle cx={635} cy={178} r={3} fill={C.fill3} />
      </motion.g>

      {/* badges + hearts, scattered */}
      <Float i={0}>
        <motion.g {...popIn(4, 0.3)}>
          <rect x={95} y={90} width={104} height={42} rx={21} fill={C.accent} />
          <circle cx={118} cy={111} r={6} fill={C.paper} />
          <text x={132} y={120} fontSize={26} fontFamily="Impact, sans-serif" fill={C.ink}>LIVE</text>
        </motion.g>
      </Float>
      <Float i={1}>
        <motion.g {...popIn(5, 0.3)}>
          <circle cx={700} cy={470} r={38} fill={C.paper} stroke={C.ink} strokeWidth={4} />
          <polygon points="690,452 690,488 722,470" fill={C.accent} />
        </motion.g>
      </Float>
      <Float i={2}>
        <motion.g {...popIn(6, 0.3)}>
          <path d="M120 250 h96 a14 14 0 0 1 14 14 v44 a14 14 0 0 1 -14 14 h-58 l-24 22 v-22 h-14 a14 14 0 0 1 -14 -14 v-44 a14 14 0 0 1 14 -14Z" fill={C.paper} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" transform="translate(0 40)" />
          <path d="M140 316 h70 M140 336 h46" stroke={C.fill3} strokeWidth={5} strokeLinecap="round" />
        </motion.g>
      </Float>
      {hearts.map((h, i) => (
        <Float key={i} i={i + 3}>
          <motion.g transform={`translate(${h.x} ${h.y}) scale(${h.s})`}>
            <motion.path d={HEART} fill={C.accent} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" {...popIn(i + 5, 0.35)} style={origin} />
          </motion.g>
        </Float>
      ))}
    </SceneArt>
  );
}
