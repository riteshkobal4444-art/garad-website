import { getRazorpayCredentials } from './config';

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1';

export class RazorpayApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 502) {
    super(message);
    this.name = 'RazorpayApiError';
    this.statusCode = statusCode;
  }
}

async function razorpayRequest<T>(
  path: string,
  options: { method?: 'GET' | 'POST'; body?: Record<string, unknown> } = {}
): Promise<T> {
  const { keyId, keySecret, isApiConfigured } = getRazorpayCredentials();
  if (!isApiConfigured) {
    throw new RazorpayApiError(
      'Razorpay server credentials are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server environment variables.',
      503
    );
  }

  const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;

  const response = await fetch(`${RAZORPAY_API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  if (!response.ok) {
    const errObj = payload.error as Record<string, unknown> | undefined;
    const description =
      typeof errObj?.description === 'string'
        ? errObj.description
        : `Razorpay API returned HTTP ${response.status}`;
    throw new RazorpayApiError(description, response.status);
  }

  return payload as T;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface RazorpayPaymentResponse {
  id: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
  order_id: string | null;
  invoice_id: string | null;
  method: string | null;
  created_at: number;
  captured: boolean;
}

export interface RazorpayPlanResponse {
  id: string;
  period: string;
  interval: number;
  item: {
    id: string;
    name: string;
    amount: number;
    currency: string;
  };
}

export interface RazorpaySubscriptionResponse {
  id: string;
  plan_id: string;
  status:
    | 'created'
    | 'authenticated'
    | 'active'
    | 'pending'
    | 'halted'
    | 'cancelled'
    | 'completed'
    | 'expired'
    | 'paused';
  current_start: number | null;
  current_end: number | null;
  charge_at: number | null;
  start_at: number | null;
  ended_at: number | null;
  paid_count: number;
  total_count: number;
}

export async function createRazorpayOrder(params: {
  amountPaise: number;
  receipt: string;
  notes: Record<string, string>;
}): Promise<RazorpayOrderResponse> {
  return razorpayRequest<RazorpayOrderResponse>('/orders', {
    method: 'POST',
    body: {
      amount: params.amountPaise,
      currency: 'INR',
      receipt: params.receipt,
      payment_capture: 1,
      notes: params.notes,
    },
  });
}

export async function fetchRazorpayPayment(
  paymentId: string
): Promise<RazorpayPaymentResponse> {
  if (!/^pay_[A-Za-z0-9]+$/.test(paymentId)) {
    throw new RazorpayApiError('Invalid Razorpay payment ID format.', 400);
  }
  return razorpayRequest<RazorpayPaymentResponse>(`/payments/${paymentId}`, {
    method: 'GET',
  });
}

export async function createRazorpayMonthlyPlan(params: {
  amountPaise: number;
  amountRupees: number;
}): Promise<RazorpayPlanResponse> {
  return razorpayRequest<RazorpayPlanResponse>('/plans', {
    method: 'POST',
    body: {
      period: 'monthly',
      interval: 1,
      item: {
        name: `Garad Foundation Monthly Support — INR ${params.amountRupees}`,
        amount: params.amountPaise,
        currency: 'INR',
        description: `Monthly recurring contribution of INR ${params.amountRupees} to Garad Foundation.`,
      },
    },
  });
}

export async function createRazorpaySubscription(params: {
  planId: string;
  notes: Record<string, string>;
}): Promise<RazorpaySubscriptionResponse> {
  return razorpayRequest<RazorpaySubscriptionResponse>('/subscriptions', {
    method: 'POST',
    body: {
      plan_id: params.planId,
      // 120 monthly billing cycles (10 years); donor can cancel anytime.
      total_count: 120,
      customer_notify: 1,
      notes: params.notes,
    },
  });
}

export async function fetchRazorpaySubscription(
  subscriptionId: string
): Promise<RazorpaySubscriptionResponse> {
  if (!/^sub_[A-Za-z0-9]+$/.test(subscriptionId)) {
    throw new RazorpayApiError('Invalid Razorpay subscription ID format.', 400);
  }
  return razorpayRequest<RazorpaySubscriptionResponse>(
    `/subscriptions/${subscriptionId}`,
    { method: 'GET' }
  );
}

export async function cancelRazorpaySubscription(
  subscriptionId: string,
  cancelAtCycleEnd = false
): Promise<RazorpaySubscriptionResponse> {
  if (!/^sub_[A-Za-z0-9]+$/.test(subscriptionId)) {
    throw new RazorpayApiError('Invalid Razorpay subscription ID format.', 400);
  }
  return razorpayRequest<RazorpaySubscriptionResponse>(
    `/subscriptions/${subscriptionId}/cancel`,
    {
      method: 'POST',
      body: {
        cancel_at_cycle_end: cancelAtCycleEnd ? 1 : 0,
      },
    }
  );
}
