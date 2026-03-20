-- ConvertIQ Database Schema
-- Run this in the Supabase SQL editor

create extension if not exists "uuid-ossp";

-- Audits table (user_id nullable for free/anonymous audits)
create table public.audits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  url text not null,
  email text,
  audit_type text not null default 'free' check (audit_type in ('free', 'full')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  scraped_data jsonb,
  results jsonb,
  overall_score integer,
  error_message text,
  share_token text unique,
  expires_at timestamptz not null default (now() + interval '90 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Credits table
create table public.credits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  balance integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Credit transactions table (payment log)
create table public.credit_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  type text not null default 'purchase' check (type in ('purchase', 'deduction', 'refund')),
  source text,
  order_id text,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_credit_transactions_user_id on public.credit_transactions(user_id);
create index idx_audits_email on public.audits(email);
create index idx_audits_user_id on public.audits(user_id);
create index idx_audits_share_token on public.audits(share_token);
create index idx_credits_user_id on public.credits(user_id);

-- Row Level Security
alter table public.audits enable row level security;
alter table public.credits enable row level security;

-- Anyone can create audits (free taster)
create policy "Anyone can create audits" on public.audits
  for insert with check (true);

-- Audits readable by ID (tighten in Phase 2)
create policy "Audits readable by id" on public.audits
  for select using (true);

-- Users see own credits
create policy "Users see own credits" on public.credits
  for select using (user_id = auth.uid());

-- Service role manages credits
create policy "Service can manage credits" on public.credits
  for all using (true);

-- Credit transactions RLS
alter table public.credit_transactions enable row level security;

create policy "Users see own transactions" on public.credit_transactions
  for select using (user_id = auth.uid());

create policy "Service can manage transactions" on public.credit_transactions
  for all using (true);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger audits_updated_at before update on public.audits
  for each row execute function update_updated_at();

create trigger credits_updated_at before update on public.credits
  for each row execute function update_updated_at();
