import { createOneTimeDonationOrder } from '../../server/donations/service';
import {
  enforceRateLimit,
  readJsonBody,
  sendApiError,
  sendJson,
  VercelLikeRequest,
  VercelLikeResponse,
} from '../../server/donations/vercelAdapter';

export default async function handler(
  req: VercelLikeRequest,
  res: VercelLikeResponse
) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }
  if (!enforceRateLimit(req, res, 'create-order', 20, 60_000)) return;

  try {
    const body = await readJsonBody(req);
    const result = await createOneTimeDonationOrder(body);
    return sendJson(res, 201, result);
  } catch (err) {
    return sendApiError(res, err);
  }
}
