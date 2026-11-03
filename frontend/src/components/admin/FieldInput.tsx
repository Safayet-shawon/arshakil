"use client";
import { useState } from "react";
import type { FieldDef } from "@/lib/schema";
import { photoSrc } from "@/lib/media";
import type { SiteContent } from "@/types";
import { uploadImage, uploadPdf } from "./upload";

const box = "w-full rounded-xl border border-g300 bg-paper px-4 py-2.5 text-sm text-ink outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(247,181,0,0.2)]";

type Item = Record<string, unknown>;

/** One form control, picked by the field's type. Image and PDF fields upload as soon as a file is chosen. */
export default function FieldInput({ def, item, set, content }: { def: FieldDef; item: Item; set: (patch: Item) => void; content: SiteContent }) {
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const v = item[def.key];

  const pick = async (file: File | undefined, kind: "image" | "pdf") => {
    if (!file) return;
    setBusy(kind === "pdf" ? "Uploading PDF…" : "Uploading photo…"); setErr("");
    try {
      if (kind === "image") set({ [def.key]: await uploadImage(file) });
      else { const r = await uploadPdf(file); set({ [def.key]: r.key, pages: r.pages }); }
    } catch (e) { setErr((e as Error).message); }
    setBusy("");
  };

  const options = (() => {
    if (!def.options) return [];
    if (Array.isArray(def.options)) return def.options.map((o) => ({ value: o, label: o }));
    const o = def.options;
    return (content[o.list] as unknown as Item[]).map((x) => ({ value: String(x[o.value]), label: String(x[o.label]) }));
  })();

  return (
    <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-g600">
      <span>{def.label}</span>
      {def.type === "text" && <input className={box} value={String(v ?? "")} onChange={(e) => set({ [def.key]: e.target.value })} />}
      {def.type === "number" && <input type="number" min={0} className={box} value={Number(v ?? 0)} onChange={(e) => set({ [def.key]: Number(e.target.value) })} />}
      {def.type === "textarea" && <textarea rows={4} className={box} value={String(v ?? "")} onChange={(e) => set({ [def.key]: e.target.value })} />}
      {def.type === "lines" && <textarea rows={4} className={box} value={((v as string[]) ?? []).join("\n")} onChange={(e) => set({ [def.key]: e.target.value.split("\n") })} onBlur={(e) => set({ [def.key]: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean) })} />}
      {def.type === "select" && (
        <select className={box} value={String(v ?? "")} onChange={(e) => set({ [def.key]: e.target.value })}>
          <option value="">Choose…</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}
      {def.type === "bool" && (
        <span className="flex items-center gap-2 text-sm normal-case tracking-normal text-ink">
          <input type="checkbox" className="h-4 w-4 accent-[#f7b500]" checked={!!v} onChange={(e) => set({ [def.key]: e.target.checked })} /> Yes
        </span>
      )}
      {def.type === "readonly" && <span className="text-sm normal-case tracking-normal text-ink">{String(v ?? "")}</span>}
      {def.type === "image" && (
        <span className="flex items-center gap-3">
          {typeof v === "string" && v && <img src={photoSrc(v)} alt="" className="h-16 w-16 rounded-lg object-cover" />}
          <input type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0], "image")} className="text-xs normal-case tracking-normal" />
        </span>
      )}
      {def.type === "pdf" && (
        <span className="grid gap-1 normal-case tracking-normal">
          <input type="file" accept="application/pdf" onChange={(e) => pick(e.target.files?.[0], "pdf")} className="text-xs" />
          <span className="text-xs text-g500">{v ? "A PDF is uploaded. Choose another file to replace it." : "No PDF yet."}</span>
        </span>
      )}
      {def.hint && <span className="text-[11px] font-normal normal-case tracking-normal text-g500">{def.hint}</span>}
      {busy && <span className="text-[11px] normal-case tracking-normal text-accent-d">{busy}</span>}
      {err && <span role="alert" className="text-[11px] normal-case tracking-normal text-g600">{err}</span>}
    </label>
  );
}
