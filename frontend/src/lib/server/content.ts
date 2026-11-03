import { cache } from "react";
import { defaults } from "@/data/content";
import type { ListName, PrivateData, SiteContent } from "@/types";
import { readJson, writeJson } from "./blob";

const CONTENT = "data/content.json";
const PRIVATE = "data/private.json";

type Saved = Partial<SiteContent>;

/** Saved admin changes laid over the built-in defaults. Includes private fields: only for the admin. */
export const getFullContent = cache(async (): Promise<SiteContent> => {
  const saved = await readJson<Saved>(CONTENT, {});
  return { ...defaults, ...saved, texts: saved.texts ?? {} } as SiteContent;
});

/** The same, safe for the public site: book PDF keys are removed. */
export const getContent = cache(async (): Promise<SiteContent> => {
  const c = await getFullContent();
  return { ...c, books: c.books.map((b) => ({ ...b, pdf: b.pdf ? "locked" : "" })) };
});

export async function saveList(name: ListName, items: unknown[]) {
  const saved = await readJson<Saved>(CONTENT, {});
  await writeJson(CONTENT, { ...saved, [name]: items });
}

export async function saveText(key: string, value: string) {
  const saved = await readJson<Saved>(CONTENT, {});
  const texts = { ...(saved.texts ?? {}) };
  if (value) texts[key] = value; else delete texts[key];
  await writeJson(CONTENT, { ...saved, texts });
}

export const getPrivate = () => readJson<PrivateData>(PRIVATE, { codes: [], requests: [] });
export const savePrivate = (d: PrivateData) => writeJson(PRIVATE, d);
