import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ClipboardCheck, Truck, Users } from 'lucide-react';
import { MethodologyStage } from '../data/activities';
import { EASE_EDITORIAL, Tilt3DCard } from './motion/MotionPrimitives';

interface MethodologyTimelineProps {
  eyebrow: string;
  heading: string;
  stages: MethodologyStage[];
}

function StageIcon({
  icon,
  accent,
}: {
  icon: MethodologyStage['icon'];
  accent: MethodologyStage['accent'];
}) {
  const colorClass = accent === 'forest' ? 'text-[#143B2A]' : 'text-[#9A3B1E]';
  switch (icon) {
    case 'clipboard':
      return <ClipboardCheck className={`w-4 h-4 ${colorClass}`} />;
    case 'users':
      return <Users className={`w-4 h-4 ${colorClass}`} />;
    case 'truck':
      return <Truck className={`w-4 h-4 ${colorClass}`} />;
  }
}

export function MethodologyTimeline({
  eyebrow,
  heading,
  stages,
}: MethodologyTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 82%', 'center 48%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    restDelta: 0.001,
  });

  const lineScale = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="methodology-heading"
      className="mt-14 sm:mt-16"
    >
      {/* Section Header */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: EASE_EDITORIAL }}
        className="mb-7 sm:mb-8"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
          {eyebrow}
        </p>
        <h2
          id="methodology-heading"
          className="mt-1.5 font-serif text-[26px] sm:text-[32px] font-bold tracking-[-0.015em] text-[#171C19]"
        >
          {heading}
        </h2>
      </motion.div>

      {/* Connected 3-Stage Cards with Progressive Scroll Line */}
      <div className="relative">
        {/* Desktop horizontal connecting progression track */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute top-[34px] left-[10%] right-[10%] h-[2px] bg-[#E8E1D4] rounded-full overflow-hidden z-0"
        >
          <motion.div
            style={{
              scaleX: prefersReduced ? 1 : lineScale,
              transformOrigin: 'left center',
            }}
            className="h-full w-full bg-gradient-to-r from-[#1D523A] via-[#9A3B1E] to-[#143B2A]"
          />
        </div>

        {/* Mobile vertical connecting progression track */}
        <div
          aria-hidden="true"
          className="md:hidden absolute top-8 bottom-8 left-[22px] w-[2px] bg-[#E8E1D4] rounded-full overflow-hidden z-0"
        >
          <motion.div
            style={{
              scaleY: prefersReduced ? 1 : lineScale,
              transformOrigin: 'top center',
            }}
            className="w-full h-full bg-gradient-to-b from-[#1D523A] via-[#9A3B1E] to-[#143B2A]"
          />
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {stages.map((stage, idx) => {
            const badgeColors =
              stage.accent === 'terracotta'
                ? 'bg-[#FAEEE9] text-[#9A3B1E] border-[#F0D6CA]'
                : 'bg-[#EEF4F0] text-[#143B2A] border-[#D6E5DC]';

            const footerTextColor =
              stage.accent === 'forest' ? 'text-[#143B2A]' : 'text-[#9A3B1E]';

            return (
              <motion.div
                key={stage.stageNumber}
                initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.12,
                  ease: EASE_EDITORIAL,
                }}
                className="pl-10 md:pl-0"
              >
                {/* Mobile timeline node dot */}
                <div
                  aria-hidden="true"
                  className="md:hidden absolute left-[15px] mt-6 w-4 h-4 rounded-full bg-[#FAF8F4] border-2 border-[#9A3B1E] flex items-center justify-center"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A3B1E]" />
                </div>

                <Tilt3DCard
                  maxTilt={3}
                  elevationY={-5}
                  glareOpacity={0.07}
                  className="chrome-card group flex flex-col justify-between rounded-[18px] bg-white p-5 sm:p-6"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <motion.span
                        initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: 0.12 + idx * 0.12,
                          ease: EASE_EDITORIAL,
                        }}
                        className={`px-2.5 py-1 rounded-md border text-[10.5px] font-bold tracking-[0.08em] ${badgeColors}`}
                      >
                        {stage.stageNumber}
                      </motion.span>
                      <span className="text-[11px] font-medium text-[#7B837E]">
                        {stage.subtitleMeta}
                      </span>
                    </div>

                    <h3 className="font-serif text-[20px] font-bold text-[#171C19] tracking-[-0.01em] group-hover:text-[#0D3021] transition-colors">
                      {stage.title}
                    </h3>
                    <p className="mt-2.5 text-[13.5px] leading-[1.68] text-[#555E58]">
                      {stage.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3.5 border-t border-[#F0EBE1] flex items-center justify-between">
                    <span className={`text-[12px] font-semibold ${footerTextColor}`}>
                      {stage.footerLabel}
                    </span>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#FAF8F4] border border-[#EDE7DB] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:scale-105">
                      <StageIcon icon={stage.icon} accent={stage.accent} />
                    </span>
                  </div>
                </Tilt3DCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
