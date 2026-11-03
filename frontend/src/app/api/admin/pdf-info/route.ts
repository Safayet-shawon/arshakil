import { requireAdmin } from "@/lib/server/auth";
import { pageCount } from "@/lib/server/books";
import type { Book } from "@/types";

export async function GET(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const key = new URL(req.url).searchParams.get("key") ?? "";
  try {
    return Response.json({ pages: await pageCount({ pdf: key } as Book) });
  } catch {
    return Response.json({ error: "Could not read that PDF" }, { status: 400 });
  }
}
