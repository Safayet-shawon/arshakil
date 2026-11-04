"use client";
import { useEffect, useState } from "react";

const PAGES: [string, string][] = [
  ["Home", "/"], ["About", "/about"], ["Architecture", "/architecture"], ["Photography", "/photography"],
  ["Content Creation", "/content-creation"], ["Travel", "/travel"], ["Author", "/author"], ["Social Work", "/social-work"],
];

/**
 * The site's pages inside the panel. Text turns editable (dashed) only in here: the switch is a cookie that is on
 * while this section is open and only takes effect inside a frame, so the public site never shows edit marks.
 */
export default function WebsiteEditor() {
  const [page, setPage] = useState("/");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.cookie = "ar_edit=1; path=/";
    setReady(true);
    return () => { document.cookie = "ar_edit=; path=/; max-age=0"; };
  }, []);

  return (
    <div>
      <h2 className="font-display text-4xl text-ink">Website</h2>
      <p className="mt-1 max-w-xl text-sm text-g600">Choose a page. Click any dashed text, change it and click away: it saves and shows on the live site straight away.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {PAGES.map(([name, path]) => (
          <button key={path} onClick={() => setPage(path)}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${page === path ? "bg-accent text-ink" : "bg-paper text-g600 hover:text-ink"}`}>{name}</button>
        ))}
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-g300 bg-paper">
        {ready && <iframe key={page} src={page} title="Website" className="h-[74svh] w-full" />}
      </div>
    </div>
  );
}
