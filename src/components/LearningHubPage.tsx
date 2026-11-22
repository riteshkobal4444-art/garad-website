import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  Maximize2,
  Play,
} from 'lucide-react';
import {
  EnquiryOrganisationType,
  LEARNING_AUDIENCES,
  LEARNING_GALLERY_ITEMS,
  LEARNING_HUB_FAQS,
  LEARNING_PROGRAMMES,
  SESSION_PROCESS_STEPS,
} from '../data/learningHub';
import { LEARNING_HUB_IMAGES } from '../data/learningHubImages';
import { getLearningProgrammePath } from '../utils/router';
import { usePageSeo } from '../utils/seo';
import { EASE_EDITORIAL, Reveal } from './motion/MotionPrimitives';
import {
  Gullak3D,
  IdeaBulb3D,
  LearningPhotoFrame,
  NotebookPencil3D,
} from './learningHub/LearningObjects3D';
import { ProgrammeFinder } from './learningHub/ProgrammeFinder';
import {
  SessionEnquiryForm,
  SessionEnquiryPrefill,
} from './learningHub/SessionEnquiryForm';
import { LearningGalleryModal } from './learningHub/LearningGalleryModal';

interface LearningHubPageProps {
  initialEnquiryPrefill?: {
    programmeOfInterest?: string;
    organisationType?: EnquiryOrganisationType;
    customSessionRequirement?: string;
    scrollToEnquiry?: boolean;
  } | null;
  onNavigateProgramme: (slug: string) => void;
  onNavigateArchive: () => void;
}

export function LearningHubPage({
  initialEnquiryPrefill = null,
  onNavigateProgramme,
  onNavigateArchive,
}: LearningHubPageProps) {
  const prefersReduced = useReducedMotion();
  const [enquiryPrefill, setEnquiryPrefill] =
    useState<SessionEnquiryPrefill | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(
    LEARNING_HUB_FAQS[0]?.id ?? null
  );
  const [galleryActiveIndex, setGalleryActiveIndex] = useState<number | null>(
    null
  );

  usePageSeo({
    title: 'Garad Learning Hub — Learn. Lead. Grow. | Garad Foundation',
    description:
      'Learning experiences that help people grow beyond the classroom. Explore Garad Foundation programmes, workshops, and session enquiries for schools, colleges, corporates, and communities.',
    type: 'website',
  });

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    if (!initialEnquiryPrefill) return;
    setEnquiryPrefill({
      organisationType: initialEnquiryPrefill.organisationType,
      programmeOfInterest: initialEnquiryPrefill.programmeOfInterest,
      customSessionRequirement: initialEnquiryPrefill.customSessionRequirement,
      nonce: Date.now(),
    });
    if (initialEnquiryPrefill.scrollToEnquiry) {
      const timer = setTimeout(() => scrollToSection('request-session'), 180);
      return () => clearTimeout(timer);
    }
  }, [initialEnquiryPrefill]);

  const handleRequestWithPrefill = (prefill: {
    organisationType?: EnquiryOrganisationType;
    programmeOfInterest?: string;
    customSessionRequirement?: string;
  }) => {
    setEnquiryPrefill({
      ...prefill,
      nonce: Date.now(),
    });
    scrollToSection('request-session');
  };

  const handleProgrammeLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    slug: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    onNavigateProgramme(slug);
  };

  const handleArchiveLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    onNavigateArchive();
  };

  const namedProgrammes = LEARNING_PROGRAMMES.filter(
    (p) => p.kind === 'programme'
  );
  const customWorkshopOffering = LEARNING_PROGRAMMES.find(
    (p) => p.kind === 'custom-session'
  );

  return (
    <main className="bg-[#FAF8F4] text-[#171C19] overflow-x-clip">
      {/* ====================================================================
          1. HERO SECTION — FIRST IMPRESSION
         ==================================================================== */}
      <section className="relative pt-10 pb-16 sm:pt-14 sm:pb-22 lg:pt-16 lg:pb-24 border-b border-[#E8E1D4]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-[#EEF4F0]/70 to-transparent"
        />

        <div className="relative max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Editorial Narrative Column */}
            <div className="lg:col-span-6">
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
                className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-[#4C5951]"
              >
                <span className="font-semibold uppercase tracking-[0.14em] text-[#0D3021]">
                  Garad Learning Hub
                </span>
                <span aria-hidden="true" className="text-[#C4BCB0]">
                  ·
                </span>
                <span className="font-medium text-[#9B6615]">
                  Learn. Lead. Grow.
                </span>
                <span aria-hidden="true" className="text-[#C4BCB0]">
                  ·
                </span>
                <span>A Garad Foundation initiative</span>
              </motion.div>

              <motion.h1
                initial={prefersReduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.56, delay: 0.06, ease: EASE_EDITORIAL }}
                className="mt-4 font-serif text-[40px] sm:text-[52px] lg:text-[58px] font-bold tracking-[-0.025em] text-[#171C19] leading-[1.06] [text-wrap:balance]"
              >
                Learning Beyond Classrooms.
              </motion.h1>

              <motion.p
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.56, delay: 0.14, ease: EASE_EDITORIAL }}
                className="mt-5 text-[16.5px] sm:text-[17.5px] leading-[1.7] text-[#49534D] max-w-[54ch]"
              >
                Every learning experience opens a new possibility. Through
                interactive sessions, practical activities and meaningful
                conversations, we help students and young people learn, lead and
                grow.
              </motion.p>

              <motion.p
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: EASE_EDITORIAL }}
                className="mt-3 text-[14px] font-medium text-[#5F6963]"
              >
                Learning experiences that help people grow beyond the classroom.
              </motion.p>

              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: EASE_EDITORIAL }}
                className="mt-8 flex flex-wrap items-center gap-3.5"
              >
                <motion.button
                  type="button"
                  whileHover={prefersReduced ? undefined : { y: -1.5 }}
                  whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                  onClick={() => scrollToSection('programmes')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-white text-[14px] font-semibold shadow-[0_12px_26px_-12px_rgba(13,48,33,0.55)] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Explore Programmes</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={prefersReduced ? undefined : { y: -1.5 }}
                  whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                  onClick={() => scrollToSection('request-session')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#D8CFC0] text-[#171C19] text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Request a Session</span>
                </motion.button>
              </motion.div>

              <motion.div
                initial={prefersReduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.34 }}
                className="mt-9 pt-6 border-t border-[#E6DFD2] flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-[#5B655F]"
              >
                <span>Schools &amp; Colleges</span>
                <span aria-hidden="true" className="text-[#C4BCB0]">
                  ·
                </span>
                <span>Corporate Workshops</span>
                <span aria-hidden="true" className="text-[#C4BCB0]">
                  ·
                </span>
                <span>Communities &amp; Youth</span>
              </motion.div>
            </div>

            {/* Right Cinematic Photograph + Subtle 3D-Inspired Learning Elements */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: EASE_EDITORIAL }}
              className="lg:col-span-6 relative"
            >
              {/* Soft editorial backframe */}
              <div
                aria-hidden="true"
                className="hidden sm:block absolute -inset-3 rounded-[30px] border border-[#DCE5DF] bg-[#EEF4F0]/50 -z-10"
              />

              <div className="group relative rounded-[24px] overflow-hidden border border-[#DFD7C8] shadow-[0_28px_60px_-28px_rgba(13,48,33,0.3)] aspect-[16/11] sm:aspect-[16/10.5] bg-[#133526]">
                <LearningPhotoFrame
                  image={LEARNING_HUB_IMAGES.heroWorkshop}
                  loading="eager"
                />
              </div>

              {/* Tasteful 3D-inspired floating educational accents (desktop/tablet safe framing) */}
              <NotebookPencil3D
                className="hidden md:block absolute -top-5 -left-6 z-20"
                delay={0}
                amplitude={5}
              />
              <Gullak3D
                className="hidden md:block absolute -bottom-5 -right-4 z-20"
                delay={1.2}
                amplitude={6}
              />
              <IdeaBulb3D
                className="hidden lg:block absolute top-6 -right-5 z-20"
                delay={0.6}
                amplitude={5}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. PROGRAMME LIBRARY
         ==================================================================== */}
      <section
        id="programmes"
        aria-labelledby="programme-library-heading"
        className="py-18 sm:py-24"
      >
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal y={16}>
            <div className="max-w-2xl">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0D3021]">
                Programme Library
              </p>
              <h2
                id="programme-library-heading"
                className="mt-2 font-serif text-[32px] sm:text-[40px] font-bold tracking-[-0.02em] text-[#171C19] leading-[1.14] [text-wrap:balance]"
              >
                Explore Our Learning Experiences
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-[#4F5953]">
                Different experiences. Different skills. One journey of growth.
              </p>
            </div>
          </Reveal>

          {/* Named Garad Programmes — 3 columns on desktop, 2 on tablet, 1 on mobile */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {namedProgrammes.map((programme, idx) => (
              <motion.article
                key={programme.id}
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  ease: EASE_EDITORIAL,
                }}
                whileHover={prefersReduced ? undefined : { y: -4 }}
                className="group rounded-[22px] bg-white border border-[#E5DDD0] shadow-[0_14px_34px_-22px_rgba(13,48,33,0.18)] hover:shadow-[0_24px_48px_-22px_rgba(13,48,33,0.24)] transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                <a
                  href={getLearningProgrammePath(programme.slug)}
                  onClick={(e) => handleProgrammeLink(e, programme.slug)}
                  className="flex flex-col flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0D3021]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <LearningPhotoFrame image={programme.image} loading="lazy" />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    {/* Clean unboxed metadata line */}
                    {(programme.category || programme.status) ? (
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#5D6660]">
                        {programme.category && (
                          <span className="font-medium text-[#0D3021]">
                            {programme.category}
                          </span>
                        )}
                        {programme.category && programme.status && (
                          <span aria-hidden="true">·</span>
                        )}
                        {programme.status && (
                          <span className="font-semibold text-[#9B6615]">
                            {programme.status}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-[12px] font-medium text-[#6C756F]">
                        Garad Learning Hub Initiative
                      </p>
                    )}

                    <h3 className="mt-2.5 font-serif text-[22px] font-bold text-[#171C19] leading-[1.24] group-hover:text-[#0D3021] transition-colors">
                      {programme.name}
                    </h3>

                    <p className="mt-3 text-[14px] leading-[1.68] text-[#525C56] flex-1">
                      {programme.cardSummary}
                    </p>

                    <div className="mt-6 pt-4 border-t border-[#EFEAE0] flex items-center justify-between text-[13.5px] font-semibold text-[#0D3021]">
                      <span>Explore Programme</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>

          {/* Customised Sessions Band — Clearly Distinguished from Established Garad Programmes */}
          {customWorkshopOffering && (
            <Reveal delay={0.08} y={18} className="mt-8">
              <div className="group rounded-[24px] bg-[#EEF4F0]/80 border border-[#D4E2D8] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
                <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-auto lg:min-h-[290px] overflow-hidden">
                  <LearningPhotoFrame
                    image={customWorkshopOffering.image}
                    loading="lazy"
                  />
                </div>

                <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#4E5C54]">
                    <span className="font-semibold uppercase tracking-[0.11em] text-[#0D3021]">
                      {customWorkshopOffering.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[#9B6615]">
                      {customWorkshopOffering.status}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Tailored on Enquiry</span>
                  </div>

                  <h3 className="mt-2.5 font-serif text-[26px] sm:text-[32px] font-bold text-[#171C19] leading-[1.18]">
                    {customWorkshopOffering.name}
                  </h3>

                  <p className="mt-3 text-[15px] leading-[1.72] text-[#49534D] max-w-[58ch]">
                    {customWorkshopOffering.cardSummary}
                  </p>

                  <p className="mt-2.5 text-[13px] text-[#5F6A63]">
                    Distinct from named Garad programmes — co-designed around
                    your institution&apos;s audience, themes, and learning goals.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleRequestWithPrefill({
                          programmeOfInterest:
                            customWorkshopOffering.detail.enquiryOptionValue,
                        })
                      }
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-white text-[13.5px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>Request a Custom Session</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href={getLearningProgrammePath(customWorkshopOffering.slug)}
                      onClick={(e) =>
                        handleProgrammeLink(e, customWorkshopOffering.slug)
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F4] border border-[#D4DFD7] text-[#171C19] text-[13.5px] font-semibold transition-colors whitespace-nowrap"
                    >
                      <span>Explore Programme</span>
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ====================================================================
          3. INTERACTIVE PROGRAMME FINDER
         ==================================================================== */}
      <ProgrammeFinder
        onExploreProgramme={onNavigateProgramme}
        onRequestSessionWithPrefill={handleRequestWithPrefill}
      />

      {/* ====================================================================
          4. WHO CAN LEARN WITH US?
         ==================================================================== */}
      <section
        id="who-can-learn"
        aria-labelledby="who-can-learn-heading"
        className="py-18 sm:py-24"
      >
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal y={16}>
            <div className="max-w-2xl">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0D3021]">
                Learning Partners
              </p>
              <h2
                id="who-can-learn-heading"
                className="mt-2 font-serif text-[32px] sm:text-[40px] font-bold tracking-[-0.02em] text-[#171C19] leading-[1.14] [text-wrap:balance]"
              >
                Who Can Learn With Us?
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-[#4F5953]">
                Thoughtful, interactive sessions welcoming academic institutions,
                workplaces, and grassroots groups.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">
            {LEARNING_AUDIENCES.map((aud, idx) => (
              <motion.div
                key={aud.id}
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  ease: EASE_EDITORIAL,
                }}
                whileHover={prefersReduced ? undefined : { y: -4 }}
                className="group rounded-[22px] bg-white border border-[#E5DDD0] overflow-hidden shadow-[0_14px_34px_-22px_rgba(13,48,33,0.16)] flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <LearningPhotoFrame image={aud.image} loading="lazy" />
                </div>

                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <h3 className="font-serif text-[23px] font-bold text-[#171C19]">
                    {aud.title}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-[1.68] text-[#525C56] flex-1">
                    {aud.description}
                  </p>
                  <div className="mt-6 pt-4 border-t border-[#EFEAE0]">
                    <button
                      type="button"
                      onClick={() => {
                        if (aud.targetSection === 'programmes') {
                          scrollToSection('programmes');
                        } else {
                          handleRequestWithPrefill({
                            organisationType: aud.organisationType,
                            programmeOfInterest:
                              aud.organisationType === 'Corporate Organisation'
                                ? 'Special Workshops (Custom Session)'
                                : 'Not sure yet — please advise',
                          });
                        }
                      }}
                      className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0D3021] hover:text-[#1F523B] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>{aud.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. HOW OUR SESSIONS WORK — 4-STEP TIMELINE
         ==================================================================== */}
      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        className="py-18 sm:py-24 bg-white border-y border-[#E7E0D3]"
      >
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal y={16}>
            <div className="max-w-2xl">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0D3021]">
                Our Collaborative Approach
              </p>
              <h2
                id="how-it-works-heading"
                className="mt-2 font-serif text-[32px] sm:text-[40px] font-bold tracking-[-0.02em] text-[#171C19] leading-[1.14] [text-wrap:balance]"
              >
                How Our Sessions Work
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-[#4F5953]">
                Four thoughtful stages that keep every learning experience
                grounded, practical, and relevant.
              </p>
            </div>
          </Reveal>

          {/* Desktop horizontal timeline / Mobile vertical timeline */}
          <div className="mt-12 relative">
            {/* Desktop Horizontal Connecting Line */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-6 left-[4%] right-[4%] h-px bg-[#DCE5DF]"
            />

            <ol className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-7 relative">
              {SESSION_PROCESS_STEPS.map((step, idx) => (
                <motion.li
                  key={step.number}
                  initial={prefersReduced ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.48,
                    delay: idx * 0.1,
                    ease: EASE_EDITORIAL,
                  }}
                  className="relative pl-14 lg:pl-0"
                >
                  {/* Mobile vertical connecting line */}
                  {idx < SESSION_PROCESS_STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="lg:hidden absolute left-[22px] top-12 bottom-[-32px] w-px bg-[#DCE5DF]"
                    />
                  )}

                  {/* Step Number Node */}
                  <div className="absolute left-0 top-0 lg:static w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-[#0D3021] text-[#FAF8F4] font-mono text-[13px] font-semibold tabular-nums flex items-center justify-center shadow-sm relative z-10">
                    {step.number}
                  </div>

                  <div className="lg:mt-6">
                    <h3 className="font-serif text-[22px] font-bold text-[#171C19]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-[1.68] text-[#525C56]">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. LEARNING IN ACTION — PHOTO & VIDEO GALLERY
         ==================================================================== */}
      <section
        id="learning-in-action"
        aria-labelledby="learning-gallery-heading"
        className="py-18 sm:py-24 bg-[#EEF4F0]/55 border-b border-[#DFE8E2]"
      >
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal y={16}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0D3021]">
                  Learning in Action
                </p>
                <h2
                  id="learning-gallery-heading"
                  className="mt-2 font-serif text-[32px] sm:text-[40px] font-bold tracking-[-0.02em] text-[#171C19] leading-[1.14] [text-wrap:balance]"
                >
                  Learning Comes Alive
                </h2>
                <p className="mt-3 text-[15.5px] leading-relaxed text-[#4F5953]">
                  A glimpse into the moments, activities and experiences that
                  make learning meaningful.
                </p>
              </div>

              <p className="text-[12.5px] text-[#5C6660] max-w-xs md:text-right">
                Temporary illustrative visuals shown below while verified Garad
                Learning Hub photography and recordings are prepared.
              </p>
            </div>
          </Reveal>

          {/* Asymmetric Editorial Gallery Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-5">
            {LEARNING_GALLERY_ITEMS.map((item, idx) => {
              const spanClass =
                idx === 0
                  ? 'md:col-span-7 md:row-span-2 aspect-[16/10] md:aspect-auto md:min-h-[420px]'
                  : idx === 1 || idx === 2
                  ? 'md:col-span-5 aspect-[16/10]'
                  : 'md:col-span-6 aspect-[16/10]';

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  initial={prefersReduced ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.06,
                    ease: EASE_EDITORIAL,
                  }}
                  onClick={() => setGalleryActiveIndex(idx)}
                  aria-label={`Open ${item.themeLabel}`}
                  className={`group relative rounded-[20px] overflow-hidden border border-[#DAE3DC] bg-[#133526] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D3021] ${spanClass}`}
                >
                  <LearningPhotoFrame
                    image={item.image}
                    loading="lazy"
                    labelPosition="top-left"
                  />

                  {/* Measured bottom scrim for crisp white typography */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#081C13]/85 via-[#081C13]/45 to-transparent"
                  />

                  {item.kind === 'video-preview' && (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-13 h-13 rounded-full bg-[#FAF8F4]/92 text-[#0D3021] shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-108"
                    >
                      <Play className="w-5 h-5 fill-[#0D3021] ml-0.5" />
                    </span>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-3 text-white">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#E9C983]">
                        {item.kind === 'video-preview'
                          ? 'Video Preview Slot'
                          : 'Illustrative Preview'}
                      </p>
                      <p className="mt-0.5 font-serif text-[18px] sm:text-[19px] font-semibold leading-snug">
                        {item.themeLabel}
                      </p>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-white/14 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
                      <Maximize2 className="w-3.5 h-3.5 text-white" />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. REQUEST A TRAINING SESSION — ENQUIRY EXPERIENCE
         ==================================================================== */}
      <SessionEnquiryForm prefill={enquiryPrefill} />

      {/* ====================================================================
          8. FAQ SECTION — CLEAN ACCORDION
         ==================================================================== */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="py-18 sm:py-22 bg-white border-t border-[#E7E0D3]"
      >
        <div className="max-w-[920px] mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal y={14}>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0D3021]">
                Frequently Asked Questions
              </p>
              <h2
                id="faq-heading"
                className="mt-2 font-serif text-[30px] sm:text-[38px] font-bold tracking-[-0.02em] text-[#171C19] leading-[1.15]"
              >
                Common Questions About Learning Sessions
              </h2>
            </div>
          </Reveal>

          <div className="mt-8 divide-y divide-[#E7E0D3] border-y border-[#E7E0D3]">
            {LEARNING_HUB_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${faq.id}`}
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D3021] rounded-md"
                  >
                    <span className="font-serif text-[19px] sm:text-[20px] font-semibold text-[#171C19] leading-snug">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#0D3021] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${faq.id}`}
                        initial={prefersReduced ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: EASE_EDITORIAL }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pr-8 text-[15px] leading-[1.75] text-[#4F5953] max-w-[70ch]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          9. FINAL CTA SECTION
         ==================================================================== */}
      <section
        aria-labelledby="final-cta-heading"
        className="relative overflow-hidden bg-[#0D3021] text-[#FAF8F4]"
      >
        <img
          src={LEARNING_HUB_IMAGES.galleryLearningAction.src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-22"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#082216]/94 via-[#0D3021]/88 to-[#133C29]/92"
        />

        <div className="relative max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-26">
          <div className="max-w-2xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#E3A63A]">
              Garad Learning Hub · Learn. Lead. Grow.
            </p>
            <h2
              id="final-cta-heading"
              className="mt-3 font-serif text-[34px] sm:text-[46px] font-bold tracking-[-0.02em] leading-[1.1] [text-wrap:balance]"
            >
              Every Great Change Begins with Learning.
            </h2>
            <p className="mt-4 text-[16.5px] leading-relaxed text-[#D7E4DC]">
              Let&apos;s create meaningful learning experiences together.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <motion.button
                type="button"
                whileHover={prefersReduced ? undefined : { y: -1.5 }}
                whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                onClick={() => scrollToSection('request-session')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FAF8F4] hover:bg-[#EFEAE0] text-[#0D3021] text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Start a Conversation</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <a
                href="/activities"
                onClick={handleArchiveLink}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/25 hover:bg-white/10 text-white text-[14px] font-medium transition-colors whitespace-nowrap"
              >
                <span>Explore Garad Foundation Activities Archive</span>
              </a>
            </div>
          </div>

          <div className="mt-14 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-[12.5px] text-[#BDD0C4]">
            <span>GARAD LEARNING HUB · A Garad Foundation Initiative</span>
            <span>Thane, Maharashtra, India</span>
          </div>
        </div>
      </section>

      {/* Gallery Lightbox & Video Preview Modal */}
      <LearningGalleryModal
        items={LEARNING_GALLERY_ITEMS}
        activeIndex={galleryActiveIndex}
        onClose={() => setGalleryActiveIndex(null)}
        onChangeIndex={setGalleryActiveIndex}
      />
    </main>
  );
}
