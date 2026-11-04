"use client";
import { useEffect, useState } from "react";
import { photoSrc, SECTORS } from "@/lib/media";
import type { Album, AlbumPhoto, Sector, SiteContent } from "@/types";
import { uploadImages } from "./upload";

const box = "w-full rounded-xl border border-g300 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(247,181,0,0.2)]";
const pill = (on: boolean) => `rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${on ? "bg-accent text-ink" : "bg-paper text-g600 hover:text-ink"}`;
const niceName = (f: string) => f.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").trim();

/**
 * Photo albums of one sector. The list shows each album as a card with "+ New album". Opening (or creating) one gives
 * a draft to work on: add photos, set titles and descriptions, then Save, which stores it and returns to the list.
 */
export default function AlbumsEditor({ sector, content, save }: { sector: Sector; content: SiteContent; save: (items: Album[]) => Promise<Album[] | null> }) {
  const label = SECTORS.find((s) => s.key === sector)?.label ?? "";
  const mine = content.albums.filter((a) => a.sector === sector);
  const [draft, setDraft] = useState<Album | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [picker, setPicker] = useState(false);

  useEffect(() => { setDraft(null); setDirty(false); }, [sector]);

  const openAlbum = (a: Album) => { setDraft({ ...a, photos: a.photos.map((p) => ({ ...p })) }); setIsNew(false); setDirty(false); };
  const startNew = () => { setDraft({ slug: "", sector, name: "", description: "", photos: [] }); setIsNew(true); setDirty(false); };
  const change = (p: Partial<Album>) => { setDraft((d) => (d ? { ...d, ...p } : d)); setDirty(true); };
  const editPhoto = (i: number, p: Partial<AlbumPhoto>) => change({ photos: draft!.photos.map((x, k) => (k === i ? { ...x, ...p } : x)) });
  const leave = () => { if (!dirty || confirm("Leave without saving your changes?")) { setDraft(null); setDirty(false); } };

  const submit = async () => {
    if (!draft) return;
    if (!draft.name.trim()) { alert("Give the album a name first."); return; }
    setBusy(true);
    const next = { ...draft, name: draft.name.trim() };
    const items = await save(isNew ? [...content.albums, next] : content.albums.map((a) => (a.slug === next.slug ? next : a)));
    setBusy(false);
    if (items) { setDraft(null); setDirty(false); }
  };

  const remove = async () => {
    if (!draft || isNew) return;
    if (!confirm(`Delete the album "${draft.name}"? The photos stay in the site's storage.`)) return;
    setBusy(true);
    await save(content.albums.filter((a) => a.slug !== draft.slug));
    setBusy(false); setDraft(null); setDirty(false);
  };

  if (draft) {
    return (
      <div>
        <button onClick={leave} className="label text-g600 hover:text-accent-d">← All {label} albums</button>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div className="grid min-w-[240px] max-w-xl flex-1 gap-2">
            <input value={draft.name} onChange={(e) => change({ name: e.target.value })} placeholder="Album name" aria-label="Album name"
              className="font-display w-full border-b border-g300 bg-transparent text-4xl text-ink outline-none placeholder:text-g300 focus:border-accent" />
            <textarea value={draft.description} onChange={(e) => change({ description: e.target.value })} rows={2} placeholder="A line about this album (optional)" aria-label="Album description" className={box} />
          </div>
          <button onClick={() => setPicker(true)} className="rounded-full bg-accent px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink hover:bg-accent-soft">+ Add photos</button>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {draft.photos.length === 0 && <li className="rounded-xl bg-paper p-5 text-sm text-g500 sm:col-span-2">No photos yet. Press “+ Add photos”.</li>}
          {draft.photos.map((p, i) => (
            <li key={p.photo + i} className="flex gap-3 rounded-xl bg-paper p-3 shadow-[0_4px_16px_rgba(77,79,83,0.06)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoSrc(p.photo)} alt="" className="h-24 w-24 shrink-0 rounded-lg object-cover" />
              <div className="grid min-w-0 flex-1 gap-2">
                <input value={p.title} onChange={(e) => editPhoto(i, { title: e.target.value })} placeholder="Title" aria-label="Title" className={box} />
                <textarea value={p.description ?? ""} onChange={(e) => editPhoto(i, { description: e.target.value })} rows={2} placeholder="Description (optional)" aria-label="Description" className={box} />
              </div>
              <button onClick={() => change({ photos: draft.photos.filter((_, k) => k !== i) })} aria-label="Remove from album" className="label self-start text-g500 hover:text-ink">Remove</button>
            </li>
          ))}
        </ul>

        <div className="sticky bottom-0 -mx-1 mt-6 flex flex-wrap items-center gap-3 border-t border-g300 bg-g200/95 px-1 py-4 backdrop-blur">
          <button disabled={busy} onClick={submit} className="rounded-full bg-ink px-7 py-3 text-xs font-bold uppercase tracking-[0.1em] text-paper hover:bg-g600 disabled:opacity-60">{busy ? "Saving…" : "Save album"}</button>
          <button onClick={leave} className="rounded-full border border-g300 px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-g600 hover:text-ink">Cancel</button>
          {!isNew && <button onClick={remove} className="label ml-auto text-g500 hover:text-ink">Delete album</button>}
          {dirty && <span className="label text-accent-d">Not saved yet</span>}
        </div>

        {picker && <Picker content={content} onClose={() => setPicker(false)} onAdd={(added) => { change({ photos: [...draft.photos, ...added] }); setPicker(false); }} />}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl text-ink">{label} albums</h2>
          <p className="mt-1 max-w-xl text-sm text-g600">Albums appear on the {label} page. Open one to add photos: upload new ones, or pick from Architectural Photography.</p>
        </div>
        <button onClick={startNew} className="rounded-full bg-accent px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink hover:bg-accent-soft">+ New album</button>
      </div>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mine.length === 0 && <li className="rounded-xl bg-paper p-5 text-sm text-g500 sm:col-span-3">No albums yet. Press “+ New album”.</li>}
        {mine.map((a) => (
          <li key={a.slug}>
            <button onClick={() => openAlbum(a)} className="group block w-full text-left">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-4 border-paper bg-g200 shadow-[0_8px_24px_rgba(77,79,83,0.14)] transition-transform group-hover:-translate-y-1">
                {a.photos[0]
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={photoSrc(a.photos[0].photo)} alt="" className="h-full w-full object-cover" />
                  : <span className="grid h-full place-items-center text-xs text-g500">Empty album</span>}
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <span className="font-display text-2xl text-ink group-hover:text-accent-d">{a.name}</span>
                <span className="label text-g500">{a.photos.length} · Edit</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "Add photos": upload new pictures, or choose photos already in Architectural Photography. */
function Picker({ content, onAdd, onClose }: { content: SiteContent; onAdd: (p: AlbumPhoto[]) => void; onClose: () => void }) {
  const [mode, setMode] = useState<"upload" | "gallery">("upload");
  const [section, setSection] = useState("");
  const [chosen, setChosen] = useState<string[]>([]);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = prev; };
  }, []);

  const upload = async (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (!files.length) return;
    setBusy(`Uploading ${files.length} photo${files.length > 1 ? "s" : ""}…`); setErr("");
    const res = await uploadImages(files);
    const ok = res.flatMap((r, i) => (r instanceof Error ? [] : [{ photo: r.url, title: niceName(files[i].name) }]));
    setBusy("");
    if (ok.length < files.length) setErr(`${files.length - ok.length} photo(s) could not be uploaded`);
    if (ok.length) onAdd(ok);
  };

  const photos = content.gallery.filter((g) => !section || g.category === section);
  const toggle = (p: string) => setChosen((c) => (c.includes(p) ? c.filter((x) => x !== p) : [...c, p]));
  const addChosen = () => onAdd(chosen.map((p) => { const g = content.gallery.find((x) => x.photo === p)!; return { photo: g.photo, title: g.title, description: g.description }; }));

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/60 p-3 sm:p-6" onClick={onClose}>
      <div data-lenis-prevent className="flex max-h-[92svh] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl bg-g100 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="shrink-0 border-b border-g200 px-6 py-4">
          <h3 className="font-display text-3xl text-ink">Add photos</h3>
          <div className="mt-3 flex gap-2">
            <button onClick={() => setMode("upload")} className={pill(mode === "upload")}>Upload new</button>
            <button onClick={() => setMode("gallery")} className={pill(mode === "gallery")}>From Architectural Photography</button>
          </div>
        </div>

        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">
          {mode === "upload" ? (
            <div className="grid gap-3">
              <p className="text-sm text-g600">Choose as many pictures as you like. They are added to this album; give each a title and description afterwards, then Save the album.</p>
              <label className="inline-flex w-fit cursor-pointer items-center rounded-full bg-accent px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink hover:bg-accent-soft">
                Choose photos
                <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { const l = e.target.files; upload(l); e.target.value = ""; }} />
              </label>
              {busy && <span className="text-xs text-accent-d">{busy}</span>}
              {err && <span role="alert" className="text-xs text-g600">{err}</span>}
            </div>
          ) : (
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {["", ...content.categories.map((c) => c.name)].map((n) => (
                  <button key={n || "all"} onClick={() => setSection(n)} className={pill(section === n)}>{n || "All"}</button>
                ))}
              </div>
              {photos.length === 0 && <p className="text-sm text-g500">No photos here yet.</p>}
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {photos.map((g) => {
                  const on = chosen.includes(g.photo);
                  return (
                    <button key={g.photo} onClick={() => toggle(g.photo)} aria-pressed={on}
                      className={`relative aspect-square overflow-hidden rounded-lg bg-g200 outline-offset-2 ${on ? "outline outline-[3px] outline-[#f7b500]" : ""}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photoSrc(g.photo)} alt={g.title} className="h-full w-full object-cover" />
                      {on && <span className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold text-ink">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-g200 bg-g100 px-6 py-4">
          <button onClick={onClose} className="rounded-full border border-g300 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-g600">Cancel</button>
          {mode === "gallery" && (
            <button disabled={!chosen.length} onClick={addChosen} className="rounded-full bg-ink px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-paper hover:bg-g600 disabled:opacity-50">
              Add {chosen.length || ""} selected
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
