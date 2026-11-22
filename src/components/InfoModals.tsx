import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Handshake,
  HeartHandshake,
  MapPin,
  Users,
  X,
} from 'lucide-react';
import { ActivityMedia } from '../data/activities';
import { EASE_EDITORIAL, ResilientImage } from './motion/MotionPrimitives';

/* ---------------------- Photo Lightbox Modal ---------------------- */
interface LightboxModalProps {
  mediaItems: ActivityMedia[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export function LightboxModal({
  mediaItems,
  activeIndex,
  onClose,
  onChangeIndex,
}: LightboxModalProps) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        onChangeIndex((activeIndex + 1) % mediaItems.length);
      }
      if (e.key === 'ArrowLeft') {
        onChangeIndex((activeIndex - 1 + mediaItems.length) % mediaItems.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, mediaItems.length, onClose, onChangeIndex]);

  const current = activeIndex !== null ? mediaItems[activeIndex] : null;

  return (
    <AnimatePresence>
      {current && current.imagePath && activeIndex !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Photograph lightbox: ${current.caption}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#081911]/88 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.28, ease: EASE_EDITORIAL }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#10241A] rounded-2xl overflow-hidden border border-white/12 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-white/10 text-white">
              <div className="flex flex-wrap items-center gap-2.5 text-sm font-medium min-w-0">
                <span className="font-mono text-xs text-[#E3A63A] shrink-0">
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(mediaItems.length).padStart(2, '0')}
                </span>
                <span className="text-white/90 truncate max-w-[200px] sm:max-w-md">
                  {current.dateRecorded || 'Archival Photograph'}
                </span>
                {current.imageType === 'sample' && (
                  <span className="inline-flex items-center gap-1.5 rounded bg-[#E3A63A]/16 border border-[#E3A63A]/45 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F7D794] shrink-0">
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rounded-full bg-[#E3A63A]"
                    />
                    ILLUSTRATIVE IMAGE
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close lightbox"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative bg-black/40 aspect-[16/10] w-full flex items-center justify-center overflow-hidden">
              <ResilientImage
                src={current.imagePath}
                alt={current.alt}
                loading="eager"
                className="w-full h-full object-contain"
              />

              {current.imageType === 'sample' && (
                <span className="pointer-events-none select-none absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded bg-[#0A2217]/84 backdrop-blur-sm border border-white/22 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#FAF6EE] shadow-sm">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#E3A63A]"
                  />
                  ILLUSTRATIVE IMAGE
                </span>
              )}

              {mediaItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      onChangeIndex(
                        (activeIndex - 1 + mediaItems.length) % mediaItems.length
                      )
                    }
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#081911]/75 hover:bg-[#081911] text-white border border-white/15 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onChangeIndex((activeIndex + 1) % mediaItems.length)
                    }
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#081911]/75 hover:bg-[#081911] text-white border border-white/15 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="px-5 py-4 text-[13px] text-[#D7E3DC] leading-relaxed">
              <p>{current.caption}</p>
              {current.locationRecorded && (
                <p className="mt-1 text-xs text-white/65">
                  {current.locationRecorded}
                </p>
              )}
              {current.imageType === 'sample' && (
                <p className="mt-2 text-[11px] text-[#E8D2A6]/85">
                  Illustrative sample preview image — not an original Garad Foundation event photograph.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------------- Editorial Info Dialog ---------------------- */
export type EditorialDialogType =
  | null
  | { kind: 'section'; section: 'impact' | 'stories' | 'about' | 'portal' };

interface EditorialModalProps {
  dialog: EditorialDialogType;
  onClose: () => void;
  onNavigateActivity: (slug: string) => void;
  onNavigateReports: () => void;
  onNavigateCsr: () => void;
  onNavigateVolunteer: () => void;
  onNavigateDonate: () => void;
}

export function EditorialModal({
  dialog,
  onClose,
  onNavigateActivity,
  onNavigateReports,
  onNavigateCsr,
  onNavigateVolunteer,
  onNavigateDonate,
}: EditorialModalProps) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!dialog) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [dialog, onClose]);

  return (
    <AnimatePresence>
      {dialog && (
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#0D1E16]/55 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.28, ease: EASE_EDITORIAL }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-[#FAF8F4] border border-[#E5DDD0] shadow-2xl p-6 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A3B1E]">
                  <MapPin className="w-3.5 h-3.5" />
                  Garad Foundation · Thane, Maharashtra
                </span>
                <h3 className="mt-1 font-serif text-2xl font-bold text-[#171C19]">
                  {dialog.section === 'impact' && 'Documented Archive Highlights'}
                  {dialog.section === 'stories' && 'Activity Reports & Stories'}
                  {dialog.section === 'about' && 'About Garad Foundation'}
                  {dialog.section === 'portal' && 'About This Digital Archive'}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-white border border-[#E4DDD0] text-[#4E5751] hover:text-[#171C19] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {dialog.section === 'impact' && (
                <>
                  <p className="text-[13.5px] leading-relaxed text-[#555E58]">
                    Summary figures documented in the 2020–21 edition of the
                    Garad Foundation Activity Report 2020–2026:
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3.5 rounded-xl bg-white border border-[#EAE4D8]">
                      <div className="font-serif text-xl font-bold text-[#171C19] tabular-nums">
                        175 Boxes
                      </div>
                      <div className="text-[11px] text-[#6A736E] mt-0.5">
                        Utsavachi Shidori (Thane)
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white border border-[#EAE4D8]">
                      <div className="font-serif text-xl font-bold text-[#9A3B1E] tabular-nums">
                        200 Reached
                      </div>
                      <div className="text-[11px] text-[#6A736E] mt-0.5">
                        Mamnoli Hygiene Drive
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white border border-[#EAE4D8]">
                      <div className="font-serif text-xl font-bold text-[#171C19] tabular-nums">
                        220 Students
                      </div>
                      <div className="text-[11px] text-[#6A736E] mt-0.5">
                        Mission Bharari · 10 Schools (Reported)
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white border border-[#EAE4D8]">
                      <div className="font-serif text-xl font-bold text-[#9A3B1E] tabular-nums">
                        50+ Youth
                      </div>
                      <div className="text-[11px] text-[#6A736E] mt-0.5">
                        Essay, Video &amp; Marathi Contests
                      </div>
                    </div>
                  </div>
                </>
              )}

              {dialog.section === 'stories' && (
                <>
                  <p className="text-[13.5px] leading-relaxed text-[#555E58]">
                    Every documented activity from 2020–21 now has its own
                    full-length archival report page covering why it began, what
                    volunteers did, documented outputs, and reflection.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateActivity('mission-bharari-phase-1');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#9A3B1E] hover:bg-[#843016] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>Mission Bharari – Phase 1</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateActivity('utsavachi-shidori');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D3021] hover:bg-[#16402E] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>Utsavachi Shidori</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}

              {(dialog.section === 'about' || dialog.section === 'portal') && (
                <>
                  <p className="text-[13.5px] leading-relaxed text-[#555E58]">
                    Garad Foundation is a youth-driven nonprofit organisation
                    based in Thane, Maharashtra. This digital archive publishes
                    documented records from the Garad Foundation Activity Report
                    2020–2026—prioritising factual accuracy, safeguarding, and
                    transparent grassroots storytelling.
                  </p>
                  <div className="pt-1 flex flex-wrap items-center gap-2.5">
                    <a
                      href="/volunteer"
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
                          return;
                        }
                        e.preventDefault();
                        onClose();
                        onNavigateVolunteer();
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#174C38] hover:bg-[#103A2B] text-white text-xs font-semibold transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Be a Volunteer</span>
                    </a>
                    <a
                      href="/csr-partnerships"
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
                          return;
                        }
                        e.preventDefault();
                        onClose();
                        onNavigateCsr();
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D3021] hover:bg-[#16402E] text-white text-xs font-semibold transition-colors"
                    >
                      <Handshake className="w-3.5 h-3.5" />
                      <span>CSR Partnerships</span>
                    </a>
                    <a
                      href="/reports"
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
                          return;
                        }
                        e.preventDefault();
                        onClose();
                        onNavigateReports();
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-[#F3EDE2] border border-[#DDD5C7] text-[#171C19] text-xs font-semibold transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#9A3B1E]" />
                      <span>Reports &amp; Publications</span>
                    </a>
                    <a
                      href="/donate"
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
                          return;
                        }
                        e.preventDefault();
                        onClose();
                        onNavigateDonate();
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#9A3B1E] hover:bg-[#843016] text-white text-xs font-semibold transition-colors"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Support Our Initiatives</span>
                    </a>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
