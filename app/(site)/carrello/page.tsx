import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCart } from "@/lib/cart";
import { removeFromCartAction, clearCartAction } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Carrello | Salvo Moncada",
};

export const dynamic = "force-dynamic";

function formatEur(centesimi: number) {
  return (centesimi / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

export default async function CarrelloPage() {
  const { items, subtotale } = await getCart();

  return (
    <main className="min-h-screen bg-cream pt-32 pb-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="mb-10">
          <p className="mb-2 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.32em] text-terracotta/70">
            Il tuo carrello
          </p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-black leading-[0.9] tracking-[-0.04em] text-ink">
            Carrello
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-ivory p-12 text-center">
            <p className="font-body text-base text-stone">Il carrello è vuoto.</p>
            <Link
              href="/galleria"
              className="mt-5 inline-block rounded-full bg-terracotta px-6 py-2.5 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-cream transition hover:bg-coral"
            >
              Esplora le opere
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Items list */}
            <div className="rounded-2xl border border-black/10 bg-ivory">
              {items.map((item, i) => {
                const opera = item.opera;
                const img = opera?.immagini[0];
                return (
                  <div
                    key={item.id}
                    className={[
                      "flex gap-4 p-4 sm:gap-5 sm:p-5",
                      i < items.length - 1 ? "border-b border-black/5" : "",
                    ].join(" ")}
                  >
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-sand sm:h-28 sm:w-24">
                      {img ? (
                        <Image
                          src={img}
                          alt={opera?.titolo ?? "Opera"}
                          fill
                          sizes="96px"
                          className="object-contain p-2"
                        />
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        {opera ? (
                          <Link
                            href={`/opere/${opera.slug}`}
                            className="font-display text-lg font-semibold text-ink transition hover:text-coral sm:text-xl"
                          >
                            {opera.titolo}
                          </Link>
                        ) : (
                          <p className="font-display text-lg font-semibold text-stone italic">
                            Opera non più disponibile
                          </p>
                        )}
                        {opera?.tecnica && (
                          <p className="mt-0.5 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-terracotta">
                            {opera.tecnica}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                        <p className="font-display text-xl font-semibold text-terracotta">
                          {formatEur(item.prezzo_snapshot * item.quantita)}
                        </p>
                        <form action={removeFromCartAction.bind(null, item.id)}>
                          <button
                            type="submit"
                            className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-stone/70 underline-offset-4 transition hover:text-rose-700 hover:underline"
                          >
                            Rimuovi
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="border-t border-black/5 p-4 sm:p-5 flex justify-end">
                <form action={clearCartAction}>
                  <button
                    type="submit"
                    className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-stone/60 underline-offset-4 transition hover:text-rose-700 hover:underline"
                  >
                    Svuota carrello
                  </button>
                </form>
              </div>
            </div>

            {/* Summary */}
            <aside className="rounded-2xl border border-black/10 bg-ivory p-6 lg:sticky lg:top-28 lg:self-start">
              <p className="mb-4 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-stone/60">
                Riepilogo
              </p>

              <div className="flex justify-between border-b border-black/5 pb-3 font-body text-sm text-ink">
                <span>Subtotale</span>
                <span className="tabular-nums">{formatEur(subtotale)}</span>
              </div>
              <div className="flex justify-between border-b border-black/5 py-3 font-body text-sm text-stone">
                <span>Spedizione</span>
                <span className="text-stone/60 italic">calcolata al checkout</span>
              </div>
              <div className="flex justify-between pt-3 font-display text-xl text-ink">
                <span>Totale</span>
                <span className="tabular-nums text-terracotta">{formatEur(subtotale)}</span>
              </div>

              <button
                type="button"
                disabled
                title="Disponibile a breve"
                className="mt-6 w-full rounded-full bg-terracotta/40 px-6 py-3 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream cursor-not-allowed"
              >
                Procedi al checkout
              </button>
              <p className="mt-2 text-center font-sans text-[0.6rem] text-stone/55">
                Checkout in arrivo nella prossima fase
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
