import { randomUUID } from "node:crypto";
import { readJson, writeJson } from "./blob";
import type { InquiryStatus } from "../inquiry";

/**
 * The previous inbox: one JSON file in the private Blob store. It is the fallback used when INQUIRIES_API_URL is
 * not set (e.g. the Vercel deployment before the NestJS + PostgreSQL backend is live), and the source for the
 * one-time import into the database. See lib/server/inbox.ts.
 *
 * `kind` hire: sent after choosing a "Hire me as ..." option. `general`: any other message.
 */
export interface Message {
  id: string; kind: "hire" | "general"; name: string; email?: string; phone?: string; message: string;
  service?: string; createdAt: string; read?: boolean;
  /** Added with the inquiries feed: the admin's own status and private notes. */
  status?: InquiryStatus; notes?: string;
}

export const LEGACY_FILE = "data/messages.json";
const KEEP = 2000;

/** Older messages (saved before there were kinds) are treated as read. */
export const getMessages = async () =>
  (await readJson<Message[]>(LEGACY_FILE, [])).map((m) => ({ ...m, kind: m.kind ?? (m.service ? "hire" : "general"), read: m.read ?? m.kind === undefined }) as Message);

export async function addMessage(m: Omit<Message, "id" | "createdAt" | "read" | "kind" | "status" | "notes"> & { kind: Message["kind"] }) {
  const all = await getMessages();
  const msg: Message = { ...m, id: randomUUID(), createdAt: new Date().toISOString(), read: false, status: "new" };
  await writeJson(LEGACY_FILE, [msg, ...all].slice(0, KEEP));
  return msg;
}

export async function removeMessage(id: string) {
  await writeJson(LEGACY_FILE, (await getMessages()).filter((m) => m.id !== id));
}

/** Changes one message's status and/or notes. `read` stays in step so older code paths keep working. Returns false if not found. */
export async function updateMessage(id: string, patch: { status?: InquiryStatus; notes?: string }) {
  const all = await getMessages();
  const i = all.findIndex((m) => m.id === id);
  if (i < 0) return false;
  const m = { ...all[i] };
  if (patch.status) { m.status = patch.status; m.read = patch.status !== "new"; }
  if (patch.notes !== undefined) m.notes = patch.notes.trim() || undefined;
  all[i] = m;
  await writeJson(LEGACY_FILE, all);
  return true;
}

/** Marks messages as read (status new -> read). `match` limits which ones; no match = all of them. */
export async function markRead(match?: (m: Message) => boolean) {
  let n = 0;
  const all = (await getMessages()).map((m) => {
    if ((m.status ?? (m.read ? "read" : "new")) === "new" && (!match || match(m))) { n++; return { ...m, read: true, status: "read" as const }; }
    return m;
  });
  await writeJson(LEGACY_FILE, all);
  return n;
}
