-- Fix: RLS policies alone aren't enough. Postgres checks table-level
-- GRANTs before it ever evaluates row-level security, and tables created
-- via the SQL editor (unlike ones made in the Supabase table editor) don't
-- automatically get the anon/authenticated grants. Run this in the
-- Supabase SQL editor to fix "permission denied for table ratings/comments".

grant select, insert, update, delete on public.ratings to authenticated;
grant select on public.ratings to anon;
grant select, insert, update, delete on public.ratings to service_role;

grant select, insert, delete on public.comments to authenticated;
grant select on public.comments to anon;
grant select, insert, update, delete on public.comments to service_role;
