"use client";

import { useActionState } from "react";
import Link from "next/link";
import { addAddressAction, updateAddressAction } from "@/lib/actions";
import type { Indirizzo } from "@/types/db";

const inputClass =
  "w-full rounded-md border border-black/12 bg-cream/50 px-3 py-2.5 font-body text-sm text-ink outline-none transition focus:border-coral focus:bg-ivory focus:ring-1 focus:ring-coral/30";
const labelClass =
  "mb-1 block font-sans text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-stone/70";

const PAESI: { code: string; name: string }[] = [
  { code: "IT", name: "Italia" },
  { code: "FR", name: "Francia" },
  { code: "DE", name: "Germania" },
  { code: "ES", name: "Spagna" },
  { code: "PT", name: "Portogallo" },
  { code: "BE", name: "Belgio" },
  { code: "NL", name: "Paesi Bassi" },
  { code: "AT", name: "Austria" },
  { code: "CH", name: "Svizzera" },
  { code: "GB", name: "Regno Unito" },
  { code: "US", name: "Stati Uniti" },
  { code: "CA", name: "Canada" },
];

export default function AddressForm({ indirizzo }: { indirizzo?: Indirizzo }) {
  const action = indirizzo
    ? updateAddressAction.bind(null, indirizzo.id)
    : addAddressAction;
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="etichetta" className={labelClass}>Etichetta</label>
          <input id="etichetta" name="etichetta" defaultValue={indirizzo?.etichetta ?? "Casa"} className={inputClass} placeholder="Casa, Ufficio…" />
        </div>
        <div>
          <label htmlFor="tipo" className={labelClass}>Tipo</label>
          <select id="tipo" name="tipo" defaultValue={indirizzo?.tipo ?? "spedizione"} className={inputClass}>
            <option value="spedizione">Spedizione</option>
            <option value="fatturazione">Fatturazione</option>
            <option value="entrambi">Entrambi</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="destinatario" className={labelClass}>Destinatario *</label>
          <input id="destinatario" name="destinatario" required defaultValue={indirizzo?.destinatario ?? ""} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="via" className={labelClass}>Via *</label>
          <input id="via" name="via" required defaultValue={indirizzo?.via ?? ""} className={inputClass} placeholder="Via Roma" />
        </div>
        <div>
          <label htmlFor="civico" className={labelClass}>Numero civico</label>
          <input id="civico" name="civico" defaultValue={indirizzo?.civico ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="cap" className={labelClass}>CAP *</label>
          <input id="cap" name="cap" required defaultValue={indirizzo?.cap ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="citta" className={labelClass}>Città *</label>
          <input id="citta" name="citta" required defaultValue={indirizzo?.citta ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="provincia" className={labelClass}>Provincia</label>
          <input id="provincia" name="provincia" maxLength={2} defaultValue={indirizzo?.provincia ?? ""} className={inputClass} placeholder="CT" />
        </div>
        <div>
          <label htmlFor="paese" className={labelClass}>Paese *</label>
          <select id="paese" name="paese" defaultValue={indirizzo?.paese ?? "IT"} className={inputClass}>
            {PAESI.map((p) => (
              <option key={p.code} value={p.code}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="telefono" className={labelClass}>Telefono</label>
          <input id="telefono" name="telefono" type="tel" defaultValue={indirizzo?.telefono ?? ""} className={inputClass} />
        </div>
      </div>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name="predefinito"
          defaultChecked={indirizzo?.predefinito ?? false}
          className="mt-1 h-4 w-4 cursor-pointer accent-coral"
        />
        <span className="font-body text-sm text-stone">Imposta come predefinito</span>
      </label>

      {state?.error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 font-body text-sm text-rose-700">{state.error}</p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-coral px-7 py-3 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream shadow-[0_8px_20px_rgba(212,82,42,0.25)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Salvataggio…" : indirizzo ? "Salva modifiche" : "Aggiungi indirizzo"}
        </button>
        <Link
          href="/account/indirizzi"
          className="rounded-full border border-black/15 px-7 py-3 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-stone transition hover:border-black/30 hover:text-ink"
        >
          Annulla
        </Link>
      </div>
    </form>
  );
}
