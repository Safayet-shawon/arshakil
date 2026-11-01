import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "dark" | "ghost";
const styles: Record<Variant, string> = {
  dark: "bg-ink text-paper hover:bg-g600",
  ghost: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-paper",
};
const base =
  "inline-flex items-center gap-2.5 rounded-full px-[22px] py-3 text-xs uppercase tracking-[0.1em] font-bold transition-[transform,background,color] duration-300 hover:-translate-y-0.5";

/** The mustard apostrophe used in "Let's talk" / "Let's collaborate". */
export function Apos() {
  return <i className="not-italic text-accent text-[1.25em] leading-[0] tracking-normal font-bold ml-[-0.1em] mr-[0.06em]">’</i>;
}

export function ButtonLink({ href, children, variant = "dark", arrow = "↗", className, ...rest }: {
  href: string; children: ReactNode; variant?: Variant; arrow?: string; className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">) {
  return (
    <a href={href} data-link className={cn(base, styles[variant], className)} {...rest}>
      {children}
      {arrow && <span aria-hidden>{arrow}</span>}
    </a>
  );
}
