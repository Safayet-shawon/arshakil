"use client";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { bestOf } from "@/data/content";
import { cn } from "@/lib/utils";
import Reveal from "../ui/Reveal";
import Section from "../ui/Section";
import SectionHead from "../ui/SectionHead";

/** The best one from each field. Hover dims the rest and a photo card trails the cursor; click opens that field's page. */
export default function Work() {
  const [active, setActive] = useState<string | null>(null);
  const x = useMotionValue(-999);
  const y = useMotionValue(-999);
  const sx = useSpring(x, { stiffness: 140, damping: 22 });
  const sy = useSpring(y, { stiffness: 140, damping: 22 });
  const hover = bestOf.find((b) => b.title === active);

  return (
    <Section id="work" className="bg-ink text-g100">
      <SectionHead index="03" kicker="The best of each field" title="Selected work" tone="dark" aside="06" />
      <Reveal>
        <ul onMouseMove={(e) => { x.set(e.clientX + 30); y.set(e.clientY - 130); }} onMouseLeave={() => setActive(null)}>
          {bestOf.map((b, i) => (
            <li key={b.title}>
              <Link href={b.href} data-view onMouseEnter={() => setActive(b.title)}
                className={cn("grid grid-cols-[36px_1fr] items-center gap-4 border-b border-white/20 py-5 transition-[padding,opacity] duration-300 md:grid-cols-[60px_1.4fr_1fr_80px]",
                  active && active !== b.title ? "opacity-40" : "opacity-100", active === b.title && "md:pl-[18px]")}>
                <span className={cn("label tracking-[0.12em] transition-colors", active === b.title ? "text-accent" : "text-g300")}>{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="label block text-[10px] text-accent">{b.category}</span>
                  <span className="font-display text-[clamp(24px,3.4vw,50px)] leading-none text-g50">{b.title}</span>
                </span>
                <span className="label tracking-[0.12em] text-g300 max-md:hidden">{b.meta}</span>
                <span className="label text-right tracking-[0.12em] text-g300 max-md:hidden">{b.year}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      <AnimatePresence>
        {hover && (
          <motion.div key="peek" style={{ x: sx, y: sy }} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none fixed left-0 top-0 z-[60] aspect-[4/5] w-[min(280px,30vw)] overflow-hidden rounded-md shadow-[0_30px_60px_rgba(0,0,0,0.25)] max-md:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/photos/${hover.photo}.jpg`} alt={hover.title} className="h-full w-full object-cover" />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
