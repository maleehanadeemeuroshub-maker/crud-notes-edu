-- CRUD Notes — Supabase schema
-- Run this once in your project's SQL Editor (https://supabase.com/dashboard -> SQL Editor -> New query).
-- Full names are stored in auth.users' built-in user metadata (set at sign-up), so no separate
-- profiles table is needed for this app.

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
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_user_id_idx on public.notes (user_id);
create index if not exists notes_user_id_deleted_at_idx on public.notes (user_id, deleted_at);

-- Row Level Security: every user can only ever see or touch their own notes.
alter table public.notes enable row level security;

drop policy if exists "Users can view their own notes" on public.notes;
create policy "Users can view their own notes"
  on public.notes for select
  using (auth.uid() = user_id);

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

-- Keep updated_at current on every row change, same as an ON UPDATE trigger would in any real backend.
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
