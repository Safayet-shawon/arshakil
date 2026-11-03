"use client";
import Link from "next/link";
import { useSite } from "./SiteProvider";

/** Floating strip shown only to the signed-in admin on the public pages. */
export default function AdminBar() {
  const { admin } = useSite();
  if (!admin) return null;
  const out = async () => { await fetch("/api/admin/logout", { method: "POST" }); location.reload(); };
  return (
    <div className="fixed bottom-4 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-4 rounded-full bg-ink px-5 py-3 text-xs text-paper shadow-2xl">
      <span className="label text-accent">Admin</span>
      <span className="max-sm:hidden">Click any dashed text to edit it</span>
      <Link href="/ar6061" className="font-bold uppercase tracking-[0.1em] hover:text-accent">Panel</Link>
      <button onClick={out} className="font-bold uppercase tracking-[0.1em] hover:text-accent">Sign out</button>
    </div>
  );
}
