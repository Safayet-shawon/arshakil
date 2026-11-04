"use client";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CHIPS, reply, type BotReply } from "@/lib/bot";
import { setCursorPull } from "@/lib/attention";
import { getIntroCharge, isIntroDone, markIntroDone, useIntroCharge, useIntroDone } from "@/lib/intro";
import { cn } from "@/lib/utils";
import { useSite } from "@/components/layout/SiteProvider";
import Robot, { type Mood } from "./Robot";

const BW = 92;
const BH = 107;
/** Where the robot's hands meet the top edge of the chat card, measured up from its tracks (px). */
const PERCH = 23; // (unused now that the robot lives inside the chat header)

interface Msg extends Partial<BotReply> { from: "bot" | "me"; text: string; live?: boolean; note?: string }

const HELLO: Msg = {
  from: "bot",
  text: "Hi! I'm Shakil's little assistant. Ask me about his work, services, books, travel, or how to get in touch.",
  chips: CHIPS,
};

/** Types the text out very fast, like a keyboard being hammered. */
function Typed({ text, onDone }: { text: string; onDone: () => void }) {
  const [n, setN] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    if (n >= text.length) { done.current(); return; }
    const t = setTimeout(() => setN((v) => v + 4), 16);
    return () => clearTimeout(t);
  }, [n, text]);
  return <>{text.slice(0, n)}</>;
}

/** asleep and plugged in -> wakes -> pulls the plug -> happy -> bounces down to its corner -> done */
type Phase = "asleep" | "waking" | "unplug" | "happy" | "descend" | "done";

/** The wall socket on the screen edge and the cable running to the side of the robot; the plug pops out and falls when it is full. */
function Cable({ w, rx, ry, popped }: { w: number; rx: number; ry: number; popped: boolean }) {
  const sy = ry - 24;
  const px = w - 38;
  const plugged = `M${rx} ${ry} C${rx + 40} ${ry + 30}, ${px - 60} ${sy + 70}, ${px} ${sy}`;
  const dropped = `M${rx} ${ry} C${rx + 4} ${ry + 40}, ${rx - 30} ${ry + 70}, ${rx - 56} ${ry + 98}`;
  return (
    <motion.svg exit={{ opacity: 0 }} transition={{ duration: 0.5 }} aria-hidden className="pointer-events-none fixed inset-0 h-full w-full" style={{ zIndex: 1000 }}>
      <rect x={w - 26} y={sy - 20} width="26" height="40" rx="7" strokeWidth="2.5" className="fill-paper stroke-ink" />
      <rect x={w - 16} y={sy - 10} width="4" height="8" rx="1" className="fill-ink" />
      <rect x={w - 16} y={sy + 3} width="4" height="8" rx="1" className="fill-ink" />
      <motion.path initial={false} animate={{ d: popped ? dropped : plugged }} transition={{ type: "spring", stiffness: 110, damping: 9 }}
        fill="none" strokeWidth="5" strokeLinecap="round" className="stroke-ink" />
      <motion.g initial={false} style={{ transformOrigin: `${px}px ${sy}px` }}
        animate={popped ? { x: rx - 56 - px, y: ry + 98 - sy, rotate: 40, opacity: [1, 1, 0] } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: popped ? 1 : 0 }}>
        <rect x={px} y={sy - 8} width="14" height="16" rx="3" className="fill-ink" />
        <rect x={px + 14} y={sy - 5} width="8" height="3" className="fill-g500" />
        <rect x={px + 14} y={sy + 2} width="8" height="3" className="fill-g500" />
      </motion.g>
    </motion.svg>
  );
}

type Attn = null | "walk" | "knock" | "pull" | "return";
const ATTN_SCALE = 1.7;

/** Rings that spread from the robot's fist, as if it were knocking on the glass of the screen. */
function Knock({ x, y }: { x: number; y: number }) {
  return (
    <div aria-hidden className="pointer-events-none fixed z-[63]" style={{ left: x, top: y }}>
      {[0, 0.33, 0.66].map((d) => (
        <i key={d} className="bot-tok absolute -ml-4 -mt-4 block h-8 w-8 rounded-full border-[3px] border-accent" style={{ animationDelay: `${d}s` }} />
      ))}
      <b className="font-display absolute -top-12 left-4 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-sm tracking-[0.12em] text-accent">TOK TOK!</b>
    </div>
  );
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * The site's helper robot. While the loader runs it sleeps big in the bottom-right corner and charges up;
 * when full it wakes (slowly: heavy eyes, a yawn, a stretch) and stays there as the chat button.
 * Left alone it plays (hops, spins, rolls about). Tapped, it gets startled, dashes to the chat and peeks over
 * the top of the card with its hands on the edge, hammers out answers, and gets more worn out the more it is asked.
 * Answers come from the site's own content (lib/bot.ts): no AI service, nothing to pay for.
 */
export default function ChatBot() {
  const site = useSite();
  const { active, value } = useIntroCharge();
  const introDone = useIntroDone();
  const charging = active && !introDone;
  const awakeNow = !charging || value >= 100;

  const [ready, setReady] = useState(false);
  const [framed, setFramed] = useState(true);
  const [geo, setGeo] = useState({ w: 1200, h: 800 });
  const [phase, setPhase] = useState<Phase>("done");
  const [popped, setPopped] = useState(false);
  const [running, setRunning] = useState(false);
  const [scared, setScared] = useState(false);
  const [playMood, setPlayMood] = useState<Mood | null>(null);
  const [attn, setAttn] = useState<Attn>(null);
  const [aim, setAim] = useState({ x: 0, y: 0 });
  const attnRun = useRef<{ stop: boolean } | null>(null);
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([HELLO]);
  const [typing, setTyping] = useState(false);
  const [writing, setWriting] = useState(false);
  const [text, setText] = useState("");
  const [work, setWork] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const seq = useRef(false);
  const geoW = useRef(1200);
  const opening = useRef(false);
  const play = useAnimationControls();

  const waking = phase === "waking";
  const intro = phase !== "done";
  const up = phase === "asleep" || phase === "waking" || phase === "unplug" || phase === "happy";
  const tired: 0 | 1 | 2 = work >= 6 ? 2 : work >= 3 ? 1 : 0;
  const busy = typing || writing;

  /** Runs a little animation on the inner layer; ignored if the robot isn't mounted. */
  const move = useCallback(async (a: Parameters<typeof play.start>[0]) => {
    try { await play.start(a); } catch { /* unmounted or interrupted */ }
  }, [play]);
  /** Waits for an animation, but never longer than its length: an interrupted animation must not freeze a sequence. */
  const moveFor = useCallback((a: Parameters<typeof play.start>[0], ms: number) => Promise.race([move(a), sleep(ms + 80)]), [move]);
  const reset = useCallback(() => {
    try { play.stop(); play.set({ x: 0, y: 0, rotate: 0, scale: 1, scaleY: 1 }); } catch { /* not mounted */ }
  }, [play]);

  useEffect(() => {
    setFramed(window.self !== window.top); // hidden inside the admin panel's preview
    // the loader belongs to the first page of a visit: landing anywhere else counts as seen
    if (window.location.pathname !== "/") markIntroDone();
    const size = () => { geoW.current = window.innerWidth; setGeo({ w: window.innerWidth, h: window.innerHeight }); };
    size();
    window.addEventListener("resize", size);
    setReady(true);
    if (getIntroCharge().active && !isIntroDone()) setPhase("asleep");
    return () => window.removeEventListener("resize", size);
  }, []);

  // full: wake (heavy eyes, yawn, stretch) -> yank the plug out -> jump for joy -> bounce down to the corner
  useEffect(() => {
    if (phase !== "asleep" || !awakeNow || seq.current) return;
    seq.current = true;
    const fromFull = value >= 100;
    (async () => {
      try { sessionStorage.setItem("ar_bot_hi", "1"); } catch { /* ignore */ }
      if (fromFull) { setPhase("waking"); await sleep(1450); }
      setPhase("unplug");
      setPopped(true);
      await moveFor({ x: [0, -26, 6, 0], rotate: [0, -12, 5, 0], transition: { duration: 0.45 } }, 450);
      setPhase("happy");
      await moveFor({ y: [0, -36, 0, -28, 0, -18, 0], rotate: [0, -8, 8, -8, 8, 0], scaleY: [1, 1.1, 0.9, 1.08, 0.94, 1, 1], transition: { duration: 0.9 } }, 900);
      setPhase("descend");
      await moveFor({ y: [0, -26, 0, -22, 0, -14, 0, -8, 0], rotate: [0, -10, 10, -10, 10, -6, 6, 0], transition: { duration: 1.1 } }, 1100);
      setPhase("done");
      setPopped(false);
      setTeaser("Phew, free at last! Tap me to chat.");
      setTimeout(() => setTeaser(null), 8000);
    })();
  }, [phase, awakeNow, value, move, moveFor]);

  // pages that start without the loader: a short hello bubble, once per visit
  useEffect(() => {
    if (!ready || phase !== "done" || framed || seq.current) return;
    let seen = false;
    try { seen = sessionStorage.getItem("ar_bot_hi") === "1"; } catch { /* private mode */ }
    if (seen) return;
    try { sessionStorage.setItem("ar_bot_hi", "1"); } catch { /* ignore */ }
    const a = setTimeout(() => setTeaser("Hi! Ask me anything about Shakil."), 900);
    const b = setTimeout(() => setTeaser(null), 8000);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [ready, phase, framed]);

  // nobody touching the screen for a while: it comes over, knocks on the glass, waves, and drags the cursor to itself
  useEffect(() => {
    if (!ready || framed || intro || open) return;
    let last = Date.now();
    let ptr = { x: geoW.current / 2, y: window.innerHeight / 2 };
    let cooldownUntil = 0;

    const stopAttention = (calm: boolean) => {
      const run = attnRun.current;
      if (!run) return;
      run.stop = true;
      attnRun.current = null;
      setCursorPull(null);
      setAttn("return");
      if (calm) {
        setTeaser("Oh! You're back.");
        setTimeout(() => setTeaser((t) => (t === "Oh! You're back." ? null : t)), 2500);
      }
      setTimeout(() => setAttn((a) => (a === "return" ? null : a)), 1500);
    };

    const startAttention = async () => {
      const run = { stop: false };
      attnRun.current = run;
      const w = geoW.current, h = window.innerHeight;
      const hw = (BW * ATTN_SCALE) / 2, hh = (BH * ATTN_SCALE) / 2;
      // stand beside the cursor, on the roomier side, inside the screen
      const tx = Math.max(hw + 12, Math.min(w - hw - 12, ptr.x + (ptr.x > w / 2 ? -170 : 170)));
      const ty = Math.max(hh + 96, Math.min(h - hh - 12, ptr.y));
      setAim({ x: tx, y: ty });
      setTeaser(null);
      setAttn("walk");
      await sleep(1300);
      if (run.stop) return;
      // knock, knock, knock
      setAttn("knock");
      setTeaser("Hellooo? Anyone there?");
      await sleep(2800);
      if (run.stop) return;
      // grab the cursor and tug it over
      setAttn("pull");
      setTeaser("Got your cursor! Look at me!");
      const hand = { x: tx + (ptr.x > w / 2 ? -1 : 1) * (hw + 6), y: ty - hh * 0.2 };
      setCursorPull(hand);
      await sleep(3200);
      if (run.stop) return;
      setAttn("knock");
      setTeaser("Psst… over here!");
      await sleep(5200);
      if (run.stop) return;
      // it has tried enough: lets go and goes back, a little offended
      setCursorPull(null);
      attnRun.current = null;
      cooldownUntil = Date.now() + 90_000;
      setAttn("return");
      setTeaser("Fine… I'll wait over here.");
      setTimeout(() => setTeaser(null), 3500);
      setTimeout(() => setAttn((a) => (a === "return" ? null : a)), 1500);
    };

    const onMove = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - ptr.x, e.clientY - ptr.y) < 4) return; // a synthetic event, not a real movement
      ptr = { x: e.clientX, y: e.clientY };
      last = Date.now();
      stopAttention(true);
    };
    const onAny = () => { last = Date.now(); stopAttention(true); };
    const timer = setInterval(() => {
      if (attnRun.current || document.hidden || Date.now() < cooldownUntil) return;
      if (Date.now() - last > 6500) startAttention();
    }, 500);

    window.addEventListener("pointermove", onMove, { passive: true });
    for (const ev of ["wheel", "scroll", "keydown", "pointerdown", "touchstart"]) window.addEventListener(ev, onAny, { passive: true });
    return () => {
      clearInterval(timer);
      window.removeEventListener("pointermove", onMove);
      for (const ev of ["wheel", "scroll", "keydown", "pointerdown", "touchstart"]) window.removeEventListener(ev, onAny);
      if (attnRun.current) { attnRun.current.stop = true; attnRun.current = null; }
      setCursorPull(null);
      setAttn(null);
    };
  }, [ready, framed, intro, open]);

  // left alone for a while, it plays: hops, spins, wiggles, rolls along the bottom
  useEffect(() => {
    if (!ready || intro || open || framed || attn) return;
    let dead = false;
    const gw = geoW.current;
    const L = gw < 768 ? 16 : Math.max(20, Math.min(48, gw * 0.034));
    const room = Math.max(60, Math.min(260, gw - L * 2 - BW - 20));
    const tricks: (() => Promise<void>)[] = [
      async () => { setPlayMood("dance"); await moveFor({ y: [0, -46, 0, -34, 0, -20, 0], scaleY: [1, 1.1, 0.88, 1.08, 0.9, 1.04, 1], transition: { duration: 1.7, ease: "easeOut" } }, 1700); },
      async () => { setPlayMood("dance"); await moveFor({ rotate: [0, 0, 360], y: [0, -42, 0], transition: { duration: 1.2, times: [0, 0.12, 1], ease: "easeInOut" } }, 1200); },
      async () => { setPlayMood("dance"); await moveFor({ rotate: [0, -12, 12, -10, 10, -6, 6, 0], scale: [1, 1.06, 1, 1.06, 1], transition: { duration: 1.3 } }, 1300); },
      async () => { setPlayMood("run"); await moveFor({ x: [0, -room, -room * 0.55, -room, 0], rotate: [0, -9, 8, -9, 8], y: [0, -5, 0, -5, 0, -5, 0, -5, 0], transition: { duration: 3.6, ease: "easeInOut" } }, 3600); },
    ];
    const loop = async () => {
      await sleep(rand(8000, 15000));
      if (dead || opening.current) return;
      await tricks[Math.floor(Math.random() * tricks.length)]();
      if (dead) return;
      setPlayMood(null);
      reset();
      loop();
    };
    loop();
    return () => { dead = true; setPlayMood(null); reset(); };
  }, [ready, intro, open, framed, attn, moveFor, reset]);

  // the more it is asked, the more worn out it gets; it recovers slowly
  useEffect(() => {
    if (!work || busy) return;
    const t = setTimeout(() => setWork((w) => Math.max(0, w - 1)), 25000);
    return () => clearTimeout(t);
  }, [work, busy]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length, typing, open]);
  useEffect(() => {
    if (!writing) return;
    const t = setInterval(() => scroller.current?.scrollTo({ top: scroller.current.scrollHeight }), 80);
    return () => clearInterval(t);
  }, [writing]);

  const close = useCallback(() => {
    setOpen(false);
    setRunning(true);
    move({ y: [0, -14, 0, -8, 0], transition: { duration: 0.8 } });
  }, [move]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, close]);

  if (framed) return null;

  const { w, h } = geo;
  const mobile = w < 768;
  const L = mobile ? 16 : Math.max(20, Math.min(48, w * 0.034));
  // plugged in: big, in the bottom-right corner where the count used to be, a little to the left to leave room for the cable
  const upS = mobile ? Math.min((0.26 * h) / BH, 1.7) : Math.min((0.34 * h) / BH, 2.2);
  const upX = mobile ? -40 : -Math.round(w * 0.07);
  const upY = 0;
  const panelW = Math.min(380, w - L * 2);
  const panelH = Math.min(520, h - 120);
  const perched = open && !intro;
  // open: it lives in the left of the chat header, small
  const cs = 0.62;
  const away = attn === "walk" || attn === "knock" || attn === "pull";
  const pose = perched
    ? { x: -panelW + 16 + BW * cs, y: -panelH + 10 + BH * cs, scale: cs, opacity: ready ? 1 : 0 }
    : away
      ? { x: aim.x - (w - L) + (BW * ATTN_SCALE) / 2, y: aim.y - (h - 20) + (BH * ATTN_SCALE) / 2, scale: ATTN_SCALE, opacity: 1 }
      : { x: up ? upX : 0, y: 0, scale: up ? upS : 1, opacity: ready ? 1 : 0 };
  const cableRx = w - L + upX - BW * upS * (1 - 78 / 84);
  const cableRy = h - 20 + upY - BH * upS * (1 - 80 / 98);

  const mood: Mood = scared ? "scared" : attn === "walk" || attn === "return" ? "run" : attn === "knock" ? "knock" : attn === "pull" ? "pull" : running ? "run" : perched ? (busy ? "type" : "idle") : phase === "happy" || phase === "descend" ? "dance" : playMood ?? "idle";

  const openChat = async () => {
    if (opening.current) return;
    opening.current = true;
    setTeaser(null);
    reset();
    // startled first, then it bolts for the chat
    setScared(true);
    try {
      await moveFor({ x: [0, -3, 3, -3, 3, 0], rotate: [0, -10, 10, -10, 10, 0], y: [0, -14, 0], scale: [1, 1.14, 1], transition: { duration: 0.6 } }, 600);
    } finally {
      reset();
      setScared(false);
      setRunning(true);
      setOpen(true);
      opening.current = false;
    }
    move({ y: [0, -6, 0, -6, 0, -6, 0], rotate: [0, -6, 6, -6, 6, -3, 0], transition: { duration: 1 } });
    // if the dash never reports back, it is there anyway
    setTimeout(() => setRunning(false), 1800);
  };

  const onArrived = () => {
    if (!running) return;
    setRunning(false);
    // it catches its breath and leans over the card, once
    move({ rotate: [0, -9, 0, -3, 0], y: [0, 3, 0], transition: { duration: 1.1 } });
  };

  const ask = (q: string) => {
    const t = q.trim();
    if (!t || busy) return;
    setMsgs((m) => [...m, { from: "me", text: t }]);
    setText("");
    setTyping(true);
    const n = work + 1;
    setWork(n);
    const r = reply(t, site);
    const note = n === 3 ? "(Phew… I'm getting a little out of breath! But I love questions.)"
      : n === 6 ? "(*pant pant* I'm worn out! For the rest, the contact form reaches Shakil himself.)" : undefined;
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", ...r, live: true, note }]);
      setTyping(false);
      setWriting(true);
    }, 260);
  };

  const finished = () => { setWriting(false); setMsgs((m) => m.map((x, i) => (i === m.length - 1 ? { ...x, live: false } : x))); };

  const toggle = () => (open ? close() : openChat());

  return (
    <>
      <AnimatePresence>
        {up && <Cable key="cable" w={w} rx={cableRx} ry={cableRy} popped={popped} />}
      </AnimatePresence>
      {attn === "knock" && <Knock x={aim.x + (aim.x > w / 2 ? -1 : 1) * 0 + (BW * ATTN_SCALE) * 0.42} y={aim.y - (BH * ATTN_SCALE) * 0.38} />}
      <motion.div
        initial={false}
        animate={pose}
        transition={attn ? { type: "spring", stiffness: 55, damping: 12 } : phase === "descend" ? { type: "spring", stiffness: 90, damping: 9 } : up ? { duration: 0 } : { type: "spring", stiffness: running ? 70 : 90, damping: running ? 13 : 15 }}
        onAnimationComplete={onArrived}
        className="fixed bottom-5"
        style={{ right: L, width: BW, height: BH, transformOrigin: "100% 100%", zIndex: intro ? 1001 : perched ? 62 : 60, pointerEvents: intro || scared ? "none" : "auto" }}
      >
        <motion.div animate={play} style={{ transformOrigin: "50% 80%" }} className="h-full w-full">
          <button type="button" data-link aria-label={open ? "Close the assistant" : "Open the assistant"} aria-expanded={open}
            onClick={toggle}
            className="block h-full w-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <Robot charge={phase === "asleep" ? value : 100} awake={phase !== "asleep"} waking={waking} mood={mood} tired={tired} waving={!!teaser && !open && !attn} free={attn === "knock" || attn === "pull"} />
          </button>
        </motion.div>

        <AnimatePresence>
          {teaser && !open && !intro && (
            <motion.div initial={{ opacity: 0, x: 8, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={openChat}
              className="absolute bottom-10 right-[calc(100%+6px)] w-max max-w-[210px] origin-bottom-right cursor-pointer rounded-2xl rounded-br-sm [@media(max-width:480px)]:max-w-[160px] bg-paper px-4 py-3 text-xs font-bold leading-snug text-ink shadow-[0_14px_36px_rgba(77,79,83,0.22)]">
              {teaser}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.section role="dialog" aria-label="Assistant chat"
            initial={{ opacity: 0, y: 24, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.45, type: "spring", stiffness: 260, damping: 26 } }}
            exit={{ opacity: 0, y: 18, scale: 0.94, transition: { duration: 0.2 } }}
            className="fixed z-[61] flex origin-bottom-right flex-col overflow-hidden rounded-3xl bg-paper shadow-[0_24px_70px_rgba(77,79,83,0.35)]"
            style={{ right: L, bottom: 20, width: panelW, height: panelH }}>
            <header className="flex h-[84px] shrink-0 items-center gap-3 bg-ink pl-[90px] pr-4 text-paper">
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl leading-none">Ask <span className="text-accent">Shakil&apos;s</span> assistant</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-g300">{tired === 2 ? "Out of breath · still answering" : "Online · answers from this site"}</p>
              </div>
              <button type="button" data-link onClick={close} aria-label="Close chat" className="grid h-8 w-8 place-items-center rounded-full text-lg text-g300 transition-colors hover:bg-g600 hover:text-paper">×</button>
            </header>

            <div ref={scroller} data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto bg-g50 px-4 py-4">
              {msgs.map((m, i) => (
                <div key={i} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-[13px] leading-relaxed",
                    m.from === "me" ? "rounded-br-sm bg-ink text-paper" : "rounded-bl-sm bg-paper text-ink shadow-sm")}>
                    {m.live ? <Typed text={m.text} onDone={finished} /> : m.text}
                    {!m.live && m.note && <span className="mt-2 block text-[11px] italic text-g500">{m.note}</span>}
                    {!m.live && m.links && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.links.map((l) => (
                          <Link key={l.href + l.label} href={l.href} data-link onClick={close}
                            className="rounded-full bg-accent px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-ink transition-colors hover:bg-ink hover:text-paper">
                            {l.label} ↗
                          </Link>
                        ))}
                      </div>
                    )}
                    {!m.live && m.chips && i === msgs.length - 1 && !busy && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.chips.map((c) => (
                          <button key={c} type="button" data-link onClick={() => ask(c)}
                            className="rounded-full border-[1.5px] border-ink px-3 py-1.5 text-[11px] font-bold text-ink transition-colors hover:bg-ink hover:text-paper">
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex">
                  <div className="flex gap-1.5 rounded-2xl rounded-bl-sm bg-paper px-4 py-3.5 shadow-sm" aria-label="Typing">
                    {[0, 1, 2].map((d) => <i key={d} className="pulse-dot block h-1.5 w-1.5 rounded-full bg-accent-d" style={{ animationDelay: `${d * 0.25}s`, animationDuration: "1s" }} />)}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); ask(text); }} className="flex items-center gap-2 border-t border-g200 bg-paper p-3">
              <input value={text} onChange={(e) => setText(e.target.value)} maxLength={200} placeholder="Type your question…" aria-label="Your question"
                className="min-w-0 flex-1 rounded-full bg-g100 px-4 py-2.5 text-[13px] text-ink outline-none placeholder:text-g500 focus:ring-2 focus:ring-accent" />
              <button type="submit" data-link disabled={!text.trim() || busy} aria-label="Send"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-base font-bold text-ink transition-all hover:bg-ink hover:text-paper disabled:opacity-40">↑</button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
