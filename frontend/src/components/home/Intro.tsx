"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { introRoles, site } from "@/data/site";
import { isIntroDone, markIntroDone, setIntroCharge } from "@/lib/intro";
import { cn, lerp, prefersReducedMotion } from "@/lib/utils";

/**
 * Loader: the roles light up one after another on the left while the number counts 000 -> 100
 * (grey -> mustard), then the curtain lifts straight into the hero. Click anywhere to skip.
 */
const COUNT_MS = 4600;
const HOLD_MS = 600;
const N = introRoles.length;
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

export default function Intro() {
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [value, setValue] = useState(1);
  const [role, setRole] = useState(0);
  const raf = useRef(0);
  const hold = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const exited = useRef(false);

  const exit = useCallback(() => {
    if (exited.current) return;
    exited.current = true;
    cancelAnimationFrame(raf.current);
    clearTimeout(hold.current);
    document.documentElement.classList.remove("lenis-stopped");
    setLeaving(true);
    setTimeout(markIntroDone, 450);
  }, []);

  useEffect(() => {
    // already played in this tab (e.g. coming back home from another page): skip it
    if (isIntroDone() || prefersReducedMotion() || window.self !== window.top) { markIntroDone(); setGone(true); return; }
    document.documentElement.classList.add("lenis-stopped");
    const t0 = performance.now();
    setIntroCharge(true, 1);
    const tick = (now: number) => {
      const p = Math.min((now - t0) / COUNT_MS, 1);
      const v = Math.max(1, Math.round(easeInOut(p) * 100));
      setValue(v);
      setIntroCharge(true, v);
      setRole(Math.min(N - 1, Math.floor(p * N)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else hold.current = setTimeout(exit, HOLD_MS);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(hold.current);
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [exit]);

  if (gone) return null;

  const t = value / 100;
  const c = (a: number[], b: number[], k: number) => `rgb(${lerp(a[0], b[0], k)},${lerp(a[1], b[1], k)},${lerp(a[2], b[2], k)})`;
  const vars = {
    "--p": `${value}%`,
    "--fill": c([77, 79, 83], [247, 181, 0], t),
    "--stroke": c([163, 163, 163], [247, 181, 0], t * 0.8),
  } as CSSProperties;
  const corner = "absolute h-[34px] w-[34px] border-0 border-g500";
  const size = "text-[clamp(26px,min(4.8vw,9vh),80px)]";

  return (
    <AnimatePresence onExitComplete={() => setGone(true)}>
      {!leaving && (
        <motion.div key="intro" aria-hidden onClick={exit} exit={{ y: "-100%" }} transition={{ duration: 1, ease: [0.77, 0, 0.18, 1] }}
          className="fixed inset-0 z-[1000] overflow-hidden bg-g200" style={vars}>
          {/* soft mustard glow that grows with the count */}
          <div className="pointer-events-none absolute inset-0" style={{
            opacity: t * 0.9,
            background: "radial-gradient(62% 62% at 82% 90%, rgba(247,181,0,.30), transparent 72%), radial-gradient(40% 40% at 8% 12%, rgba(247,181,0,.12), transparent 70%)",
          }} />

          <div className="label absolute inset-x-5 top-[22px] flex justify-between text-g600 md:inset-x-[clamp(20px,3.4vw,48px)]">
            <span>{site.firm} — Portfolio</span><span>{site.location}</span>
          </div>
          <i className={cn(corner, "left-5 top-16 border-l-2 border-t-2 md:left-[clamp(20px,3.4vw,48px)]")} />
          <i className={cn(corner, "right-5 top-16 border-r-2 border-t-2 md:right-[clamp(20px,3.4vw,48px)]")} />
          <i className={cn(corner, "bottom-16 left-5 border-b-2 border-l-2 md:left-[clamp(20px,3.4vw,48px)]")} />
          <i className={cn(corner, "bottom-16 right-5 border-b-2 border-r-2 md:right-[clamp(20px,3.4vw,48px)]")} />
          <span className="label absolute bottom-[22px] left-5 text-g500 md:left-[clamp(20px,3.4vw,48px)]">Click anywhere to skip</span>

          <ul className="absolute left-[calc(clamp(20px,3.4vw,48px)+30px)] top-1/2 grid -translate-y-1/2 gap-[clamp(4px,1vh,12px)] md:left-[calc(clamp(20px,3.4vw,48px)+46px)]">
            {introRoles.map((r, i) => (
              <li key={r} className={cn("font-display leading-none transition-all duration-500", size,
                i === role ? "translate-x-[18px] text-ink [-webkit-text-stroke:1.5px_var(--color-ink)]"
                  : i < role ? "text-g400 [-webkit-text-stroke:1.5px_var(--color-g400)]"
                    : "text-outline-soft")}>
                {r}
              </li>
            ))}
          </ul>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
