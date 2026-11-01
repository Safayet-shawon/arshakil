"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { nav } from "@/data/site";
import { useIntroDone } from "@/lib/intro";
import { Apos, ButtonLink } from "../ui/Button";
import { cn } from "@/lib/utils";

const item = (i: number) => ({
  initial: { opacity: 0, y: -14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const },
});

export default function Header() {
  const entered = useIntroDone();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-[18px] md:px-[clamp(20px,3.4vw,48px)] transition-[background,backdrop-filter] duration-300",
      solid && "bg-g100/80 backdrop-blur-md")}>
      <motion.a href="#top" data-link {...(entered ? item(0) : { initial: { opacity: 0, y: -14 } })}
        className="flex items-center gap-2 rounded-full bg-paper px-3.5 py-2 text-[11px] font-bold tracking-[0.06em] text-g600 shadow-[0_6px_24px_rgba(77,79,83,0.10)]">
        <i className="pulse-dot block h-[7px] w-[7px] rounded-full bg-accent" />
        <span className="max-md:hidden">Available for new projects</span>
      </motion.a>

      <motion.nav {...(entered ? item(1) : { initial: { opacity: 0, y: -14 } })}
        className="hidden gap-[clamp(14px,2.4vw,34px)] text-xs font-bold uppercase tracking-[0.1em] text-g600 md:flex">
        {nav.map((n) => (
          <a key={n.href} href={n.href} data-link className="group relative py-1">
            {n.label}
            {n.count && <sup className="ml-0.5 text-[8px] tracking-normal text-g400">({n.count})</sup>}
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-ink transition-[width] duration-300 group-hover:w-full" />
          </a>
        ))}
      </motion.nav>

      <motion.div {...(entered ? item(2) : { initial: { opacity: 0, y: -14 } })}>
        <ButtonLink href="#contact">Let<Apos />s talk</ButtonLink>
      </motion.div>
    </header>
  );
}
