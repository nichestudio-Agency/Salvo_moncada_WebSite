import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Pagamento annullato | Salvo Moncada" };

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-cream pt-28 pb-24 lg:pt-32">
      <div className="mx-auto max-w-xl px-6 lg:px-10 text-center">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
          <h1 className="font-display text-3xl font-semibold text-amber-900">
            Pagamento annullato
          </h1>
          <p className="mt-3 font-body text-sm text-amber-900/85">
            Nessun addebito è stato effettuato. Le tue opere sono ancora nel carrello — puoi riprendere quando vuoi.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/carrello"
              className="rounded-full bg-coral px-6 py-3 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream"
            >
              Torna al carrello
            </Link>
            <Link
              href="/galleria"
              className="rounded-full border border-black/15 px-6 py-3 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-stone hover:border-black/30 hover:text-ink"
            >
              Continua a esplorare
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
