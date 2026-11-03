"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { places } from "@/data/content";
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

/** Toggle Bangladesh / Abroad: the matching map on top, one card per place. Each place opens its own page. */
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

      <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.07}>
            <Link href={`/travel/${p.slug}`} data-view className="group block">
              <Photo name={p.photo} alt={p.name} ratio="4/3" />
              <div className="label mt-3 text-accent-d">{p.country}</div>
              <h3 className="font-display text-3xl text-ink transition-colors group-hover:text-accent-d">{p.name} <span aria-hidden className="text-accent">↗</span></h3>
              <p className="mt-2 text-sm leading-relaxed text-g600"><Hl>{p.summary}</Hl></p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
