"use client";
import { useMemo, useState } from "react";
import { resized } from "@/lib/media";
import Img from "./Img";
import { cn } from "@/lib/utils";
import type { Photo } from "@/types";
import Lightbox from "./Lightbox";

/**
 * Photos of one album with a simple lightbox (click, arrow keys, Esc).
 * "mosaic" is the short preview (one big frame and a few small ones); "masonry" is the full album.
 */
export default function Gallery({ items, layout = "masonry" }: { items: Photo[]; layout?: "mosaic" | "masonry" }) {
  const [open, setOpen] = useState<number | null>(null);

  const lightItems = useMemo(() => items.map((g) => ({ src: resized(g.photo, 1920), title: g.title, kicker: g.category, description: g.description })), [items]);

  const mosaic = layout === "mosaic";
  const big = mosaic && items.length >= 3;
  // with one big frame, the last row is filled edge to edge: 4 frames -> the last one spans 3 columns, 5 -> 2
  const lastSpan = items.length === 4 ? "col-span-3" : items.length === 5 ? "col-span-2" : "";
  const cols = items.length === 1 ? "grid-cols-1" : items.length === 2 ? "grid-cols-2" : "grid-cols-3";

  const tile = (g: Photo, i: number) => (
    <button key={g.photo + i} data-view onClick={() => setOpen(i)}
      className={cn("group relative block overflow-hidden text-left", mosaic ? "h-full w-full" : "mb-3 w-full", big && i === 0 && "col-span-2 row-span-2", big && i === items.length - 1 && i > 2 && lastSpan)}>
      <Img name={g.photo} alt={g.title} sizes={mosaic ? "(min-width:768px) 22vw, 34vw" : "(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"}
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

      <Lightbox items={lightItems} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </>
  );
}
