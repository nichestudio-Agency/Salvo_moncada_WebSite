import { supabaseAdmin as supabase } from './admin'
import { sanitizeImmagini, sanitizeText, looksCorrupted } from '@/lib/images'
import type {
  Opera, Ordine, OrdineStatus, Messaggio, Categoria,
  Profilo, Indirizzo, Carrello, CarrelloItem, ZonaSpedizione, Vendita, VenditaItem,
} from '@/types/db'

export type CarrelloItemConOpera = CarrelloItem & { opera: Opera | null }

// Normalizza una riga "opere" prima che venga restituita dai getter.
// Filtra URL immagine corrotte (concatenazioni residue) E azzera campi
// testo che contengono URL multiple ripetute (corruzione finita per
// sbaglio in titolo/descrizione/sottotitolo/tecnica).
function normalizeOpera<T extends { immagini?: unknown; titolo?: unknown; sottotitolo?: unknown; descrizione?: unknown; tecnica?: unknown; slug?: unknown } | null>(row: T): T {
  if (!row) return row
  const slug = typeof row.slug === 'string' ? row.slug : '?'
  for (const field of ['titolo', 'sottotitolo', 'descrizione', 'tecnica'] as const) {
    if (looksCorrupted(row[field])) {
      console.warn(`[opera/${slug}] campo "${field}" sembra corrotto (URL ripetute), azzerato in lettura`)
    }
  }
  return {
    ...row,
    immagini:    sanitizeImmagini(row.immagini),
    titolo:      sanitizeText(row.titolo),
    sottotitolo: sanitizeText(row.sottotitolo),
    descrizione: sanitizeText(row.descrizione),
    tecnica:     sanitizeText(row.tecnica),
  } as T
}

// ── Opere ────────────────────────────────────────────────────────────────────

export async function getOpere(): Promise<Opera[]> {
  const { data, error } = await supabase
    .from('opere')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(normalizeOpera) as Opera[]
}

export async function getOperaBySlug(slug: string): Promise<Opera | null> {
  const { data } = await supabase
    .from('opere')
    .select('*')
    .eq('slug', slug)
    .single()
  return data ? (normalizeOpera(data) as Opera) : null
}

export async function getOpereInEvidenza(): Promise<Opera[]> {
  const { data } = await supabase
    .from('opere')
    .select('*')
    .eq('in_evidenza', true)
    .order('created_at', { ascending: false })
    .limit(6)
  return (data ?? []).map(normalizeOpera) as Opera[]
}

export async function insertOpera(
  opera: Omit<Opera, 'id' | 'created_at' | 'visualizzazioni' | 'riservata_fino' | 'riservata_per_vendita_id'>
): Promise<void> {
  const { error } = await supabase.from('opere').insert(opera)
  if (error) throw error
}

export async function updateOpera(
  slug: string,
  updates: Partial<Omit<Opera, 'id' | 'created_at' | 'slug' | 'visualizzazioni'>>
): Promise<void> {
  const { error } = await supabase.from('opere').update(updates).eq('slug', slug)
  if (error) throw error
}

export async function deleteOpera(slug: string): Promise<void> {
  const { error } = await supabase.from('opere').delete().eq('slug', slug)
  if (error) throw error
}

export async function incrementViews(slug: string): Promise<void> {
  await supabase.rpc('increment_views', { p_slug: slug })
}

export async function uploadImmagine(file: File, slug: string): Promise<string | null> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${slug}-${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from('opere')
    .upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: true })
  if (error) return null
  const { data } = supabase.storage.from('opere').getPublicUrl(path)
  return data.publicUrl
}

// ── Ordini ───────────────────────────────────────────────────────────────────

export async function getOrdini(): Promise<Ordine[]> {
  const { data, error } = await supabase
    .from('ordini')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function insertOrdine(ordine: Omit<Ordine, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('ordini').insert(ordine)
  if (error) throw error
}

export async function updateOrdineStatus(id: string, status: OrdineStatus): Promise<void> {
  const { error } = await supabase.from('ordini').update({ status }).eq('id', id)
  if (error) throw error
}

export async function deleteOrdine(id: string): Promise<void> {
  const { error } = await supabase.from('ordini').delete().eq('id', id)
  if (error) throw error
}

// ── Messaggi ─────────────────────────────────────────────────────────────────

export async function getMessaggi(): Promise<Messaggio[]> {
  const { data, error } = await supabase
    .from('messaggi')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function insertMessaggio(msg: Omit<Messaggio, 'id' | 'created_at' | 'letto'>): Promise<void> {
  const { error } = await supabase.from('messaggi').insert({ ...msg, letto: false })
  if (error) throw error
}

export async function markMessaggioLetto(id: string, letto: boolean): Promise<void> {
  const { error } = await supabase.from('messaggi').update({ letto }).eq('id', id)
  if (error) throw error
}

export async function deleteMessaggio(id: string): Promise<void> {
  const { error } = await supabase.from('messaggi').delete().eq('id', id)
  if (error) throw error
}

// ── Categorie ─────────────────────────────────────────────────────────────────

export async function getCategorie(soloAttive = false): Promise<Categoria[]> {
  let q = supabase.from('categorie').select('*').order('ordine', { ascending: true })
  if (soloAttive) q = q.eq('attiva', true)
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function insertCategoria(cat: Omit<Categoria, 'id'>): Promise<void> {
  const { error } = await supabase.from('categorie').insert(cat)
  if (error) throw error
}

export async function updateCategoria(id: string, updates: Partial<Omit<Categoria, 'id'>>): Promise<void> {
  const { error } = await supabase.from('categorie').update(updates).eq('id', id)
  if (error) throw error
}

export async function deleteCategoria(id: string): Promise<void> {
  const { error } = await supabase.from('categorie').delete().eq('id', id)
  if (error) throw error
}

// ── Profili ──────────────────────────────────────────────────────────────────

export async function getProfilo(userId: string): Promise<Profilo | null> {
  const { data } = await supabase.from('profili').select('*').eq('id', userId).single()
  return data ?? null
}

export async function updateProfilo(userId: string, updates: Partial<Omit<Profilo, 'id' | 'created_at' | 'updated_at'>>): Promise<void> {
  const { error } = await supabase.from('profili').update(updates).eq('id', userId)
  if (error) throw error
}

// ── Indirizzi ────────────────────────────────────────────────────────────────

export async function getIndirizzi(profiloId: string): Promise<Indirizzo[]> {
  const { data, error } = await supabase
    .from('indirizzi')
    .select('*')
    .eq('profilo_id', profiloId)
    .order('predefinito', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getIndirizzo(id: string, profiloId: string): Promise<Indirizzo | null> {
  const { data } = await supabase
    .from('indirizzi')
    .select('*')
    .eq('id', id)
    .eq('profilo_id', profiloId)
    .single()
  return data ?? null
}

export async function insertIndirizzo(indirizzo: Omit<Indirizzo, 'id' | 'created_at'>): Promise<Indirizzo> {
  if (indirizzo.predefinito) {
    await supabase.from('indirizzi').update({ predefinito: false }).eq('profilo_id', indirizzo.profilo_id)
  }
  const { data, error } = await supabase.from('indirizzi').insert(indirizzo).select('*').single()
  if (error) throw error
  return data
}

export async function updateIndirizzo(id: string, profiloId: string, updates: Partial<Omit<Indirizzo, 'id' | 'profilo_id' | 'created_at'>>): Promise<void> {
  if (updates.predefinito) {
    await supabase.from('indirizzi').update({ predefinito: false }).eq('profilo_id', profiloId)
  }
  const { error } = await supabase.from('indirizzi').update(updates).eq('id', id).eq('profilo_id', profiloId)
  if (error) throw error
}

export async function deleteIndirizzo(id: string, profiloId: string): Promise<void> {
  const { error } = await supabase.from('indirizzi').delete().eq('id', id).eq('profilo_id', profiloId)
  if (error) throw error
}

// ── Zone spedizione ──────────────────────────────────────────────────────────

export async function getZoneSpedizione(soloAttive = true): Promise<ZonaSpedizione[]> {
  let q = supabase.from('zone_spedizione').select('*').order('ordine', { ascending: true })
  if (soloAttive) q = q.eq('attiva', true)
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function getZonaPerPaese(codicePaese: string): Promise<ZonaSpedizione | null> {
  const zone = await getZoneSpedizione(true)
  // Match esatto sul codice paese, altrimenti fallback su '*'
  return zone.find((z) => z.paesi.includes(codicePaese))
      ?? zone.find((z) => z.paesi.includes('*'))
      ?? null
}

export async function updateZonaSpedizione(id: string, updates: Partial<Omit<ZonaSpedizione, 'id' | 'created_at'>>): Promise<void> {
  const { error } = await supabase.from('zone_spedizione').update(updates).eq('id', id)
  if (error) throw error
}

// ── Vendite ──────────────────────────────────────────────────────────────────

export async function getVendite(): Promise<Vendita[]> {
  const { data, error } = await supabase.from('vendite').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getVenditeByProfilo(profiloId: string): Promise<Vendita[]> {
  const { data, error } = await supabase
    .from('vendite')
    .select('*')
    .eq('profilo_id', profiloId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getVenditaById(id: string): Promise<Vendita | null> {
  const { data } = await supabase.from('vendite').select('*').eq('id', id).single()
  return data ?? null
}

export async function getVenditaByStripeSession(sessionId: string): Promise<Vendita | null> {
  const { data } = await supabase.from('vendite').select('*').eq('stripe_session_id', sessionId).single()
  return data ?? null
}

export async function getVenditaItems(venditaId: string): Promise<VenditaItem[]> {
  const { data, error } = await supabase
    .from('vendite_items')
    .select('*')
    .eq('vendita_id', venditaId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function updateVendita(id: string, updates: Partial<Omit<Vendita, 'id' | 'numero' | 'created_at' | 'updated_at'>>): Promise<void> {
  const { error } = await supabase.from('vendite').update(updates).eq('id', id)
  if (error) throw error
}

export async function insertVendita(
  vendita: Omit<Vendita, 'id' | 'numero' | 'created_at' | 'updated_at'>,
): Promise<Vendita> {
  const { data, error } = await supabase.from('vendite').insert(vendita).select('*').single()
  if (error || !data) throw error ?? new Error('Vendita non creata')
  return data as Vendita
}

export async function insertVenditaItems(items: Omit<VenditaItem, 'id' | 'created_at'>[]): Promise<void> {
  if (items.length === 0) return
  const { error } = await supabase.from('vendite_items').insert(items)
  if (error) throw error
}

// ── Carrelli ─────────────────────────────────────────────────────────────────

export async function getCarrelloByProfilo(profiloId: string): Promise<Carrello | null> {
  const { data } = await supabase.from('carrelli').select('*').eq('profilo_id', profiloId).maybeSingle()
  return data ?? null
}

export async function getCarrelloBySession(token: string): Promise<Carrello | null> {
  const { data } = await supabase.from('carrelli').select('*').eq('session_token', token).maybeSingle()
  return data ?? null
}

export async function createCarrelloPerProfilo(profiloId: string): Promise<Carrello> {
  const { data, error } = await supabase.from('carrelli').insert({ profilo_id: profiloId }).select('*').single()
  if (error || !data) throw error ?? new Error('Carrello non creato')
  return data
}

export async function createCarrelloPerSession(token: string): Promise<Carrello> {
  const { data, error } = await supabase.from('carrelli').insert({ session_token: token }).select('*').single()
  if (error || !data) throw error ?? new Error('Carrello non creato')
  return data
}

export async function getCarrelloItems(carrelloId: string): Promise<CarrelloItemConOpera[]> {
  const { data, error } = await supabase
    .from('carrelli_items')
    .select('*, opera:opere(*)')
    .eq('carrello_id', carrelloId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return ((data ?? []) as CarrelloItemConOpera[]).map((row) => ({
    ...row,
    opera: row.opera ? (normalizeOpera(row.opera) as Opera) : null,
  }))
}

export async function addCarrelloItem(carrelloId: string, operaId: string, prezzoSnapshot: number): Promise<void> {
  const { error } = await supabase
    .from('carrelli_items')
    .upsert(
      { carrello_id: carrelloId, opera_id: operaId, prezzo_snapshot: prezzoSnapshot, quantita: 1 },
      { onConflict: 'carrello_id,opera_id', ignoreDuplicates: true },
    )
  if (error) throw error
  await supabase.from('carrelli').update({ updated_at: new Date().toISOString() }).eq('id', carrelloId)
}

export async function removeCarrelloItem(itemId: string, carrelloId: string): Promise<void> {
  const { error } = await supabase.from('carrelli_items').delete().eq('id', itemId).eq('carrello_id', carrelloId)
  if (error) throw error
}

export async function clearCarrello(carrelloId: string): Promise<void> {
  const { error } = await supabase.from('carrelli_items').delete().eq('carrello_id', carrelloId)
  if (error) throw error
}

// Sposta gli item dal carrello ospite al carrello utente, evitando duplicati,
// poi cancella il carrello ospite.
export async function mergeCarrelli(targetCartId: string, sourceCartId: string): Promise<void> {
  if (targetCartId === sourceCartId) return
  const { data: items } = await supabase.from('carrelli_items').select('*').eq('carrello_id', sourceCartId)
  for (const item of items ?? []) {
    await supabase.from('carrelli_items').upsert(
      {
        carrello_id:     targetCartId,
        opera_id:        item.opera_id,
        prezzo_snapshot: item.prezzo_snapshot,
        quantita:        item.quantita,
      },
      { onConflict: 'carrello_id,opera_id', ignoreDuplicates: true },
    )
  }
  await supabase.from('carrelli').delete().eq('id', sourceCartId)
}

// Promuove un carrello ospite a carrello utente: cambia profilo_id + rimuove session_token.
export async function promuoviCarrelloAUtente(cartId: string, profiloId: string): Promise<void> {
  const { error } = await supabase
    .from('carrelli')
    .update({ profilo_id: profiloId, session_token: null })
    .eq('id', cartId)
  if (error) throw error
}
