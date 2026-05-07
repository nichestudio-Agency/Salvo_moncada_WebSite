-- ============================================================
-- E-COMMERCE — Schema migration (proposta da rivedere)
-- ============================================================
-- Si applica DOPO schema.sql. Aggiunge:
--   - profili (estensione di auth.users)
--   - indirizzi (rubrica utente)
--   - carrelli + carrelli_items
--   - vendite + vendite_items (ordini d'acquisto reali)
--   - zone_spedizione (tariffe configurabili)
--   - lock inventario su opere (riservata_fino)
--
-- RLS abilitato sulle tabelle con dati personali. Le server
-- actions usano la service_role key (bypassa RLS).
--
-- NOTA: il rename ordini → commissioni viene fatto in una
-- migration successiva, in lockstep col codice TS, per evitare
-- downtime sul pannello admin.
-- ============================================================


-- ============================================================
-- 1. PROFILI (estensione di auth.users)
-- ============================================================
-- Riga creata automaticamente al signup tramite trigger.

create table if not exists public.profili (
  id              uuid        not null primary key references auth.users(id) on delete cascade,
  nome            text        not null default '',
  cognome         text        not null default '',
  telefono        text        not null default '',

  -- Dati per fatturazione (opzionali, riempiti al checkout)
  codice_fiscale  text        not null default '',
  partita_iva     text        not null default '',
  ragione_sociale text        not null default '',
  codice_sdi      text        not null default '',  -- 7 caratteri, fattura elettronica
  pec             text        not null default '',

  newsletter      boolean     not null default false,
  ruolo           text        not null default 'cliente',  -- cliente | admin

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Trigger: alla registrazione di un nuovo auth.users, crea il profilo.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profili (id, nome, cognome)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    coalesce(new.raw_user_meta_data->>'cognome', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================
-- 2. INDIRIZZI (rubrica utente)
-- ============================================================

create table if not exists public.indirizzi (
  id           uuid        not null default gen_random_uuid() primary key,
  profilo_id   uuid        not null references public.profili(id) on delete cascade,

  etichetta    text        not null default 'Casa',  -- "Casa", "Ufficio", ecc.
  destinatario text        not null,
  via          text        not null,
  civico       text        not null default '',
  cap          text        not null,
  citta        text        not null,
  provincia    text        not null default '',
  paese        text        not null default 'IT',   -- ISO 3166-1 alpha-2
  telefono     text        not null default '',

  predefinito  boolean     not null default false,
  tipo         text        not null default 'spedizione',  -- spedizione | fatturazione | entrambi

  created_at   timestamptz not null default now()
);

create index if not exists indirizzi_profilo_idx on public.indirizzi(profilo_id);


-- ============================================================
-- 3. CARRELLI (utenti loggati + ospiti)
-- ============================================================
-- Un utente loggato → 1 carrello (profilo_id univoco).
-- Un ospite → 1 carrello identificato da session_token (cookie).
-- Al login, il carrello ospite viene mergiato in quello dell'utente.

create table if not exists public.carrelli (
  id            uuid        not null default gen_random_uuid() primary key,
  profilo_id    uuid                  references public.profili(id) on delete cascade,
  session_token text,                                  -- per ospiti (cookie)

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- Esattamente uno tra profilo_id e session_token deve essere valorizzato
  constraint carrello_owner_check check (
    (profilo_id is not null and session_token is null) or
    (profilo_id is null and session_token is not null)
  )
);

create unique index if not exists carrelli_profilo_uniq
  on public.carrelli(profilo_id) where profilo_id is not null;

create unique index if not exists carrelli_session_uniq
  on public.carrelli(session_token) where session_token is not null;

create table if not exists public.carrelli_items (
  id          uuid        not null default gen_random_uuid() primary key,
  carrello_id uuid        not null references public.carrelli(id) on delete cascade,
  opera_id    uuid        not null references public.opere(id)    on delete cascade,
  quantita    int         not null default 1 check (quantita > 0),
  prezzo_snapshot int     not null,  -- prezzo al momento dell'aggiunta
  created_at  timestamptz not null default now(),

  -- Una sola riga per opera per carrello (pezzi unici)
  unique (carrello_id, opera_id)
);


-- ============================================================
-- 4. ZONE SPEDIZIONE
-- ============================================================
-- Tariffe configurabili dall'admin. Match per codice paese.

create table if not exists public.zone_spedizione (
  id           uuid        not null default gen_random_uuid() primary key,
  codice       text        not null unique,           -- italia | eu | world
  nome         text        not null,
  paesi        text[]      not null default '{}',     -- codici ISO; '*' = catch-all
  tariffa      int         not null,                  -- centesimi €
  gratis_sopra int,                                   -- centesimi €; null = mai gratis
  attiva       boolean     not null default true,
  ordine       int         not null default 0,
  created_at   timestamptz not null default now()
);

insert into public.zone_spedizione (codice, nome, paesi, tariffa, gratis_sopra, ordine) values
  ('italia', 'Italia',              array['IT'],                                   1500, 30000, 1),
  ('eu',     'Unione Europea',       array['FR','DE','ES','PT','BE','NL','LU','AT','IE','FI','SE','DK','PL','CZ','SK','HU','SI','HR','BG','RO','GR','CY','MT','EE','LV','LT'], 3000, 50000, 2),
  ('world',  'Resto del mondo',      array['*'],                                   6000, null, 3)
on conflict (codice) do nothing;


-- ============================================================
-- 5. VENDITE (ordini d'acquisto reali)
-- ============================================================

create sequence if not exists vendite_numero_seq start 1;

create or replace function public.next_numero_vendita()
returns text
language sql
as $$
  select 'VND-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('vendite_numero_seq')::text, 5, '0');
$$;

create table if not exists public.vendite (
  id              uuid        not null default gen_random_uuid() primary key,
  numero          text        not null unique default public.next_numero_vendita(),

  -- Cliente: profilo_id se loggato, altrimenti dati ospite
  profilo_id      uuid                  references public.profili(id) on delete set null,
  email           text        not null,
  nome            text        not null,
  cognome         text        not null,
  telefono        text        not null default '',

  -- Indirizzi snapshot (jsonb così se l'indirizzo viene poi cancellato/modificato non perdiamo la storia)
  indirizzo_spedizione   jsonb not null,
  indirizzo_fatturazione jsonb not null,

  -- Dati fattura snapshot
  dati_fattura    jsonb       not null default '{}'::jsonb,
  -- esempio: { "codice_fiscale": "...", "partita_iva": "...", "codice_sdi": "...", "pec": "..." }

  -- Importi (centesimi €)
  subtotale       int         not null,
  costo_spedizione int        not null default 0,
  totale          int         not null,
  valuta          text        not null default 'EUR',

  -- Spedizione
  zona_spedizione_id uuid              references public.zone_spedizione(id),
  corriere        text        not null default '',
  tracking_numero text        not null default '',

  -- Stripe
  stripe_session_id        text,
  stripe_payment_intent_id text,
  metodo_pagamento         text not null default '',  -- card | sepa | ...

  -- Stato
  stato           text        not null default 'pending_payment',
  -- pending_payment | paid | shipped | delivered | cancelled | refunded

  note_cliente    text        not null default '',
  note_admin      text        not null default '',

  pagato_il       timestamptz,
  spedito_il      timestamptz,
  consegnato_il   timestamptz,
  cancellato_il   timestamptz,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists vendite_profilo_idx     on public.vendite(profilo_id);
create index if not exists vendite_email_idx       on public.vendite(email);
create index if not exists vendite_stato_idx       on public.vendite(stato);
create index if not exists vendite_stripe_sess_idx on public.vendite(stripe_session_id);

create table if not exists public.vendite_items (
  id             uuid        not null default gen_random_uuid() primary key,
  vendita_id     uuid        not null references public.vendite(id) on delete cascade,
  opera_id       uuid                  references public.opere(id)  on delete set null,

  -- Snapshot opera (sopravvive alle modifiche/cancellazioni)
  opera_slug     text        not null,
  opera_titolo   text        not null,
  opera_immagine text        not null default '',

  prezzo_unitario int        not null,
  quantita        int        not null default 1 check (quantita > 0),
  totale_riga     int        not null,

  created_at     timestamptz not null default now()
);

create index if not exists vendite_items_vendita_idx on public.vendite_items(vendita_id);


-- ============================================================
-- 6. LOCK INVENTARIO su OPERE
-- ============================================================
-- Quando uno avvia il checkout, l'opera viene "bloccata" per
-- N minuti. Se il pagamento va a buon fine → disponibilita = 'venduta'.
-- Se va in timeout → torna disponibile (lato app o cron).

alter table public.opere
  add column if not exists riservata_fino timestamptz,
  add column if not exists riservata_per_vendita_id uuid references public.vendite(id) on delete set null;

create index if not exists opere_riservata_idx on public.opere(riservata_fino) where riservata_fino is not null;


-- ============================================================
-- 7. updated_at TRIGGER
-- ============================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profili_updated_at on public.profili;
create trigger profili_updated_at before update on public.profili
  for each row execute function public.set_updated_at();

drop trigger if exists carrelli_updated_at on public.carrelli;
create trigger carrelli_updated_at before update on public.carrelli
  for each row execute function public.set_updated_at();

drop trigger if exists vendite_updated_at on public.vendite;
create trigger vendite_updated_at before update on public.vendite
  for each row execute function public.set_updated_at();


-- ============================================================
-- 8. RLS (Row Level Security)
-- ============================================================
-- Tutto l'accesso ai dati personali passa via server actions
-- che usano la service_role key (bypassa RLS). Le policy sotto
-- sono per sicurezza: anche se qualcuno usa la anon key, vede
-- solo i propri dati.

alter table public.profili        enable row level security;
alter table public.indirizzi      enable row level security;
alter table public.carrelli       enable row level security;
alter table public.carrelli_items enable row level security;
alter table public.vendite        enable row level security;
alter table public.vendite_items  enable row level security;

-- Profili: l'utente vede e modifica solo il proprio
create policy "profili_self_select" on public.profili for select using (auth.uid() = id);
create policy "profili_self_update" on public.profili for update using (auth.uid() = id);

-- Indirizzi: solo i propri
create policy "indirizzi_self_all" on public.indirizzi for all
  using  (auth.uid() = profilo_id)
  with check (auth.uid() = profilo_id);

-- Carrelli: solo il proprio (loggato). Gli ospiti accedono via server action.
create policy "carrelli_self_all" on public.carrelli for all
  using  (auth.uid() = profilo_id)
  with check (auth.uid() = profilo_id);

create policy "carrelli_items_self_all" on public.carrelli_items for all
  using  (exists (select 1 from public.carrelli c where c.id = carrelli_items.carrello_id and c.profilo_id = auth.uid()))
  with check (exists (select 1 from public.carrelli c where c.id = carrelli_items.carrello_id and c.profilo_id = auth.uid()));

-- Vendite: cliente vede solo le proprie (per profilo o per email se ospite registrato dopo)
create policy "vendite_self_select" on public.vendite for select
  using (auth.uid() = profilo_id);

create policy "vendite_items_self_select" on public.vendite_items for select
  using (exists (select 1 from public.vendite v where v.id = vendite_items.vendita_id and v.profilo_id = auth.uid()));


-- Zone spedizione: lettura pubblica
alter table public.zone_spedizione enable row level security;
create policy "zone_pubbliche" on public.zone_spedizione for select to public using (attiva = true);


-- ============================================================
-- 9. GRANTS al ruolo anon
-- ============================================================
-- Le tabelle e-commerce NON sono accessibili via anon (si passa
-- sempre dalle server actions). Solo zone_spedizione in lettura.

grant select on public.zone_spedizione to anon;

-- Le tabelle pubbliche esistenti (opere, categorie, commissioni,
-- messaggi) mantengono i grants già definiti in schema.sql.
