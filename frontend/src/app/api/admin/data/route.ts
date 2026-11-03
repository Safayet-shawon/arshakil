import { requireAdmin } from "@/lib/server/auth";
import { getFullContent, getPrivate } from "@/lib/server/content";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const [content, priv] = await Promise.all([getFullContent(), getPrivate()]);
  return Response.json({ content, access: priv }, { headers: { "cache-control": "no-store" } });
}
