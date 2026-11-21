export interface PdfDownloadOptions {
  fileUrl: string;
  downloadFilename: string;
}

export interface PdfDownloadResult {
  ok: boolean;
  error?: string;
}

/**
 * Downloads a verified PDF file from static assets and saves it with the exact
 * institutional filename. Checks HTTP status, Content-Type, and PDF magic header
 * (%PDF-) so an HTML SPA fallback page can never be silently saved as a fake PDF.
 */
export async function downloadVerifiedPdf({
  fileUrl,
  downloadFilename,
}: PdfDownloadOptions): Promise<PdfDownloadResult> {
  if (!fileUrl) {
    return {
      ok: false,
      error: 'This report PDF is not currently available for download.',
    };
  }

  try {
    const response = await fetch(fileUrl, {
      method: 'GET',
      headers: { Accept: 'application/pdf' },
      cache: 'no-cache',
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `Unable to retrieve the report PDF (HTTP ${response.status}). Please try again.`,
      };
    }

    const buffer = await response.arrayBuffer();
    const headerBytes = new Uint8Array(buffer.slice(0, 5));
    const headerSignature = String.fromCharCode(...headerBytes);

    if (headerSignature !== '%PDF-') {
      return {
        ok: false,
        error:
          'The requested file could not be verified as a valid PDF document. Please try again later.',
      };
    }

    const pdfBlob = new Blob([buffer], { type: 'application/pdf' });
    const objectUrl = URL.createObjectURL(pdfBlob);

    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = downloadFilename.endsWith('.pdf')
      ? downloadFilename
      : `${downloadFilename}.pdf`;
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Revoke after a short tick so Safari/Firefox complete download handoff cleanly
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);

    return { ok: true };
  } catch {
    return {
      ok: false,
      error:
        'Network error while downloading the PDF. Please check your connection and try again.',
    };
  }
}
