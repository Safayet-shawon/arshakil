"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface LightboxItem { src: string; title: string; kicker?: string; description?: string }

/**
 * A photo opened large over the page: arrows and swipe to move to the next or previous photo,
 * Esc / a click outside / Close to leave. Used by every photo grid on the site.
 */
export default function Lightbox({ items, index, onIndex, onClose }: {
  items: LightboxItem[]; index: number | null; onIndex: (i: number) => void; onClose: () => void;
}) {
  const touch = useRef<{ x: number; y: number } | null>(null);
  const open = index !== null && items[index];
  const n = items.length;

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % n);
      if (e.key === "ArrowLeft") onIndex((index - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    // keep the page behind it still, and warm up the neighbours so arrows feel instant
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    for (const k of [index + 1, index - 1]) { const it = items[(k + n) % n]; if (it) new Image().src = it.src; }
    return () => { window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = prev; };
  }, [index, n, items, onIndex, onClose]);

  if (index === null || !open) return null;
  const item = items[index];
  const go = (d: number) => onIndex((index + d + n) % n);

  // drawn straight into <body>: inside an animated parent a "fixed" box would be cut to that parent
  return createPortal(
    <div role="dialog" aria-label={item.title} className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4 bg-ink/95 p-4" onClick={onClose}
      onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => {
        const s = touch.current; touch.current = null;
        if (!s || n < 2) return;
        const dx = e.changedTouches[0].clientX - s.x, dy = e.changedTouches[0].clientY - s.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
      }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.src} alt={item.title} className="max-h-[74vh] max-w-[92vw] object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
      <div className="max-w-xl text-center" onClick={(e) => e.stopPropagation()}>
        <div className="label text-accent">{item.kicker ? `${item.kicker} · ` : ""}{String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</div>
        <div className="font-display text-3xl text-g50">{item.title}</div>
        {item.description && <p className="mt-1 text-sm leading-relaxed text-g300">{item.description}</p>}
      </div>
      <button data-link aria-label="Close" onClick={onClose} className="absolute right-5 top-5 rounded-full border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-g50 hover:border-accent hover:text-accent">Close</button>
      {n > 1 && (
        <>
          <button data-link aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-ink/40 px-4 py-3 text-g50 hover:border-accent hover:text-accent">←</button>
          <button data-link aria-label="Next photo" onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-ink/40 px-4 py-3 text-g50 hover:border-accent hover:text-accent">→</button>
        </>
      )}
    </div>,
    document.body,
  );
}
