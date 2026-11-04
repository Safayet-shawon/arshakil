import type { AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "dark" | "ghost" | "accent";
const styles: Record<Variant, string> = {
  dark: "bg-ink text-paper hover:bg-g600",
  accent: "bg-accent text-ink shadow-[0_0_0_6px_rgba(247,181,0,0.22),0_12px_32px_rgba(247,181,0,0.35)] hover:bg-g50 hover:shadow-[0_0_0_8px_rgba(247,181,0,0.3),0_16px_40px_rgba(247,181,0,0.45)]",
  ghost: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-paper",
};
const base =
  "inline-flex items-center gap-2.5 rounded-full px-[22px] py-3 text-xs uppercase tracking-[0.1em] font-bold transition-[transform,background,color] duration-300 hover:-translate-y-0.5";

/** The mustard apostrophe in "Let's talk" / "Let's collaborate". */
export function Apos() {
  return <i className="not-italic text-accent">&apos;</i>;
}

/** Internal links use next/link; anything starting with http or mailto stays a plain anchor. */
export function ButtonLink({ href, children, variant = "dark", arrow = "↗", className, ...rest }: {
  href: string; children: ReactNode; variant?: Variant; arrow?: string; className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">) {
  const inner = <>{children}{arrow && <span aria-hidden>{arrow}</span>}</>;
  const cls = cn(base, styles[variant], className);
  if (/^(https?:|mailto:)|\.pdf$/.test(href)) return <a href={href} data-link className={cls} {...rest}>{inner}</a>;
  return <Link href={href} data-link className={cls}>{inner}</Link>;
}
