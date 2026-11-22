import type { IncomingMessage, ServerResponse } from 'node:http';
import { RazorpayApiError } from './razorpayClient';
import { ServiceError } from './service';
import { DatabaseConfigError } from './supabaseClient';
import { checkRateLimit } from './validation';

export interface VercelLikeRequest extends IncomingMessage {
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
}

export interface VercelLikeResponse extends ServerResponse {
  status?: (code: number) => VercelLikeResponse;
  json?: (body: unknown) => void;
  send?: (body: string | Buffer) => void;
}

export function sendJson(
  res: VercelLikeResponse,
  statusCode: number,
  body: unknown
) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.statusCode = statusCode;
  res.end(JSON.stringify(body));
}

export function getRequestIp(req: VercelLikeRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    return fwd.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

export function enforceRateLimit(
  req: VercelLikeRequest,
  res: VercelLikeResponse,
  bucket: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const rl = checkRateLimit(getRequestIp(req), bucket, maxRequests, windowMs);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfterSec));
    sendJson(res, 429, {
      error: 'Too many requests. Please wait briefly and try again.',
      code: 'RATE_LIMITED',
    });
    return false;
  }
  return true;
}

export async function readRawBuffer(
  req: IncomingMessage,
  maxBytes?: number
): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let totalBytes = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buf.length;
    if (maxBytes !== undefined && totalBytes > maxBytes) {
      throw new ServiceError(
        'Request payload exceeds the maximum allowed size.',
        413,
        'PAYLOAD_TOO_LARGE'
      );
    }
    chunks.push(buf);
  }
  return Buffer.concat(chunks);
}

export async function readJsonBody(
  req: VercelLikeRequest,
  maxBytes?: number
): Promise<unknown> {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      if (maxBytes !== undefined && Buffer.byteLength(req.body, 'utf8') > maxBytes) {
        throw new ServiceError(
          'Request payload exceeds the maximum allowed size.',
          413,
          'PAYLOAD_TOO_LARGE'
        );
      }
      return JSON.parse(req.body);
    }
    return req.body;
  }
  const raw = await readRawBuffer(req, maxBytes);
  if (!raw.length) return {};
  return JSON.parse(raw.toString('utf8'));
}

export function sendApiError(res: VercelLikeResponse, err: unknown) {
  if (
    err instanceof ServiceError ||
    err instanceof RazorpayApiError ||
    err instanceof DatabaseConfigError
  ) {
    return sendJson(res, err.statusCode, {
      error: err.message,
      code: err instanceof ServiceError ? err.code : err.name,
    });
  }
  console.error('[vercel-donations-api] Unexpected error');
  return sendJson(res, 500, {
    error: 'An unexpected server error occurred. Please try again.',
    code: 'INTERNAL_ERROR',
  });
}
