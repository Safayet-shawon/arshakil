"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CHIPS, reply, type BotReply } from "@/lib/bot";
import { markIntroDone, useIntroCharge, useIntroDone } from "@/lib/intro";
import { cn } from "@/lib/utils";
import { useSite } from "@/components/layout/SiteProvider";
import Robot from "./Robot";

const BW = 92;
const BH = 107;

interface Msg extends Partial<BotReply> { from: "bot" | "me"; text: string }

const HELLO: Msg = {
  from: "bot",
  text: "Hi! I'm Shakil's little assistant. Ask me about his work, services, books, travel, or how to get in touch.",
  chips: CHIPS,
};

/**
 * The site's helper robot. While the loader counts 0 -> 100 it sleeps in the middle of the screen and
 * charges up; when it is full it wakes, settles into its normal size and becomes the chat button.
 * Answers come from the site's own content (see lib/bot.ts): no AI service, nothing to pay for.
 */
export default function ChatBot() {
  const site = useSite();
  const { active, value } = useIntroCharge();
  const introDone = useIntroDone();
  const charging = active && !introDone;
  const [ready, setReady] = useState(false);
  const [framed, setFramed] = useState(true);
  const [geo, setGeo] = useState({ w: 1200, h: 800 });
  const [flying, setFlying] = useState(false);
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([HELLO]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const wasCharging = useRef(false);

  useEffect(() => {
    setFramed(window.self !== window.top); // hidden inside the admin panel's preview
    // the loader belongs to the first page of a visit: landing anywhere else counts as seen
    if (window.location.pathname !== "/") markIntroDone();
    const size = () => setGeo({ w: window.innerWidth, h: window.innerHeight });
    size();
    window.addEventListener("resize", size);
    setReady(true);
    return () => window.removeEventListener("resize", size);
  }, []);

  useEffect(() => {
    if (charging) { wasCharging.current = true; return; }
    if (wasCharging.current) { wasCharging.current = false; setFlying(true); }
  }, [charging]);

  // a short hello bubble once per visit, a moment after the robot settles
  useEffect(() => {
    if (!ready || charging || flying || framed) return;
    let seen = false;
    try { seen = sessionStorage.getItem("ar_bot_hi") === "1"; } catch { /* private mode */ }
    if (seen) return;
    const a = setTimeout(() => setTeaser(true), 900);
    const b = setTimeout(() => setTeaser(false), 9000);
    try { sessionStorage.setItem("ar_bot_hi", "1"); } catch { /* ignore */ }
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [ready, charging, flying, framed]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  if (framed) return null;

  const { w, h } = geo;
  const mobile = w < 768;
  const L = mobile ? 16 : Math.max(20, Math.min(48, w * 0.034));
  // while charging it is big, sitting in its own corner; when full it simply settles down to normal size
  const s = mobile ? Math.min((0.3 * h) / BH, 2) : Math.min((0.46 * h) / BH, 2.6);
  const pose = { x: 0, y: 0, scale: charging ? s : 1, opacity: ready ? 1 : 0 };

  const ask = (q: string) => {
    const t = q.trim();
    if (!t || typing) return;
    setMsgs((m) => [...m, { from: "me", text: t }]);
    setText("");
    setTyping(true);
    const r = reply(t, site);
    setTimeout(() => { setMsgs((m) => [...m, { from: "bot", ...r }]); setTyping(false); }, 450 + Math.min(700, r.text.length * 3));
  };

  const panelW = Math.min(380, w - L * 2);
  const panelH = Math.min(540, h - BH - 70);

  return (
    <>
      <motion.div
        initial={false}
        animate={pose}
        transition={charging ? { duration: 0 } : { type: "spring", stiffness: 70, damping: 15 }}
        onAnimationComplete={() => setFlying(false)}
        className="fixed bottom-5"
        style={{ right: L, width: BW, height: BH, transformOrigin: "100% 100%", zIndex: charging || flying ? 1001 : 60, pointerEvents: charging || flying ? "none" : "auto" }}
      >
        <button type="button" data-link aria-label={open ? "Close the assistant" : "Open the assistant"} aria-expanded={open}
          onClick={() => { setOpen((o) => !o); setTeaser(false); }}
          className="block h-full w-full rounded-2xl outline-none transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-accent">
          <Robot charge={charging ? value : 100} awake={!charging || value >= 100} waving={flying || teaser} />
        </button>

        <AnimatePresence>
          {teaser && !open && !charging && (
            <motion.div initial={{ opacity: 0, x: 8, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={() => { setOpen(true); setTeaser(false); }}
              className="absolute bottom-10 right-[calc(100%+6px)] w-max max-w-[210px] origin-bottom-right cursor-pointer rounded-2xl rounded-br-sm bg-paper px-4 py-3 text-xs font-bold leading-snug text-ink shadow-[0_14px_36px_rgba(77,79,83,0.22)]">
              Hi! Ask me anything about Shakil.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {open && !charging && (
          <motion.section role="dialog" aria-label="Assistant chat"
            initial={{ opacity: 0, y: 18, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed z-[61] flex origin-bottom-right flex-col overflow-hidden rounded-3xl bg-paper shadow-[0_24px_70px_rgba(77,79,83,0.35)]"
            style={{ right: L, bottom: 20 + BH + 12, width: panelW, height: panelH }}>
            <header className="flex items-center gap-3 bg-ink px-5 py-4 text-paper">
              <i className="pulse-dot block h-2.5 w-2.5 rounded-full bg-accent" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl leading-none">Ask <span className="text-accent">Shakil&apos;s</span> assistant</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-g300">Online · answers from this site</p>
              </div>
              <button type="button" data-link onClick={() => setOpen(false)} aria-label="Close chat" className="grid h-8 w-8 place-items-center rounded-full text-lg text-g300 transition-colors hover:bg-g600 hover:text-paper">×</button>
            </header>

            <div ref={scroller} data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto bg-g50 px-4 py-4">
              {msgs.map((m, i) => (
                <div key={i} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-[13px] leading-relaxed",
                    m.from === "me" ? "rounded-br-sm bg-ink text-paper" : "rounded-bl-sm bg-paper text-ink shadow-sm")}>
                    {m.text}
                    {m.links && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.links.map((l) => (
                          <Link key={l.href + l.label} href={l.href} data-link onClick={() => setOpen(false)}
                            className="rounded-full bg-accent px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-ink transition-colors hover:bg-ink hover:text-paper">
                            {l.label} ↗
                          </Link>
                        ))}
                      </div>
                    )}
                    {m.chips && i === msgs.length - 1 && !typing && (
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
              <button type="submit" data-link disabled={!text.trim() || typing} aria-label="Send"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-base font-bold text-ink transition-all hover:bg-ink hover:text-paper disabled:opacity-40">↑</button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
