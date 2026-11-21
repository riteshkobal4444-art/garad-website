export interface ValidatedDonorInput {
  amountRupees: number;
  amountPaise: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  panNumber: string | null;
  anonymousDisplay: boolean;
}

export interface ValidationResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const MIN_AMOUNT_RUPEES = 100;
const MAX_AMOUNT_RUPEES = 1000000;

export function validateDonationInput(
  raw: unknown
): ValidationResult<ValidatedDonorInput> {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Invalid request payload.' };
  }

  const body = raw as Record<string, unknown>;

  const rawAmount = Number(body.amount);
  if (
    !Number.isFinite(rawAmount) ||
    !Number.isInteger(rawAmount) ||
    rawAmount < MIN_AMOUNT_RUPEES ||
    rawAmount > MAX_AMOUNT_RUPEES
  ) {
    return {
      ok: false,
      error: `Please enter a whole rupee amount between ₹${MIN_AMOUNT_RUPEES} and ₹${MAX_AMOUNT_RUPEES.toLocaleString('en-IN')}.`,
    };
  }

  const fullName =
    typeof body.fullName === 'string' ? body.fullName.trim().replace(/\s+/g, ' ') : '';
  if (fullName.length < 2 || fullName.length > 120) {
    return { ok: false, error: 'Please enter a valid full name (2–120 characters).' };
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL_REGEX.test(email) || email.length > 160) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }

  const rawPhone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const digits = rawPhone.replace(/[^\d]/g, '');
  let normalizedPhone = '';
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    normalizedPhone = `+91${digits}`;
  } else if (digits.length === 12 && digits.startsWith('91') && /^[6-9]\d{9}$/.test(digits.slice(2))) {
    normalizedPhone = `+${digits}`;
  } else {
    return {
      ok: false,
      error: 'Please enter a valid 10-digit Indian mobile number.',
    };
  }

  const address =
    typeof body.address === 'string' ? body.address.trim().replace(/\s+/g, ' ') : '';
  if (address.length < 8 || address.length > 350) {
    return {
      ok: false,
      error: 'Please enter a complete postal address (required for statutory donation reporting).',
    };
  }

  const rawPan = typeof body.panNumber === 'string' ? body.panNumber.trim().toUpperCase() : '';
  let panNumber: string | null = null;
  if (rawPan.length > 0) {
    if (!PAN_REGEX.test(rawPan)) {
      return {
        ok: false,
        error: 'PAN must follow the standard 10-character format (e.g. ABCDE1234F).',
      };
    }
    panNumber = rawPan;
  }

  const anonymousDisplay = Boolean(body.anonymousDisplay);

  return {
    ok: true,
    data: {
      amountRupees: rawAmount,
      amountPaise: rawAmount * 100,
      fullName,
      email,
      phone: normalizedPhone,
      address,
      panNumber,
      anonymousDisplay,
    },
  };
}

/* ------------------ Lightweight In-Memory Sliding-Window Rate Limiter ------------------ */
const rateLimitStore = new Map<string, number[]>();

export function checkRateLimit(
  ip: string,
  bucket: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  const key = `${bucket}:${ip || 'unknown'}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  const timestamps = (rateLimitStore.get(key) || []).filter((t) => t > windowStart);

  if (timestamps.length >= maxRequests) {
    const oldest = timestamps[0] || now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    rateLimitStore.set(key, timestamps);
    return { allowed: false, retryAfterSec };
  }

  timestamps.push(now);
  rateLimitStore.set(key, timestamps);

  // Opportunistic cleanup so memory stays bounded
  if (rateLimitStore.size > 4000) {
    for (const [k, list] of rateLimitStore.entries()) {
      const fresh = list.filter((t) => t > windowStart);
      if (fresh.length === 0) rateLimitStore.delete(k);
      else rateLimitStore.set(k, fresh);
    }
  }

  return { allowed: true, retryAfterSec: 0 };
}

/**
 * Prevents spreadsheet formula injection (=, +, -, @) in exported CSV cells.
 */
export function escapeCsvCell(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  const safe = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
  if (/[",\n\r]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}
