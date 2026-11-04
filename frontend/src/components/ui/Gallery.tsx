"use client";
import { useEffect, useState } from "react";
import { photoSrc } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { Photo } from "@/types";

/**
 * Photos of one album with a simple lightbox (click, arrow keys, Esc).
 * "mosaic" is the short preview (one big frame and a few small ones); "masonry" is the full album.
 */
export default function Gallery({ items, layout = "masonry" }: { items: Photo[]; layout?: "mosaic" | "masonry" }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % items.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  const shown = open !== null ? items[open] : null;
  const mosaic = layout === "mosaic";
  const big = mosaic && items.length >= 3;
  // with one big frame, the last row is filled edge to edge: 4 frames -> the last one spans 3 columns, 5 -> 2
  const lastSpan = items.length === 4 ? "col-span-3" : items.length === 5 ? "col-span-2" : "";
  const cols = items.length === 1 ? "grid-cols-1" : items.length === 2 ? "grid-cols-2" : "grid-cols-3";

  const tile = (g: Photo, i: number) => (
    <button key={g.photo + i} data-view onClick={() => setOpen(i)}
      className={cn("group relative block overflow-hidden text-left", mosaic ? "h-full w-full" : "mb-3 w-full", big && i === 0 && "col-span-2 row-span-2", big && i === items.length - 1 && i > 2 && lastSpan)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photoSrc(g.photo)} alt={g.title} loading="lazy"
        className={cn("block w-full transition-transform duration-700 group-hover:scale-105", mosaic ? "h-full object-cover" : "h-auto")} />
      <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/80 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="font-display text-xl text-g50">{g.title}</span>
      </span>
    </button>
  );

  return (
    <>
      {mosaic
        ? <div className={cn("grid auto-rows-[clamp(120px,19vw,260px)] gap-3", cols)}>{items.map(tile)}</div>
        : <div className="columns-2 gap-3 md:columns-3 xl:columns-4">{items.map(tile)}</div>}

      {shown && (
        <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4 bg-ink/95 p-4" onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoSrc(shown.photo)} alt={shown.title} className="max-h-[74vh] max-w-[92vw] object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <div className="max-w-xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="label text-accent">{shown.category} · {String(open! + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</div>
            <div className="font-display text-3xl text-g50">{shown.title}</div>
            {shown.description && <p className="mt-1 text-sm leading-relaxed text-g300">{shown.description}</p>}
          </div>
          <button data-link aria-label="Close" onClick={() => setOpen(null)} className="absolute right-5 top-5 rounded-full border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-g50 hover:border-accent hover:text-accent">Close</button>
          <button data-link aria-label="Previous" onClick={(e) => { e.stopPropagation(); setOpen((open! - 1 + items.length) % items.length); }} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 px-4 py-3 text-g50 hover:border-accent hover:text-accent">←</button>
          <button data-link aria-label="Next" onClick={(e) => { e.stopPropagation(); setOpen((open! + 1) % items.length); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 px-4 py-3 text-g50 hover:border-accent hover:text-accent">→</button>
        </div>
      )}
    </>
  );
}
