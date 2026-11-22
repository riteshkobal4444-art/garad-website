-- =============================================================================
-- Garad Learning Hub — Session Enquiries Table
-- Server-side access only (RLS enabled with no public anonymous policies).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.learning_hub_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT NOT NULL UNIQUE,
  organisation_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  organisation_type TEXT NOT NULL,
  programme_of_interest TEXT NOT NULL,
  custom_session_requirement TEXT,
  expected_participants INTEGER,
  preferred_date DATE,
  alternative_date DATE,
  location TEXT NOT NULL,
  additional_message TEXT,
  privacy_consent BOOLEAN NOT NULL DEFAULT TRUE,
  source_path TEXT NOT NULL DEFAULT '/learning-hub',
  notification_email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  confirmation_email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_hub_enquiries_submitted_at
  ON public.learning_hub_enquiries (submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_learning_hub_enquiries_programme
  ON public.learning_hub_enquiries (programme_of_interest);

ALTER TABLE public.learning_hub_enquiries ENABLE ROW LEVEL SECURITY;
