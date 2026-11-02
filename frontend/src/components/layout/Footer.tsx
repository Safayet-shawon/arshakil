"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fields, site, socials } from "@/data/site";

const col = "grid content-start gap-2 text-sm text-g300";
const head = "label mb-1 text-accent";

/** Footer: every page and every link in one place, plus a live clock for the studio's time zone. */
export default function Footer() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: site.timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="bg-ink px-5 pt-14 text-g300 md:px-[clamp(20px,3.4vw,48px)]">
      <div className="grid gap-10 border-b border-white/15 pb-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className={col}>
          <div className="font-display text-3xl text-g50">{site.fullName}</div>
          <p className="max-w-xs leading-relaxed text-g300">{site.tagline}</p>
        </div>
        <div className={col}>
          <div className={head}>Fields</div>
          {fields.map((f) => <Link key={f.slug} href={f.href} data-link className="transition-colors hover:text-accent">{f.title}</Link>)}
        </div>
        <div className={col}>
          <div className={head}>Find me</div>
          {socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noreferrer" data-link className="transition-colors hover:text-accent">{s.label} ↗</a>)}
        </div>
        <div className={col}>
          <div className={head}>Contact</div>
          <a href={`mailto:${site.email}`} data-link className="transition-colors hover:text-accent">{site.email}</a>
          <Link href="/about" data-link className="transition-colors hover:text-accent">About me</Link>
          <Link href="/#contact" data-link className="transition-colors hover:text-accent">Send a message</Link>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-3 py-5 text-[11px] font-bold uppercase tracking-[0.14em]">
        <span>© {new Date().getFullYear()} {site.fullName} · {site.firm}</span>
        <span>Dhaka · {time} BST</span>
        <button data-link onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="uppercase tracking-[0.14em] transition-colors hover:text-accent">Back to top ↑</button>
      </div>
    </footer>
  );
}
