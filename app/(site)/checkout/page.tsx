import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCart } from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth";
import { getIndirizzi, getZoneSpedizione } from "@/lib/supabase/db";
import CheckoutForm from "@/components/site/CheckoutForm";

export const metadata: Metadata = { title: "Checkout | Salvo Moncada" };
export const dynamic = "force-dynamic";

function formatEur(cents: number) {
  return (cents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login?next=/checkout");

  const { items, subtotale } = await getCart();
  if (items.length === 0) redirect("/carrello");

  const [indirizzi, zoneSpedizione] = await Promise.all([
    getIndirizzi(user.id),
    getZoneSpedizione(true),
  ]);

  return (
    <main className="min-h-screen bg-cream pt-28 pb-24 lg:pt-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="mb-10">
          <p className="mb-2 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.32em] text-terracotta/70">
            Conferma e paga
          </p>
          <h1 className="font-display text-[clamp(2.4rem,5vw,3.6rem)] font-black leading-[0.95] tracking-[-0.04em] text-ink">
            Checkout
          </h1>
        </div>

        {/* ── Cart items recap ── */}
        <div className="mb-10 rounded-2xl border border-black/10 bg-ivory">
          <p className="border-b border-black/5 px-5 py-3 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-stone/60">
            Le tue opere
          </p>
          {items.map((item, i) => {
            const opera = item.opera;
            const img = opera?.immagini[0];
            return (
              <div
                key={item.id}
                className={[
                  "flex items-center gap-4 px-5 py-4",
                  i < items.length - 1 ? "border-b border-black/5" : "",
                ].join(" ")}
              >
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                  {img && (
                    <Image src={img} alt={opera?.titolo ?? "Opera"} fill sizes="56px" className="object-contain p-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-base font-semibold text-ink truncate">
                    {opera?.titolo ?? "Opera non disponibile"}
                  </p>
                  {opera?.tecnica && (
                    <p className="mt-0.5 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-terracotta/80">
                      {opera.tecnica}
                    </p>
                  )}
                </div>
                <p className="font-display text-base font-semibold text-terracotta tabular-nums">
                  {formatEur(item.prezzo_snapshot * item.quantita)}
                </p>
              </div>
            );
          })}
          <div className="flex items-center justify-between border-t border-black/5 px-5 py-3">
            <Link href="/carrello" className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-stone underline-offset-4 hover:text-coral hover:underline">
              ← Modifica carrello
            </Link>
            <span className="font-display text-base text-ink">
              Subtotale: <span className="font-semibold text-terracotta tabular-nums">{formatEur(subtotale)}</span>
            </span>
          </div>
        </div>

        <CheckoutForm
          indirizzi={indirizzi}
          zoneSpedizione={zoneSpedizione}
          subtotale={subtotale}
        />
      </div>
    </main>
  );
}
