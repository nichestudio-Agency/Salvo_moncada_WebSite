"use server"

import crypto from "crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import {
  insertOpera, updateOpera, deleteOpera, getOpere,
  insertOrdine, updateOrdineStatus, deleteOrdine,
  uploadImmagine,
} from "@/lib/supabase/db"
import type { Categoria, Disponibilita } from "@/types/db"

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

  // Gestione immagine: upload file oppure URL manuale
  let immagineUrl = (formData.get("immagine_url") as string)?.trim() || ""
  const file = formData.get("immagine_file") as File | null
  if (file && file.size > 0) {
    const uploaded = await uploadImmagine(file, slug)
    if (uploaded) immagineUrl = uploaded
  }

  try {
    await insertOpera({
      slug,
      titolo,
      sottotitolo:  (formData.get("sottotitolo") as string)?.trim() ?? "",
      descrizione:  (formData.get("descrizione") as string)?.trim() ?? "",
      anno:         parseInt(formData.get("anno") as string) || null,
      dimensioni:   (formData.get("dimensioni")  as string)?.trim() ?? "",
      tecnica:      (formData.get("tecnica")     as string)?.trim() ?? "",
      categoria:    ((formData.get("categoria") as string) ?? "paesaggio") as Categoria,
      disponibilita: ((formData.get("disponibilita") as string) ?? "disponibile") as Disponibilita,
      prezzo:       (formData.get("prezzo") as string) ? parseInt(formData.get("prezzo") as string) : null,
      immagini:     immagineUrl ? [immagineUrl] : [],
      in_evidenza:  formData.get("in_evidenza") === "true",
    })
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("duplicate")) {
      return { error: "Esiste già un'opera con questo titolo (slug duplicato)." }
    }
    return { error: "Errore nel salvataggio. Riprova." }
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
  let immagineUrl = (formData.get("immagine_url") as string)?.trim() || ""
  const file = formData.get("immagine_file") as File | null
  if (file && file.size > 0) {
    const uploaded = await uploadImmagine(file, slug)
    if (uploaded) immagineUrl = uploaded
  }

  try {
    await updateOpera(slug, {
      titolo:       (formData.get("titolo")       as string)?.trim(),
      sottotitolo:  (formData.get("sottotitolo")  as string)?.trim() ?? "",
      descrizione:  (formData.get("descrizione")  as string)?.trim() ?? "",
      anno:         parseInt(formData.get("anno") as string) || null,
      dimensioni:   (formData.get("dimensioni")   as string)?.trim() ?? "",
      tecnica:      (formData.get("tecnica")      as string)?.trim() ?? "",
      categoria:    ((formData.get("categoria") as string) ?? "paesaggio") as Categoria,
      disponibilita: ((formData.get("disponibilita") as string) ?? "disponibile") as Disponibilita,
      prezzo:       (formData.get("prezzo") as string) ? parseInt(formData.get("prezzo") as string) : null,
      ...(immagineUrl ? { immagini: [immagineUrl] } : {}),
      in_evidenza:  formData.get("in_evidenza") === "true",
    })
  } catch {
    return { error: "Errore nel salvataggio. Riprova." }
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
