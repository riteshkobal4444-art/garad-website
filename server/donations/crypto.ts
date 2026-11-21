import crypto from 'node:crypto';
import { getPanEncryptionKey, getReceiptTokenSecret } from './config';

function timingSafeHexEquals(aHex: string, bHex: string): boolean {
  if (!aHex || !bHex || aHex.length !== bHex.length) return false;
  try {
    const aBuf = Buffer.from(aHex, 'hex');
    const bBuf = Buffer.from(bHex, 'hex');
    if (aBuf.length !== bBuf.length || aBuf.length === 0) return false;
    return crypto.timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

export function verifyRazorpayOrderSignature(
  storedOrderId: string,
  paymentId: string,
  signature: string,
  keySecret: string
): boolean {
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${storedOrderId}|${paymentId}`)
    .digest('hex');
  return timingSafeHexEquals(expected, signature);
}

export function verifyRazorpaySubscriptionSignature(
  paymentId: string,
  storedSubscriptionId: string,
  signature: string,
  keySecret: string
): boolean {
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${paymentId}|${storedSubscriptionId}`)
    .digest('hex');
  return timingSafeHexEquals(expected, signature);
}

export function verifyRazorpayWebhookSignature(
  rawBody: Buffer,
  signature: string,
  webhookSecret: string
): boolean {
  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');
  return timingSafeHexEquals(expected, signature);
}

/**
 * Encrypts a validated Indian PAN number using AES-256-GCM before storage.
 */
export function encryptPan(pan: string): string {
  const key = getPanEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(pan, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `v1:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts a stored PAN for authorized statutory Form 10BD accounting export only.
 */
export function decryptPan(stored: string | null | undefined): string {
  if (!stored || !stored.startsWith('v1:')) return '';
  const parts = stored.split(':');
  if (parts.length !== 4) return '';
  try {
    const key = getPanEncryptionKey();
    const iv = Buffer.from(parts[1], 'hex');
    const authTag = Buffer.from(parts[2], 'hex');
    const ciphertext = Buffer.from(parts[3], 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  } catch {
    return '';
  }
}

export function maskPan(pan: string | null | undefined): string | null {
  if (!pan || pan.length !== 10) return null;
  return `${pan.slice(0, 2)}******${pan.slice(8)}`;
}

/**
 * Creates a signed HMAC token bound strictly to a specific donation or subscription reference.
 * Prevents unauthorized lookup or cancellation of another donor's record.
 */
export function createReceiptToken(reference: string): string {
  const secret = getReceiptTokenSecret();
  return crypto
    .createHmac('sha256', secret)
    .update(`garad-receipt:${reference}`)
    .digest('hex');
}

export function verifyReceiptToken(reference: string, token: string): boolean {
  if (!reference || !token) return false;
  const expected = createReceiptToken(reference);
  return timingSafeHexEquals(expected, token);
}

export function verifyAdminPasscode(provided: string, configured: string): boolean {
  if (!provided || !configured) return false;
  const a = crypto.createHash('sha256').update(provided, 'utf8').digest();
  const b = crypto.createHash('sha256').update(configured, 'utf8').digest();
  return crypto.timingSafeEqual(a, b);
}

export function generateDonationReference(): string {
  const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `GF-DON-${ymd}-${rand}`;
}

export function generateSubscriptionReference(): string {
  const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `GF-SUB-${ymd}-${rand}`;
}

export function generateAcknowledgementNumber(): string {
  const now = new Date();
  const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const fyLabel = `${fyStart}-${String((fyStart + 1) % 100).padStart(2, '0')}`;
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `GF/ACK/${fyLabel}/${rand}`;
}
