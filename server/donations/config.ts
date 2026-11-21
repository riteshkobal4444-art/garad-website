import crypto from 'node:crypto';

export type PaymentMode = 'test' | 'live' | 'unconfigured';

export interface OrganizationLegalConfig {
  legalName: string;
  address: string;
  pan: string;
  approval80GNumber: string;
  approval80GValidityNote: string;
  contactEmail: string;
  isLegalDetailsConfigured: boolean;
}

// Ephemeral in-memory fallback strictly for development when RECEIPT_TOKEN_SECRET is unset
const EPHEMERAL_RUNTIME_SECRET = crypto.randomBytes(32).toString('hex');

export function getRazorpayCredentials() {
  const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  const webhookSecret = (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim();

  let mode: PaymentMode = 'unconfigured';
  if (keyId.startsWith('rzp_test_')) {
    mode = 'test';
  } else if (keyId.startsWith('rzp_live_')) {
    mode = 'live';
  }

  return {
    keyId,
    keySecret,
    webhookSecret,
    mode,
    isApiConfigured: Boolean(keyId && keySecret && mode !== 'unconfigured'),
    isWebhookConfigured: Boolean(webhookSecret),
  };
}

export function getSupabaseCredentials() {
  const url = (process.env.SUPABASE_URL || '').trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  return {
    url,
    serviceRoleKey,
    isConfigured: Boolean(url && serviceRoleKey),
  };
}

export function getReceiptTokenSecret(): string {
  const configured = (process.env.RECEIPT_TOKEN_SECRET || '').trim();
  if (configured.length >= 16) return configured;
  return EPHEMERAL_RUNTIME_SECRET;
}

export function getPanEncryptionKey(): Buffer {
  const raw = (process.env.PAN_ENCRYPTION_KEY || '').trim();
  if (raw.length >= 32) {
    // Derive an exact 32-byte AES-256 key deterministically via SHA-256
    return crypto.createHash('sha256').update(raw, 'utf8').digest();
  }
  return crypto.createHash('sha256').update(EPHEMERAL_RUNTIME_SECRET, 'utf8').digest();
}

export function getAdminExportPasscode(): string {
  return (process.env.ADMIN_EXPORT_PASSCODE || '').trim();
}

export function getOrganizationLegalConfig(): OrganizationLegalConfig {
  const legalName = (process.env.ORG_LEGAL_NAME || 'Garad Foundation').trim();
  const address = (
    process.env.ORG_ADDRESS || 'Thane, Maharashtra, India'
  ).trim();
  const pan = (process.env.ORG_PAN || '').trim();
  const approval80GNumber = (process.env.ORG_80G_APPROVAL_NUMBER || '').trim();
  const approval80GValidityNote = (
    process.env.ORG_80G_VALIDITY_NOTE ||
    'Garad Foundation holds 80G approval. Deduction eligibility is subject to applicable Income Tax Act rules and statutory Form 10BE issuance.'
  ).trim();
  const contactEmail = (process.env.ORG_CONTACT_EMAIL || '').trim();

  return {
    legalName,
    address,
    pan: pan || 'To be configured (ORG_PAN)',
    approval80GNumber:
      approval80GNumber || 'To be configured (ORG_80G_APPROVAL_NUMBER)',
    approval80GValidityNote,
    contactEmail,
    isLegalDetailsConfigured: Boolean(pan && approval80GNumber),
  };
}

export function getMissingEnvList(): string[] {
  const missing: string[] = [];
  const rzp = getRazorpayCredentials();
  const sb = getSupabaseCredentials();

  if (!rzp.keyId) missing.push('RAZORPAY_KEY_ID');
  if (!rzp.keySecret) missing.push('RAZORPAY_KEY_SECRET');
  if (!rzp.webhookSecret) missing.push('RAZORPAY_WEBHOOK_SECRET');
  if (!sb.url) missing.push('SUPABASE_URL');
  if (!sb.serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');

  return missing;
}
