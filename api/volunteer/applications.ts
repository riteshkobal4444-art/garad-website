import {
  enforceRateLimit,
  readJsonBody,
  sendApiError,
  sendJson,
  VercelLikeRequest,
  VercelLikeResponse,
} from '../../server/donations/vercelAdapter';
import { ServiceError } from '../../server/donations/service';
import { submitVolunteerApplication } from '../../server/volunteer/service';

const MAX_VOLUNTEER_JSON_BYTES = 4 * 1024 * 1024; // Accommodates up to 2.5 MB base64 PDF safely

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

  if (!enforceRateLimit(req, res, 'volunteer-application', 6, 15 * 60_000)) {
    return;
  }

  try {
    const body = await readJsonBody(req, MAX_VOLUNTEER_JSON_BYTES);
    const result = await submitVolunteerApplication(body);
    return sendJson(res, result.saved ? 201 : 202, result);
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
