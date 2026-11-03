"use client";
import Link from "next/link";
import { useState } from "react";
import { useSite } from "../layout/SiteProvider";
import Hl from "../ui/Hl";
import Photo from "../ui/Photo";
import Reveal from "../ui/Reveal";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "bangladesh", label: "Bangladesh", add: "Add new city" },
  { key: "abroad", label: "Abroad", add: "Add new country" },
] as const;

/** Toggle Bangladesh (cities) / Abroad (countries). Each card opens that place's own page. The admin also gets an "Add new" card. */
export default function TravelExplorer() {
  const { places, editing: admin } = useSite();
  const [region, setRegion] = useState<"bangladesh" | "abroad">("bangladesh");
  const list = places.filter((p) => p.region === region);
  const tab = tabs.find((t) => t.key === region)!;

  return (
    <div>
      <div role="tablist" className="mb-8 inline-flex rounded-full border border-g300 bg-paper p-1">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={region === t.key} data-link onClick={() => setRegion(t.key)}
            className={cn("rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] transition-colors",
              region === t.key ? "bg-ink text-paper" : "text-g600 hover:text-accent-d")}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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
        {admin && (
          <Link href="/ar6061?tab=places&new=1" data-link
            className="grid min-h-[220px] place-items-center rounded-2xl border-2 border-dashed border-accent/60 text-center text-sm font-bold uppercase tracking-[0.1em] text-accent-d transition-colors hover:bg-accent/10">
            + {tab.add}
          </Link>
        )}
      </div>
      {list.length === 0 && !admin && <p className="text-sm text-g600">Nothing here yet.</p>}
    </div>
  );
}
