import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Info,
  Layers,
  Users,
} from 'lucide-react';
import { LearningProgramme } from '../../data/learningHub';
import { usePageSeo } from '../../utils/seo';
import { EASE_EDITORIAL } from '../motion/MotionPrimitives';
import { LearningPhotoFrame } from './LearningObjects3D';

interface ProgrammeDetailViewProps {
  programme: LearningProgramme;
  onBackToHub: () => void;
  onEnquireProgramme: (programmeOption: string) => void;
}

export function ProgrammeDetailView({
  programme,
  onBackToHub,
  onEnquireProgramme,
}: ProgrammeDetailViewProps) {
  const prefersReduced = useReducedMotion();

  usePageSeo({
    title: `${programme.name} — Garad Learning Hub`,
    description: programme.cardSummary,
    type: 'article',
  });

  const handleBackLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    onBackToHub();
  };

  return (
    <main className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-9 pb-20">
      {/* Breadcrumb & Back */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#E7E0D3]">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[12.5px] text-[#66706A]"
        >
          <a
            href="/learning-hub"
            onClick={handleBackLink}
            className="hover:text-[#0D3021] transition-colors"
          >
            Garad Learning Hub
          </a>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-[#171C19] truncate max-w-[260px] sm:max-w-md">
            {programme.shortName}
          </span>
        </nav>

        <a
          href="/learning-hub"
          onClick={handleBackLink}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0D3021] hover:text-[#1F523B] transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Hub</span>
        </a>
      </div>

      {/* Editorial Programme Header */}
      <motion.section
        initial={prefersReduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: EASE_EDITORIAL }}
        className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch"
      >
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-[#5B655F]">
            <span className="font-semibold uppercase tracking-[0.11em] text-[#0D3021]">
              Garad Learning Hub
            </span>
            {programme.category && (
              <>
                <span aria-hidden="true">·</span>
                <span>{programme.category}</span>
              </>
            )}
            {programme.status && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#9B6615]">
                  {programme.status}
                </span>
              </>
            )}
          </div>

          <h1 className="mt-3 font-serif text-[32px] sm:text-[42px] font-bold tracking-[-0.02em] text-[#171C19] leading-[1.13] [text-wrap:balance]">
            {programme.name}
          </h1>

          <p className="mt-4 text-[16px] leading-[1.72] text-[#4C554F] max-w-[62ch]">
            {programme.detail.overview}
          </p>

          {programme.detail.overviewNote && (
            <p className="mt-3.5 text-[13.5px] leading-relaxed text-[#5F6963] max-w-[60ch]">
              {programme.detail.overviewNote}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onEnquireProgramme(programme.detail.enquiryOptionValue)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-white text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>
                {programme.kind === 'custom-session'
                  ? 'Request a Custom Session'
                  : 'Enquire About This Programme'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 group rounded-[22px] overflow-hidden border border-[#E2DACB] shadow-[0_24px_48px_-24px_rgba(13,48,33,0.22)] aspect-[4/3] lg:aspect-auto lg:min-h-[320px]">
          <LearningPhotoFrame image={programme.image} loading="eager" />
        </div>
      </motion.section>

      {/* Main Content Layout */}
      <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="lg:col-span-8 space-y-8">
          {/* Pending Verification State (Shiv Shala / Youth Leadership Program) */}
          {programme.detailsPendingVerification ? (
            <section className="rounded-[22px] bg-white border border-[#E5DDD0] p-6 sm:p-8">
              <div className="flex items-start gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-[#EEF4F0] text-[#0D3021] flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="font-serif text-[22px] sm:text-[25px] font-bold text-[#171C19]">
                    Programme Profile Ready for Verified Details
                  </h2>
                  <p className="mt-2.5 text-[15px] leading-[1.78] text-[#4F5953]">
                    {programme.name} is an official Garad Learning Hub programme
                    name. To maintain complete factual accuracy, curriculum
                    topics, learning objectives, session duration, facilitator
                    information, and past cohort outcomes are not fabricated or
                    estimated here and will be added as verified documentation
                    becomes available.
                  </p>
                  <div className="mt-6 pt-5 border-t border-[#ECE6DA] grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13.5px] text-[#5B655F]">
                    <div>
                      <p className="font-semibold text-[#171C19]">
                        Curriculum &amp; Objectives
                      </p>
                      <p className="mt-1">
                        Awaiting verified programme documentation.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#171C19]">
                        Availability &amp; Format
                      </p>
                      <p className="mt-1">
                        Confirmed directly by the Garad team on enquiry.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <>
              {/* Learning Objectives */}
              {programme.detail.learningObjectives &&
                programme.detail.learningObjectives.length > 0 && (
                  <section className="rounded-[22px] bg-white border border-[#E5DDD0] p-6 sm:p-8">
                    <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#0D3021]">
                      Learning Objectives
                    </p>
                    <h2 className="mt-1.5 font-serif text-[24px] sm:text-[28px] font-bold text-[#171C19]">
                      What Participants Build
                    </h2>
                    <ul className="mt-5 space-y-3.5">
                      {programme.detail.learningObjectives.map((obj, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-[15px] leading-[1.7] text-[#46504A]"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#0D3021] shrink-0 mt-1" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

              {/* Topics Covered */}
              {programme.detail.topicsCovered &&
                programme.detail.topicsCovered.length > 0 && (
                  <section className="rounded-[22px] bg-[#EEF4F0]/75 border border-[#DCE6DF] p-6 sm:p-8">
                    <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#0D3021]">
                      Topics Covered
                    </p>
                    <h2 className="mt-1.5 font-serif text-[24px] sm:text-[28px] font-bold text-[#171C19]">
                      Core Learning Themes
                    </h2>
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {programme.detail.topicsCovered.map((topic, idx) => (
                        <div
                          key={topic}
                          className="rounded-xl bg-white border border-[#E2EAE4] px-4 py-3.5 flex items-center gap-3"
                        >
                          <span className="font-mono text-[12px] font-semibold text-[#B57921] tabular-nums">
                            0{idx + 1}
                          </span>
                          <span className="text-[14.5px] font-medium text-[#171C19]">
                            {topic}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              {/* How Students Participate */}
              {programme.detail.howStudentsParticipate &&
                programme.detail.howStudentsParticipate.length > 0 && (
                  <section className="rounded-[22px] bg-white border border-[#E5DDD0] p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#0D3021]">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Learning Format</span>
                    </div>
                    <h2 className="mt-1.5 font-serif text-[24px] sm:text-[28px] font-bold text-[#171C19]">
                      How Students Participate
                    </h2>
                    <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
                      {programme.detail.howStudentsParticipate.map((act, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-[#48524C]"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C98A2E] shrink-0"
                          />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

              {/* Proposed Session Structure */}
              {programme.detail.proposedSessionStructure &&
                programme.detail.proposedSessionStructure.length > 0 && (
                  <section className="rounded-[22px] bg-white border border-[#E5DDD0] p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#0D3021]">
                      <ClipboardList className="w-3.5 h-3.5" />
                      <span>Proposed Session Structure</span>
                    </div>
                    <h2 className="mt-1.5 font-serif text-[24px] sm:text-[28px] font-bold text-[#171C19]">
                      Inside a 90–120 Minute Intervention
                    </h2>
                    <ol className="mt-6 space-y-5">
                      {programme.detail.proposedSessionStructure.map((phase) => (
                        <li
                          key={phase.step}
                          className="flex items-start gap-4 pb-5 border-b border-[#EFEAE0] last:border-b-0 last:pb-0"
                        >
                          <span className="font-mono text-[13px] font-semibold text-[#0D3021] bg-[#EEF4F0] w-9 h-9 rounded-xl flex items-center justify-center shrink-0 tabular-nums">
                            {phase.step}
                          </span>
                          <div>
                            <h3 className="text-[15.5px] font-semibold text-[#171C19]">
                              {phase.title}
                            </h3>
                            <p className="mt-1 text-[14px] leading-relaxed text-[#525C56]">
                              {phase.detail}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}

              {/* Phase 1 Proposal Scope & Expected Outcomes (Clearly Distinguished) */}
              {programme.detail.proposalScopeNotice && (
                <section className="rounded-[22px] bg-[#FAF6EC] border border-[#E7D8B9] p-6 sm:p-8">
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#9A6414]">
                    Concept Note Reference — Proposal Targets Only
                  </p>
                  <h2 className="mt-1.5 font-serif text-[22px] sm:text-[25px] font-bold text-[#171C19]">
                    {programme.detail.proposalScopeNotice.heading}
                  </h2>

                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#171C19]">
                        Proposed Phase 1 Targets
                      </h3>
                      <ul className="mt-2.5 space-y-2 text-[14px] leading-relaxed text-[#4E5650]">
                        {programme.detail.proposalScopeNotice.targets.map(
                          (item, idx) => (
                            <li key={idx}>• {item}</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#171C19]">
                        Expected Outcomes (Proposed)
                      </h3>
                      <ul className="mt-2.5 space-y-2 text-[14px] leading-relaxed text-[#4E5650]">
                        {programme.detail.proposalScopeNotice.expectedOutcomes.map(
                          (item, idx) => (
                            <li key={idx}>• {item}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  <p className="mt-5 pt-4 border-t border-[#E6D7B7] text-[12.5px] font-medium text-[#6B5427]">
                    Note: {programme.detail.proposalScopeNotice.disclaimer}
                  </p>
                </section>
              )}
            </>
          )}
        </div>

        {/* Right Sidebar: Intended Audience + Direct Enquiry Box */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {programme.detail.intendedAudience &&
            programme.detail.intendedAudience.length > 0 && (
              <div className="rounded-[22px] bg-white border border-[#E5DDD0] p-6">
                <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#0D3021]">
                  <Users className="w-3.5 h-3.5" />
                  <span>Intended Audience</span>
                </div>
                <dl className="mt-4 divide-y divide-[#EFEAE0]">
                  {programme.detail.intendedAudience.map((row) => (
                    <div key={row.label} className="py-3 first:pt-0 last:pb-0">
                      <dt className="text-[11.5px] font-medium text-[#6D7670]">
                        {row.label}
                      </dt>
                      <dd className="mt-0.5 text-[14px] font-semibold text-[#171C19]">
                        {row.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

          <div className="rounded-[22px] bg-[#0D3021] text-[#FAF8F4] p-6 sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#E3A63A]">
              Start a Discussion
            </p>
            <h3 className="mt-2 font-serif text-[22px] font-bold leading-snug">
              Interested in {programme.shortName}?
            </h3>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#D2E0D8]">
              Share your organisation details, preferred timing, and learning
              goals. Our team will connect to discuss availability and next
              steps.
            </p>
            <button
              type="button"
              onClick={() => onEnquireProgramme(programme.detail.enquiryOptionValue)}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FAF8F4] hover:bg-[#EFEAE0] text-[#0D3021] text-[13.5px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Request a Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="mt-3 text-[11.5px] text-[#AFC4B8] leading-relaxed">
              Submitting an enquiry initiates a conversation and is not an
              automatic booking confirmation.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
