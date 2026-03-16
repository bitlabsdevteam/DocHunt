-- 007: MCP servers table — stores Model Context Protocol server configurations

create table public.mcp_servers (
  id            uuid primary key default gen_random_uuid(),
  name          text unique not null,
  description   text,
  transport     text not null check (transport in ('stdio', 'sse', 'streamable-http')),
  command       text,
  args          text[],
  url           text,
  env           jsonb not null default '{}'::jsonb,
  tools         jsonb not null default '[]'::jsonb,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_mcp_servers_name on public.mcp_servers(name);
create index idx_mcp_servers_active on public.mcp_servers(is_active) where is_active = true;

-- Auto-update updated_at
create trigger set_mcp_servers_updated_at
  before update on public.mcp_servers
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.mcp_servers enable row level security;

-- All authenticated users can read active MCP server configs
create policy "Authenticated users can read MCP servers"
  on public.mcp_servers for select
  to authenticated
  using (true);

-- Writes are done via service_role key from the backend (bypasses RLS)
