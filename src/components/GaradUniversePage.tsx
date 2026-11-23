import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Compass,
  Library,
  MapPin,
  School,
  Users,
} from 'lucide-react';
import { usePageSeo } from '../utils/seo';
import { EASE_EDITORIAL } from './motion/MotionPrimitives';

interface GaradUniversePageProps {
  onNavigateHome: () => void;
  onNavigateActivity: (slug: string) => void;
  onNavigateCsrProject: (slug: string) => void;
  onNavigateLearningHub: () => void;
  onNavigateArchive: () => void;
  onNavigateVolunteer: () => void;
}

interface VillageZone {
  id: string;
  title: string;
  roleLabel: string;
  summary: string;
  verifiedContext: string;
  ctaLabel: string;
  icon: 'entrance' | 'school' | 'library' | 'learning' | 'community';
  xPercent: number;
  yPercent: number;
  action: 'archive' | 'mission-bharari' | 'granthalay' | 'learning-hub' | 'volunteer';
}

const VILLAGE_ZONES: VillageZone[] = [
  {
    id: 'zone-entrance',
    title: 'Mission Bharari Village Entrance',
    roleLabel: '01 · Community Welcome',
    summary:
      'Every Garad Foundation effort starts by walking into a community to listen first—meeting village elders, parents, and local teachers before designing support.',
    verifiedContext:
      'Baseline listening visits across rural Maharashtra including 10 Zilla Parishad schools in Bhor Taluka.',
    ctaLabel: 'Browse All 15 Activities',
    icon: 'entrance',
    xPercent: 16,
    yPercent: 68,
    action: 'archive',
  },
  {
    id: 'zone-school',
    title: 'Mission Bharari Schoolhouse',
    roleLabel: '02 · Tribal & Rural Education',
    summary:
      'Our flagship school initiative supporting young learners with customised notebooks, stationery kits, and direct educator collaboration.',
    verifiedContext:
      'Documented record: 220 students across 10 Zilla Parishad schools supported in Phase 1 (3 February 2021).',
    ctaLabel: 'Open Mission Bharari Record',
    icon: 'school',
    xPercent: 46,
    yPercent: 48,
    action: 'mission-bharari',
  },
  {
    id: 'zone-library',
    title: 'Garad Granthalay Library',
    roleLabel: '03 · Reading & Study Space',
    summary:
      'A peaceful village reading pavilion bringing curated Marathi, bilingual, and educational books into rural study corners.',
    verifiedContext:
      'Grounded in Gyansetu (books for 7 study libraries) and our rural library concept under development.',
    ctaLabel: 'Explore Garad Granthalay',
    icon: 'library',
    xPercent: 78,
    yPercent: 52,
    action: 'granthalay',
  },
  {
    id: 'zone-learning',
    title: 'Garad Learning Hub Courtyard',
    roleLabel: '04 · Skills Beyond Classrooms',
    summary:
      'Interactive workshops and youth training programmes including Sabse Bada Rupaiya, Shiv Shala, and the Youth Leadership Program.',
    verifiedContext:
      'Practical financial literacy and custom learning workshops for schools, colleges, corporates, and youth.',
    ctaLabel: 'Visit Garad Learning Hub',
    icon: 'learning',
    xPercent: 61,
    yPercent: 72,
    action: 'learning-hub',
  },
  {
    id: 'zone-community',
    title: 'Volunteer & Community Ground',
    roleLabel: '05 · Youth-Led Action',
    summary:
      'Where students, working professionals, and community supporters come together to pack kits, mentor learners, and lead grassroots outreach.',
    verifiedContext:
      'Open to students and working professionals across Thane and Maharashtra.',
    ctaLabel: 'Join as a Volunteer',
    icon: 'community',
    xPercent: 33,
    yPercent: 74,
    action: 'volunteer',
  },
];

export function GaradUniversePage({
  onNavigateHome,
  onNavigateActivity,
  onNavigateCsrProject,
  onNavigateLearningHub,
  onNavigateArchive,
  onNavigateVolunteer,
}: GaradUniversePageProps) {
  const prefersReduced = useReducedMotion();
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-school');

  usePageSeo({
    title: 'Garad Universe — Mission Bharari Interactive Village | Garad Foundation',
    description:
      'Explore the Garad Universe: an interactive rural village space connecting Mission Bharari School, Garad Granthalay Library, Garad Learning Hub, and community initiatives.',
    type: 'website',
  });

  const activeZone =
    VILLAGE_ZONES.find((z) => z.id === selectedZoneId) || VILLAGE_ZONES[1];

  const handleZoneAction = (action: VillageZone['action']) => {
    switch (action) {
      case 'mission-bharari':
        onNavigateActivity('mission-bharari-phase-1');
        break;
      case 'granthalay':
        onNavigateCsrProject('garad-granthalay');
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

  const renderZoneIcon = (icon: VillageZone['icon']) => {
    switch (icon) {
      case 'school':
        return <School className="w-4 h-4" />;
      case 'library':
        return <Library className="w-4 h-4" />;
      case 'learning':
        return <BookOpen className="w-4 h-4" />;
      case 'community':
        return <Users className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <main className="min-h-screen bg-[#0B2217] text-[#FAF8F4] pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/12">
          <button
            type="button"
            onClick={onNavigateHome}
            className="min-h-[40px] inline-flex items-center gap-2 text-[13.5px] font-semibold text-[#D3E0D8] hover:text-[#E8BC66] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Garad Homepage</span>
          </button>

          <p className="inline-flex items-center gap-2 text-[12px] font-medium text-[#E8BC66]">
            <Compass className="w-4 h-4" />
            <span>Garad Universe · Mission Bharari Village Explorer</span>
          </p>
        </div>

        {/* Heading */}
        <div className="mt-8 max-w-3xl">
          <h1 className="font-serif text-[34px] sm:text-[46px] font-bold leading-[1.08] text-[#FAF8F4] text-balance">
            A World of Learning. A Journey of Possibilities.
          </h1>
          <p className="mt-3.5 text-[15.5px] leading-[1.68] text-[#CFE0D6]">
            Select any landmark across the Mission Bharari village environment
            below—from the village entrance and Zilla Parishad schoolhouse to
            the Garad Granthalay library and learning courtyard—to explore real
            Garad Foundation initiatives.
          </p>
        </div>

        {/* Interactive Village Explorer Grid */}
        <div className="mt-9 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Interactive Village Map Canvas */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-white/15 bg-[#122F21] relative min-h-[380px] sm:min-h-[470px]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#1E4537] via-[#4A6E57] via-52% to-[#DDA960]" />

            {/* Stylized Village Architecture SVG */}
            <svg
              aria-hidden="true"
              viewBox="0 0 1200 675"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 w-full h-full"
            >
              <path
                d="M0 360 Q180 250 380 310 T760 275 T1200 300 L1200 675 L0 675 Z"
                fill="#244B3A"
                opacity="0.85"
              />
              <path
                d="M0 420 Q280 365 600 410 T1200 390 L1200 675 L0 675 Z"
                fill="#355F40"
              />
              <path
                d="M70 675 C180 580 310 520 510 500 C690 482 860 515 1030 570 L1030 612 C850 555 680 524 510 546 C340 568 240 622 175 675 Z"
                fill="#D4B88A"
                opacity="0.92"
              />

              {/* Entrance Arch */}
              <g transform="translate(130, 425)">
                <rect x="14" y="24" width="16" height="82" rx="3" fill="#E8DCC6" />
                <rect x="94" y="24" width="16" height="82" rx="3" fill="#E8DCC6" />
                <path d="M4 26 L62 6 L120 26 L116 38 L8 38 Z" fill="#A94A2A" />
                <rect x="24" y="22" width="76" height="14" rx="2" fill="#F5EBDA" />
              </g>

              {/* Mission Bharari School */}
              <g transform="translate(415, 290)">
                <rect x="22" y="64" width="212" height="106" rx="4" fill="#F4ECDC" />
                <polygon points="234,64 274,78 274,170 234,170" fill="#D5C6AE" />
                <polygon points="6,68 128,10 250,68" fill="#B54927" />
                <polygon points="128,10 250,68 286,80 164,24" fill="#8C3318" />
                <rect x="50" y="106" width="32" height="38" rx="14" fill="#F7C971" />
                <rect x="108" y="96" width="44" height="74" rx="4" fill="#6E3B23" />
                <rect x="178" y="106" width="32" height="38" rx="14" fill="#F7C971" />
              </g>

              {/* Garad Granthalay Library */}
              <g transform="translate(815, 325)">
                <rect x="22" y="54" width="148" height="86" rx="4" fill="#EFE4D0" />
                <polygon points="170,54 202,66 202,140 170,140" fill="#CBBAA0" />
                <polygon points="8,58 96,16 184,58" fill="#174C38" />
                <polygon points="96,16 184,58 214,68 126,28" fill="#0F3527" />
                <rect x="42" y="76" width="108" height="56" rx="4" fill="#2A4435" />
                <rect x="52" y="88" width="88" height="8" rx="2" fill="#E3A63A" />
                <rect x="52" y="102" width="88" height="8" rx="2" fill="#D5734E" />
                <rect x="52" y="116" width="88" height="8" rx="2" fill="#8CC49E" />
              </g>

              {/* Trees */}
              <g>
                <rect x="735" y="388" width="14" height="56" rx="5" fill="#4A3222" />
                <circle cx="742" cy="364" r="38" fill="#1F4D32" />
                <rect x="1075" y="420" width="16" height="60" rx="5" fill="#4A3222" />
                <circle cx="1083" cy="396" r="42" fill="#1F4D32" />
              </g>
            </svg>

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#091C13]/72 via-transparent to-[#091C13]/25"
            />

            {/* Interactive Zone Markers */}
            {VILLAGE_ZONES.map((zone) => {
              const selected = zone.id === activeZone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedZoneId(zone.id)}
                  style={{ left: `${zone.xPercent}%`, top: `${zone.yPercent}%` }}
                  aria-pressed={selected}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] sm:text-[13px] font-semibold transition-all cursor-pointer shadow-lg whitespace-nowrap ${
                    selected
                      ? 'bg-[#E3A63A] text-[#0D2118] scale-105'
                      : 'bg-[#0C2419]/88 text-[#FAF8F4] border border-white/25 hover:bg-[#17412D]'
                  }`}
                >
                  {renderZoneIcon(zone.icon)}
                  <span className="hidden sm:inline">
                    {zone.title.split(' ').slice(0, 2).join(' ')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Active Zone Detail Panel */}
          <div className="lg:col-span-4 rounded-3xl bg-[#112C1F] border border-white/14 p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <p className="text-[11.5px] font-semibold tracking-[0.12em] text-[#E8BC66]">
                Selected Village Space
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeZone.id}
                  initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.24, ease: EASE_EDITORIAL }}
                >
                  <p className="mt-4 text-[12px] font-medium text-[#A9C2B3]">
                    {activeZone.roleLabel}
                  </p>
                  <h2 className="mt-1 font-serif text-[26px] font-bold text-[#FAF8F4] leading-snug">
                    {activeZone.title}
                  </h2>
                  <p className="mt-3 text-[14.5px] leading-[1.68] text-[#D2E0D8]">
                    {activeZone.summary}
                  </p>
                  <p className="mt-4 pt-4 border-t border-white/12 text-[13px] leading-relaxed text-[#E8BC66]/90">
                    {activeZone.verifiedContext}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleZoneAction(activeZone.action)}
                    className="mt-6 min-h-[46px] w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#E3A63A] hover:bg-[#D5972C] text-[#0D2118] text-[14px] font-semibold transition-colors cursor-pointer"
                  >
                    <span>{activeZone.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Quick Zone Switcher List */}
            <div className="mt-7 pt-5 border-t border-white/12 space-y-1.5">
              {VILLAGE_ZONES.map((zone) => {
                const isSelected = zone.id === activeZone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZoneId(zone.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white/14 text-[#FAF8F4]'
                        : 'text-[#B5C9BD] hover:bg-white/6 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{zone.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
