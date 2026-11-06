"use client";
import { useEffect, useRef, useState } from "react";
import { photoSrc } from "@/lib/media";

export interface HeroFrame { mode: "portrait" | "full"; x: number; y: number; zoom: number }

/** The screens the home page top is drawn for: width x height in pixels. */
const SCREEN = { desktop: { w: 1440, h: 900 }, phone: { w: 390, h: 800 } } as const;

/**
 * A true-to-size copy of the home page top (same sizes and places as the live site), shrunk to fit the panel.
 * Shows the picture exactly as visitors will see it, on a computer or on a phone. Drag the picture to move it.
 */
export default function HeroPreview({ src, frame, device, onMove }: {
  src: string; frame: HeroFrame; device: "desktop" | "phone"; onMove: (dx: number, dy: number) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0.4);
  const last = useRef<{ x: number; y: number } | null>(null);
  const { w, h } = SCREEN[device];
  const phone = device === "phone";

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setK(el.clientWidth / w);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);

  // the same numbers the live hero uses (see components/home/Hero.tsx), turned from vh / vw into pixels
  const vh = h / 100, vw = w / 100;
  const nameSize = Math.max(30, Math.min(phone ? 12.4 * vw : 10.4 * vw, 15 * vh, 190));
  const portH = (phone ? 72 : 92) * vh;
  const portW = (portH * 1176) / 1338;
  const portTop = (phone ? 28 : 39) * vh;
  const framing = { objectPosition: `${frame.x}% ${frame.y}%`, transform: `scale(${frame.zoom / 100})`, transformOrigin: `${frame.x}% ${frame.y}%` };
  // dragging moves the picture by the part of its own size the pointer travelled
  const size = frame.mode === "full" ? { w: w * k, h: h * k } : { w: portW * k, h: portH * k };

  return (
    <div ref={box} className="w-full" style={{ height: h * k }}>
      <div data-grab style={{ touchAction: "none" }} className="relative h-full w-full cursor-grab select-none overflow-hidden rounded-xl border border-g300 active:cursor-grabbing"
        onPointerDown={(e) => { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); last.current = { x: e.clientX, y: e.clientY }; }}
        onPointerMove={(e) => {
          const l = last.current; if (!l) return;
          onMove(-((e.clientX - l.x) / size.w) * 100, -((e.clientY - l.y) / size.h) * 100);
          last.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => { last.current = null; }} onPointerCancel={() => { last.current = null; }}>
        <div style={{ width: w, height: h, transform: `scale(${k})`, transformOrigin: "top left" }}
          className="relative overflow-hidden bg-[linear-gradient(to_bottom,#fff_0%,#fff_72%,var(--color-g100)_100%)]">
          {frame.mode === "full" ? (
            <div className="absolute inset-0 z-[1] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoSrc(src)} alt="" draggable={false} className="pointer-events-none block h-full w-full object-cover" style={framing} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/55 via-white/20 to-white/60" />
            </div>
          ) : (
            <div className="pointer-events-none absolute z-[2]" style={{ left: "50%", top: portTop, height: portH, width: portW, transform: "translateX(-50%)", opacity: 0.62 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoSrc(src)} alt="" draggable={false} className="block h-full w-full object-cover [mask-image:linear-gradient(to_bottom,#000_62%,transparent)]" style={framing} />
            </div>
          )}

          {/* the name, in front */}
          <div className="font-display pointer-events-none absolute inset-x-0 z-[3] text-center leading-[0.9] whitespace-nowrap text-ink" style={{ top: (phone ? 12 : 13) * vh, fontSize: nameSize }}>
            <div>AR. SHAKHAOUTH</div>
            <div>HOSSAIN SHAKIL</div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] bg-gradient-to-t from-white from-[4%] to-transparent" style={{ height: 28 * vh }} />

          {/* the words at the left, in front */}
          <div className="pointer-events-none absolute z-[4]" style={{ left: phone ? 20 : Math.max(20, Math.min(110, 6.5 * vw)), right: phone ? 20 : undefined, top: (phone ? 56 : 54) * vh }}>
            <div className="mb-3 h-[3px] w-[38px] bg-accent" />
            <div className="font-display leading-none text-ink" style={{ fontSize: Math.max(26, Math.min(64, 3.1 * vw, 6 * vh)) }}>ARCHITECT</div>
            <div className="mt-4 max-w-[360px] text-[15px] leading-relaxed text-g600">Designing spaces and stories that are calm, considered, and built to last.</div>
            <div className="mt-5 inline-block rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-paper">Let&apos;s collaborate ↗</div>
          </div>
        </div>
      </div>
    </div>
  );
}
