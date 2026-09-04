-- Threaded replies, editing, and liking for comments.
-- Run this whole file in the Supabase SQL editor (after the two earlier
-- migration files in this folder, in filename order).

alter table public.comments
  add column if not exists parent_comment_id uuid references public.comments (id) on delete cascade;

alter table public.comments
  add column if not exists likes_count integer not null default 0;

alter table public.comments
  add column if not exists updated_at timestamptz not null default now();

create index if not exists comments_parent_comment_id_idx on public.comments (parent_comment_id);

-- The first migration only allowed insert/select/delete on comments.
-- Editing your own comment needs an update policy too.
drop policy if exists "users can edit their own comment" on public.comments;
create policy "users can edit their own comment" on public.comments
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant update on public.comments to authenticated;

-- Likes on comments (separate table from post ratings/likes).
create table if not exists public.comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (comment_id, user_id)
);

create index if not exists comment_likes_comment_id_idx on public.comment_likes (comment_id);

alter table public.comment_likes enable row level security;

create policy "comment likes are publicly readable" on public.comment_likes
  for select using (true);

create policy "authenticated users can like a comment" on public.comment_likes
  for insert to authenticated with check (auth.uid() = user_id);

create policy "users can remove their own comment like" on public.comment_likes
  for delete to authenticated using (auth.uid() = user_id);

-- Table-level grants: RLS policies are not enough on their own (this bit
-- me on the previous migration too) - Postgres checks GRANT before it
-- ever looks at RLS.
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
