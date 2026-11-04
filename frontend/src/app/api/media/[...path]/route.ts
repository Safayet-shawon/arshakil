import { getFile } from "@/lib/server/blob";

/** Serves uploaded images, short videos and blog-post PDFs from the private store. Nothing else (no book PDFs, no data files) can be read through here. */
export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const key = (await params).path.join("/");
  if (!/^(uploads\/img|uploads\/vid|posts)\/[\w.-]+$/.test(key)) return new Response("Not found", { status: 404 });

  // Phones only play a video when the server can answer byte-range requests.
  const range = req.headers.get("range");
  const res = await getFile(key, range ? { headers: { range } } : undefined).catch(() => null);
  if (!res || (res.statusCode !== 200 && (res.statusCode as number) !== 206)) return new Response("Not found", { status: 404 });

  const headers = new Headers({ "content-type": res.blob.contentType ?? "application/octet-stream", "cache-control": "public, max-age=31536000, immutable", "accept-ranges": "bytes" });
  const status = range && (res as unknown as { headers?: Headers }).headers?.get("content-range") ? 206 : 200;
  const raw = (res as unknown as { headers?: Headers }).headers;
  for (const h of ["content-range", "content-length"]) { const v = raw?.get(h); if (v) headers.set(h, v); }
  return new Response(res.stream, { status, headers });
}
