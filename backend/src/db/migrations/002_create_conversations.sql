-- 002: Conversations table — represents a chat session

create table public.conversations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text,
  status      text not null default 'active'
                check (status in ('active', 'archived')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_conversations_user_id on public.conversations(user_id);
create index idx_conversations_updated on public.conversations(updated_at desc);

-- Auto-update updated_at
create trigger set_conversations_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.conversations enable row level security;

create policy "Users can view own conversations"
  on public.conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert own conversations"
  on public.conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own conversations"
  on public.conversations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
