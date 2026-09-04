-- Real map coordinates for a post's location (the existing `location`
-- text column keeps the human-readable place name). Just two plain
-- columns on a table that already has working grants/RLS, so nothing
-- else to configure here.

alter table public.posts
  add column if not exists location_lat double precision,
  add column if not exists location_lng double precision;
