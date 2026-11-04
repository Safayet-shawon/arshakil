import { site } from "@/data/site";
import { addMessage } from "@/lib/server/messages";

/** At most 5 messages per visitor address every 10 minutes. */
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60_000;
const LIMIT = 5;

const clean = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);

/**
 * The contact form. A message sent after choosing "Hire me as ..." is a hire request; anything else is a general message.
 * It is stored privately (admin panel -> Messages, with a red count of the unread ones) and, when RESEND_API_KEY is set,
 * also emailed to CONTACT_TO with the sender's email as reply-to, so replying in the mailbox answers the visitor.
 */
export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= LIMIT) return Response.json({ message: "Too many messages. Please try again in a few minutes, or email me directly." }, { status: 429 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return Response.json({ message: "Something went wrong. Please try again." }, { status: 400 }); }

  // hidden field only bots fill in: pretend it worked
  if (clean(body.website, 50)) return Response.json({ message: "Thanks, your message was received." });

  const name = clean(body.name, 80);
  const email = clean(body.email, 120) || undefined;
  const phone = clean(body.phone, 30) || undefined;
  const message = clean(body.message, 2000);
  const service = clean(body.service, 80) || undefined;
  if (name.length < 2) return Response.json({ message: "Please enter your name." }, { status: 400 });
  if (!email && !phone) return Response.json({ message: "Please give an email address or a phone number so I can reply." }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return Response.json({ message: "Please enter a valid email address." }, { status: 400 });
  if (phone && !/^\+?[\d\s\-()]{6,}$/.test(phone)) return Response.json({ message: "Please enter a valid phone number." }, { status: 400 });
  if (message.length < 10) return Response.json({ message: "Please write a little more (at least 10 characters)." }, { status: 400 });

  recent.push(now);
  hits.set(ip, recent);

  const kind = service ? "hire" : "general";
  try {
    await addMessage({ kind, name, email, phone, message, service });
  } catch {
    return Response.json({ message: `Could not save your message. Please email me at ${site.email}.` }, { status: 500 });
  }

  const key = process.env.RESEND_API_KEY;
  if (key) {
    // best effort: the message is already safe in the admin panel
    const subject = kind === "hire" ? `[Hire request] ${service} — ${name}` : `[Message] ${name}`;
    const lines = [
      kind === "hire" ? `${name} wants to hire you as: ${service}` : `${name} sent you a message`,
      "",
      message,
      "",
      `Name: ${name}`,
      email ? `Email: ${email}` : "",
      phone ? `Phone: ${phone}` : "",
    ].filter((l, i, a) => l !== "" || a[i - 1] !== "");
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO ?? site.email],
        ...(email && { reply_to: email }),
        subject,
        text: lines.join("\n"),
      }),
    }).catch(() => {});
  }

  return Response.json({ message: "Thanks, your message was received. I'll reply soon." });
}
