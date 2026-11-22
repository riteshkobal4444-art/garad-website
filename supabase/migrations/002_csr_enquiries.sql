-- =============================================================================
-- Garad Foundation — Corporate CSR Partnership Enquiries Storage
-- Run in Supabase SQL Editor. Protected by RLS: no public read/write access.
-- =============================================================================

create table if not exists public.csr_enquiries (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null unique,
  organisation_name text not null,
  contact_person text not null,
  designation text not null,
  official_email text not null,
  phone_number text not null,
  area_of_interest text not null,
  preferred_project text,
  proposed_funding_range text,
  preferred_geography text,
  message text not null,
  privacy_consent boolean not null default true,
  source_path text not null default '/csr-partnerships',
  notification_email_sent boolean not null default false,
  confirmation_email_sent boolean not null default false,
  submitted_at timestamptz not null default now()
);

create index if not exists idx_csr_enquiries_submitted_at
  on public.csr_enquiries (submitted_at desc);

alter table public.csr_enquiries enable row level security;

-- Lock down all browser/public roles; only server-side service_role may read/write.
revoke all on table public.csr_enquiries from anon, authenticated;
