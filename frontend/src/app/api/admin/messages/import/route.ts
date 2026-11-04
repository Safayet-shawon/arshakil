import { requireAdmin } from "@/lib/server/auth";
import { importLegacy, UpstreamError } from "@/lib/server/inbox";

/** One-time: moves messages from the previous store into the database. Safe to repeat. */
export async function POST() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return Response.json(await importLegacy());
  } catch (e) {
    return Response.json({ error: e instanceof UpstreamError ? e.message : "Something went wrong." }, { status: e instanceof UpstreamError ? e.status : 500 });
  }
}
