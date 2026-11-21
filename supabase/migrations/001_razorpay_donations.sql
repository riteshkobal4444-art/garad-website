-- ============================================================================
-- Garad Foundation — Razorpay Donation System Schema (Supabase PostgreSQL)
-- Run in Supabase SQL Editor or via `supabase db push`.
-- All tables enforce Row Level Security (RLS) with NO public/anon access.
-- Backend server routes access tables exclusively with SUPABASE_SERVICE_ROLE_KEY.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. DONORS
-- Stores statutory donor details. PAN is stored encrypted (AES-256-GCM) in
-- pan_encrypted along with a masked display value (e.g. ABCDE****F).
CREATE TABLE IF NOT EXISTS public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL CHECK (char_length(trim(full_name)) >= 2),
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  pan_encrypted TEXT,
  pan_masked TEXT,
  anonymous_preference BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donors_email ON public.donors (lower(email));
CREATE INDEX IF NOT EXISTS idx_donors_created_at ON public.donors (created_at DESC);

-- 2. RAZORPAY PLANS CACHE
-- Safely reuses Razorpay monthly plans for suggested & custom amounts.
CREATE TABLE IF NOT EXISTS public.razorpay_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount_paise INTEGER NOT NULL CHECK (amount_paise >= 10000),
  currency TEXT NOT NULL DEFAULT 'INR',
  billing_interval TEXT NOT NULL DEFAULT 'monthly',
  razorpay_plan_id TEXT NOT NULL UNIQUE,
  mode TEXT NOT NULL CHECK (mode IN ('test', 'live')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (amount_paise, currency, billing_interval, mode)
);

-- 3. DONATIONS (One-Time & Initial/Standalone Donation Ledger)
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_reference TEXT NOT NULL UNIQUE,
  acknowledgement_number TEXT UNIQUE,
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE RESTRICT,
  donation_type TEXT NOT NULL CHECK (donation_type IN ('one_time', 'monthly_initial')),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'authorized', 'captured', 'failed', 'refunded')
  ),
  payment_method TEXT,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
  anonymous_display BOOLEAN NOT NULL DEFAULT FALSE,
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.donations (donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations (payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_payment_date ON public.donations (payment_date DESC);

-- 4. SUBSCRIPTIONS (Monthly Recurring Donations)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_reference TEXT NOT NULL UNIQUE,
  acknowledgement_number TEXT UNIQUE,
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE RESTRICT,
  razorpay_subscription_id TEXT NOT NULL UNIQUE,
  razorpay_plan_id TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  billing_interval TEXT NOT NULL DEFAULT 'monthly',
  subscription_status TEXT NOT NULL DEFAULT 'created' CHECK (
    subscription_status IN (
      'created',
      'authenticated',
      'active',
      'pending',
      'halted',
      'paused',
      'cancelled',
      'completed',
      'expired'
    )
  ),
  razorpay_signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
  anonymous_display BOOLEAN NOT NULL DEFAULT FALSE,
  start_date TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_donor_id ON public.subscriptions (donor_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions (subscription_status);

-- 5. RECURRING PAYMENTS (Every Charged/Failed Cycle for a Subscription)
CREATE TABLE IF NOT EXISTS public.recurring_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE RESTRICT,
  acknowledgement_number TEXT UNIQUE,
  razorpay_payment_id TEXT NOT NULL UNIQUE,
  razorpay_invoice_id TEXT,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_status TEXT NOT NULL CHECK (
    payment_status IN ('captured', 'failed', 'refunded')
  ),
  payment_method TEXT,
  payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recurring_payments_sub_id ON public.recurring_payments (subscription_id);
CREATE INDEX IF NOT EXISTS idx_recurring_payments_date ON public.recurring_payments (payment_date DESC);

-- 6. WEBHOOK EVENTS (Idempotent Processing & Audit Trail)
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'processing' CHECK (
    processing_status IN ('processing', 'processed', 'ignored', 'failed')
  ),
  error_summary TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON public.webhook_events (event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON public.webhook_events (processing_status);

-- ============================================================================
-- SECURITY: Enable Row Level Security (RLS) on all tables.
-- With RLS enabled and no public policies, anon/authenticated browser keys
-- have ZERO access. Only server-side SUPABASE_SERVICE_ROLE_KEY can access data.
-- ============================================================================
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.razorpay_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Updated-at trigger helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_donors_updated_at ON public.donors;
CREATE TRIGGER trg_donors_updated_at
  BEFORE UPDATE ON public.donors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_donations_updated_at ON public.donations;
CREATE TRIGGER trg_donations_updated_at
  BEFORE UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
