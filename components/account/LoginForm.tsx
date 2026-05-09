"use client";

import { useActionState } from "react";
import { loginUser } from "@/lib/actions";

const inputClass =
  "w-full rounded-md border border-black/12 bg-cream/50 px-3 py-2.5 font-body text-sm text-ink outline-none transition focus:border-coral focus:bg-ivory focus:ring-1 focus:ring-coral/30";

const labelClass =
  "mb-1 block font-sans text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-stone/70";

export default function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginUser, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </div>

      {state?.error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 font-body text-sm text-rose-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-coral px-6 py-3 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream shadow-[0_8px_20px_rgba(212,82,42,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(212,82,42,0.35)] disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Accesso…" : "Accedi"}
      </button>
    </form>
  );
}
