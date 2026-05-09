import type { ZonaSpedizione } from "@/types/db";

// Calcola il costo di spedizione in centesimi €.
// Restituisce 0 se il subtotale supera la soglia "gratis_sopra" della zona.
export function calcolaCostoSpedizione(zona: ZonaSpedizione, subtotaleCentesimi: number): number {
  if (zona.gratis_sopra != null && subtotaleCentesimi >= zona.gratis_sopra) return 0;
  return zona.tariffa;
}

// Formatta un valore in centesimi come "€ 123,45".
export function formatEur(centesimi: number): string {
  return (centesimi / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}
