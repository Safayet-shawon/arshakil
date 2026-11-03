"use client";
import { useEffect, useState } from "react";
import type { ListDef } from "@/lib/schema";
import { photoSrc } from "@/lib/media";
import type { SiteContent } from "@/types";
import FieldInput from "./FieldInput";

type Item = Record<string, unknown>;

/** A list with Add / Edit / Delete and, where it applies, a Featured switch. Every change is saved straight away. */
export default function ListEditor({ def, content, save, startNew }: {
  def: ListDef; content: SiteContent; save: (items: Item[]) => Promise<void>; startNew?: boolean;
}) {
  const items = content[def.name] as unknown as Item[];
  const [editing, setEditing] = useState<{ index: number; item: Item } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (startNew) setEditing({ index: -1, item: { ...def.blank } }); }, [startNew, def]);

  const commit = async (next: Item[]) => { setBusy(true); await save(next); setBusy(false); };

  const submit = async () => {
    if (!editing) return;
    const next = [...items];
    if (editing.index < 0) next.unshift(editing.item); else next[editing.index] = editing.item;
    await commit(next);
    setEditing(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl text-ink">{def.label}</h2>
          <p className="mt-1 max-w-xl text-sm text-g600">{def.blurb}</p>
        </div>
        <button data-link onClick={() => setEditing({ index: -1, item: { ...def.blank } })}
          className="rounded-full bg-accent px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink hover:bg-accent-soft">+ Add new {def.singular}</button>
      </div>

      <ul className="mt-6 grid gap-2">
        {items.length === 0 && <li className="rounded-xl bg-paper p-5 text-sm text-g500">Nothing here yet.</li>}
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-4 rounded-xl bg-paper p-3 pr-4 shadow-[0_4px_16px_rgba(77,79,83,0.06)]">
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
              <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-g600">
                <input type="checkbox" className="h-4 w-4 accent-[#f7b500]" checked={!!it.featured}
                  onChange={() => commit(items.map((x, k) => (k === i ? { ...x, featured: !x.featured } : x)))} />
                Featured
              </label>
            )}
            <button onClick={() => setEditing({ index: i, item: { ...it } })} className="label text-g600 hover:text-accent-d">Edit</button>
            <button onClick={() => { if (confirm(`Delete "${def.title(it)}"?`)) commit(items.filter((_, k) => k !== i)); }} className="label text-g500 hover:text-ink">Delete</button>
          </li>
        ))}
      </ul>
      {busy && <p className="label mt-3 text-accent-d">Saving…</p>}

      {editing && (
        <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-ink/60 p-4" onClick={() => setEditing(null)}>
          <div className="my-8 grid w-full max-w-[560px] gap-4 rounded-2xl bg-g100 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-3xl text-ink">{editing.index < 0 ? `New ${def.singular}` : `Edit ${def.singular}`}</h3>
            {def.fields.map((f) => (
              <FieldInput key={f.key} def={f} item={editing.item} content={content} set={(patch) => setEditing((e) => (e ? { ...e, item: { ...e.item, ...patch } } : e))} />
            ))}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="rounded-full border border-g300 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-g600">Cancel</button>
              <button disabled={busy} onClick={submit} className="rounded-full bg-ink px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-paper hover:bg-g600 disabled:opacity-60">{busy ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
