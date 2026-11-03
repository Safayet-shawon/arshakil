"use client";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { SiteContent } from "@/types";

interface Site extends SiteContent { admin: boolean; setText: (key: string, value: string) => void }

const Ctx = createContext<Site | null>(null);

/** Gives client components the (public) site content and whether the admin is signed in. */
export default function SiteProvider({ content, admin, children }: { content: SiteContent; admin: boolean; children: ReactNode }) {
  const [texts, setTexts] = useState(content.texts);
  const setText = useCallback((key: string, value: string) => {
    setTexts((t) => { const n = { ...t }; if (value) n[key] = value; else delete n[key]; return n; });
  }, []);
  const value = useMemo(() => ({ ...content, texts, admin, setText }), [content, texts, admin, setText]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSite() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSite must be used inside SiteProvider");
  return v;
}
