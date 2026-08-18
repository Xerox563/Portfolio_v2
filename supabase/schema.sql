-- One-time setup for Supabase (run once in Supabase Dashboard -> SQL Editor)
-- Creates the key/value table the portfolio API uses for content + blogs.

create table if not exists public.portfolio_kv (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_kv enable row level security;

-- Allow everything for the service role (the API uses the service role key).
-- Public anon access is not needed; the site only reads through the API.
create policy "service_role_all"
  on public.portfolio_kv
  for all
  to service_role
  using (true)
  with check (true);

-- Nothing else needs access; anon/authenticated get no rows.
alter table public.portfolio_kv replica identity full;
