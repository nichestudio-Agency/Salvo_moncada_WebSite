"use server"

import crypto from "crypto"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import {
  insertOpera, updateOpera, deleteOpera,
  insertOrdine, updateOrdineStatus, deleteOrdine,
  uploadImmagine,
  markMessaggioLetto as dbMarkLetto, deleteMessaggio as dbDeleteMessaggio,
  insertCategoria, updateCategoria as dbUpdateCategoria, deleteCategoria as dbDeleteCategoria,
  getOperaBySlug,
  addCarrelloItem, removeCarrelloItem, clearCarrello,
  updateProfilo as dbUpdateProfilo,
  insertIndirizzo, updateIndirizzo as dbUpdateIndirizzo, deleteIndirizzo as dbDeleteIndirizzo,
  getIndirizzo, getZonaPerPaese, insertVendita, insertVenditaItems, updateVendita, getProfilo,
} from "@/lib/supabase/db"
import { getCart, getOrCreateCart, mergeGuestCartIntoUser } from "@/lib/cart"
import { createServerSupabase } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { getStripe } from "@/lib/stripe"
import { calcolaCostoSpedizione } from "@/lib/checkout"
import { isValidImageUrl } from "@/lib/images"
import type { Disponibilita, TipoIndirizzo } from "@/types/db"

function errMsg(e: unknown): string {
  if (!e) return "Errore sconosciuto"
  if (typeof e === "string") return e
  if (e instanceof Error) return e.message
  const o = e as Record<string, unknown>
  if (typeof o.message === "string") return o.message
  if (typeof o.details === "string") return o.details
  return JSON.stringify(o)
}

// ── Auth ─────────────────────────────────────────────────────────────────────

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "salvo2024"
const COOKIE_NAME    = "admin_session"

function hashPassword(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex")
}

export async function adminLogin(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const password = formData.get("password") as string
  if (!password || hashPassword(password) !== hashPassword(ADMIN_PASSWORD)) {
    return { error: "Password errata" }
  }
  const store = await cookies()
  store.set(COOKIE_NAME, hashPassword(password), {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
  })
  redirect("/admin")
}

export async function adminLogout() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
  redirect("/admin/login")
}

// ── Ordini ───────────────────────────────────────────────────────────────────

export async function createOrder(
  _prev: { success?: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const nome  = (formData.get("nome")  as string)?.trim()
  const email = (formData.get("email") as string)?.trim()
  const scena = (formData.get("scena") as string)?.trim()
  if (!nome || !email || !scena) return { error: "Compila tutti i campi obbligatori." }

  try {
    await insertOrdine({
      nome, email, scena,
      dimensione: (formData.get("dimensione") as string) || null,
      budget:     (formData.get("budget")     as string) || null,
      messaggio:  (formData.get("messaggio")  as string)?.trim() || null,
      status: "nuovo",
    })
    return { success: true }
  } catch {
    return { error: "Errore nel salvataggio. Riprova." }
  }
}

export async function updateOrderStatus(id: string, status: "nuovo" | "in-lavorazione" | "completato") {
  await updateOrdineStatus(id, status)
  revalidatePath("/admin/ordini")
}

export async function deleteOrder(id: string) {
  await deleteOrdine(id)
  revalidatePath("/admin/ordini")
}

// ── Opere ────────────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function createArtwork(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const titolo = (formData.get("titolo") as string)?.trim()
  if (!titolo) return { error: "Il titolo è obbligatorio." }

  const slug = slugify(titolo)

  try {
    // Gestione immagine: upload file oppure URL manuale
    let immagineUrl = (formData.get("immagine_url") as string)?.trim() || ""
    const file = formData.get("immagine_file") as File | null
    if (file && file.size > 0) {
      const uploaded = await uploadImmagine(file, slug)
      if (uploaded) immagineUrl = uploaded
    }

    await insertOpera({
      slug,
      titolo,
      sottotitolo:  (formData.get("sottotitolo") as string)?.trim() ?? "",
      descrizione:  (formData.get("descrizione") as string)?.trim() ?? "",
      anno:         parseInt(formData.get("anno") as string) || null,
      dimensioni:   (formData.get("dimensioni")  as string)?.trim() ?? "",
      tecnica:      (formData.get("tecnica")     as string)?.trim() ?? "",
      categoria:     (formData.get("categoria")    as string) ?? "paesaggio",
      disponibilita: ((formData.get("disponibilita") as string) ?? "disponibile") as Disponibilita,
      prezzo:       (formData.get("prezzo") as string) ? parseInt(formData.get("prezzo") as string) : null,
      immagini:     immagineUrl ? [immagineUrl] : [],
      in_evidenza:  formData.get("in_evidenza") === "true",
    })
  } catch (e: unknown) {
    const msg = errMsg(e)
    console.error("[createArtwork]", msg)
    if (msg.includes("duplicate") || msg.includes("unique")) {
      return { error: "Esiste già un'opera con questo titolo (slug duplicato)." }
    }
    return { error: `Errore nel salvataggio: ${msg}` }
  }

  revalidatePath("/opere")
  revalidatePath("/")
  redirect("/admin/prodotti")
}

export async function updateArtwork(
  slug: string,
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    let immagineUrl = (formData.get("immagine_url") as string)?.trim() || ""
    const file = formData.get("immagine_file") as File | null
    if (file && file.size > 0) {
      const uploaded = await uploadImmagine(file, slug)
      if (uploaded) immagineUrl = uploaded
    }

    await updateOpera(slug, {
      titolo:       (formData.get("titolo")       as string)?.trim(),
      sottotitolo:  (formData.get("sottotitolo")  as string)?.trim() ?? "",
      descrizione:  (formData.get("descrizione")  as string)?.trim() ?? "",
      anno:         parseInt(formData.get("anno") as string) || null,
      dimensioni:   (formData.get("dimensioni")   as string)?.trim() ?? "",
      tecnica:      (formData.get("tecnica")      as string)?.trim() ?? "",
      categoria:    (formData.get("categoria")    as string) ?? "paesaggio",
      disponibilita: ((formData.get("disponibilita") as string) ?? "disponibile") as Disponibilita,
      prezzo:       (formData.get("prezzo") as string) ? parseInt(formData.get("prezzo") as string) : null,
      ...(immagineUrl ? { immagini: [immagineUrl] } : {}),
      in_evidenza:  formData.get("in_evidenza") === "true",
    })
  } catch (e: unknown) {
    const msg = errMsg(e)
    console.error("[updateArtwork]", msg)
    return { error: `Errore nel salvataggio: ${msg}` }
  }

  revalidatePath("/opere")
  revalidatePath(`/opere/${slug}`)
  revalidatePath("/")
  redirect("/admin/prodotti")
}

export async function deleteArtwork(slug: string) {
  await deleteOpera(slug)
  revalidatePath("/opere")
  revalidatePath("/")
  revalidatePath("/admin/prodotti")
}

// Pulisce le immagini di un'opera (azzera l'array). Da usare quando i dati
// stored sono corrotti (es. URL multiple concatenate da bug passati). Dopo
// questo, Salvo deve ricaricare la foto via il form di edit.
export async function resetArtworkImages(slug: string): Promise<void> {
  await updateOpera(slug, { immagini: [] })
  revalidatePath("/opere")
  revalidatePath("/")
  revalidatePath("/admin/prodotti")
}

// ── Messaggi ─────────────────────────────────────────────────────────────────

export async function markMessaggioLetto(id: string, letto: boolean) {
  await dbMarkLetto(id, letto)
  revalidatePath("/admin/messaggi")
}

export async function deleteMessaggio(id: string) {
  await dbDeleteMessaggio(id)
  revalidatePath("/admin/messaggi")
}

// ── Categorie ─────────────────────────────────────────────────────────────────

function slugifyCategoria(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export async function createCategoria(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const nome = (formData.get("nome") as string)?.trim()
  if (!nome) return { error: "Il nome è obbligatorio." }
  const slug = slugifyCategoria(nome)
  try {
    await insertCategoria({ nome, slug, attiva: true, ordine: parseInt(formData.get("ordine") as string) || 0 })
  } catch (e: unknown) {
    const msg = errMsg(e)
    if (msg.includes("unique")) return { error: "Esiste già una categoria con questo nome." }
    return { error: `Errore: ${msg}` }
  }
  revalidatePath("/admin/categorie")
  revalidatePath("/admin/prodotti/nuovo")
  redirect("/admin/categorie")
}

export async function toggleCategoriaAttiva(id: string, attiva: boolean) {
  await dbUpdateCategoria(id, { attiva })
  revalidatePath("/admin/categorie")
}

export async function renameCategoriaAction(id: string, nome: string) {
  const slug = slugifyCategoria(nome)
  await dbUpdateCategoria(id, { nome, slug })
  revalidatePath("/admin/categorie")
  revalidatePath("/admin/prodotti/nuovo")
}

export async function deleteCategoriaAction(id: string) {
  await dbDeleteCategoria(id)
  revalidatePath("/admin/categorie")
  revalidatePath("/admin/prodotti/nuovo")
}

// ── Carrello ─────────────────────────────────────────────────────────────────

export async function addToCart(operaSlug: string): Promise<{ error?: string; success?: boolean }> {
  const opera = await getOperaBySlug(operaSlug)
  if (!opera) return { error: "Opera non trovata." }

  if (opera.disponibilita !== "disponibile") {
    return { error: "Quest'opera non è più disponibile." }
  }
  if (opera.prezzo == null || opera.prezzo <= 0) {
    return { error: "Quest'opera non è in vendita." }
  }

  const { carrello } = await getOrCreateCart()

  try {
    // prezzo nel DB è in euro intero; lo convertiamo in centesimi.
    await addCarrelloItem(carrello.id, opera.id, opera.prezzo * 100)
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore nell'aggiunta al carrello." }
  }

  revalidatePath("/carrello")
  revalidatePath("/")
  return { success: true }
}

export async function removeFromCartAction(itemId: string): Promise<void> {
  const { carrello } = await getOrCreateCart()
  await removeCarrelloItem(itemId, carrello.id)
  revalidatePath("/carrello")
}

export async function clearCartAction(): Promise<void> {
  const { carrello } = await getOrCreateCart()
  await clearCarrello(carrello.id)
  revalidatePath("/carrello")
}

// ── Auth utenti ──────────────────────────────────────────────────────────────

async function getOrigin(): Promise<string> {
  const h = await headers()
  const proto = h.get("x-forwarded-proto") ?? "http"
  const host  = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  return `${proto}://${host}`
}

export async function signupUser(
  _prev: { error?: string; needsConfirm?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; needsConfirm?: boolean }> {
  const email    = (formData.get("email")    as string)?.trim().toLowerCase()
  const password = (formData.get("password") as string) ?? ""
  const nome     = (formData.get("nome")     as string)?.trim() ?? ""
  const cognome  = (formData.get("cognome")  as string)?.trim() ?? ""

  if (!email || !password)        return { error: "Email e password obbligatorie." }
  if (password.length < 8)        return { error: "La password deve avere almeno 8 caratteri." }
  if (!nome)                      return { error: "Inserisci il tuo nome." }

  const supabase = await createServerSupabase()
  const origin = await getOrigin()
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: {
      data: { nome, cognome },
      emailRedirectTo: `${origin}/auth/callback?next=/account`,
    },
  })

  if (error) return { error: error.message }

  // Se la sessione esiste subito, l'email è già confermata o la conferma è disabilitata.
  if (data.session) {
    await mergeGuestCartIntoUser(data.user!.id).catch(() => {})
    redirect("/account")
  }

  return { needsConfirm: true }
}

export async function loginUser(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const email    = (formData.get("email")    as string)?.trim().toLowerCase()
  const password = (formData.get("password") as string) ?? ""
  const next     = (formData.get("next")     as string) || "/account"

  if (!email || !password) return { error: "Email e password obbligatorie." }

  const supabase = await createServerSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: "Credenziali non valide." }

  await mergeGuestCartIntoUser(data.user.id).catch(() => {})
  revalidatePath("/", "layout")
  redirect(next)
}

export async function logoutUser(): Promise<void> {
  const supabase = await createServerSupabase()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

export async function requestPasswordReset(
  _prev: { error?: string; sent?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; sent?: boolean }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  if (!email) return { error: "Inserisci la tua email." }

  const supabase = await createServerSupabase()
  const origin = await getOrigin()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/account/aggiorna-password`,
  })
  if (error) return { error: "Errore nell'invio. Riprova." }
  return { sent: true }
}

export async function updatePasswordAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const password = (formData.get("password") as string) ?? ""
  if (password.length < 8) return { error: "La password deve avere almeno 8 caratteri." }

  const supabase = await createServerSupabase()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }
  return { success: true }
}

// ── Profilo ──────────────────────────────────────────────────────────────────

export async function updateProfileAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const user = await getCurrentUser()
  if (!user) return { error: "Devi essere loggato." }

  try {
    await dbUpdateProfilo(user.id, {
      nome:            (formData.get("nome")            as string)?.trim() ?? "",
      cognome:         (formData.get("cognome")         as string)?.trim() ?? "",
      telefono:        (formData.get("telefono")        as string)?.trim() ?? "",
      codice_fiscale:  (formData.get("codice_fiscale")  as string)?.trim().toUpperCase() ?? "",
      partita_iva:     (formData.get("partita_iva")     as string)?.trim() ?? "",
      ragione_sociale: (formData.get("ragione_sociale") as string)?.trim() ?? "",
      codice_sdi:      (formData.get("codice_sdi")      as string)?.trim().toUpperCase() ?? "",
      pec:             (formData.get("pec")             as string)?.trim().toLowerCase() ?? "",
      newsletter:      formData.get("newsletter") === "on",
    })
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore nel salvataggio." }
  }

  revalidatePath("/account/profilo")
  return { success: true }
}

// ── Indirizzi ────────────────────────────────────────────────────────────────

function parseIndirizzo(formData: FormData) {
  return {
    etichetta:    (formData.get("etichetta")    as string)?.trim() || "Casa",
    destinatario: (formData.get("destinatario") as string)?.trim() ?? "",
    via:          (formData.get("via")          as string)?.trim() ?? "",
    civico:       (formData.get("civico")       as string)?.trim() ?? "",
    cap:          (formData.get("cap")          as string)?.trim() ?? "",
    citta:        (formData.get("citta")        as string)?.trim() ?? "",
    provincia:    (formData.get("provincia")    as string)?.trim().toUpperCase() ?? "",
    paese:        (formData.get("paese")        as string)?.trim().toUpperCase() || "IT",
    telefono:     (formData.get("telefono")     as string)?.trim() ?? "",
    predefinito:  formData.get("predefinito") === "on",
    tipo:         ((formData.get("tipo") as string) ?? "spedizione") as TipoIndirizzo,
  }
}

export async function addAddressAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const user = await getCurrentUser()
  if (!user) return { error: "Devi essere loggato." }

  const indirizzo = parseIndirizzo(formData)
  if (!indirizzo.destinatario || !indirizzo.via || !indirizzo.cap || !indirizzo.citta) {
    return { error: "Compila tutti i campi obbligatori." }
  }

  try {
    await insertIndirizzo({ profilo_id: user.id, ...indirizzo })
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore nel salvataggio." }
  }

  revalidatePath("/account/indirizzi")
  redirect("/account/indirizzi")
}

export async function updateAddressAction(
  id: string,
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const user = await getCurrentUser()
  if (!user) return { error: "Devi essere loggato." }

  const indirizzo = parseIndirizzo(formData)
  try {
    await dbUpdateIndirizzo(id, user.id, indirizzo)
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore nel salvataggio." }
  }

  revalidatePath("/account/indirizzi")
  redirect("/account/indirizzi")
}

export async function deleteAddressAction(id: string): Promise<void> {
  const user = await getCurrentUser()
  if (!user) return
  await dbDeleteIndirizzo(id, user.id)
  revalidatePath("/account/indirizzi")
}

// ── Checkout ─────────────────────────────────────────────────────────────────

export async function createCheckoutSession(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const user = await getCurrentUser()
  if (!user) return { error: "Devi essere loggato per acquistare." }

  const indirizzoId = (formData.get("indirizzo_id") as string)?.trim()
  if (!indirizzoId) return { error: "Seleziona un indirizzo di spedizione." }

  // 1. Indirizzo + carrello + profilo
  const [indirizzo, profilo, cart] = await Promise.all([
    getIndirizzo(indirizzoId, user.id),
    getProfilo(user.id),
    getCart(),
  ])
  if (!indirizzo) return { error: "Indirizzo non valido." }
  if (!profilo)   return { error: "Profilo non trovato." }
  if (cart.items.length === 0) return { error: "Il carrello è vuoto." }

  // 2. Validazione inventario
  for (const item of cart.items) {
    if (!item.opera) return { error: "Un'opera nel carrello non è più disponibile." }
    if (item.opera.disponibilita !== "disponibile") {
      return { error: `"${item.opera.titolo}" non è più disponibile.` }
    }
    if (item.opera.riservata_fino && new Date(item.opera.riservata_fino) > new Date()) {
      return { error: `"${item.opera.titolo}" è in attesa di pagamento da un altro acquirente. Riprova tra 30 minuti.` }
    }
  }

  // 3. Calcolo spedizione
  const zona = await getZonaPerPaese(indirizzo.paese)
  if (!zona) return { error: `Spedizione non disponibile per ${indirizzo.paese}.` }

  const subtotale        = cart.subtotale
  const costoSpedizione  = calcolaCostoSpedizione(zona, subtotale)
  const totale           = subtotale + costoSpedizione

  // 4. Snapshot indirizzo (jsonb)
  const indirizzoSnap = {
    etichetta:    indirizzo.etichetta,
    destinatario: indirizzo.destinatario,
    via:          indirizzo.via,
    civico:       indirizzo.civico,
    cap:          indirizzo.cap,
    citta:        indirizzo.citta,
    provincia:    indirizzo.provincia,
    paese:        indirizzo.paese,
    telefono:     indirizzo.telefono,
    tipo:         indirizzo.tipo,
  }

  const datiFattura = {
    codice_fiscale:  profilo.codice_fiscale,
    partita_iva:     profilo.partita_iva,
    ragione_sociale: profilo.ragione_sociale,
    codice_sdi:      profilo.codice_sdi,
    pec:             profilo.pec,
  }

  // 5. Crea vendita pending
  let vendita
  try {
    vendita = await insertVendita({
      profilo_id:             user.id,
      email:                  user.email,
      nome:                   profilo.nome,
      cognome:                profilo.cognome,
      telefono:               profilo.telefono,
      indirizzo_spedizione:   indirizzoSnap,
      indirizzo_fatturazione: indirizzoSnap,
      dati_fattura:           datiFattura,
      subtotale,
      costo_spedizione:       costoSpedizione,
      totale,
      valuta:                 "EUR",
      zona_spedizione_id:     zona.id,
      corriere:               "",
      tracking_numero:        "",
      stripe_session_id:        null,
      stripe_payment_intent_id: null,
      metodo_pagamento:       "stripe",
      stato:                  "pending_payment",
      note_cliente:           (formData.get("note") as string)?.trim() ?? "",
      note_admin:             "",
      pagato_il:              null,
      spedito_il:             null,
      consegnato_il:          null,
      cancellato_il:          null,
    })
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Impossibile creare l'ordine." }
  }

  // 6. Snapshot delle righe ordine
  await insertVenditaItems(cart.items.map((item) => ({
    vendita_id:      vendita.id,
    opera_id:        item.opera_id,
    opera_slug:      item.opera!.slug,
    opera_titolo:    item.opera!.titolo,
    opera_immagine:  item.opera!.immagini[0] ?? "",
    prezzo_unitario: item.prezzo_snapshot,
    quantita:        item.quantita,
    totale_riga:     item.prezzo_snapshot * item.quantita,
  })))

  // 7. Lock inventario per 30 minuti
  const riservataFino = new Date(Date.now() + 30 * 60 * 1000).toISOString()
  for (const item of cart.items) {
    await updateOpera(item.opera!.slug, {
      disponibilita:            "riservata",
      riservata_fino:           riservataFino,
      riservata_per_vendita_id: vendita.id,
    })
  }

  // 8. Stripe Checkout Session
  const origin = await getOrigin()
  const stripe = getStripe()

  const lineItems = cart.items.map((item) => ({
    price_data: {
      currency: "eur",
      unit_amount: item.prezzo_snapshot,
      product_data: {
        name: item.opera!.titolo,
        description: item.opera!.tecnica || undefined,
        images: item.opera!.immagini.filter(isValidImageUrl).slice(0, 1),
      },
    },
    quantity: item.quantita,
  }))

  let session
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: lineItems,
      shipping_options: [{
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: costoSpedizione, currency: "eur" },
          display_name: `Spedizione ${zona.nome}${costoSpedizione === 0 ? " (gratuita)" : ""}`,
        },
      }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        vendita_id:  vendita.id,
        profilo_id:  user.id,
        carrello_id: cart.carrello?.id ?? "",
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      locale: "it",
    })
  } catch (e) {
    // Stripe non riuscita: rilascia lock inventario e segna vendita cancellata
    for (const item of cart.items) {
      await updateOpera(item.opera!.slug, {
        disponibilita:            "disponibile",
        riservata_fino:           null,
        riservata_per_vendita_id: null,
      })
    }
    await updateVendita(vendita.id, { stato: "cancelled", cancellato_il: new Date().toISOString() })
    return { error: e instanceof Error ? e.message : "Errore Stripe." }
  }

  await updateVendita(vendita.id, { stripe_session_id: session.id })

  if (!session.url) return { error: "Stripe non ha restituito un URL di checkout." }
  redirect(session.url)
}
