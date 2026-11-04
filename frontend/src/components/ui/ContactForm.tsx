"use client";
import { useEffect, useState, type FormEvent } from "react";
import { sendContact } from "@/lib/api";
import { useRequestedService } from "@/lib/request";
import { useSite } from "../layout/SiteProvider";
import { cn } from "@/lib/utils";

type Status = { kind: "idle" | "sending" | "ok" | "error"; message?: string };

const field =
  "w-full rounded-xl border border-g300 bg-paper/80 px-4 py-3 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-g400 focus:border-accent focus:shadow-[0_0_0_3px_rgba(247,181,0,0.2)]";

/** Posts to /api/contact (stored in the admin panel under Messages). "Hire me as ..." cards pre-select the service. */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const { services } = useSite();
  const [service, setService] = useState("");
  const wanted = useRequestedService();
  useEffect(() => { if (wanted) setService(wanted); }, [wanted]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!String(data.get("email") ?? "").trim() && !String(data.get("phone") ?? "").trim()) {
      setStatus({ kind: "error", message: "Please give an email address or a phone number so I can reply." });
      return;
    }
    setStatus({ kind: "sending" });
    const res = await sendContact({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      service: service || undefined,
      phone: String(data.get("phone") ?? ""),
      website: String(data.get("website") ?? ""),
    });
    setStatus({ kind: res.ok ? "ok" : "error", message: res.message });
    if (res.ok) { form.reset(); setService(""); }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-10 grid w-full max-w-[560px] gap-3 text-left">
      {/* hidden trap for bots: people never see or fill it */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <select value={service} onChange={(e) => setService(e.target.value)} aria-label="What would you like to hire me for?" className={cn(field, "appearance-none")}>
        <option value="">General message</option>
        {services.map((s) => <option key={s.slug} value={s.hire}>Hire me as {s.hire}</option>)}
      </select>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required minLength={2} maxLength={80} placeholder="Your name" aria-label="Your name" className={field} />
        <input name="email" type="email" maxLength={120} placeholder="Email" aria-label="Email" className={field} />
      </div>
      <input name="phone" type="tel" maxLength={30} placeholder="Phone or WhatsApp (email or phone, either is fine)" aria-label="Phone number" className={field} />
      <textarea name="message" required minLength={10} maxLength={2000} rows={4} aria-label="Message" className={cn(field, "resize-none")}
        placeholder={service ? "Tell me about the project: what you need, where, your budget and timeline" : "Tell me about it"} />
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
