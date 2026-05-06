export type SanityImage = {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  hotspot?: { x: number; y: number; width: number; height: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

export type Opera = {
  _id: string
  _type: 'opera'
  titolo: string
  slug: { current: string }
  immaginiPrincipali?: SanityImage[]
  serie?: { _id: string; nome: string; slug: { current: string } }
  anno?: number
  dimensioni?: { larghezza: number; altezza: number }
  tecnica?: string
  numeroPezzo?: string
  descrizione?: unknown
  disponibilita: 'disponibile' | 'venduta' | 'riservata' | 'non_in_vendita'
  prezzo?: number
  inEvidenza?: boolean
  tags?: string[]
}

export type Serie = {
  _id: string
  nome: string
  slug: { current: string }
  descrizione?: unknown
  immagineCopertina?: SanityImage
  ordine?: number
}

export type Artista = {
  _id: string
  nome: string
  fotoHero?: SanityImage
  fotoProfilo?: SanityImage
  tagline?: string
  bio?: unknown
  citazione?: string
  esposizioni?: Array<{ anno: number; titolo: string; luogo: string }>
  fotoStudio?: SanityImage
  email?: string
  instagram?: string
  facebook?: string
}
