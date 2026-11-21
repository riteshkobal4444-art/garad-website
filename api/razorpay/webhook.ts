import { processRazorpayWebhook } from '../../server/donations/service';
import {
  readRawBuffer,
  sendApiError,
  sendJson,
  VercelLikeRequest,
  VercelLikeResponse,
} from '../../server/donations/vercelAdapter';

// Disable automatic body parsing so HMAC SHA-256 is computed over the exact raw request body
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: VercelLikeRequest,
  res: VercelLikeResponse
) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const rawBody = await readRawBuffer(req);
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
    return sendJson(res, 200, result);
  } catch (err) {
    return sendApiError(res, err);
  }
}
