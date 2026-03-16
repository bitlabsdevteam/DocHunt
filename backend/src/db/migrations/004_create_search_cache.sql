-- 004: Search results cache — caches Perplexity API responses
-- Stores public hospital/clinic data (not user PII).
-- TTL-based expiration via expires_at column.

create table public.search_results_cache (
  id            uuid primary key default gen_random_uuid(),
  query_hash    text unique not null,
  query_params  jsonb not null,
  results       jsonb not null,
  expires_at    timestamptz not null,
  created_at    timestamptz not null default now()
);

create index idx_search_cache_hash on public.search_results_cache(query_hash);
create index idx_search_cache_expires on public.search_results_cache(expires_at);

-- Row Level Security
alter table public.search_results_cache enable row level security;

-- Authenticated users can read non-expired cache entries
create policy "Authenticated users can read cache"
  on public.search_results_cache for select
  to authenticated
  using (expires_at > now());

-- Writes are done via service_role key from the backend (bypasses RLS)
