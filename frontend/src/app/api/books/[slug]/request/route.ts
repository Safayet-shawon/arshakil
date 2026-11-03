import { findBook } from "@/lib/server/books";
import { getPrivate, savePrivate } from "@/lib/server/content";

/** A reader asks for access: name, how to reach them and the payment transaction id. The admin grants a code. */
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const book = await findBook((await params).slug);
  const b = (await req.json().catch(() => ({}))) as { name?: string; contact?: string; txn?: string };
  const name = String(b.name ?? "").trim().slice(0, 80), contact = String(b.contact ?? "").trim().slice(0, 120), txn = String(b.txn ?? "").trim().slice(0, 80);
  if (!book || name.length < 2 || contact.length < 5) return Response.json({ error: "Please add your name and a phone or email" }, { status: 400 });
  const p = await getPrivate();
  if (p.requests.length > 500) return Response.json({ error: "Try again later" }, { status: 429 });
  p.requests.unshift({ id: crypto.randomUUID(), book: book.slug, name, contact, txn, createdAt: new Date().toISOString(), status: "new" });
  await savePrivate(p);
  return Response.json({ ok: true });
}
