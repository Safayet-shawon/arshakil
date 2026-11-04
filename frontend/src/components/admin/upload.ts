import { upload } from "@vercel/blob/client";

const slug = (f: File) => f.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/\.[a-z0-9]+$/, "");

/** Shrinks a photo in the browser (max 1800px, JPEG) so it fits one request, then stores it. Returns its /api/media path and shape. */
export async function uploadImage(file: File): Promise<{ url: string; ratio: number }> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await new Promise<Blob>((ok, no) => c.toBlob((b) => (b ? ok(b) : no(new Error("Could not read the image"))), "image/jpeg", 0.85));
  const body = new FormData();
  body.append("file", new File([blob], "photo.jpg", { type: "image/jpeg" }));
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Upload failed");
  return { url: json.url as string, ratio: Math.round((c.width / c.height) * 1000) / 1000 };
}

/** Sends a PDF straight to the private store and returns its key (and, for books, the page count). */
export async function uploadPdf(file: File, folder: "books" | "posts" = "books"): Promise<{ key: string; pages: number }> {
  const blob = await upload(`${folder}/${Date.now()}-${slug(file)}.pdf`, file, { access: "private", handleUploadUrl: "/api/admin/upload-token" });
  if (folder === "posts") return { key: blob.pathname, pages: 0 };
  const res = await fetch(`/api/admin/pdf-info?key=${encodeURIComponent(blob.pathname)}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Could not read that PDF");
  return { key: blob.pathname, pages: json.pages as number };
}

/** Sends a short video (MP4, WebM or MOV) straight to the private store and returns its key. */
export async function uploadVideo(file: File): Promise<string> {
  const ext = file.name.toLowerCase().match(/\.(mp4|webm|mov)$/)?.[1];
  if (!ext) throw new Error("Use an MP4, WebM or MOV video");
  const blob = await upload(`uploads/vid/${Date.now()}-${slug(file)}.${ext}`, file, { access: "private", handleUploadUrl: "/api/admin/upload-token" });
  return blob.pathname;
}

/**
 * Uploads many photos at once (a few in parallel). `each` is called as every photo finishes, in any order.
 * Resolves with one result per file, in the order the files were given.
 */
export async function uploadImages(files: File[], each?: (i: number, r: { url: string; ratio: number } | Error) => void) {
  const out: ({ url: string; ratio: number } | Error)[] = new Array(files.length);
  let next = 0;
  const worker = async () => {
    while (next < files.length) {
      const i = next++;
      try { out[i] = await uploadImage(files[i]); } catch (e) { out[i] = e as Error; }
      each?.(i, out[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, files.length) }, worker));
  return out;
}

/** The first picture of a video, as a JPEG file. Null when the browser cannot decode the video. */
export async function videoPoster(file: File): Promise<File | null> {
  const url = URL.createObjectURL(file);
  try {
    const v = document.createElement("video");
    v.muted = true; v.playsInline = true; v.preload = "auto"; v.src = url;
    const once = (ev: string) => new Promise<void>((ok, no) => {
      const t = setTimeout(() => no(new Error("timeout")), 8000);
      v.addEventListener(ev, () => { clearTimeout(t); ok(); }, { once: true });
      v.addEventListener("error", () => { clearTimeout(t); no(new Error("error")); }, { once: true });
    });
    await once("loadeddata");
    v.currentTime = Math.min(0.5, (v.duration || 1) / 2);
    await once("seeked");
    const k = Math.min(1, 1280 / Math.max(v.videoWidth, v.videoHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(v.videoWidth * k); c.height = Math.round(v.videoHeight * k);
    c.getContext("2d")!.drawImage(v, 0, 0, c.width, c.height);
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.85));
    return blob ? new File([blob], "poster.jpg", { type: "image/jpeg" }) : null;
  } catch { return null; } finally { URL.revokeObjectURL(url); }
}
