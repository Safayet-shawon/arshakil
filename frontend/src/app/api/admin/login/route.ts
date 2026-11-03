import { checkLogin, startSession } from "@/lib/server/auth";

const fails = new Map<string, { n: number; until: number }>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const f = fails.get(ip);
  if (f && f.n >= 5 && f.until > Date.now()) return Response.json({ error: "Too many tries. Wait a few minutes." }, { status: 429 });

  const { user, pass } = (await req.json().catch(() => ({}))) as { user?: string; pass?: string };
  if (!checkLogin(String(user ?? ""), String(pass ?? ""))) {
    fails.set(ip, { n: (f?.n ?? 0) + 1, until: Date.now() + 5 * 60_000 });
    return Response.json({ error: "Wrong user name or password" }, { status: 401 });
  }
  fails.delete(ip);
  await startSession();
  return Response.json({ ok: true });
}
