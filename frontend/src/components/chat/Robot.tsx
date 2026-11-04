"use client";
import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The assistant: a small yellow robot on tracks with two binocular eyes.
 * Asleep it is grey and fills with mustard as it charges (charge 0-100); awake its head and eyes
 * turn towards the mouse (or the finger).
 */
export default function Robot({ charge = 100, awake = true, waving = false, className }: { charge?: number; awake?: boolean; waving?: boolean; className?: string }) {
  const id = useId().replace(/:/g, "");
  const svg = useRef<SVGSVGElement>(null);
  const head = useRef<SVGGElement>(null);
  const pupils = useRef<SVGGElement>(null);
  const c = Math.max(0, Math.min(100, charge)) / 100;
  const full = awake || c >= 1;

  useEffect(() => {
    const h = head.current, p = pupils.current, s = svg.current;
    if (!h || !p || !s) return;
    if (!awake) {
      h.style.transition = "transform .7s ease";
      h.style.transform = "translate(0px,2px) rotate(9deg)";
      p.setAttribute("transform", "translate(0 0)");
      return;
    }
    h.style.transition = "none";
    const tgt = { ux: 0, uy: 0.3, roll: 0, mag: 0 };
    const cur = { ux: 0, uy: 0.3, roll: 0, mag: 0 };
    const move = (e: PointerEvent) => {
      const r = s.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.25);
      const d = Math.hypot(dx, dy) || 1;
      tgt.ux = dx / d; tgt.uy = dy / d;
      tgt.roll = Math.max(-24, Math.min(24, (dx / (window.innerWidth * 0.5)) * 26));
      tgt.mag = Math.min(1, d / 140);
    };
    let raf = 0;
    const tick = () => {
      const k = 0.14;
      cur.ux += (tgt.ux - cur.ux) * k; cur.uy += (tgt.uy - cur.uy) * k;
      cur.roll += (tgt.roll - cur.roll) * k; cur.mag += (tgt.mag - cur.mag) * k;
      h.style.transform = `translate(${(cur.ux * cur.mag * 3).toFixed(2)}px,${(cur.uy * cur.mag * 2).toFixed(2)}px) rotate(${cur.roll.toFixed(2)}deg)`;
      p.setAttribute("transform", `translate(${(cur.ux * 4.5).toFixed(2)} ${(cur.uy * 4).toFixed(2)})`);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, [awake]);

  const eyes = [28, 56];
  return (
    <svg ref={svg} viewBox="0 0 84 98" overflow="visible" className={cn("block h-full w-full", className)} aria-hidden>
      <defs>
        <clipPath id={`${id}b`}><rect x="14" y="46" width="56" height="42" rx="11" /></clipPath>
      </defs>

      {/* sleeping Z's */}
      {!awake && [0, 0.9, 1.8].map((d, i) => (
        <text key={i} x={64 + i * 4} y={14 - i * 2} fontSize={9 + i * 2} fontWeight={700} className="bot-z fill-g500" style={{ animationDelay: `${d}s`, opacity: 0 }}>z</text>
      ))}

      <g className={awake ? "bot-bob" : undefined}>
        {/* tracks */}
        <rect x="10" y="86" width="64" height="11" rx="5.5" className="fill-ink" />
        {[22, 42, 62].map((x) => <circle key={x} cx={x} cy="91.5" r="3" className="fill-g300" />)}

        {/* arms */}
        <rect x="4" y="54" width="9" height="22" rx="4.5" className="fill-ink" />
        <g className={waving ? "bot-wave" : undefined}><rect x="71" y="54" width="9" height="22" rx="4.5" className="fill-ink" /></g>

        {/* body: grey, filled with mustard from the bottom as it charges */}
        <rect x="14" y="46" width="56" height="42" rx="11" className="fill-g200" />
        <g clipPath={`url(#${id}b)`}>
          <rect x="14" y={46 + 42 * (1 - (full ? 1 : c))} width="56" height={42 * (full ? 1 : c) + 1} className="fill-accent" />
        </g>
        <rect x="14" y="46" width="56" height="42" rx="11" fill="none" strokeWidth="2.5" className="stroke-ink" />

        {/* chest screen with the charging bolt */}
        <rect x="29" y="58" width="26" height="16" rx="4" className="fill-ink" />
        <path d="M44 59.5 L37.5 67 H42 L40.5 73 L47 65 H42.5 Z" className={cn("fill-accent", !awake && "bot-bolt")} />

        {/* neck + head */}
        <rect x="39" y="36" width="6" height="12" className="fill-ink" />
        <g ref={head} style={{ transformOrigin: "42px 38px", transformBox: "view-box" }}>
          <line x1="42" y1="14" x2="42" y2="5" strokeWidth="2.5" strokeLinecap="round" className="stroke-ink" />
          <circle cx="42" cy="4" r="3.2" className={cn("fill-accent", awake && "pulse-dot")} />
          <rect x="22" y="13" width="40" height="20" rx="10" className="fill-ink" />
          {eyes.map((x) => <circle key={x} cx={x} cy="22" r="13.5" className="fill-paper" />)}
          <g ref={pupils}>
            {eyes.map((x) => (
              <g key={x}>
                <circle cx={x} cy="22" r="6.2" className="fill-ink" />
                <circle cx={x - 2} cy="19.5" r="1.9" className="fill-paper" />
              </g>
            ))}
          </g>
          {/* eyelids: closed while asleep, a quick blink when awake */}
          {eyes.map((x) => <circle key={x} cx={x} cy="22" r="13.6" className={cn("bot-lid fill-g300", awake ? "bot-blink" : "bot-asleep")} />)}
          {!awake && eyes.map((x) => <path key={x} d={`M${x - 7} 24 Q${x} 29 ${x + 7} 24`} fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-ink" />)}
          {eyes.map((x) => <circle key={x} cx={x} cy="22" r="13.5" fill="none" strokeWidth="2.5" className="stroke-ink" />)}
        </g>
      </g>
    </svg>
  );
}
