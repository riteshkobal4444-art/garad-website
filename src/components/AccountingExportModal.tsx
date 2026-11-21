import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Lock,
  X,
} from 'lucide-react';
import { EASE_EDITORIAL } from './motion/MotionPrimitives';

interface AccountingExportModalProps {
  open: boolean;
  onClose: () => void;
}

export function AccountingExportModal({
  open,
  onClose,
}: AccountingExportModalProps) {
  const prefersReduced = useReducedMotion();
  const [passcode, setPasscode] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clear passcode from React memory whenever the modal closes
  useEffect(() => {
    if (!open) {
      setPasscode('');
      setErrorMessage(null);
      setSuccessMessage(null);
      setDownloading(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!passcode.trim()) {
      setErrorMessage('Please enter the authorised accounting export passcode.');
      return;
    }

    if (fromDate && toDate && fromDate > toDate) {
      setErrorMessage('Start date cannot be after end date.');
      return;
    }

    setDownloading(true);
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set('from', fromDate);
      if (toDate) params.set('to', toDate);
      const query = params.toString();
      const url = `/api/admin/donations/export${query ? `?${query}` : ''}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${passcode.trim()}`,
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        const errPayload = await res.json().catch(() => null);
        setErrorMessage(
          errPayload?.error ||
            (res.status === 401
              ? 'Invalid export passcode.'
              : res.status === 503
              ? 'Accounting export is not configured on the server yet.'
              : 'Unable to export donation records at this time.')
        );
        return;
      }

      const blob = await res.blob();
      const disposition = res.headers.get('Content-Disposition') || '';
      const filenameMatch = disposition.match(/filename="?([^"]+)"?/i);
      const today = new Date().toISOString().slice(0, 10);
      const filename =
        filenameMatch?.[1] || `garad-foundation-donations-10bd-${today}.csv`;

      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);

      setSuccessMessage(`Downloaded ${filename} for accounting review.`);
    } catch {
      setErrorMessage(
        'Network error while connecting to the accounting export endpoint.'
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="accounting-export-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#0D1E16]/55 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={
              prefersReduced ? false : { opacity: 0, y: 18, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, y: 12, scale: 0.97 }
            }
            transition={{ duration: 0.28, ease: EASE_EDITORIAL }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-[#FAF8F4] border border-[#E5DDD0] shadow-2xl p-6 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A3B1E]">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Accounting &amp; Form 10BD Export
                </span>
                <h3
                  id="accounting-export-title"
                  className="mt-1 font-serif text-2xl font-bold text-[#171C19]"
                >
                  Verified Donation Register (CSV)
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close accounting export modal"
                className="w-8 h-8 rounded-full bg-white border border-[#E4DDD0] text-[#4E5751] hover:text-[#171C19] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-3 text-[13px] leading-relaxed text-[#555E58]">
              Download verified one-time and recurring donations formatted for
              Garad Foundation&apos;s accounting team and Form 10BD filing
              preparation. Access requires the server-configured export
              passcode.
            </p>

            <form onSubmit={handleDownload} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="accounting-passcode"
                  className="block text-xs font-semibold text-[#2E3832] mb-1.5"
                >
                  Admin Export Passcode
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7A827D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="accounting-passcode"
                    type="password"
                    autoComplete="off"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter ADMIN_EXPORT_PASSCODE"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C7] text-sm text-[#171C19] focus:outline-none focus:ring-2 focus:ring-[#9A3B1E]/30 focus:border-[#9A3B1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="export-from-date"
                    className="block text-xs font-semibold text-[#2E3832] mb-1.5"
                  >
                    From Date (Optional)
                  </label>
                  <input
                    id="export-from-date"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C7] text-sm text-[#171C19] focus:outline-none focus:ring-2 focus:ring-[#9A3B1E]/30 focus:border-[#9A3B1E]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="export-to-date"
                    className="block text-xs font-semibold text-[#2E3832] mb-1.5"
                  >
                    To Date (Optional)
                  </label>
                  <input
                    id="export-to-date"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C7] text-sm text-[#171C19] focus:outline-none focus:ring-2 focus:ring-[#9A3B1E]/30 focus:border-[#9A3B1E]"
                  />
                </div>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-xl bg-[#FDF2EE] border border-[#F2CFC2] px-3.5 py-3 flex items-start gap-2.5 text-xs text-[#8A2F15]"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="rounded-xl bg-[#EEF4F0] border border-[#D4E4DA] px-3.5 py-3 flex items-start gap-2.5 text-xs text-[#143B2A]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="pt-1 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg bg-white border border-[#DDD5C7] text-xs font-semibold text-[#47514B] hover:text-[#171C19] transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={downloading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0D3021] hover:bg-[#16402E] disabled:opacity-60 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Preparing CSV…</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download 10BD CSV</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
