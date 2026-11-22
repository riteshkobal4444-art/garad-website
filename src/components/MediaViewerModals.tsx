import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Film,
  Image as ImageIcon,
  Info,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  formatPublicationDate,
  getMediaFinancialYear,
  MediaCoverageItem,
  parseYouTubeEmbedUrl,
} from '../data/mediaCoverage';
import { getActivityBySlug } from '../data/activities';
import { formatFinancialYearLabel } from '../utils/financialYear';
import { NewspaperClippingSheet } from './NewspaperClippingSheet';
import { EASE_EDITORIAL } from './motion/MotionPrimitives';

/* ============================================================================
   1. NEWSPAPER CLIPPING VIEWER MODAL (Full Print Extract + Zoom + PDF Support)
   ============================================================================ */

interface NewspaperClippingViewerModalProps {
  item: MediaCoverageItem | null;
  onClose: () => void;
  onNavigateActivity: (slug: string) => void;
}

export function NewspaperClippingViewerModal({
  item,
  onClose,
  onNavigateActivity,
}: NewspaperClippingViewerModalProps) {
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'clipping' | 'pdf'>('clipping');

  const hasPdf = Boolean(item?.pdfUrl);
  const hasRealScan = Boolean(
    item && !item.isDemo && (item.clippingImage || item.thumbnail)
  );
  const hasClippingVisual = Boolean(item && (item.isDemo || hasRealScan));

  useEffect(() => {
    if (!item) return;
    setZoomPercent(100);
    setViewMode(hasClippingVisual ? 'clipping' : 'pdf');
  }, [item, hasClippingVisual]);

  useEffect(() => {
    if (!item) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        setZoomPercent((z) => Math.min(225, z + 25));
      } else if (e.key === '-') {
        setZoomPercent((z) => Math.max(100, z - 25));
      } else if (e.key === '0') {
        setZoomPercent(100);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [item, onClose]);

  const relatedActivity = item?.relatedActivity
    ? getActivityBySlug(item.relatedActivity)
    : undefined;
  const pubFy = item ? getMediaFinancialYear(item.publicationDate) : null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clipping-viewer-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#0A140F]/92 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.26, ease: EASE_EDITORIAL }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[1160px] max-h-[92vh] bg-[#FAF8F4] text-[#171C19] border border-[#D4CBB8] shadow-[0_32px_90px_-24px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col"
          >
            {/* Viewer Header */}
            <div className="px-4 sm:px-6 py-3.5 border-b border-[#E2D9C8] bg-[#F3EEE4] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <p className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-[#9A3B1E] truncate">
                  {item.isDemo ? 'DEMO CONTENT · ' : ''}
                  {item.publicationName}
                  {item.editionNote ? ` · ${item.editionNote}` : ''}
                </p>
                <h2
                  id="clipping-viewer-title"
                  className="mt-0.5 font-serif text-[17px] sm:text-[21px] font-bold text-[#142019] leading-snug truncate"
                >
                  {item.headline}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {hasClippingVisual && hasPdf && (
                  <div
                    role="group"
                    aria-label="Clipping viewing format"
                    className="inline-flex items-center border border-[#D4CBB8] bg-white p-0.5 text-[11.5px] font-semibold"
                  >
                    <button
                      type="button"
                      onClick={() => setViewMode('clipping')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 transition-colors cursor-pointer ${
                        viewMode === 'clipping'
                          ? 'bg-[#0D3021] text-white'
                          : 'text-[#4E5751] hover:text-[#142019]'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Clipping</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('pdf')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 transition-colors cursor-pointer ${
                        viewMode === 'pdf'
                          ? 'bg-[#0D3021] text-white'
                          : 'text-[#4E5751] hover:text-[#142019]'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                )}

                {viewMode === 'clipping' && hasClippingVisual && (
                  <div
                    role="group"
                    aria-label="Zoom newspaper clipping"
                    className="inline-flex items-center border border-[#D4CBB8] bg-white overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setZoomPercent((z) => Math.max(100, z - 25))
                      }
                      disabled={zoomPercent <= 100}
                      aria-label="Zoom out"
                      className="p-2 text-[#2E3832] hover:bg-[#F3EEE4] disabled:opacity-35 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 text-[11.5px] font-mono font-medium text-[#171C19] tabular-nums border-x border-[#EAE2D4]">
                      {zoomPercent}%
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setZoomPercent((z) => Math.min(225, z + 25))
                      }
                      disabled={zoomPercent >= 225}
                      aria-label="Zoom in"
                      className="p-2 text-[#2E3832] hover:bg-[#F3EEE4] disabled:opacity-35 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    {zoomPercent !== 100 && (
                      <button
                        type="button"
                        onClick={() => setZoomPercent(100)}
                        aria-label="Reset zoom"
                        className="p-2 text-[#9A3B1E] hover:bg-[#F3EEE4] border-l border-[#EAE2D4] transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {hasPdf && item.pdfUrl && (
                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#D4CBB8] bg-white hover:bg-[#EFEAE0] text-[12px] font-semibold text-[#0D3021] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">PDF</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close newspaper clipping viewer"
                  className="w-9 h-9 border border-[#D4CBB8] bg-white hover:bg-[#0D3021] hover:text-white text-[#171C19] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3B1E]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Viewer Stage + Metadata Sidebar */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              {/* Reading Canvas */}
              <div className="lg:col-span-8 bg-[#E6DFD0] overflow-auto p-3 sm:p-6 flex items-start justify-center min-h-[280px]">
                {viewMode === 'pdf' && item.pdfUrl ? (
                  <iframe
                    src={item.pdfUrl}
                    title={`${item.headline} — Archival PDF`}
                    className="w-full h-[64vh] lg:h-full min-h-[400px] border border-[#CFC5B1] bg-white"
                  />
                ) : (
                  <div
                    style={{
                      width: `${zoomPercent}%`,
                      maxWidth: zoomPercent === 100 ? '780px' : 'none',
                    }}
                    className="transition-[width] duration-200 mx-auto shrink-0"
                  >
                    <NewspaperClippingSheet item={item} mode="full" />
                  </div>
                )}
              </div>

              {/* Accession Metadata Sidebar */}
              <aside className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#E2D9C8] bg-[#FAF8F4] p-5 sm:p-6 overflow-y-auto flex flex-col justify-between gap-6">
                <div>
                  {item.isDemo && (
                    <div className="mb-4 pb-3 border-b border-[#E5DDD0] text-[12px] leading-relaxed text-[#7E3119]">
                      <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                        DEMO CONTENT — SAMPLE CLIPPING
                      </p>
                      <p className="mt-1 text-[#545E58]">
                        This fictional print extract previews how verified
                        newspaper scans and archival PDFs will open for zoomable
                        inspection.
                      </p>
                    </div>
                  )}

                  <p className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-[#6E7771]">
                    Press Archive Record
                  </p>
                  <p className="mt-2.5 text-[14px] leading-[1.7] text-[#333C37]">
                    {item.description}
                  </p>

                  <dl className="mt-5 divide-y divide-[#E7E0D3] border-y border-[#E7E0D3] text-[12.5px]">
                    <div className="py-2.5 flex justify-between gap-4">
                      <dt className="text-[#6E7771] shrink-0">Publication</dt>
                      <dd className="font-semibold text-[#171C19] text-right">
                        {item.publicationName}
                      </dd>
                    </div>
                    <div className="py-2.5 flex justify-between gap-4">
                      <dt className="text-[#6E7771] shrink-0">
                        {item.isDemo ? 'Sample Pub. Date' : 'Published'}
                      </dt>
                      <dd className="font-mono text-[12px] text-[#171C19] text-right tabular-nums">
                        {formatPublicationDate(item)}
                      </dd>
                    </div>
                    {pubFy && (
                      <div className="py-2.5 flex justify-between gap-4">
                        <dt className="text-[#6E7771] shrink-0">
                          Financial Year
                        </dt>
                        <dd className="font-mono text-[12px] text-[#171C19] text-right tabular-nums">
                          FY {formatFinancialYearLabel(pubFy)}
                        </dd>
                      </div>
                    )}
                    {item.activityDate && (
                      <div className="py-2.5 flex justify-between gap-4">
                        <dt className="text-[#6E7771] shrink-0">
                          Activity Date
                        </dt>
                        <dd className="font-mono text-[12px] text-[#555E58] text-right tabular-nums">
                          {item.activityDate}
                        </dd>
                      </div>
                    )}
                    {item.category && (
                      <div className="py-2.5 flex justify-between gap-4">
                        <dt className="text-[#6E7771] shrink-0">Topic</dt>
                        <dd className="text-[#171C19] text-right">
                          {item.category}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {relatedActivity && (
                  <div className="pt-4 border-t border-[#E2D9C8]">
                    <p className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-[#6E7771]">
                      Related Activity Archive
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateActivity(relatedActivity.slug);
                      }}
                      className="mt-2.5 w-full flex items-center justify-between gap-3 px-4 py-3 bg-[#0D3021] hover:bg-[#16402E] text-white text-left transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold truncate">
                          {relatedActivity.shortTitle}
                        </p>
                        <p className="text-[11px] text-[#C8DDD2] truncate">
                          FY {relatedActivity.yearDisplay} · View full record
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 shrink-0 text-[#E5B869]" />
                    </button>
                  </div>
                )}
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================================
   2. NEWS VIDEO PREVIEW & PLAYER MODAL (Real YouTube/MP4 + Demo Visual Preview)
   ============================================================================ */

interface NewsVideoPlayerModalProps {
  item: MediaCoverageItem | null;
  onClose: () => void;
  onNavigateActivity: (slug: string) => void;
}

export function NewsVideoPlayerModal({
  item,
  onClose,
  onNavigateActivity,
}: NewsVideoPlayerModalProps) {
  useEffect(() => {
    if (!item) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [item, onClose]);

  const youtubeEmbed = item ? parseYouTubeEmbedUrl(item.videoEmbedUrl) : null;
  const directVideoSrc = item?.videoUrl?.trim() || null;
  const relatedActivity = item?.relatedActivity
    ? getActivityBySlug(item.relatedActivity)
    : undefined;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-player-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#05100A]/92 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.26, ease: EASE_EDITORIAL }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[940px] max-h-[92vh] bg-[#0B1F15] text-[#FAF8F4] border border-[#254736] shadow-[0_32px_90px_-24px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-[#1D3B2C] flex items-start justify-between gap-4 shrink-0">
              <div className="min-w-0">
                <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#E5B869]">
                  {item.isDemo ? 'DEMO CONTENT · ' : ''}
                  {item.publicationName} · {formatPublicationDate(item)}
                  {item.duration ? ` · ${item.duration}` : ''}
                </p>
                <h2
                  id="video-player-title"
                  className="mt-1 font-serif text-[19px] sm:text-[24px] font-bold text-[#FAF8F4] leading-snug"
                >
                  {item.headline}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close video preview"
                className="w-9 h-9 border border-[#294D3B] bg-[#102B1E] hover:bg-[#1B422F] text-[#FAF8F4] flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B869]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 16:9 Screening Stage — Never autoplays audio; renders dignified visual preview for demo items */}
            <div className="relative bg-[#06110B] aspect-video w-full shrink-0 overflow-hidden">
              {youtubeEmbed ? (
                <iframe
                  src={youtubeEmbed}
                  title={item.headline}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : directVideoSrc ? (
                <video
                  src={directVideoSrc}
                  poster={item.thumbnail}
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                /* Polished Cinema Demo Preview (zero broken player, zero autoplaying audio) */
                <div className="relative w-full h-full flex items-center justify-center">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.headline}
                      className="absolute inset-0 w-full h-full object-cover opacity-55"
                    />
                  ) : null}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#05100A]/92 via-[#05100A]/58 to-[#05100A]/45"
                  />

                  <div className="relative z-10 max-w-lg mx-auto px-6 py-6 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full border border-[#E5B869]/55 bg-[#0B2217]/85 flex items-center justify-center text-[#E5B869]">
                      <Film className="w-5 h-5" />
                    </div>
                    <p className="mt-4 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-[#E5B869]">
                      DEMO CONTENT — VIDEO PREVIEW MODE
                    </p>
                    <p className="mt-2 font-serif text-[20px] sm:text-[23px] font-bold text-[#FAF8F4] leading-snug">
                      Broadcast Player Ready for Authentic Footage
                    </p>
                    <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#D4E1D9]">
                      No fictional news broadcast is attached to this
                      demonstration entry. When a verified YouTube link or
                      uploaded MP4/WebM news clip is added, it will play cleanly
                      in this screening frame on demand without autoplaying
                      audio.
                    </p>
                    {item.duration && (
                      <p className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-mono text-[#E5B869] tabular-nums">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Sample Runtime: {item.duration}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Documentary Metadata Footer */}
            <div className="px-4 sm:px-6 py-4 overflow-y-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D2419]">
              <div>
                <p className="text-[13.5px] leading-relaxed text-[#D0DDD5] max-w-2xl">
                  {item.description}
                </p>
                {item.activityDate && (
                  <p className="mt-1.5 text-[11px] font-mono text-[#9CB3A6]">
                    {item.activityDate} · Sample Publication Date:{' '}
                    {formatPublicationDate(item)}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {!item.isDemo && item.videoEmbedUrl && (
                  <a
                    href={item.videoEmbedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#2C5340] hover:bg-[#163828] text-[12px] font-semibold text-[#FAF8F4] transition-colors"
                  >
                    <span>Watch on Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {relatedActivity && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateActivity(relatedActivity.slug);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#9A3B1E] hover:bg-[#B24726] text-[12px] font-semibold text-white transition-colors cursor-pointer"
                  >
                    <span>Related Activity</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================================
   3. DIGITAL ARTICLE DEMO PREVIEW MODAL (Prevents dead/fabricated links)
   ============================================================================ */

interface DigitalArticlePreviewModalProps {
  item: MediaCoverageItem | null;
  onClose: () => void;
}

export function DigitalArticlePreviewModal({
  item,
  onClose,
}: DigitalArticlePreviewModalProps) {
  useEffect(() => {
    if (!item) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="digital-preview-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#0A140F]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: 0.24, ease: EASE_EDITORIAL }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[660px] max-h-[90vh] bg-[#FAF8F4] text-[#171C19] border border-[#D4CBB8] shadow-2xl overflow-y-auto"
          >
            <div className="px-5 sm:px-6 py-4 border-b border-[#E2D9C8] bg-[#F3EEE4] flex items-center justify-between gap-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-[#9A3B1E]">
                DEMO CONTENT · DIGITAL ARTICLE PREVIEW
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close digital article preview"
                className="w-8 h-8 border border-[#D4CBB8] bg-white hover:bg-[#0D3021] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {item.thumbnail && (
              <div className="border-b border-[#E2D9C8] bg-[#ECE6D8]">
                <img
                  src={item.thumbnail}
                  alt={item.headline}
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>
            )}

            <div className="p-5 sm:p-7">
              <p className="text-[11px] font-mono uppercase tracking-[0.13em] text-[#5B6660] tabular-nums">
                {item.publicationName} · Sample Date:{' '}
                {formatPublicationDate(item)}
              </p>
              <h2
                id="digital-preview-title"
                className="mt-2 font-serif text-[24px] sm:text-[28px] font-bold leading-[1.2] text-[#142019]"
              >
                {item.headline}
              </h2>
              <p className="mt-3.5 text-[15px] leading-[1.75] text-[#3F4A44]">
                {item.description}
              </p>

              <div className="mt-6 pt-4 border-t border-[#E2D9C8] flex items-start gap-2.5 text-[13px] text-[#545F59]">
                <Info className="w-4 h-4 text-[#9A3B1E] shrink-0 mt-0.5" />
                <p>
                  External link is disabled on demonstration records so visitors
                  are never directed to a fabricated news website. Verified
                  Garad Foundation article entries will open the original
                  publisher in a new tab.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
