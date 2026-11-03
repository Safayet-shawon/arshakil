"use client";
import { useState, type FormEvent } from "react";

const field = "w-full rounded-xl border border-g300 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(247,181,0,0.2)]";

export default function Login() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setBusy(true); setError("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ user: d.get("user"), pass: d.get("pass") }) });
    if (res.ok) location.reload();
    else { setError((await res.json()).error ?? "Could not sign in"); setBusy(false); }
  }

  return (
    <section className="grid min-h-[100svh] place-items-center bg-g200 px-5 pt-24">
      <form onSubmit={submit} className="grid w-full max-w-[380px] gap-3 rounded-2xl bg-paper p-8 shadow-[0_24px_50px_rgba(77,79,83,0.14)]">
        <div className="label text-accent-d">Admin</div>
        <h1 className="font-display text-4xl text-ink">Sign in</h1>
        <input name="user" required autoComplete="username" placeholder="User name" aria-label="User name" className={field} />
        <input name="pass" type="password" required autoComplete="current-password" placeholder="Password" aria-label="Password" className={field} />
        {error && <p role="alert" className="text-xs text-g600">{error}</p>}
        <button disabled={busy} data-link className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-paper hover:bg-g600 disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </section>
  );
}
