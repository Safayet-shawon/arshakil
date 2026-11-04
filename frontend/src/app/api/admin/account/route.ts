import { checkLogin, currentUser, requireAdmin, saveLogin } from "@/lib/server/auth";

/** Changes the admin user name and password. The current password must be given again. */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { current, user, pass } = (await req.json().catch(() => ({}))) as { current?: string; user?: string; pass?: string };
  const name = String(user ?? "").trim();
  const next = String(pass ?? "");

  if (!(await checkLogin(await currentUser(), String(current ?? "")))) return Response.json({ error: "The current password is not right" }, { status: 403 });
  if (name.length < 3 || name.length > 40) return Response.json({ error: "The user name needs 3 to 40 characters" }, { status: 400 });
  if (next.length < 8 || next.length > 100) return Response.json({ error: "The new password needs at least 8 characters" }, { status: 400 });

  await saveLogin(name, next);
  return Response.json({ ok: true });
}
