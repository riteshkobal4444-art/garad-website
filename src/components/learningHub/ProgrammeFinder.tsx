import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Compass,
  GraduationCap,
  RotateCcw,
  School,
  Users,
} from 'lucide-react';
import {
  FINDER_AUDIENCE_OPTIONS,
  FINDER_TOPIC_OPTIONS,
  FinderAudienceId,
  FinderTopicId,
  resolveProgrammeFinder,
} from '../../data/learningHub';
import { EASE_EDITORIAL } from '../motion/MotionPrimitives';
import { LearningPhotoFrame } from './LearningObjects3D';

interface ProgrammeFinderProps {
  onExploreProgramme: (slug: string) => void;
  onRequestSessionWithPrefill: (prefill: {
    organisationType: FinderAudienceId;
    programmeOfInterest: string;
    customSessionRequirement?: string;
  }) => void;
}

function AudienceGlyph({ id }: { id: FinderAudienceId }) {
  switch (id) {
    case 'School':
      return <School className="w-4 h-4 shrink-0" />;
    case 'College':
      return <GraduationCap className="w-4 h-4 shrink-0" />;
    case 'Corporate Organisation':
      return <Building2 className="w-4 h-4 shrink-0" />;
    case 'Community / Youth Group':
      return <Users className="w-4 h-4 shrink-0" />;
    default:
      return <Compass className="w-4 h-4 shrink-0" />;
  }
}

export function ProgrammeFinder({
  onExploreProgramme,
  onRequestSessionWithPrefill,
}: ProgrammeFinderProps) {
  const prefersReduced = useReducedMotion();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [audience, setAudience] = useState<FinderAudienceId | null>(null);
  const [topic, setTopic] = useState<FinderTopicId | null>(null);

  const resolution = useMemo(() => {
    if (!audience || !topic) return null;
    return resolveProgrammeFinder(audience, topic);
  }, [audience, topic]);

  const handleSelectAudience = (choice: FinderAudienceId) => {
    setAudience(choice);
    setStep(2);
  };

  const handleSelectTopic = (choice: FinderTopicId) => {
    setTopic(choice);
    setStep(3);
  };

  const handleReset = () => {
    setAudience(null);
    setTopic(null);
    setStep(1);
  };

  return (
    <section
      id="programme-finder"
      aria-labelledby="programme-finder-heading"
      className="py-16 sm:py-22 bg-[#EEF4F0]/75 border-y border-[#DFE8E2]"
    >
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-[#0D3021]">
            Interactive Programme Finder
          </p>
          <h2
            id="programme-finder-heading"
            className="mt-2 font-serif text-[30px] sm:text-[38px] font-bold tracking-[-0.02em] text-[#171C19] leading-[1.15] [text-wrap:balance]"
          >
            What Would You Like to Learn?
          </h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-[#4F5953]">
            Tell us a little about your learning needs. We&apos;ll help you find
            a suitable experience.
          </p>
        </div>

        {/* Finder Card Shell */}
        <div className="mt-8 rounded-[24px] bg-white border border-[#DCE5DF] shadow-[0_22px_50px_-28px_rgba(13,48,33,0.18)] overflow-hidden">
          {/* Top Step Progress Strip */}
          <div className="px-5 sm:px-8 py-4 border-b border-[#EAE5DB] bg-[#FAF8F4]/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-5 text-[12.5px]">
              {[
                { num: 1 as const, label: 'Audience', val: audience },
                { num: 2 as const, label: 'Interest', val: topic },
                { num: 3 as const, label: 'Recommendation', val: null },
              ].map((item, idx) => {
                const isCurrent = step === item.num;
                const isDone =
                  (item.num === 1 && audience !== null && step > 1) ||
                  (item.num === 2 && topic !== null && step > 2);
                const canJump =
                  item.num === 1 ||
                  (item.num === 2 && audience !== null) ||
                  (item.num === 3 && audience !== null && topic !== null);

                return (
                  <React.Fragment key={item.num}>
                    {idx > 0 && (
                      <span aria-hidden="true" className="text-[#C7C1B5]">
                        /
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={!canJump}
                      onClick={() => canJump && setStep(item.num)}
                      className={`inline-flex items-center gap-2 whitespace-nowrap transition-colors ${
                        canJump ? 'cursor-pointer' : 'cursor-default opacity-50'
                      } ${
                        isCurrent
                          ? 'text-[#0D3021] font-semibold'
                          : isDone
                          ? 'text-[#2D4F3E] font-medium hover:text-[#0D3021]'
                          : 'text-[#737D77]'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full text-[11px] font-mono tabular-nums flex items-center justify-center transition-colors ${
                          isCurrent
                            ? 'bg-[#0D3021] text-white'
                            : isDone
                            ? 'bg-[#E2EDE6] text-[#0D3021]'
                            : 'bg-[#EDEAE2] text-[#66706A]'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : `0${item.num}`}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>

            {(audience || topic) && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#5A645E] hover:text-[#0D3021] transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start over</span>
              </button>
            )}
          </div>

          {/* Interactive Step Content */}
          <div className="p-6 sm:p-8 lg:p-10 min-h-[300px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="finder-step-1"
                  initial={prefersReduced ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
                  transition={{ duration: 0.24, ease: EASE_EDITORIAL }}
                >
                  <p className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-[#737D77]">
                    Step 01 of 03
                  </p>
                  <h3 className="mt-1.5 font-serif text-[22px] sm:text-[26px] font-bold text-[#171C19]">
                    Who are you planning this for?
                  </h3>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {FINDER_AUDIENCE_OPTIONS.map((option) => {
                      const selected = audience === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleSelectAudience(option.id)}
                          className={`group text-left rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D3021] ${
                            selected
                              ? 'bg-[#EEF4F0] border-[#0D3021] shadow-sm'
                              : 'bg-[#FAF8F4]/70 border-[#E5DED1] hover:border-[#0D3021]/45 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                                selected
                                  ? 'bg-[#0D3021] text-white'
                                  : 'bg-white border border-[#E5DED1] text-[#0D3021] group-hover:bg-[#0D3021] group-hover:text-white'
                              }`}
                            >
                              <AudienceGlyph id={option.id} />
                            </span>
                            <ArrowRight className="w-4 h-4 text-[#8B948E] group-hover:text-[#0D3021] group-hover:translate-x-0.5 transition-all" />
                          </div>
                          <p className="mt-3.5 text-[15px] font-semibold text-[#171C19]">
                            {option.label}
                          </p>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-[#5F6963]">
                            {option.hint}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="finder-step-2"
                  initial={prefersReduced ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
                  transition={{ duration: 0.24, ease: EASE_EDITORIAL }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-[#737D77]">
                        Step 02 of 03 · Planning for {audience}
                      </p>
                      <h3 className="mt-1.5 font-serif text-[22px] sm:text-[26px] font-bold text-[#171C19]">
                        What kind of learning are you interested in?
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#4F5953] hover:text-[#0D3021] cursor-pointer whitespace-nowrap"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change audience</span>
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {FINDER_TOPIC_OPTIONS.map((option) => {
                      const selected = topic === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleSelectTopic(option.id)}
                          className={`group text-left rounded-2xl px-5 py-4 border flex items-center justify-between gap-3 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D3021] ${
                            selected
                              ? 'bg-[#0D3021] border-[#0D3021] text-white'
                              : 'bg-[#FAF8F4]/70 border-[#E5DED1] text-[#171C19] hover:border-[#0D3021]/45 hover:bg-white'
                          }`}
                        >
                          <span className="text-[14.5px] font-semibold">
                            {option.label}
                          </span>
                          <ArrowRight
                            className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                              selected ? 'text-[#E3A63A]' : 'text-[#8B948E] group-hover:text-[#0D3021]'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 3 && audience && topic && resolution && (
                <motion.div
                  key="finder-step-3"
                  initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.26, ease: EASE_EDITORIAL }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#ECE6DA]">
                    <div className="text-[12.5px] text-[#5B655F] flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#0D3021]">{audience}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#0D3021]">{topic}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[12.5px] font-medium">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-1.5 text-[#555E58] hover:text-[#0D3021] cursor-pointer whitespace-nowrap"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Change topic</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[#555E58] hover:text-[#0D3021] cursor-pointer whitespace-nowrap"
                      >
                        Change audience
                      </button>
                    </div>
                  </div>

                  {resolution.hasVerifiedMatch && resolution.matchedProgrammes.length > 0 ? (
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      {resolution.matchedProgrammes.map((prog) => (
                        <React.Fragment key={prog.id}>
                          <div className="lg:col-span-5 group rounded-2xl overflow-hidden aspect-[4/3] border border-[#E5DED1]">
                            <LearningPhotoFrame image={prog.image} loading="lazy" />
                          </div>
                          <div className="lg:col-span-7">
                            <p className="text-[12px] font-medium text-[#5D6660] flex flex-wrap items-center gap-2">
                              {prog.category && <span>{prog.category}</span>}
                              {prog.category && prog.status && <span aria-hidden="true">·</span>}
                              {prog.status && (
                                <span className="font-semibold text-[#0D3021]">
                                  {prog.status}
                                </span>
                              )}
                            </p>
                            <h3 className="mt-2 font-serif text-[24px] sm:text-[28px] font-bold text-[#171C19] leading-snug">
                              {prog.name}
                            </h3>
                            <p className="mt-3 text-[14.5px] leading-relaxed text-[#4F5953]">
                              {resolution.summary}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={() => onExploreProgramme(prog.slug)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-white text-[13.5px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
                              >
                                <span>Explore Programme</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onRequestSessionWithPrefill({
                                    organisationType: audience,
                                    programmeOfInterest: resolution.enquiryProgrammeValue,
                                    customSessionRequirement:
                                      resolution.suggestedCustomRequirement,
                                  })
                                }
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF8F4] hover:bg-[#EFEAE0] border border-[#D9D0C0] text-[#171C19] text-[13.5px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
                              >
                                <span>
                                  {prog.kind === 'custom-session'
                                    ? 'Request a Custom Session'
                                    : 'Enquire About This Programme'}
                                </span>
                              </button>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-2xl bg-[#FAF8F4] border border-[#E5DED1] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="max-w-xl">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#B57921]">
                          Custom Learning Pathway
                        </p>
                        <h3 className="mt-2 font-serif text-[24px] sm:text-[28px] font-bold text-[#171C19] leading-snug">
                          {resolution.headline}
                        </h3>
                        <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#4F5953]">
                          {resolution.summary}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onRequestSessionWithPrefill({
                            organisationType: audience,
                            programmeOfInterest: resolution.enquiryProgrammeValue,
                            customSessionRequirement:
                              resolution.suggestedCustomRequirement,
                          })
                        }
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-white text-[14px] font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                      >
                        <span>Request a Custom Session</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
