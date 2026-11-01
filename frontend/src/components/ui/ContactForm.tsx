"use client";
import { useState, type FormEvent } from "react";
import { sendContact } from "@/lib/api";
import { cn } from "@/lib/utils";

type Status = { kind: "idle" | "sending" | "ok" | "error"; message?: string };

const field =
  "w-full rounded-xl border border-g300 bg-paper/80 px-4 py-3 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-g400 focus:border-accent focus:shadow-[0_0_0_3px_rgba(247,181,0,0.2)]";

/** Posts to the NestJS backend (POST /api/contact). */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus({ kind: "sending" });
    const res = await sendContact({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    });
    setStatus({ kind: res.ok ? "ok" : "error", message: res.message });
    if (res.ok) form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-10 grid w-full max-w-[560px] gap-3 text-left">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required minLength={2} maxLength={80} placeholder="Your name" aria-label="Your name" className={field} />
        <input name="email" type="email" required maxLength={120} placeholder="Email" aria-label="Email" className={field} />
      </div>
      <textarea name="message" required minLength={10} maxLength={2000} rows={4} placeholder="Tell me about it" aria-label="Message" className={cn(field, "resize-none")} />
      <div className="flex items-center justify-between gap-4">
        <p role="status" className={cn("text-xs", status.kind === "error" ? "text-g600" : "text-g500")}>{status.message}</p>
        <button type="submit" disabled={status.kind === "sending"} data-link
          className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-paper transition-[transform,background] duration-300 hover:-translate-y-0.5 hover:bg-g600 disabled:opacity-60">
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
