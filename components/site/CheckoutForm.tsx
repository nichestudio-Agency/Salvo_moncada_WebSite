"use client";

import { useActionState, useState } from "react";
import { createCheckoutSession } from "@/lib/actions";
import type { Indirizzo, ZonaSpedizione } from "@/types/db";

const PAESI_NOMI: Record<string, string> = {
  IT: "Italia", FR: "Francia", DE: "Germania", ES: "Spagna", PT: "Portogallo",
  BE: "Belgio", NL: "Paesi Bassi", LU: "Lussemburgo", AT: "Austria", IE: "Irlanda",
  FI: "Finlandia", SE: "Svezia", DK: "Danimarca", PL: "Polonia", CZ: "Cechia",
  SK: "Slovacchia", HU: "Ungheria", SI: "Slovenia", HR: "Croazia", BG: "Bulgaria",
  RO: "Romania", GR: "Grecia", CY: "Cipro", MT: "Malta", EE: "Estonia",
  LV: "Lettonia", LT: "Lituania", CH: "Svizzera", GB: "Regno Unito",
  US: "Stati Uniti", CA: "Canada",
};

function formatEur(cents: number) {
  return (cents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

export default function CheckoutForm({
  indirizzi,
  zoneSpedizione,
  subtotale,
}: {
  indirizzi: Indirizzo[];
  zoneSpedizione: ZonaSpedizione[];
  subtotale: number; // centesimi
}) {
  const defaultId =
    indirizzi.find((i) => i.predefinito)?.id ?? indirizzi[0]?.id ?? "";
  const [selectedId, setSelectedId] = useState<string>(defaultId);
  const [state, formAction, pending] = useActionState(createCheckoutSession, null);

  const selected = indirizzi.find((i) => i.id === selectedId) ?? null;

  const zona = selected
    ? zoneSpedizione.find((z) => z.paesi.includes(selected.paese))
        ?? zoneSpedizione.find((z) => z.paesi.includes("*"))
        ?? null
    : null;

  const costoSpedizione = zona
    ? (zona.gratis_sopra != null && subtotale >= zona.gratis_sopra ? 0 : zona.tariffa)
    : null;

  const totale = costoSpedizione != null ? subtotale + costoSpedizione : subtotale;

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <input type="hidden" name="indirizzo_id" value={selectedId} />

      {/* ── Indirizzo ── */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold text-ink">Indirizzo di spedizione</h2>

        {indirizzi.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/15 bg-ivory p-6">
            <p className="font-body text-sm text-stone">
              Non hai ancora salvato nessun indirizzo. Aggiungine uno per procedere.
            </p>
            <a
              href="/account/indirizzi/nuovo"
              className="mt-3 inline-block rounded-full bg-coral px-5 py-2 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-cream"
            >
              + Aggiungi indirizzo
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {indirizzi.map((ind) => {
              const active = ind.id === selectedId;
              return (
                <button
                  type="button"
                  key={ind.id}
                  onClick={() => setSelectedId(ind.id)}
                  className={[
                    "rounded-2xl border bg-ivory p-4 text-left transition",
                    active
                      ? "border-coral ring-2 ring-coral/30"
                      : "border-black/10 hover:border-black/25",
                  ].join(" ")}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-display text-base font-semibold text-ink">{ind.etichetta}</p>
                    {ind.predefinito && (
                      <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-sans text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                        Predefinito
                      </span>
                    )}
                  </div>
                  <p className="font-body text-sm text-ink">{ind.destinatario}</p>
                  <p className="font-body text-sm text-stone">{ind.via} {ind.civico}</p>
                  <p className="font-body text-sm text-stone">{ind.cap} {ind.citta} {ind.provincia && `(${ind.provincia})`}</p>
                  <p className="font-body text-xs text-stone/70">{PAESI_NOMI[ind.paese] ?? ind.paese}</p>
                </button>
              );
            })}
            <a
              href="/account/indirizzi/nuovo"
              className="flex items-center justify-center rounded-2xl border border-dashed border-black/15 p-4 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-stone transition hover:border-coral hover:text-coral"
            >
              + Aggiungi nuovo
            </a>
          </div>
        )}

        <div className="mt-2">
          <label htmlFor="note" className="mb-1 block font-sans text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-stone/70">
            Note per Salvo (opzionale)
          </label>
          <textarea
            id="note"
            name="note"
            rows={3}
            placeholder="Richieste particolari sull'imballaggio o sulla consegna…"
            className="w-full rounded-md border border-black/12 bg-cream/50 px-3 py-2.5 font-body text-sm text-ink outline-none transition focus:border-coral focus:bg-ivory focus:ring-1 focus:ring-coral/30"
          />
        </div>
      </div>

      {/* ── Riepilogo ── */}
      <aside className="rounded-2xl border border-black/10 bg-ivory p-6 lg:sticky lg:top-28 lg:self-start">
        <p className="mb-4 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-stone/60">
          Riepilogo
        </p>

        <div className="flex justify-between border-b border-black/5 pb-3 font-body text-sm text-ink">
          <span>Subtotale</span>
          <span className="tabular-nums">{formatEur(subtotale)}</span>
        </div>

        <div className="flex justify-between border-b border-black/5 py-3 font-body text-sm text-ink">
          <span>
            Spedizione
            {zona && <span className="block font-sans text-[0.65rem] text-stone/55">{zona.nome}</span>}
          </span>
          <span className="tabular-nums">
            {costoSpedizione == null ? (
              <span className="text-stone/55 italic">seleziona un indirizzo</span>
            ) : costoSpedizione === 0 ? (
              <span className="text-emerald-700">Gratuita</span>
            ) : (
              formatEur(costoSpedizione)
            )}
          </span>
        </div>

        <div className="flex justify-between pt-3 font-display text-xl text-ink">
          <span>Totale</span>
          <span className="tabular-nums text-terracotta">{formatEur(totale)}</span>
        </div>

        {state?.error && (
          <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 font-body text-sm text-rose-700">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending || indirizzi.length === 0 || !selectedId}
          className="mt-6 w-full rounded-full bg-coral px-6 py-3.5 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream shadow-[0_8px_20px_rgba(212,82,42,0.3)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-coral/40 disabled:hover:translate-y-0"
        >
          {pending ? "Elaboro…" : `Paga ${formatEur(totale)}`}
        </button>

        <p className="mt-3 text-center font-sans text-[0.6rem] text-stone/55">
          Pagamento sicuro tramite Stripe. Carta o Apple Pay.
        </p>
      </aside>
    </form>
  );
}
