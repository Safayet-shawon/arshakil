import { randomUUID } from "node:crypto";
import { readJson, writeJson } from "./blob";

export interface Message { id: string; name: string; email: string; message: string; service?: string; createdAt: string }

const FILE = "data/messages.json";

export const getMessages = () => readJson<Message[]>(FILE, []);

export async function addMessage(m: Omit<Message, "id" | "createdAt">) {
  const all = await getMessages();
  const msg: Message = { ...m, id: randomUUID(), createdAt: new Date().toISOString() };
  await writeJson(FILE, [msg, ...all].slice(0, 500));
  return msg;
}

export async function removeMessage(id: string) {
  await writeJson(FILE, (await getMessages()).filter((m) => m.id !== id));
}
