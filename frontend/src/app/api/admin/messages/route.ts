import { KINDS_LIST, parseFilters } from "@/lib/server/inquiry-query";
import { requireAdmin } from "@/lib/server/auth";
import { deleteInquiry, listInquiries, markAllRead, updateInquiry, UpstreamError } from "@/lib/server/inbox";
import { STATUSES, WORK_FIELDS, type InquiryStatus, type WorkField } from "@/lib/inquiry";

const fail = (e: unknown) =>
  e instanceof UpstreamError ? Response.json({ error: e.message }, { status: e.status }) : Response.json({ error: "Something went wrong." }, { status: 500 });

/** The feed. Query: field, kind, status, q, from, to, page, pageSize (all optional). */
export async function GET(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return Response.json(await listInquiries(parseFilters(new URL(req.url).searchParams)), { headers: { "cache-control": "no-store" } });
  } catch (e) { return fail(e); }
}

/** { id, status?, notes? }: the owner's own status and private note on one inquiry. */
export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const b = (await req.json().catch(() => ({}))) as { id?: string; status?: string; notes?: string };
  if (!b.id || (b.status === undefined && b.notes === undefined)) return Response.json({ error: "Nothing to change" }, { status: 400 });
  if (b.status !== undefined && !(STATUSES as readonly string[]).includes(b.status)) return Response.json({ error: "Bad status" }, { status: 400 });
  if (b.notes !== undefined && (typeof b.notes !== "string" || b.notes.length > 4000)) return Response.json({ error: "Note is too long" }, { status: 400 });
  try {
    return Response.json({ item: await updateInquiry(b.id, { status: b.status as InquiryStatus | undefined, notes: b.notes }) });
  } catch (e) { return fail(e); }
}

/** { action: "markAllRead", field?, kind? } */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const b = (await req.json().catch(() => ({}))) as { action?: string; field?: string; kind?: string };
  if (b.action !== "markAllRead") return Response.json({ error: "Bad action" }, { status: 400 });
  const field = (WORK_FIELDS as readonly string[]).includes(b.field ?? "") ? (b.field as WorkField) : undefined;
  const kind = (KINDS_LIST as readonly string[]).includes(b.kind ?? "") ? (b.kind as "hire" | "general") : undefined;
  try { return Response.json(await markAllRead({ field, kind })); } catch (e) { return fail(e); }
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  try { await deleteInquiry(id); return Response.json({ ok: true }); } catch (e) { return fail(e); }
}
