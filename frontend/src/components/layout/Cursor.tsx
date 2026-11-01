"use client";
import { useEffect, useRef } from "react";
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
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element;
      const view = !!t.closest("[data-view]");
      const link = !!t.closest("a,button,[data-link]");
      ring.current?.setAttribute("data-state", view ? "view" : link ? "link" : "idle");
      label.current?.setAttribute("data-on", view ? "1" : "0");
    };
    const onDown = (e: MouseEvent) => {
      const r = document.createElement("div");
      r.className = "pointer-events-none fixed z-[9998] h-3 w-3 -ml-1.5 -mt-1.5 rounded-full border-2 border-accent";
      r.style.cssText += `left:${e.clientX}px;top:${e.clientY}px;animation:ripple .7s ease-out forwards`;
      document.body.append(r);
      setTimeout(() => r.remove(), 700);
    };

    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      const t = `translate(${rx}px,${ry}px)`;
      if (ring.current) ring.current.style.transform = t;
      if (label.current) label.current.style.transform = t;
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
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
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
          data-[state=view]:-ml-12 data-[state=view]:-mt-12 data-[state=view]:h-24 data-[state=view]:w-24 data-[state=view]:bg-accent`} />
      <div ref={dot} className={`${base} z-[9999] -ml-1 -mt-1 h-2 w-2 rounded-full bg-accent`} />
      <div ref={label} data-on="0"
        className={`${base} z-[9999] -ml-4 -mt-1.5 w-8 text-center font-display text-[13px] tracking-[0.12em] text-paper opacity-0 transition-opacity duration-200 data-[on=1]:opacity-100`}>VIEW</div>
    </>
  );
}
