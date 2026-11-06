"use client";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { featuredWork } from "@/lib/featured";
import { photoSrc } from "@/lib/media";
import { cn } from "@/lib/utils";
import { useSite } from "../layout/SiteProvider";
import Reveal from "../ui/Reveal";
import Section from "../ui/Section";
import SectionHead from "../ui/SectionHead";

/**
 * Featured work, chosen in the admin panel. Hover dims the other rows and a thumbnail card
 * glides after the cursor, cross-fading from one item's picture to the next.
 */
export default function Work() {
  const site = useSite();
  const items = featuredWork(site);
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(-999);
  const y = useMotionValue(-999);
  const sx = useSpring(x, { stiffness: 120, damping: 24, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 24, mass: 0.6 });
  const hover = active === null ? null : items[active];

  return (
    <Section id="work" className="bg-ink text-g100">
      <SectionHead index="03" kicker="Featured projects" title="Selected work" tone="dark" aside={String(items.length).padStart(2, "0")} />
      <Reveal>
        <ul onMouseMove={(e) => { x.set(e.clientX + 36); y.set(e.clientY - 140); }} onMouseLeave={() => setActive(null)}>
          {items.map((b, i) => (
            <li key={`${b.category}-${b.title}`}>
              <Link href={b.href} data-view onMouseEnter={() => setActive(i)}
                className={cn("grid grid-cols-[36px_1fr] items-center gap-4 border-b border-white/20 py-5 transition-[padding,opacity] duration-500 ease-out md:grid-cols-[60px_1.4fr_1fr_80px]",
                  active !== null && active !== i ? "opacity-40" : "opacity-100", active === i && "md:pl-[18px]")}>
                <span className={cn("label tracking-[0.12em] transition-colors", active === i ? "text-accent" : "text-g300")}>{String(i + 1).padStart(2, "0")}</span>
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

      <motion.div aria-hidden style={{ x: sx, y: sy }} animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.9 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none fixed left-0 top-0 z-[60] w-max overflow-hidden rounded-md bg-g600 shadow-[0_30px_60px_rgba(0,0,0,0.25)] max-md:hidden">
        <AnimatePresence initial={false}>
          {hover?.photo && (
            // shown whole, in its own shape: tall, wide or square, nothing is cut off
            <motion.img key={hover.photo} src={photoSrc(hover.photo)} alt="" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }} className="block h-auto max-h-[56vh] w-auto max-w-[min(360px,32vw)]" />
          )}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
