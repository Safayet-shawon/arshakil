"use client";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

/** Footer with a live clock for the studio's time zone. */
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
    <footer className="flex flex-wrap justify-between gap-3 bg-ink px-5 py-[22px] text-[11px] font-bold uppercase tracking-[0.14em] text-g300 md:px-[clamp(20px,3.4vw,48px)]">
      <span>© {new Date().getFullYear()} {site.fullName} · {site.firm}</span>
      <span>Dhaka · {time} BST</span>
      <a href="#top" data-link className="transition-colors hover:text-accent">Back to top ↑</a>
    </footer>
  );
}
