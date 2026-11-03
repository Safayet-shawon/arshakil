import { findBook, hasAccess, pageCount, previewPages } from "@/lib/server/books";

/** What the reader needs: page count, how many are free, and whether this access code unlocks the book. */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const book = await findBook((await params).slug);
  if (!book || !book.pdf) return Response.json({ error: "Not found" }, { status: 404 });
  const pages = await pageCount(book).catch(() => 0);
  const code = new URL(req.url).searchParams.get("code");
  const unlocked = await hasAccess(book.slug, code);
  return Response.json({ title: book.title, priceBdt: book.priceBdt, pages, free: previewPages(pages), unlocked },
    { headers: { "cache-control": "no-store" } });
}
