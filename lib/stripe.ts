import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

// Lazy: non vogliamo che il modulo crashi al build se la chiave non è
// settata (es. in fase di sviluppo iniziale). Esplode solo quando si
// usa davvero, con un errore chiaro.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY non impostata. Configurala su Vercel (test: sk_test_…).",
    );
  }
  _stripe = new Stripe(key, {
    // Non blocchiamo l'apiVersion: Stripe SDK usa la default associata
    // alla versione SDK (più sicuro per non perdere campi nuovi).
    typescript: true,
  });
  return _stripe;
}

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Stripe usa centesimi → utilità per evitare errori di unità.
export function toStripeAmount(centesimi: number): number {
  return Math.round(centesimi);
}
