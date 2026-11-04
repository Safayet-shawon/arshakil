"use client";
import { useState, type FormEvent } from "react";

const box = "w-full rounded-xl border border-g300 bg-paper px-4 py-2.5 text-sm text-ink outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(247,181,0,0.2)]";

/** Change the admin user name and password. */
export default function Account() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    if (d.get("pass") !== d.get("again")) { setMsg({ ok: false, text: "The two new passwords are not the same" }); return; }
    setBusy(true); setMsg(null);
    const res = await fetch("/api/admin/account", { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ current: d.get("current"), user: d.get("user"), pass: d.get("pass") }) });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) { form.reset(); setMsg({ ok: true, text: "Saved. Use the new user name and password the next time you sign in." }); }
    else setMsg({ ok: false, text: json.error ?? "Could not save" });
  };

  return (
    <div>
      <h2 className="font-display text-4xl text-ink">Login details</h2>
      <p className="mt-1 max-w-xl text-sm text-g600">Change the user name and password used to sign in to this panel. You need the current password to do it.</p>
      <form onSubmit={submit} className="mt-6 grid max-w-sm gap-4">
        <input name="current" type="password" required autoComplete="current-password" placeholder="Current password" aria-label="Current password" className={box} />
        <input name="user" required minLength={3} maxLength={40} autoComplete="username" placeholder="New user name" aria-label="New user name" className={box} />
        <input name="pass" type="password" required minLength={8} autoComplete="new-password" placeholder="New password (8 or more characters)" aria-label="New password" className={box} />
        <input name="again" type="password" required minLength={8} autoComplete="new-password" placeholder="New password again" aria-label="New password again" className={box} />
        <button disabled={busy} className="justify-self-start rounded-full bg-ink px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-paper hover:bg-g600 disabled:opacity-60">{busy ? "Saving…" : "Save new details"}</button>
        {msg && <p role="status" className={`text-sm ${msg.ok ? "text-ink" : "text-g600"}`}>{msg.text}</p>}
      </form>
    </div>
  );
}
