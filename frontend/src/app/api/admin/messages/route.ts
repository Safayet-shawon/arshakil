import { requireAdmin } from "@/lib/server/auth";
import { getMessages, removeMessage } from "@/lib/server/messages";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return Response.json({ messages: await getMessages() });
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  await removeMessage(id);
  return Response.json({ messages: await getMessages() });
}
