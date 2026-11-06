"use client";
import { useEffect, useRef, useState } from "react";
import { photoSrc } from "@/lib/media";
import { site } from "@/data/site";
import HeroPreview from "./HeroPreview";
import { uploadImage } from "./upload";

const PAGES: [string, string][] = [
  ["Home", "/"], ["About", "/about"], ["Architecture", "/architecture"], ["Photography", "/photography"],
  ["Content Creation", "/content-creation"], ["Travel", "/travel"], ["Author", "/author"], ["Social Work", "/social-work"],
];

/** The home page's main picture is kept as a saved "text" under this key (see components/home/Hero.tsx). */
export const HERO_KEY = "@hero";

const saveKey = (key: string, value: string) =>
  fetch("/api/admin/text", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ key, value }) });
const saveHero = (value: string) => saveKey(HERO_KEY, value);

/** How the hero picture sits: where it is cut (x, y in %) and how close it is (zoom in %). */
type Frame = { mode: "portrait" | "full"; x: number; y: number; zoom: number };
const DEFAULT: Record<Frame["mode"], Omit<Frame, "mode">> = { portrait: { x: 50, y: 0, zoom: 100 }, full: { x: 50, y: 30, zoom: 100 } };
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

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
  const num = (k: string, d: number) => { const n = Number(texts[k]); return texts[k] !== undefined && texts[k] !== "" && Number.isFinite(n) ? n : d; };
  const startMode: Frame["mode"] = texts["@hero.mode"] === "full" ? "full" : "portrait";
  const [frame, setFrame] = useState<Frame>({ mode: startMode, x: num("@hero.x", DEFAULT[startMode].x), y: num("@hero.y", DEFAULT[startMode].y), zoom: num("@hero.zoom", 100) });
  const [loadingPreview, setLoadingPreview] = useState(false);
  const drag = useRef<{ x: number; y: number; fx: number; fy: number } | null>(null);

  const [dirty, setDirty] = useState(false);
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");

  /** Moving the picture only changes the small preview. Nothing is saved until "Save position". */
  const setLook = (patch: Partial<Frame>) => { setFrame((f) => ({ ...f, ...patch })); setDirty(true); };
  const saveLook = async () => {
    setBusy("Saving…");
    await Promise.all([saveKey("@hero.mode", frame.mode), saveKey("@hero.x", String(Math.round(frame.x))), saveKey("@hero.y", String(Math.round(frame.y))), saveKey("@hero.zoom", String(Math.round(frame.zoom)))]);
    setDirty(false); setLoadingPreview(true); setReload((n) => n + 1); setBusy("Saved ✓");
    setTimeout(() => setBusy(""), 2000);
  };
  const pickMode = (mode: Frame["mode"]) => setLook({ mode, ...DEFAULT[mode] });

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
      await saveHero(url); setHero(url); setLoadingPreview(true); setReload((n) => n + 1);
    } catch (e) { setBusy((e as Error).message); return; }
    setBusy("");
  };
  const reset = async () => { setBusy("Saving…"); await saveHero(""); setHero(""); setLoadingPreview(true); setReload((n) => n + 1); setBusy(""); };

  return (
    <div>
      <h2 className="font-display text-4xl text-ink">Website</h2>

      <div className="mt-5 rounded-2xl bg-paper p-4 shadow-[0_4px_16px_rgba(77,79,83,0.06)]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-[200px] flex-1">
            <div className="text-sm font-bold text-ink">Hero picture</div>
            <div className="text-xs text-g600">The picture at the top of the home page. Upload one, then place it exactly where you like.</div>
          </div>
          <label className="cursor-pointer rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-ink hover:bg-accent-soft">
            {hero ? "Change picture" : "Upload picture"}
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; change(f); }} />
          </label>
          {hero && <button onClick={reset} className="label text-g500 hover:text-ink">Use the original</button>}
          {busy && busy !== "Saved ✓" && busy !== "Saving…" && <span className="text-xs text-accent-d">{busy}</span>}
        </div>

        {hero && (
          <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,540px)_1fr]">
            {/* the home page top at true size, on a computer or on a phone: drag the picture to move it */}
            <div className={device === "phone" ? "mx-auto w-full max-w-[230px]" : "w-full"}>
              <HeroPreview src={hero} frame={frame} device={device}
                onMove={(dx, dy) => { setDirty(true); setFrame((f) => ({ ...f, x: clamp(f.x + dx, 0, 100), y: clamp(f.y + dy, 0, 100) })); }} />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1.5">
                  {([["desktop", "Computer"], ["phone", "Phone"]] as const).map(([d, label]) => (
                    <button key={d} onClick={() => setDevice(d)} className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${device === d ? "bg-ink text-paper" : "bg-g100 text-g600 hover:text-ink"}`}>{label}</button>
                  ))}
                </div>
                <p className="text-[11px] text-g500">This is exactly how visitors will see it. Drag the picture, then Save.</p>
              </div>
            </div>

            <div className="grid content-start gap-4">
              <div>
                <div className="label mb-2 text-g500">How it sits</div>
                <div className="flex flex-wrap gap-2">
                  {([["portrait", "Portrait (as before)"], ["full", "Full background"]] as const).map(([m, label]) => (
                    <button key={m} onClick={() => pickMode(m)}
                      className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${frame.mode === m ? "bg-ink text-paper" : "bg-g100 text-g600 hover:text-ink"}`}>{label}</button>
                  ))}
                </div>
              </div>
              {([["x", "Left ↔ right", 0, 100], ["y", "Up ↕ down", 0, 100], ["zoom", "Zoom", 100, 250]] as const).map(([k, label, min, max]) => (
                <label key={k} className="grid gap-1 text-xs text-g600">
                  <span className="flex justify-between"><b className="text-ink">{label}</b><span>{Math.round(frame[k])}{k === "zoom" ? "%" : ""}</span></span>
                  <input type="range" min={min} max={max} value={frame[k]} onChange={(e) => setLook({ [k]: Number(e.target.value) })} className="w-full accent-[#f7b500]" />
                </label>
              ))}
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={saveLook} disabled={!dirty || busy === "Saving…"}
                  className="rounded-full bg-ink px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-paper hover:bg-g600 disabled:opacity-40">{busy === "Saving…" ? "Saving…" : "Save position"}</button>
                <button onClick={() => setLook({ ...DEFAULT[frame.mode] })} className="label text-g500 hover:text-ink">Reset position</button>
                {dirty && <span className="text-xs text-accent-d">Not saved yet</span>}
                {busy === "Saved ✓" && <span className="text-xs font-bold text-accent-d">Saved ✓</span>}
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 max-w-xl text-sm text-g600">Choose a page. Click any dashed text, change it and click away: it saves and shows on the live site straight away.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {PAGES.map(([name, path]) => (
          <button key={path} onClick={() => setPage(path)}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${page === path ? "bg-accent text-ink" : "bg-paper text-g600 hover:text-ink"}`}>{name}</button>
        ))}
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-g300 bg-paper">
        <div className="relative">
          {loadingPreview && <div className="absolute inset-0 z-10 grid place-items-center bg-paper/80 text-xs font-bold uppercase tracking-[0.12em] text-g600">Updating preview…</div>}
          {ready && <iframe key={page + reload} src={page} title="Website" onLoad={() => setLoadingPreview(false)} className="h-[74svh] w-full" />}
        </div>
      </div>
    </div>
  );
}
