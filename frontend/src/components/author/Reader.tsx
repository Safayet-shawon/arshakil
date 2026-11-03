"use client";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { site } from "@/data/site";

interface Meta { title: string; priceBdt: number; pages: number; free: number; unlocked: boolean }

let pdfjs: Promise<typeof import("pdfjs-dist")> | undefined;
const loadPdfjs = () => (pdfjs ??= import("pdfjs-dist").then((m) => {
  m.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  return m;
}));

const input = "w-full rounded-xl border border-g300 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-accent";

/** One page, drawn onto a canvas only once it is near the screen. The browser never gets the whole file or a download link. */
function PageView({ slug, n, code, mark }: { slug: string; n: number; code: string; mark: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      try {
        const res = await fetch(`/api/books/${slug}/page/${n}`, { headers: code ? { "x-access-code": code } : {}, cache: "no-store" });
        if (!res.ok) throw new Error();
        const lib = await loadPdfjs();
        const doc = await lib.getDocument({ data: new Uint8Array(await res.arrayBuffer()) }).promise;
        const page = await doc.getPage(1);
        if (cancelled || !canvas.current) return;
        const base = page.getViewport({ scale: 1 });
        const scale = (el.clientWidth / base.width) * Math.min(window.devicePixelRatio || 1, 2);
        const vp = page.getViewport({ scale });
        const c = canvas.current;
        c.width = vp.width; c.height = vp.height;
        await page.render({ canvas: c, canvasContext: c.getContext("2d")!, viewport: vp }).promise;
        el.style.aspectRatio = `${base.width} / ${base.height}`;
      } catch { if (!cancelled) setFailed(true); }
    }, { rootMargin: "700px" });
    io.observe(el);
    return () => { cancelled = true; io.disconnect(); };
  }, [slug, n, code]);

  return (
    <div ref={box} className="relative mx-auto aspect-[3/4] w-full max-w-[760px] overflow-hidden bg-paper shadow-[0_10px_40px_rgba(77,79,83,0.15)]">
      <canvas ref={canvas} className="block h-full w-full" />
      {failed && <div className="absolute inset-0 grid place-items-center text-sm text-g500">This page could not be loaded.</div>}
      {/* faint repeating watermark, so a photo of the screen can be traced back */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid grid-cols-2 content-around gap-y-16 overflow-hidden opacity-[0.07]">
        {Array.from({ length: 12 }, (_, i) => <span key={i} className="-rotate-[28deg] whitespace-nowrap text-center font-bold uppercase tracking-widest text-ink">{mark}</span>)}
      </div>
    </div>
  );
}

export default function Reader({ slug }: { slug: string }) {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [code, setCode] = useState("");
  const [draft, setDraft] = useState("");
  const [msg, setMsg] = useState("");
  const [hidden, setHidden] = useState(false);
  const [sent, setSent] = useState(false);
  const KEY = `book-code-${slug}`;

  const load = useCallback(async (c: string) => {
    const res = await fetch(`/api/books/${slug}/meta?code=${encodeURIComponent(c)}`, { cache: "no-store" });
    if (res.ok) setMeta(await res.json());
    else setMsg("This book is not available.");
  }, [slug]);

  useEffect(() => {
    const saved = (() => { try { return localStorage.getItem(KEY) ?? ""; } catch { return ""; } })();
    setCode(saved);
    load(saved);
  }, [KEY, load]);

  // Best-effort protection: no right-click, drag, copy or print; the page blurs when the window loses focus.
  useEffect(() => {
    const block = (e: Event) => e.preventDefault();
    const key = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") navigator.clipboard?.writeText("").catch(() => {});
      if ((e.ctrlKey || e.metaKey) && ["s", "p", "c", "u"].includes(e.key.toLowerCase())) e.preventDefault();
    };
    const off = () => setHidden(true), on = () => setHidden(document.hidden);
    document.addEventListener("contextmenu", block);
    document.addEventListener("copy", block);
    document.addEventListener("dragstart", block);
    window.addEventListener("keydown", key);
    window.addEventListener("blur", off);
    window.addEventListener("focus", on);
    document.addEventListener("visibilitychange", on);
    return () => {
      document.removeEventListener("contextmenu", block); document.removeEventListener("copy", block); document.removeEventListener("dragstart", block);
      window.removeEventListener("keydown", key); window.removeEventListener("blur", off); window.removeEventListener("focus", on);
      document.removeEventListener("visibilitychange", on);
    };
  }, []);

  async function unlock(e: FormEvent) {
    e.preventDefault();
    const c = draft.trim().toUpperCase();
    const res = await fetch(`/api/books/${slug}/meta?code=${encodeURIComponent(c)}`, { cache: "no-store" });
    const m: Meta | null = res.ok ? await res.json() : null;
    if (m?.unlocked) {
      try { localStorage.setItem(KEY, c); } catch { /* private mode: works for this visit only */ }
      setCode(c); setMeta(m); setMsg("");
    } else setMsg("That code is not valid for this book.");
  }

  async function request(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const res = await fetch(`/api/books/${slug}/request`, { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: d.get("name"), contact: d.get("contact"), txn: d.get("txn") }) });
    if (res.ok) setSent(true); else setMsg((await res.json()).error ?? "Could not send the request.");
  }

  if (!meta) return <p className="text-center text-sm text-g600">{msg || "Loading…"}</p>;
  const shown = meta.unlocked ? meta.pages : meta.free;
  const mark = meta.unlocked ? `Read by ${code}` : `Free preview · ${site.name}`;

  return (
    <div className="reader select-none" onContextMenu={(e) => e.preventDefault()}>
      <style>{"@media print { .reader { display: none !important } }"}</style>
      <p className="label mb-6 text-center text-g600">
        {meta.unlocked ? `Full access · ${meta.pages} pages` : `Free preview · pages 1–${meta.free} of ${meta.pages}`}
      </p>

      <div className={hidden ? "pointer-events-none blur-2xl transition-[filter] duration-200" : "transition-[filter] duration-200"}>
        <div className="grid gap-6">
          {Array.from({ length: shown }, (_, i) => <PageView key={i} slug={slug} n={i + 1} code={code} mark={mark} />)}
        </div>
      </div>
      {hidden && <p className="label mt-4 text-center text-g600">Click back into the window to keep reading.</p>}

      {!meta.unlocked && (
        <div className="mx-auto mt-10 max-w-[560px] rounded-2xl border-2 border-accent/60 bg-paper p-6 text-center">
          <h2 className="font-display text-3xl text-ink">Keep reading</h2>
          <p className="mt-2 text-sm leading-relaxed text-g600">
            The rest of the book ({meta.pages - meta.free} more pages) needs an access code. Price: <b className="text-ink">৳ {meta.priceBdt}</b>.
            Pay by bKash or Nagad to <b className="text-ink">{site.phone}</b>, then send your details below. You will get a code after the payment is checked.
          </p>

          {sent ? (
            <p className="mt-5 rounded-xl bg-accent/15 p-4 text-sm text-ink">Request sent. Your access code will be sent to you after the payment is checked.</p>
          ) : (
            <form onSubmit={request} className="mt-5 grid gap-3 text-left">
              <input name="name" required minLength={2} placeholder="Your name" aria-label="Your name" className={input} />
              <input name="contact" required minLength={5} placeholder="Phone or email (to send the code)" aria-label="Phone or email" className={input} />
              <input name="txn" placeholder="bKash / Nagad transaction id" aria-label="Transaction id" className={input} />
              <button data-link className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-paper hover:bg-g600">Request access</button>
            </form>
          )}

          <form onSubmit={unlock} className="mt-6 flex gap-2 border-t border-g200 pt-5">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Already have a code?" aria-label="Access code" className={input} />
            <button data-link className="rounded-full border border-g300 px-5 text-xs font-bold uppercase tracking-[0.1em] text-g600 hover:border-accent hover:text-accent-d">Unlock</button>
          </form>
          {msg && <p role="status" className="mt-3 text-xs text-g600">{msg}</p>}
        </div>
      )}
    </div>
  );
}
