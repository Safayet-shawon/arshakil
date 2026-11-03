import { listByName } from "@/lib/schema";
import { slugify } from "@/lib/media";
import { requireAdmin } from "@/lib/server/auth";
import { saveList } from "@/lib/server/content";

/** Replaces a whole list (projects, books, ...). Items that need a slug get a unique one here. */
export async function PUT(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const def = listByName((await params).name);
  const items = await req.json().catch(() => null);
  if (!def || !Array.isArray(items) || items.length > 500) return Response.json({ error: "Bad list" }, { status: 400 });

  if (def.slugFrom) {
    const seen = new Set<string>();
    for (const it of items as Record<string, unknown>[]) {
      const base = typeof it.slug === "string" && it.slug ? it.slug : slugify(String(it[def.slugFrom] ?? ""));
      let slug = base, n = 2;
      while (seen.has(slug)) slug = `${base}-${n++}`;
      seen.add(slug);
      it.slug = slug;
    }
  }
  await saveList(def.name, items);
  return Response.json({ ok: true, items });
}
