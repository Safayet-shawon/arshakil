import { requireAdmin } from "@/lib/server/auth";
import { saveText } from "@/lib/server/content";

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { key, value } = (await req.json()) as { key?: string; value?: string };
  if (!key || typeof value !== "string" || key.length > 2000 || value.length > 4000) return Response.json({ error: "Bad text" }, { status: 400 });
  await saveText(key, value);
  return Response.json({ ok: true });
}
