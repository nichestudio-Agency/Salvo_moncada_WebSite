"use server"

import crypto from "crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import {
  insertOpera, updateOpera, deleteOpera,
  uploadImmagine,
  markMessaggioLetto as dbMarkLetto, deleteMessaggio as dbDeleteMessaggio,
  insertCategoria, updateCategoria as dbUpdateCategoria, deleteCategoria as dbDeleteCategoria,
} from "@/lib/supabase/db"
import { isValidImageUrl } from "@/lib/images"
import type { Disponibilita } from "@/types/db"

// silence unused import warning
void isValidImageUrl

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
    // Upload di tutti i file selezionati
    const files = formData.getAll("immagine_files") as File[]
    const uploaded = (
      await Promise.all(
        files.filter((f) => f.size > 0).map((f) => uploadImmagine(f, slug))
      )
    ).filter(Boolean) as string[]

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
      immagini:     uploaded,
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
  revalidatePath("/contatti")
  revalidatePath("/")
  redirect("/admin/prodotti")
}

export async function updateArtwork(
  slug: string,
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    // Immagini esistenti da mantenere + nuovi upload
    const existing = formData.getAll("immagine_existing") as string[]
    const files = formData.getAll("immagine_files") as File[]
    const newUploads = (
      await Promise.all(
        files.filter((f) => f.size > 0).map((f) => uploadImmagine(f, slug))
      )
    ).filter(Boolean) as string[]
    const immagini = [...existing, ...newUploads]

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
      immagini,
      in_evidenza:  formData.get("in_evidenza") === "true",
    })
  } catch (e: unknown) {
    const msg = errMsg(e)
    console.error("[updateArtwork]", msg)
    return { error: `Errore nel salvataggio: ${msg}` }
  }

  revalidatePath("/opere")
  revalidatePath(`/opere/${slug}`)
  revalidatePath("/contatti")
  revalidatePath("/")
  redirect("/admin/prodotti")
}

export async function deleteArtwork(slug: string) {
  await deleteOpera(slug)
  revalidatePath("/opere")
  revalidatePath("/contatti")
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
