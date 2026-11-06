"use client";
import { useEffect, useRef } from "react";
import { getCursorPull } from "@/lib/attention";
import { prefersReducedMotion } from "@/lib/utils";

const TRAIL = 8;

/**
 * Mustard cursor: dot + lagging ring + short trail. The ring grows over links and turns into a
 * solid "VIEW" disc over [data-view] rows; a click sends out a ripple. Real pointers only.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const hand = useRef<HTMLDivElement>(null);
  const trail = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
    document.documentElement.classList.add("has-cursor");

    let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
    const pts = Array.from({ length: TRAIL }, () => ({ x: mx, y: my }));
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx}px,${my}px)`;
    };
    // an open hand over anything draggable, a closed fist while it is being dragged
    const setHand = (state: "grab" | "grabbing" | null) => {
      if (!hand.current) return;
      hand.current.setAttribute("data-on", state ? "1" : "0");
      if (state) hand.current.textContent = state === "grabbing" ? "✊" : "✋";
    };
    const apply = (t: Element) => {
      const view = !!t.closest("[data-view]");
      const grab = !!t.closest("[data-grab]");
      const link = !!t.closest("a,button,[data-link]");
      ring.current?.setAttribute("data-state", grab ? "grab" : view ? "view" : link ? "link" : "idle");
      label.current?.setAttribute("data-on", view && !grab ? "1" : "0");
      setHand(grab ? "grab" : null);
    };
    const onOver = (e: MouseEvent) => apply(e.target as Element);
    const onUp = (e: MouseEvent) => apply(document.elementFromPoint(e.clientX, e.clientY) ?? (e.target as Element));
    const onDown = (e: MouseEvent) => {
      if ((e.target as Element).closest("[data-grab]")) { ring.current?.setAttribute("data-state", "grabbing"); setHand("grabbing"); return; }
      const r = document.createElement("div");
      r.className = "pointer-events-none fixed z-[9998] h-3 w-3 -ml-1.5 -mt-1.5 rounded-full border-2 border-accent";
      r.style.cssText += `left:${e.clientX}px;top:${e.clientY}px;animation:ripple .7s ease-out forwards`;
      document.body.append(r);
      setTimeout(() => r.remove(), 700);
    };

    const loop = () => {
      // the robot can drag the cursor over to itself
      const p = getCursorPull();
      if (p) {
        mx += (p.x - mx) * 0.045; my += (p.y - my) * 0.045;
        if (dot.current) dot.current.style.transform = `translate(${mx}px,${my}px)`;
      }
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      const t = `translate(${rx}px,${ry}px)`;
      if (ring.current) ring.current.style.transform = t;
      if (label.current) label.current.style.transform = t;
      if (hand.current) hand.current.style.transform = t;
      let px = rx, py = ry;
      pts.forEach((p, i) => {
        p.x += (px - p.x) * 0.35; p.y += (py - p.y) * 0.35;
        const el = trail.current[i];
        if (el) el.style.transform = `translate(${p.x}px,${p.y}px) scale(${1 - (i / TRAIL) * 0.6})`;
        px = p.x; py = p.y;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  const base = "pointer-events-none fixed left-0 top-0 hidden [@media(hover:hover)_and_(pointer:fine)]:block will-change-transform";
  return (
    <>
      {Array.from({ length: TRAIL }, (_, i) => (
        <div key={i} ref={(el) => { trail.current[i] = el; }} style={{ opacity: 0.4 * (1 - i / TRAIL) }}
          className={`${base} z-[9997] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-accent`} />
      ))}
      <div ref={ring} data-state="idle"
        className={`${base} z-[9999] -ml-[19px] -mt-[19px] h-[38px] w-[38px] rounded-full border-[1.5px] border-accent transition-[width,height,margin,background] duration-250
          data-[state=link]:-ml-[34px] data-[state=link]:-mt-[34px] data-[state=link]:h-[68px] data-[state=link]:w-[68px] data-[state=link]:bg-accent/15
          data-[state=view]:-ml-12 data-[state=view]:-mt-12 data-[state=view]:h-24 data-[state=view]:w-24 data-[state=view]:bg-accent
          data-[state=grab]:-ml-6 data-[state=grab]:-mt-6 data-[state=grab]:h-12 data-[state=grab]:w-12 data-[state=grab]:bg-accent/25
          data-[state=grabbing]:-ml-5 data-[state=grabbing]:-mt-5 data-[state=grabbing]:h-10 data-[state=grabbing]:w-10 data-[state=grabbing]:bg-accent/40`} />
      <div ref={dot} className={`${base} z-[9999] -ml-1 -mt-1 h-2 w-2 rounded-full bg-accent`} />
      <div ref={hand} data-on="0" aria-hidden
        className={`${base} z-[9999] -ml-3 -mt-3.5 w-6 text-center text-[20px] leading-none opacity-0 transition-opacity duration-150 data-[on=1]:opacity-100`} />
      <div ref={label} data-on="0"
        className={`${base} z-[9999] -ml-4 -mt-1.5 w-8 text-center font-display text-[13px] tracking-[0.12em] text-paper opacity-0 transition-opacity duration-200 data-[on=1]:opacity-100`}>VIEW</div>
    </>
  );
}
