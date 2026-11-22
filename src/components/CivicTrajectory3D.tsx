import React, { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react';
import { Crosshair, MousePointerClick, Star } from 'lucide-react';
import {
  FiscalYearId,
  TIMELINE_PILLARS,
  TimelinePillar,
} from '../data/activities';
import { EASE_EDITORIAL, useCanHover3D } from './motion/MotionPrimitives';

interface CivicTrajectory3DProps {
  selectedYear: FiscalYearId;
  onSelectYear: (year: FiscalYearId) => void;
}

const PILLAR_PALETTE: Record<
  TimelinePillar['variant'],
  {
    front: string;
    side: string;
    top: string;
    text: string;
    glow: string;
    labelColor: string;
  }
> = {
  ochre: {
    front: 'linear-gradient(180deg, #D59835 0%, #B77C20 100%)',
    side: 'linear-gradient(180deg, #9F6918 0%, #835410 100%)',
    top: 'linear-gradient(135deg, #F0C676 0%, #DCA344 100%)',
    text: 'text-[#FFFDF7]',
    glow: '0 14px 32px -6px rgba(196, 134, 38, 0.45)',
    labelColor: 'text-[#171C19] font-bold',
  },
  'forest-1': {
    front: 'linear-gradient(180deg, #275842 0%, #1C4331 100%)',
    side: 'linear-gradient(180deg, #163628 0%, #102A1F 100%)',
    top: 'linear-gradient(135deg, #4C8469 0%, #2F644C 100%)',
    text: 'text-[#BBD8C9]',
    glow: '0 14px 28px -6px rgba(28, 67, 49, 0.38)',
    labelColor: 'text-[#55605A]',
  },
  'forest-2': {
    front: 'linear-gradient(180deg, #214F3A 0%, #163B2A 100%)',
    side: 'linear-gradient(180deg, #123123 0%, #0D251A 100%)',
    top: 'linear-gradient(135deg, #437A60 0%, #285B44 100%)',
    text: 'text-[#B5D4C4]',
    glow: '0 14px 28px -6px rgba(22, 59, 42, 0.4)',
    labelColor: 'text-[#55605A]',
  },
  'forest-3': {
    front: 'linear-gradient(180deg, #1B4633 0%, #123324 100%)',
    side: 'linear-gradient(180deg, #0E291D 0%, #091E15 100%)',
    top: 'linear-gradient(135deg, #3B7057 0%, #22513C 100%)',
    text: 'text-[#AECFC0]',
    glow: '0 14px 28px -6px rgba(18, 51, 36, 0.42)',
    labelColor: 'text-[#55605A]',
  },
  'forest-4': {
    front: 'linear-gradient(180deg, #153D2B 0%, #0D2B1E 100%)',
    side: 'linear-gradient(180deg, #0A2217 0%, #071911 100%)',
    top: 'linear-gradient(135deg, #32644C 0%, #1B4834 100%)',
    text: 'text-[#A5C8B7]',
    glow: '0 14px 28px -6px rgba(13, 43, 30, 0.45)',
    labelColor: 'text-[#55605A]',
  },
  terracotta: {
    front: 'linear-gradient(180deg, #AA4525 0%, #893217 100%)',
    side: 'linear-gradient(180deg, #742811 0%, #5B1E0C 100%)',
    top: 'linear-gradient(135deg, #DA7D5E 0%, #BC5534 100%)',
    text: 'text-[#FFF4EE]',
    glow: '0 16px 34px -6px rgba(154, 59, 30, 0.45)',
    labelColor: 'text-[#9A3B1E] font-bold',
  },
};

export function CivicTrajectory3D({
  selectedYear,
  onSelectYear,
}: CivicTrajectory3DProps) {
  const prefersReduced = useReducedMotion();
  const canHover3D = useCanHover3D();
  const stageRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const rawTiltX = useMotionValue(0);
  const rawTiltY = useMotionValue(0);
  const stageRotateX = useSpring(rawTiltX, { stiffness: 140, damping: 22 });
  const stageRotateY = useSpring(rawTiltY, { stiffness: 140, damping: 22 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canHover3D || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rawTiltY.set(nx * 6);
    rawTiltX.set(-ny * 4.5);
  };

  const handlePointerLeave = () => {
    rawTiltX.set(0);
    rawTiltY.set(0);
    setHoveredId(null);
  };

  return (
    <motion.div
      ref={stageRef}
      onPointerMove={canHover3D ? handlePointerMove : undefined}
      onPointerLeave={handlePointerLeave}
      initial={prefersReduced ? false : { opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.72, delay: 0.22, ease: EASE_EDITORIAL }}
      className="chrome-card relative rounded-[22px] bg-trajectory-grid p-5 sm:p-6 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-16 w-56 h-56 rounded-full bg-white/55 blur-2xl"
      />

      {/* Card Header */}
      <div className="relative z-10 flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#17241D]">
          <Crosshair className="w-4 h-4 text-[#9A3B1E]" />
          <span>Financial Year Timeline</span>
        </div>
        <span className="px-2.5 py-1 rounded-md bg-white/90 border border-[#D8E5DD] text-[11px] font-medium text-[#526058] shadow-[0_1px_2px_rgba(0,0,0,0.03)] tabular-nums">
          Apr–Mar · FY 2018–2026
        </span>
      </div>

      {/* 3D Isometric Pillar Stage */}
      <div className="perspective-1200 relative z-10 pt-8 pb-3">
        <motion.div
          style={
            canHover3D
              ? {
                  rotateX: stageRotateX,
                  rotateY: stageRotateY,
                  transformStyle: 'preserve-3d',
                }
              : undefined
          }
          className="relative h-[228px] sm:h-[246px] flex items-end justify-between gap-1 sm:gap-2 px-0.5 sm:px-1.5"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-7 inset-x-1 h-[1px] bg-gradient-to-r from-transparent via-[#16402E]/18 to-transparent"
          />

          {TIMELINE_PILLARS.map((pillar, index) => {
            const palette = PILLAR_PALETTE[pillar.variant];
            const isSelected = selectedYear === pillar.id;
            const isHovered = hoveredId === pillar.id;
            const showFloatingBadge =
              isHovered ||
              (isSelected && !hoveredId) ||
              (selectedYear === 'all' && pillar.id === '2019-2020' && !hoveredId);

            const baseHeightPx = Math.round(
              62 + (pillar.heightPercent / 100) * 124
            );

            return (
              <div
                key={pillar.id}
                className="relative flex-1 flex flex-col items-center justify-end h-full group"
                onMouseEnter={() => setHoveredId(pillar.id)}
                onMouseLeave={() =>
                  setHoveredId((curr) => (curr === pillar.id ? null : curr))
                }
              >
                {/* Floating Info Badge */}
                <AnimatePresence>
                  {showFloatingBadge && (
                    <motion.div
                      initial={
                        prefersReduced
                          ? { opacity: 1 }
                          : { opacity: 0, y: 6, scale: 0.92 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={
                        prefersReduced
                          ? { opacity: 0 }
                          : { opacity: 0, y: 4, scale: 0.94 }
                      }
                      transition={{ duration: 0.2, ease: EASE_EDITORIAL }}
                      style={{ bottom: `${baseHeightPx + 42}px` }}
                      className="pointer-events-none absolute z-30 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    >
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0B2418] text-white text-[10px] font-semibold tracking-wide shadow-[0_8px_18px_rgba(8,36,23,0.28)]">
                        {pillar.documentedCount > 0 && (
                          <Star className="w-2.5 h-2.5 fill-[#E5A93B] text-[#E5A93B]" />
                        )}
                        <span>{pillar.badgeText}</span>
                      </div>
                      <div className="mx-auto w-2 h-2 bg-[#0B2418] rotate-45 -mt-1" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Interactive 3D Pillar Button */}
                <motion.button
                  type="button"
                  onClick={() =>
                    onSelectYear(selectedYear === pillar.id ? 'all' : pillar.id)
                  }
                  aria-pressed={isSelected}
                  aria-label={`Inspect ${pillar.id}: ${pillar.summary}`}
                  initial={
                    prefersReduced
                      ? false
                      : { opacity: 0, y: 26, scaleY: 0.72 }
                  }
                  animate={
                    prefersReduced
                      ? { opacity: 1, y: 0, scaleY: 1 }
                      : {
                          opacity: 1,
                          scaleY: 1,
                          y: isHovered
                            ? -10
                            : isSelected
                            ? -5
                            : [0, -2.5, 0],
                        }
                  }
                  transition={
                    prefersReduced
                      ? { duration: 0.2 }
                      : isHovered || isSelected
                      ? { duration: 0.32, ease: EASE_EDITORIAL }
                      : {
                          opacity: {
                            duration: 0.55,
                            delay: 0.26 + index * 0.06,
                            ease: EASE_EDITORIAL,
                          },
                          scaleY: {
                            duration: 0.62,
                            delay: 0.26 + index * 0.06,
                            ease: EASE_EDITORIAL,
                          },
                          y: {
                            duration: 4.2 + index * 0.35,
                            repeat: Infinity,
                            repeatType: 'mirror',
                            ease: 'easeInOut',
                            delay: 0.9 + index * 0.25,
                          },
                        }
                  }
                  whileTap={prefersReduced ? undefined : { scale: 0.96 }}
                  style={{ height: `${baseHeightPx}px` }}
                  className="relative w-full max-w-[42px] origin-bottom cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3B1E] focus-visible:ring-offset-2 rounded-t-sm"
                >
                  {isSelected && (
                    <motion.div
                      layoutId="active-pillar-glow"
                      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                      aria-hidden="true"
                      style={{ boxShadow: palette.glow }}
                      className="pointer-events-none absolute -inset-[2px] rounded-t-[6px] rounded-b-[4px] ring-2 ring-[#143B2A]/25"
                    />
                  )}

                  {/* Top Isometric Bevel Face */}
                  <div
                    aria-hidden="true"
                    style={{
                      background: palette.top,
                      clipPath: 'polygon(0% 100%, 16% 0%, 100% 0%, 84% 100%)',
                    }}
                    className="absolute -top-[9px] left-0 right-0 h-[10px] opacity-95"
                  />

                  {/* Front Face */}
                  <div
                    style={{
                      background: palette.front,
                      boxShadow: isHovered
                        ? `${palette.glow}, inset 1px 1px 0 rgba(255,255,255,0.22)`
                        : '0 8px 18px -10px rgba(13,48,33,0.35), inset 1px 1px 0 rgba(255,255,255,0.16)',
                    }}
                    className={`relative w-[84%] h-full rounded-b-[4px] flex items-center justify-center overflow-hidden transition-shadow duration-300 ${
                      pillar.documentedCount === 0 ? 'opacity-82' : ''
                    }`}
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/14 to-transparent"
                    />
                    <span
                      className={`text-[9.5px] font-semibold tracking-[0.06em] select-none [writing-mode:vertical-rl] rotate-180 ${palette.text}`}
                    >
                      {pillar.verticalLabel}
                    </span>
                  </div>

                  {/* Right Shaded 3D Side Face */}
                  <div
                    aria-hidden="true"
                    style={{
                      background: palette.side,
                      clipPath:
                        'polygon(0% 9px, 100% 0%, 100% calc(100% - 7px), 0% 100%)',
                    }}
                    className={`absolute -top-[9px] right-0 w-[16.5%] h-[calc(100%+9px)] rounded-br-[3px] ${
                      pillar.documentedCount === 0 ? 'opacity-82' : ''
                    }`}
                  />
                </motion.button>

                {/* Grounded Shadow */}
                <motion.div
                  aria-hidden="true"
                  animate={{
                    scaleX: isHovered ? 0.88 : 1,
                    opacity: isHovered ? 0.34 : isSelected ? 0.28 : 0.16,
                  }}
                  transition={{ duration: 0.28, ease: EASE_EDITORIAL }}
                  className="w-[74%] max-w-[42px] h-[6px] mt-1.5 rounded-full bg-[#0C261A] blur-[3px]"
                />

                {/* Year Label */}
                <span
                  className={`mt-2 text-[9.5px] sm:text-[10.5px] tabular-nums tracking-tight whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'text-[#0B2418] font-bold'
                      : palette.labelColor
                  }`}
                >
                  {pillar.shortLabel}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Card Footer */}
      <div className="relative z-10 mt-3 pt-3 border-t border-[#D3E2D8] flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-[#55645C]">
        <div className="flex items-center gap-2 max-w-[280px]">
          <MousePointerClick className="w-3.5 h-3.5 text-[#9A3B1E] shrink-0" />
          <span className="leading-snug">
            Click a financial year pillar to filter documented activities
          </span>
        </div>
        <span className="font-mono text-[10.5px] tracking-wider text-[#6A7870] uppercase">
          FY 2018–2026 HORIZON
        </span>
      </div>
    </motion.div>
  );
}
