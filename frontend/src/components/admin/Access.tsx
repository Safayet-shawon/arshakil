"use client";
import { useState } from "react";
import type { PrivateData, SiteContent } from "@/types";

const box = "rounded-xl border border-g300 bg-paper px-4 py-2.5 text-sm text-ink outline-none focus:border-accent";

/** Book access: requests from readers (grant a code), codes already given out, and a way to make one by hand. */
export default function Access({ content, data, setData }: { content: SiteContent; data: PrivateData; setData: (d: PrivateData) => void }) {
  const [book, setBook] = useState("*");
  const [label, setLabel] = useState("");
  const title = (slug: string) => (slug === "*" ? "All books" : content.books.find((b) => b.slug === slug)?.title ?? slug);

  const act = async (body: Record<string, unknown>) => {
    const res = await fetch("/api/admin/access", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) setData((await res.json()).access);
  };

  return (
    <div>
      <h2 className="font-display text-4xl text-ink">Book access</h2>
      <p className="mt-1 max-w-xl text-sm text-g600">Readers see the first 5% of a book free. When someone pays and sends a request, press Grant and send them the code. A code works for one book, or for all books.</p>

      <h3 className="label mt-8 text-accent-d">Requests ({data.requests.filter((r) => r.status === "new").length} new)</h3>
      <ul className="mt-2 grid gap-2">
        {data.requests.length === 0 && <li className="rounded-xl bg-paper p-5 text-sm text-g500">No requests yet.</li>}
        {data.requests.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-paper p-4 text-sm">
            <span className="min-w-[180px] flex-1">
              <b className="text-ink">{r.name}</b> · {r.contact}
              <span className="label block text-g500">{title(r.book)} · txn {r.txn || "—"} · {new Date(r.createdAt).toLocaleString()}</span>
            </span>
            {r.status === "granted"
              ? <span className="font-mono text-base font-bold tracking-widest text-ink">{r.code}</span>
              : <button onClick={() => act({ action: "grant", id: r.id })} className="rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-ink">Grant</button>}
            <button onClick={() => act({ action: "dismiss", id: r.id })} className="label text-g500 hover:text-ink">Remove</button>
          </li>
        ))}
      </ul>

      <h3 className="label mt-10 text-accent-d">Codes given out ({data.codes.length})</h3>
      <ul className="mt-2 grid gap-2">
        {data.codes.map((c) => (
          <li key={c.code} className="flex items-center gap-4 rounded-xl bg-paper p-4 text-sm">
            <span className="font-mono text-base font-bold tracking-widest text-ink">{c.code}</span>
            <span className="min-w-0 flex-1 truncate text-g600">{title(c.book)} · {c.label || "no label"}</span>
            <button onClick={() => { if (confirm(`Revoke ${c.code}?`)) act({ action: "revoke", code: c.code }); }} className="label text-g500 hover:text-ink">Revoke</button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2">
        <select value={book} onChange={(e) => setBook(e.target.value)} className={box} aria-label="Book">
          <option value="*">All books</option>
          {content.books.map((b) => <option key={b.slug} value={b.slug}>{b.title}</option>)}
        </select>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Who is it for? (optional)" className={`${box} min-w-[220px] flex-1`} />
        <button onClick={async () => { await act({ action: "create", book, label }); setLabel(""); }} className="rounded-full bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-paper hover:bg-g600">Create code</button>
      </div>
    </div>
  );
}
