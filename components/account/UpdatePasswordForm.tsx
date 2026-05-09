"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updatePasswordAction } from "@/lib/actions";

const inputClass =
  "w-full rounded-md border border-black/12 bg-cream/50 px-3 py-2.5 font-body text-sm text-ink outline-none transition focus:border-coral focus:bg-ivory focus:ring-1 focus:ring-coral/30";
const labelClass =
  "mb-1 block font-sans text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-stone/70";

export default function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState(updatePasswordAction, null);

  if (state?.success) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
        <p className="font-display text-lg text-emerald-800">Password aggiornata</p>
        <Link
          href="/account"
          className="mt-3 inline-block rounded-full bg-coral px-6 py-2.5 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-cream"
        >
          Vai al tuo account →
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="password" className={labelClass}>Nuova password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className={inputClass} />
        <p className="mt-1 font-sans text-[0.65rem] text-stone/55">Almeno 8 caratteri.</p>
      </div>

      {state?.error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 font-body text-sm text-rose-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-coral px-6 py-3 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream shadow-[0_8px_20px_rgba(212,82,42,0.25)] transition disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Aggiorno…" : "Aggiorna password"}
      </button>
    </form>
  );
}
