import { fieldFromService, type Inquiry, type InquiryFilters, type InquiryPage, type InquirySummary, type WorkField, WORK_FIELDS } from "../inquiry";
import { site } from "@/data/site";
import { addMessage, getMessages, LEGACY_FILE, markRead, removeMessage, updateMessage, type Message } from "./messages";
import { writeJson } from "./blob";

/**
 * The one place the site talks to the inbox of inquiries (hire requests + messages).
 *
 * - INQUIRIES_API_URL set  -> the NestJS + PostgreSQL backend is the source of truth. Admin calls carry ADMIN_API_KEY.
 * - not set                -> the previous Blob JSON file is used, so nothing breaks before the backend is live.
 */
const base = () => process.env.INQUIRIES_API_URL?.replace(/\/+$/, "");
export const apiMode = () => !!base();

export class UpstreamError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}

async function upstream(path: string, init: RequestInit & { admin?: boolean } = {}) {
  const headers = new Headers(init.headers);
  if (init.admin) headers.set("x-admin-key", process.env.ADMIN_API_KEY ?? "");
  if (init.body) headers.set("content-type", "application/json");
  let res: Response;
  try {
    res = await fetch(`${base()}${path}`, { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(10_000) });
  } catch {
    throw new UpstreamError(502, "Could not reach the inquiries service.");
  }
  if (res.status === 204) return undefined;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray(body.message) ? body.message.join(", ") : body.message;
    throw new UpstreamError(res.status === 401 || res.status === 503 ? 502 : res.status, msg ?? "The inquiries service returned an error.");
  }
  return body;
}

// ---------- visitor: send a message ----------

export interface NewInquiry { name: string; email?: string; phone?: string; message: string; service?: string; field?: WorkField; website?: string }

/** Forwards a visitor's message to the backend. The visitor's address is passed on so the backend can rate-limit by it. */
export async function createInquiry(p: NewInquiry, ip: string): Promise<{ status: number; message: string }> {
  try {
    const body = await upstream("/inquiries", { method: "POST", headers: { "x-forwarded-for": ip }, body: JSON.stringify(p) });
    return { status: 201, message: body?.message ?? "Thanks, your message was received. I'll reply soon." };
  } catch (e) {
    if (e instanceof UpstreamError && e.status >= 400 && e.status < 500) return { status: e.status, message: e.message };
    return { status: 500, message: `Could not save your message. Please email me at ${site.email}.` };
  }
}

// ---------- admin ----------

const toInquiry = (m: Message): Inquiry => ({
  id: m.id, kind: m.kind, field: fieldFromService(m.service), name: m.name, email: m.email ?? null, phone: m.phone ?? null,
  service: m.service ?? null, message: m.message, status: m.status ?? (m.read ? "read" : "new"), notes: m.notes ?? null,
  emailStatus: "skipped", emailError: null, createdAt: m.createdAt, updatedAt: m.createdAt,
});

const DAY = 86_400_000;
function legacyFilter(all: Inquiry[], f: InquiryFilters) {
  const q = f.q?.trim().toLowerCase();
  const from = f.from ? new Date(f.from).getTime() : null;
  const to = f.to ? new Date(f.to).getTime() + (/^\d{4}-\d{2}-\d{2}$/.test(f.to) ? DAY : 0) : null;
  return all
    .filter((i) => (!f.field || i.field === f.field) && (!f.kind || i.kind === f.kind) && (!f.status || i.status === f.status))
    .filter((i) => !q || [i.name, i.email, i.phone, i.message, i.service, i.notes].some((v) => v?.toLowerCase().includes(q)))
    .filter((i) => { const t = new Date(i.createdAt).getTime(); return (from === null || t >= from) && (to === null || t < to); })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listInquiries(f: InquiryFilters): Promise<InquiryPage> {
  const page = f.page ?? 1, pageSize = f.pageSize ?? 20;
  if (apiMode()) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(f)) if (v !== undefined && v !== "") qs.set(k, String(v));
    return upstream(`/admin/inquiries?${qs}`, { admin: true });
  }
  const rows = legacyFilter((await getMessages()).map(toInquiry), f);
  return { items: rows.slice((page - 1) * pageSize, page * pageSize), total: rows.length, page, pageSize };
}

export async function inquirySummary(): Promise<InquirySummary> {
  if (apiMode()) {
    const s = (await upstream("/admin/inquiries/summary", { admin: true })) as InquirySummary;
    s.legacyPending = (await getMessages().catch(() => [])).length;
    return s;
  }
  const rows = (await getMessages()).map(toInquiry);
  const zero = () => ({ total: 0, unread: 0 });
  const s: InquirySummary = { total: 0, unread: 0, byField: Object.fromEntries(WORK_FIELDS.map((k) => [k, zero()])) as InquirySummary["byField"], byKind: { hire: zero(), general: zero() } };
  for (const i of rows) {
    const u = i.status === "new" ? 1 : 0;
    s.total++; s.unread += u;
    s.byField[i.field].total++; s.byField[i.field].unread += u;
    s.byKind[i.kind].total++; s.byKind[i.kind].unread += u;
  }
  return s;
}

export async function updateInquiry(id: string, patch: { status?: Inquiry["status"]; notes?: string }) {
  if (apiMode()) return upstream(`/admin/inquiries/${encodeURIComponent(id)}`, { method: "PATCH", admin: true, body: JSON.stringify(patch) }) as Promise<Inquiry>;
  if (!(await updateMessage(id, patch))) throw new UpstreamError(404, "Inquiry not found");
  return toInquiry((await getMessages()).find((m) => m.id === id)!);
}

export async function markAllRead(f: { field?: WorkField; kind?: Inquiry["kind"] }) {
  if (apiMode()) return upstream("/admin/inquiries/mark-all-read", { method: "POST", admin: true, body: JSON.stringify(f) }) as Promise<{ updated: number }>;
  const updated = await markRead((m) => (!f.field || fieldFromService(m.service) === f.field) && (!f.kind || m.kind === f.kind));
  return { updated };
}

export async function deleteInquiry(id: string) {
  if (apiMode()) { await upstream(`/admin/inquiries/${encodeURIComponent(id)}`, { method: "DELETE", admin: true }); return; }
  await removeMessage(id);
}

/**
 * Moves the messages saved in the previous store into the database. Safe to repeat: the backend skips ids it has.
 * Only after the backend accepted them is the old file emptied (a dated copy is kept first).
 */
export async function importLegacy(): Promise<{ imported: number; skipped: number }> {
  if (!apiMode()) throw new UpstreamError(400, "The inquiries service is not configured.");
  const old = await getMessages();
  if (old.length === 0) return { imported: 0, skipped: 0 };
  const messages = old.map((m) => ({ id: m.id, kind: m.kind, name: m.name, email: m.email, phone: m.phone, message: m.message, service: m.service, createdAt: m.createdAt, read: m.status ? m.status !== "new" : m.read, status: m.status, notes: m.notes }));
  const result = (await upstream("/admin/inquiries/import", { method: "POST", admin: true, body: JSON.stringify({ messages }) })) as { imported: number; skipped: number };
  await writeJson(`data/messages.imported-${new Date().toISOString().slice(0, 10)}.json`, old);
  await writeJson(LEGACY_FILE, []);
  return result;
}

/** Used by the contact route when no backend is configured: the previous behaviour. */
export const legacyAdd = addMessage;
