export type Disponibilita = 'disponibile' | 'venduta' | 'riservata' | 'non_in_vendita'
export type OrdineStatus  = 'nuovo' | 'in-lavorazione' | 'completato'
export type Categoria     = 'pescheria' | 'fruttivendolo' | 'paesaggio' | 'personalizzato'

export type Opera = {
  id:              string
  slug:            string
  titolo:          string
  sottotitolo:     string
  descrizione:     string
  anno:            number | null
  dimensioni:      string
  tecnica:         string
  categoria:       Categoria
  disponibilita:   Disponibilita
  prezzo:          number | null
  immagini:        string[]
  in_evidenza:     boolean
  visualizzazioni: number
  created_at:      string
}

export type Ordine = {
  id:         string
  nome:       string
  email:      string
  scena:      string
  dimensione: string | null
  budget:     string | null
  messaggio:  string | null
  status:     OrdineStatus
  created_at: string
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
