import { randomBytes } from "node:crypto";
import { requireAdmin } from "@/lib/server/auth";
import { getPrivate, savePrivate } from "@/lib/server/content";

const newCode = () => randomBytes(4).toString("hex").toUpperCase();

/** Access codes: grant one for a request, create one by hand (book slug or "*" for every book), revoke, dismiss a request. */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const b = (await req.json()) as { action: string; id?: string; code?: string; book?: string; label?: string };
  const p = await getPrivate();

  if (b.action === "grant") {
    const r = p.requests.find((x) => x.id === b.id);
    if (!r) return Response.json({ error: "Request not found" }, { status: 404 });
    const code = newCode();
    p.codes.push({ code, book: r.book, label: `${r.name} (${r.contact})`, createdAt: new Date().toISOString() });
    r.status = "granted"; r.code = code;
  } else if (b.action === "create" && b.book) {
    p.codes.push({ code: newCode(), book: b.book, label: (b.label ?? "").slice(0, 80), createdAt: new Date().toISOString() });
  } else if (b.action === "revoke") {
    p.codes = p.codes.filter((c) => c.code !== b.code);
  } else if (b.action === "dismiss") {
    p.requests = p.requests.filter((x) => x.id !== b.id);
  } else return Response.json({ error: "Bad action" }, { status: 400 });

  await savePrivate(p);
  return Response.json({ access: p });
}
