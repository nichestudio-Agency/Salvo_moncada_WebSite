-- ============================================================
-- TABELLE PRINCIPALI
-- ============================================================

create table if not exists public.opere (
  id              uuid        not null default gen_random_uuid() primary key,
  slug            text        not null unique,
  titolo          text        not null,
  sottotitolo     text        not null default '',
  descrizione     text        not null default '',
  anno            int,
  dimensioni      text        not null default '',
  tecnica         text        not null default '',
  categoria       text        not null default 'paesaggio',
  disponibilita   text        not null default 'disponibile',
  prezzo          int,
  immagini        text[]      not null default '{}',
  in_evidenza     boolean     not null default false,
  visualizzazioni int         not null default 0,
  created_at      timestamptz not null default now()
);

create table if not exists public.ordini (
  id         uuid        not null default gen_random_uuid() primary key,
  nome       text        not null,
  email      text        not null,
  scena      text        not null,
  dimensione text,
  budget     text,
  messaggio  text,
  status     text        not null default 'nuovo',
  created_at timestamptz not null default now()
);

create table if not exists public.messaggi (
  id         uuid        not null default gen_random_uuid() primary key,
  nome       text        not null,
  email      text        not null,
  oggetto    text        not null,
  opera      text,
  messaggio  text        not null,
  letto      boolean     not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.categorie (
  id      uuid    not null default gen_random_uuid() primary key,
  nome    text    not null,
  slug    text    not null unique,
  attiva  boolean not null default true,
  ordine  int     not null default 0
);

-- ============================================================
-- DISABILITA RLS
-- ============================================================

alter table public.opere     disable row level security;
alter table public.ordini    disable row level security;
alter table public.messaggi  disable row level security;
alter table public.categorie disable row level security;

-- ============================================================
-- GRANT SCRITTURA AL RUOLO ANON
-- (necessario anche con RLS disabilitato)
-- ============================================================

grant select, insert, update, delete on public.opere     to anon;
grant select, insert, update, delete on public.ordini    to anon;
grant select, insert, update, delete on public.messaggi  to anon;
grant select, insert, update, delete on public.categorie to anon;

-- ============================================================
-- FUNZIONE VISUALIZZAZIONI
-- ============================================================

create or replace function increment_views(p_slug text)
returns void
language sql
as $$
  update public.opere
  set visualizzazioni = coalesce(visualizzazioni, 0) + 1
  where slug = p_slug;
$$;

-- ============================================================
-- CATEGORIE DEFAULT
-- ============================================================

insert into public.categorie (nome, slug, ordine) values
  ('Paesaggio',      'paesaggio',      1),
  ('Pescheria',      'pescheria',      2),
  ('Fruttivendolo',  'fruttivendolo',  3),
  ('Su commissione', 'personalizzato', 4)
on conflict (slug) do nothing;

-- ============================================================
-- STORAGE
-- ============================================================

insert into storage.buckets (id, name, public)
values ('opere', 'opere', true)
on conflict (id) do nothing;

create policy "Admin upload immagini"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'opere');

create policy "Lettura pubblica immagini"
  on storage.objects for select
  to public
  using (bucket_id = 'opere');
