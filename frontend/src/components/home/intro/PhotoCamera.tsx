"use client";
import { motion } from "framer-motion";
import { C } from "./art";

/**
 * The photographer scene's camera. The lens glass reflects a little mountain + sun (it "portrays" the view),
 * and the top display shows `text` (typed word, then the cheese countdown). `pressed` pushes the shutter,
 * `focus` makes the lens ring hunt back and forth.
 */
export default function PhotoCamera({ text, pressed, focus }: { text: string; pressed: boolean; focus: boolean }) {
  return (
    <svg viewBox="0 0 520 380" xmlns="http://www.w3.org/2000/svg" className="block h-auto w-full overflow-visible" role="img" aria-label="Camera">
      <defs>
        <clipPath id="lensClip"><circle cx="260" cy="236" r="72" /></clipPath>
        <radialGradient id="glass" cx="38%" cy="32%" r="80%">
          <stop offset="0" stopColor="#9a9ca1" /><stop offset="1" stopColor="#4d4f53" />
        </radialGradient>
      </defs>

      {/* shutter button */}
      <rect x="112" y={pressed ? 60 : 50} width="52" height="18" rx="7" fill={C.fill3} stroke={C.ink} strokeWidth="3" style={{ transition: "y .09s" }} />
      {/* viewfinder bump */}
      <rect x="206" y="24" width="108" height="58" rx="14" fill={C.fill2} stroke={C.ink} strokeWidth="4" />
      <rect x="226" y="40" width="68" height="26" rx="6" fill={C.paper} stroke={C.ink} strokeWidth="3" />
      {/* body */}
      <rect x="16" y="64" width="488" height="290" rx="38" fill={C.fill} stroke={C.ink} strokeWidth="5" />
      <path d="M16 102 Q16 64 54 64 H466 Q504 64 504 102 V148 H16 Z" fill="#c6c6c6" />
      <path d="M16 148 H504" stroke={C.ink} strokeWidth="4" />
      {/* grip dots */}
      {Array.from({ length: 5 }, (_, r) => Array.from({ length: 2 }, (_, c) => (
        <circle key={`${r}${c}`} cx={44 + c * 14} cy={200 + r * 22} r="3" fill={C.fill3} />
      )))}
      {/* mode dial */}
      <circle cx="86" cy="104" r="22" fill={C.fill2} stroke={C.ink} strokeWidth="3.5" />
      <path d="M86 86 V96 M70 104 H80 M92 104 H102" stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
      {/* flash window + status LED */}
      <rect x="196" y="90" width="38" height="40" rx="6" fill="none" />
      <circle cx="462" cy="166" r="6" fill={pressed ? C.accent : C.fill3} stroke={C.ink} strokeWidth="2.5" />

      {/* top display */}
      <rect x="326" y="82" width="162" height="50" rx="9" fill={C.ink} stroke={C.fill3} strokeWidth="3" />
      <text x="338" y="114" fontFamily="'Courier New', monospace" fontSize="19" fontWeight="700" fill={C.accent} letterSpacing="1">
        {text}
        <motion.tspan animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.9 }}>_</motion.tspan>
      </text>

      {/* lens */}
      <circle cx="260" cy="236" r="118" fill={C.fill3} stroke={C.ink} strokeWidth="5" />
      <motion.g animate={{ rotate: focus ? [0, 9, -7, 4, 0] : 0 }} transition={{ duration: 1.1, ease: "easeInOut" }} style={{ transformOrigin: "260px 236px" }}>
        <circle cx="260" cy="236" r="106" fill="none" stroke={C.fill2} strokeWidth="9" strokeDasharray="3 9" />
        <circle cx="260" cy="236" r="94" fill={C.fill2} stroke={C.ink} strokeWidth="3.5" />
      </motion.g>
      <circle cx="260" cy="236" r="80" fill="url(#glass)" stroke={C.ink} strokeWidth="4" />
      {/* what the lens sees */}
      <g clipPath="url(#lensClip)">
        <rect x="180" y="160" width="160" height="160" fill="#a7a9ad" />
        <circle cx="296" cy="208" r="13" fill={C.accent} />
        <path d="M180 300 L222 232 L248 262 L284 214 L340 300 Z" fill="#e3e3e4" />
        <path d="M180 300 L240 268 L300 300 Z" fill="#c6c6c6" />
      </g>
      <circle cx="260" cy="236" r="72" fill="none" stroke="#ffffff" strokeOpacity=".18" strokeWidth="2" />
      <path d="M208 206 A62 62 0 0 1 252 170" fill="none" stroke="#ffffff" strokeOpacity=".7" strokeWidth="7" strokeLinecap="round" />
      <circle cx="228" cy="288" r="5" fill="#ffffff" fillOpacity=".5" />
    </svg>
  );
}
