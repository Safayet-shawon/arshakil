"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Floating "Open for commissions" pill, shown only once the hero has been scrolled past. */
export default function CommissionPill() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.7);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <a href="#contact" data-link
      className={cn("fixed bottom-5 right-5 z-[55] flex items-center gap-2.5 rounded-full bg-ink px-5 py-3 text-xs font-bold tracking-[0.06em] text-paper shadow-[0_14px_36px_rgba(77,79,83,0.3)] transition-all duration-400 hover:-translate-y-0.5 md:right-[clamp(20px,3.4vw,48px)]",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0")}>
      <i className="pulse-dot block h-2 w-2 rounded-full bg-accent" />
      <span>Open for commissions<small className="block text-[9px] uppercase tracking-[0.14em] text-g300">Available · {new Date().getFullYear()}</small></span>
    </a>
  );
}
