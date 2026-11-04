"use client";
import { useState } from "react";

export interface Msg {
  id: string; kind: "hire" | "general"; name: string; email?: string; phone?: string; message: string;
  service?: string; createdAt: string; read?: boolean;
}

/** Messages from the website's contact form: hire requests (sent after picking "Hire me as ...") and general ones. */
export default function Messages({ list, setList }: { list: Msg[] | null; setList: (m: Msg[]) => void }) {
  const [view, setView] = useState<"hire" | "general">("hire");
  const count = (k: "hire" | "general") => list?.filter((m) => m.kind === k && !m.read).length ?? 0;
  const shown = list?.filter((m) => m.kind === view) ?? [];

  const call = async (url: string, init?: RequestInit) => {
    const res = await fetch(url, init);
    if (res.ok) setList((await res.json()).messages);
  };
  const read = (id?: string) => call("/api/admin/messages", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
  const del = (id: string) => confirm("Delete this message?") && call(`/api/admin/messages?id=${encodeURIComponent(id)}`, { method: "DELETE" });

  const pill = (k: "hire" | "general", label: string) => (
    <button onClick={() => setView(k)}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${view === k ? "bg-accent text-ink" : "bg-paper text-g600 hover:text-ink"}`}>
      {label}
      {count(k) > 0 && <b className="grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1.5 text-[11px] text-white">{count(k)}</b>}
    </button>
  );

  return (
    <div>
      <h2 className="font-display text-4xl text-ink">Messages</h2>
      <p className="mt-1 max-w-xl text-sm text-g600">Hire requests come from the "Hire me as ..." options. General messages come from the plain contact form. A red number means new, unread ones. Reply from your own email.</p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {pill("hire", "Hire requests")}
        {pill("general", "General")}
        {count(view) > 0 && <button onClick={() => read()} className="ml-auto text-xs font-bold uppercase tracking-[0.1em] text-accent-d">Mark all read</button>}
      </div>

      <ul className="mt-5 grid gap-3">
        {list === null && <li className="text-sm text-g500">Loading…</li>}
        {list && shown.length === 0 && <li className="rounded-xl bg-paper p-5 text-sm text-g500">{view === "hire" ? "No hire requests yet." : "No general messages yet."}</li>}
        {shown.map((m) => (
          <li key={m.id} className={`rounded-2xl bg-paper p-5 ${m.read ? "" : "border-l-4 border-red-600"}`}>
            {m.kind === "hire" && m.service && (
              <div className="mb-2 inline-block rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-ink">Wants to hire you as {m.service}</div>
            )}
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex flex-wrap items-baseline gap-x-3">
                {!m.read && <span className="rounded bg-red-600 px-1.5 text-[10px] font-bold uppercase text-white">New</span>}
                <b className="text-ink">{m.name}</b>
                {m.email && <a href={`mailto:${m.email}`} className="text-sm text-accent-d">{m.email}</a>}
                {m.phone && <a href={`tel:${m.phone.replace(/[^+\d]/g, "")}`} className="text-sm text-accent-d">{m.phone}</a>}
              </div>
              <time className="label text-g500">{new Date(m.createdAt).toLocaleString()}</time>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-g600">{m.message}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-[0.1em]">
              {m.email && <a href={`mailto:${m.email}?subject=${encodeURIComponent(m.kind === "hire" ? `Re: ${m.service ?? "your request"}` : "Re: your message")}`} onClick={() => !m.read && read(m.id)} className="text-accent-d">Reply ↗</a>}
              {!m.read && <button onClick={() => read(m.id)} className="text-g600 hover:text-ink">Mark read</button>}
              <button onClick={() => del(m.id)} className="text-g500 hover:text-ink">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
