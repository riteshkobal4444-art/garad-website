import { getAdminExportPasscode } from '../../../server/donations/config';
import { verifyAdminPasscode } from '../../../server/donations/crypto';
import { generateAccountingExportCsv } from '../../../server/donations/service';
import {
  enforceRateLimit,
  sendApiError,
  sendJson,
  VercelLikeRequest,
  VercelLikeResponse,
} from '../../../server/donations/vercelAdapter';

export default async function handler(
  req: VercelLikeRequest,
  res: VercelLikeResponse
) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }
  if (!enforceRateLimit(req, res, 'admin-export', 10, 60_000)) return;

  try {
    const configuredPasscode = getAdminExportPasscode();
    if (!configuredPasscode) {
      return sendJson(res, 503, {
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
      return sendJson(res, 401, {
        error: 'Unauthorized accounting export request.',
        code: 'UNAUTHORIZED',
      });
    }

    const url = new URL(req.url || '/', 'https://localhost');
    const fromDate = url.searchParams.get('from')?.trim() || undefined;
    const toDate = url.searchParams.get('to')?.trim() || undefined;

    const csv = await generateAccountingExportCsv({ fromDate, toDate });
    const stamp = new Date().toISOString().slice(0, 10);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="garad-foundation-donations-10bd-${stamp}.csv"`
    );
    res.statusCode = 200;
    res.end(csv);
  } catch (err) {
    return sendApiError(res, err);
  }
}
