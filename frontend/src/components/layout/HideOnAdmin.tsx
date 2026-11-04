"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** The site's menu, footer and floating pill are for visitors: the admin panel has its own menu. */
export default function HideOnAdmin({ children }: { children: ReactNode }) {
  return usePathname()?.startsWith("/ar6061") ? null : <>{children}</>;
}
