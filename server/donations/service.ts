import {
  getMissingEnvList,
  getOrganizationLegalConfig,
  getRazorpayCredentials,
  getSupabaseCredentials,
  OrganizationLegalConfig,
  PaymentMode,
} from './config';
import {
  createReceiptToken,
  decryptPan,
  encryptPan,
  generateAcknowledgementNumber,
  generateDonationReference,
  generateSubscriptionReference,
  maskPan,
  verifyRazorpayOrderSignature,
  verifyRazorpaySubscriptionSignature,
  verifyRazorpayWebhookSignature,
  verifyReceiptToken,
} from './crypto';
import {
  cancelRazorpaySubscription,
  createRazorpayMonthlyPlan,
  createRazorpayOrder,
  createRazorpaySubscription,
  fetchRazorpayPayment,
  fetchRazorpaySubscription,
} from './razorpayClient';
import { getSupabaseAdmin } from './supabaseClient';
import {
  escapeCsvCell,
  ValidatedDonorInput,
  validateDonationInput,
} from './validation';

export class ServiceError extends Error {
  statusCode: number;
  code: string;
  constructor(message: string, statusCode = 400, code = 'BAD_REQUEST') {
    super(message);
    this.name = 'ServiceError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export interface PublicDonationConfig {
  configured: boolean;
  mode: PaymentMode;
  keyId: string | null;
  databaseConfigured: boolean;
  webhookConfigured: boolean;
  missingEnv: string[];
  organization: OrganizationLegalConfig;
}

export interface VerifiedReceiptPayload {
  kind: 'one_time' | 'monthly';
  reference: string;
  acknowledgementNumber: string | null;
  status: string;
  isVerifiedSuccess: boolean;
  amount: number;
  currency: string;
  paymentDate: string | null;
  paymentMethod: string | null;
  razorpayPaymentId: string | null;
  razorpayOrderId?: string | null;
  razorpaySubscriptionId?: string | null;
  billingInterval?: string;
  nextBillingDate?: string | null;
  cancelledAt?: string | null;
  donor: {
    displayName: string;
    legalName: string;
    email: string;
    phone: string;
    address: string;
    panMasked: string | null;
    anonymousDisplay: boolean;
  };
  organization: OrganizationLegalConfig;
}

export function getPublicDonationConfig(): PublicDonationConfig {
  const rzp = getRazorpayCredentials();
  const sb = getSupabaseCredentials();
  const missingEnv = getMissingEnvList();
  return {
    configured: rzp.isApiConfigured && sb.isConfigured,
    mode: rzp.mode,
    // Razorpay Key ID is public for Standard Checkout; Key Secret never leaves the server.
    keyId: rzp.isApiConfigured ? rzp.keyId : null,
    databaseConfigured: sb.isConfigured,
    webhookConfigured: rzp.isWebhookConfigured,
    missingEnv,
    organization: getOrganizationLegalConfig(),
  };
}

async function insertDonor(input: ValidatedDonorInput): Promise<string> {
  const supabase = getSupabaseAdmin();
  const panEncrypted = input.panNumber ? encryptPan(input.panNumber) : null;
  const panMasked = maskPan(input.panNumber);

  const { data, error } = await supabase
    .from('donors')
    .insert({
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      address: input.address,
      pan_encrypted: panEncrypted,
      pan_masked: panMasked,
      anonymous_preference: input.anonymousDisplay,
    })
    .select('id')
    .single();

  if (error || !data?.id) {
    throw new ServiceError(
      'Unable to persist donor information. Verify Supabase tables exist.',
      500,
      'DB_WRITE_ERROR'
    );
  }

  return data.id as string;
}

/* ============================================================================
   STAGE 4: ONE-TIME RAZORPAY DONATION ORDER & VERIFICATION
   ============================================================================ */

export async function createOneTimeDonationOrder(rawPayload: unknown) {
  const validation = validateDonationInput(rawPayload);
  if (!validation.ok || !validation.data) {
    throw new ServiceError(
      validation.error || 'Invalid donation input.',
      400,
      'VALIDATION_ERROR'
    );
  }

  const input = validation.data;
  const rzp = getRazorpayCredentials();
  if (!rzp.isApiConfigured) {
    throw new ServiceError(
      'Razorpay API credentials are not configured on the server yet.',
      503,
      'RAZORPAY_UNCONFIGURED'
    );
  }

  const supabase = getSupabaseAdmin();
  const donorId = await insertDonor(input);
  const donationReference = generateDonationReference();

  const order = await createRazorpayOrder({
    amountPaise: input.amountPaise,
    receipt: donationReference,
    notes: {
      donation_reference: donationReference,
      donation_type: 'one_time',
      anonymous: input.anonymousDisplay ? 'true' : 'false',
    },
  });

  const { error: insertErr } = await supabase.from('donations').insert({
    donation_reference: donationReference,
    donor_id: donorId,
    donation_type: 'one_time',
    amount: input.amountRupees,
    currency: 'INR',
    payment_status: 'pending',
    razorpay_order_id: order.id,
    razorpay_signature_verified: false,
    anonymous_display: input.anonymousDisplay,
  });

  if (insertErr) {
    throw new ServiceError(
      'Unable to store pending donation record.',
      500,
      'DB_WRITE_ERROR'
    );
  }

  const receiptToken = createReceiptToken(donationReference);

  return {
    keyId: rzp.keyId,
    mode: rzp.mode,
    orderId: order.id,
    amountPaise: order.amount,
    currency: order.currency,
    donationReference,
    receiptToken,
    organizationName: getOrganizationLegalConfig().legalName,
  };
}

export async function verifyOneTimeDonationPayment(rawPayload: unknown) {
  if (!rawPayload || typeof rawPayload !== 'object') {
    throw new ServiceError('Invalid verification payload.', 400);
  }

  const body = rawPayload as Record<string, unknown>;
  const donationReference =
    typeof body.donationReference === 'string'
      ? body.donationReference.trim()
      : '';
  const paymentId =
    typeof body.razorpay_payment_id === 'string'
      ? body.razorpay_payment_id.trim()
      : '';
  const signature =
    typeof body.razorpay_signature === 'string'
      ? body.razorpay_signature.trim()
      : '';
  const receiptToken =
    typeof body.receiptToken === 'string' ? body.receiptToken.trim() : '';

  if (!donationReference || !paymentId || !signature || !receiptToken) {
    throw new ServiceError('Missing required payment verification fields.', 400);
  }

  if (!verifyReceiptToken(donationReference, receiptToken)) {
    throw new ServiceError('Invalid receipt access token.', 403, 'FORBIDDEN');
  }

  const rzp = getRazorpayCredentials();
  if (!rzp.isApiConfigured) {
    throw new ServiceError('Razorpay credentials are not configured.', 503);
  }

  const supabase = getSupabaseAdmin();

  // Fetch the server-stored pending/existing donation record
  const { data: donation, error: fetchErr } = await supabase
    .from('donations')
    .select(
      'id, donation_reference, acknowledgement_number, donor_id, amount, currency, payment_status, payment_method, razorpay_order_id, razorpay_payment_id, razorpay_signature_verified, payment_date, anonymous_display'
    )
    .eq('donation_reference', donationReference)
    .single();

  if (fetchErr || !donation || !donation.razorpay_order_id) {
    throw new ServiceError('Donation record not found.', 404, 'NOT_FOUND');
  }

  // Idempotent return if already verified and captured for this exact payment
  if (
    donation.payment_status === 'captured' &&
    donation.razorpay_signature_verified &&
    donation.razorpay_payment_id === paymentId
  ) {
    return buildReceiptFromDonationId(donation.id);
  }

  // 1. Verify HMAC SHA-256 signature using the SERVER-STORED razorpay_order_id
  const signatureValid = verifyRazorpayOrderSignature(
    donation.razorpay_order_id,
    paymentId,
    signature,
    rzp.keySecret
  );

  if (!signatureValid) {
    throw new ServiceError(
      'Payment signature verification failed.',
      400,
      'INVALID_SIGNATURE'
    );
  }

  // 2. Confirm actual payment status directly with Razorpay REST API
  const payment = await fetchRazorpayPayment(paymentId);
  const expectedAmountPaise = Math.round(Number(donation.amount) * 100);

  if (payment.order_id !== donation.razorpay_order_id) {
    throw new ServiceError(
      'Payment does not belong to the expected donation order.',
      400,
      'ORDER_MISMATCH'
    );
  }

  if (payment.amount !== expectedAmountPaise || payment.currency !== 'INR') {
    throw new ServiceError(
      'Captured payment amount does not match the donation order.',
      400,
      'AMOUNT_MISMATCH'
    );
  }

  // Confirm captured — never treat mere authorization as settled payment
  if (payment.status !== 'captured') {
    await supabase
      .from('donations')
      .update({
        payment_status:
          payment.status === 'failed' ? 'failed' : 'authorized',
        razorpay_payment_id: payment.id,
        razorpay_signature_verified: true,
        payment_method: payment.method || null,
      })
      .eq('id', donation.id)
      .neq('payment_status', 'captured');

    return buildReceiptFromDonationId(donation.id);
  }

  const acknowledgementNumber =
    donation.acknowledgement_number || generateAcknowledgementNumber();
  const paymentDateIso = payment.created_at
    ? new Date(payment.created_at * 1000).toISOString()
    : new Date().toISOString();

  // Conditional update guards against race conditions / duplicate processing
  const { error: updateErr } = await supabase
    .from('donations')
    .update({
      payment_status: 'captured',
      razorpay_payment_id: payment.id,
      razorpay_signature_verified: true,
      payment_method: payment.method || null,
      payment_date: paymentDateIso,
      acknowledgement_number: acknowledgementNumber,
    })
    .eq('id', donation.id);

  if (updateErr) {
    throw new ServiceError(
      'Failed to record verified donation status.',
      500,
      'DB_UPDATE_ERROR'
    );
  }

  return buildReceiptFromDonationId(donation.id);
}

/* ============================================================================
   STAGE 5: MONTHLY RECURRING DONATIONS (RAZORPAY SUBSCRIPTIONS API)
   ============================================================================ */

async function getOrCreateMonthlyPlanId(
  amountRupees: number,
  amountPaise: number,
  mode: 'test' | 'live'
): Promise<string> {
  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from('razorpay_plans')
    .select('razorpay_plan_id')
    .eq('amount_paise', amountPaise)
    .eq('currency', 'INR')
    .eq('billing_interval', 'monthly')
    .eq('mode', mode)
    .maybeSingle();

  if (existing?.razorpay_plan_id) {
    return existing.razorpay_plan_id as string;
  }

  const createdPlan = await createRazorpayMonthlyPlan({
    amountPaise,
    amountRupees,
  });

  // Upsert gracefully handles concurrent requests for the same custom amount
  const { data: saved } = await supabase
    .from('razorpay_plans')
    .upsert(
      {
        amount_paise: amountPaise,
        currency: 'INR',
        billing_interval: 'monthly',
        razorpay_plan_id: createdPlan.id,
        mode,
      },
      { onConflict: 'amount_paise,currency,billing_interval,mode' }
    )
    .select('razorpay_plan_id')
    .single();

  return (saved?.razorpay_plan_id as string) || createdPlan.id;
}

export async function createMonthlyDonationSubscription(rawPayload: unknown) {
  const validation = validateDonationInput(rawPayload);
  if (!validation.ok || !validation.data) {
    throw new ServiceError(
      validation.error || 'Invalid subscription donation input.',
      400,
      'VALIDATION_ERROR'
    );
  }

  const input = validation.data;
  const rzp = getRazorpayCredentials();
  if (!rzp.isApiConfigured || rzp.mode === 'unconfigured') {
    throw new ServiceError(
      'Razorpay API credentials are not configured on the server yet.',
      503,
      'RAZORPAY_UNCONFIGURED'
    );
  }

  const supabase = getSupabaseAdmin();
  const donorId = await insertDonor(input);
  const subscriptionReference = generateSubscriptionReference();

  const planId = await getOrCreateMonthlyPlanId(
    input.amountRupees,
    input.amountPaise,
    rzp.mode
  );

  const rzpSub = await createRazorpaySubscription({
    planId,
    notes: {
      subscription_reference: subscriptionReference,
      donation_type: 'monthly',
      anonymous: input.anonymousDisplay ? 'true' : 'false',
    },
  });

  const { error: insertErr } = await supabase.from('subscriptions').insert({
    subscription_reference: subscriptionReference,
    donor_id: donorId,
    razorpay_subscription_id: rzpSub.id,
    razorpay_plan_id: planId,
    amount: input.amountRupees,
    currency: 'INR',
    billing_interval: 'monthly',
    subscription_status: rzpSub.status || 'created',
    razorpay_signature_verified: false,
    anonymous_display: input.anonymousDisplay,
  });

  if (insertErr) {
    throw new ServiceError(
      'Unable to store subscription record.',
      500,
      'DB_WRITE_ERROR'
    );
  }

  const receiptToken = createReceiptToken(subscriptionReference);

  return {
    keyId: rzp.keyId,
    mode: rzp.mode,
    subscriptionId: rzpSub.id,
    planId,
    amountRupees: input.amountRupees,
    currency: 'INR',
    billingInterval: 'monthly',
    subscriptionReference,
    receiptToken,
    organizationName: getOrganizationLegalConfig().legalName,
  };
}

export async function verifyMonthlySubscriptionAuthorization(
  rawPayload: unknown
) {
  if (!rawPayload || typeof rawPayload !== 'object') {
    throw new ServiceError('Invalid verification payload.', 400);
  }

  const body = rawPayload as Record<string, unknown>;
  const subscriptionReference =
    typeof body.subscriptionReference === 'string'
      ? body.subscriptionReference.trim()
      : '';
  const paymentId =
    typeof body.razorpay_payment_id === 'string'
      ? body.razorpay_payment_id.trim()
      : '';
  const signature =
    typeof body.razorpay_signature === 'string'
      ? body.razorpay_signature.trim()
      : '';
  const receiptToken =
    typeof body.receiptToken === 'string' ? body.receiptToken.trim() : '';

  if (!subscriptionReference || !paymentId || !signature || !receiptToken) {
    throw new ServiceError(
      'Missing required subscription verification fields.',
      400
    );
  }

  if (!verifyReceiptToken(subscriptionReference, receiptToken)) {
    throw new ServiceError('Invalid receipt access token.', 403, 'FORBIDDEN');
  }

  const rzp = getRazorpayCredentials();
  if (!rzp.isApiConfigured) {
    throw new ServiceError('Razorpay credentials are not configured.', 503);
  }

  const supabase = getSupabaseAdmin();

  const { data: sub, error: fetchErr } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('subscription_reference', subscriptionReference)
    .single();

  if (fetchErr || !sub) {
    throw new ServiceError('Subscription record not found.', 404, 'NOT_FOUND');
  }

  // Verify HMAC SHA-256 against SERVER-STORED razorpay_subscription_id
  const signatureValid = verifyRazorpaySubscriptionSignature(
    paymentId,
    sub.razorpay_subscription_id,
    signature,
    rzp.keySecret
  );

  if (!signatureValid) {
    throw new ServiceError(
      'Subscription authorisation signature verification failed.',
      400,
      'INVALID_SIGNATURE'
    );
  }

  // Fetch authoritative subscription & initial payment status from Razorpay API
  const [rzpSub, rzpPayment] = await Promise.all([
    fetchRazorpaySubscription(sub.razorpay_subscription_id),
    fetchRazorpayPayment(paymentId),
  ]);

  const acknowledgementNumber =
    sub.acknowledgement_number || generateAcknowledgementNumber();
  const startDateIso = rzpSub.current_start
    ? new Date(rzpSub.current_start * 1000).toISOString()
    : new Date().toISOString();
  const nextBillingIso = rzpSub.charge_at
    ? new Date(rzpSub.charge_at * 1000).toISOString()
    : null;

  await supabase
    .from('subscriptions')
    .update({
      subscription_status: rzpSub.status,
      razorpay_signature_verified: true,
      acknowledgement_number: acknowledgementNumber,
      start_date: startDateIso,
      next_billing_date: nextBillingIso,
    })
    .eq('id', sub.id);

  // Record initial captured recurring charge idempotently in recurring_payments
  if (rzpPayment.status === 'captured') {
    const paymentDateIso = rzpPayment.created_at
      ? new Date(rzpPayment.created_at * 1000).toISOString()
      : new Date().toISOString();

    await supabase.from('recurring_payments').upsert(
      {
        subscription_id: sub.id,
        acknowledgement_number: acknowledgementNumber,
        razorpay_payment_id: rzpPayment.id,
        razorpay_invoice_id: rzpPayment.invoice_id || null,
        amount: Number((rzpPayment.amount / 100).toFixed(2)),
        currency: rzpPayment.currency || 'INR',
        payment_status: 'captured',
        payment_method: rzpPayment.method || null,
        payment_date: paymentDateIso,
      },
      { onConflict: 'razorpay_payment_id', ignoreDuplicates: true }
    );
  }

  return buildReceiptFromSubscriptionId(sub.id, rzpPayment.id, rzpPayment.method);
}

export async function cancelMonthlyDonationSubscription(rawPayload: unknown) {
  if (!rawPayload || typeof rawPayload !== 'object') {
    throw new ServiceError('Invalid cancellation request.', 400);
  }

  const body = rawPayload as Record<string, unknown>;
  const subscriptionReference =
    typeof body.subscriptionReference === 'string'
      ? body.subscriptionReference.trim()
      : '';
  const receiptToken =
    typeof body.receiptToken === 'string' ? body.receiptToken.trim() : '';
  const cancelAtCycleEnd = Boolean(body.cancelAtCycleEnd);

  if (!subscriptionReference || !receiptToken) {
    throw new ServiceError(
      'Subscription reference and access token are required.',
      400
    );
  }

  if (!verifyReceiptToken(subscriptionReference, receiptToken)) {
    throw new ServiceError(
      'Unauthorized subscription cancellation request.',
      403,
      'FORBIDDEN'
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: sub, error } = await supabase
    .from('subscriptions')
    .select('id, razorpay_subscription_id, subscription_status')
    .eq('subscription_reference', subscriptionReference)
    .single();

  if (error || !sub) {
    throw new ServiceError('Subscription not found.', 404, 'NOT_FOUND');
  }

  if (sub.subscription_status === 'cancelled') {
    return buildReceiptFromSubscriptionId(sub.id);
  }

  const rzpSub = await cancelRazorpaySubscription(
    sub.razorpay_subscription_id,
    cancelAtCycleEnd
  );

  await supabase
    .from('subscriptions')
    .update({
      subscription_status: rzpSub.status || 'cancelled',
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', sub.id);

  return buildReceiptFromSubscriptionId(sub.id);
}

/* ============================================================================
   DONOR RECEIPT & STATUS LOOKUP (RESTRICTED BY SIGNED HMAC TOKEN)
   ============================================================================ */

async function buildReceiptFromDonationId(
  donationId: string
): Promise<VerifiedReceiptPayload> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('donations')
    .select(
      `
      id,
      donation_reference,
      acknowledgement_number,
      amount,
      currency,
      payment_status,
      payment_method,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature_verified,
      payment_date,
      anonymous_display,
      donors (
        full_name,
        email,
        phone,
        address,
        pan_masked
      )
    `
    )
    .eq('id', donationId)
    .single();

  if (error || !data) {
    throw new ServiceError('Unable to load verified donation receipt.', 404);
  }

  const donorRaw = Array.isArray(data.donors) ? data.donors[0] : data.donors;
  const legalName = donorRaw?.full_name || 'Supporter';

  return {
    kind: 'one_time',
    reference: data.donation_reference,
    acknowledgementNumber: data.acknowledgement_number || null,
    status: data.payment_status,
    isVerifiedSuccess:
      data.payment_status === 'captured' &&
      Boolean(data.razorpay_signature_verified),
    amount: Number(data.amount),
    currency: data.currency || 'INR',
    paymentDate: data.payment_date || null,
    paymentMethod: data.payment_method || null,
    razorpayPaymentId: data.razorpay_payment_id || null,
    razorpayOrderId: data.razorpay_order_id || null,
    donor: {
      displayName: data.anonymous_display ? 'Anonymous Donor' : legalName,
      legalName,
      email: donorRaw?.email || '',
      phone: donorRaw?.phone || '',
      address: donorRaw?.address || '',
      panMasked: donorRaw?.pan_masked || null,
      anonymousDisplay: Boolean(data.anonymous_display),
    },
    organization: getOrganizationLegalConfig(),
  };
}

async function buildReceiptFromSubscriptionId(
  subscriptionDbId: string,
  latestPaymentId?: string | null,
  latestMethod?: string | null
): Promise<VerifiedReceiptPayload> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('subscriptions')
    .select(
      `
      id,
      subscription_reference,
      acknowledgement_number,
      razorpay_subscription_id,
      amount,
      currency,
      billing_interval,
      subscription_status,
      razorpay_signature_verified,
      anonymous_display,
      start_date,
      next_billing_date,
      cancelled_at,
      donors (
        full_name,
        email,
        phone,
        address,
        pan_masked
      ),
      recurring_payments (
        razorpay_payment_id,
        payment_status,
        payment_method,
        payment_date
      )
    `
    )
    .eq('id', subscriptionDbId)
    .single();

  if (error || !data) {
    throw new ServiceError('Unable to load subscription receipt.', 404);
  }

  const donorRaw = Array.isArray(data.donors) ? data.donors[0] : data.donors;
  const legalName = donorRaw?.full_name || 'Supporter';
  const payments = Array.isArray(data.recurring_payments)
    ? data.recurring_payments
    : [];
  const latestCaptured = payments.find(
    (p: { payment_status: string }) => p.payment_status === 'captured'
  );

  const activeStatuses = ['authenticated', 'active', 'completed'];

  return {
    kind: 'monthly',
    reference: data.subscription_reference,
    acknowledgementNumber: data.acknowledgement_number || null,
    status: data.subscription_status,
    isVerifiedSuccess:
      Boolean(data.razorpay_signature_verified) &&
      activeStatuses.includes(data.subscription_status),
    amount: Number(data.amount),
    currency: data.currency || 'INR',
    paymentDate: latestCaptured?.payment_date || data.start_date || null,
    paymentMethod: latestMethod || latestCaptured?.payment_method || null,
    razorpayPaymentId:
      latestPaymentId || latestCaptured?.razorpay_payment_id || null,
    razorpaySubscriptionId: data.razorpay_subscription_id,
    billingInterval: data.billing_interval || 'monthly',
    nextBillingDate: data.next_billing_date || null,
    cancelledAt: data.cancelled_at || null,
    donor: {
      displayName: data.anonymous_display ? 'Anonymous Donor' : legalName,
      legalName,
      email: donorRaw?.email || '',
      phone: donorRaw?.phone || '',
      address: donorRaw?.address || '',
      panMasked: donorRaw?.pan_masked || null,
      anonymousDisplay: Boolean(data.anonymous_display),
    },
    organization: getOrganizationLegalConfig(),
  };
}

export async function getVerifiedReceiptStatus(params: {
  reference: string;
  token: string;
}): Promise<VerifiedReceiptPayload> {
  const { reference, token } = params;
  if (!reference || !token || !verifyReceiptToken(reference, token)) {
    throw new ServiceError(
      'Invalid or missing receipt access token.',
      403,
      'FORBIDDEN'
    );
  }

  const supabase = getSupabaseAdmin();

  if (reference.startsWith('GF-SUB-')) {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('id, razorpay_subscription_id, subscription_status')
      .eq('subscription_reference', reference)
      .maybeSingle();

    if (!sub) {
      throw new ServiceError('Subscription record not found.', 404, 'NOT_FOUND');
    }
    return buildReceiptFromSubscriptionId(sub.id);
  }

  const { data: don } = await supabase
    .from('donations')
    .select('id, razorpay_payment_id, payment_status')
    .eq('donation_reference', reference)
    .maybeSingle();

  if (!don) {
    throw new ServiceError('Donation record not found.', 404, 'NOT_FOUND');
  }

  return buildReceiptFromDonationId(don.id);
}

/* ============================================================================
   STAGE 6: IDEMPOTENT RAZORPAY WEBHOOK PROCESSOR
   ============================================================================ */

export async function processRazorpayWebhook(params: {
  rawBody: Buffer;
  signature: string;
  eventIdHeader?: string;
}) {
  const { webhookSecret, isWebhookConfigured } = getRazorpayCredentials();
  if (!isWebhookConfigured) {
    throw new ServiceError(
      'RAZORPAY_WEBHOOK_SECRET is not configured.',
      503,
      'WEBHOOK_UNCONFIGURED'
    );
  }

  if (!params.signature) {
    throw new ServiceError('Missing x-razorpay-signature header.', 400);
  }

  const valid = verifyRazorpayWebhookSignature(
    params.rawBody,
    params.signature,
    webhookSecret
  );

  if (!valid) {
    throw new ServiceError('Invalid webhook signature.', 400, 'INVALID_SIGNATURE');
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(params.rawBody.toString('utf8')) as Record<
      string,
      unknown
    >;
  } catch {
    throw new ServiceError('Malformed JSON webhook body.', 400);
  }

  const eventType = typeof parsed.event === 'string' ? parsed.event : 'unknown';
  const createdAt =
    typeof parsed.created_at === 'number' ? parsed.created_at : Date.now();
  const payloadObj = (parsed.payload || {}) as Record<string, unknown>;
  const paymentEntity = (
    (payloadObj.payment as Record<string, unknown> | undefined)?.entity || null
  ) as Record<string, unknown> | null;
  const subEntity = (
    (payloadObj.subscription as Record<string, unknown> | undefined)?.entity ||
    null
  ) as Record<string, unknown> | null;

  const fallbackEntityId =
    (typeof paymentEntity?.id === 'string' && paymentEntity.id) ||
    (typeof subEntity?.id === 'string' && subEntity.id) ||
    'unknown';

  const eventId =
    (params.eventIdHeader && params.eventIdHeader.trim()) ||
    `${eventType}:${fallbackEntityId}:${createdAt}`;

  const supabase = getSupabaseAdmin();

  // Strict idempotency gate via UNIQUE(razorpay_event_id)
  const { data: existingEvent } = await supabase
    .from('webhook_events')
    .select('id, processing_status')
    .eq('razorpay_event_id', eventId)
    .maybeSingle();

  if (existingEvent && existingEvent.processing_status === 'processed') {
    return { status: 'duplicate_ignored', eventId, eventType };
  }

  if (!existingEvent) {
    const { error: claimErr } = await supabase.from('webhook_events').insert({
      razorpay_event_id: eventId,
      event_type: eventType,
      processing_status: 'processing',
    });

    // Unique violation from concurrent Razorpay retry
    if (claimErr && claimErr.code === '23505') {
      return { status: 'duplicate_ignored', eventId, eventType };
    }
    if (claimErr) {
      throw new ServiceError('Failed to log webhook event.', 500);
    }
  }

  try {
    await handleWebhookEventPayload(eventType, paymentEntity, subEntity);

    await supabase
      .from('webhook_events')
      .update({
        processing_status: 'processed',
        processed_at: new Date().toISOString(),
        error_summary: null,
      })
      .eq('razorpay_event_id', eventId);

    return { status: 'processed', eventId, eventType };
  } catch (err) {
    const errMsg =
      err instanceof Error ? err.message.slice(0, 240) : 'Webhook processing error';
    await supabase
      .from('webhook_events')
      .update({
        processing_status: 'failed',
        error_summary: errMsg,
      })
      .eq('razorpay_event_id', eventId);
    throw err;
  }
}

async function handleWebhookEventPayload(
  eventType: string,
  paymentEntity: Record<string, unknown> | null,
  subEntity: Record<string, unknown> | null
) {
  const supabase = getSupabaseAdmin();

  if (eventType === 'payment.captured' && paymentEntity) {
    const paymentId = String(paymentEntity.id || '');
    const orderId =
      typeof paymentEntity.order_id === 'string' ? paymentEntity.order_id : null;
    const method =
      typeof paymentEntity.method === 'string' ? paymentEntity.method : null;
    const createdSec =
      typeof paymentEntity.created_at === 'number'
        ? paymentEntity.created_at
        : null;
    const paymentDateIso = createdSec
      ? new Date(createdSec * 1000).toISOString()
      : new Date().toISOString();

    if (orderId) {
      const { data: existingDon } = await supabase
        .from('donations')
        .select('id, acknowledgement_number')
        .eq('razorpay_order_id', orderId)
        .maybeSingle();

      if (existingDon) {
        await supabase
          .from('donations')
          .update({
            payment_status: 'captured',
            razorpay_payment_id: paymentId,
            razorpay_signature_verified: true,
            payment_method: method,
            payment_date: paymentDateIso,
            acknowledgement_number:
              existingDon.acknowledgement_number ||
              generateAcknowledgementNumber(),
          })
          .eq('id', existingDon.id);
      }
    }
    return;
  }

  if (eventType === 'payment.failed' && paymentEntity) {
    const paymentId = String(paymentEntity.id || '');
    const orderId =
      typeof paymentEntity.order_id === 'string' ? paymentEntity.order_id : null;

    if (orderId) {
      await supabase
        .from('donations')
        .update({
          payment_status: 'failed',
          razorpay_payment_id: paymentId || null,
        })
        .eq('razorpay_order_id', orderId)
        .neq('payment_status', 'captured');
    }

    // Check if failed payment belongs to a subscription invoice
    if (subEntity && typeof subEntity.id === 'string') {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('razorpay_subscription_id', subEntity.id)
        .maybeSingle();

      if (sub && paymentId) {
        const amountPaise = Number(paymentEntity.amount || 0);
        await supabase.from('recurring_payments').upsert(
          {
            subscription_id: sub.id,
            razorpay_payment_id: paymentId,
            razorpay_invoice_id:
              typeof paymentEntity.invoice_id === 'string'
                ? paymentEntity.invoice_id
                : null,
            amount: Number((amountPaise / 100).toFixed(2)),
            currency:
              typeof paymentEntity.currency === 'string'
                ? paymentEntity.currency
                : 'INR',
            payment_status: 'failed',
            payment_method:
              typeof paymentEntity.method === 'string'
                ? paymentEntity.method
                : null,
            payment_date: new Date().toISOString(),
          },
          { onConflict: 'razorpay_payment_id', ignoreDuplicates: true }
        );
      }
    }
    return;
  }

  // Subscription lifecycle events
  const subStatusMap: Record<string, string> = {
    'subscription.activated': 'active',
    'subscription.charged': 'active',
    'subscription.pending': 'pending',
    'subscription.halted': 'halted',
    'subscription.cancelled': 'cancelled',
    'subscription.completed': 'completed',
    'subscription.paused': 'paused',
    'subscription.resumed': 'active',
  };

  if (eventType in subStatusMap && subEntity && typeof subEntity.id === 'string') {
    const rzpSubId = subEntity.id;
    const mappedStatus = subStatusMap[eventType];

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('id, acknowledgement_number')
      .eq('razorpay_subscription_id', rzpSubId)
      .maybeSingle();

    if (!sub) return;

    const updateFields: Record<string, unknown> = {
      subscription_status: mappedStatus,
      razorpay_signature_verified: true,
    };

    if (typeof subEntity.current_start === 'number') {
      updateFields.start_date = new Date(
        subEntity.current_start * 1000
      ).toISOString();
    }
    if (typeof subEntity.charge_at === 'number') {
      updateFields.next_billing_date = new Date(
        subEntity.charge_at * 1000
      ).toISOString();
    }
    if (mappedStatus === 'cancelled') {
      updateFields.cancelled_at = new Date().toISOString();
    }
    if (!sub.acknowledgement_number && mappedStatus === 'active') {
      updateFields.acknowledgement_number = generateAcknowledgementNumber();
    }

    await supabase.from('subscriptions').update(updateFields).eq('id', sub.id);

    // Record every successful recurring payment idempotently on subscription.charged
    if (
      eventType === 'subscription.charged' &&
      paymentEntity &&
      typeof paymentEntity.id === 'string'
    ) {
      const amountPaise = Number(paymentEntity.amount || 0);
      const createdSec =
        typeof paymentEntity.created_at === 'number'
          ? paymentEntity.created_at
          : null;
      const paymentDateIso = createdSec
        ? new Date(createdSec * 1000).toISOString()
        : new Date().toISOString();

      await supabase.from('recurring_payments').upsert(
        {
          subscription_id: sub.id,
          acknowledgement_number: generateAcknowledgementNumber(),
          razorpay_payment_id: paymentEntity.id,
          razorpay_invoice_id:
            typeof paymentEntity.invoice_id === 'string'
              ? paymentEntity.invoice_id
              : null,
          amount: Number((amountPaise / 100).toFixed(2)),
          currency:
            typeof paymentEntity.currency === 'string'
              ? paymentEntity.currency
              : 'INR',
          payment_status: 'captured',
          payment_method:
            typeof paymentEntity.method === 'string'
              ? paymentEntity.method
              : null,
          payment_date: paymentDateIso,
        },
        { onConflict: 'razorpay_payment_id', ignoreDuplicates: true }
      );
    }
  }
}

/* ============================================================================
   STAGE 7: FORM 10BD ACCOUNTING CSV EXPORT (PROTECTED ADMIN ENDPOINT)
   ============================================================================ */

export async function generateAccountingExportCsv(options: {
  fromDate?: string;
  toDate?: string;
}): Promise<string> {
  const supabase = getSupabaseAdmin();

  let donQuery = supabase
    .from('donations')
    .select(
      `
      donation_reference,
      acknowledgement_number,
      donation_type,
      amount,
      currency,
      payment_status,
      payment_method,
      razorpay_payment_id,
      payment_date,
      donors (
        full_name,
        email,
        phone,
        address,
        pan_encrypted,
        pan_masked
      )
    `
    )
    .eq('payment_status', 'captured')
    .order('payment_date', { ascending: false });

  if (options.fromDate) {
    donQuery = donQuery.gte('payment_date', options.fromDate);
  }
  if (options.toDate) {
    donQuery = donQuery.lte('payment_date', options.toDate);
  }

  let recQuery = supabase
    .from('recurring_payments')
    .select(
      `
      acknowledgement_number,
      razorpay_payment_id,
      amount,
      currency,
      payment_status,
      payment_method,
      payment_date,
      subscriptions (
        subscription_reference,
        razorpay_subscription_id,
        donors (
          full_name,
          email,
          phone,
          address,
          pan_encrypted,
          pan_masked
        )
      )
    `
    )
    .eq('payment_status', 'captured')
    .order('payment_date', { ascending: false });

  if (options.fromDate) {
    recQuery = recQuery.gte('payment_date', options.fromDate);
  }
  if (options.toDate) {
    recQuery = recQuery.lte('payment_date', options.toDate);
  }

  const [donRes, recRes] = await Promise.all([donQuery, recQuery]);
  if (donRes.error || recRes.error) {
    throw new ServiceError('Unable to export donation ledger.', 500);
  }

  const headers = [
    'Record Type',
    'Reference',
    'Acknowledgement Number',
    'Razorpay Payment ID',
    'Payment Date (ISO)',
    'Amount (INR)',
    'Payment Method',
    'Donor Full Name',
    'Donor Email',
    'Donor Mobile',
    'Donor Address',
    'Donor PAN (Form 10BD)',
  ];

  const rows: string[][] = [];

  for (const row of donRes.data || []) {
    const donor = Array.isArray(row.donors) ? row.donors[0] : row.donors;
    rows.push([
      'One-Time Donation',
      row.donation_reference || '',
      row.acknowledgement_number || '',
      row.razorpay_payment_id || '',
      row.payment_date || '',
      String(row.amount ?? ''),
      row.payment_method || '',
      donor?.full_name || '',
      donor?.email || '',
      donor?.phone || '',
      donor?.address || '',
      decryptPan(donor?.pan_encrypted) || donor?.pan_masked || '',
    ]);
  }

  for (const row of recRes.data || []) {
    const sub = Array.isArray(row.subscriptions)
      ? row.subscriptions[0]
      : row.subscriptions;
    const donor = sub
      ? Array.isArray(sub.donors)
        ? sub.donors[0]
        : sub.donors
      : null;

    rows.push([
      'Monthly Recurring Charge',
      sub?.subscription_reference || '',
      row.acknowledgement_number || '',
      row.razorpay_payment_id || '',
      row.payment_date || '',
      String(row.amount ?? ''),
      row.payment_method || '',
      donor?.full_name || '',
      donor?.email || '',
      donor?.phone || '',
      donor?.address || '',
      decryptPan(donor?.pan_encrypted) || donor?.pan_masked || '',
    ]);
  }

  const lines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((cols) => cols.map(escapeCsvCell).join(',')),
  ];

  return lines.join('\r\n');
}
