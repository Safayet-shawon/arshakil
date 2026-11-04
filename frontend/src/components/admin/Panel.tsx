"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { listByName } from "@/lib/schema";
import type { ListName, PrivateData, SiteContent } from "@/types";
import Access from "./Access";
import Account from "./Account";
import WebsiteEditor from "./WebsiteEditor";
import ListEditor from "./ListEditor";

type Item = Record<string, unknown>;

/** Renaming a section or video group also renames it on the photos / videos that use it. */
const RENAMES: Partial<Record<ListName, { list: ListName; key: string }>> = {
  categories: { list: "gallery", key: "category" },
  videoGroups: { list: "videos", key: "group" },
};

/** The left menu: related lists live together in one section (e.g. Photography holds the photos and their sections). */
const GROUPS: { key: string; label: string; lists: ListName[] }[] = [
  { key: "projects", label: "Architecture", lists: ["projects"] },
  { key: "gallery", label: "Architectural Photography", lists: ["gallery", "categories"] },
  { key: "videos", label: "Content Creation", lists: ["videos", "videoGroups"] },
  { key: "places", label: "Travel", lists: ["places", "placePosts", "stories"] },
  { key: "books", label: "Author", lists: ["books"] },
  { key: "initiatives", label: "Social Work", lists: ["initiatives"] },
  { key: "services", label: "Services & Fees", lists: ["services"] },
];
const SUB: Partial<Record<ListName, string>> = {
  gallery: "Photos", categories: "Sections", videos: "Videos", videoGroups: "Video groups",
  places: "Cities & countries", placePosts: "Blog posts", stories: "History & heritage",
};
const groupOf = (tab: string) => GROUPS.find((g) => g.key === tab || g.lists.includes(tab as ListName));

/** Admin home: pick a section on the left, edit it on the right. Text on the pages is edited in place on the site itself. */
export default function Panel({ startTab, startNew }: { startTab?: string; startNew?: boolean }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [access, setAccess] = useState<PrivateData>({ codes: [], requests: [] });
  const [tab, setTab] = useState(startTab && (listByName(startTab) || startTab === "access" || startTab === "website" || startTab === "account") ? startTab : "projects");
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
  const group = groupOf(tab);
  const pending = access.requests.filter((r) => r.status === "new").length;

  const tabCls = (k: string) => `block w-full rounded-lg px-3 py-2 text-left text-[13px] font-bold transition-colors ${tab === k ? "bg-ink text-paper" : "text-g600 hover:bg-g200"}`;

  return (
    <section className="min-h-[100svh] bg-g200 px-5 pb-20 pt-[clamp(100px,14vh,140px)] md:px-[clamp(20px,3.4vw,48px)]">
      <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-[230px_1fr]">
        <aside className="md:sticky md:top-28 md:self-start">
          <div className="label text-accent-d">Admin</div>
          <h1 className="font-display mb-4 text-3xl text-ink">Edit the site</h1>
          <nav className="grid gap-1">
            <button onClick={() => setTab("website")} className={tabCls("website")}>Website</button>
            {GROUPS.map((g) => <button key={g.key} onClick={() => setTab(g.lists[0])} className={tabCls(group?.key === g.key ? tab : g.key)}>{g.label}</button>)}
            <button onClick={() => setTab("access")} className={tabCls("access")}>Book access{pending ? ` (${pending})` : ""}</button>
            <button onClick={() => setTab("account")} className={tabCls("account")}>Login details</button>
          </nav>
          <div className="mt-6 grid gap-2 border-t border-g300 pt-4 text-xs text-g600">
            <p>To change any text on the pages, open the Website section.</p>
            <Link href="/" className="font-bold uppercase tracking-[0.1em] text-accent-d">View the site ↗</Link>
            <button onClick={out} className="text-left font-bold uppercase tracking-[0.1em] hover:text-ink">Sign out</button>
          </div>
        </aside>

        <div>
          {note && <p role="status" className="label mb-4 rounded-lg bg-accent/20 px-4 py-2 text-ink">{note}</p>}
          {group && group.lists.length > 1 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {group.lists.map((n) => (
                <button key={n} onClick={() => setTab(n)}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${tab === n ? "bg-accent text-ink" : "bg-paper text-g600 hover:text-ink"}`}>{SUB[n]}</button>
              ))}
            </div>
          )}
          {tab === "website" ? <WebsiteEditor />
            : tab === "account" ? <Account />
            : !content ? <p className="text-sm text-g600">Loading…</p>
            : tab === "access" ? <Access content={content} data={access} setData={setAccess} />
              : def && <ListEditor key={def.name} def={def} content={content} save={(items) => save(def.name, items)} startNew={startNew && tab === def.name} />}
        </div>
      </div>
    </section>
  );
}
