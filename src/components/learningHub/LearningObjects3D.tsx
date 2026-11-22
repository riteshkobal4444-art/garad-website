import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BookOpen } from 'lucide-react';
import { LearningHubImageAsset } from '../../data/learningHubImages';

/* ============================================================================
   Resilient Documentary Photo Frame for Garad Learning Hub
   - Respects explicit focal framing (`objectPosition`)
   - Falls back gracefully to a branded deep-forest card on load error
   - Shows subtle bottom-left `ILLUSTRATIVE IMAGE` tag ONLY on sample images
   ============================================================================ */
interface LearningPhotoFrameProps {
  image: LearningHubImageAsset;
  loading?: 'eager' | 'lazy';
  className?: string;
  hideSampleLabel?: boolean;
  labelPosition?: 'bottom-left' | 'top-left';
}

export function LearningPhotoFrame({
  image,
  loading = 'lazy',
  className = '',
  hideSampleLabel = false,
  labelPosition = 'bottom-left',
}: LearningPhotoFrameProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [image.src]);

  if (failed || !image.src) {
    return (
      <div
        role="img"
        aria-label={image.alt}
        className={`w-full h-full bg-gradient-to-br from-[#0D3021] via-[#16402E] to-[#23543D] text-[#FAF8F4] flex flex-col items-center justify-center p-6 text-center ${className}`}
      >
        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-[#E3A63A]" />
        </div>
        <p className="mt-3 font-serif text-sm font-semibold text-white/90 max-w-xs">
          Garad Learning Hub
        </p>
        <p className="mt-1 text-xs text-white/70 max-w-xs leading-relaxed">
          {image.alt}
        </p>
      </div>
    );
  }

  const badgePosClass =
    labelPosition === 'top-left' ? 'top-3 left-3' : 'bottom-3 left-3';

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#133526] ${className}`}>
      <img
        src={image.src}
        alt={image.alt}
        loading={loading}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        style={{ objectPosition: image.objectPosition || 'center 30%' }}
        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
      />
      {image.imageType === 'sample' && !hideSampleLabel && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#081C13]/60 via-[#081C13]/15 to-transparent"
          />
          <span
            className={`pointer-events-none select-none absolute ${badgePosClass} z-10 rounded bg-[#0A2217]/84 backdrop-blur-sm border border-white/20 px-2 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#FAF8F4]`}
          >
            ILLUSTRATIVE IMAGE
          </span>
        </>
      )}
    </div>
  );
}

/* ============================================================================
   Lightweight 3D-Inspired Tactile Learning Artifacts (GPU-Composited Float)
   - Matte editorial paper, forest green, terracotta, and warm brass styling
   - Strictly subtle vertical float (`transform: translateY` only)
   - Fully static under `prefers-reduced-motion`
   ============================================================================ */
interface FloatingArtifactProps {
  className?: string;
  delay?: number;
  amplitude?: number;
}

export function NotebookPencil3D({
  className = '',
  delay = 0,
  amplitude = 6,
}: FloatingArtifactProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      animate={
        prefersReduced
          ? undefined
          : {
              y: [0, -amplitude, 0],
            }
      }
      transition={
        prefersReduced
          ? undefined
          : {
              duration: 6.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            }
      }
      className={`pointer-events-none select-none ${className}`}
    >
      <div className="rounded-2xl bg-[#FAF8F4]/96 backdrop-blur-md border border-[#E2DACB] shadow-[0_20px_42px_-16px_rgba(13,48,33,0.28)] p-3 flex items-center gap-3">
        <svg
          width="44"
          height="44"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          {/* Isometric base shadow */}
          <ellipse cx="24" cy="41" rx="16" ry="3.5" fill="#0D3021" fillOpacity="0.12" />
          {/* Forest cover back */}
          <path
            d="M10 13.5C10 11.8 11.3 10.5 13 10.5H33C34.7 10.5 36 11.8 36 13.5V35.5C36 37.2 34.7 38.5 33 38.5H13C11.3 38.5 10 37.2 10 35.5V13.5Z"
            fill="#0D3021"
          />
          {/* Ivory pages block */}
          <path
            d="M13 12H33.5C34.6 12 35.5 12.9 35.5 14V34.5C35.5 35.6 34.6 36.5 33.5 36.5H13V12Z"
            fill="#F6F1E7"
          />
          {/* Forest spine highlight */}
          <rect x="10" y="10.5" width="5" height="28" rx="2" fill="#184B35" />
          {/* Ruled editorial lines */}
          <line x1="18.5" y1="18.5" x2="31" y2="18.5" stroke="#B7C5BC" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="18.5" y1="23.5" x2="29" y2="23.5" stroke="#B7C5BC" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="18.5" y1="28.5" x2="26.5" y2="28.5" stroke="#D19A3D" strokeWidth="1.8" strokeLinecap="round" />
          {/* Angled wooden pencil */}
          <g transform="rotate(-32 33 24)">
            <rect x="30" y="9" width="5.2" height="22" rx="1.4" fill="#D49A37" />
            <rect x="30" y="9" width="5.2" height="4" rx="1.2" fill="#9A3B1E" />
            <path d="M30 31L32.6 36.2L35.2 31H30Z" fill="#EFE4CE" />
            <path d="M31.8 34.6L32.6 36.2L33.4 34.6H31.8Z" fill="#171C19" />
          </g>
        </svg>
        <div className="pr-1">
          <p className="text-[11px] font-semibold text-[#171C19] leading-tight">
            Practical Workshops
          </p>
          <p className="mt-0.5 text-[10.5px] text-[#5D6660] leading-tight">
            Interactive &amp; hands-on
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function Gullak3D({
  className = '',
  delay = 1.1,
  amplitude = 7,
}: FloatingArtifactProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      animate={
        prefersReduced
          ? undefined
          : {
              y: [0, amplitude, 0],
            }
      }
      transition={
        prefersReduced
          ? undefined
          : {
              duration: 7.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            }
      }
      className={`pointer-events-none select-none ${className}`}
    >
      <div className="rounded-2xl bg-[#FAF8F4]/96 backdrop-blur-md border border-[#E2DACB] shadow-[0_20px_42px_-16px_rgba(13,48,33,0.28)] p-3 flex items-center gap-3">
        <svg
          width="42"
          height="42"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <ellipse cx="24" cy="40" rx="14" ry="3.5" fill="#0D3021" fillOpacity="0.14" />
          {/* Handcrafted clay gullak body */}
          <path
            d="M11 26C11 18.2 16.4 13.5 24 13.5C31.6 13.5 37 18.2 37 26C37 33.4 31.8 38.5 24 38.5C16.2 38.5 11 33.4 11 26Z"
            fill="url(#gullakClay)"
          />
          {/* Subtle painted folk band */}
          <path
            d="M12.2 26.5C15.5 28.2 20 29 24 29C28 29 32.5 28.2 35.8 26.5"
            stroke="#FAF8F4"
            strokeOpacity="0.72"
            strokeWidth="1.6"
            strokeDasharray="3 3"
            strokeLinecap="round"
          />
          {/* Coin slot */}
          <rect x="19" y="16.2" width="10" height="2.4" rx="1.2" fill="#4E1C0E" />
          {/* Golden coin hovering gently above slot */}
          <circle cx="24" cy="9.5" r="4.5" fill="#E3A63A" stroke="#B67C1E" strokeWidth="1.2" />
          <circle cx="24" cy="9.5" r="2.2" stroke="#FFF6DF" strokeWidth="1" strokeOpacity="0.75" />
          <defs>
            <radialGradient
              id="gullakClay"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(19 20) rotate(55) scale(22)"
            >
              <stop stopColor="#D67C4B" />
              <stop offset="0.6" stopColor="#AE4D28" />
              <stop offset="1" stopColor="#7C2E14" />
            </radialGradient>
          </defs>
        </svg>
        <div className="pr-1">
          <p className="text-[11px] font-semibold text-[#171C19] leading-tight">
            Life &amp; Money Skills
          </p>
          <p className="mt-0.5 text-[10.5px] text-[#5D6660] leading-tight">
            Real-world habits
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function IdeaBulb3D({
  className = '',
  delay = 0.6,
  amplitude = 5,
}: FloatingArtifactProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      animate={
        prefersReduced
          ? undefined
          : {
              y: [0, -amplitude, 0],
            }
      }
      transition={
        prefersReduced
          ? undefined
          : {
              duration: 5.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            }
      }
      className={`pointer-events-none select-none ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#0D3021] border border-[#24563F] shadow-[0_18px_36px_-14px_rgba(13,48,33,0.45)] flex items-center justify-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="18" cy="14" r="10" fill="#E3A63A" fillOpacity="0.18" />
          <path
            d="M18 6C13.58 6 10 9.58 10 14C10 17.05 11.71 19.7 14.22 21.04C14.7 21.3 15 21.8 15 22.34V24H21V22.34C21 21.8 21.3 21.3 21.78 21.04C24.29 19.7 26 17.05 26 14C26 9.58 22.42 6 18 6Z"
            fill="url(#bulbGold)"
          />
          <rect x="14.5" y="25.2" width="7" height="2.2" rx="1.1" fill="#D5DEC8" />
          <rect x="15.5" y="28.4" width="5" height="2" rx="1" fill="#A2B5A8" />
          <path
            d="M15.5 14C15.5 12.62 16.62 11.5 18 11.5"
            stroke="#FFFDF6"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />
          <defs>
            <radialGradient
              id="bulbGold"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(15.5 11) rotate(56) scale(16)"
            >
              <stop stopColor="#FCE09B" />
              <stop offset="0.65" stopColor="#E3A63A" />
              <stop offset="1" stopColor="#B87A1D" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </motion.div>
  );
}
