import { get, put } from "@vercel/blob";

/**
 * Private Blob store: site content, access codes, uploaded images and book PDFs.
 * Reads of the small JSON files are cached for a few seconds per server instance.
 */
const cache = new Map<string, { at: number; data: unknown }>();
const TTL = 4000;

export async function readJson<T>(path: string, fallback: T): Promise<T> {
  const hit = cache.get(path);
  if (hit && Date.now() - hit.at < TTL) return hit.data as T;
  let data = fallback;
  try {
    const res = await get(path, { access: "private", useCache: false });
    if (res && res.statusCode === 200) data = JSON.parse(await new Response(res.stream).text()) as T;
  } catch { /* missing file: use the fallback */ }
  cache.set(path, { at: Date.now(), data });
  return data;
}

export async function writeJson(path: string, data: unknown) {
  await put(path, JSON.stringify(data), { access: "private", contentType: "application/json", allowOverwrite: true, addRandomSuffix: false });
  cache.set(path, { at: Date.now(), data });
}

export const putFile = (path: string, body: Blob | Buffer, contentType: string) =>
  put(path, body, { access: "private", contentType, allowOverwrite: true, addRandomSuffix: false });

export const getFile = (path: string, opts?: { headers?: HeadersInit }) => get(path, { access: "private", ...opts });
