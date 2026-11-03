"use client";
import { requestService } from "@/lib/request";

/** Selects a service in the contact form and scrolls down to it. */
export default function RequestButton({ service, label = "Send a request" }: { service: string; label?: string }) {
  return (
    <button data-link onClick={() => { requestService(service); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
      className="inline-flex items-center gap-2.5 rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-paper transition-[transform,background] duration-300 hover:-translate-y-0.5 hover:bg-g600">
      {label} <span aria-hidden>↗</span>
    </button>
  );
}
