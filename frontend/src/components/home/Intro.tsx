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
 * Entry sequence, one "scene" per role (art behind the big word):
 *   Architect (blueprint) -> Content Creator (vlogger) -> Author (books, pages, letters)
 *   -> Traveller (mountains) -> Social Worker (people + hearts)
 *   -> Photographer: a camera whose lens shows the view and whose display types the word,
 *      it zooms to the front, "Say cheeseee!", 3-2-1, click + flash
 *   -> the hero takes over: ARCHITECT (mustard) SHAKHAOUTH HOSSAIN SHAKIL, then ARCHITECT -> AR.
 * The counter fills grey -> mustard across all of it.
 */
const SCENES: { word: string; Art: ComponentType }[] = [
  { word: "Architect", Art: Architect },
  { word: "Content Creator", Art: Creator },
  { word: "Author", Art: Author },
  { word: "Traveller", Art: Traveller },
  { word: "Social Worker", Art: SocialWorker },
];
const MENU = [...SCENES.map((s) => s.word), "Photographer"];
const PHOTO = SCENES.length; // index of the camera scene

const SCENE_MS = 1000;
const T = { photo: SCENES.length * SCENE_MS, type: 5600, front: 7000, cheese: 7100, three: 7900, two: 8400, one: 8900, click: 9400, flash: 9450, done: 9800, exit: 9950 };
const KEYS: [number, number][] = [[0, 1], [T.photo, 80], [T.front, 90], [T.click, 99], [T.flash, 100]];
const TYPED = "PHOTOGRAPHER";
const SAY = "Say cheeseee!";

const countAt = (t: number) => {
  for (let i = 1; i < KEYS.length; i++) {
    const [t1, v1] = KEYS[i];
    if (t <= t1) { const [t0, v0] = KEYS[i - 1]; return Math.round(v0 + ((v1 - v0) * (t - t0)) / (t1 - t0)); }
  }
  return 100;
};
const displayAt = (t: number) => {
  if (t < T.type) return "";
  if (t < T.front) return TYPED.slice(0, Math.min(TYPED.length, Math.floor((t - T.type) / 70) + 1));
  if (t < T.three) return "SAY CHEESE";
  if (t < T.two) return "3";
  if (t < T.one) return "2";
  if (t < T.click) return "1";
  return "CLICK!";
};

type View = { scene: number; value: number; display: string; front: boolean; snap: boolean };
const sameView = (a: View, b: View) => a.scene === b.scene && a.value === b.value && a.display === b.display && a.front === b.front && a.snap === b.snap;

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

export default function Intro() {
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [flash, setFlash] = useState(false);
  const [v, setV] = useState<View>({ scene: 0, value: 1, display: "", front: false, snap: false });
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

  useEffect(() => {
    if (prefersReducedMotion()) { markIntroDone(); setGone(true); return; }
    document.documentElement.classList.add("lenis-stopped");
    // dev only: /?introAt=3500 jumps the timeline, add &introFreeze=1 to hold that moment (handy for checking one scene)
    const dev = process.env.NODE_ENV !== "production" ? new URLSearchParams(window.location.search) : null;
    const offset = Number(dev?.get("introAt")) || 0;
    const freeze = dev?.get("introFreeze") === "1";
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (freeze ? 0 : now - t0) + offset;
      const next: View = {
        scene: t < T.photo ? Math.floor(t / SCENE_MS) : PHOTO,
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

  const scene = SCENES[v.scene];
  const onCamera = v.scene === PHOTO;
  const corner = "absolute h-[34px] w-[34px] border-0 transition-colors duration-500";
  const cornerColor = v.front ? "border-accent" : "border-g500";
  const pad = "clamp(20px,3.4vw,48px)";
  const wordSize = scene ? `min(13vw,24vh,${(88 / (scene.word.length * 0.52)).toFixed(2)}vw)` : undefined;

  return (
    <AnimatePresence onExitComplete={() => setGone(true)}>
      {!leaving && (
        <motion.div key="intro" aria-hidden exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[1000] overflow-hidden bg-g200" style={vars}>
          {/* mustard glow grows with the count */}
          <div className="pointer-events-none absolute inset-0" style={{
            opacity: t * 0.95,
            background: "radial-gradient(62% 62% at 82% 90%, rgba(247,181,0,.34), transparent 72%), radial-gradient(40% 40% at 8% 12%, rgba(247,181,0,.12), transparent 70%)",
          }} />

          <div className="label absolute inset-x-5 top-[22px] z-[20] flex justify-between text-g600 md:inset-x-[clamp(20px,3.4vw,48px)]">
            <span>{site.firm} — Portfolio</span><span>{site.location}</span>
          </div>
          <i className={cn(corner, cornerColor, "left-5 top-16 border-l-2 border-t-2 md:left-[clamp(20px,3.4vw,48px)]")} />
          <i className={cn(corner, cornerColor, "right-5 top-16 border-r-2 border-t-2 md:right-[clamp(20px,3.4vw,48px)]")} />
          <i className={cn(corner, cornerColor, "bottom-16 left-5 border-b-2 border-l-2 md:left-[clamp(20px,3.4vw,48px)]")} />
          <i className={cn(corner, cornerColor, "bottom-16 right-5 border-b-2 border-r-2 md:right-[clamp(20px,3.4vw,48px)]")} />

          {/* scene art (behind) + big word (in front) */}
          <AnimatePresence>
            {scene && <scene.Art key={`art-${v.scene}`} />}
          </AnimatePresence>
          <AnimatePresence>
            {scene && (
              <motion.div key={`word-${v.scene}`} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.25 }}
                className="pointer-events-none absolute z-10 flex -translate-y-1/2 items-center" style={{ left: `calc(${pad} + 30px)`, top: "70%" }}>
                <div className="font-display leading-none text-ink [-webkit-text-stroke:10px_var(--color-g200)] [paint-order:stroke_fill]" style={{ fontSize: wordSize }}>
                  <Letters text={scene.word} step={0.035} className="!justify-start" hidden={{ y: "115%", opacity: 0 }} shown={{ y: 0, opacity: 1 }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* photographer: camera in the middle, zooms to the front */}
          {onCamera && (
            <div className="pointer-events-none absolute inset-0 z-[12] grid place-items-center">
              <motion.div className="w-[min(56vw,86vh)]"
                initial={{ y: "90vh", scale: 0.45, rotate: 8, opacity: 0 }}
                animate={v.front ? { y: "9vh", scale: 1.1, rotate: 0, opacity: 1 } : { y: "4vh", scale: 0.78, rotate: 0, opacity: 1 }}
                transition={v.front ? { duration: 0.9, ease: [0.16, 1, 0.3, 1] } : { type: "spring", stiffness: 90, damping: 13 }}>
                <PhotoCamera text={v.display} pressed={v.snap} focus={v.front && !v.snap} />
              </motion.div>
            </div>
          )}
          {onCamera && v.front && (
            <div className="pointer-events-none absolute inset-x-0 top-[7%] z-[14] flex justify-center overflow-hidden py-[.04em] font-display text-[clamp(40px,8.6vw,150px)] leading-[1.02] text-ink [-webkit-text-stroke:10px_var(--color-g200)] [paint-order:stroke_fill]">
              <Letters text={SAY} step={0.038} hidden={{ y: "115%" }} shown={{ y: 0 }} />
            </div>
          )}

          {/* loading menu */}
          <ul className={cn("label absolute bottom-[calc(74px+clamp(48px,min(7vw,14vh),110px)*0.9)] right-5 z-[20] grid justify-items-end gap-1 text-[10px] tracking-[0.16em] transition-opacity duration-500 max-md:hidden md:right-[calc(clamp(20px,3.4vw,48px)+46px)]", v.front && "opacity-0")}>
            {MENU.map((m, i) => {
              const on = i === v.scene, past = i < v.scene;
              return (
                <li key={m} className={cn("flex flex-row-reverse items-center gap-2 transition-colors duration-300", on ? "text-ink" : past ? "text-accent-d" : "text-g400")}>
                  <i className={cn("block h-[3px] transition-all duration-300", on ? "w-6 bg-accent" : past ? "w-3 bg-accent" : "w-3 bg-g300")} />
                  {String(i + 1).padStart(2, "0")} {m}
                </li>
              );
            })}
          </ul>
          <button onClick={() => finish()} data-link className="label absolute bottom-[22px] z-[20] text-g500" style={{ left: `calc(${pad} + 30px)` }}>Click to skip</button>

          {/* counter */}
          <div className={cn("absolute bottom-[74px] right-5 z-[20] font-display leading-[0.8] tabular-nums md:right-[calc(clamp(20px,3.4vw,48px)+46px)]",
            "text-[clamp(48px,min(7vw,14vh),110px)] text-transparent [-webkit-text-stroke:2px_var(--stroke)]",
            "bg-[linear-gradient(to_top,var(--fill)_var(--p),transparent_var(--p))] bg-clip-text")}>
            {pad3(v.value)}<small className="ml-[.1em] align-top text-[.24em] [-webkit-text-stroke:1.5px_var(--stroke)]">%</small>
          </div>

          {flash && <div className="flash-go pointer-events-none absolute inset-0 z-[60] bg-white opacity-0" />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
