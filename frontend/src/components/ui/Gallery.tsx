"use client";
import { useEffect, useState } from "react";
import { photoSrc } from "@/lib/media";
import { cn } from "@/lib/utils";
import { useSite } from "../layout/SiteProvider";

/** Masonry gallery: category filter + a simple lightbox (click, arrow keys, Esc). */
export default function Gallery() {
  const { gallery, categories } = useSite();
  const galleryCategories = ["All", ...categories.map((c) => c.name)];
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const items = gallery.filter((g) => cat === "All" || g.category === cat);

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

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {galleryCategories.map((c) => (
          <button key={c} data-link onClick={() => { setCat(c); setOpen(null); }}
            className={cn("rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors",
              cat === c ? "border-accent bg-accent text-ink" : "border-white/25 text-g300 hover:border-accent hover:text-accent")}>
            {c}
          </button>
        ))}
      </div>

      <div className="columns-2 gap-3 md:columns-3 xl:columns-4">
        {items.map((g, i) => (
          <button key={g.photo} data-view onClick={() => setOpen(i)} className="group relative mb-3 block w-full overflow-hidden text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoSrc(g.photo)} alt={g.title} loading="lazy" className="block h-auto w-full transition-transform duration-700 group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/80 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="label block text-[10px] text-accent">{g.category}</span>
              <span className="font-display text-xl text-g50">{g.title}</span>
            </span>
          </button>
        ))}
      </div>

      {shown && (
        <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4 bg-ink/95 p-4" onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoSrc(shown.photo)} alt={shown.title} className="max-h-[78vh] max-w-[92vw] object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <div className="text-center" onClick={(e) => e.stopPropagation()}>
            <div className="label text-accent">{shown.category} · {String(open! + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</div>
            <div className="font-display text-3xl text-g50">{shown.title}</div>
          </div>
          <button data-link aria-label="Close" onClick={() => setOpen(null)} className="absolute right-5 top-5 rounded-full border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-g50 hover:border-accent hover:text-accent">Close</button>
          <button data-link aria-label="Previous" onClick={(e) => { e.stopPropagation(); setOpen((open! - 1 + items.length) % items.length); }} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 px-4 py-3 text-g50 hover:border-accent hover:text-accent">←</button>
          <button data-link aria-label="Next" onClick={(e) => { e.stopPropagation(); setOpen((open! + 1) % items.length); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 px-4 py-3 text-g50 hover:border-accent hover:text-accent">→</button>
        </div>
      )}
    </>
  );
}
