-- Two things neither hashtags-with-clickable-authors nor DMs can work
-- without: a public "who is this user" directory, and a messages table.
--
-- Right now usernames/avatars/bios live only in each user's own
-- auth.users metadata, which PostgREST never exposes for anyone but
-- that same logged-in user - there is no way for the app to look up
-- "who is user X" for someone else's post/comment, or to list people
-- to message. This migration adds a public `profiles` table kept in
-- sync with auth.users, plus a `messages` table for direct messages.
--
-- Run this whole file in the Supabase SQL editor.

-- 1. Public profiles ---------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  avatar_url text,
  bio text,
  updated_at timestamptz not null default now()
);

create index if not exists profiles_username_idx on public.profiles (username);

alter table public.profiles enable row level security;

create policy "profiles are publicly readable" on public.profiles
  for select using (true);

create policy "users can update their own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "users can insert their own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

grant select on public.profiles to anon;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

-- Keep it in sync automatically for every new signup.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url, bio)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'bio'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill everyone who signed up before this migration existed.
insert into public.profiles (id, username, avatar_url, bio)
select
  id,
  coalesce(raw_user_meta_data->>'username', raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  raw_user_meta_data->>'avatar_url',
  raw_user_meta_data->>'bio'
from auth.users
on conflict (id) do nothing;

-- 2. Direct messages -----------------------------------------------------

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users (id) on delete cascade,
  receiver_id uuid not null references auth.users (id) on delete cascade,
  content text not null check (char_length(trim(content)) > 0),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists messages_participants_idx on public.messages (sender_id, receiver_id, created_at);
create index if not exists messages_receiver_idx on public.messages (receiver_id, sender_id);

alter table public.messages enable row level security;

create policy "users can read their own conversations" on public.messages
  for select to authenticated using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "users can send messages as themselves" on public.messages
  for insert to authenticated with check (auth.uid() = sender_id);

create policy "receivers can mark messages read" on public.messages
  for update to authenticated
  using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id);

grant select, insert, update on public.messages to authenticated;
grant select, insert, update, delete on public.messages to service_role;

-- Live updates for the chat UI.
alter publication supabase_realtime add table public.messages;
