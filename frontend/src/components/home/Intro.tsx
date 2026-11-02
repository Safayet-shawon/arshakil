"use client";
import { AnimatePresence, motion, type TargetAndTransition } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type ComponentType } from "react";
import { site } from "@/data/site";
import { markIntroDone } from "@/lib/intro";
import { cn, lerp, pad3, prefersReducedMotion } from "@/lib/utils";
import Architect from "./intro/Architect";
import Author from "./intro/Author";
import Creator from "./intro/Creator";
import PhotoCamera from "./intro/PhotoCamera";
import SocialWorker from "./intro/SocialWorker";
import Traveller from "./intro/Traveller";

/**
 * Entry sequence. The screen is split into a 3 x 2 contact sheet (2 x 3 on phones).
 * Each role wipes into its own cell, one after another, and stays:
 *   Architect (blueprint) -> Content Creator (vlogger) -> Author (books, pages, letters)
 *   -> Traveller (mountains) -> Social Worker (people + hearts)
 *   -> Photographer: a camera lands in the last cell (lens shows the view, display types the word),
 *      zooms to the front, "Say cheeseee!", 3-2-1, click + flash
 *   -> the hero takes over: ARCHITECT (mustard) SHAKHAOUTH HOSSAIN SHAKIL, then ARCHITECT -> AR.
 * The art is muted (low opacity) so the grid reads calm; the counter fills grey -> mustard.
 */
const SCENES: { word: string; Art: ComponentType }[] = [
  { word: "Architect", Art: Architect },
  { word: "Content Creator", Art: Creator },
  { word: "Author", Art: Author },
  { word: "Traveller", Art: Traveller },
  { word: "Social Worker", Art: SocialWorker },
];
const CELLS = SCENES.length + 1; // last cell is the photographer's camera
const PHOTO = SCENES.length;

const SCENE_MS = 600;
const T = { photo: SCENES.length * SCENE_MS, type: 3300, front: 4300, cheese: 4400, three: 4900, two: 5250, one: 5600, click: 5950, flash: 6000, done: 6300, exit: 6450 };
const KEYS: [number, number][] = [[0, 1], [T.photo, 80], [T.front, 90], [T.click, 99], [T.flash, 100]];
const TYPED = "PHOTOGRAPHER";
const SAY = "Say cheeseee!";
const PAD = "clamp(20px,3.4vw,48px)";
/** Same label size in every cell, sized so "Content Creator" (the longest) fits the cell width. */
const LABEL_SIZE = "min(calc(var(--cw) / 8.6), 6.5vh)";

const countAt = (t: number) => {
  for (let i = 1; i < KEYS.length; i++) {
    const [t1, v1] = KEYS[i];
    if (t <= t1) { const [t0, v0] = KEYS[i - 1]; return Math.round(v0 + ((v1 - v0) * (t - t0)) / (t1 - t0)); }
  }
  return 100;
};
const displayAt = (t: number) => {
  if (t < T.type) return "";
  if (t < T.front) return TYPED.slice(0, Math.min(TYPED.length, Math.floor((t - T.type) / 45) + 1));
  if (t < T.three) return "SAY CHEESE";
  if (t < T.two) return "3";
  if (t < T.one) return "2";
  if (t < T.click) return "1";
  return "CLICK!";
};

type View = { shown: number; value: number; display: string; front: boolean; snap: boolean };
const sameView = (a: View, b: View) => a.shown === b.shown && a.value === b.value && a.display === b.display && a.front === b.front && a.snap === b.snap;

function Letters({ text, className, step = 0.04, hidden, shown }: { text: string; className?: string; step?: number; hidden: TargetAndTransition; shown: TargetAndTransition }) {
  return (
    <span className={cn("flex justify-center", className)} aria-label={text}>
      {[...text].map((c, i) => (
        <motion.span key={i} aria-hidden className="inline-block" initial={hidden} animate={shown}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * step }}>
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </span>
  );
}

/** One filled cell: wipes up, art plays muted behind, word sits bottom-left. */
function Cell({ index, word, Art }: { index: number; word: string; Art: ComponentType }) {
  return (
    <motion.div className="absolute inset-0 overflow-hidden border-[1.5px] border-g300 bg-paper/45"
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      transition={{ duration: 0.45, ease: [0.77, 0, 0.18, 1] }}>
      <div className="absolute inset-0 opacity-[0.5]"><Art /></div>
      <span className="label absolute left-3 top-2.5 text-[10px] text-g500">{String(index + 1).padStart(2, "0")}</span>
      <div className="absolute bottom-2.5 left-3 font-display leading-none text-ink"
        style={{ fontSize: LABEL_SIZE }}>
        {word}
      </div>
    </motion.div>
  );
}

export default function Intro() {
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [flash, setFlash] = useState(false);
  const [v, setV] = useState<View>({ shown: 1, value: 1, display: "", front: false, snap: false });
  const [slot, setSlot] = useState({ x: 0, y: 0, s: 0.4 });
  const cellRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const fired = useRef({ flash: false, done: false, exit: false });

  const finish = () => {
    if (fired.current.exit) return;
    fired.current.exit = true;
    fired.current.done = true;
    document.documentElement.classList.remove("lenis-stopped");
    markIntroDone();
    setLeaving(true);
  };

  /** Where the camera sits while it lives in the last cell (measured, so it works at any screen size). */
  useEffect(() => {
    const measure = () => {
      const c = cellRef.current?.getBoundingClientRect();
      if (!c) return;
      const baseW = Math.min(window.innerWidth * 0.56, window.innerHeight * 0.86);
      setSlot({
        x: c.left + c.width / 2 - window.innerWidth / 2,
        y: c.top + c.height / 2 - window.innerHeight / 2 + 6,
        s: Math.min((c.width * 0.8) / baseW, (c.height * 0.62) / (baseW * 0.73)),
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) { markIntroDone(); setGone(true); return; }
    document.documentElement.classList.add("lenis-stopped");
    // dev only: /?introAt=3500 jumps the timeline, add &introFreeze=1 to hold that moment (handy for checking one stage)
    const dev = process.env.NODE_ENV !== "production" ? new URLSearchParams(window.location.search) : null;
    const offset = Number(dev?.get("introAt")) || 0;
    const freeze = dev?.get("introFreeze") === "1";
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (freeze ? 0 : now - t0) + offset;
      const next: View = {
        shown: t < T.photo ? Math.floor(t / SCENE_MS) + 1 : CELLS,
        value: countAt(t),
        display: displayAt(t),
        front: t >= T.front,
        snap: t >= T.click,
      };
      setV((prev) => (sameView(prev, next) ? prev : next));
      if (t >= T.flash && !fired.current.flash) { fired.current.flash = true; setFlash(true); }
      if (t >= T.done && !fired.current.done) { fired.current.done = true; markIntroDone(); }   // hero starts under the flash
      if (t >= T.exit && !fired.current.exit) { fired.current.exit = true; document.documentElement.classList.remove("lenis-stopped"); setLeaving(true); }
      if (!fired.current.exit) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf.current); document.documentElement.classList.remove("lenis-stopped"); };
  }, []);

  if (gone) return null;

  const t = v.value / 100;
  const c = (a: number[], b: number[], k: number) => `rgb(${lerp(a[0], b[0], k)},${lerp(a[1], b[1], k)},${lerp(a[2], b[2], k)})`;
  const vars = {
    "--p": `${v.value}%`,
    "--fill": c([77, 79, 83], [247, 181, 0], t),
    "--stroke": c([163, 163, 163], [247, 181, 0], t * 0.8),
  } as CSSProperties;

  const onCamera = v.shown >= CELLS;

  return (
    <AnimatePresence onExitComplete={() => setGone(true)}>
      {!leaving && (
        <motion.div key="intro" aria-hidden exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[1000] overflow-hidden bg-g200" style={vars}>
          {/* soft mustard glow, kept faint */}
          <div className="pointer-events-none absolute inset-0" style={{
            opacity: t * 0.55,
            background: "radial-gradient(62% 62% at 82% 95%, rgba(247,181,0,.22), transparent 72%)",
          }} />

          <div className="label absolute inset-x-5 top-[22px] z-[20] flex justify-between text-g600 md:inset-x-[clamp(20px,3.4vw,48px)]">
            <span>{site.firm} — Portfolio</span><span>{site.location}</span>
          </div>

          {/* the divided screen: filled cells stay, empty ones wait as dashed outlines */}
          <motion.div className="absolute z-[5] grid grid-cols-2 grid-rows-3 gap-2 [--cw:42vw] md:grid-cols-3 md:grid-rows-2 md:[--cw:28vw]"
            style={{ top: 56, bottom: 60, left: PAD, right: PAD }}
            animate={{ opacity: v.front ? 0.28 : 1 }} transition={{ duration: 0.6 }}>
            {Array.from({ length: CELLS }, (_, i) => {
              const filled = i < v.shown;
              const scene = SCENES[i];
              return (
                <div key={i} ref={i === PHOTO ? cellRef : undefined} className="relative min-h-0 min-w-0">
                  <div className={cn("absolute inset-0 border-[1.5px] border-dashed border-g300/70 transition-all duration-500", filled && i !== PHOTO && "opacity-0", filled && i === PHOTO && "border-solid border-g300 bg-paper/45")} />
                  {filled && scene && <Cell index={i} word={scene.word} Art={scene.Art} />}
                  {i === PHOTO && (
                    <>
                      <span className={cn("label absolute left-3 top-2.5 text-[10px] text-g500 transition-opacity", filled ? "opacity-100" : "opacity-0")}>06</span>
                      <div className={cn("font-display absolute bottom-2.5 left-3 leading-none text-ink transition-opacity", filled ? "opacity-100" : "opacity-0")}
                        style={{ fontSize: LABEL_SIZE }}>Photographer</div>
                    </>
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* photographer: camera lands in the last cell, then zooms to the front */}
          <div className="pointer-events-none absolute inset-0 z-[12] grid place-items-center">
            {onCamera && (
              <motion.div className="w-[min(56vw,86vh)]"
                initial={{ x: slot.x, y: slot.y + 140, scale: slot.s * 0.6, rotate: 8, opacity: 0 }}
                animate={v.front
                  ? { x: 0, y: typeof window === "undefined" ? 0 : window.innerHeight * 0.09, scale: 1.1, rotate: 0, opacity: 1 }
                  : { x: slot.x, y: slot.y, scale: slot.s, rotate: 0, opacity: 1 }}
                transition={v.front ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] } : { type: "spring", stiffness: 160, damping: 15 }}>
                <PhotoCamera text={v.display} pressed={v.snap} focus={v.front && !v.snap} />
              </motion.div>
            )}
          </div>
          {onCamera && v.front && (
            <div className="pointer-events-none absolute inset-x-0 top-[7%] z-[14] flex justify-center overflow-hidden py-[.04em] font-display text-[clamp(40px,8.6vw,150px)] leading-[1.02] text-ink [-webkit-text-stroke:10px_var(--color-g200)] [paint-order:stroke_fill]">
              <Letters text={SAY} step={0.022} hidden={{ y: "115%" }} shown={{ y: 0 }} />
            </div>
          )}

          <button onClick={() => finish()} data-link className="label absolute bottom-[20px] z-[20] text-g500" style={{ left: PAD }}>Click to skip</button>

          {/* counter */}
          <div className={cn("absolute bottom-[10px] z-[20] font-display leading-[0.9] tabular-nums",
            "text-[clamp(30px,min(4vw,7vh),56px)] text-transparent [-webkit-text-stroke:1.6px_var(--stroke)]",
            "bg-[linear-gradient(to_top,var(--fill)_var(--p),transparent_var(--p))] bg-clip-text")} style={{ right: PAD }}>
            {pad3(v.value)}<small className="ml-[.1em] align-top text-[.3em] [-webkit-text-stroke:1.2px_var(--stroke)]">%</small>
          </div>

          {flash && <div className="flash-go pointer-events-none absolute inset-0 z-[60] bg-white opacity-0" />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
