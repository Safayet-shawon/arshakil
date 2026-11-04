"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { abs } from "@/lib/seo";

const NAMES: Record<string, string> = {
  architecture: "Architecture", photography: "Photography", "content-creation": "Content Creation", travel: "Travel",
  author: "Author", "social-work": "Social Work", about: "About", album: "Albums", privacy: "Privacy policy",
};
const pretty = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** "Home › Travel › Sylhet": a visible trail plus the same trail as structured data for search engines. */
export default function Breadcrumbs({ title }: { title: string }) {
  const parts = (usePathname() ?? "/").split("/").filter(Boolean);
  if (!parts.length) return null;
  const trail = [{ name: "Home", href: "/" }, ...parts.map((seg, i) => ({
    name: i === parts.length - 1 ? title : NAMES[seg] ?? pretty(seg),
    href: "/" + parts.slice(0, i + 1).join("/"),
  }))];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: abs(t.href) })),
  };
  return (
    <nav aria-label="Breadcrumb" className="label flex flex-wrap items-center gap-x-2 text-g500">
      {trail.map((t, i) => (
        <span key={t.href} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="text-g400">›</span>}
          {i === trail.length - 1
            ? <span aria-current="page" className="text-ink">{t.name}</span>
            : <Link href={t.href} data-link className="transition-colors hover:text-accent-d">{t.name}</Link>}
        </span>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </nav>
  );
}
