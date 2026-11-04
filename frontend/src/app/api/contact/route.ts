import { site } from "@/data/site";
import { addMessage } from "@/lib/server/messages";

/** At most 5 messages per visitor address every 10 minutes. */
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60_000;
const LIMIT = 5;

const clean = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);

/**
 * The contact form: validates, stores the message privately (shown in the admin panel under Messages) and,
 * when RESEND_API_KEY is set, also emails it to CONTACT_TO (or the site email).
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
  const email = clean(body.email, 120);
  const message = clean(body.message, 2000);
  const service = clean(body.service, 80) || undefined;
  if (name.length < 2) return Response.json({ message: "Please enter your name." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return Response.json({ message: "Please enter a valid email address." }, { status: 400 });
  if (message.length < 10) return Response.json({ message: "Please write a little more (at least 10 characters)." }, { status: 400 });

  recent.push(now);
  hits.set(ip, recent);

  try {
    await addMessage({ name, email, message, service });
  } catch {
    return Response.json({ message: `Could not save your message. Please email me at ${site.email}.` }, { status: 500 });
  }

  const key = process.env.RESEND_API_KEY;
  if (key) {
    // best effort: the message is already safe in the admin panel
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO ?? site.email],
        reply_to: email,
        subject: `New message from ${name}${service ? ` (${service})` : ""}`,
        text: `${message}\n\n— ${name} <${email}>`,
      }),
    }).catch(() => {});
  }

  return Response.json({ message: "Thanks, your message was received. I'll reply soon." });
}
