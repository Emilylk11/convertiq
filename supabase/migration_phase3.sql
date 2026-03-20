-- Phase 3 migration: share tokens + expiry
-- Run this if you already have an audits table from Phase 1/2

alter table public.audits
  add column if not exists share_token text unique,
  add column if not exists expires_at timestamptz not null default (now() + interval '90 days');

create index if not exists idx_audits_share_token on public.audits(share_token);
