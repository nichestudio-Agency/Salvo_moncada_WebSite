import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import {
  getVenditaByStripeSession, updateVendita, getVenditaItems,
  updateOpera, clearCarrello,
} from "@/lib/supabase/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Stripe webhook handler.
// Eventi gestiti:
// - checkout.session.completed → marca vendita come paid, opere come venduta, svuota carrello
// - checkout.session.expired   → vendita cancelled, rilascia inventario
// - charge.refunded            → vendita refunded (manuale per ora)
//
// La firma viene validata con STRIPE_WEBHOOK_SECRET — senza, la richiesta
// viene rifiutata.

async function readRawBody(req: NextRequest): Promise<string> {
  return await req.text();
}

async function rilasciaInventario(venditaId: string) {
  const items = await getVenditaItems(venditaId);
  for (const item of items) {
    await updateOpera(item.opera_slug, {
      disponibilita:            "disponibile",
      riservata_fino:           null,
      riservata_per_vendita_id: null,
    });
  }
}

async function marcaOpereVendute(venditaId: string) {
  const items = await getVenditaItems(venditaId);
  for (const item of items) {
    await updateOpera(item.opera_slug, {
      disponibilita:            "venduta",
      riservata_fino:           null,
      riservata_per_vendita_id: null,
    });
  }
}

export async function POST(request: NextRequest) {
  if (!STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook non configurato" }, { status: 500 });
  }

  const sig = request.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Firma mancante" }, { status: 400 });

  const body = await readRawBody(request);

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `Firma non valida: ${msg}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const vendita = await getVenditaByStripeSession(session.id);
        if (!vendita) {
          console.error(`[stripe webhook] vendita non trovata per session ${session.id}`);
          break;
        }

        // L'indirizzo di spedizione è già stato salvato in vendita prima di
        // creare la sessione Stripe (snapshot da indirizzi DB), quindi qui
        // basta marcare il pagamento come ricevuto.
        await updateVendita(vendita.id, {
          stato:                    "paid",
          stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
          pagato_il:                new Date().toISOString(),
        });

        // Inventario → venduta
        await marcaOpereVendute(vendita.id);

        // Svuota il carrello del cliente
        const carrelloId = session.metadata?.carrello_id;
        if (carrelloId) await clearCarrello(carrelloId).catch(() => {});

        break;
      }

      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const vendita = await getVenditaByStripeSession(session.id);
        if (!vendita) break;

        await updateVendita(vendita.id, {
          stato:         "cancelled",
          cancellato_il: new Date().toISOString(),
        });
        await rilasciaInventario(vendita.id);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        // Trova vendita via payment_intent_id
        const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
        if (!pi) break;
        // (Per ora il refund è gestito manualmente lato admin in Phase 8)
        console.log(`[stripe webhook] refund ricevuto per PI ${pi}`);
        break;
      }

      default:
        // Eventi non gestiti — log soft, non è un errore.
        break;
    }
  } catch (e) {
    console.error("[stripe webhook] errore handling:", e);
    return NextResponse.json({ error: "errore interno" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
