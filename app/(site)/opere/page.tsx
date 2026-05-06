import type { Metadata } from 'next'
import { getOpere } from '@/lib/supabase/db'
import GalleriaClient from '@/components/galleria/GalleriaClient'

export const metadata: Metadata = {
  title: 'Galleria | Salvo Moncada',
  description: 'Sfoglia tutte le tegole dipinte di Salvo Moncada. Scene di vita siciliana dipinte a mano su maiolica.',
}

export const dynamic = 'force-dynamic'

export default async function OperePage() {
  const opere = await getOpere().catch(() => [])
  return <GalleriaClient opere={opere} totale={opere.length} />
}
