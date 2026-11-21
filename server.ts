import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAdminExportPasscode } from './server/donations/config';
import { verifyAdminPasscode } from './server/donations/crypto';
import { RazorpayApiError } from './server/donations/razorpayClient';
import {
  cancelMonthlyDonationSubscription,
  createMonthlyDonationSubscription,
  createOneTimeDonationOrder,
  generateAccountingExportCsv,
  getPublicDonationConfig,
  getVerifiedReceiptStatus,
  processRazorpayWebhook,
  ServiceError,
  verifyMonthlySubscriptionAuthorization,
  verifyOneTimeDonationPayment,
} from './server/donations/service';
import { DatabaseConfigError } from './server/donations/supabaseClient';
import { checkRateLimit } from './server/donations/validation';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function handleApiError(res: Response, err: unknown) {
  if (
    err instanceof ServiceError ||
    err instanceof RazorpayApiError ||
    err instanceof DatabaseConfigError
  ) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err instanceof ServiceError ? err.code : err.name,
    });
  }
  // Never log donor PII, PAN, or secrets
  console.error('[donations-api] Unexpected server error');
  return res.status(500).json({
    error: 'An unexpected server error occurred. Please try again.',
    code: 'INTERNAL_ERROR',
  });
}

function createRateLimitMiddleware(
  bucket: string,
  maxRequests: number,
  windowMs: number
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = checkRateLimit(getClientIp(req), bucket, maxRequests, windowMs);
    if (!result.allowed) {
      res.setHeader('Retry-After', String(result.retryAfterSec));
      return res.status(429).json({
        error: 'Too many requests. Please wait briefly and try again.',
        code: 'RATE_LIMITED',
      });
    }
    return next();
  };
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);

  // Security headers for API responses
  app.use('/api', (_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    next();
  });

  // -------------------------------------------------------------------------
  // STAGE 6: RAZORPAY WEBHOOK (MUST READ EXACT RAW BODY BEFORE JSON PARSER)
  // -------------------------------------------------------------------------
  app.post(
    '/api/razorpay/webhook',
    express.raw({ type: 'application/json', limit: '1mb' }),
    async (req: Request, res: Response) => {
      try {
        const rawBody = Buffer.isBuffer(req.body)
          ? req.body
          : Buffer.from(
              typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}),
              'utf8'
            );
        const signature = String(req.headers['x-razorpay-signature'] || '');
        const eventIdHeader =
          typeof req.headers['x-razorpay-event-id'] === 'string'
            ? req.headers['x-razorpay-event-id']
            : undefined;

        const result = await processRazorpayWebhook({
          rawBody,
          signature,
          eventIdHeader,
        });
        return res.status(200).json(result);
      } catch (err) {
        return handleApiError(res, err);
      }
    }
  );

  // JSON parser for all remaining API endpoints
  app.use('/api', express.json({ limit: '64kb' }));

  // Public configuration & readiness check (never exposes secrets)
  app.get('/api/donations/config', (_req: Request, res: Response) => {
    return res.status(200).json(getPublicDonationConfig());
  });

  // Stage 4: One-Time Order Creation
  app.post(
    '/api/donations/create-order',
    createRateLimitMiddleware('create-order', 20, 60_000),
    async (req: Request, res: Response) => {
      try {
        const result = await createOneTimeDonationOrder(req.body);
        return res.status(201).json(result);
      } catch (err) {
        return handleApiError(res, err);
      }
    }
  );

  // Stage 4: One-Time Payment Verification (HMAC + Razorpay API Capture Check)
  app.post(
    '/api/donations/verify-payment',
    createRateLimitMiddleware('verify-payment', 30, 60_000),
    async (req: Request, res: Response) => {
      try {
        const receipt = await verifyOneTimeDonationPayment(req.body);
        return res.status(200).json({ receipt });
      } catch (err) {
        return handleApiError(res, err);
      }
    }
  );

  // Stage 5: Monthly Subscription Creation (Plan Reuse + Subscription)
  app.post(
    '/api/donations/create-subscription',
    createRateLimitMiddleware('create-subscription', 20, 60_000),
    async (req: Request, res: Response) => {
      try {
        const result = await createMonthlyDonationSubscription(req.body);
        return res.status(201).json(result);
      } catch (err) {
        return handleApiError(res, err);
      }
    }
  );

  // Stage 5: Monthly Subscription Authorisation Verification
  app.post(
    '/api/donations/verify-subscription',
    createRateLimitMiddleware('verify-subscription', 30, 60_000),
    async (req: Request, res: Response) => {
      try {
        const receipt = await verifyMonthlySubscriptionAuthorization(req.body);
        return res.status(200).json({ receipt });
      } catch (err) {
        return handleApiError(res, err);
      }
    }
  );

  // Stage 5: Monthly Subscription Cancellation (Signed Receipt Token Required)
  app.post(
    '/api/donations/cancel-subscription',
    createRateLimitMiddleware('cancel-subscription', 10, 60_000),
    async (req: Request, res: Response) => {
      try {
        const receipt = await cancelMonthlyDonationSubscription(req.body);
        return res.status(200).json({ receipt });
      } catch (err) {
        return handleApiError(res, err);
      }
    }
  );

  // Stage 8: Verified Donation / Subscription Status Lookup (Token-Gated)
  app.get(
    '/api/donations/status',
    createRateLimitMiddleware('donation-status', 60, 60_000),
    async (req: Request, res: Response) => {
      try {
        const reference = String(req.query.ref || '').trim();
        const token = String(req.query.token || '').trim();
        const receipt = await getVerifiedReceiptStatus({ reference, token });
        return res.status(200).json({ receipt });
      } catch (err) {
        return handleApiError(res, err);
      }
    }
  );

  // Stage 7: Accounting / Form 10BD CSV Export (Admin Bearer Auth Required)
  app.get(
    '/api/admin/donations/export',
    createRateLimitMiddleware('admin-export', 10, 60_000),
    async (req: Request, res: Response) => {
      try {
        const configuredPasscode = getAdminExportPasscode();
        if (!configuredPasscode) {
          return res.status(503).json({
            error:
              'ADMIN_EXPORT_PASSCODE is not configured in server environment variables.',
            code: 'ADMIN_UNCONFIGURED',
          });
        }

        const authHeader = String(req.headers.authorization || '');
        const token = authHeader.startsWith('Bearer ')
          ? authHeader.slice(7).trim()
          : '';

        if (!verifyAdminPasscode(token, configuredPasscode)) {
          return res.status(401).json({
            error: 'Unauthorized accounting export request.',
            code: 'UNAUTHORIZED',
          });
        }

        const fromDate =
          typeof req.query.from === 'string' && req.query.from.trim()
            ? req.query.from.trim()
            : undefined;
        const toDate =
          typeof req.query.to === 'string' && req.query.to.trim()
            ? req.query.to.trim()
            : undefined;

        const csv = await generateAccountingExportCsv({ fromDate, toDate });
        const stamp = new Date().toISOString().slice(0, 10);

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="garad-foundation-donations-10bd-${stamp}.csv"`
        );
        return res.status(200).send(csv);
      } catch (err) {
        return handleApiError(res, err);
      }
    }
  );

  // -------------------------------------------------------------------------
  // FRONTEND SERVING (Vite dev middleware in dev, static dist in prod)
  // -------------------------------------------------------------------------
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        return res.sendFile(indexHtml);
      }
      return res.status(404).send('Build output not found. Run npm run build.');
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Garad Foundation server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
