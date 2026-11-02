"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/data/site";
import { useIntroDone } from "@/lib/intro";
import type { NavLink } from "@/types";
import { Apos, ButtonLink } from "../ui/Button";
import { cn } from "@/lib/utils";

const item = (i: number) => ({
  initial: { opacity: 0, y: -14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const },
});

/** Internal links use next/link, external ones open in a new tab. */
function A({ link, className, onClick }: { link: NavLink; className?: string; onClick?: () => void }) {
  if (link.external) return <a href={link.href} target="_blank" rel="noreferrer" data-link className={className} onClick={onClick}>{link.label} ↗</a>;
  return <Link href={link.href} data-link className={className} onClick={onClick}>{link.label}</Link>;
}

export default function Header() {
  const pathname = usePathname();
  // on the home page wait for the intro; on every other page show the header right away
  const show = useIntroDone() || pathname !== "/";
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const anim = (i: number) => (show ? item(i) : { initial: { opacity: 0, y: -14 } });

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-[18px] md:px-[clamp(20px,3.4vw,48px)] transition-[background,backdrop-filter] duration-300",
      (solid || open) && "bg-g100/85 backdrop-blur-md")}>
      <motion.div {...anim(0)}>
        <Link href="/" data-link className="flex items-center gap-2 rounded-full bg-paper px-3.5 py-2 text-[11px] font-bold tracking-[0.06em] text-g600 shadow-[0_6px_24px_rgba(77,79,83,0.10)]">
          <i className="pulse-dot block h-[7px] w-[7px] rounded-full bg-accent" />
          <span className="max-lg:hidden">Available for new projects</span>
          <span className="lg:hidden">AR. Shakil</span>
        </Link>
      </motion.div>

      {/* desktop menu: Fields and Content open a dropdown on hover or keyboard focus */}
      <motion.nav {...anim(1)} className="hidden items-center gap-[clamp(14px,2vw,30px)] text-xs font-bold uppercase tracking-[0.1em] text-g600 lg:flex">
        {nav.map((n) => (
          <div key={n.label} className="group relative">
            <Link href={n.href} data-link className="relative block py-2">
              {n.label}
              {n.count && <sup className="ml-0.5 text-[8px] tracking-normal text-g400">({n.count})</sup>}
              {n.children && <span className="ml-1 text-[9px] text-accent">▾</span>}
            </Link>
            {n.children && (
              <div className="invisible absolute left-1/2 top-full z-10 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <ul className="min-w-[220px] rounded-2xl border border-g200 bg-paper p-2 shadow-[0_20px_50px_rgba(77,79,83,0.16)]">
                  {n.children.map((c) => (
                    <li key={c.label}>
                      <A link={c} className="block rounded-xl px-4 py-2.5 text-[11px] transition-colors hover:bg-accent/15 hover:text-ink" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </motion.nav>

      <motion.div {...anim(2)} className="flex items-center gap-2">
        <ButtonLink href="/#contact" className="max-sm:hidden">Let<Apos />s talk</ButtonLink>
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu" data-link
          className="rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-paper lg:hidden">
          {open ? "Close" : "Menu"}
        </button>
      </motion.div>

      {/* phone / tablet menu */}
      {open && (
        <div className="absolute inset-x-0 top-full max-h-[calc(100svh-70px)] overflow-y-auto border-t border-g200 bg-g100/95 px-5 pb-8 pt-4 backdrop-blur-md lg:hidden">
          {nav.map((n) => (
            <div key={n.label} className="border-b border-g200 py-3">
              <Link href={n.href} onClick={() => setOpen(false)} className="font-display text-3xl text-ink">{n.label}</Link>
              {n.children && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {n.children.map((c) => (
                    <A key={c.label} link={c} onClick={() => setOpen(false)} className="rounded-full border border-g300 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-g600" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
