"use client";
import { useState } from "react";
import { photoSrc } from "@/lib/media";
import type { SiteContent } from "@/types";
import { uploadImages } from "./upload";

const box = "w-full rounded-xl border border-g300 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(247,181,0,0.2)]";

interface Row { id: number; file: string; url?: string; failed?: boolean; title: string; description: string }
export interface BulkPhoto { title: string; description: string; photo: string }

const niceName = (f: string) => f.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").trim();

/**
 * Many photos at once, into one section (album): pick the section, choose the photos, give each a title and a
 * description if you like, then add them all. The panel then opens that section.
 */
export default function BulkUpload({ content, onAdd }: { content: SiteContent; onAdd: (album: string, isNew: boolean, photos: BulkPhoto[]) => Promise<void> }) {
  const [album, setAlbum] = useState("");
  const [fresh, setFresh] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);

  const target = (fresh.trim() || album).trim();
  const isNew = !!fresh.trim() && !content.categories.some((c) => c.name.toLowerCase() === fresh.trim().toLowerCase());
  const ready = rows.filter((r) => r.url);
  const uploading = rows.some((r) => !r.url && !r.failed);

  const pick = async (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (!files.length) return;
    const base = Date.now();
    setRows((r) => [...r, ...files.map((f, i) => ({ id: base + i, file: f.name, title: niceName(f.name), description: "" }))]);
    await uploadImages(files, (i, res) => {
      setRows((r) => r.map((x) => (x.id === base + i ? (res instanceof Error ? { ...x, failed: true } : { ...x, url: res.url }) : x)));
    });
  };

  const patch = (id: number, p: Partial<Row>) => setRows((r) => r.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const submit = async () => {
    setBusy(true);
    await onAdd(target, isNew, ready.map((r) => ({ title: r.title.trim() || niceName(r.file), description: r.description.trim(), photo: r.url! })));
    setBusy(false);
    setRows([]);
  };

  return (
    <div>
      <h2 className="font-display text-4xl text-ink">Bulk upload</h2>
      <p className="mt-1 max-w-xl text-sm text-g600">Add many photos to one section at once. Pick the section, choose the photos, give each a title and description if you like, then press Add.</p>

      <h3 className="label mt-6 text-accent-d">1 · Choose the section</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {content.categories.map((c) => (
          <button key={c.name} onClick={() => { setAlbum(c.name); setFresh(""); }}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${!fresh && album === c.name ? "bg-accent text-ink" : "bg-paper text-g600 hover:text-ink"}`}>
            {c.name} <span className="text-g500">· {content.gallery.filter((g) => g.category === c.name).length}</span>
          </button>
        ))}
      </div>
      <input value={fresh} onChange={(e) => setFresh(e.target.value)} placeholder="…or type a new section name" className={`${box} mt-3 max-w-xs`} aria-label="New section name" />

      <h3 className="label mt-8 text-accent-d">2 · Choose the photos</h3>
      <label className={`mt-2 inline-flex cursor-pointer items-center rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] ${target ? "bg-accent text-ink hover:bg-accent-soft" : "bg-g200 text-g500"}`}>
        {target ? `Choose photos for ${target}` : "Pick a section first"}
        <input type="file" accept="image/*" multiple disabled={!target} className="sr-only" onChange={(e) => { const l = e.target.files; pick(l); e.target.value = ""; }} />
      </label>

      {rows.length > 0 && (
        <>
          <h3 className="label mt-8 text-accent-d">3 · Titles and descriptions</h3>
          <ul className="mt-2 grid gap-3">
            {rows.map((r) => (
              <li key={r.id} className="flex gap-3 rounded-xl bg-paper p-3 shadow-[0_4px_16px_rgba(77,79,83,0.06)]">
                <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-g200 text-[11px] text-g500">
                  {r.url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={photoSrc(r.url)} alt="" className="h-full w-full object-cover" />
                    : r.failed ? "Failed" : "Uploading…"}
                </div>
                <div className="grid min-w-0 flex-1 gap-2">
                  <input value={r.title} onChange={(e) => patch(r.id, { title: e.target.value })} placeholder="Title" aria-label="Title" className={box} />
                  <textarea value={r.description} onChange={(e) => patch(r.id, { description: e.target.value })} rows={2} placeholder="Description (optional)" aria-label="Description" className={box} />
                </div>
                <button onClick={() => setRows((x) => x.filter((y) => y.id !== r.id))} aria-label="Remove" className="label self-start text-g500 hover:text-ink">Remove</button>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center gap-4">
            <button disabled={busy || uploading || !ready.length || !target} onClick={submit}
              className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-paper hover:bg-g600 disabled:opacity-50">
              {busy ? "Adding…" : uploading ? "Uploading…" : `Add ${ready.length} photo${ready.length === 1 ? "" : "s"} to ${target || "…"}`}
            </button>
            {isNew && <span className="label text-g500">A new section “{target}” will be created</span>}
          </div>
        </>
      )}
    </div>
  );
}
