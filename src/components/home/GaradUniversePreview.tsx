import React, { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ArrowRight, Compass, MapPin } from 'lucide-react';
import {
  GARAD_UNIVERSE_LANDMARKS,
  GaradUniverseLandmark,
} from '../../data/homepage';
import { EASE_EDITORIAL } from '../motion/MotionPrimitives';

interface GaradUniversePreviewProps {
  onExploreUniverse: () => void;
  onSelectLandmarkDestination: (
    destination: GaradUniverseLandmark['destination']
  ) => void;
}

/**
 * Immersive animated 2.5D/3D-depth village preview inspired by the
 * Mission Bharari rural village environment (village entrance, school, library).
 * Uses lightweight compositor-only transforms and respects prefers-reduced-motion.
 */
export function GaradUniversePreview({
  onExploreUniverse,
  onSelectLandmarkDestination,
}: GaradUniversePreviewProps) {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeLandmarkId, setActiveLandmarkId] = useState<string>(
    GARAD_UNIVERSE_LANDMARKS[1].id
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Gentle cinematic camera push-in and layered depth parallax
  const sceneScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.055, 1.08]);
  const distantHillsY = useTransform(scrollYProgress, [0, 1], [-12, 14]);
  const midgroundY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  const activeLandmark =
    GARAD_UNIVERSE_LANDMARKS.find((l) => l.id === activeLandmarkId) ||
    GARAD_UNIVERSE_LANDMARKS[1];

  return (
    <section
      ref={sectionRef}
      id="garad-universe"
      aria-labelledby="garad-universe-heading"
      className="relative py-20 sm:py-24 lg:py-28 bg-[#0C2419] text-[#FAF8F4] overflow-hidden"
    >
      {/* Subtle warm ambient atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[360px] rounded-full bg-[#E3A63A]/10 blur-3xl"
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Header Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end mb-10 sm:mb-12">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: EASE_EDITORIAL }}
            className="lg:col-span-7"
          >
            <p className="text-[12px] font-semibold tracking-[0.14em] text-[#E8BC66]">
              Explore Garad Universe · Mission Bharari Village
            </p>
            <h2
              id="garad-universe-heading"
              className="mt-3 font-serif text-[32px] sm:text-[42px] lg:text-[48px] font-bold leading-[1.09] tracking-[-0.02em] text-[#FAF8F4] text-balance"
            >
              A World of Learning. A Journey of Possibilities.
            </h2>
          </motion.div>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.08, ease: EASE_EDITORIAL }}
            className="lg:col-span-5 flex flex-col items-start lg:items-end"
          >
            <p className="text-[15.5px] leading-[1.68] text-[#CEDCD3] lg:text-right max-w-[44ch]">
              Step into the Garad Universe — an interactive world where our
              initiatives, learning spaces and stories come together.
            </p>
            <button
              type="button"
              onClick={onExploreUniverse}
              className="mt-5 min-h-[48px] inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-xl bg-[#E3A63A] hover:bg-[#D5972C] text-[#0D2118] text-[14.5px] font-semibold shadow-[0_14px_30px_-10px_rgba(227,166,58,0.42)] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A63A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C2419]"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Garad Universe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Interactive 2.5D Stylized Rural Maharashtra Village Stage */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
          className="relative rounded-3xl overflow-hidden border border-white/14 bg-[#133022] shadow-[0_32px_70px_-28px_rgba(0,0,0,0.68)]"
        >
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
            {/* Animated Camera Container */}
            <motion.div
              style={prefersReduced ? undefined : { scale: sceneScale }}
              className="absolute inset-0 will-change-transform"
            >
              {/* Layer 1: Golden-Hour Sky & Sun */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-[#204538] via-[#4C6D58] via-52% to-[#D9A75E]"
              />

              {/* Warm Sun Halo */}
              <motion.div
                aria-hidden="true"
                animate={
                  prefersReduced
                    ? undefined
                    : { opacity: [0.75, 0.95, 0.75], scale: [1, 1.04, 1] }
                }
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[11%] left-[56%] w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-radial from-[#FFF2CC]/80 via-[#EBB354]/35 to-transparent blur-xl"
              />

              {/* Layer 2: Drifting Stylized Clouds */}
              <motion.svg
                aria-hidden="true"
                viewBox="0 0 1200 220"
                className="absolute top-[4%] left-0 w-[120%] h-auto opacity-45"
                animate={prefersReduced ? undefined : { x: [0, -45, 0] }}
                transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
              >
                <g fill="#FAF3E3">
                  <ellipse cx="220" cy="86" rx="88" ry="22" opacity="0.55" />
                  <ellipse cx="265" cy="74" rx="54" ry="20" opacity="0.7" />
                  <ellipse cx="640" cy="64" rx="108" ry="24" opacity="0.45" />
                  <ellipse cx="705" cy="54" rx="60" ry="19" opacity="0.6" />
                  <ellipse cx="1010" cy="96" rx="92" ry="21" opacity="0.5" />
                </g>
              </motion.svg>

              {/* Layer 3: Distant Sahyadri Mountain Ridges */}
              <motion.svg
                aria-hidden="true"
                style={prefersReduced ? undefined : { y: distantHillsY }}
                viewBox="0 0 1200 675"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 w-full h-full"
              >
                <defs>
                  <linearGradient id="sahyadriFar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#264C3B" />
                    <stop offset="100%" stopColor="#1B392C" />
                  </linearGradient>
                  <linearGradient id="sahyadriMid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2F5E45" />
                    <stop offset="100%" stopColor="#1B3E2D" />
                  </linearGradient>
                  <linearGradient id="villageMeadow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F794E" />
                    <stop offset="55%" stopColor="#32583B" />
                    <stop offset="100%" stopColor="#1E3D2A" />
                  </linearGradient>
                  <linearGradient id="villagePath" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#DFC69B" />
                    <stop offset="100%" stopColor="#B89460" />
                  </linearGradient>
                </defs>

                {/* Distant hills */}
                <path
                  d="M0 365 Q160 250 340 315 T740 280 T1060 310 L1200 285 L1200 675 L0 675 Z"
                  fill="url(#sahyadriFar)"
                  opacity="0.82"
                />
                {/* Closer green ridges */}
                <path
                  d="M0 405 Q210 325 460 375 T910 345 T1200 375 L1200 675 L0 675 Z"
                  fill="url(#sahyadriMid)"
                />
                {/* Rolling village ground */}
                <path
                  d="M0 445 Q300 405 620 432 T1200 420 L1200 675 L0 675 Z"
                  fill="url(#villageMeadow)"
                />
                {/* Warm earthen village pathway curving from entrance to school & library */}
                <path
                  d="M70 675 C175 595 255 545 430 515 C590 488 730 500 945 538 L945 568 C745 530 585 524 445 554 C290 586 245 632 190 675 Z"
                  fill="url(#villagePath)"
                  opacity="0.92"
                />
              </motion.svg>

              {/* Layer 4: Stylized 3D Architectural Landmarks (Entrance, School, Library, Trees) */}
              <motion.svg
                aria-hidden="true"
                style={prefersReduced ? undefined : { y: midgroundY }}
                viewBox="0 0 1200 675"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 w-full h-full"
              >
                {/* Left Banyan / Mango Trees with gentle canopy depth */}
                <g>
                  <rect x="92" y="425" width="16" height="62" rx="6" fill="#4A3222" />
                  <circle cx="100" cy="402" r="46" fill="#1F4A31" />
                  <circle cx="76" cy="414" r="32" fill="#2A5E3E" />
                  <circle cx="126" cy="414" r="30" fill="#3B724D" />
                </g>

                {/* Village Entrance Arch (Left Foreground) */}
                <g transform="translate(155, 442)">
                  {/* Ground shadow */}
                  <ellipse cx="64" cy="108" rx="76" ry="14" fill="#10291C" opacity="0.4" />
                  {/* Pillars */}
                  <rect x="14" y="24" width="18" height="82" rx="3" fill="#E8DCC6" />
                  <rect x="26" y="24" width="6" height="82" fill="#CBB898" />
                  <rect x="96" y="24" width="18" height="82" rx="3" fill="#E8DCC6" />
                  <rect x="108" y="24" width="6" height="82" fill="#CBB898" />
                  {/* Warm terracotta lintel beam */}
                  <path d="M4 26 L64 6 L124 26 L120 38 L8 38 Z" fill="#A94A2A" />
                  <rect x="24" y="22" width="80" height="14" rx="2" fill="#F5EBDA" />
                  <rect x="44" y="27" width="40" height="4" rx="2" fill="#0D3021" opacity="0.65" />
                </g>

                {/* Centerpiece: Mission Bharari Zilla Parishad School Building (3D Isometric Projection) */}
                <g transform="translate(430, 305)">
                  {/* Soft architectural shadow */}
                  <ellipse cx="145" cy="176" rx="158" ry="22" fill="#0E2418" opacity="0.42" />
                  {/* Main ivory wall + right shaded side wall */}
                  <rect x="24" y="64" width="212" height="106" rx="4" fill="#F4ECDC" />
                  <polygon points="236,64 276,78 276,170 236,170" fill="#D5C6AE" />
                  {/* Terracotta pitched roof with overhang */}
                  <polygon points="8,68 130,10 252,68" fill="#B54927" />
                  <polygon points="130,10 252,68 288,80 166,24" fill="#8C3318" />
                  {/* Verandah arches */}
                  <rect x="46" y="102" width="38" height="46" rx="18" fill="#1E4432" />
                  <rect x="110" y="96" width="44" height="74" rx="4" fill="#6E3B23" />
                  <rect x="176" y="102" width="38" height="46" rx="18" fill="#1E4432" />
                  {/* Warm illuminated classroom window glow */}
                  <rect x="52" y="108" width="26" height="34" rx="12" fill="#F7C971" opacity="0.88" />
                  <rect x="182" y="108" width="26" height="34" rx="12" fill="#F7C971" opacity="0.88" />
                  {/* Flagpole in school courtyard */}
                  <rect x="12" y="80" width="3" height="90" fill="#DFD5C3" />
                  <rect x="15" y="82" width="20" height="5" fill="#E68A2E" />
                  <rect x="15" y="87" width="20" height="5" fill="#FAF8F4" />
                  <rect x="15" y="92" width="20" height="5" fill="#1E6B42" />
                </g>

                {/* Trees framing School & Library */}
                <g>
                  <rect x="738" y="392" width="14" height="54" rx="5" fill="#4A3222" />
                  <circle cx="745" cy="370" r="38" fill="#1F4D32" />
                  <circle cx="766" cy="382" r="26" fill="#3B724D" />
                </g>

                {/* Right Landmark: Garad Granthalay Village Library Pavilion */}
                <g transform="translate(822, 344)">
                  <ellipse cx="105" cy="146" rx="118" ry="18" fill="#0E2418" opacity="0.42" />
                  {/* Timber & stone library body */}
                  <rect x="22" y="54" width="148" height="86" rx="4" fill="#EFE4D0" />
                  <polygon points="170,54 202,66 202,140 170,140" fill="#CBBAA0" />
                  {/* Warm library roof */}
                  <polygon points="8,58 96,16 184,58" fill="#174C38" />
                  <polygon points="96,16 184,58 214,68 126,28" fill="#0F3527" />
                  {/* Open reading veranda & visible glowing bookshelves */}
                  <rect x="42" y="76" width="108" height="56" rx="4" fill="#2A4435" />
                  {/* Book rows */}
                  <rect x="52" y="88" width="88" height="8" rx="2" fill="#E3A63A" opacity="0.88" />
                  <rect x="52" y="102" width="88" height="8" rx="2" fill="#D5734E" opacity="0.85" />
                  <rect x="52" y="116" width="88" height="8" rx="2" fill="#8CC49E" opacity="0.82" />
                </g>

                {/* Right-edge lush canopy */}
                <g>
                  <rect x="1088" y="428" width="16" height="62" rx="6" fill="#4A3222" />
                  <circle cx="1096" cy="404" r="44" fill="#1E492F" />
                  <circle cx="1068" cy="418" r="28" fill="#2E6342" />
                </g>
              </motion.svg>

              {/* Soft vignette for UI legibility */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#091C13]/85 via-transparent to-[#091C13]/30"
              />
            </motion.div>

            {/* Interactive Village Landmark Hotspots */}
            {GARAD_UNIVERSE_LANDMARKS.map((landmark) => {
              const isSelected = landmark.id === activeLandmark.id;
              return (
                <button
                  key={landmark.id}
                  type="button"
                  onClick={() => setActiveLandmarkId(landmark.id)}
                  style={{
                    left: `${landmark.xPercent}%`,
                    top: `${landmark.yPercent}%`,
                  }}
                  aria-pressed={isSelected}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] sm:text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A63A] ${
                    isSelected
                      ? 'bg-[#E3A63A] text-[#0C2117] scale-105'
                      : 'bg-[#0C2419]/86 text-[#FAF8F4] border border-white/24 hover:bg-[#143928]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{landmark.title}</span>
                  <span className="sm:hidden">
                    {landmark.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}

            {/* Bottom Floating Landmark Narrative Drawer */}
            <div className="absolute bottom-3 sm:bottom-5 inset-x-3 sm:inset-x-5 z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLandmark.id}
                  initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: EASE_EDITORIAL }}
                  className="rounded-2xl bg-[#0B2016]/90 backdrop-blur-md border border-white/15 px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-medium text-[#E8BC66]">
                      {activeLandmark.subtitle}
                    </p>
                    <h3 className="mt-0.5 font-serif text-[19px] sm:text-[21px] font-bold text-[#FAF8F4]">
                      {activeLandmark.title}
                    </h3>
                    <p className="mt-1 text-[13.5px] sm:text-[14px] text-[#D3E0D8] leading-relaxed max-w-[60ch]">
                      {activeLandmark.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onSelectLandmarkDestination(activeLandmark.destination)
                    }
                    className="min-h-[42px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/18 border border-white/20 text-[#FAF8F4] text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start md:self-center"
                  >
                    <span>{activeLandmark.destinationLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
