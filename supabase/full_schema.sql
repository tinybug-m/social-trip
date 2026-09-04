-- ============================================================================
-- Mehrvila — full database schema
-- ============================================================================
-- This is a consolidated, idempotent version of everything under
-- supabase/migrations/. Safe to run on a brand new Supabase project
-- (bootstraps everything from scratch) OR on your existing project
-- (every statement is guarded, so anything already applied is skipped
-- and only what's missing gets created).
--
-- Run this whole file in the Supabase SQL editor, once.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. posts
-- ----------------------------------------------------------------------------

create table if not exists public.posts (
  created_at timestamp with time zone null default now(),
  user_id text null,
  username text null,
  user_image text null,
  media_url text null,
  type text null,
  caption text null,
  likes_count bigint null,
  comments_count bigint null,
  id uuid not null default gen_random_uuid(),
  constraint posts_pkey primary key (id)
);

alter table public.posts
  add column if not exists location text;

alter table public.posts
  add column if not exists location_lat double precision,
  add column if not exists location_lng double precision;

alter table public.posts
  add column if not exists ratings_count integer not null default 0,
  add column if not exists ratings_sum integer not null default 0;

alter table public.posts
  drop column if exists average_rating;

alter table public.posts
  add column average_rating numeric generated always as (
    case when ratings_count = 0 then 0
    else round(ratings_sum::numeric / ratings_count, 2) end
  ) stored;

-- ----------------------------------------------------------------------------
-- 2. ratings (1-5 stars on a post)
-- ----------------------------------------------------------------------------

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create index if not exists ratings_post_id_idx on public.ratings (post_id);
create index if not exists ratings_user_id_idx on public.ratings (user_id);

alter table public.ratings enable row level security;

drop policy if exists "ratings are publicly readable" on public.ratings;
create policy "ratings are publicly readable" on public.ratings
  for select using (true);

drop policy if exists "authenticated users can rate" on public.ratings;
create policy "authenticated users can rate" on public.ratings
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "users can update their own rating" on public.ratings;
create policy "users can update their own rating" on public.ratings
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users can remove their own rating" on public.ratings;
create policy "users can remove their own rating" on public.ratings
  for delete to authenticated using (auth.uid() = user_id);

grant select, insert, update, delete on public.ratings to authenticated;
grant select on public.ratings to anon;
grant select, insert, update, delete on public.ratings to service_role;

create or replace function public.handle_rating_change()
returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    update public.posts
      set ratings_count = ratings_count + 1,
          ratings_sum = ratings_sum + new.rating
      where id = new.post_id;
    return new;
  elsif (tg_op = 'UPDATE') then
    update public.posts
      set ratings_sum = ratings_sum + (new.rating - old.rating)
      where id = new.post_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.posts
      set ratings_count = greatest(ratings_count - 1, 0),
          ratings_sum = ratings_sum - old.rating
      where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_rating_change on public.ratings;
create trigger on_rating_change
  after insert or update or delete on public.ratings
  for each row execute function public.handle_rating_change();

-- ----------------------------------------------------------------------------
-- 3. comments (with one level of replies, editing, and likes)
-- ----------------------------------------------------------------------------

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  username text not null,
  user_image text,
  content text not null check (char_length(trim(content)) > 0),
  created_at timestamptz not null default now()
);

alter table public.comments
  add column if not exists parent_comment_id uuid references public.comments (id) on delete cascade;

alter table public.comments
  add column if not exists likes_count integer not null default 0;

alter table public.comments
  add column if not exists updated_at timestamptz not null default now();

create index if not exists comments_post_id_idx on public.comments (post_id, created_at);
create index if not exists comments_parent_comment_id_idx on public.comments (parent_comment_id);

alter table public.comments enable row level security;

drop policy if exists "comments are publicly readable" on public.comments;
create policy "comments are publicly readable" on public.comments
  for select using (true);

drop policy if exists "authenticated users can comment" on public.comments;
create policy "authenticated users can comment" on public.comments
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "users can edit their own comment" on public.comments;
create policy "users can edit their own comment" on public.comments
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users can delete their own comment" on public.comments;
create policy "users can delete their own comment" on public.comments
  for delete to authenticated using (auth.uid() = user_id);

grant select, insert, update, delete on public.comments to authenticated;
grant select on public.comments to anon;
grant select, insert, update, delete on public.comments to service_role;

create or replace function public.handle_comment_count_change()
returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    update public.posts set comments_count = coalesce(comments_count, 0) + 1 where id = new.post_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.posts set comments_count = greatest(coalesce(comments_count, 0) - 1, 0) where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_comment_change on public.comments;
create trigger on_comment_change
  after insert or delete on public.comments
  for each row execute function public.handle_comment_count_change();

-- ----------------------------------------------------------------------------
-- 4. comment_likes
-- ----------------------------------------------------------------------------

create table if not exists public.comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (comment_id, user_id)
);

create index if not exists comment_likes_comment_id_idx on public.comment_likes (comment_id);

alter table public.comment_likes enable row level security;

drop policy if exists "comment likes are publicly readable" on public.comment_likes;
create policy "comment likes are publicly readable" on public.comment_likes
  for select using (true);

drop policy if exists "authenticated users can like a comment" on public.comment_likes;
create policy "authenticated users can like a comment" on public.comment_likes
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "users can remove their own comment like" on public.comment_likes;
create policy "users can remove their own comment like" on public.comment_likes
  for delete to authenticated using (auth.uid() = user_id);

grant select, insert, delete on public.comment_likes to authenticated;
grant select on public.comment_likes to anon;
grant select, insert, update, delete on public.comment_likes to service_role;

create or replace function public.handle_comment_like_change()
returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    update public.comments set likes_count = likes_count + 1 where id = new.comment_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.comments set likes_count = greatest(likes_count - 1, 0) where id = old.comment_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_comment_like_change on public.comment_likes;
create trigger on_comment_like_change
  after insert or delete on public.comment_likes
  for each row execute function public.handle_comment_like_change();

-- ----------------------------------------------------------------------------
-- 5. profiles (public directory backing @mentions, other-user pages, DMs)
-- ----------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  avatar_url text,
  bio text,
  updated_at timestamptz not null default now()
);

create index if not exists profiles_username_idx on public.profiles (username);

alter table public.profiles enable row level security;

drop policy if exists "profiles are publicly readable" on public.profiles;
create policy "profiles are publicly readable" on public.profiles
  for select using (true);

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "users can insert their own profile" on public.profiles;
create policy "users can insert their own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

grant select on public.profiles to anon;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

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

-- Backfill anyone who signed up before this table existed.
insert into public.profiles (id, username, avatar_url, bio)
select
  id,
  coalesce(raw_user_meta_data->>'username', raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  raw_user_meta_data->>'avatar_url',
  raw_user_meta_data->>'bio'
from auth.users
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- 6. messages (direct messages between two users)
-- ----------------------------------------------------------------------------

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

drop policy if exists "users can read their own conversations" on public.messages;
create policy "users can read their own conversations" on public.messages
  for select to authenticated using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "users can send messages as themselves" on public.messages;
create policy "users can send messages as themselves" on public.messages
  for insert to authenticated with check (auth.uid() = sender_id);

drop policy if exists "receivers can mark messages read" on public.messages;
create policy "receivers can mark messages read" on public.messages
  for update to authenticated
  using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id);

grant select, insert, update on public.messages to authenticated;
grant select, insert, update, delete on public.messages to service_role;

-- Live updates for the chat UI (safe to re-run - skips if already added).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;

-- ============================================================================
-- Done. Everything above is safe to re-run if you're not sure what's applied.
-- ============================================================================
