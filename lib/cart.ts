import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  getCarrelloByProfilo, getCarrelloBySession,
  createCarrelloPerProfilo, createCarrelloPerSession,
  getCarrelloItems, mergeCarrelli, promuoviCarrelloAUtente,
} from "@/lib/supabase/db";
import type { Carrello } from "@/types/db";
import type { CarrelloItemConOpera } from "@/lib/supabase/db";

const SESSION_COOKIE = "cart_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 giorni

export type CartState = {
  carrello:  Carrello | null;
  items:     CarrelloItemConOpera[];
  isGuest:   boolean;
  profiloId: string | null;
  subtotale: number; // centesimi €
};

async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// Risolve il carrello SENZA crearlo (read-only). Usalo nei server components.
// Se non c'è un carrello, restituisce items vuoto.
export async function getCart(): Promise<CartState> {
  const profiloId = await getCurrentUserId();
  let carrello: Carrello | null = null;

  if (profiloId) {
    carrello = await getCarrelloByProfilo(profiloId);
  } else {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (token) carrello = await getCarrelloBySession(token);
  }

  const items = carrello ? await getCarrelloItems(carrello.id) : [];
  const subtotale = items.reduce((s, it) => s + it.prezzo_snapshot * it.quantita, 0);

  return {
    carrello,
    items,
    isGuest: !profiloId,
    profiloId,
    subtotale,
  };
}

// Risolve il carrello, CREANDOLO se non esiste. Usabile solo nei server actions
// (può scrivere il cookie). Se chiamato da un server component andrebbe in errore
// silente sulla scrittura del cookie.
export async function getOrCreateCart(): Promise<{ carrello: Carrello; isGuest: boolean; profiloId: string | null }> {
  const profiloId = await getCurrentUserId();

  if (profiloId) {
    const existing = await getCarrelloByProfilo(profiloId);
    if (existing) return { carrello: existing, isGuest: false, profiloId };
    const created = await createCarrelloPerProfilo(profiloId);
    return { carrello: created, isGuest: false, profiloId };
  }

  const cookieStore = await cookies();
  let token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const existing = await getCarrelloBySession(token);
    if (existing) return { carrello: existing, isGuest: true, profiloId: null };
  } else {
    token = crypto.randomUUID();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
    });
  }

  const created = await createCarrelloPerSession(token);
  return { carrello: created, isGuest: true, profiloId: null };
}

// Merge del carrello ospite (cookie) nel carrello dell'utente loggato.
// Da chiamare DOPO un login/signup riuscito.
export async function mergeGuestCartIntoUser(profiloId: string): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return;

  const guestCart = await getCarrelloBySession(token);
  if (!guestCart) return;

  const userCart = await getCarrelloByProfilo(profiloId);

  if (!userCart) {
    // Nessun carrello utente: promuovi quello ospite.
    await promuoviCarrelloAUtente(guestCart.id, profiloId);
  } else {
    // Esiste già: merge degli item, poi cancella il carrello ospite.
    await mergeCarrelli(userCart.id, guestCart.id);
  }

  cookieStore.delete(SESSION_COOKIE);
}
