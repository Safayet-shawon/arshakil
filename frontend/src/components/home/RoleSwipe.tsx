"use client";
import { useEffect, useState } from "react";
import { roles } from "@/data/site";
import { prefersReducedMotion } from "@/lib/utils";

const LINE = 1.18; // em per word

/** Vertical word swap: Architect -> Photographer -> Traveller -> Writer -> Content Creator -> (loop). */
export default function RoleSwipe() {
  const [i, setI] = useState(0);
  const [jump, setJump] = useState(false);
  const words = [...roles, roles[0]]; // clone of the first word so the loop is seamless

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => { setJump(false); setI((n) => n + 1); }, 2400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (i !== roles.length) return;
    const id = setTimeout(() => { setJump(true); setI(0); }, 850);
    return () => clearTimeout(id);
  }, [i]);

  return (
    <h2 aria-label={roles.join(", ")} className="font-display block h-[1.18em] overflow-hidden text-[clamp(30px,min(4.6vw,7vh),84px)] leading-[1.18] text-ink">
      <span className="block" style={{
        transform: `translateY(${-i * LINE}em)`,
        transition: jump ? "none" : "transform .8s var(--ease-in-out-expo)",
      }}>
        {words.map((w, k) => <span key={k} aria-hidden className="block h-[1.18em] whitespace-nowrap">{w}</span>)}
      </span>
    </h2>
  );
}
