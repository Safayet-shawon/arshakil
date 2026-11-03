"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { listByName, lists } from "@/lib/schema";
import type { ListName, PrivateData, SiteContent } from "@/types";
import Access from "./Access";
import ListEditor from "./ListEditor";

type Item = Record<string, unknown>;

/** Renaming a section or video group also renames it on the photos / videos that use it. */
const RENAMES: Partial<Record<ListName, { list: ListName; key: string }>> = {
  categories: { list: "gallery", key: "category" },
  videoGroups: { list: "videos", key: "group" },
};

/** Admin home: pick a section on the left, edit it on the right. Text on the pages is edited in place on the site itself. */
export default function Panel({ startTab, startNew }: { startTab?: string; startNew?: boolean }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [access, setAccess] = useState<PrivateData>({ codes: [], requests: [] });
  const [tab, setTab] = useState(startTab && (listByName(startTab) || startTab === "access") ? startTab : "projects");
  const [note, setNote] = useState("");

  useEffect(() => {
    fetch("/api/admin/data", { cache: "no-store" }).then((r) => r.json()).then((d) => { setContent(d.content); setAccess(d.access); });
  }, []);

  const put = async (name: ListName, items: Item[]) => {
    const res = await fetch(`/api/admin/list/${name}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(items) });
    if (!res.ok) { setNote("Could not save. Try again."); return null; }
    return (await res.json()).items as Item[];
  };

  const save = useCallback(async (name: ListName, items: Item[]) => {
    if (!content) return;
    const next: SiteContent = { ...content };
    const rename = RENAMES[name];
    if (rename) {
      const old = content[name] as unknown as { name: string }[];
      const map = new Map<string, string>();
      (items as unknown as { name: string }[]).forEach((n, i) => { if (old[i] && old[i].name !== n.name) map.set(old[i].name, n.name); });
      if (map.size) {
        const moved = (content[rename.list] as unknown as Item[]).map((x) => (map.has(String(x[rename.key])) ? { ...x, [rename.key]: map.get(String(x[rename.key])) } : x));
        const done = await put(rename.list, moved);
        if (done) (next as unknown as Record<string, unknown>)[rename.list] = done;
      }
    }
    const saved = await put(name, items);
    if (!saved) return;
    (next as unknown as Record<string, unknown>)[name] = saved;
    setContent(next);
    setNote("Saved. The site is updated.");
    setTimeout(() => setNote(""), 2500);
  }, [content]);

  const out = async () => { await fetch("/api/admin/logout", { method: "POST" }); location.reload(); };
  const def = listByName(tab);
  const pending = access.requests.filter((r) => r.status === "new").length;

  const tabCls = (k: string) => `block w-full rounded-lg px-3 py-2 text-left text-[13px] font-bold transition-colors ${tab === k ? "bg-ink text-paper" : "text-g600 hover:bg-g200"}`;

  return (
    <section className="min-h-[100svh] bg-g200 px-5 pb-20 pt-[clamp(100px,14vh,140px)] md:px-[clamp(20px,3.4vw,48px)]">
      <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-[230px_1fr]">
        <aside className="md:sticky md:top-28 md:self-start">
          <div className="label text-accent-d">Admin</div>
          <h1 className="font-display mb-4 text-3xl text-ink">Edit the site</h1>
          <nav className="grid gap-1">
            {lists.map((l) => <button key={l.name} onClick={() => setTab(l.name)} className={tabCls(l.name)}>{l.label}</button>)}
            <button onClick={() => setTab("access")} className={tabCls("access")}>Book access{pending ? ` (${pending})` : ""}</button>
          </nav>
          <div className="mt-6 grid gap-2 border-t border-g300 pt-4 text-xs text-g600">
            <p>To change any text, open the site while signed in and click the dashed text.</p>
            <Link href="/" className="font-bold uppercase tracking-[0.1em] text-accent-d">View the site ↗</Link>
            <button onClick={out} className="text-left font-bold uppercase tracking-[0.1em] hover:text-ink">Sign out</button>
          </div>
        </aside>

        <div>
          {note && <p role="status" className="label mb-4 rounded-lg bg-accent/20 px-4 py-2 text-ink">{note}</p>}
          {!content ? <p className="text-sm text-g600">Loading…</p>
            : tab === "access" ? <Access content={content} data={access} setData={setAccess} />
              : def && <ListEditor key={def.name} def={def} content={content} save={(items) => save(def.name, items)} startNew={startNew && tab === def.name} />}
        </div>
      </div>
    </section>
  );
}
