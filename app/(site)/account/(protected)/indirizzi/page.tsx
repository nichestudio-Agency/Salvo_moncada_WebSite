import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getIndirizzi } from "@/lib/supabase/db";
import { deleteAddressAction } from "@/lib/actions";

export const metadata: Metadata = { title: "Indirizzi | Salvo Moncada" };
export const dynamic = "force-dynamic";

const tipoLabel: Record<string, string> = {
  spedizione: "Spedizione",
  fatturazione: "Fatturazione",
  entrambi: "Spedizione · Fatturazione",
};

export default async function IndirizziPage() {
  const { id } = await requireUser();
  const indirizzi = await getIndirizzi(id);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <h2 className="font-display text-2xl font-semibold text-ink">Indirizzi</h2>
        <Link
          href="/account/indirizzi/nuovo"
          className="rounded-full bg-coral px-5 py-2 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-cream shadow-[0_6px_16px_rgba(212,82,42,0.2)] transition hover:-translate-y-0.5"
        >
          + Aggiungi indirizzo
        </Link>
      </div>

      {indirizzi.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 bg-ivory/50 p-10 text-center">
          <p className="font-body text-sm text-stone">
            Non hai ancora salvato nessun indirizzo.
          </p>
          <Link
            href="/account/indirizzi/nuovo"
            className="mt-4 inline-block font-sans text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-coral underline-offset-4 hover:underline"
          >
            Aggiungi il primo →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {indirizzi.map((ind) => (
            <div key={ind.id} className="flex flex-col gap-3 rounded-2xl border border-black/8 bg-ivory p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold text-ink">{ind.etichetta}</p>
                  <p className="mt-0.5 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-terracotta">
                    {tipoLabel[ind.tipo] ?? ind.tipo}
                  </p>
                </div>
                {ind.predefinito && (
                  <span className="inline-block rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    Predefinito
                  </span>
                )}
              </div>

              <div className="font-body text-sm text-ink/85 leading-relaxed">
                <p>{ind.destinatario}</p>
                <p>{ind.via} {ind.civico}</p>
                <p>{ind.cap} {ind.citta} {ind.provincia && `(${ind.provincia})`}</p>
                <p className="text-stone/80">{ind.paese}</p>
                {ind.telefono && <p className="text-stone/80">Tel: {ind.telefono}</p>}
              </div>

              <div className="mt-auto flex gap-3 pt-1">
                <Link
                  href={`/account/indirizzi/${ind.id}`}
                  className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-coral underline-offset-4 hover:underline"
                >
                  Modifica
                </Link>
                <form action={deleteAddressAction.bind(null, ind.id)}>
                  <button
                    type="submit"
                    className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-rose-600/80 underline-offset-4 hover:text-rose-700 hover:underline"
                  >
                    Elimina
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
