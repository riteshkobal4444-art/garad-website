import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  HERO_FEATURED_INITIATIVES,
  HeroInitiativeSlide,
} from '../../data/homepage';
import { EASE_EDITORIAL, ResilientImage } from '../motion/MotionPrimitives';

interface HeroInitiativesCarouselProps {
  onExploreInitiative: (destination: HeroInitiativeSlide['destination']) => void;
  onDiscoverWork: () => void;
  onBePartOfGarad: () => void;
}

const AUTOPLAY_INTERVAL_MS = 7500;

export function HeroInitiativesCarousel({
  onExploreInitiative,
  onDiscoverWork,
  onBePartOfGarad,
}: HeroInitiativesCarouselProps) {
  const prefersReduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = HERO_FEATURED_INITIATIVES.length;
  const activeSlide = HERO_FEATURED_INITIATIVES[activeIndex];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (prefersReduced || isPaused) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setActiveIndex((prev) => (prev + 1) % totalSlides);
      }
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [prefersReduced, isPaused, totalSlides]);

  return (
    <section
      aria-label="Garad Foundation featured initiatives hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      className="relative w-full min-h-[660px] sm:min-h-[700px] lg:min-h-[780px] bg-[#081C13] text-[#FAF8F4] overflow-hidden flex flex-col justify-between"
    >
      {/* Full-Bleed Cinematic Slide Photography with Subtle Ken Burns Motion */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: prefersReduced ? 1 : 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.85, ease: EASE_EDITORIAL },
              scale: { duration: 7.2, ease: 'easeOut' },
            }}
            className="absolute inset-0"
          >
            <ResilientImage
              src={activeSlide.image.src}
              alt={activeSlide.image.alt}
              loading="eager"
              style={{
                objectPosition: activeSlide.image.objectPosition || 'center 30%',
              }}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Measured Editorial Contrast Scrims (guarantees WCAG AA/AAA text legibility) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#071911]/92 via-[#092116]/72 to-[#092116]/32"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#071911]/95 via-[#071911]/25 to-[#071911]/55"
        />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-10 sm:pb-14 flex-1 flex flex-col justify-between gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end my-auto">
          {/* Left Primary Editorial Lockup */}
          <div className="lg:col-span-7">
            <motion.p
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
              className="text-[12px] sm:text-[13px] font-semibold tracking-[0.14em] text-[#E8BC66]"
            >
              Garad Foundation · Thane, Maharashtra
            </motion.p>

            <motion.h1
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.06, ease: EASE_EDITORIAL }}
              className="mt-4 font-serif text-[40px] sm:text-[54px] lg:text-[66px] font-bold leading-[1.04] tracking-[-0.025em] text-[#FAF8F4] text-balance"
            >
              Small Actions.
              <br />
              Big Change.
            </motion.h1>

            <motion.p
              initial={prefersReduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.14, ease: EASE_EDITORIAL }}
              className="mt-5 text-[16px] sm:text-[17.5px] leading-[1.68] text-[#DCE6E0] max-w-[54ch]"
            >
              Together, we create opportunities for young people, support
              communities and build a brighter future through meaningful action.
            </motion.p>

            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE_EDITORIAL }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <button
                type="button"
                onClick={onDiscoverWork}
                className="min-h-[48px] inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-xl bg-[#E3A63A] hover:bg-[#D5972C] text-[#0D2118] text-[14.5px] font-semibold shadow-[0_14px_30px_-10px_rgba(227,166,58,0.45)] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A63A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081C13]"
              >
                <span>Discover Our Work</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onBePartOfGarad}
                className="min-h-[48px] inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/18 border border-white/25 text-[#FAF8F4] text-[14.5px] font-semibold backdrop-blur-sm transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <span>Be Part of Garad</span>
              </button>
            </motion.div>
          </div>

          {/* Right Featured Initiative Editorial Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-[#0B2318]/84 backdrop-blur-md border border-white/14 p-6 sm:p-7 shadow-[0_24px_54px_-24px_rgba(0,0,0,0.65)]">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/12">
                <p className="text-[12px] font-medium text-[#C8D8CE]">
                  Featured Initiative{' '}
                  <span className="font-mono text-[#E8BC66] tabular-nums ml-1">
                    {activeSlide.indexLabel} / 0{totalSlides}
                  </span>
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous featured initiative"
                    className="w-9 h-9 rounded-lg border border-white/18 bg-white/6 hover:bg-white/16 text-[#FAF8F4] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A63A]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next featured initiative"
                    className="w-9 h-9 rounded-lg border border-white/18 bg-white/6 hover:bg-white/16 text-[#FAF8F4] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A63A]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.36, ease: EASE_EDITORIAL }}
                  className="pt-5"
                >
                  <p className="text-[12px] font-medium text-[#E8BC66]">
                    {activeSlide.category}
                  </p>

                  <h2 className="mt-2 font-serif text-[26px] sm:text-[30px] font-bold text-[#FAF8F4] leading-[1.15]">
                    {activeSlide.title}
                  </h2>

                  <p className="mt-3 text-[14.5px] sm:text-[15px] leading-[1.65] text-[#D7E3DC]">
                    {activeSlide.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onExploreInitiative(activeSlide.destination)}
                      className="min-h-[42px] inline-flex items-center gap-2 text-[14px] font-semibold text-[#FAF8F4] hover:text-[#E8BC66] transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A63A] rounded-md"
                    >
                      <span>{activeSlide.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>

                    {activeSlide.image.imageType === 'sample' && (
                      <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#C7D4CC]/75">
                        Illustrative Image
                      </span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom 3-Initiative Interactive Selector Strip */}
        <div
          role="tablist"
          aria-label="Select featured initiative slide"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 pt-6 border-t border-white/14"
        >
          {HERO_FEATURED_INITIATIVES.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIndex(idx)}
                className={`group text-left py-2.5 px-3 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A63A] ${
                  isActive
                    ? 'bg-white/10'
                    : 'hover:bg-white/6'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[13px] font-semibold transition-colors ${
                      isActive
                        ? 'text-[#FAF8F4]'
                        : 'text-[#C2D0C8] group-hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-[11.5px] text-[#E8BC66] mr-2 tabular-nums">
                      {slide.indexLabel}
                    </span>
                    {slide.title}
                  </span>
                  <span className="text-[11.5px] text-[#A9BCB0] hidden md:inline truncate">
                    {slide.category}
                  </span>
                </div>
                <div className="mt-2.5 h-[2px] w-full bg-white/14 rounded-full overflow-hidden">
                  {isActive && (
                    <motion.div
                      key={`progress-${slide.id}-${isPaused ? 'paused' : 'run'}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration:
                          prefersReduced || isPaused
                            ? 0.2
                            : AUTOPLAY_INTERVAL_MS / 1000,
                        ease: 'linear',
                      }}
                      style={{ transformOrigin: 'left center' }}
                      className="h-full bg-[#E3A63A]"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
