import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  FileSpreadsheet,
  HeartHandshake,
  Info,
  Loader2,
  Lock,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import {
  formatInr,
  loadRazorpayCheckoutScript,
  PublicDonationConfig,
  RazorpayFailureEvent,
  RazorpaySuccessResponse,
  VerifiedReceipt,
} from '../utils/razorpayCheckout';
import { usePageSeo } from '../utils/seo';
import { EASE_EDITORIAL, Tilt3DCard } from './motion/MotionPrimitives';

type DonationMode = 'one_time' | 'monthly';

const ONE_TIME_AMOUNTS = [500, 1000, 2000, 5000];
const MONTHLY_AMOUNTS = [100, 250, 500, 1000];

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface DonatePageProps {
  onNavigateArchive: () => void;
  onDonationVerified: (params: {
    reference: string;
    token: string;
    receipt: VerifiedReceipt;
  }) => void;
  onOpenAccountingExport: () => void;
}

export function DonatePage({
  onNavigateArchive,
  onDonationVerified,
  onOpenAccountingExport,
}: DonatePageProps) {
  const prefersReduced = useReducedMotion();

  usePageSeo({
    title: 'Donate to Garad Foundation — Support Grassroots Education & Welfare',
    description:
      'Make a secure one-time or monthly recurring contribution to Garad Foundation via Razorpay. Verified receipts and structured 80G donation reporting.',
    type: 'website',
  });

  // Server readiness state
  const [serverConfig, setServerConfig] = useState<PublicDonationConfig | null>(
    null
  );
  const [configLoading, setConfigLoading] = useState(true);

  // Donation mode & amount state
  const [mode, setMode] = useState<DonationMode>('one_time');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(1000);
  const [customAmount, setCustomAmount] = useState('');

  // Donor form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [anonymousDisplay, setAnonymousDisplay] = useState(false);
  const [recurringConsent, setRecurringConsent] = useState(false);

  // Processing & feedback state
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/donations/config')
      .then((res) => res.json())
      .then((data: PublicDonationConfig) => {
        if (active) setServerConfig(data);
      })
      .catch(() => {
        if (active) setServerConfig(null);
      })
      .finally(() => {
        if (active) setConfigLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const presetList = mode === 'one_time' ? ONE_TIME_AMOUNTS : MONTHLY_AMOUNTS;

  const effectiveAmount = useMemo(() => {
    if (customAmount.trim().length > 0) {
      const parsed = Number(customAmount.trim());
      return Number.isFinite(parsed) ? Math.floor(parsed) : 0;
    }
    return selectedPreset || 0;
  }, [customAmount, selectedPreset]);

  const handleModeSwitch = (nextMode: DonationMode) => {
    setMode(nextMode);
    setSelectedPreset(nextMode === 'one_time' ? 1000 : 250);
    setCustomAmount('');
    setErrorBanner(null);
    setStatusNotice(null);
    setRecurringConsent(false);
  };

  const handlePresetClick = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmount('');
    setErrorBanner(null);
  };

  const handleCustomAmountChange = (val: string) => {
    const digitsOnly = val.replace(/[^\d]/g, '').slice(0, 7);
    setCustomAmount(digitsOnly);
    if (digitsOnly) {
      setSelectedPreset(null);
    }
    setErrorBanner(null);
  };

  const validateForm = (): string | null => {
    if (!Number.isInteger(effectiveAmount) || effectiveAmount < 100) {
      return 'Please enter a valid whole rupee amount of at least ₹100.';
    }
    if (effectiveAmount > 1000000) {
      return 'For single contributions above ₹10,00,000, please contact Garad Foundation directly.';
    }
    if (fullName.trim().length < 2) {
      return 'Please enter your full legal name.';
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return 'Please enter a valid email address for your donation acknowledgement.';
    }
    const phoneDigits = phone.replace(/[^\d]/g, '');
    const validPhone =
      (phoneDigits.length === 10 && /^[6-9]\d{9}$/.test(phoneDigits)) ||
      (phoneDigits.length === 12 &&
        phoneDigits.startsWith('91') &&
        /^[6-9]\d{9}$/.test(phoneDigits.slice(2)));
    if (!validPhone) {
      return 'Please enter a valid 10-digit Indian mobile number.';
    }
    if (address.trim().length < 8) {
      return 'Please enter your full postal address (required for statutory donation reporting).';
    }
    const normalizedPan = panNumber.trim().toUpperCase();
    if (normalizedPan.length > 0 && !PAN_REGEX.test(normalizedPan)) {
      return 'PAN must follow the 10-character format (e.g. ABCDE1234F).';
    }
    if (mode === 'monthly' && !recurringConsent) {
      return 'Please review and confirm the monthly recurring payment authorisation terms before proceeding.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner(null);
    setStatusNotice(null);

    const validationError = validateForm();
    if (validationError) {
      setErrorBanner(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        amount: effectiveAmount,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        panNumber: panNumber.trim().toUpperCase(),
        anonymousDisplay,
      };

      const endpoint =
        mode === 'one_time'
          ? '/api/donations/create-order'
          : '/api/donations/create-subscription';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data.error ||
            'Unable to initiate payment right now. Please try again.'
        );
      }

      const RazorpayCtor = await loadRazorpayCheckoutScript();

      const reference =
        mode === 'one_time'
          ? (data.donationReference as string)
          : (data.subscriptionReference as string);
      const receiptToken = data.receiptToken as string;

      const checkoutOptions: Record<string, unknown> = {
        key: data.keyId,
        name: data.organizationName || 'Garad Foundation',
        description:
          mode === 'one_time'
            ? `One-Time Donation · Ref ${reference}`
            : `Monthly Recurring Support (${formatInr(effectiveAmount)}/month)`,
        prefill: {
          name: payload.fullName,
          email: payload.email,
          contact: payload.phone,
        },
        notes: {
          reference,
          donation_mode: mode,
        },
        theme: {
          color: '#0D3021',
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            setStatusNotice(
              'Checkout was closed before payment was completed. No charge was verified — you may retry whenever ready.'
            );
          },
        },
        handler: async (response: RazorpaySuccessResponse) => {
          setSubmitting(false);
          setVerifying(true);
          setErrorBanner(null);
          setStatusNotice(null);

          try {
            const verifyUrl =
              mode === 'one_time'
                ? '/api/donations/verify-payment'
                : '/api/donations/verify-subscription';

            const verifyBody =
              mode === 'one_time'
                ? {
                    donationReference: reference,
                    receiptToken,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                  }
                : {
                    subscriptionReference: reference,
                    receiptToken,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_subscription_id: response.razorpay_subscription_id,
                    razorpay_signature: response.razorpay_signature,
                  };

            const verifyRes = await fetch(verifyUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(verifyBody),
            });

            const verifyData = await verifyRes.json().catch(() => ({}));
            if (!verifyRes.ok || !verifyData.receipt) {
              throw new Error(
                verifyData.error ||
                  'Payment verification did not succeed on the server. If an amount was debited, please keep your reference and check status shortly.'
              );
            }

            onDonationVerified({
              reference,
              token: receiptToken,
              receipt: verifyData.receipt as VerifiedReceipt,
            });
          } catch (verifyErr) {
            setErrorBanner(
              verifyErr instanceof Error
                ? verifyErr.message
                : 'Server payment verification failed.'
            );
          } finally {
            setVerifying(false);
          }
        },
      };

      if (mode === 'one_time') {
        checkoutOptions.order_id = data.orderId;
        checkoutOptions.amount = data.amountPaise;
        checkoutOptions.currency = data.currency || 'INR';
      } else {
        checkoutOptions.subscription_id = data.subscriptionId;
      }

      const rzp = new RazorpayCtor(checkoutOptions);

      rzp.on('payment.failed', (failure: RazorpayFailureEvent) => {
        setSubmitting(false);
        const reason =
          failure?.error?.description ||
          failure?.error?.reason ||
          'The payment could not be completed by your bank or card issuer.';
        setErrorBanner(`Payment failed: ${reason} You can retry safely below.`);
      });

      rzp.open();
    } catch (err) {
      setSubmitting(false);
      setErrorBanner(
        err instanceof Error
          ? err.message
          : 'Unable to initiate Razorpay checkout.'
      );
    }
  };

  return (
    <main className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20">
      {/* Top breadcrumb & return link */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
        className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#ECE6DA]"
      >
        <div className="flex items-center gap-2 text-[12px] text-[#6B746E]">
          <a
            href="/activities"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
                return;
              e.preventDefault();
              onNavigateArchive();
            }}
            className="hover:text-[#171C19] transition-colors"
          >
            Home
          </a>
          <span aria-hidden="true" className="text-[#C4BCB0]">
            /
          </span>
          <span className="font-semibold text-[#171C19]">Donate</span>
        </div>

        <a
          href="/activities"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
              return;
            e.preventDefault();
            onNavigateArchive();
          }}
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5DDD0] hover:border-[#CFC4B2] text-[12px] font-semibold text-[#232D27] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#9A3B1E] transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Activity Archive</span>
        </a>
      </motion.div>

      {/* Hero Section */}
      <section aria-labelledby="donate-hero-heading" className="pt-8 sm:pt-10">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
          className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECEEE9] border border-[#DFE4DC] text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#284234]"
        >
          <HeartHandshake className="w-3.5 h-3.5 text-[#9A3B1E]" />
          <span>GARAD FOUNDATION · THANE, MAHARASHTRA</span>
          {serverConfig?.mode === 'test' && (
            <span className="ml-1 px-2 py-0.5 rounded bg-[#9A3B1E] text-white text-[9.5px] tracking-wider">
              TEST MODE
            </span>
          )}
        </motion.div>

        <motion.h1
          id="donate-hero-heading"
          initial={prefersReduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, delay: 0.08, ease: EASE_EDITORIAL }}
          className="mt-4 font-serif text-[36px] sm:text-[48px] lg:text-[52px] font-bold tracking-[-0.02em] leading-[1.1] text-[#171C19] text-balance"
        >
          Be Someone&apos;s Reason to{' '}
          <span className="italic font-semibold text-[#9A3B1E]">Dream.</span>
        </motion.h1>

        <motion.p
          initial={prefersReduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: EASE_EDITORIAL }}
          className="mt-4 max-w-[660px] text-[16px] sm:text-[17.5px] leading-[1.68] text-[#555E58]"
        >
          Your contribution can help children access education, opportunities
          and a brighter future.
        </motion.p>
      </section>

      {/* Honest Environment Readiness Notice when credentials/DB are not yet configured */}
      {!configLoading && serverConfig && !serverConfig.configured && (
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-7 rounded-2xl bg-[#FDF6EA] border border-[#E9D2A9] p-4 sm:p-5 flex items-start gap-3.5 text-[13px] text-[#553D14]"
        >
          <Info className="w-5 h-5 text-[#B57921] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[#3C2B0C]">
              Payment Gateway &amp; Database Setup Required Before Test Checkout
            </p>
            <p className="mt-1 leading-relaxed">
              The donation form, server validation, signature verification,
              webhooks, and acknowledgement flow are ready. To process Razorpay
              Test Mode payments, configure these server environment variables
              and run the Supabase SQL migration:{' '}
              <span className="font-mono text-[11.5px] font-semibold">
                {serverConfig.missingEnv.join(', ')}
              </span>
              .
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Two-Column Donation Layout */}
      <section className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_350px] gap-8 items-start">
        {/* LEFT COLUMN: DONATION FORM */}
        <motion.form
          onSubmit={handleSubmit}
          noValidate
          initial={prefersReduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, delay: 0.2, ease: EASE_EDITORIAL }}
          className="chrome-card rounded-[22px] bg-white p-6 sm:p-8 space-y-7"
        >
          {/* Step 1: Donation Mode Switch */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#9A3B1E] mb-3">
              01. Choose Contribution Type
            </p>
            <div
              role="tablist"
              aria-label="Donation frequency"
              className="grid grid-cols-2 gap-1.5 p-1.5 rounded-xl bg-[#F4F0E7] border border-[#E8E0D1]"
            >
              {(
                [
                  { id: 'one_time', label: 'One-Time Donation' },
                  { id: 'monthly', label: 'Monthly Donation' },
                ] as const
              ).map((tab) => {
                const isActive = mode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleModeSwitch(tab.id)}
                    className={`relative py-2.5 px-3 rounded-lg text-[13.5px] font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D3021] ${
                      isActive
                        ? 'text-white'
                        : 'text-[#4F5953] hover:text-[#171C19]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="donate-mode-pill"
                        transition={
                          prefersReduced
                            ? { duration: 0.05 }
                            : { type: 'spring', stiffness: 420, damping: 32 }
                        }
                        className="absolute inset-0 rounded-lg bg-[#0D3021] shadow-sm"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Suggested & Custom Amount */}
          <div>
            <div className="flex items-baseline justify-between gap-2 mb-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#9A3B1E]">
                02. Select {mode === 'monthly' ? 'Monthly ' : ''}Amount (INR)
              </p>
              <span className="text-[12px] text-[#6B746E] tabular-nums">
                Minimum ₹100
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {presetList.map((amt) => {
                const isSelected =
                  customAmount.trim() === '' && selectedPreset === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handlePresetClick(amt)}
                    aria-pressed={isSelected}
                    className={`py-3.5 px-3 rounded-xl border text-center transition-all cursor-pointer tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3B1E] ${
                      isSelected
                        ? 'bg-[#FAEEE9] border-[#9A3B1E] text-[#9A3B1E] shadow-[0_6px_16px_-10px_rgba(154,59,30,0.45)]'
                        : 'bg-[#FAF8F4] border-[#E6DFD2] text-[#171C19] hover:border-[#CFC4B2] hover:bg-white'
                    }`}
                  >
                    <span className="font-serif text-[21px] font-bold block leading-none">
                      {formatInr(amt)}
                    </span>
                    {mode === 'monthly' && (
                      <span className="mt-1 block text-[10.5px] font-medium opacity-80">
                        per month
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div className="mt-3.5">
              <label
                htmlFor="custom-amount"
                className="block text-[12px] font-semibold text-[#3C4640] mb-1.5"
              >
                Or enter a custom amount
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif text-lg font-bold text-[#6B746E]">
                  ₹
                </span>
                <input
                  id="custom-amount"
                  type="text"
                  inputMode="numeric"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder={
                    mode === 'monthly'
                      ? 'Enter custom monthly amount (e.g. 750)'
                      : 'Enter custom amount (e.g. 3000)'
                  }
                  className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-[#FAF8F4] border border-[#DDD5C7] text-[15px] font-semibold text-[#171C19] tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9A3B1E]/25 focus:border-[#9A3B1E] transition-colors"
                />
                {mode === 'monthly' && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11.5px] font-medium text-[#6B746E]">
                    / month
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Donor Information for Statutory Reporting */}
          <div className="pt-2 border-t border-[#F0EBE1]">
            <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#9A3B1E] mb-1">
              03. Donor Details
            </p>
            <p className="text-[12.5px] text-[#66706A] mb-4">
              Required for verified donation acknowledgement and statutory
              nonprofit reporting.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="donor-name"
                  className="block text-[12.5px] font-semibold text-[#2B352F] mb-1.5"
                >
                  Full Name <span className="text-[#9A3B1E]">*</span>
                </label>
                <input
                  id="donor-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name as on official ID"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F4] border border-[#DDD5C7] text-[14px] text-[#171C19] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9A3B1E]/25 focus:border-[#9A3B1E]"
                />
              </div>

              <div>
                <label
                  htmlFor="donor-email"
                  className="block text-[12.5px] font-semibold text-[#2B352F] mb-1.5"
                >
                  Email Address <span className="text-[#9A3B1E]">*</span>
                </label>
                <input
                  id="donor-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F4] border border-[#DDD5C7] text-[14px] text-[#171C19] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9A3B1E]/25 focus:border-[#9A3B1E]"
                />
              </div>

              <div>
                <label
                  htmlFor="donor-phone"
                  className="block text-[12.5px] font-semibold text-[#2B352F] mb-1.5"
                >
                  Mobile Number <span className="text-[#9A3B1E]">*</span>
                </label>
                <input
                  id="donor-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit Indian mobile number"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F4] border border-[#DDD5C7] text-[14px] text-[#171C19] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9A3B1E]/25 focus:border-[#9A3B1E]"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="donor-address"
                  className="block text-[12.5px] font-semibold text-[#2B352F] mb-1.5"
                >
                  Postal Address (City, State &amp; PIN Code){' '}
                  <span className="text-[#9A3B1E]">*</span>
                </label>
                <textarea
                  id="donor-address"
                  required
                  rows={2}
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full residential or correspondence address with PIN code"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F4] border border-[#DDD5C7] text-[14px] text-[#171C19] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9A3B1E]/25 focus:border-[#9A3B1E] resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label
                    htmlFor="donor-pan"
                    className="text-[12.5px] font-semibold text-[#2B352F]"
                  >
                    PAN Number{' '}
                    <span className="font-normal text-[#6B746E]">
                      (Optional — required if seeking 80G Form 10BD reporting)
                    </span>
                  </label>
                </div>
                <input
                  id="donor-pan"
                  type="text"
                  maxLength={10}
                  value={panNumber}
                  onChange={(e) =>
                    setPanNumber(
                      e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                    )
                  }
                  placeholder="ABCDE1234F"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F4] border border-[#DDD5C7] font-mono text-[14px] uppercase tracking-wider text-[#171C19] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9A3B1E]/25 focus:border-[#9A3B1E]"
                />
                <p className="mt-1.5 flex items-start gap-1.5 text-[11.5px] text-[#66706A]">
                  <Lock className="w-3.5 h-3.5 text-[#143B2A] shrink-0 mt-0.5" />
                  <span>
                    Privacy protection: Your PAN is encrypted on our server and
                    used solely for statutory Form 10BD donation reporting. It
                    is never displayed publicly or logged.
                  </span>
                </p>
              </div>
            </div>

            {/* Optional Anonymous Display Preference */}
            <label className="mt-4 flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F4] border border-[#EAE4D8] cursor-pointer">
              <input
                type="checkbox"
                checked={anonymousDisplay}
                onChange={(e) => setAnonymousDisplay(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#C8BFB0] accent-[#0D3021]"
              />
              <span className="text-[12.5px] leading-relaxed text-[#46504A]">
                <strong className="text-[#171C19]">
                  Keep my name anonymous in public donor listings.
                </strong>{' '}
                Your legal name and address remain securely recorded for
                internal accounting and statutory acknowledgements only.
              </span>
            </label>
          </div>

          {/* Monthly Recurring Payment Authorisation Terms */}
          {mode === 'monthly' && (
            <div className="rounded-2xl bg-[#EEF4F0] border border-[#D4E4DA] p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#0D3021] font-bold text-[13.5px]">
                <CalendarClock className="w-4 h-4 text-[#9A3B1E]" />
                <span>Monthly Recurring Payment Authorisation Terms</span>
              </div>
              <ul className="space-y-1.5 text-[12.5px] leading-relaxed text-[#384D42]">
                <li>
                  • <strong>Recurring Amount:</strong>{' '}
                  {effectiveAmount >= 100
                    ? `${formatInr(effectiveAmount)} billed once every month`
                    : 'Enter ₹100 or more to confirm monthly amount'}
                </li>
                <li>
                  • <strong>How Authorisation Works:</strong> Razorpay
                  Subscriptions sets up a recurring mandate (UPI AutoPay, card,
                  or e-mandate) with an initial authorisation payment. Future
                  monthly charges occur automatically on your billing date.
                </li>
                <li>
                  • <strong>Cancel Anytime:</strong> You can cancel your monthly
                  subscription at any time from your confirmation page or by
                  contacting Garad Foundation, with no cancellation fee.
                </li>
              </ul>

              <label className="pt-2 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recurringConsent}
                  onChange={(e) => setRecurringConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#9CB8A8] accent-[#0D3021]"
                />
                <span className="text-[12.5px] font-medium text-[#172C21]">
                  I understand and authorise a recurring monthly contribution of{' '}
                  <strong>
                    {effectiveAmount >= 100
                      ? formatInr(effectiveAmount)
                      : 'my selected amount'}
                  </strong>{' '}
                  via Razorpay Subscriptions until I choose to cancel.
                </span>
              </label>
            </div>
          )}

          {/* Error or Dismissal Banners */}
          {errorBanner && (
            <div
              role="alert"
              className="rounded-xl bg-[#FDF0EC] border border-[#EBC7BC] p-4 flex items-start gap-3 text-[13px] text-[#7D2912]"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorBanner}</span>
            </div>
          )}

          {statusNotice && (
            <div
              role="status"
              className="rounded-xl bg-[#F5F2EB] border border-[#E5DEC9] p-4 flex items-start gap-3 text-[13px] text-[#3F4943]"
            >
              <Info className="w-4 h-4 text-[#9A3B1E] shrink-0 mt-0.5" />
              <span>{statusNotice}</span>
            </div>
          )}

          {/* Primary Submit CTA */}
          <div className="pt-2">
            <motion.button
              type="submit"
              disabled={submitting || verifying}
              whileHover={
                prefersReduced || submitting || verifying
                  ? undefined
                  : { y: -1.5 }
              }
              whileTap={
                prefersReduced || submitting || verifying
                  ? undefined
                  : { scale: 0.988 }
              }
              className="w-full py-3.5 px-6 rounded-xl bg-[#9A3B1E] hover:bg-[#843016] disabled:opacity-65 text-white text-[15px] font-semibold shadow-[0_10px_24px_-8px_rgba(154,59,30,0.45)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Payment on Server...</span>
                </>
              ) : submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Secure Razorpay Checkout...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'one_time'
                      ? `Proceed to Donate ${
                          effectiveAmount >= 100
                            ? formatInr(effectiveAmount)
                            : ''
                        }`
                      : `Authorise Monthly Donation ${
                          effectiveAmount >= 100
                            ? `(${formatInr(effectiveAmount)}/mo)`
                            : ''
                        }`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            <p className="mt-3 text-center text-[11.5px] text-[#6B746E]">
              Secured by Razorpay · Server-verified HMAC payment confirmation ·
              No card or UPI credentials touch our servers
            </p>
          </div>
        </motion.form>

        {/* RIGHT COLUMN: TRUST, 80G DISCLAIMER & TRANSPARENCY SIDEBAR */}
        <aside className="lg:sticky lg:top-[88px] space-y-5 self-start">
          {/* Contribution Summary Card */}
          <Tilt3DCard
            maxTilt={3}
            elevationY={-3}
            className="chrome-card rounded-[20px] bg-white p-6"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#9A3B1E]">
              CONTRIBUTION SUMMARY
            </p>
            <div className="mt-4 pb-4 border-b border-[#F0EBE1] flex items-baseline justify-between gap-2">
              <span className="text-[13px] text-[#5C6660]">
                {mode === 'one_time'
                  ? 'One-Time Contribution'
                  : 'Monthly Recurring Support'}
              </span>
              <span className="font-serif text-[28px] font-bold text-[#171C19] tabular-nums">
                {effectiveAmount >= 100 ? formatInr(effectiveAmount) : '₹—'}
              </span>
            </div>

            <ul className="mt-4 space-y-2.5 text-[12.5px] text-[#47514B]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#143B2A] shrink-0 mt-0.5" />
                <span>
                  Every payment is verified server-side directly against
                  Razorpay before confirmation.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#143B2A] shrink-0 mt-0.5" />
                <span>
                  Branded donation acknowledgement generated immediately upon
                  verified capture.
                </span>
              </li>
              {mode === 'monthly' && (
                <li className="flex items-start gap-2.5">
                  <RefreshCw className="w-4 h-4 text-[#9A3B1E] shrink-0 mt-0.5" />
                  <span>
                    Recurring cycles are tracked automatically with self-service
                    cancellation anytime.
                  </span>
                </li>
              )}
            </ul>
          </Tilt3DCard>

          {/* 80G Eligibility Disclaimer Card */}
          <div className="chrome-card chrome-card-subtle chrome-card-lift rounded-[20px] bg-[#F6F2EA] p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#9A3B1E]">
              80G TAX EXEMPTION DISCLAIMER
            </p>
            <p className="mt-2.5 text-[13px] leading-[1.68] text-[#454E48]">
              Garad Foundation holds Section 80G approval. However, tax
              deduction eligibility depends on applicable Income Tax Act rules,
              the donor&apos;s tax regime, and accurate PAN and address details.
            </p>
            <p className="mt-2.5 text-[12.5px] leading-[1.65] text-[#59635D]">
              The instant donation acknowledgement issued after payment is{' '}
              <strong>not</strong> an official Form 10BE certificate. Verified
              donor records are organised for statutory Form 10BD filing and
              subsequent Form 10BE issuance.
            </p>
          </div>

          {/* Accounting Export Trigger for Finance Team */}
          <div className="chrome-card chrome-card-dark chrome-card-lift rounded-[20px] bg-[#082417] text-white p-6">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-[#E6A94A]">
              INTERNAL ACCOUNTING ACCESS
            </p>
            <h2 className="mt-2 font-serif text-[20px] font-bold leading-snug">
              Form 10BD Reporting Export
            </h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-[#C5D8CD]">
              Authorised Garad Foundation accounting personnel can export
              verified donation and recurring payment ledgers for Form 10BD
              filing.
            </p>
            <button
              type="button"
              onClick={onOpenAccountingExport}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-white/12 hover:bg-white/20 border border-white/15 text-white text-[12.5px] font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#E6A94A]" />
              <span>Export Reporting CSV</span>
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
