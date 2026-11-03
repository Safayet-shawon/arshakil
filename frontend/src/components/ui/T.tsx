"use client";
import { useSite } from "../layout/SiteProvider";
import Hl from "./Hl";

/**
 * Text the admin can change. The original text is the key, so there is nothing to register:
 * wrap any string in <T> and, when signed in as admin, click it to edit it in place (saved on blur).
 * Visitors see the saved text with the usual mustard punctuation.
 */
export default function T({ children, hl = true }: { children: string; hl?: boolean }) {
  const { texts, admin, setText } = useSite();
  const value = texts[children] ?? children;
  if (!admin) return hl ? <Hl>{value}</Hl> : <>{value}</>;

  const save = async (next: string) => {
    if (next === value) return;
    setText(children, next === children ? "" : next);
    await fetch("/api/admin/text", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ key: children, value: next === children ? "" : next }) });
  };
  return (
    <span contentEditable suppressContentEditableWarning spellCheck={false} title="Click to edit"
      onBlur={(e) => save(e.currentTarget.innerText.replace(/\s+/g, " ").trim() || children)}
      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); } }}
      className="cursor-text rounded-sm outline-1 outline-dashed outline-accent/60 focus:bg-accent/10 focus:outline-2">
      {value}
    </span>
  );
}
