// ── Tipi catalogo ────────────────────────────────────────────

export type Disponibilita = 'disponibile' | 'venduta' | 'riservata' | 'non_in_vendita'
export type OrdineStatus  = 'nuovo' | 'in-lavorazione' | 'completato'

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

// "Ordine" qui è la richiesta di commissione custom (da rinominare commissioni)
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


// ── Tipi e-commerce ──────────────────────────────────────────

export type RuoloProfilo = 'cliente' | 'admin'
export type TipoIndirizzo = 'spedizione' | 'fatturazione' | 'entrambi'
export type StatoVendita =
  | 'pending_payment'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type Profilo = {
  id:              string  // = auth.users.id
  nome:            string
  cognome:         string
  telefono:        string
  codice_fiscale:  string
  partita_iva:     string
  ragione_sociale: string
  codice_sdi:      string
  pec:             string
  newsletter:      boolean
  ruolo:           RuoloProfilo
  created_at:      string
  updated_at:      string
}

export type Indirizzo = {
  id:           string
  profilo_id:   string
  etichetta:    string
  destinatario: string
  via:          string
  civico:       string
  cap:          string
  citta:        string
  provincia:    string
  paese:        string  // ISO 3166-1 alpha-2
  telefono:     string
  predefinito:  boolean
  tipo:         TipoIndirizzo
  created_at:   string
}

export type IndirizzoSnapshot = Omit<Indirizzo, 'id' | 'profilo_id' | 'created_at' | 'predefinito'>

export type Carrello = {
  id:            string
  profilo_id:    string | null
  session_token: string | null
  created_at:    string
  updated_at:    string
}

export type CarrelloItem = {
  id:              string
  carrello_id:     string
  opera_id:        string
  quantita:        number
  prezzo_snapshot: number
  created_at:      string
}

export type ZonaSpedizione = {
  id:           string
  codice:       string  // 'italia' | 'eu' | 'world' | …
  nome:         string
  paesi:        string[]  // ['IT'], ['FR','DE',…], ['*']
  tariffa:      number    // centesimi €
  gratis_sopra: number | null
  attiva:       boolean
  ordine:       number
  created_at:   string
}

export type DatiFattura = {
  codice_fiscale?:  string
  partita_iva?:     string
  ragione_sociale?: string
  codice_sdi?:      string
  pec?:             string
}

export type Vendita = {
  id:      string
  numero:  string  // VND-2026-00001

  profilo_id: string | null
  email:      string
  nome:       string
  cognome:    string
  telefono:   string

  indirizzo_spedizione:   IndirizzoSnapshot
  indirizzo_fatturazione: IndirizzoSnapshot
  dati_fattura:           DatiFattura

  subtotale:        number  // centesimi €
  costo_spedizione: number
  totale:           number
  valuta:           string

  zona_spedizione_id: string | null
  corriere:           string
  tracking_numero:    string

  stripe_session_id:        string | null
  stripe_payment_intent_id: string | null
  metodo_pagamento:         string

  stato:        StatoVendita
  note_cliente: string
  note_admin:   string

  pagato_il:     string | null
  spedito_il:    string | null
  consegnato_il: string | null
  cancellato_il: string | null

  created_at: string
  updated_at: string
}

export type VenditaItem = {
  id:              string
  vendita_id:      string
  opera_id:        string | null
  opera_slug:      string
  opera_titolo:    string
  opera_immagine:  string
  prezzo_unitario: number
  quantita:        number
  totale_riga:     number
  created_at:      string
}
