import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument } from "pdf-lib";
import type { Book } from "@/types";
import { getFile } from "./blob";
import { getFullContent, getPrivate } from "./content";

/** First 5% of the pages (at least one) are free to read. */
export const previewPages = (pages: number) => Math.max(1, Math.ceil(pages * 0.05));

const docs = new Map<string, PDFDocument>();

async function loadPdf(book: Book) {
  const hit = docs.get(book.pdf);
  if (hit) return hit;
  let bytes: Uint8Array;
  if (book.pdf === "seed") bytes = await readFile(join(process.cwd(), "private", "sample-book.pdf"));
  else {
    const res = await getFile(book.pdf);
    if (!res || res.statusCode !== 200) throw new Error("PDF not found");
    bytes = new Uint8Array(await new Response(res.stream).arrayBuffer());
  }
  const doc = await PDFDocument.load(bytes);
  if (docs.size > 4) docs.clear();
  docs.set(book.pdf, doc);
  return doc;
}

export async function findBook(slug: string) {
  const c = await getFullContent();
  return c.books.find((b) => b.slug === slug) ?? null;
}

export async function pageCount(book: Book) { return (await loadPdf(book)).getPageCount(); }

/** A PDF that holds only page `n` (1-based). Readers never receive the whole file. */
export async function singlePage(book: Book, n: number) {
  const src = await loadPdf(book);
  const out = await PDFDocument.create();
  const [page] = await out.copyPages(src, [n - 1]);
  out.addPage(page);
  return out.save();
}

export async function hasAccess(slug: string, code: string | null) {
  if (!code) return false;
  const p = await getPrivate();
  return p.codes.some((c) => c.code === code.trim().toUpperCase() && (c.book === slug || c.book === "*"));
}
