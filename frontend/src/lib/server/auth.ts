import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "ar_admin";
const DAY = 60 * 60 * 24;

const secret = () => process.env.ADMIN_SECRET || "";
const sign = (v: string) => createHmac("sha256", secret()).update(v).digest("hex");

function same(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Admin credentials come from the ADMIN_USER / ADMIN_PASS environment variables, never from the code. */
export const checkLogin = (user: string, pass: string) =>
  !!process.env.ADMIN_USER && !!process.env.ADMIN_PASS && !!secret() &&
  same(user, process.env.ADMIN_USER) && same(pass, process.env.ADMIN_PASS);

export async function startSession() {
  const exp = String(Math.floor(Date.now() / 1000) + 7 * DAY);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 7 * DAY });
}

export async function endSession() { (await cookies()).delete(COOKIE); }

export async function isAdmin() {
  if (!secret()) return false;
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const [exp, sig] = v.split(".");
  return !!exp && !!sig && same(sig, sign(exp)) && Number(exp) > Date.now() / 1000;
}

/** For route handlers: a 401 response unless the admin cookie is valid. */
export async function requireAdmin() {
  return (await isAdmin()) ? null : Response.json({ error: "Not signed in" }, { status: 401 });
}
