import React, { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  Printer,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { formatInr, VerifiedReceipt } from '../utils/razorpayCheckout';
import { usePageSeo } from '../utils/seo';
import { EASE_EDITORIAL } from './motion/MotionPrimitives';

interface DonationSuccessPageProps {
  reference: string;
  token: string;
  initialReceipt?: VerifiedReceipt | null;
  onNavigateDonate: () => void;
  onNavigateArchive: () => void;
}

function formatReadableDate(iso: string | null | undefined): string {
  if (!iso) return 'Recorded upon settlement';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function DonationSuccessPage({
  reference,
  token,
  initialReceipt,
  onNavigateDonate,
  onNavigateArchive,
}: DonationSuccessPageProps) {
  const prefersReduced = useReducedMotion();

  usePageSeo({
    title: 'Donation Confirmation & Acknowledgement — Garad Foundation',
    description:
      'Server-verified donation confirmation and printable acknowledgement receipt for Garad Foundation.',
    type: 'website',
  });

  const [receipt, setReceipt] = useState<VerifiedReceipt | null>(
    initialReceipt || null
  );
  const [loading, setLoading] = useState(!initialReceipt);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  const fetchVerifiedStatus = useCallback(async () => {
    if (!reference || !token) {
      setLoading(false);
      setError(
        'Missing verified transaction reference or access token. Please open this page from a completed donation checkout.'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ ref: reference, token });
      const res = await fetch(`/api/donations/status?${params.toString()}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.receipt) {
        throw new Error(
          data.error ||
            'Unable to verify this donation reference. Please check your link or try again.'
        );
      }
      setReceipt(data.receipt as VerifiedReceipt);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load donation confirmation.'
      );
    } finally {
      setLoading(false);
    }
  }, [reference, token]);

  // Always verify fresh server state on mount/refresh
  useEffect(() => {
    fetchVerifiedStatus();
  }, [fetchVerifiedStatus]);

  const handleCancelSubscription = async () => {
    if (!receipt || receipt.kind !== 'monthly') return;
    setCancelling(true);
    setCancelFeedback(null);
    try {
      const res = await fetch('/api/donations/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionReference: receipt.reference,
          receiptToken: token,
          cancelAtCycleEnd: false,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.receipt) {
        throw new Error(
          data.error || 'Unable to cancel subscription right now.'
        );
      }
      setReceipt(data.receipt as VerifiedReceipt);
      setConfirmCancelOpen(false);
      setCancelFeedback(
        'Your monthly recurring donation has been cancelled. No future charges will be billed.'
      );
    } catch (err) {
      setCancelFeedback(
        err instanceof Error
          ? err.message
          : 'Unable to cancel subscription right now.'
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleDownloadAcknowledgementText = () => {
    if (!receipt) return;
    const lines = [
      'GARAD FOUNDATION — DONATION ACKNOWLEDGEMENT',
      '======================================================',
      `Organisation: ${receipt.organization.legalName}`,
      `Address: ${receipt.organization.address}`,
      `Organisation PAN: ${receipt.organization.pan}`,
      `80G Approval Details: ${receipt.organization.approval80GNumber}`,
      '------------------------------------------------------',
      `Acknowledgement Number: ${receipt.acknowledgementNumber || 'Pending'}`,
      `Transaction Reference: ${receipt.reference}`,
      `Razorpay Payment ID: ${receipt.razorpayPaymentId || 'Recorded'}`,
      receipt.razorpaySubscriptionId
        ? `Subscription Reference: ${receipt.razorpaySubscriptionId}`
        : '',
      `Donation Type: ${
        receipt.kind === 'monthly'
          ? 'Monthly Recurring Donation'
          : 'One-Time Donation'
      }`,
      `Amount: ${formatInr(receipt.amount)} (${receipt.currency})`,
      `Payment Method: ${receipt.paymentMethod || 'Razorpay Checkout'}`,
      `Date: ${formatReadableDate(receipt.paymentDate)}`,
      '------------------------------------------------------',
      `Donor Legal Name: ${receipt.donor.legalName}`,
      `Donor Email: ${receipt.donor.email}`,
      `Donor Address: ${receipt.donor.address}`,
      receipt.donor.panMasked ? `Donor PAN (Masked): ${receipt.donor.panMasked}` : '',
      '======================================================',
      'IMPORTANT STATUTORY NOTICE:',
      'This document is a donation acknowledgement and is NOT an official Form 10BE.',
      'Donor details are maintained for statutory Form 10BD reporting and subsequent Form 10BE issuance where eligible.',
    ]
      .filter(Boolean)
      .join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `garad-acknowledgement-${receipt.reference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="max-w-[920px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-20">
      {/* Top navigation strip (hidden in print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#ECE6DA]">
        <button
          type="button"
          onClick={onNavigateArchive}
          className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#4B554F] hover:text-[#171C19] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#9A3B1E]" />
          <span>Back to Garad Foundation Archive</span>
        </button>

        <button
          type="button"
          onClick={onNavigateDonate}
          className="text-[12.5px] font-semibold text-[#9A3B1E] hover:text-[#7E2D14] transition-colors cursor-pointer"
        >
          Make Another Contribution
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-12 rounded-2xl bg-white border border-[#EAE4D8] p-12 text-center shadow-sm">
          <Loader2 className="w-8 h-8 text-[#9A3B1E] animate-spin mx-auto" />
          <p className="mt-4 font-serif text-xl font-bold text-[#171C19]">
            Verifying Payment Status with Server
          </p>
          <p className="mt-2 text-[13.5px] text-[#5C6660]">
            Confirming your transaction reference securely...
          </p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="mt-10 rounded-2xl bg-white border border-[#EBC7BC] p-8 sm:p-10 text-center shadow-sm">
          <AlertCircle className="w-10 h-10 text-[#9A3B1E] mx-auto" />
          <h1 className="mt-4 font-serif text-2xl sm:text-3xl font-bold text-[#171C19]">
            Unable to Confirm Donation Record
          </h1>
          <p className="mt-2.5 max-w-md mx-auto text-[14px] leading-relaxed text-[#5C6660]">
            {error}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onNavigateDonate}
              className="px-5 py-2.5 rounded-xl bg-[#9A3B1E] hover:bg-[#843016] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Return to Donation Page
            </button>
            {reference && token && (
              <button
                type="button"
                onClick={fetchVerifiedStatus}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#F4F0E7] hover:bg-[#EAE3D5] text-[#171C19] text-sm font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Verification</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Verified / Pending / Failed Receipt View */}
      {!loading && !error && receipt && (
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
          className="mt-8 space-y-6"
        >
          {/* Status Banner */}
          {receipt.isVerifiedSuccess ? (
            <div className="chrome-card chrome-card-dark rounded-[22px] bg-[#0D3021] text-white p-7 sm:p-9">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/12 border border-white/15 text-[11px] font-bold uppercase tracking-[0.12em] text-[#E6A94A]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {receipt.kind === 'monthly'
                    ? 'Recurring Authorisation Verified'
                    : 'Server-Verified Payment Captured'}
                </span>
              </div>

              <h1 className="mt-4 font-serif text-[30px] sm:text-[38px] font-bold leading-tight">
                Thank you, {receipt.donor.displayName}.
              </h1>

              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#D0E2D8]">
                {receipt.kind === 'monthly'
                  ? `Your monthly recurring authorisation of ${formatInr(
                      receipt.amount
                    )} per month has been verified on our server. Future recurring charges will be recorded automatically under subscription reference ${
                      receipt.razorpaySubscriptionId || receipt.reference
                    }.`
                  : `Your one-time contribution of ${formatInr(
                      receipt.amount
                    )} has been verified and captured. Thank you for helping children access education, opportunities, and a brighter future.`}
              </p>
            </div>
          ) : receipt.status === 'failed' || receipt.status === 'cancelled' ? (
            <div className="rounded-[22px] bg-[#FDF1ED] border border-[#EBC7BC] p-7 sm:p-9">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A3B1E]">
                <XCircle className="w-4 h-4" />
                <span>Status: {receipt.status.toUpperCase()}</span>
              </div>
              <h1 className="mt-3 font-serif text-[28px] sm:text-[34px] font-bold text-[#171C19]">
                {receipt.status === 'cancelled'
                  ? 'Monthly Subscription Cancelled'
                  : 'Payment Was Not Completed'}
              </h1>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#554742]">
                {receipt.status === 'cancelled'
                  ? 'This monthly recurring donation has been cancelled. Past captured payments remain preserved for statutory reporting.'
                  : 'Your payment has not been captured by Razorpay. If you wish to try again, you can start a fresh checkout below.'}
              </p>
              <button
                type="button"
                onClick={onNavigateDonate}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#9A3B1E] hover:bg-[#843016] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Retry Donation
              </button>
            </div>
          ) : (
            <div className="rounded-[22px] bg-[#FDF6EA] border border-[#E8D2A7] p-7 sm:p-9">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9C6514]">
                <Clock className="w-4 h-4" />
                <span>Payment Pending Confirmation ({receipt.status})</span>
              </div>
              <h1 className="mt-3 font-serif text-[28px] font-bold text-[#171C19]">
                Awaiting Final Payment Settlement
              </h1>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#57492E]">
                Your transaction has been initiated but is not yet marked as
                captured by Razorpay. We only issue final confirmation once
                payment settlement is verified on our server.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={fetchVerifiedStatus}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Re-check Status</span>
                </button>
                <button
                  type="button"
                  onClick={onNavigateDonate}
                  className="px-5 py-2.5 rounded-xl bg-white border border-[#DED4C1] text-[#171C19] text-sm font-semibold transition-colors cursor-pointer"
                >
                  Retry Payment
                </button>
              </div>
            </div>
          )}

          {/* Branded Donation Acknowledgement Document (Only when verified success or cancelled after verification) */}
          {receipt.isVerifiedSuccess && (
            <section
              aria-label="Branded Donation Acknowledgement"
              className="chrome-card rounded-[22px] bg-white p-6 sm:p-9"
            >
              {/* Acknowledgement Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#ECE6DA]">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                    DONATION ACKNOWLEDGEMENT RECEIPT
                  </p>
                  <h2 className="mt-1 font-serif text-[26px] font-bold text-[#171C19]">
                    {receipt.organization.legalName}
                  </h2>
                  <p className="mt-1 text-[12.5px] text-[#5E6862]">
                    {receipt.organization.address}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-[#555E58]">
                    <span>
                      <strong>Org PAN:</strong> {receipt.organization.pan}
                    </span>
                    <span>
                      <strong>80G Approval:</strong>{' '}
                      {receipt.organization.approval80GNumber}
                    </span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-[#7A827D]">
                    Acknowledgement No.
                  </p>
                  <p className="mt-1 font-mono text-[13.5px] font-semibold text-[#0D3021]">
                    {receipt.acknowledgementNumber || 'Assigned'}
                  </p>
                  <p className="mt-1 text-[11.5px] text-[#6B746E]">
                    {formatReadableDate(receipt.paymentDate)}
                  </p>
                </div>
              </div>

              {/* Structured Receipt Details Grid */}
              <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-[13.5px]">
                <div className="pb-3 border-b border-[#F3EEE4]">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#7A827D]">
                    Donor Legal Name
                  </dt>
                  <dd className="mt-1 font-semibold text-[#171C19]">
                    {receipt.donor.legalName}
                    {receipt.donor.anonymousDisplay && (
                      <span className="ml-2 text-[11px] font-normal text-[#6B746E]">
                        (Anonymous public display)
                      </span>
                    )}
                  </dd>
                </div>

                <div className="pb-3 border-b border-[#F3EEE4]">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#7A827D]">
                    Verified Amount
                  </dt>
                  <dd className="mt-1 font-serif text-[22px] font-bold text-[#0D3021] leading-none tabular-nums">
                    {formatInr(receipt.amount)}
                    {receipt.kind === 'monthly' && (
                      <span className="font-sans text-[12px] font-medium text-[#5E6862] ml-1.5">
                        / month
                      </span>
                    )}
                  </dd>
                </div>

                <div className="pb-3 border-b border-[#F3EEE4]">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#7A827D]">
                    Donation Type
                  </dt>
                  <dd className="mt-1 font-medium text-[#171C19]">
                    {receipt.kind === 'monthly'
                      ? 'Monthly Recurring Donation (Razorpay Subscription)'
                      : 'One-Time Donation'}
                  </dd>
                </div>

                <div className="pb-3 border-b border-[#F3EEE4]">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#7A827D]">
                    Payment Mode
                  </dt>
                  <dd className="mt-1 font-medium text-[#171C19] capitalize">
                    {receipt.paymentMethod || 'Razorpay Checkout'}
                  </dd>
                </div>

                <div className="pb-3 border-b border-[#F3EEE4]">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#7A827D]">
                    Transaction Reference
                  </dt>
                  <dd className="mt-1 font-mono text-[12.5px] font-medium text-[#171C19]">
                    {receipt.reference}
                  </dd>
                </div>

                <div className="pb-3 border-b border-[#F3EEE4]">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#7A827D]">
                    Razorpay Payment ID
                  </dt>
                  <dd className="mt-1 font-mono text-[12.5px] font-medium text-[#171C19]">
                    {receipt.razorpayPaymentId || 'Recorded'}
                  </dd>
                </div>

                {receipt.kind === 'monthly' && receipt.razorpaySubscriptionId && (
                  <>
                    <div className="pb-3 border-b border-[#F3EEE4]">
                      <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#7A827D]">
                        Subscription Reference
                      </dt>
                      <dd className="mt-1 font-mono text-[12.5px] font-medium text-[#171C19]">
                        {receipt.razorpaySubscriptionId}
                      </dd>
                    </div>
                    <div className="pb-3 border-b border-[#F3EEE4]">
                      <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#7A827D]">
                        Next Scheduled Billing
                      </dt>
                      <dd className="mt-1 font-medium text-[#171C19]">
                        {formatReadableDate(receipt.nextBillingDate)}
                      </dd>
                    </div>
                  </>
                )}

                {receipt.donor.panMasked && (
                  <div className="pb-3 border-b border-[#F3EEE4]">
                    <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#7A827D]">
                      Donor PAN (Protected)
                    </dt>
                    <dd className="mt-1 font-mono text-[12.5px] font-medium text-[#171C19]">
                      {receipt.donor.panMasked}
                    </dd>
                  </div>
                )}

                <div className="pb-3 border-b border-[#F3EEE4]">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#7A827D]">
                    Donor Contact &amp; Address
                  </dt>
                  <dd className="mt-1 text-[12.5px] text-[#4A544E] leading-relaxed">
                    {receipt.donor.email} · {receipt.donor.address}
                  </dd>
                </div>
              </dl>

              {/* Important Form 10BE Statutory Notice */}
              <div className="mt-6 rounded-xl bg-[#FAF6EE] border border-[#E9DFCE] p-4 flex items-start gap-3 text-[12px] leading-relaxed text-[#52493D]">
                <ShieldCheck className="w-4 h-4 text-[#9A3B1E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#171C19]">
                    Important Notice Regarding Section 80G &amp; Form 10BE
                  </p>
                  <p className="mt-1">
                    This document is a donation acknowledgement receipt and is{' '}
                    <strong>not</strong> an official Form 10BE certificate.{' '}
                    {receipt.organization.approval80GValidityNote}
                  </p>
                </div>
              </div>

              {/* Action Buttons (Hidden in Print) */}
              <div className="no-print mt-6 pt-5 border-t border-[#F0EBE1] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-white text-[13px] font-semibold transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save PDF Acknowledgement</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadAcknowledgementText}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4F0E7] hover:bg-[#EAE3D5] text-[#171C19] text-[13px] font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#9A3B1E]" />
                    <span>Download Summary</span>
                  </button>
                </div>

                {/* Self-Service Subscription Cancellation */}
                {receipt.kind === 'monthly' &&
                  receipt.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => setConfirmCancelOpen((v) => !v)}
                      className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#9A3B1E] hover:text-[#7D2912] cursor-pointer"
                    >
                      <CalendarClock className="w-4 h-4" />
                      <span>Cancel Monthly Subscription</span>
                    </button>
                  )}
              </div>

              {/* Inline Cancellation Confirmation Box */}
              {confirmCancelOpen && receipt.kind === 'monthly' && (
                <div className="no-print mt-4 rounded-xl bg-[#FDF1ED] border border-[#EBC7BC] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-[12.5px] text-[#6B2714]">
                    Confirm cancellation of recurring monthly subscription{' '}
                    <span className="font-mono font-semibold">
                      {receipt.razorpaySubscriptionId}
                    </span>
                    ? Future monthly billing will stop immediately.
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setConfirmCancelOpen(false)}
                      className="px-3.5 py-2 rounded-lg bg-white border border-[#E3D8CC] text-xs font-semibold text-[#2E3832] cursor-pointer"
                    >
                      Keep Active
                    </button>
                    <button
                      type="button"
                      disabled={cancelling}
                      onClick={handleCancelSubscription}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#9A3B1E] hover:bg-[#7E2D14] text-white text-xs font-semibold cursor-pointer disabled:opacity-60"
                    >
                      {cancelling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Confirm Cancellation</span>
                    </button>
                  </div>
                </div>
              )}

              {cancelFeedback && (
                <p className="no-print mt-3 text-[12.5px] font-medium text-[#143B2A]">
                  {cancelFeedback}
                </p>
              )}
            </section>
          )}
        </motion.div>
      )}
    </main>
  );
}
