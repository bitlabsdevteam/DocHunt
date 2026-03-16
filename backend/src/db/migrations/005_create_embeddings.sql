-- 005: Embeddings table — pgvector-backed storage for Agentic RAG
-- Uses OpenAI text-embedding-3-small (1536 dimensions).
-- Change to vector(3072) if using text-embedding-3-large.

create extension if not exists vector;

create table public.embeddings (
  id          uuid primary key default gen_random_uuid(),
  content     text not null,
  metadata    jsonb not null default '{}'::jsonb,
  embedding   vector(1536) not null,
  created_at  timestamptz not null default now()
);

-- HNSW index for fast approximate nearest-neighbor search
create index idx_embeddings_vector on public.embeddings
  using hnsw (embedding vector_cosine_ops);

create index idx_embeddings_metadata on public.embeddings using gin(metadata);

-- Row Level Security
alter table public.embeddings enable row level security;

-- Embeddings are read-only for authenticated users; managed by service_role
create policy "Authenticated users can read embeddings"
  on public.embeddings for select
  to authenticated
  using (true);
