import type { ContactPayload } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

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
