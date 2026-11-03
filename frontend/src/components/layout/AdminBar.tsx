"use client";
import { useSite } from "./SiteProvider";

/** Shown only while the admin is editing text from the Website tab. The public pages carry no admin marks otherwise. */
export default function AdminBar() {
  const { editing } = useSite();
  if (!editing) return null;
  const done = () => { document.cookie = "ar_edit=; path=/; max-age=0"; location.href = "/ar6061?tab=website"; };
  return (
    <div className="fixed bottom-4 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-4 rounded-full bg-ink px-5 py-3 text-xs text-paper shadow-2xl">
      <span className="label text-accent">Editing text</span>
      <span className="max-sm:hidden">Click any dashed text to change it</span>
      <button onClick={done} className="font-bold uppercase tracking-[0.1em] hover:text-accent">Done</button>
    </div>
  );
}
