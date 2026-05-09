"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/actions";
import type { Profilo } from "@/types/db";

const inputClass =
  "w-full rounded-md border border-black/12 bg-cream/50 px-3 py-2.5 font-body text-sm text-ink outline-none transition focus:border-coral focus:bg-ivory focus:ring-1 focus:ring-coral/30";
const labelClass =
  "mb-1 block font-sans text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-stone/70";
const sectionClass = "mb-1 font-display text-base font-semibold text-ink";
const sectionHintClass = "mb-3 font-body text-[0.78rem] text-stone/70";

export default function ProfileForm({ profilo }: { profilo: Profilo }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {/* ── Dati personali ── */}
      <section>
        <p className={sectionClass}>Dati personali</p>
        <p className={sectionHintClass}>Come vuoi essere chiamato e come ti contattiamo.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nome" className={labelClass}>Nome *</label>
            <input id="nome" name="nome" required defaultValue={profilo.nome} className={inputClass} />
          </div>
          <div>
            <label htmlFor="cognome" className={labelClass}>Cognome</label>
            <input id="cognome" name="cognome" defaultValue={profilo.cognome} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="telefono" className={labelClass}>Telefono</label>
            <input id="telefono" name="telefono" type="tel" defaultValue={profilo.telefono} className={inputClass} />
          </div>
        </div>
      </section>

      {/* ── Fatturazione ── */}
      <section>
        <p className={sectionClass}>Dati fatturazione</p>
        <p className={sectionHintClass}>Compilali se ti serve la fattura. Per i privati basta il codice fiscale.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="codice_fiscale" className={labelClass}>Codice fiscale</label>
            <input id="codice_fiscale" name="codice_fiscale" defaultValue={profilo.codice_fiscale} maxLength={16} className={inputClass} />
          </div>
          <div>
            <label htmlFor="partita_iva" className={labelClass}>Partita IVA</label>
            <input id="partita_iva" name="partita_iva" defaultValue={profilo.partita_iva} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="ragione_sociale" className={labelClass}>Ragione sociale (B2B)</label>
            <input id="ragione_sociale" name="ragione_sociale" defaultValue={profilo.ragione_sociale} className={inputClass} />
          </div>
          <div>
            <label htmlFor="codice_sdi" className={labelClass}>Codice SDI</label>
            <input id="codice_sdi" name="codice_sdi" defaultValue={profilo.codice_sdi} maxLength={7} className={inputClass} />
          </div>
          <div>
            <label htmlFor="pec" className={labelClass}>PEC</label>
            <input id="pec" name="pec" type="email" defaultValue={profilo.pec} className={inputClass} />
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="newsletter"
            defaultChecked={profilo.newsletter}
            className="mt-1 h-4 w-4 cursor-pointer accent-coral"
          />
          <span className="font-body text-sm text-stone">
            Voglio ricevere aggiornamenti sulle nuove opere e iniziative.
          </span>
        </label>
      </section>

      {state?.error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 font-body text-sm text-rose-700">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 font-body text-sm text-emerald-700">Salvato ✓</p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-coral px-7 py-3 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream shadow-[0_8px_20px_rgba(212,82,42,0.25)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Salvataggio…" : "Salva modifiche"}
        </button>
      </div>
    </form>
  );
}
