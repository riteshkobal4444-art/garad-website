-- =============================================================================
-- Garad Foundation — Volunteer Applications Storage
-- Run in Supabase SQL Editor. Protected by RLS: no public read/write access.
-- =============================================================================

create table if not exists public.volunteer_applications (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null unique,
  full_name text not null,
  email text not null,
  mobile_number text not null,
  city text not null,
  current_status text not null,
  interests text[] not null,
  availability text not null,
  participation_preference text not null,
  skills_and_interests text,
  why_volunteer text,
  resume_storage_path text,
  resume_file_name text,
  resume_file_size integer,
  resume_sha256 text,
  privacy_consent boolean not null default true,
  source_path text not null default '/volunteer',
  notification_email_sent boolean not null default false,
  confirmation_email_sent boolean not null default false,
  submitted_at timestamptz not null default now()
);

create index if not exists idx_volunteer_applications_submitted_at
  on public.volunteer_applications (submitted_at desc);

alter table public.volunteer_applications enable row level security;

-- Lock down all browser/public roles; only server-side service_role may read/write.
revoke all on table public.volunteer_applications from anon, authenticated;

-- =============================================================================
-- Optional Private Storage Bucket for PDF Resumes
-- Create a PRIVATE bucket named 'volunteer-resumes' in Supabase Storage
-- (public = false, allowed_mime_types = ['application/pdf'], file_size_limit = 2621440).
-- =============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('volunteer-resumes', 'volunteer-resumes', false, 2621440, array['application/pdf'])
on conflict (id) do nothing;
