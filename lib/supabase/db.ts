import { supabaseAdmin as supabase } from './admin'
import { sanitizeImmagini, sanitizeText, looksCorrupted } from '@/lib/images'
import type { Opera, Messaggio, Categoria } from '@/types/db'

// Normalizza una riga "opere" prima che venga restituita dai getter.
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
