"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { sendContact } from "@/lib/api";
import { fieldFromService } from "@/lib/inquiry";
import { useRequestedService } from "@/lib/request";
import { useSite } from "../layout/SiteProvider";
import { cn } from "@/lib/utils";
import CheckMark from "./CheckMark";
import Toast from "./Toast";

type Status = { kind: "idle" | "sending" | "ok" | "error"; message?: string };
/** What the visitor just sent, kept to show them a recap once the form has cleared. */
interface Sent { name: string; email: string; phone: string; service: string; message: string }

const field =
  "w-full rounded-xl border border-g300 bg-paper/80 px-4 py-3 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-g400 focus:border-accent focus:shadow-[0_0_0_3px_rgba(247,181,0,0.2)]";

/** Posts to /api/contact (kept in the admin panel under Inquiries, tagged with its work field). "Hire me as ..." cards pre-select the service. */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const { services } = useSite();
  const [service, setService] = useState("");
  const wanted = useRequestedService();
  useEffect(() => { if (wanted) setService(wanted); }, [wanted]);
  const [sent, setSent] = useState<Sent | null>(null);
  const [toast, setToast] = useState(false);
  const closeToast = useCallback(() => setToast(false), []);

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
      field: service ? fieldFromService(services.find((s) => s.hire === service)?.slug ?? service) : undefined,
      phone: String(data.get("phone") ?? ""),
      website: String(data.get("website") ?? ""),
    });
    setStatus({ kind: res.ok ? "ok" : "error", message: res.message });
    if (res.ok) {
      setSent({ name: String(data.get("name") ?? ""), email: String(data.get("email") ?? "").trim(), phone: String(data.get("phone") ?? "").trim(), service, message: String(data.get("message") ?? "").trim() });
      setToast(true);
      form.reset(); setService("");
    }
  }

  if (sent) {
    return (
      <>
        <SentPanel sent={sent} onAgain={() => { setSent(null); setToast(false); setStatus({ kind: "idle" }); }} />
        <Toast show={toast} onClose={closeToast}>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-ink"><CheckMark size={18} /></span>
          <span><b className="font-bold">Message sent.</b> <span className="text-g300">Thank you, {sent.name.trim().split(/\s+/)[0]}.</span></span>
        </Toast>
      </>
    );
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
      {status.kind === "error" && (
        <p role="alert" className="flex items-start gap-3 rounded-xl border border-accent bg-paper px-4 py-3 text-sm leading-snug text-ink">
          <span aria-hidden className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-ink">!</span>
          {status.message}
        </p>
      )}
      <div className="flex items-center justify-end gap-4">
        <button type="submit" disabled={status.kind === "sending"} data-link
          className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-paper transition-[transform,background] duration-300 hover:-translate-y-0.5 hover:bg-g600 disabled:opacity-60">
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

/** Shown in place of the form once the message is sent: a clear confirmation plus a recap of what was sent. */
function SentPanel({ sent, onAgain }: { sent: Sent; onAgain: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const first = sent.name.trim().split(/\s+/)[0];
  const reach = sent.email ? <>I&apos;ll reply to <b className="text-ink">{sent.email}</b></> : <>I&apos;ll call or message you on <b className="text-ink">{sent.phone}</b></>;
  const excerpt = sent.message.length > 150 ? `${sent.message.slice(0, 150).trimEnd()}…` : sent.message;

  // read out by screen readers, and brought into view if the visitor had scrolled away
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
    const r = ref.current?.getBoundingClientRect();
    if (r && (r.top < 80 || r.bottom > window.innerHeight)) ref.current?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "center" });
  }, [still]);

  return (
    <motion.div ref={ref} tabIndex={-1} role="status" aria-live="polite"
      initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: still ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto mt-10 w-full max-w-[560px] rounded-3xl bg-paper px-6 py-9 text-center shadow-[0_24px_70px_rgba(77,79,83,0.16)] outline-none sm:px-10">
      <div className="relative mx-auto grid h-20 w-20 place-items-center text-accent">
        {/* one soft ring that spreads out as the tick is drawn */}
        <motion.span aria-hidden className="absolute inset-0 rounded-full bg-accent/25"
          initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: [0.6, 1.5], opacity: [0.9, 0] }} transition={{ duration: still ? 0 : 1.2, delay: 0.55, ease: "easeOut" }} />
        <CheckMark size={80} className="relative" />
      </div>
      <h3 className="font-display mt-5 text-[clamp(34px,6vw,52px)] leading-[0.95] text-ink [text-wrap:balance]">Message sent<span className="text-accent">.</span></h3>
      <p className="mx-auto mt-4 max-w-[400px] text-sm leading-[1.7] text-g600">
        Thank you, {first}. Your message is with me and I read every one. {reach} as soon as I can.
      </p>

      <div className="mx-auto mt-6 max-w-[440px] rounded-2xl bg-g50 px-5 py-4 text-left">
        <div className="label text-g500">{sent.service ? `Hire me as ${sent.service}` : "General message"}</div>
        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-g600">&ldquo;{excerpt}&rdquo;</p>
      </div>

      <button onClick={onAgain} data-link
        className="mt-7 rounded-full border-[1.5px] border-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink transition-[transform,background,color] duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-paper">
        Send another message
      </button>
    </motion.div>
  );
}
