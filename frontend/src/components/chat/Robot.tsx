"use client";
import { useEffect, useId, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type Mood = "idle" | "scared" | "run" | "perch" | "type" | "dance" | "knock" | "pull";

/**
 * The assistant: a small yellow robot on tracks with two binocular eyes.
 *  - asleep: grey body that fills with mustard as it charges (charge 0-100), eyes shut, breathing
 *  - waking: slow heavy-lidded blinks, a yawn on the chest screen, a big stretch, then it perks up
 *  - awake: head and eyes follow the mouse (or the finger)
 *  - moods: scared (shaking), run (arms pumping), perch (hands on the chat card), type (hammering away),
 *    dance (arms up and down); `tired` makes it sweat and then pant as the questions pile up
 */
export default function Robot({ charge = 100, awake = true, waking = false, mood = "idle", tired = 0, waving = false, free = false, className }: {
  charge?: number; awake?: boolean; waking?: boolean; mood?: Mood; tired?: 0 | 1 | 2; waving?: boolean; free?: boolean; className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const svg = useRef<SVGSVGElement>(null);
  const head = useRef<SVGGElement>(null);
  const pupils = useRef<SVGGElement>(null);
  // read inside the animation loop, so changing them never restarts it (the head would snap)
  const live = useRef({ waking, mood, tired, free });
  live.current = { waking, mood, tired, free };
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
    const droop = { ux: 0, uy: 0.3, roll: 9, mag: 0.3 };
    const tgt = { ux: 0, uy: 0.3, roll: 0, mag: 0 };
    const cur = live.current.waking ? { ...droop } : { ...tgt };
    const t0 = performance.now();
    let nextGaze = 0;
    const gaze = { ux: 0, uy: 0.2, roll: 0, mag: 1 };
    const move = (e: PointerEvent) => {
      const r = s.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.25);
      const d = Math.hypot(dx, dy) || 1;
      tgt.ux = dx / d; tgt.uy = dy / d;
      tgt.roll = Math.max(-24, Math.min(24, (dx / (window.innerWidth * 0.5)) * 26));
      tgt.mag = Math.min(1, d / 140);
    };
    let raf = 0;
    const tick = (now: number) => {
      const { waking: w, mood: m, tired: t, free: f } = live.current;
      // heavy head while just woken, hands-down look while typing, drooping when worn out
      let goal = w && now - t0 < 1100 ? droop : tgt;
      if (f) {
        // eyes free: it looks wherever it likes, in its own time
        if (now > nextGaze) {
          const a = Math.random() * Math.PI * 2;
          gaze.ux = Math.cos(a); gaze.uy = Math.sin(a) * 0.8; gaze.roll = (Math.random() - 0.5) * 20;
          nextGaze = now + 600 + Math.random() * 1100;
        }
        goal = gaze;
      }
      if (m === "type") goal = { ux: 0, uy: 1, roll: 0, mag: 0.7 };
      if (m === "scared") goal = { ux: 0, uy: -0.2, roll: 0, mag: 0 };
      const extraRoll = t === 2 ? 11 : t === 1 ? 4 : 0;
      const k = w ? 0.05 : m === "type" ? 0.3 : 0.14;
      cur.ux += (goal.ux - cur.ux) * k; cur.uy += (goal.uy - cur.uy) * k;
      cur.roll += (goal.roll + extraRoll - cur.roll) * k; cur.mag += (goal.mag - cur.mag) * k;
      h.style.transform = `translate(${(cur.ux * cur.mag * 3).toFixed(2)}px,${(cur.uy * cur.mag * 2 + (t === 2 ? 2 : 0)).toFixed(2)}px) rotate(${cur.roll.toFixed(2)}deg)`;
      p.setAttribute("transform", `translate(${(cur.ux * 4.5).toFixed(2)} ${(cur.uy * 4).toFixed(2)})`);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, [awake]);

  const arm = (side: "L" | "R") => {
    if (!awake) return "";
    if (waking) return `bot-stretch${side}`;
    switch (mood) {
      case "scared": return `bot-scared${side}`;
      case "run": return `bot-run${side}`;
      case "type": return `bot-type${side}`;
      case "dance": return `bot-dance${side}`;
      case "knock": return side === "R" ? "bot-knockR" : "bot-danceL";
      case "pull": return `bot-pull${side}`;
      case "perch": return tired === 2 ? `bot-slump${side}` : `bot-perch${side}`;
      default: return side === "R" && waving ? "bot-wave" : "";
    }
  };

  const scared = mood === "scared";
  const eyes = [28, 56];
  const lidClass = !awake ? "bot-asleep" : waking ? "bot-wakelid" : "bot-blink";
  const lidStyle = { "--lid": tired === 2 ? 0.5 : tired === 1 ? 0.25 : 0 } as CSSProperties;
  const bodyClass = !awake ? "bot-breathe" : waking ? "bot-stretchbody" : mood === "idle" && tired === 0 ? "bot-bob" : "";

  return (
    <svg ref={svg} viewBox="0 0 84 98" overflow="visible" className={cn("block h-full w-full", className)} aria-hidden>
      <defs>
        <clipPath id={`${id}b`}><rect x="14" y="46" width="56" height="42" rx="11" /></clipPath>
      </defs>

      {/* sleeping Z's */}
      {!awake && [0, 0.9, 1.8].map((d, i) => (
        <text key={i} x={64 + i * 4} y={14 - i * 2} fontSize={9 + i * 2} fontWeight={700} className="bot-z fill-g500" style={{ animationDelay: `${d}s`, opacity: 0 }}>z</text>
      ))}

      <g className={cn("bot-body", bodyClass)}>
        {/* tracks */}
        <rect x="10" y="86" width="64" height="11" rx="5.5" className="fill-ink" />
        {[22, 42, 62].map((x) => <circle key={x} cx={x} cy="91.5" r="3" className="fill-g300" />)}

        {/* arms */}
        <g className={cn("bot-arm bot-armL", arm("L"))}><rect x="4" y="54" width="9" height="22" rx="4.5" className="fill-ink" /></g>
        <g className={cn("bot-arm bot-armR", arm("R"))}><rect x="71" y="54" width="9" height="22" rx="4.5" className="fill-ink" /></g>

        {/* body: grey, filled with mustard from the bottom as it charges */}
        <rect x="14" y="46" width="56" height="42" rx="11" className="fill-g200" />
        <g clipPath={`url(#${id}b)`}>
          <rect x="14" y={46 + 42 * (1 - (full ? 1 : c))} width="56" height={42 * (full ? 1 : c) + 1} className="fill-accent" />
        </g>
        <rect x="14" y="46" width="56" height="42" rx="11" fill="none" strokeWidth="2.5" className="stroke-ink" />

        {/* chest screen: the charging bolt, a yawning mouth while waking */}
        <rect x="29" y="58" width="26" height="16" rx="4" className="fill-ink" />
        {waking
          ? <ellipse cx="42" cy="66" rx="4" ry="3" className="bot-yawn fill-accent" />
          : <path d="M44 59.5 L37.5 67 H42 L40.5 73 L47 65 H42.5 Z" className={cn("fill-accent", !awake && "bot-bolt")} />}

        {/* neck + head */}
        <rect x="39" y="36" width="6" height="12" className="fill-ink" />
        <g ref={head} style={{ transformOrigin: "42px 38px", transformBox: "view-box" }}>
          <line x1="42" y1="14" x2="42" y2="5" strokeWidth="2.5" strokeLinecap="round" className="stroke-ink" />
          <circle cx="42" cy="4" r="3.2" className={cn("fill-accent", awake && tired < 2 && "pulse-dot")} />
          <rect x="22" y="13" width="40" height="20" rx="10" className="fill-ink" />
          {eyes.map((x) => <circle key={x} cx={x} cy="22" r="13.5" className="fill-paper" />)}
          <g ref={pupils}>
            {eyes.map((x) => (
              <g key={x}>
                <circle cx={x} cy="22" r={scared ? 3.6 : 6.2} className="fill-ink" style={{ transition: "r .15s" }} />
                <circle cx={x - 2} cy="19.5" r={scared ? 1.2 : 1.9} className="fill-paper" />
              </g>
            ))}
          </g>
          {/* eyelids: closed asleep, slow and heavy while waking, a quick blink after, droopier when tired */}
          {eyes.map((x) => <circle key={x} cx={x} cy="22" r="13.6" className={cn("bot-lid fill-g300", lidClass)} style={lidStyle} />)}
          {!awake && eyes.map((x) => <path key={x} d={`M${x - 7} 24 Q${x} 29 ${x + 7} 24`} fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-ink" />)}
          {eyes.map((x) => <circle key={x} cx={x} cy="22" r="13.5" fill="none" strokeWidth="2.5" className="stroke-ink" />)}

          {/* worn out: a sweat drop, then puffs of breath */}
          {tired >= 1 && <path d="M66 12 q-3.2 4.6 0 6.4 q3.2 -1.8 0 -6.4z" className="bot-sweat fill-accent-d" />}
          {tired === 2 && [0, 0.5].map((d) => <circle key={d} cx="66" cy="30" r="3" className="bot-puff fill-g300" style={{ animationDelay: `${d}s` }} />)}
        </g>
      </g>
    </svg>
  );
}
