// Validazione URL immagine.
// Difende contro dati corrotti in DB (es. URL multiple concatenate da
// vecchi bug, o stringhe non-URL) che altrimenti finirebbero in src=…
// e farebbero esplodere next/image o renderebbero testo al posto delle foto.

export function isValidImageUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (trimmed.length === 0) return false;

  // Deve iniziare con http:// o https://
  if (!/^https?:\/\//i.test(trimmed)) return false;

  // Deve contenere ESATTAMENTE uno schema (no concatenazioni stile
  // "https://...cohttps://...co"). Cattura sia "://" che "%3A%2F%2F".
  const schemes =
    (trimmed.match(/https?:\/\//gi)?.length ?? 0) +
    (trimmed.match(/https?%3A%2F%2F/gi)?.length ?? 0);
  if (schemes !== 1) return false;

  // Niente caratteri di whitespace dentro l'URL.
  if (/\s/.test(trimmed)) return false;

  // Lunghezza ragionevole (un publicUrl Supabase è ~150-250 caratteri).
  if (trimmed.length > 2048) return false;

  // Deve essere un URL parsabile.
  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
}

// Filtra le immagini scartando i valori non validi.
export function sanitizeImmagini(immagini: unknown): string[] {
  if (!Array.isArray(immagini)) return [];
  return immagini.filter(isValidImageUrl);
}

// Riconosce stringhe che sembrano URL concatenate finite per errore in
// un campo di testo (titolo, sottotitolo, descrizione, tecnica). Esempio
// reale visto in produzione: "dhttps://x.supabase.cohttps://x.supabase.co…"
// con 6 ripetizioni dello stesso host.
//
// Soglia: 2+ "https://" nello stesso valore E almeno il 60% della stringa
// è composta da URL → corruzione, non contenuto legittimo.
export function looksCorrupted(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const matches = value.match(/https?:\/\//gi);
  if (!matches || matches.length < 2) return false;
  const urlPart = (value.match(/https?:\/\/[^\s]+/g) ?? []).join("");
  return urlPart.length >= value.length * 0.6;
}

// Restituisce una stringa pulita: se sembra corrotta, ritorna stringa vuota.
export function sanitizeText(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  if (looksCorrupted(value)) return fallback;
  return value;
}
