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
