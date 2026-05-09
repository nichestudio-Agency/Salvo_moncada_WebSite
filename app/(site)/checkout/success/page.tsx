import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getVenditaByStripeSession, getVenditaItems } from "@/lib/supabase/db";
import { formatEur } from "@/lib/checkout";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Ordine confermato | Salvo Moncada" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ session_id?: string }>;

export default async function SuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const { session_id } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");
  if (!session_id) redirect("/account/ordini");

  const vendita = await getVenditaByStripeSession(session_id);
  if (!vendita || vendita.profilo_id !== user.id) redirect("/account/ordini");

  const items = await getVenditaItems(vendita.id);

  // Stato in bilico: il webhook potrebbe non essere ancora arrivato.
  const inAttesa = vendita.stato === "pending_payment";

  return (
    <main className="min-h-screen bg-cream pt-28 pb-24 lg:pt-32">
      <div className="mx-auto max-w-2xl px-6 lg:px-10">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-cream">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-semibold text-emerald-900">
            {inAttesa ? "Pagamento ricevuto" : "Grazie!"}
          </h1>
          <p className="mt-2 font-body text-sm text-emerald-900/85">
            {inAttesa
              ? "Stiamo ancora confermando il pagamento. Lo stato dell'ordine si aggiornerà tra qualche secondo."
              : "Il tuo ordine è confermato. Riceverai una mail con tutti i dettagli."}
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-black/8 bg-ivory p-6">
          <p className="mb-4 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-stone/60">
            Riepilogo ordine
          </p>

          <p className="font-display text-lg text-ink">{vendita.numero}</p>

          <div className="mt-4 space-y-3 border-b border-black/5 pb-4">
            {items.map((it) => (
              <div key={it.id} className="flex justify-between gap-4">
                <p className="font-body text-sm text-ink">{it.opera_titolo}</p>
                <p className="font-body text-sm text-stone tabular-nums">{formatEur(it.totale_riga)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between font-body text-sm text-stone">
            <span>Subtotale</span>
            <span className="tabular-nums">{formatEur(vendita.subtotale)}</span>
          </div>
          <div className="flex justify-between font-body text-sm text-stone">
            <span>Spedizione</span>
            <span className="tabular-nums">
              {vendita.costo_spedizione === 0 ? "Gratuita" : formatEur(vendita.costo_spedizione)}
            </span>
          </div>
          <div className="mt-2 flex justify-between border-t border-black/5 pt-3 font-display text-xl text-ink">
            <span>Totale</span>
            <span className="tabular-nums text-terracotta">{formatEur(vendita.totale)}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/account/ordini`}
            className="rounded-full bg-coral px-6 py-3 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream"
          >
            Vai ai tuoi ordini →
          </Link>
          <Link
            href="/galleria"
            className="rounded-full border border-black/15 px-6 py-3 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-stone hover:border-black/30 hover:text-ink"
          >
            Continua a esplorare
          </Link>
        </div>
      </div>
    </main>
  );
}
