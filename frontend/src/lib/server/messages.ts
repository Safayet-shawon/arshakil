import { randomUUID } from "node:crypto";
import { readJson, writeJson } from "./blob";

/** `hire`: sent after choosing a "Hire me as ..." option. `general`: any other message. */
export interface Message {
  id: string; kind: "hire" | "general"; name: string; email?: string; phone?: string; message: string;
  service?: string; createdAt: string; read?: boolean;
}

const FILE = "data/messages.json";

/** Older messages (saved before there were kinds) are treated as read. */
export const getMessages = async () =>
  (await readJson<Message[]>(FILE, [])).map((m) => ({ ...m, kind: m.kind ?? (m.service ? "hire" : "general"), read: m.read ?? m.kind === undefined }) as Message);

export async function addMessage(m: Omit<Message, "id" | "createdAt" | "read" | "kind"> & { kind: Message["kind"] }) {
  const all = await getMessages();
  const msg: Message = { ...m, id: randomUUID(), createdAt: new Date().toISOString(), read: false };
  await writeJson(FILE, [msg, ...all].slice(0, 500));
  return msg;
}

export async function removeMessage(id: string) {
  await writeJson(FILE, (await getMessages()).filter((m) => m.id !== id));
}

/** Marks one message (or all, when no id is given) as read. */
export async function markRead(id?: string) {
  await writeJson(FILE, (await getMessages()).map((m) => (!id || m.id === id ? { ...m, read: true } : m)));
}
