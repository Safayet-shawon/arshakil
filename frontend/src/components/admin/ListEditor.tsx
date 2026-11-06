"use client";
import { useEffect, useRef, useState } from "react";
import type { ListDef } from "@/lib/schema";
import { photoSrc } from "@/lib/media";
import type { SiteContent } from "@/types";
import FieldInput from "./FieldInput";

type Item = Record<string, unknown>;

/** A list with Add / Edit / Delete and, where it applies, a Featured switch. Every change is saved straight away. */
export default function ListEditor({ def, content, save, startNew, show, blankPatch }: {
  def: ListDef; content: SiteContent; save: (items: Item[]) => Promise<void>; startNew?: boolean;
  /** Show only some items (the rest stay in the list). */
  show?: (it: Item) => boolean;
  /** Values a new item starts with (e.g. the section currently open). */
  blankPatch?: Item;
}) {
  const items = content[def.name] as unknown as Item[];
  const [editing, setEditing] = useState<{ index: number; item: Item } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (startNew) setEditing({ index: -1, item: { ...def.blank, ...blankPatch } }); }, [startNew, def]);

  // The form is a window of its own: keep the page behind it still while it is open.
  useEffect(() => {
    if (!editing) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = prev; };
  }, [editing]);

  // Only one item per section can be featured: choosing one switches the others off.
  const exclusive = (next: Item[], keep: Item) => (def.featurable && keep.featured ? next.map((x) => (x === keep ? x : { ...x, featured: false })) : next);

  const commit = async (next: Item[]) => { setBusy(true); await save(next); setBusy(false); };

  // order: grab a row's handle and drop it where it should go (or use the arrows); the site shows items in this order
  const [drag, setDrag] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const rows = useRef<Record<number, HTMLLIElement | null>>({});
  const [dy, setDy] = useState(0);
  const startY = useRef(0);
  const move = (from: number, to: number) => {
    if (from === to || to < 0 || to >= items.length) return;
    const next = [...items];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    commit(next);
  };
  const rowAt = (y: number) => {
    let best: number | null = null, bestD = Infinity;
    for (const [k, el] of Object.entries(rows.current)) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const d = y >= r.top && y <= r.bottom ? 0 : Math.min(Math.abs(y - r.top), Math.abs(y - r.bottom));
      if (d < bestD) { bestD = d; best = Number(k); }
    }
    return best;
  };
  const dragMove = (e: React.PointerEvent) => {
    if (drag === null) return;
    setDy(e.clientY - startY.current);
    setOver(rowAt(e.clientY));
    // near the top or bottom edge of the window the page scrolls along
    if (e.clientY < 90) window.scrollBy(0, -16); else if (e.clientY > window.innerHeight - 90) window.scrollBy(0, 16);
  };
  const dragEnd = (e: React.PointerEvent) => {
    if (drag === null) return;
    const to = rowAt(e.clientY);
    if (to !== null) move(drag, to);
    setDrag(null); setOver(null); setDy(0);
  };
  // among the rows currently shown (a filtered view), the nearest visible neighbour
  const visible = items.map((x, k) => (show && !show(x) ? -1 : k)).filter((k) => k >= 0);

  const submit = async () => {
    if (!editing) return;
    const next = [...items];
    if (editing.index < 0) next.unshift(editing.item); else next[editing.index] = editing.item;
    await commit(exclusive(next, editing.item));
    setEditing(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl text-ink">{def.label}</h2>
          <p className="mt-1 max-w-xl text-sm text-g600">{def.blurb}</p>
        </div>
        <button data-link onClick={() => setEditing({ index: -1, item: { ...def.blank, ...blankPatch } })}
          className="rounded-full bg-accent px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink hover:bg-accent-soft">+ Add new {def.singular}</button>
      </div>

      <ul className="mt-6 grid gap-2">
        {items.length === 0 && <li className="rounded-xl bg-paper p-5 text-sm text-g500">Nothing here yet.</li>}
        {items.map((it, i) => (show && !show(it) ? null : (
          <li key={i} ref={(el) => { rows.current[i] = el; }} style={drag === i ? { transform: `translateY(${dy}px) scale(1.01)`, position: "relative", zIndex: 30 } : undefined}
            className={`flex items-center gap-3 rounded-xl bg-paper p-3 pr-4 shadow-[0_4px_16px_rgba(77,79,83,0.06)] ${drag === i ? "cursor-grabbing shadow-[0_16px_36px_rgba(77,79,83,0.35)] ring-2 ring-accent" : "transition-shadow"} ${over === i && drag !== null && drag !== i ? "border-t-4 border-accent" : ""}`}>
            <span className="grid h-7 min-w-7 shrink-0 place-items-center rounded-full bg-g100 px-1.5 text-[11px] font-bold text-g600">{visible.indexOf(i) + 1}</span>
            <span className="flex shrink-0 flex-col items-center text-g400">
              <button aria-label="Move up" disabled={visible.indexOf(i) <= 0} onClick={() => move(i, visible[visible.indexOf(i) - 1])} className="px-1 text-[10px] leading-none hover:text-ink disabled:opacity-25">▲</button>
              <span title="Drag to reorder" data-grab onPointerDown={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); startY.current = e.clientY; setDy(0); setDrag(i); setOver(i); }} onPointerMove={dragMove} onPointerUp={dragEnd} onPointerCancel={() => { setDrag(null); setOver(null); setDy(0); }} style={{ touchAction: "none" }} className="cursor-grab select-none px-1 text-lg leading-none active:cursor-grabbing">⠿</span>
              <button aria-label="Move down" disabled={visible.indexOf(i) >= visible.length - 1} onClick={() => move(i, visible[visible.indexOf(i) + 1])} className="px-1 text-[10px] leading-none hover:text-ink disabled:opacity-25">▼</button>
            </span>
            {def.photo ? (
              typeof it[def.photo] === "string" && it[def.photo]
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={photoSrc(it[def.photo] as string)} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                : <span className="h-14 w-14 shrink-0 rounded-lg bg-g200" />
            ) : null}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-ink">{def.title(it)}</span>
              {def.name === "books" && <span className="label text-g500">৳ {String(it.priceBdt)} · {String(it.pages || 0)} pages</span>}
            </span>
            {def.featurable && (
              <span className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-g600">
                <label className="flex items-center gap-1.5" title="Shows in the home page's Selected work (one per section)">
                  <input type="checkbox" className="h-4 w-4 accent-[#f7b500]" checked={!!it.featured}
                    onChange={() => { const on = !it.featured; const next = items.map((x, k) => (k === i ? { ...x, featured: on } : x)); commit(exclusive(next, next[i])); }} />
                  Front page
                </label>
                <label className="flex items-center gap-1.5" title="Shows in the carousel at the top of its own section">
                  <input type="checkbox" className="h-4 w-4 accent-[#f7b500]" checked={!!it.featuredSection}
                    onChange={() => commit(items.map((x, k) => (k === i ? { ...x, featuredSection: !x.featuredSection } : x)))} />
                  Section
                </label>
              </span>
            )}
            <button onClick={() => setEditing({ index: i, item: def.prepare ? def.prepare({ ...it }, content) : { ...it } })} className="label text-g600 hover:text-accent-d">Edit</button>
            <button onClick={() => { if (confirm(`Delete "${def.title(it)}"?`)) commit(items.filter((_, k) => k !== i)); }} className="label text-g500 hover:text-ink">Delete</button>
          </li>
        )))}
      </ul>

      {editing && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/60 p-3 sm:p-6" onClick={() => setEditing(null)}>
          <div data-lenis-prevent className="flex max-h-[92svh] w-full max-w-[600px] flex-col overflow-hidden rounded-2xl bg-g100 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display shrink-0 border-b border-g200 px-6 py-4 text-3xl text-ink">{editing.index < 0 ? `New ${def.singular}` : `Edit ${def.singular}`}</h3>
            <div data-lenis-prevent className="grid min-h-0 flex-1 content-start gap-4 overflow-y-auto overscroll-contain px-6 py-5">
              {[...def.fields].sort((a, b) => Number(b.type === "image") - Number(a.type === "image")).map((f) => (
                <FieldInput key={f.key} def={f} item={editing.item} content={content} set={(patch) => setEditing((e) => (e ? { ...e, item: { ...e.item, ...patch } } : e))} />
              ))}
            </div>
            <div className="flex shrink-0 justify-end gap-3 border-t border-g200 bg-g100 px-6 py-4">
              <button onClick={() => setEditing(null)} className="rounded-full border border-g300 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-g600">Cancel</button>
              <button disabled={busy} onClick={submit} className="rounded-full bg-ink px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-paper hover:bg-g600 disabled:opacity-60">{busy ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
