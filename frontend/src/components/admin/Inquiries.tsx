"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FIELD_LABEL, STATUSES, STATUS_LABEL, WORK_FIELDS,
  type Inquiry, type InquiryFilters, type InquiryPage, type InquiryStatus, type InquirySummary, type WorkField,
} from "@/lib/inquiry";

const input = "rounded-lg border border-g300 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent";

const when = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
const month = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "long", year: "numeric" });
function ago(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return d <= 0 ? "today" : d === 1 ? "yesterday" : d < 30 ? `${d} days ago` : d < 365 ? `${Math.floor(d / 30)} mo ago` : `${Math.floor(d / 365)} y ago`;
}

/**
 * The owner's inbox / history: every hire request and message from the website in one feed, newest first,
 * each tagged with its work field. Filter by field, type, status, text or date. Replies happen in the owner's own
 * mailbox; this is the record: who asked, when, for what, and the owner's own notes on it.
 */
export default function Inquiries({ onUnread }: { onUnread: (n: number) => void }) {
  const [summary, setSummary] = useState<InquirySummary | null>(null);
  const [filters, setFilters] = useState<InquiryFilters>({});
  const [text, setText] = useState("");
  const [items, setItems] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const seq = useRef(0);

  const refreshSummary = useCallback(async () => {
    const r = await fetch("/api/admin/messages/summary", { cache: "no-store" }).catch(() => null);
    if (!r?.ok) return;
    const s = (await r.json()) as InquirySummary;
    setSummary(s); onUnread(s.unread);
  }, [onUnread]);

  const load = useCallback(async (f: InquiryFilters, p: number) => {
    const mine = ++seq.current;
    setLoading(true); setError("");
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...f, page: p })) if (v !== undefined && v !== "") qs.set(k, String(v));
    const r = await fetch(`/api/admin/messages?${qs}`, { cache: "no-store" }).catch(() => null);
    if (mine !== seq.current) return; // a newer request replaced this one
    setLoading(false);
    if (!r?.ok) { setError((await r?.json().catch(() => null))?.error ?? "Could not load the inquiries."); return; }
    const d = (await r.json()) as InquiryPage;
    setItems((cur) => (p === 1 ? d.items : [...cur, ...d.items]));
    setTotal(d.total); setPage(p);
  }, []);

  useEffect(() => { void refreshSummary(); }, [refreshSummary]);
  useEffect(() => { void load(filters, 1); }, [filters, load]);
  // search box: wait for a pause in typing
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => (f.q === (text.trim() || undefined) ? f : { ...f, q: text.trim() || undefined })), 300);
    return () => clearTimeout(t);
  }, [text]);

  const set = (patch: InquiryFilters) => setFilters((f) => ({ ...f, ...patch }));
  const reloadAll = async () => { await Promise.all([load(filters, 1), refreshSummary()]); };
  const filtered = !!(filters.kind || filters.status || filters.q || filters.from || filters.to);

  async function patch(id: string, body: { status?: InquiryStatus; notes?: string }) {
    const r = await fetch("/api/admin/messages", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, ...body }) });
    if (!r.ok) { setError((await r.json().catch(() => null))?.error ?? "Could not save."); return; }
    const { item } = (await r.json()) as { item: Inquiry };
    setItems((cur) => cur.map((i) => (i.id === id ? item : i)));
    void refreshSummary();
  }

  async function remove(i: Inquiry) {
    if (!confirm(`Delete this inquiry from ${i.name}? It is your history; this cannot be undone. (Archive it instead to keep it out of the way.)`)) return;
    const r = await fetch(`/api/admin/messages?id=${encodeURIComponent(i.id)}`, { method: "DELETE" });
    if (!r.ok) { setError("Could not delete."); return; }
    setItems((cur) => cur.filter((x) => x.id !== i.id)); setTotal((t) => t - 1);
    void refreshSummary();
  }

  async function markAllRead() {
    setBusy("read");
    await fetch("/api/admin/messages", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "markAllRead", field: filters.field, kind: filters.kind }) });
    setBusy(""); await reloadAll();
  }

  async function importOld() {
    setBusy("import");
    const r = await fetch("/api/admin/messages/import", { method: "POST" });
    setBusy("");
    if (!r.ok) { setError((await r.json().catch(() => null))?.error ?? "Import failed."); return; }
    await reloadAll();
  }

  const chip = (value: WorkField | undefined, label: string, c?: { total: number; unread: number }) => {
    const on = filters.field === value;
    return (
      <button key={label} onClick={() => set({ field: value })} aria-pressed={on}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${on ? "bg-accent text-ink" : "bg-paper text-g600 hover:text-ink"}`}>
        {label}<span className="font-normal opacity-60">{c?.total ?? 0}</span>
        {!!c?.unread && <b className="grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1.5 text-[11px] text-white">{c.unread}</b>}
      </button>
    );
  };

  const unreadHere = filters.field ? summary?.byField[filters.field].unread : summary?.unread;
  let lastMonth = "";

  return (
    <div>
      <h2 className="font-display text-4xl text-ink">Inquiries</h2>
      <p className="mt-1 max-w-2xl text-sm text-g600">
        Every hire request and message from the website, tagged by work field, newest first. A copy also goes to your email: reply from there.
        This list is your history, so use the status and notes to remember what happened with each one.
      </p>

      {!!summary?.legacyPending && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-paper p-4 text-sm text-g600">
          <span><b className="text-ink">{summary.legacyPending}</b> older message{summary.legacyPending === 1 ? " is" : "s are"} still in the previous store.</span>
          <button onClick={importOld} disabled={busy === "import"} className="rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-paper disabled:opacity-60">
            {busy === "import" ? "Importing…" : "Import them"}
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Work field">
        {chip(undefined, "All fields", summary ? { total: summary.total, unread: summary.unread } : undefined)}
        {WORK_FIELDS.map((f) => chip(f, FIELD_LABEL[f], summary?.byField[f]))}
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-g500">Type
          <select value={filters.kind ?? ""} onChange={(e) => set({ kind: (e.target.value || undefined) as InquiryFilters["kind"] })} className={input}>
            <option value="">Hire requests + messages</option><option value="hire">Hire requests</option><option value="general">General messages</option>
          </select>
        </label>
        <label className="grid gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-g500">Status
          <select value={filters.status ?? ""} onChange={(e) => set({ status: (e.target.value || undefined) as InquiryStatus | undefined })} className={input}>
            <option value="">Any status</option>{STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-g500">From
          <input type="date" value={filters.from ?? ""} max={filters.to} onChange={(e) => set({ from: e.target.value || undefined })} className={input} />
        </label>
        <label className="grid gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-g500">To
          <input type="date" value={filters.to ?? ""} min={filters.from} onChange={(e) => set({ to: e.target.value || undefined })} className={input} />
        </label>
        <label className="grid min-w-[200px] flex-1 gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-g500">Search
          <input type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder="Name, email, phone, message or note" className={`${input} w-full`} />
        </label>
        {(filtered || filters.field) && (
          <button onClick={() => { setText(""); setFilters({}); }} className="pb-2 text-xs font-bold uppercase tracking-[0.1em] text-g600 hover:text-ink">Clear filters</button>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-g500">
        <span>{loading && items.length === 0 ? "Loading…" : `${total} inquir${total === 1 ? "y" : "ies"}${filters.field ? ` in ${FIELD_LABEL[filters.field]}` : ""}`}</span>
        {!!unreadHere && (
          <button onClick={markAllRead} disabled={busy === "read"} className="font-bold uppercase tracking-[0.1em] text-accent-d disabled:opacity-60">
            Mark {unreadHere} new as read
          </button>
        )}
      </div>

      {error && <p role="alert" className="mt-3 rounded-lg bg-paper p-3 text-sm text-red-700">{error}</p>}

      <ul className="mt-3 grid gap-3">
        {!loading && !error && items.length === 0 && (
          <li className="rounded-xl bg-paper p-5 text-sm text-g500">{filtered || filters.field ? "Nothing matches these filters." : "No inquiries yet. They appear here as soon as someone writes through the website."}</li>
        )}
        {items.map((i) => {
          const m = month(i.createdAt);
          const heading = m !== lastMonth ? m : "";
          lastMonth = m;
          return (
            <li key={i.id} className="list-none">
              {heading && <h3 className="label mb-2 mt-4 text-g500">{heading}</h3>}
              <Card i={i} onStatus={(status) => patch(i.id, { status })} onNotes={(notes) => patch(i.id, { notes })} onDelete={() => remove(i)} />
            </li>
          );
        })}
      </ul>

      {items.length < total && (
        <div className="mt-5 text-center">
          <button onClick={() => load(filters, page + 1)} disabled={loading} className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-paper disabled:opacity-60">
            {loading ? "Loading…" : `Show more (${total - items.length} left)`}
          </button>
        </div>
      )}
    </div>
  );
}

function Card({ i, onStatus, onNotes, onDelete }: { i: Inquiry; onStatus: (s: InquiryStatus) => void; onNotes: (n: string) => void; onDelete: () => void }) {
  const [note, setNote] = useState(i.notes ?? "");
  const [open, setOpen] = useState(!!i.notes);
  useEffect(() => { setNote(i.notes ?? ""); }, [i.notes]);
  const fresh = i.status === "new";
  const subject = i.kind === "hire" ? `Re: ${i.service ?? "your request"}` : "Re: your message";

  return (
    <article className={`rounded-2xl bg-paper p-5 ${fresh ? "border-l-4 border-red-600" : ""} ${i.status === "archived" ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-g300 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-g600">{FIELD_LABEL[i.field]}</span>
        {i.kind === "hire" && i.service && <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-ink">Wants to hire you as {i.service.replace(/^(an?|the)\s+/i, "")}</span>}
        {i.kind === "general" && <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-g500">General message</span>}
        {fresh && <span className="rounded bg-red-600 px-1.5 text-[10px] font-bold uppercase text-white">New</span>}
        <time dateTime={i.createdAt} className="label ml-auto text-g500" title={when(i.createdAt)}>{when(i.createdAt)} · {ago(i.createdAt)}</time>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <b className="text-lg text-ink">{i.name}</b>
        {i.email && <a href={`mailto:${i.email}`} className="text-sm text-accent-d">{i.email}</a>}
        {i.phone && <a href={`tel:${i.phone.replace(/[^+\d]/g, "")}`} className="text-sm text-accent-d">{i.phone}</a>}
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-g600">{i.message}</p>

      {i.emailStatus === "failed" && (
        <p className="mt-3 rounded-lg bg-g100 px-3 py-2 text-xs text-g600">The email copy to your inbox did not go out. This message is safely saved here, so reply to the sender directly.</p>
      )}

      {open && (
        <label className="mt-4 grid gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-g500">Your private note
          <textarea value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => note !== (i.notes ?? "") && onNotes(note)} rows={3} maxLength={4000}
            placeholder="e.g. Called on Monday, quoted $1,200, waiting for their reply" className={`${input} text-sm font-normal normal-case tracking-normal`} />
        </label>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-[0.1em]">
        <label className="flex items-center gap-2 text-g500">Status
          <select value={i.status} onChange={(e) => onStatus(e.target.value as InquiryStatus)} className={`${input} py-1 text-xs normal-case tracking-normal`}>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </label>
        {i.email && <a href={`mailto:${i.email}?subject=${encodeURIComponent(subject)}`} onClick={() => fresh && onStatus("read")} className="text-accent-d">Reply by email ↗</a>}
        {!open && <button onClick={() => setOpen(true)} className="text-g600 hover:text-ink">Add a note</button>}
        <button onClick={onDelete} className="ml-auto text-g500 hover:text-ink">Delete</button>
      </div>
    </article>
  );
}
