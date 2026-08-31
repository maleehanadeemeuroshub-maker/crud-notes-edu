-- CRUD Notes — Supabase schema
-- Run this once (or re-run after an update — every statement is idempotent) in your
-- project's SQL Editor: https://supabase.com/dashboard -> SQL Editor -> New query.
-- Full names/avatars are stored in auth.users' built-in user metadata, so no separate
-- profiles table is needed for this app.

-- ============================================================================
-- notes
-- ============================================================================
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null default '',
  category text not null default 'other' check (category in ('personal', 'work', 'ideas', 'study', 'other')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  color text not null default 'default' check (color in ('default', 'red', 'amber', 'emerald', 'sky', 'violet', 'pink')),
  tags text[] not null default '{}',
  attachments jsonb not null default '[]'::jsonb,
  pinned boolean not null default false,
  favorite boolean not null default false,
  share_id uuid unique,
  share_enabled boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Adds the sharing columns for anyone who already had the table from before this update.
alter table public.notes add column if not exists share_id uuid unique;
alter table public.notes add column if not exists share_enabled boolean not null default false;

create index if not exists notes_user_id_idx on public.notes (user_id);
create index if not exists notes_user_id_deleted_at_idx on public.notes (user_id, deleted_at);
create index if not exists notes_share_id_idx on public.notes (share_id) where share_id is not null;

alter table public.notes enable row level security;

drop policy if exists "Users can view their own notes" on public.notes;
create policy "Users can view their own notes"
  on public.notes for select
  using (auth.uid() = user_id);

drop policy if exists "Anyone can view a publicly shared note" on public.notes;
create policy "Anyone can view a publicly shared note"
  on public.notes for select
  using (share_enabled = true and deleted_at is null);

drop policy if exists "Users can insert their own notes" on public.notes;
create policy "Users can insert their own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own notes" on public.notes;
create policy "Users can update their own notes"
  on public.notes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own notes" on public.notes;
create policy "Users can delete their own notes"
  on public.notes for delete
  using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
  before update on public.notes
  for each row
  execute function public.set_updated_at();

-- Realtime: let clients subscribe to live INSERT/UPDATE/DELETE on their own notes.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'notes'
  ) then
    alter publication supabase_realtime add table public.notes;
  end if;
end $$;

-- ============================================================================
-- note_versions — a snapshot of title/content is kept every time either changes,
-- powering the "History" panel in the note editor.
-- ============================================================================
create table if not exists public.note_versions (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.notes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists note_versions_note_id_idx on public.note_versions (note_id, created_at desc);

alter table public.note_versions enable row level security;

drop policy if exists "Users can view their own note versions" on public.note_versions;
create policy "Users can view their own note versions"
  on public.note_versions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own note versions" on public.note_versions;
create policy "Users can insert their own note versions"
  on public.note_versions for insert
  with check (auth.uid() = user_id);

create or replace function public.snapshot_note_version()
returns trigger as $$
begin
  if (old.title is distinct from new.title) or (old.content is distinct from new.content) then
    insert into public.note_versions (note_id, user_id, title, content)
    values (old.id, old.user_id, old.title, old.content);
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists notes_snapshot_version on public.notes;
create trigger notes_snapshot_version
  before update on public.notes
  for each row
  execute function public.snapshot_note_version();

-- ============================================================================
-- Storage: user avatars
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
