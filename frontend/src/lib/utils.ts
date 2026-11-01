export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
export const pad3 = (n: number) => String(n).padStart(3, "0");
export const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
