import { supabase } from './client'
import type { Opera, Ordine, OrdineStatus, Messaggio, Categoria } from '@/types/db'

// ── Opere ────────────────────────────────────────────────────────────────────

export async function getOpere(): Promise<Opera[]> {
  const { data, error } = await supabase
    .from('opere')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getOperaBySlug(slug: string): Promise<Opera | null> {
  const { data } = await supabase
    .from('opere')
    .select('*')
    .eq('slug', slug)
    .single()
  return data ?? null
}

export async function getOpereInEvidenza(): Promise<Opera[]> {
  const { data } = await supabase
    .from('opere')
    .select('*')
    .eq('in_evidenza', true)
    .order('created_at', { ascending: false })
    .limit(6)
  return data ?? []
}

export async function insertOpera(opera: Omit<Opera, 'id' | 'created_at' | 'visualizzazioni'>): Promise<void> {
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
