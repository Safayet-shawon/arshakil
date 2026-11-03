import { findBook, hasAccess, pageCount, previewPages, singlePage } from "@/lib/server/books";

/** One page of a book as a one-page PDF: the free pages for anyone, the rest only with a valid access code. */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string; n: string }> }) {
  const { slug, n } = await params;
  const book = await findBook(slug);
  const page = Number(n);
  if (!book || !book.pdf || !Number.isInteger(page) || page < 1) return new Response("Not found", { status: 404 });
  const total = await pageCount(book).catch(() => 0);
  if (page > total) return new Response("Not found", { status: 404 });
  if (page > previewPages(total) && !(await hasAccess(slug, req.headers.get("x-access-code")))) return new Response("Locked", { status: 403 });
  const bytes = await singlePage(book, page);
  return new Response(Buffer.from(bytes), { headers: { "content-type": "application/pdf", "cache-control": "private, no-store", "content-disposition": "inline" } });
}
