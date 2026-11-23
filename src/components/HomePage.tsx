import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
} from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Expand,
  FileText,
  Handshake,
  HeartHandshake,
  Newspaper,
  Quote,
  Users,
} from 'lucide-react';
import { ActivityMedia } from '../data/activities';
import { LEARNING_PROGRAMMES } from '../data/learningHub';
import { VERIFIED_MEDIA_COVERAGE_ITEMS } from '../data/mediaCoverage';
import {
  COMMUNITY_REFLECTION_HIGHLIGHTS,
  GARAD_CONTACT_INFO,
  GARAD_STORY_AND_VISION,
  GaradUniverseLandmark,
  HeroInitiativeSlide,
  HOMEPAGE_FEATURED_ACTIVITIES,
  HOMEPAGE_GALLERY_ITEMS,
  JOIN_JOURNEY_IMAGE,
  VERIFIED_IMPACT_STATS,
  VERIFIED_TESTIMONIALS,
} from '../data/homepage';
import { usePageSeo } from '../utils/seo';
import { HeroInitiativesCarousel } from './home/HeroInitiativesCarousel';
import { GaradUniversePreview } from './home/GaradUniversePreview';
import {
  Gullak3D,
  IdeaBulb3D,
  NotebookPencil3D,
} from './learningHub/LearningObjects3D';
import { EASE_EDITORIAL, ResilientImage } from './motion/MotionPrimitives';

interface HomePageProps {
  onNavigateAbout: () => void;
  onNavigateUniverse: () => void;
  onNavigateArchive: () => void;
  onNavigateActivity: (slug: string) => void;
  onNavigateLearningHub: () => void;
  onNavigateLearningProgramme: (slug: string) => void;
  onNavigateNews: () => void;
  onNavigateVolunteer: () => void;
  onNavigateDonate: () => void;
  onNavigateCsr: () => void;
  onNavigateCsrProject: (slug: string) => void;
  onNavigateReports: () => void;
  onOpenLightbox: (mediaItems: ActivityMedia[], index: number) => void;
}

/**
 * Lightweight viewport-triggered numeric count-up for verified impact figures.
 * Immediately displays the exact verified number under prefers-reduced-motion.
 */
function ImpactNumberReveal({
  value,
  suffix = '',
  fallbackDisplay,
}: {
  value: number;
  suffix?: string;
  fallbackDisplay: string;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.45 });
  const [display, setDisplay] = useState<string>(
    prefersReduced ? fallbackDisplay : '0'
  );

  useEffect(() => {
    if (prefersReduced) {
      setDisplay(fallbackDisplay);
      return;
    }
    if (!isInView) return;

    const durationMs = 950;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * value);
      setDisplay(`${current}${suffix}`);
      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        setDisplay(fallbackDisplay);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [isInView, prefersReduced, value, suffix, fallbackDisplay]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

export function HomePage({
  onNavigateAbout,
  onNavigateUniverse,
  onNavigateArchive,
  onNavigateActivity,
  onNavigateLearningHub,
  onNavigateLearningProgramme,
  onNavigateNews,
  onNavigateVolunteer,
  onNavigateDonate,
  onNavigateCsr,
  onNavigateCsrProject,
  onNavigateReports,
  onOpenLightbox,
}: HomePageProps) {
  const prefersReduced = useReducedMotion();
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'NGO',
      name: GARAD_CONTACT_INFO.organisationName,
      url: GARAD_CONTACT_INFO.officialWebsiteUrl,
      email: GARAD_CONTACT_INFO.email,
      telephone: GARAD_CONTACT_INFO.phoneDisplay,
      description: GARAD_CONTACT_INFO.summary,
      address: {
        '@type': 'PostalAddress',
        streetAddress:
          'Shop No. 2, Saraswati Nivas CHS, Atre Katta, M.G. Road, Naupada',
        addressLocality: 'Thane West',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
    }),
    []
  );

  usePageSeo({
    title: 'Garad Foundation — Small Actions. Big Change.',
    description: GARAD_CONTACT_INFO.summary,
    type: 'website',
    structuredData,
  });

  // Core 3 named Learning Hub programmes (Sabse Bada Rupaiya, Shiv Shala, Youth Leadership Program)
  const featuredProgrammes = useMemo(
    () => LEARNING_PROGRAMMES.filter((p) => p.kind === 'programme').slice(0, 3),
    []
  );

  // Up to 3 verified media records (never uses fictional demo headlines on homepage)
  const verifiedPressPreview = useMemo(
    () => VERIFIED_MEDIA_COVERAGE_ITEMS.filter((item) => !item.isDemo).slice(0, 3),
    []
  );

  const handleHeroInitiativeClick = (
    destination: HeroInitiativeSlide['destination']
  ) => {
    if (destination.kind === 'activity') {
      onNavigateActivity(destination.slug);
    } else {
      onNavigateCsrProject(destination.slug);
    }
  };

  const handleUniverseLandmarkDestination = (
    destination: GaradUniverseLandmark['destination']
  ) => {
    switch (destination.kind) {
      case 'activity':
        onNavigateActivity(destination.slug);
        break;
      case 'csr-project':
        onNavigateCsrProject(destination.slug);
        break;
      case 'learning-hub':
        onNavigateLearningHub();
        break;
      case 'volunteer':
        onNavigateVolunteer();
        break;
      default:
        onNavigateArchive();
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  const hasVerifiedTestimonials = VERIFIED_TESTIMONIALS.length > 0;
  const activeTestimonial = hasVerifiedTestimonials
    ? VERIFIED_TESTIMONIALS[testimonialIndex % VERIFIED_TESTIMONIALS.length]
    : null;

  return (
    <main className="bg-[#FAF8F4] text-[#171C19]">
      {/* =====================================================================
          01 — HERO SECTION: THREE FEATURED INITIATIVES CAROUSEL
      ====================================================================== */}
      <HeroInitiativesCarousel
        onExploreInitiative={handleHeroInitiativeClick}
        onDiscoverWork={() => scrollToSection('our-activities')}
        onBePartOfGarad={() => scrollToSection('join-garad')}
      />

      {/* =====================================================================
          02 — ABOUT GARAD & OUR VISION
      ====================================================================== */}
      <section
        id="about-garad"
        aria-labelledby="about-garad-heading"
        className="py-20 sm:py-24 lg:py-28 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left Narrative Column */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: EASE_EDITORIAL }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <p className="text-[12px] font-semibold tracking-[0.14em] text-[#9A3B1E]">
              {GARAD_STORY_AND_VISION.aboutEyebrow}
            </p>
            <h2
              id="about-garad-heading"
              className="mt-3 font-serif text-[32px] sm:text-[40px] lg:text-[44px] font-bold leading-[1.1] tracking-[-0.02em] text-[#142019] text-balance"
            >
              {GARAD_STORY_AND_VISION.aboutHeading}
            </h2>

            <p className="mt-6 text-[16px] sm:text-[17px] leading-[1.72] text-[#2E3832] max-w-[58ch]">
              {GARAD_STORY_AND_VISION.aboutLead}
            </p>

            <p className="mt-4 text-[15px] leading-[1.72] text-[#555E58] max-w-[58ch]">
              {GARAD_STORY_AND_VISION.aboutSupporting}
            </p>

            <div className="mt-7 pt-6 border-t border-[#E6DFD2] flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-medium text-[#555E58]">
              <span>Youth-Led</span>
              <span aria-hidden="true">·</span>
              <span>Volunteer-Driven</span>
              <span aria-hidden="true">·</span>
              <span>Rooted in Thane &amp; Rural Maharashtra</span>
            </div>
          </motion.div>

          {/* Right Documentary Volunteer Photograph */}
          <motion.figure
            initial={prefersReduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE_EDITORIAL }}
            className="lg:col-span-6 flex flex-col"
          >
            <div className="relative flex-1 min-h-[300px] sm:min-h-[380px] rounded-3xl overflow-hidden bg-[#E7E0D3] border border-[#E2DACB] shadow-[0_24px_48px_-28px_rgba(13,48,33,0.34)]">
              <ResilientImage
                src={GARAD_STORY_AND_VISION.aboutImage.src}
                alt={GARAD_STORY_AND_VISION.aboutImage.alt}
                style={{
                  objectPosition:
                    GARAD_STORY_AND_VISION.aboutImage.objectPosition,
                }}
                className="w-full h-full object-cover"
              />
              {GARAD_STORY_AND_VISION.aboutImage.imageType === 'sample' && (
                <span className="pointer-events-none select-none absolute bottom-3 left-3 rounded bg-[#0A2217]/80 backdrop-blur-sm border border-white/18 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#FAF8F4]">
                  Illustrative Image
                </span>
              )}
            </div>
            <figcaption className="mt-3 text-[12.5px] font-serif italic text-[#636D67]">
              {GARAD_STORY_AND_VISION.aboutImage.caption}
            </figcaption>
          </motion.figure>
        </div>

        {/* Distinct Editorial Vision Composition */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: EASE_EDITORIAL }}
          className="mt-16 sm:mt-20 rounded-3xl bg-[#0D3021] text-[#FAF8F4] px-6 sm:px-10 lg:px-16 py-12 sm:py-16 relative overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 w-72 h-72 rounded-full bg-[#E3A63A]/10 blur-3xl"
          />

          <div className="relative z-10 max-w-4xl">
            <p className="text-[12px] font-semibold tracking-[0.16em] text-[#E8BC66]">
              {GARAD_STORY_AND_VISION.visionEyebrow}
            </p>
            <div className="mt-5 h-px w-16 bg-[#E3A63A]/60" />

            <blockquote className="mt-6 font-serif text-[24px] sm:text-[32px] lg:text-[38px] font-normal italic leading-[1.32] text-[#FAF8F4] text-balance">
              &ldquo;{GARAD_STORY_AND_VISION.visionStatement}&rdquo;
            </blockquote>

            <div className="mt-9 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/14">
              <p className="text-[13.5px] text-[#C6D6CC]">
                Garad Foundation · Youth Empowerment &amp; Grassroots Nation-Building
              </p>

              <button
                type="button"
                onClick={onNavigateAbout}
                className="min-h-[46px] inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-[#FAF8F4] hover:bg-[#EFE9DC] text-[#0D3021] text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A63A]"
              >
                <span>Know Our Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =====================================================================
          03 — EXPLORE GARAD UNIVERSE (SIGNATURE ANIMATED SECTION)
      ====================================================================== */}
      <GaradUniversePreview
        onExploreUniverse={onNavigateUniverse}
        onSelectLandmarkDestination={handleUniverseLandmarkDestination}
      />

      {/* =====================================================================
          04 — GARAD LEARNING HUB / TRAINING & SESSIONS PREVIEW
      ====================================================================== */}
      <section
        id="learning-hub-preview"
        aria-labelledby="learning-hub-preview-heading"
        className="py-20 sm:py-24 lg:py-28 bg-[#F4F0E7]/70 border-y border-[#E6DFD2]"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
              className="lg:col-span-7"
            >
              <p className="text-[12px] font-semibold tracking-[0.14em] text-[#0D3021]">
                Garad Learning Hub · Learn. Lead. Grow.
              </p>
              <h2
                id="learning-hub-preview-heading"
                className="mt-3 font-serif text-[32px] sm:text-[42px] font-bold leading-[1.1] tracking-[-0.02em] text-[#142019] text-balance"
              >
                Learning Beyond Classrooms.
              </h2>
              <p className="mt-4 text-[15.5px] sm:text-[16.5px] leading-[1.68] text-[#4E5852] max-w-[58ch]">
                Through interactive training programmes, workshops and
                meaningful learning experiences, we help young people develop
                the knowledge, confidence and skills to grow.
              </p>
            </motion.div>

            {/* Subtle 3D Educational Motifs Row (Desktop Editorial Accent) */}
            <div className="lg:col-span-5 hidden sm:flex items-center justify-start lg:justify-end gap-5">
              <div className="scale-90 origin-bottom">
                <Gullak3D />
              </div>
              <div className="scale-90 origin-bottom">
                <NotebookPencil3D />
              </div>
              <div className="scale-90 origin-bottom">
                <IdeaBulb3D />
              </div>
            </div>
          </div>

          {/* 3 Distinct Programme Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {featuredProgrammes.map((programme, idx) => {
              const accentSurface =
                programme.accentTone === 'gold'
                  ? 'bg-[#FFFDF9] border-[#E7DCC4]'
                  : programme.accentTone === 'forest'
                    ? 'bg-[#FFFFFF] border-[#D9E4DC]'
                    : 'bg-[#FBFBF9] border-[#DFE4DC]';

              const accentMetaColor =
                programme.accentTone === 'gold'
                  ? 'text-[#9A6314]'
                  : programme.accentTone === 'forest'
                    ? 'text-[#0D3021]'
                    : 'text-[#3F5D4E]';

              return (
                <motion.article
                  key={programme.id}
                  initial={prefersReduced ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.08,
                    ease: EASE_EDITORIAL,
                  }}
                  className={`group rounded-2xl border overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-[0_22px_46px_-26px_rgba(13,48,33,0.3)] ${accentSurface}`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E5DEC9]">
                    <ResilientImage
                      src={programme.image.src}
                      alt={programme.image.alt}
                      style={{
                        objectPosition:
                          programme.image.objectPosition || 'center 28%',
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                    {programme.image.imageType === 'sample' && (
                      <span className="pointer-events-none select-none absolute bottom-3 left-3 rounded bg-[#0A2217]/80 backdrop-blur-sm border border-white/18 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.11em] text-[#FAF8F4]">
                        Illustrative Image
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    {/* Unboxed clean typographic metadata */}
                    <p
                      className={`text-[12px] font-semibold ${accentMetaColor}`}
                    >
                      {programme.category
                        ? `${programme.category}${programme.status ? ` · ${programme.status}` : ''}`
                        : 'Garad Foundation Programme'}
                    </p>

                    <h3 className="mt-2 font-serif text-[22px] font-bold text-[#142019] leading-[1.2] group-hover:text-[#0D3021] transition-colors">
                      {programme.name}
                    </h3>

                    <p className="mt-3 text-[14.5px] leading-[1.65] text-[#525C56] flex-1">
                      {programme.cardSummary}
                    </p>

                    {programme.slug === 'sabse-bada-rupaiya' && (
                      <p className="mt-3 pt-3 border-t border-[#ECE4D4] text-[12.5px] text-[#66706A]">
                        Standards VII–X · Saving, budgeting, goal-setting,
                        banking &amp; digital payment safety (Phase 1 concept
                        note)
                      </p>
                    )}

                    <div className="mt-5 pt-4 border-t border-[#ECE6DA]">
                      <button
                        type="button"
                        onClick={() =>
                          onNavigateLearningProgramme(programme.slug)
                        }
                        className="min-h-[40px] inline-flex items-center gap-2 text-[13.5px] font-semibold text-[#0D3021] hover:text-[#9A3B1E] transition-colors cursor-pointer group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D3021] rounded-md"
                      >
                        <span>Explore Programme</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Learning Hub Section CTA */}
          <div className="mt-10 sm:mt-12 flex justify-center sm:justify-start">
            <button
              type="button"
              onClick={onNavigateLearningHub}
              className="min-h-[48px] inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-[#FAF8F4] text-[14.5px] font-semibold shadow-[0_12px_26px_-12px_rgba(13,48,33,0.45)] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D3021] focus-visible:ring-offset-2"
            >
              <BookOpen className="w-4 h-4 text-[#E3A63A]" />
              <span>Explore All Learning Experiences</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          05 — OUR ACTIVITIES: MANDATORY STANDALONE HOMEPAGE SECTION
          (EXACTLY 3 ACTIVITY CARDS + VIEW ALL ACTIVITIES BUTTON DIRECTLY BELOW)
      ====================================================================== */}
      <section
        id="our-activities"
        aria-labelledby="our-activities-heading"
        className="scroll-mt-20 py-20 sm:py-24 lg:py-28 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
          className="max-w-2xl"
        >
          <p className="text-[12px] font-semibold tracking-[0.16em] uppercase text-[#9A3B1E]">
            Our Activities
          </p>
          <h2
            id="our-activities-heading"
            className="mt-3 font-serif text-[34px] sm:text-[44px] font-bold leading-[1.09] tracking-[-0.02em] text-[#142019] text-balance"
          >
            Small Actions. Meaningful Change.
          </h2>
          <p className="mt-4 text-[16px] leading-[1.68] text-[#525C56]">
            From educational initiatives to community development, every
            activity is a step towards creating a positive difference.
          </p>
        </motion.div>

        {/* Exactly Three Featured Activity Cards in One Row on Desktop */}
        <div
          data-testid="homepage-our-activities-grid"
          className="mt-11 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {HOMEPAGE_FEATURED_ACTIVITIES.slice(0, 3).map((activity, idx) => (
            <motion.article
              key={activity.slug}
              initial={prefersReduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.08,
                ease: EASE_EDITORIAL,
              }}
              className="group rounded-2xl bg-white border border-[#E5DDD0] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_46px_-24px_rgba(13,48,33,0.26)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE2D4]">
                <ResilientImage
                  src={activity.image.src}
                  alt={activity.image.alt}
                  style={{
                    objectPosition:
                      activity.image.objectPosition || 'center 25%',
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                {activity.image.imageType === 'sample' && (
                  <span className="pointer-events-none select-none absolute bottom-3 left-3 rounded bg-[#0A2217]/80 backdrop-blur-sm border border-white/18 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.11em] text-[#FAF8F4]">
                    Illustrative Image
                  </span>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                {/* Clean unboxed typographic metadata */}
                <div className="flex flex-wrap items-center gap-2 text-[12px] font-medium text-[#66706A]">
                  <span className="text-[#9A3B1E] font-semibold">
                    {activity.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activity.dateLabel}</span>
                </div>

                <h3 className="mt-2.5 font-serif text-[24px] font-bold text-[#142019] leading-[1.18] group-hover:text-[#0D3021] transition-colors">
                  {activity.title}
                </h3>

                <p className="mt-3 text-[14.5px] leading-[1.66] text-[#525C56] flex-1">
                  {activity.shortDescription}
                </p>

                <div className="mt-5 pt-4 border-t border-[#EEE8DC] flex items-center justify-between gap-3">
                  <span className="text-[12px] text-[#6B746E] truncate">
                    {activity.location}
                  </span>

                  <button
                    type="button"
                    onClick={() => onNavigateActivity(activity.slug)}
                    className="min-h-[40px] inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#0D3021] hover:text-[#9A3B1E] transition-colors cursor-pointer whitespace-nowrap shrink-0 group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D3021] rounded-md"
                  >
                    <span>Explore Activity</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Mandatory View All Activities Button Immediately Below the Three Cards */}
        <div className="mt-11 flex justify-center">
          <button
            type="button"
            onClick={onNavigateArchive}
            className="min-h-[50px] inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#9A3B1E] hover:bg-[#822F16] text-[#FAF8F4] text-[15px] font-semibold shadow-[0_14px_28px_-12px_rgba(154,59,30,0.48)] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3B1E] focus-visible:ring-offset-2"
          >
            <span>View All Activities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* =====================================================================
          06 — OUR IMPACT (STRICTLY VERIFIED, PERIOD-ATTRIBUTED STATISTICS)
      ====================================================================== */}
      <section
        id="our-impact"
        aria-labelledby="our-impact-heading"
        className="py-20 sm:py-24 bg-[#EEF4F0]/80 border-y border-[#D9E5DD]"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-[12px] font-semibold tracking-[0.14em] text-[#0D3021]">
                Our Impact · Documented Archive Records
              </p>
              <h2
                id="our-impact-heading"
                className="mt-3 font-serif text-[32px] sm:text-[42px] font-bold leading-[1.1] tracking-[-0.02em] text-[#142019] text-balance"
              >
                Every Number Represents a Person.
              </h2>
              <p className="mt-3.5 text-[15.5px] leading-[1.68] text-[#4A5750]">
                Each figure below reflects an individually documented record in
                Garad Foundation&apos;s published activity archive, shown with
                its exact reporting period and initiative context.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onNavigateArchive}
                className="min-h-[46px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-[#FAF8F4] text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Explore Our Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onNavigateReports}
                className="min-h-[46px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F4] border border-[#CFE0D5] text-[#142019] text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-4 h-4 text-[#9A3B1E]" />
                <span>Annual Reports</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {VERIFIED_IMPACT_STATS.map((stat, idx) => (
              <motion.div
                key={stat.id}
                initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.05,
                  ease: EASE_EDITORIAL,
                }}
                className="rounded-2xl bg-white border border-[#DCE7DF] p-6 sm:p-7 flex flex-col justify-between"
              >
                <div className="font-serif text-[38px] sm:text-[44px] font-bold leading-none text-[#0D3021]">
                  <ImpactNumberReveal
                    value={stat.numericValue}
                    suffix={stat.suffix}
                    fallbackDisplay={stat.displayValue}
                  />
                </div>
                <div className="mt-4">
                  <p className="text-[15.5px] font-semibold text-[#171C19]">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#5C6861]">
                    {stat.periodAndSource}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-6 text-[12.5px] text-[#59665F]">
            Reporting integrity note: Figures from separate activities and
            financial years are listed individually rather than merged into
            unverified cumulative totals.
          </p>
        </div>
      </section>

      {/* =====================================================================
          07 — GARAD IN THE NEWS (STRICT ZERO-FABRICATION PRESSROOM PREVIEW)
      ====================================================================== */}
      <section
        id="in-the-news-preview"
        aria-labelledby="in-the-news-heading"
        className="py-20 sm:py-24 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-[12px] font-semibold tracking-[0.14em] text-[#9A3B1E]">
              Garad in the News
            </p>
            <h2
              id="in-the-news-heading"
              className="mt-3 font-serif text-[32px] sm:text-[42px] font-bold leading-[1.1] tracking-[-0.02em] text-[#142019] text-balance"
            >
              Our Work. Their Stories.
            </h2>
            <p className="mt-3.5 text-[15.5px] leading-[1.68] text-[#525C56]">
              Discover the stories, media coverage and moments that bring our
              work to a wider audience.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateNews}
            className="min-h-[46px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#F5F0E6] border border-[#DDD5C7] text-[#142019] text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <Newspaper className="w-4 h-4 text-[#9A3B1E]" />
            <span>View All Media Coverage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {verifiedPressPreview.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verifiedPressPreview.map((item) => (
              <article
                key={item.id}
                onClick={onNavigateNews}
                className="group rounded-2xl bg-white border border-[#E5DDD0] overflow-hidden flex flex-col cursor-pointer hover:shadow-[0_18px_38px_-22px_rgba(13,48,33,0.22)] transition-shadow"
              >
                {item.thumbnail && (
                  <div className="aspect-[16/10] overflow-hidden bg-[#EBE4D6]">
                    <ResilientImage
                      src={item.thumbnail}
                      alt={item.headline}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-[12px] font-medium text-[#66706A]">
                    <span className="capitalize text-[#9A3B1E] font-semibold">
                      {item.type}
                    </span>{' '}
                    · {item.publicationName}
                    {item.publicationDateDisplay || item.publicationDate
                      ? ` · ${item.publicationDateDisplay || item.publicationDate}`
                      : ''}
                  </p>
                  <h3 className="mt-2 font-serif text-[19px] font-bold text-[#142019] leading-snug">
                    {item.headline}
                  </h3>
                  <p className="mt-2 text-[13.5px] text-[#555E58] line-clamp-2 flex-1">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Honest Zero-Fabrication Editorial Pressroom Notice */
          <div className="rounded-3xl bg-[#F5F0E6]/85 border border-[#E3DACB] p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <p className="text-[12px] font-semibold text-[#9A3B1E]">
                Pressroom &amp; Media Archive
              </p>
              <h3 className="mt-2 font-serif text-[24px] sm:text-[28px] font-bold text-[#142019] leading-snug">
                Verified Newspaper Clippings, Digital Articles &amp; Broadcast
                Coverage
              </h3>
              <p className="mt-3 text-[15px] leading-[1.68] text-[#505A54] max-w-[64ch]">
                Our dedicated Garad in the News pressroom is structured for
                verified newspaper cuttings, online articles, and broadcast
                videos. No unverified headlines are published on the homepage—as
                verified press records are archived, they appear here
                automatically.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <button
                type="button"
                onClick={onNavigateNews}
                className="min-h-[48px] inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-[#FAF8F4] text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Open In the News Pressroom</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================================
          08 — STORIES AND GALLERY (ASYMMETRIC DOCUMENTARY PHOTO GRID + LIGHTBOX)
      ====================================================================== */}
      <section
        id="stories-gallery"
        aria-labelledby="stories-gallery-heading"
        className="py-20 sm:py-24 bg-white border-y border-[#E7E0D3]"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-11">
            <div className="max-w-2xl">
              <p className="text-[12px] font-semibold tracking-[0.14em] text-[#0D3021]">
                Stories &amp; Field Moments
              </p>
              <h2
                id="stories-gallery-heading"
                className="mt-3 font-serif text-[32px] sm:text-[42px] font-bold leading-[1.1] tracking-[-0.02em] text-[#142019] text-balance"
              >
                A Closer Look at Our Journey.
              </h2>
              <p className="mt-3 text-[15.5px] leading-[1.66] text-[#555E58]">
                Moments of learning, volunteer teamwork, and community outreach
                across Maharashtra. Select any photograph to view full screen.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenLightbox(HOMEPAGE_GALLERY_ITEMS, 0)}
              className="min-h-[46px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF8F4] hover:bg-[#F2ECE0] border border-[#DDD5C7] text-[#142019] text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap self-start md:self-auto"
            >
              <Expand className="w-4 h-4 text-[#0D3021]" />
              <span>Explore Our Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mixed-Proportion Asymmetric Editorial Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
            {HOMEPAGE_GALLERY_ITEMS.map((item, idx) => {
              // Mixed proportions: 7 + 5 on row 1, 4 + 4 + 4 on row 2? Wait: 6 items -> Row 1: 7 + 5, Row 2: 4 + 4 + 4, wait that's 5! Let's do: Row 1: 7 + 5, Row 2: 4 + 4 + 4 (5 items) -> for 6 items: Row 1: 7 + 5, Row 2: 5 + 7, Row 3: 6 + 6? Even better: Row 1: 7 + 5, Row 2: 4 + 4 + 4? Let's make 6 items into a balanced 2-row rhythm: Row 1: 6 + 3 + 3, Row 2: 3 + 3 + 6!
              const colSpanClass =
                idx === 0 || idx === 5
                  ? 'lg:col-span-6 aspect-[16/10]'
                  : 'lg:col-span-3 aspect-[4/3] lg:aspect-auto lg:min-h-[260px]';

              return (
                <motion.button
                  key={`${item.placeholderLabel}-${idx}`}
                  type="button"
                  onClick={() => onOpenLightbox(HOMEPAGE_GALLERY_ITEMS, idx)}
                  initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.04,
                    ease: EASE_EDITORIAL,
                  }}
                  className={`group relative rounded-2xl overflow-hidden bg-[#EAE2D4] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D3021] focus-visible:ring-offset-2 ${colSpanClass}`}
                >
                  <ResilientImage
                    src={item.imagePath || ''}
                    alt={item.alt}
                    style={{
                      objectPosition: item.objectPosition || 'center 28%',
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  />

                  {/* Subtle bottom scrim for caption */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#081A12]/86 via-[#081A12]/18 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"
                  />

                  {item.imageType === 'sample' && (
                    <span className="pointer-events-none select-none absolute top-3 left-3 rounded bg-[#0A2217]/78 backdrop-blur-sm border border-white/18 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.11em] text-[#FAF8F4]">
                      Illustrative Image
                    </span>
                  )}

                  <span
                    aria-hidden="true"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/45 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Expand className="w-3.5 h-3.5" />
                  </span>

                  <div className="absolute bottom-3.5 inset-x-4">
                    <p className="text-[11px] font-medium text-[#E8BC66]">
                      {item.dateRecorded}
                    </p>
                    <p className="mt-0.5 text-[13.5px] font-semibold text-[#FAF8F4] leading-snug line-clamp-2">
                      {item.caption}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          09 — TESTIMONIALS / VOICES THAT INSPIRE US
      ====================================================================== */}
      <section
        id="voices"
        aria-labelledby="voices-heading"
        className="py-20 sm:py-24 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-2xl mb-11">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-[#9A3B1E]">
            Community Voices
          </p>
          <h2
            id="voices-heading"
            className="mt-3 font-serif text-[32px] sm:text-[42px] font-bold leading-[1.1] tracking-[-0.02em] text-[#142019] text-balance"
          >
            Voices That Inspire Us.
          </h2>
        </div>

        {hasVerifiedTestimonials && activeTestimonial ? (
          <div className="rounded-3xl bg-white border border-[#E5DDD0] p-8 sm:p-12">
            <Quote className="w-8 h-8 text-[#E3A63A]" aria-hidden="true" />
            <blockquote className="mt-5 font-serif text-[22px] sm:text-[28px] italic leading-[1.4] text-[#171C19] max-w-4xl">
              &ldquo;{activeTestimonial.quote}&rdquo;
            </blockquote>
            <div className="mt-7 pt-5 border-t border-[#ECE6DA] flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[15px] font-semibold text-[#142019]">
                  {activeTestimonial.reviewerName}
                </p>
                <p className="text-[13px] text-[#5F6963]">
                  {activeTestimonial.roleOrContext
                    ? `${activeTestimonial.roleOrContext} · `
                    : ''}
                  {activeTestimonial.sourceAttribution}
                </p>
              </div>

              {VERIFIED_TESTIMONIALS.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous testimonial"
                    onClick={() =>
                      setTestimonialIndex(
                        (prev) =>
                          (prev - 1 + VERIFIED_TESTIMONIALS.length) %
                          VERIFIED_TESTIMONIALS.length
                      )
                    }
                    className="w-10 h-10 rounded-xl border border-[#DDD5C7] hover:bg-[#F5F0E6] text-[#142019] flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next testimonial"
                    onClick={() =>
                      setTestimonialIndex(
                        (prev) => (prev + 1) % VERIFIED_TESTIMONIALS.length
                      )
                    }
                    className="w-10 h-10 rounded-xl border border-[#DDD5C7] hover:bg-[#F5F0E6] text-[#142019] flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Authentic Documented Community Reflections (Zero Fabricated Reviews) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMMUNITY_REFLECTION_HIGHLIGHTS.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl bg-white border border-[#E5DDD0] p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <Quote
                    className="w-6 h-6 text-[#D89D37]"
                    aria-hidden="true"
                  />
                  <p className="mt-4 font-serif text-[18px] italic leading-[1.58] text-[#1C2620]">
                    &ldquo;{item.reflection}&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#EFE9DD]">
                  <p className="text-[13.5px] font-semibold text-[#142019]">
                    {item.group}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#66706A]">
                    {item.attribution}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================================
          10 — JOIN THE GARAD JOURNEY (VOLUNTEER / DONATE / PARTNER WITH US)
      ====================================================================== */}
      <section
        id="join-garad"
        aria-labelledby="join-garad-heading"
        className="scroll-mt-20 pb-20 sm:pb-24 lg:pb-28 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl bg-[#0D3021] text-[#FAF8F4] overflow-hidden shadow-[0_30px_68px_-28px_rgba(10,36,24,0.55)]">
          {/* Top Visual + Headline Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 p-7 sm:p-11 lg:p-14 flex flex-col justify-center">
              <p className="text-[12px] font-semibold tracking-[0.16em] text-[#E8BC66]">
                Join the Garad Journey
              </p>
              <h2
                id="join-garad-heading"
                className="mt-3 font-serif text-[34px] sm:text-[44px] lg:text-[48px] font-bold leading-[1.08] tracking-[-0.02em] text-[#FAF8F4] text-balance"
              >
                Be Someone&apos;s Reason to Dream.
              </h2>
              <p className="mt-4 text-[16px] leading-[1.7] text-[#D3E0D8] max-w-[52ch]">
                Every contribution matters. Your time, support and ideas can
                help create opportunities for children, young people and
                communities.
              </p>
            </div>

            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-[340px]">
              <ResilientImage
                src={JOIN_JOURNEY_IMAGE.src}
                alt={JOIN_JOURNEY_IMAGE.alt}
                style={{
                  objectPosition:
                    JOIN_JOURNEY_IMAGE.objectPosition || 'center 30%',
                }}
                className="w-full h-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0D3021] via-[#0D3021]/20 to-transparent"
              />
            </div>
          </div>

          {/* Three Actionable Pathways */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-white/12 divide-y md:divide-y-0 md:divide-x divide-white/12">
            {/* Pathway 1: Volunteer */}
            <div className="p-7 sm:p-9 flex flex-col justify-between bg-[#103827]/75">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/10 text-[#E8BC66] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="mt-4 font-serif text-[22px] font-bold text-[#FAF8F4]">
                  Volunteer
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[#CFE0D6]">
                  Give your time. Share your skills. Make a difference.
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateVolunteer}
                className="mt-6 min-h-[46px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/12 hover:bg-white/20 border border-white/20 text-[#FAF8F4] text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Become a Volunteer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pathway 2: Donate */}
            <div className="p-7 sm:p-9 flex flex-col justify-between bg-[#13402D]/85">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E3A63A]/20 text-[#E8BC66] flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="mt-4 font-serif text-[22px] font-bold text-[#FAF8F4]">
                  Donate
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[#CFE0D6]">
                  Help us create more opportunities through meaningful support.
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateDonate}
                className="mt-6 min-h-[46px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#E3A63A] hover:bg-[#D5972C] text-[#0D2118] text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Support Our Work</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pathway 3: Partner With Us */}
            <div className="p-7 sm:p-9 flex flex-col justify-between bg-[#103827]/75">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/10 text-[#E8BC66] flex items-center justify-center">
                  <Handshake className="w-5 h-5" />
                </div>
                <h3 className="mt-4 font-serif text-[22px] font-bold text-[#FAF8F4]">
                  Partner With Us
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[#CFE0D6]">
                  Let&apos;s work together to create lasting community impact.
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateCsr}
                className="mt-6 min-h-[46px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/12 hover:bg-white/20 border border-white/20 text-[#FAF8F4] text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Partner With Garad</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
