// ── Tipi catalogo ────────────────────────────────────────────

export type Disponibilita = 'disponibile' | 'venduta' | 'riservata' | 'non_in_vendita'

export type Categoria = {
  id:     string
  nome:   string
  slug:   string
  attiva: boolean
  ordine: number
}

export type Opera = {
  id:              string
  slug:            string
  titolo:          string
  sottotitolo:     string
  descrizione:     string
  anno:            number | null
  dimensioni:      string
  tecnica:         string
  categoria:       string
  disponibilita:   Disponibilita
  prezzo:          number | null
  immagini:        string[]
  in_evidenza:     boolean
  visualizzazioni: number
  created_at:      string
  riservata_fino:           string | null
  riservata_per_vendita_id: string | null
}

export type Messaggio = {
  id:        string
  nome:      string
  email:     string
  oggetto:   string
  opera:     string | null
  messaggio: string
  letto:     boolean
  created_at: string
}
