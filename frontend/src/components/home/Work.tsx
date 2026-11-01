"use client";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import { projects } from "@/data/content";
import { cn } from "@/lib/utils";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";

/** Dark-grey index of projects. Hovering a row dims the rest and a preview card trails the cursor. */
export default function Work() {
  const [active, setActive] = useState<string | null>(null);
  const x = useMotionValue(-999);
  const y = useMotionValue(-999);
  const sx = useSpring(x, { stiffness: 140, damping: 22 });
  const sy = useSpring(y, { stiffness: 140, damping: 22 });
  const project = projects.find((p) => p.slug === active);

  return (
    <section id="work" className="bg-ink px-5 py-[clamp(72px,12vw,160px)] text-g100 md:px-[clamp(20px,3.4vw,48px)]">
      <SectionHead index="03" kicker="Selected work · hover to explore" title="Selected work" tone="dark"
        aside={<a href="#contact" data-link>All projects →</a>} />
      <Reveal>
        <ul onMouseMove={(e) => { x.set(e.clientX + 30); y.set(e.clientY - 120); }} onMouseLeave={() => setActive(null)}>
          {projects.map((p, i) => (
            <li key={p.slug} data-view onMouseEnter={() => setActive(p.slug)}
              className={cn("grid grid-cols-[36px_1fr] items-center gap-4 border-b border-white/20 py-6 transition-[padding,opacity] duration-300 md:grid-cols-[60px_1fr_1fr_80px]",
                active && active !== p.slug ? "opacity-40" : "opacity-100", active === p.slug && "md:pl-[18px]")}>
              <span className={cn("label tracking-[0.12em] transition-colors", active === p.slug ? "text-accent" : "text-g300")}>{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display text-[clamp(26px,4vw,58px)] leading-none text-g50">{p.title}</span>
              <span className="label tracking-[0.12em] text-g300 max-md:hidden">{p.type} — {p.location}</span>
              <span className="label text-right tracking-[0.12em] text-g300 max-md:hidden">{p.year}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <AnimatePresence>
        {project && (
          <motion.div key="peek" style={{ x: sx, y: sy }} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none fixed left-0 top-0 z-[60] flex aspect-[4/5] w-[min(300px,34vw)] items-end rounded-md bg-gradient-to-br from-g200 to-g400 p-3.5 text-ink shadow-[0_30px_60px_rgba(0,0,0,0.18)] max-md:hidden">
            <b className="font-display text-xl font-normal uppercase tracking-[0.04em]">{project.title}</b>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
