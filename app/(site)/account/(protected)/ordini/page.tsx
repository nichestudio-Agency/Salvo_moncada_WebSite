import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getVenditeByProfilo } from "@/lib/supabase/db";

export const metadata: Metadata = { title: "I tuoi ordini | Salvo Moncada" };
export const dynamic = "force-dynamic";

const statoConfig: Record<string, { label: string; classes: string }> = {
  pending_payment: { label: "In attesa di pagamento", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  paid:            { label: "Pagato",                  classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  shipped:         { label: "Spedito",                 classes: "bg-blue-50 text-blue-700 border-blue-200" },
  delivered:       { label: "Consegnato",              classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled:       { label: "Annullato",               classes: "bg-stone-100 text-stone-600 border-stone-200" },
  refunded:        { label: "Rimborsato",              classes: "bg-rose-50 text-rose-700 border-rose-200" },
};

function formatEur(centesimi: number) {
  return (centesimi / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

export default async function OrdiniPage() {
  const { id } = await requireUser();
  const vendite = await getVenditeByProfilo(id);

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-semibold text-ink">I tuoi ordini</h2>

      {vendite.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 bg-ivory/50 p-10 text-center">
          <p className="font-body text-sm text-stone">Non hai ancora effettuato ordini.</p>
          <Link
            href="/galleria"
            className="mt-4 inline-block rounded-full bg-coral px-6 py-2.5 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-cream"
          >
            Esplora le opere
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-black/8 bg-ivory">
          {vendite.map((v, i) => {
            const sc = statoConfig[v.stato] ?? statoConfig.pending_payment;
            return (
              <div
                key={v.id}
                className={[
                  "flex items-center justify-between gap-4 p-4 sm:p-5",
                  i < vendite.length - 1 ? "border-b border-black/5" : "",
                ].join(" ")}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-semibold text-ink">{v.numero}</p>
                  <p className="mt-0.5 font-sans text-[0.7rem] text-stone">
                    {new Date(v.created_at).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                </div>
                <span className={`hidden sm:inline-block rounded-full border px-2.5 py-0.5 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.14em] ${sc.classes}`}>
                  {sc.label}
                </span>
                <p className="font-display text-lg font-semibold text-terracotta tabular-nums">
                  {formatEur(v.totale)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
