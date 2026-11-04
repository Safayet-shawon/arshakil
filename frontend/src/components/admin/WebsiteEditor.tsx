"use client";
import { useEffect, useState } from "react";
import { photoSrc } from "@/lib/media";
import { site } from "@/data/site";
import { uploadImage } from "./upload";

const PAGES: [string, string][] = [
  ["Home", "/"], ["About", "/about"], ["Architecture", "/architecture"], ["Photography", "/photography"],
  ["Content Creation", "/content-creation"], ["Travel", "/travel"], ["Author", "/author"], ["Social Work", "/social-work"],
];

/** The home page's main picture is kept as a saved "text" under this key (see components/home/Hero.tsx). */
export const HERO_KEY = "@hero";

const saveHero = (value: string) =>
  fetch("/api/admin/text", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ key: HERO_KEY, value }) });

/**
 * The site's pages inside the panel. Text turns editable (dashed) only in here: the switch is a cookie that is on
 * while this section is open and only takes effect inside a frame, so the public site never shows edit marks.
 */
export default function WebsiteEditor({ texts }: { texts: Record<string, string> }) {
  const [page, setPage] = useState("/");
  const [ready, setReady] = useState(false);
  const [hero, setHero] = useState(texts[HERO_KEY] ?? "");
  const [busy, setBusy] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    document.cookie = "ar_edit=1; path=/";
    setReady(true);
    return () => { document.cookie = "ar_edit=; path=/; max-age=0"; };
  }, []);

  const change = async (file: File | undefined) => {
    if (!file) return;
    setBusy("Uploading…");
    try {
      const { url } = await uploadImage(file);
      await saveHero(url); setHero(url); setReload((n) => n + 1);
    } catch (e) { setBusy((e as Error).message); return; }
    setBusy("");
  };
  const reset = async () => { setBusy("Saving…"); await saveHero(""); setHero(""); setReload((n) => n + 1); setBusy(""); };

  return (
    <div>
      <h2 className="font-display text-4xl text-ink">Website</h2>

      <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl bg-paper p-4 shadow-[0_4px_16px_rgba(77,79,83,0.06)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero ? photoSrc(hero) : site.heroImage} alt="" className="h-20 w-16 rounded-lg bg-g200 object-cover object-top" />
        <div className="min-w-[200px] flex-1">
          <div className="text-sm font-bold text-ink">Hero picture</div>
          <div className="text-xs text-g600">The picture of you at the top of the home page.</div>
        </div>
        <label className="cursor-pointer rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-ink hover:bg-accent-soft">
          Change hero picture
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; change(f); }} />
        </label>
        {hero && <button onClick={reset} className="label text-g500 hover:text-ink">Use the original</button>}
        {busy && <span className="text-xs text-accent-d">{busy}</span>}
      </div>

      <p className="mt-6 max-w-xl text-sm text-g600">Choose a page. Click any dashed text, change it and click away: it saves and shows on the live site straight away.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {PAGES.map(([name, path]) => (
          <button key={path} onClick={() => setPage(path)}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${page === path ? "bg-accent text-ink" : "bg-paper text-g600 hover:text-ink"}`}>{name}</button>
        ))}
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-g300 bg-paper">
        {ready && <iframe key={page + reload} src={page} title="Website" className="h-[74svh] w-full" />}
      </div>
    </div>
  );
}
