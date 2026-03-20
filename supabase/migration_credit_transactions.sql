-- Migration: Add credit_transactions table
-- Run this in the Supabase SQL editor

create table if not exists public.credit_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  type text not null default 'purchase' check (type in ('purchase', 'deduction', 'refund')),
  source text,
  order_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_credit_transactions_user_id on public.credit_transactions(user_id);

alter table public.credit_transactions enable row level security;

create policy "Users see own transactions" on public.credit_transactions
  for select using (user_id = auth.uid());

create policy "Service can manage transactions" on public.credit_transactions
  for all using (true);
