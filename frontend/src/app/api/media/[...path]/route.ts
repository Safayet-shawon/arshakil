import { getFile } from "@/lib/server/blob";

/** Serves uploaded images from the private store. Nothing else (no PDFs, no data files) can be read through here. */
export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const key = (await params).path.join("/");
  if (!/^uploads\/img\/[\w.-]+$/.test(key)) return new Response("Not found", { status: 404 });
  const res = await getFile(key).catch(() => null);
  if (!res || res.statusCode !== 200) return new Response("Not found", { status: 404 });
  return new Response(res.stream, { headers: { "content-type": res.blob.contentType, "cache-control": "public, max-age=31536000, immutable" } });
}
