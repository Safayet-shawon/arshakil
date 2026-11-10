import { requireAdmin } from "@/lib/server/auth";
import { inquirySummary, UpstreamError } from "@/lib/server/inbox";

/** Counts for the filter chips and the red "unread" badge. */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return Response.json(await inquirySummary(), { headers: { "cache-control": "no-store" } });
  } catch (e) {
    return Response.json({ error: e instanceof UpstreamError ? e.message : "Something went wrong." }, { status: e instanceof UpstreamError ? e.status : 500 });
  }
}
