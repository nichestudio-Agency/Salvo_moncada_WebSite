-- Tabella opere
create table if not exists public.opere (
  id           uuid        not null default gen_random_uuid() primary key,
  slug         text        not null unique,
  titolo       text        not null,
  sottotitolo  text        not null default '',
  descrizione  text        not null default '',
  anno         int,
  dimensioni   text        not null default '',
  tecnica      text        not null default '',
  categoria    text        not null default 'paesaggio',
  disponibilita text       not null default 'disponibile',
  prezzo       int,
  immagini     text[]      not null default '{}',
  in_evidenza  boolean     not null default false,
  created_at   timestamptz not null default now()
);

-- Tabella ordini
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

-- Disabilita RLS (l'auth è gestita dall'app)
alter table public.opere  disable row level security;
alter table public.ordini disable row level security;

-- Bucket pubblico per le immagini
insert into storage.buckets (id, name, public)
values ('opere', 'opere', true)
on conflict (id) do nothing;

-- Policy upload per il pannello admin (usa anon key lato server)
create policy "Admin upload immagini"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'opere');

create policy "Lettura pubblica immagini"
  on storage.objects for select
  to public
  using (bucket_id = 'opere');
