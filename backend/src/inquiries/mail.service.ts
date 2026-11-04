import { Injectable, Logger } from "@nestjs/common";
import type { Inquiry } from "./inquiry.entity";

export type MailResult = { status: "sent" } | { status: "skipped" } | { status: "failed"; error: string };

/**
 * Emails each inquiry to the portfolio owner (CONTACT_TO) through Resend, with the visitor's address as
 * reply-to so answering in the mailbox answers the visitor. Same env names the site already used:
 * RESEND_API_KEY, CONTACT_FROM, CONTACT_TO. Never throws: the inquiry is already saved before this runs.
 */
@Injectable()
export class MailService {
  private readonly log = new Logger(MailService.name);

  async notifyOwner(i: Inquiry): Promise<MailResult> {
    const key = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO;
    if (!key || !to) return { status: "skipped" };

    const hire = i.kind === "hire";
    const subject = hire ? `[Hire request] ${i.service ?? i.field} — ${i.name}` : `[Message] ${i.name}`;
    const text = [
      hire ? `${i.name} wants to hire you as: ${i.service ?? i.field}` : `${i.name} sent you a message`,
      "",
      i.message,
      "",
      `Name: ${i.name}`,
      i.email ? `Email: ${i.email}` : "",
      i.phone ? `Phone: ${i.phone}` : "",
      `Field: ${i.field}`,
      `Received: ${i.createdAt.toISOString()}`,
    ].filter((l, n, a) => l !== "" || a[n - 1] !== "").join("\n");

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
          to: [to],
          ...(i.email && { reply_to: i.email }),
          subject,
          text,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`Resend answered ${res.status}: ${(await res.text()).slice(0, 200)}`);
      return { status: "sent" };
    } catch (e) {
      const error = (e as Error).message;
      this.log.warn(`Email for inquiry ${i.id} failed: ${error}`);
      return { status: "failed", error };
    }
  }
}
