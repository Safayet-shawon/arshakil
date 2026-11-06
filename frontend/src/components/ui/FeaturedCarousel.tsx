"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { photoSrc } from "@/lib/media";
import { cn } from "@/lib/utils";

export interface Slide { title: string; kicker: string; href: string; photo: string; external?: boolean }

/**
 * The items an admin marked "Featured in this section", as a swipeable carousel at the top of the page.
 * Arrows, dots, swipe or scroll; moves on by itself every few seconds until the visitor touches it.
 */
export default function FeaturedCarousel({ slides, label }: { slides: Slide[]; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;

  const go = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const k = (i + n) % n;
    el.scrollTo({ left: k * el.clientWidth, behavior: "smooth" });
  }, [n]);

  useEffect(() => {
    if (n < 2 || paused) return;
    const t = setInterval(() => go(at + 1), 5200);
    return () => clearInterval(t);
  }, [at, n, paused, go]);

  const card = (s: Slide) => (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {s.photo && <img src={photoSrc(s.photo)} alt={s.title} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
      <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-5 md:p-8">
        <span className="label block text-accent">{s.kicker}</span>
        <span className="font-display mt-1 block text-[clamp(30px,5vw,68px)] leading-[0.95] text-g50">{s.title}</span>
        <span className="label mt-3 inline-block text-g200 transition-colors group-hover:text-accent">Open ↗</span>
      </span>
    </>
  );

  return (
    <section aria-label={label} className="px-5 pb-[clamp(20px,3vw,40px)] md:px-[clamp(20px,3.4vw,48px)]"
      onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="label mb-3 flex items-center justify-between text-g500">
        <span><b className="text-accent-d">★</b> {label}</span>
        {n > 1 && <span>{String(at + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>}
      </div>
      <div className="relative">
        <div ref={track} data-lenis-prevent-wheel
          onScroll={(e) => { const el = e.currentTarget; setAt(Math.round(el.scrollLeft / el.clientWidth)); }}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {slides.map((s) => (
            <div key={s.href + s.title} className="relative aspect-[4/3] w-full shrink-0 snap-center sm:aspect-[16/8]">
              {s.external
                ? <a href={s.href} target="_blank" rel="noreferrer" data-view className="group absolute inset-0 block overflow-hidden bg-g200">{card(s)}</a>
                : <Link href={s.href} data-view className="group absolute inset-0 block overflow-hidden bg-g200">{card(s)}</Link>}
            </div>
          ))}
        </div>
        {n > 1 && (
          <>
            <button data-link aria-label="Previous" onClick={() => go(at - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/85 px-4 py-3 text-ink shadow transition-colors hover:bg-accent">←</button>
            <button data-link aria-label="Next" onClick={() => go(at + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/85 px-4 py-3 text-ink shadow transition-colors hover:bg-accent">→</button>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
              {slides.map((s, i) => (
                <button key={s.href + s.title} data-link aria-label={`Show ${s.title}`} onClick={() => go(i)}
                  className={cn("h-2 rounded-full transition-all", i === at ? "w-6 bg-accent" : "w-2 bg-paper/70 hover:bg-paper")} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
