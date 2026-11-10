import sharp from "sharp";
import { getFile } from "@/lib/server/blob";

/** The widths a picture may be asked for (see lib/media.ts). Anything else is served whole. */
const WIDTHS = new Set([384, 640, 828, 1080, 1920]);

/** Serves uploaded images, short videos and blog-post PDFs from the private store. Nothing else (no book PDFs, no data files) can be read through here. */
export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const key = (await params).path.join("/");
  if (!/^(uploads\/img|uploads\/vid|posts)\/[\w.-]+$/.test(key)) return new Response("Not found", { status: 404 });

  // Phones only play a video when the server can answer byte-range requests.
  // ?w=640: a smaller copy of an uploaded photo, so a card never downloads the full-size picture. Made once, then kept by the CDN.
  const w = Number(new URL(req.url).searchParams.get("w"));
  if (WIDTHS.has(w) && key.startsWith("uploads/img/")) {
    const whole = await getFile(key).catch(() => null);
    if (!whole || whole.statusCode !== 200) return new Response("Not found", { status: 404 });
    try {
      const input = Buffer.from(await new Response(whole.stream).arrayBuffer());
      const out = await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 76 }).toBuffer();
      return new Response(new Uint8Array(out), { headers: { "content-type": "image/webp", "cache-control": "public, max-age=31536000, s-maxage=31536000, immutable" } });
    } catch {
      // not an image sharp can read (or too big): fall through and send the original
    }
  }

  const range = req.headers.get("range");
  const res = await getFile(key, range ? { headers: { range } } : undefined).catch(() => null);
  if (!res || (res.statusCode !== 200 && (res.statusCode as number) !== 206)) return new Response("Not found", { status: 404 });

  const headers = new Headers({ "content-type": res.blob.contentType ?? "application/octet-stream", "cache-control": "public, max-age=31536000, immutable", "accept-ranges": "bytes" });
  const status = range && (res as unknown as { headers?: Headers }).headers?.get("content-range") ? 206 : 200;
  const raw = (res as unknown as { headers?: Headers }).headers;
  for (const h of ["content-range", "content-length"]) { const v = raw?.get(h); if (v) headers.set(h, v); }
  return new Response(res.stream, { status, headers });
}
