import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cn("px-5 py-[clamp(40px,6vw,88px)] md:px-[clamp(20px,3.4vw,48px)]", className)}>
      {children}
    </section>
  );
}
