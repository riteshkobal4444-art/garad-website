import React, { useEffect, useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ArrowDownRight } from 'lucide-react';
import heroVolunteerPhoto from '../assets/images/volunteer_hero_education_1795289741467.jpg';
import closingVolunteerPhoto from '../assets/images/volunteer_closing_community_1795289742188.jpg';
import { EASE_EDITORIAL, ResilientImage } from './motion/MotionPrimitives';
import { VolunteerApplicationForm } from './VolunteerApplicationForm';

const VOLUNTEER_PAGE_TITLE = 'Be a Volunteer | Garad Foundation';
const VOLUNTEER_META_DESCRIPTION =
  'Join Garad Foundation as a volunteer in Thane and Maharashtra. Contribute your time, skills, and ideas to education, youth, and community outreach initiatives.';

export function VolunteerPage() {
  const prefersReduced = useReducedMotion();
  const heroMediaRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroMediaRef,
    offset: ['start end', 'end start'],
  });
  const imageParallaxY = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = VOLUNTEER_PAGE_TITLE;

    const metaDesc = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    const prevDesc = metaDesc?.getAttribute('content') || '';
    if (metaDesc) {
      metaDesc.setAttribute('content', VOLUNTEER_META_DESCRIPTION);
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute('content', prevDesc);
      }
    };
  }, []);

  const scrollToForm = () => {
    const target = document.getElementById('volunteer-application-form');
    target?.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <main className="bg-[#F7F5EF] text-[#171C19]">
      {/* =====================================================================
          SECTION A — COMPACT SPLIT-SCREEN HERO
      ====================================================================== */}
      <section
        aria-labelledby="volunteer-hero-heading"
        className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-8 lg:gap-12">
          {/* Left Copy Column */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <p className="text-[12px] font-bold tracking-[0.16em] uppercase text-[#9A3B1E]">
              BE PART OF THE CHANGE
            </p>

            <h1
              id="volunteer-hero-heading"
              className="mt-3 font-serif text-[36px] sm:text-[46px] lg:text-[52px] font-bold text-[#103A2B] leading-[1.08] tracking-[-0.02em] text-balance"
            >
              Be the Reason Someone Smiles.
            </h1>

            <p className="mt-5 text-[15.5px] sm:text-[16.5px] leading-[1.68] text-[#46534C] max-w-[54ch]">
              Your time, skills and ideas can make a meaningful difference. Join
              Garad Foundation and become part of a community working towards
              brighter opportunities for children and communities.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <motion.button
                type="button"
                onClick={scrollToForm}
                whileHover={prefersReduced ? undefined : { y: -1.5 }}
                whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.16, ease: EASE_EDITORIAL }}
                className="min-h-[48px] inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#174C38] hover:bg-[#103A2B] text-white text-[15px] font-semibold shadow-[0_12px_26px_-10px_rgba(16,58,43,0.48)] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174C38] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F5EF]"
              >
                <span>Join as a Volunteer</span>
                <ArrowDownRight className="w-4 h-4" />
              </motion.button>
            </div>

            <p className="mt-6 pt-5 border-t border-[#E5DFD2] text-[13px] font-medium text-[#5A665F]">
              Students <span aria-hidden="true">·</span> Working Professionals{' '}
              <span aria-hidden="true">·</span> Everyone Willing to Contribute
            </p>
          </motion.div>

          {/* Right Authentic Volunteer Photograph with Reveal & Gentle Parallax */}
          <div
            ref={heroMediaRef}
            className="lg:col-span-6 flex"
          >
            <motion.figure
              initial={prefersReduced ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, ease: EASE_EDITORIAL }}
              className="relative w-full min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] rounded-3xl overflow-hidden bg-[#DCE8DC] shadow-[0_22px_48px_-24px_rgba(16,58,43,0.38)] border border-[#E2DDD0]"
            >
              <motion.div
                style={prefersReduced ? undefined : { y: imageParallaxY }}
                className="w-full h-[112%] -mt-[6%]"
              >
                <ResilientImage
                  src={heroVolunteerPhoto}
                  alt="Garad Foundation volunteers reading illustrated books and mentoring smiling rural schoolchildren in a sunlit Maharashtra school courtyard"
                  loading="eager"
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#103A2B]/55 via-[#103A2B]/15 to-transparent"
              />
              <figcaption className="absolute bottom-4 left-5 right-5 text-[12.5px] font-medium text-[#F7F5EF] drop-shadow-sm">
                Community education &amp; mentoring across Maharashtra
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION B — INTERACTIVE TWO-STEP VOLUNTEER APPLICATION
      ====================================================================== */}
      <section
        id="volunteer-application-form"
        aria-label="Volunteer Application Form"
        className="scroll-mt-20 max-w-[920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        <VolunteerApplicationForm />
      </section>

      {/* =====================================================================
          SECTION C — SHORT CLOSING MESSAGE
      ====================================================================== */}
      <section
        aria-labelledby="volunteer-closing-heading"
        className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-20"
      >
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
          className="rounded-3xl bg-[#DCE8DC]/50 border border-[#C9DBC9] overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch"
        >
          <div className="md:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
            <h2
              id="volunteer-closing-heading"
              className="font-serif text-[26px] sm:text-[32px] font-bold text-[#103A2B] leading-[1.18] text-balance"
            >
              Small Efforts. Shared Dreams. Stronger Communities.
            </h2>
            <p className="mt-3.5 text-[15.5px] leading-relaxed text-[#3F4E46] max-w-[52ch]">
              Every contribution matters. We look forward to welcoming people
              who want to make a difference.
            </p>
          </div>

          <div className="md:col-span-5 relative min-h-[210px] sm:min-h-[240px] bg-[#174C38]/10">
            <ResilientImage
              src={closingVolunteerPhoto}
              alt="Young Indian volunteers smiling and organizing school notebooks and educational kits outdoors under shade trees"
              loading="lazy"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </motion.div>
      </section>
    </main>
  );
}
