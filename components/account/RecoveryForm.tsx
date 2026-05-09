"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/actions";

const inputClass =
  "w-full rounded-md border border-black/12 bg-cream/50 px-3 py-2.5 font-body text-sm text-ink outline-none transition focus:border-coral focus:bg-ivory focus:ring-1 focus:ring-coral/30";
const labelClass =
  "mb-1 block font-sans text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-stone/70";

export default function RecoveryForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, null);

  if (state?.sent) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
        <p className="font-display text-lg text-emerald-800">Email inviata</p>
        <p className="mt-2 font-body text-sm text-emerald-900/80">
          Se l&apos;indirizzo è registrato, riceverai un link per reimpostare la password.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
      </div>

      {state?.error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 font-body text-sm text-rose-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-coral px-6 py-3 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream shadow-[0_8px_20px_rgba(212,82,42,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(212,82,42,0.35)] disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Invio…" : "Invia link di recupero"}
      </button>
    </form>
  );
}
