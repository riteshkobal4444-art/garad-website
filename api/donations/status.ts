import { getVerifiedReceiptStatus } from '../../server/donations/service';
import {
  enforceRateLimit,
  sendApiError,
  sendJson,
  VercelLikeRequest,
  VercelLikeResponse,
} from '../../server/donations/vercelAdapter';

export default async function handler(
  req: VercelLikeRequest,
  res: VercelLikeResponse
) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }
  if (!enforceRateLimit(req, res, 'donation-status', 60, 60_000)) return;

  try {
    const url = new URL(req.url || '/', 'https://localhost');
    const reference = (url.searchParams.get('ref') || '').trim();
    const token = (url.searchParams.get('token') || '').trim();
    const receipt = await getVerifiedReceiptStatus({ reference, token });
    return sendJson(res, 200, { receipt });
  } catch (err) {
    return sendApiError(res, err);
  }
}
