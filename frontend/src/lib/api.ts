import type { ContactPayload } from "@/types";

// The form always posts to this site's own /api/contact. That route forwards to the NestJS API (INQUIRIES_API_URL),
// so the browser never talks to the backend directly (no CORS, and the visitor's IP is passed on for the rate limit).
const API = "/api";

export async function sendContact(payload: ContactPayload): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(`${API}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = Array.isArray(body.message) ? body.message.join(", ") : body.message;
      return { ok: false, message: msg ?? "Something went wrong. Please try again." };
    }
    return { ok: true, message: body.message ?? "Thanks — message received." };
  } catch {
    return { ok: false, message: "Could not reach the server. Please email me directly." };
  }
}
