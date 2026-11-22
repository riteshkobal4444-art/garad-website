import {
  enforceRateLimit,
  readJsonBody,
  sendApiError,
  sendJson,
  VercelLikeRequest,
  VercelLikeResponse,
} from '../../server/donations/vercelAdapter';
import { ServiceError } from '../../server/donations/service';
import { submitCsrPartnershipEnquiry } from '../../server/csr/service';

export default async function handler(
  req: VercelLikeRequest,
  res: VercelLikeResponse
) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, {
      error: 'Method not allowed.',
      code: 'METHOD_NOT_ALLOWED',
    });
  }

  if (!enforceRateLimit(req, res, 'csr-enquiry', 6, 15 * 60_000)) {
    return;
  }

  try {
    const body = await readJsonBody(req);
    const result = await submitCsrPartnershipEnquiry(body);
    return sendJson(res, 201, result);
  } catch (err) {
    if (err instanceof ServiceError) {
      const withFields = err as ServiceError & {
        fieldErrors?: Record<string, string>;
      };
      return sendJson(res, err.statusCode, {
        error: err.message,
        code: err.code,
        ...(withFields.fieldErrors
          ? { fieldErrors: withFields.fieldErrors }
          : {}),
      });
    }
    return sendApiError(res, err);
  }
}
