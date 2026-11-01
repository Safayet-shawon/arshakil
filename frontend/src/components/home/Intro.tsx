"use client";
import { AnimatePresence, motion, type TargetAndTransition } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { introRoles, site } from "@/data/site";
import { markIntroDone } from "@/lib/intro";
import { cn, lerp, pad3, prefersReducedMotion } from "@/lib/utils";
import Camera from "./Camera";

/**
 * Entry sequence:
 *  count 1 -> 99 (roles on the left, number fills grey -> mustard)
 *  -> hold at 99 with "AND…" hanging -> 100 -> "Say cheeseee!" + camera
 *  -> shutter + flash -> polaroid pops, "PHOTOGRAPHER" blooms -> curtain lifts, hero starts.
 */
type Phase = "count" | "tension" | "cheese" | "photo" | "exit";

const COUNT_MS = 3800;
const SAY = "Say cheeseee!";
const REVEAL = "Photographer";
const ease = [0.16, 1, 0.3, 1] as const;

function Letters({ text, className, step = 0.04, delay = 0, hidden, shown }: {
  text: string; className?: string; step?: number; delay?: number;
  hidden: TargetAndTransition; shown: TargetAndTransition;
}) {
  return (
    <span className={cn("flex justify-center", className)} aria-label={text}>
      {[...text].map((c, i) => (
        <motion.span key={i} aria-hidden className="inline-block" initial={hidden} animate={shown}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: delay + i * step }}>
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </span>
  );
}

export default function Intro() {
  const [phase, setPhase] = useState<Phase>("count");
  const [value, setValue] = useState(1);
  const [role, setRole] = useState(0);
  const [snap, setSnap] = useState(false);
  const [flash, setFlash] = useState(false);
  const [gone, setGone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const raf = useRef(0);

  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  const exited = useRef(false);
  const exit = useCallback(() => {
    if (exited.current) return;
    exited.current = true;
    setPhase("exit");
    later(markIntroDone, 450);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) { markIntroDone(); setGone(true); return; }
    document.documentElement.classList.add("lenis-stopped");
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / COUNT_MS, 1);
      const e = 1 - Math.pow(1 - p, 1.8);
      setValue(Math.min(99, Math.max(1, Math.round(e * 100))));
      setRole(Math.min(introRoles.length - 1, Math.floor(p * introRoles.length)));
      if (p < 1) { raf.current = requestAnimationFrame(tick); return; }

      // tension: hold on 99 while "AND…" hangs, then 100 -> cheese -> snap -> flash/photo -> exit
      setPhase("tension"); setRole(introRoles.length);
      later(() => setValue(100), 1500);
      later(() => setPhase("cheese"), 2000);
      later(() => setSnap(true), 3700);
      later(() => { setFlash(true); setPhase("photo"); }, 3850);
      later(exit, 6700);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      timers.current.forEach(clearTimeout);
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [exit]);

  useEffect(() => {
    if (phase === "exit") document.documentElement.classList.remove("lenis-stopped");
  }, [phase]);

  if (gone) return null;

  const t = value / 100;
  const c = (a: number[], b: number[], k: number) => `rgb(${lerp(a[0], b[0], k)},${lerp(a[1], b[1], k)},${lerp(a[2], b[2], k)})`;
  const vars = {
    "--p": `${value}%`,
    "--fill": c([77, 79, 83], [247, 181, 0], t),
    "--stroke": c([163, 163, 163], [247, 181, 0], t * 0.8),
  } as CSSProperties;

  const stageA = phase === "count" || phase === "tension";
  const cheese = phase === "cheese" || phase === "photo" || phase === "exit";
  const photo = phase === "photo" || phase === "exit";
  const corner = "absolute h-[34px] w-[34px] border-0 transition-colors duration-400";
  const cornerColor = cheese ? "border-accent" : "border-g500";

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div key="intro" aria-hidden exit={{ y: "-100%" }} transition={{ duration: 1, ease: [0.77, 0, 0.18, 1] }}
          className="fixed inset-0 z-[1000] overflow-hidden bg-g200" style={vars}>
          {/* soft mustard glow that grows with the count */}
          <div className="pointer-events-none absolute inset-0 transition-opacity duration-200" style={{
            opacity: t * 0.95,
            background: "radial-gradient(62% 62% at 82% 90%, rgba(247,181,0,.34), transparent 72%), radial-gradient(40% 40% at 8% 12%, rgba(247,181,0,.12), transparent 70%)",
          }} />

          <div className="label absolute inset-x-5 top-[22px] flex justify-between text-g600 md:inset-x-[clamp(20px,3.4vw,48px)]">
            <span>{site.firm} — Portfolio</span><span>{site.location}</span>
          </div>
          {/* viewfinder corners, locked to mustard once the camera shows up */}
          <i className={cn(corner, cornerColor, "left-5 top-16 border-l-2 border-t-2 md:left-[clamp(20px,3.4vw,48px)]")} />
          <i className={cn(corner, cornerColor, "right-5 top-16 border-r-2 border-t-2 md:right-[clamp(20px,3.4vw,48px)]")} />
          <i className={cn(corner, cornerColor, "bottom-16 left-5 border-b-2 border-l-2 md:left-[clamp(20px,3.4vw,48px)]")} />
          <i className={cn(corner, cornerColor, "bottom-16 right-5 border-b-2 border-r-2 md:right-[clamp(20px,3.4vw,48px)]")} />
          <div className="label absolute bottom-[72px] left-[calc(clamp(20px,3.4vw,48px)+46px)] text-[10px] tracking-[0.18em] text-g500 max-md:hidden">ISO 100 · 1/125 · f/2.8</div>
          <button onClick={exit} data-link className="label absolute bottom-[22px] left-5 text-g500 md:left-[clamp(20px,3.4vw,48px)]">Click to skip</button>

          {/* stage A — roles + counter */}
          <motion.div className="absolute inset-0" animate={stageA ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }} transition={{ duration: 0.5 }}>
            <ul className="absolute left-[calc(clamp(20px,3.4vw,48px)+30px)] top-1/2 grid -translate-y-1/2 gap-[clamp(4px,1vh,12px)] md:left-[calc(clamp(20px,3.4vw,48px)+46px)]">
              {introRoles.map((r, i) => (
                <li key={r} className={cn("font-display text-[clamp(28px,min(4.8vw,9vh),80px)] leading-none transition-all duration-500",
                  i === role ? "translate-x-[18px] text-ink [-webkit-text-stroke:1.5px_var(--color-ink)]"
                    : i < role ? "text-g400 [-webkit-text-stroke:1.5px_var(--color-g400)]"
                      : "text-outline-soft")}>{r}</li>
              ))}
              <li className={cn("font-display text-[clamp(28px,min(4.8vw,9vh),80px)] leading-none text-outline translate-x-[18px] transition-opacity duration-400", role >= introRoles.length ? "opacity-100" : "opacity-0")}>
                And<span className="dots text-accent [-webkit-text-stroke:0]"><span>.</span><span>.</span><span>.</span></span>
              </li>
            </ul>
            <div className={cn("absolute bottom-[74px] right-5 font-display leading-[0.8] tabular-nums md:right-[calc(clamp(20px,3.4vw,48px)+46px)]",
              "text-[clamp(64px,min(11vw,24vh),200px)] text-transparent [-webkit-text-stroke:2px_var(--stroke)]",
              "bg-[linear-gradient(to_top,var(--fill)_var(--p),transparent_var(--p))] bg-clip-text",
              phase === "tension" && value === 99 && "animate-[shake_.18s_infinite_alternate]")}>
              {pad3(value)}<small className="ml-[.1em] align-top text-[.22em] [-webkit-text-stroke:1.5px_var(--stroke)]">%</small>
            </div>
          </motion.div>

          {/* stage B — say cheese, camera, flash, polaroid, photographer */}
          <div className="absolute inset-x-0 top-[11%] flex justify-center overflow-hidden py-[.04em] font-display text-[clamp(46px,9.4vw,160px)] leading-[1.02] text-ink">
            <Letters text={SAY} step={0.038} hidden={{ y: "115%" }} shown={cheese ? (photo ? { y: "-30%", opacity: 0 } : { y: 0 }) : { y: "115%" }} />
          </div>

          <motion.div className="absolute bottom-[15vh] left-1/2 w-[clamp(240px,29vw,400px)]" style={{ x: "-50%" }}
            initial={{ y: "160%" }}
            animate={photo ? { y: "170%", rotate: 10, transition: { duration: 0.6, ease: [0.6, 0, 0.9, 0.4] } }
              : cheese ? { y: 0, transition: { type: "spring", stiffness: 90, damping: 11 } } : { y: "160%" }}>
            <Camera pressed={snap} />
          </motion.div>

          <motion.div className="absolute left-1/2 top-[40%] w-[clamp(190px,21vw,300px)] bg-paper p-2.5 pb-10 shadow-[0_30px_70px_rgba(77,79,83,0.22)]"
            initial={{ opacity: 0, scale: 0.15, rotate: -16, x: "-50%", y: "-50%" }}
            animate={photo ? { opacity: 1, scale: 1, rotate: -3, x: "-50%", y: "-56%" } : {}}
            transition={{ type: "spring", stiffness: 140, damping: 11 }}>
            <span className="absolute -top-[11px] left-1/2 h-5 w-[72px] -translate-x-1/2 -rotate-3 bg-accent/60" />
            <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-g100 to-[#efe3bd]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={site.heroImage} alt="" className="absolute left-[-11%] top-[3%] w-[122%] max-w-none" />
            </div>
            <em className="label absolute inset-x-0 bottom-3 text-center text-[10px] not-italic tracking-[0.2em] text-g500">{site.name} · Dhaka</em>
          </motion.div>

          <div className="absolute inset-x-0 bottom-[14%] flex justify-center font-display text-[clamp(44px,10.6vw,190px)] leading-none text-ink">
            <Letters text={REVEAL} step={0.045} delay={0.45} hidden={{ opacity: 0, y: "70%", scale: 0.5, rotate: 6 }}
              shown={photo ? { opacity: 1, y: 0, scale: 1, rotate: 0 } : { opacity: 0, y: "70%", scale: 0.5, rotate: 6 }} />
          </div>

          {flash && <div className="flash-go pointer-events-none absolute inset-0 z-[6] bg-white opacity-0" />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
