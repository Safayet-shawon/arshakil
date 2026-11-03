"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { mapLink, places } from "@/data/content";
import Hl from "../ui/Hl";
import Photo from "../ui/Photo";
import Reveal from "../ui/Reveal";
import { cn } from "@/lib/utils";

const TravelMap = dynamic(() => import("./TravelMap"), {
  ssr: false,
  loading: () => <div className="h-[clamp(320px,60vh,560px)] rounded-2xl bg-g200" />,
});

const tabs = [
  { key: "bangladesh", label: "Bangladesh" },
  { key: "abroad", label: "Abroad" },
] as const;

/** Toggle Bangladesh / Abroad: the matching map on top, one Facebook-style post per place below. */
export default function TravelExplorer() {
  const [region, setRegion] = useState<"bangladesh" | "abroad">("bangladesh");
  const list = places.filter((p) => p.region === region);

  return (
    <div>
      <div role="tablist" className="mb-6 inline-flex rounded-full border border-g300 bg-paper p-1">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={region === t.key} data-link onClick={() => setRegion(t.key)}
            className={cn("rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] transition-colors",
              region === t.key ? "bg-ink text-paper" : "text-g600 hover:text-accent-d")}>
            {t.label}
          </button>
        ))}
      </div>

      <TravelMap key={region} places={list} world={region === "abroad"} />

      <div className="mx-auto mt-12 grid max-w-[640px] gap-8">
        {list.map((p) => (
          <Reveal key={p.slug}>
            <article id={`post-${p.slug}`} className="scroll-mt-24 overflow-hidden rounded-2xl border border-g200 bg-paper shadow-[0_8px_28px_rgba(77,79,83,0.07)]">
              <header className="flex items-center gap-3 px-5 py-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent font-display text-sm text-ink">AR</span>
                <div>
                  <div className="text-sm font-bold text-ink">{p.name}</div>
                  <div className="label text-g500">{p.country}</div>
                </div>
              </header>
              <Photo name={p.photo} alt={p.name} ratio="4/3" />
              <div className="grid gap-3 px-5 py-5">
                <p className="text-sm leading-relaxed text-g600"><Hl>{p.summary}</Hl></p>
                <ul className="grid gap-1.5 text-xs text-g600">
                  {p.ideas.map((x) => <li key={x}><span className="text-accent">— </span><Hl>{x}</Hl></li>)}
                </ul>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-g200 pt-4">
                  <span className="label text-g600">Estimated cost · {p.cost}</span>
                  <a href={mapLink(p.lat, p.lng)} target="_blank" rel="noreferrer" data-link className="label text-accent-d transition-colors hover:text-ink">Open in Google Maps ↗</a>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
