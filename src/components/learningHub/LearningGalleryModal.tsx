import React, { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Film, X } from 'lucide-react';
import { LearningGalleryItem } from '../../data/learningHub';
import { EASE_EDITORIAL } from '../motion/MotionPrimitives';

interface LearningGalleryModalProps {
  items: LearningGalleryItem[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export function LearningGalleryModal({
  items,
  activeIndex,
  onClose,
  onChangeIndex,
}: LearningGalleryModalProps) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        onChangeIndex((activeIndex + 1) % items.length);
      }
      if (e.key === 'ArrowLeft') {
        onChangeIndex((activeIndex - 1 + items.length) % items.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, items.length, onClose, onChangeIndex]);

  const current = activeIndex !== null ? items[activeIndex] : null;

  return (
    <AnimatePresence>
      {current && activeIndex !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.themeLabel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#081A11]/88 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.24, ease: EASE_EDITORIAL }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-2xl bg-[#10261B] border border-white/14 shadow-2xl overflow-hidden"
          >
            {/* Header Bar */}
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between gap-3 text-white">
              <div className="flex flex-wrap items-center gap-2.5 text-[13px] min-w-0">
                <span className="font-mono text-xs text-[#E3A63A] tabular-nums">
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(items.length).padStart(2, '0')}
                </span>
                <span className="font-semibold text-white/95 truncate">
                  {current.themeLabel}
                </span>
                {current.image.imageType === 'sample' && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#F2CF88]">
                    · Illustrative Preview
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close media viewer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewer Body */}
            <div className="relative bg-black/45 aspect-[16/10] w-full flex items-center justify-center overflow-hidden">
              {current.kind === 'video-preview' && current.videoUrl ? (
                <video
                  src={current.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : current.kind === 'video-preview' ? (
                <div className="relative w-full h-full">
                  <img
                    src={current.image.src}
                    alt={current.image.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                    <div className="w-14 h-14 rounded-2xl bg-[#0D3021]/90 border border-[#E3A63A]/45 flex items-center justify-center">
                      <Film className="w-6 h-6 text-[#E3A63A]" />
                    </div>
                    <h3 className="mt-4 font-serif text-[22px] font-bold">
                      {current.themeLabel}
                    </h3>
                    <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-white/80">
                      {current.previewNote}
                    </p>
                  </div>
                </div>
              ) : (
                <img
                  src={current.image.src}
                  alt={current.image.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              )}

              {current.image.imageType === 'sample' && (
                <span className="pointer-events-none select-none absolute bottom-3 left-3 rounded bg-[#0A2217]/86 border border-white/20 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FAF8F4]">
                  ILLUSTRATIVE IMAGE
                </span>
              )}

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      onChangeIndex(
                        (activeIndex - 1 + items.length) % items.length
                      )
                    }
                    aria-label="Previous gallery item"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#081A11]/75 hover:bg-[#081A11] text-white border border-white/15 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeIndex((activeIndex + 1) % items.length)}
                    aria-label="Next gallery item"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#081A11]/75 hover:bg-[#081A11] text-white border border-white/15 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Footer Note */}
            <div className="px-5 py-4 text-[13px] leading-relaxed text-[#D7E4DC]">
              <p>{current.previewNote}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
