export interface OrganizationLegalDetails {
  legalName: string;
  address: string;
  pan: string;
  approval80GNumber: string;
  approval80GValidityNote: string;
  contactEmail: string;
  isLegalDetailsConfigured: boolean;
}

export interface PublicDonationConfig {
  configured: boolean;
  mode: 'test' | 'live' | 'unconfigured';
  keyId: string | null;
  databaseConfigured: boolean;
  webhookConfigured: boolean;
  missingEnv: string[];
  organization: OrganizationLegalDetails;
}

export interface VerifiedReceipt {
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
  organization: OrganizationLegalDetails;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature: string;
}

export interface RazorpayFailureEvent {
  error: {
    code?: string;
    description?: string;
    reason?: string;
    source?: string;
    step?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (
    event: 'payment.failed',
    handler: (response: RazorpayFailureEvent) => void
  ) => void;
}

interface RazorpayConstructor {
  new (options: Record<string, unknown>): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

let checkoutLoadPromise: Promise<RazorpayConstructor> | null = null;

export function loadRazorpayCheckoutScript(): Promise<RazorpayConstructor> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Razorpay Checkout requires a browser environment.'));
  }

  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }

  if (checkoutLoadPromise) {
    return checkoutLoadPromise;
  }

  checkoutLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
      } else {
        checkoutLoadPromise = null;
        reject(new Error('Razorpay Checkout SDK loaded but did not initialize.'));
      }
    };
    script.onerror = () => {
      checkoutLoadPromise = null;
      reject(
        new Error(
          'Unable to load Razorpay Checkout. Please check your internet connection and try again.'
        )
      );
    };
    document.body.appendChild(script);
  });

  return checkoutLoadPromise;
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
