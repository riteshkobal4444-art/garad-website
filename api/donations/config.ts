import { getPublicDonationConfig } from '../../server/donations/service';
import {
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
  return sendJson(res, 200, getPublicDonationConfig());
}
