import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { readJson, writeJson } from "./blob";

const COOKIE = "ar_admin";
const DAY = 60 * 60 * 24;

const secret = () => process.env.ADMIN_SECRET || "";
const sign = (v: string) => createHmac("sha256", secret()).update(v).digest("hex");

function same(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

const CREDS = "data/admin.json";
interface Creds { user: string; salt: string; hash: string }
const hashPass = (pass: string, salt: string) => scryptSync(pass, salt, 32).toString("hex");

/**
 * Admin credentials start as the ADMIN_USER / ADMIN_PASS environment variables (never in the code).
 * Once changed in the panel, the new user name and a salted hash of the password are kept in the private store and win.
 */
export async function checkLogin(user: string, pass: string) {
  if (!secret()) return false;
  const saved = await readJson<Creds | null>(CREDS, null);
  if (saved) return same(user, saved.user) && same(hashPass(pass, saved.salt), saved.hash);
  return !!process.env.ADMIN_USER && !!process.env.ADMIN_PASS && same(user, process.env.ADMIN_USER) && same(pass, process.env.ADMIN_PASS);
}

/** The current user name, to check the old password against when changing details. */
export async function currentUser() {
  return (await readJson<Creds | null>(CREDS, null))?.user ?? process.env.ADMIN_USER ?? "";
}

export async function saveLogin(user: string, pass: string) {
  const salt = randomBytes(16).toString("hex");
  await writeJson(CREDS, { user, salt, hash: hashPass(pass, salt) } satisfies Creds);
}

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
