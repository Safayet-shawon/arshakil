import { requireAdmin } from "@/lib/server/auth";
import { putFile } from "@/lib/server/blob";

const OK = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/** Images only (the admin shrinks them in the browser first). PDFs go through /api/admin/upload-token. */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const file = (await req.formData()).get("file");
  if (!(file instanceof File) || !OK.includes(file.type) || file.size > 4_000_000) return Response.json({ error: "Upload a JPG, PNG or WebP under 4 MB" }, { status: 400 });
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const key = `uploads/img/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  await putFile(key, file, file.type);
  return Response.json({ url: `/api/media/${key}` });
}
