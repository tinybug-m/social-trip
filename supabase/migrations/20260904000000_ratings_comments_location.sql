-- Ratings (1-5 stars, replaces the old like concept), comments, and a
-- location field for posts. Run this whole file in the Supabase SQL editor.

-- 1. Location on posts -------------------------------------------------

alter table public.posts
  add column if not exists location text;

-- 2. Ratings -------------------------------------------------------------

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

create policy "ratings are publicly readable" on public.ratings
  for select using (true);

create policy "authenticated users can rate" on public.ratings
  for insert to authenticated with check (auth.uid() = user_id);

create policy "users can update their own rating" on public.ratings
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users can remove their own rating" on public.ratings
  for delete to authenticated using (auth.uid() = user_id);

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

-- 3. Comments --------------------------------------------------------------

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  username text not null,
  user_image text,
  content text not null check (char_length(trim(content)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists comments_post_id_idx on public.comments (post_id, created_at);

alter table public.comments enable row level security;

create policy "comments are publicly readable" on public.comments
  for select using (true);

create policy "authenticated users can comment" on public.comments
  for insert to authenticated with check (auth.uid() = user_id);

create policy "users can delete their own comment" on public.comments
  for delete to authenticated using (auth.uid() = user_id);

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
