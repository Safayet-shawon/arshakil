"use client";
import { useEffect, useState } from "react";

interface Msg { id: string; name: string; email: string; message: string; service?: string; createdAt: string }

/** Messages sent through the contact form on the site. */
export default function Messages({ onCount }: { onCount?: (n: number) => void }) {
  const [list, setList] = useState<Msg[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/messages", { cache: "no-store" }).then((r) => r.json()).then((d) => { setList(d.messages); onCount?.(d.messages.length); });
  }, [onCount]);

  const del = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const res = await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) { const d = await res.json(); setList(d.messages); onCount?.(d.messages.length); }
  };

  return (
    <div>
      <h2 className="font-display text-4xl text-ink">Messages</h2>
      <p className="mt-1 max-w-xl text-sm text-g600">Everything sent through the contact form on the website, newest first. Reply from your own email.</p>
      <ul className="mt-6 grid gap-3">
        {list === null && <li className="text-sm text-g500">Loading…</li>}
        {list?.length === 0 && <li className="rounded-xl bg-paper p-5 text-sm text-g500">No messages yet.</li>}
        {list?.map((m) => (
          <li key={m.id} className="rounded-2xl bg-paper p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div><b className="text-ink">{m.name}</b> <a href={`mailto:${m.email}`} className="text-sm text-accent-d">{m.email}</a></div>
              <time className="label text-g500">{new Date(m.createdAt).toLocaleString()}</time>
            </div>
            {m.service && <div className="label mt-1 text-accent-d">{m.service}</div>}
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-g600">{m.message}</p>
            <div className="mt-3 flex gap-4 text-xs font-bold uppercase tracking-[0.1em]">
              <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`} className="text-accent-d">Reply ↗</a>
              <button onClick={() => del(m.id)} className="text-g500 hover:text-ink">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
