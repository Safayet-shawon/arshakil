import { upload } from "@vercel/blob/client";

/** Shrinks a photo in the browser (max 1800px, JPEG) so it fits one request, then stores it. Returns its /api/media path. */
export async function uploadImage(file: File): Promise<string> {
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
  return json.url as string;
}

/** Sends a book PDF straight to the private store and returns its key and page count. */
export async function uploadPdf(file: File): Promise<{ key: string; pages: number }> {
  const name = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/\.pdf$/, "");
  const blob = await upload(`books/${Date.now()}-${name}.pdf`, file, { access: "private", handleUploadUrl: "/api/admin/upload-token" });
  const res = await fetch(`/api/admin/pdf-info?key=${encodeURIComponent(blob.pathname)}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Could not read that PDF");
  return { key: blob.pathname, pages: json.pages as number };
}
