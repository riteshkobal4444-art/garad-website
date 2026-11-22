import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { BookOpenCheck, RotateCcw } from 'lucide-react';
import {
  ACTIVITIES,
  ActivityCategory,
  FiscalYearId,
  HERO_STATISTICS,
} from '../data/activities';
import { formatFinancialYearLabel } from '../utils/financialYear';
import { usePageSeo } from '../utils/seo';
import { CivicTrajectory3D } from './CivicTrajectory3D';
import { FilterDock } from './FilterDock';
import { ActivityCard } from './ActivityCard';
import { EASE_EDITORIAL, Tilt3DCard } from './motion/MotionPrimitives';

interface InitiativesPageProps {
  selectedYear: FiscalYearId;
  selectedCategory: ActivityCategory;
  onSelectYear: (year: FiscalYearId) => void;
  onSelectCategory: (category: ActivityCategory) => void;
  onNavigateActivity: (slug: string) => void;
}

export function InitiativesPage({
  selectedYear,
  selectedCategory,
  onSelectYear,
  onSelectCategory,
  onNavigateActivity,
}: InitiativesPageProps) {
  const prefersReduced = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');

  const archiveStructuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Garad Foundation',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Thane',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
      description:
        'Official digital activity archive of Garad Foundation, documenting grassroots work in community welfare, women and health awareness, youth development, public health, education, environment, and Marathi language and culture.',
    }),
    []
  );

  usePageSeo({
    title: 'Garad Foundation — Official Activity Archive (FY 2018–2026)',
    description:
      'Explore Garad Foundation’s documented financial-year activity archive across Thane and Maharashtra: education drives, women’s health, blood donation, youth development, and community welfare.',
    type: 'website',
    structuredData: archiveStructuredData,
  });

  const filteredActivities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ACTIVITIES.filter((item) => {
      const yearMatch = selectedYear === 'all' || item.year === selectedYear;
      const categoryMatch =
        selectedCategory === 'All' ||
        item.category === selectedCategory ||
        Boolean(item.secondaryCategories?.includes(selectedCategory));
      if (!yearMatch || !categoryMatch) return false;
      if (!q) return true;

      const searchableText = [
        item.title,
        item.subtitle || '',
        item.shortTitle,
        item.date,
        item.yearDisplay,
        item.location,
        item.category,
        item.categoryDisplayLabel || '',
        ...(item.secondaryCategories || []),
        item.cardDescription,
        item.cardKeyStat,
        item.introduction,
        item.needAndRationale.heading,
        ...item.needAndRationale.paragraphs,
        item.whatWeDid.heading,
        ...item.whatWeDid.paragraphs,
        ...(item.partners?.map((p) => `${p.name} ${p.role}`) || []),
        ...(item.outputs?.items || []),
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(q);
    });
  }, [selectedYear, selectedCategory, searchQuery]);

  const displayYearLabel =
    selectedYear === 'all'
      ? 'FY 2018–2026'
      : `FY ${formatFinancialYearLabel(selectedYear)}`;

  const isUnpopulatedFutureYear =
    selectedYear !== 'all' &&
    !ACTIVITIES.some((item) => item.year === selectedYear);

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16">
      {/* ==================== HERO SECTION ==================== */}
      <section
        aria-labelledby="initiatives-hero-heading"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center"
      >
        {/* Left Editorial Column */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Eyebrow */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.04, ease: EASE_EDITORIAL }}
            className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#ECEEE9] border border-[#DFE4DC] text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#284234]"
          >
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full bg-[#245A41]"
            />
            <span>GARAD FOUNDATION · THANE, MAHARASHTRA</span>
          </motion.div>

          {/* Main Headline + Slightly Delayed Highlighted Phrase */}
          <h1
            id="initiatives-hero-heading"
            className="mt-5 font-serif text-[38px] sm:text-[48px] lg:text-[52px] font-bold tracking-[-0.02em] leading-[1.1] text-[#171C19] text-balance"
          >
            <motion.span
              initial={prefersReduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.1, ease: EASE_EDITORIAL }}
              className="inline-block mr-2.5"
            >
              Small efforts.
            </motion.span>
            <motion.span
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, delay: 0.22, ease: EASE_EDITORIAL }}
              className="inline-block italic font-semibold text-[#9A3B1E]"
            >
              Meaningful change.
            </motion.span>
          </h1>

          {/* Supporting Paragraph */}
          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.56, delay: 0.3, ease: EASE_EDITORIAL }}
            className="mt-4 max-w-[560px] text-[15.5px] sm:text-[16.5px] leading-[1.68] text-[#555E58]"
          >
            Official activity archive documenting Garad Foundation&apos;s
            grassroots outreach across community welfare, women&apos;s health,
            education, public health, youth development, and Marathi culture.
          </motion.p>

          {/* Four Hero Statistic Cards */}
          <div className="mt-7 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 items-stretch">
            {HERO_STATISTICS.map((stat, idx) => (
              <motion.div
                key={stat.id}
                initial={prefersReduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.54,
                  delay: 0.36 + idx * 0.08,
                  ease: EASE_EDITORIAL,
                }}
                className="h-full"
              >
                <Tilt3DCard
                  maxTilt={4.5}
                  elevationY={-5}
                  glareOpacity={0.09}
                  className="chrome-card chrome-card-subtle h-full min-h-[104px] rounded-[14px] bg-white px-4 py-4 flex flex-col justify-center"
                >
                  <p className="font-serif text-[26px] sm:text-[28px] font-bold text-[#171C19] leading-none tracking-[-0.015em] tabular-nums">
                    {stat.value}
                  </p>
                  <p className="mt-2.5 text-[12px] font-medium text-[#5C6660] leading-snug">
                    {stat.label}
                  </p>
                </Tilt3DCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right 3D Isometric Timeline Card */}
        <div className="lg:col-span-5">
          <CivicTrajectory3D
            selectedYear={selectedYear}
            onSelectYear={onSelectYear}
          />
        </div>
      </section>

      {/* ==================== STICKY FLOATING FILTER DOCK ==================== */}
      <FilterDock
        selectedYear={selectedYear}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onSelectYear={onSelectYear}
        onSelectCategory={onSelectCategory}
        onSearchChange={setSearchQuery}
      />

      {/* ==================== ARCHIVED ACTIVITIES GRID ==================== */}
      <section aria-labelledby="archived-initiatives-heading">
        {/* Section Heading Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-baseline gap-2.5">
            <span
              aria-hidden="true"
              className="w-2.5 h-2.5 rounded-full bg-[#9A3B1E] shrink-0 self-center"
            />
            <h2
              id="archived-initiatives-heading"
              className="font-serif text-[26px] sm:text-[30px] font-bold tracking-[-0.015em] text-[#171C19]"
            >
              Documented Activities
            </h2>
            <span className="text-[14px] font-medium text-[#6C746F] tabular-nums">
              ({displayYearLabel})
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F1E9] border border-[#E6DFD2] text-[11.5px] font-semibold text-[#3C4640] tabular-nums">
            <BookOpenCheck className="w-3.5 h-3.5 text-[#9A3B1E]" />
            <span>
              {filteredActivities.length}{' '}
              {filteredActivities.length === 1
                ? 'Documented Activity'
                : 'Documented Activities'}{' '}
              · {displayYearLabel}
            </span>
          </div>
        </div>

        {/* Activity Cards Grid or Tasteful Empty State */}
        {filteredActivities.length > 0 ? (
          <motion.div
            layout={!prefersReduced}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
          >
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((activity, index) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  index={index}
                  onNavigateActivity={onNavigateActivity}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
            className="chrome-card chrome-card-lift rounded-2xl bg-white p-8 sm:p-12 text-center"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A3B1E]">
              Financial Year {selectedYear === 'all' ? '2018–2026' : formatFinancialYearLabel(selectedYear)}
            </p>
            <h3 className="mt-2 font-serif text-2xl font-bold text-[#171C19]">
              {searchQuery.trim()
                ? `No documented activities match "${searchQuery.trim()}".`
                : isUnpopulatedFutureYear
                ? `No activities have been published for ${displayYearLabel} yet.`
                : 'No documented activities match this category filter.'}
            </h3>
            <p className="mt-2.5 max-w-lg mx-auto text-[14px] leading-relaxed text-[#58625C]">
              {searchQuery.trim()
                ? 'Try searching with a different keyword or reset all filters to browse the complete archive.'
                : isUnpopulatedFutureYear
                ? 'Verified activities for this April–March financial year will appear here once organisational documentation is approved and added.'
                : 'Try clearing the category filter or viewing all documented activities across the archive.'}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onSelectYear('all');
                  onSelectCategory('All');
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0D3021] hover:bg-[#16402E] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>View All Documented Activities ({ACTIVITIES.length})</span>
              </button>
              {selectedCategory !== 'All' && (
                <button
                  type="button"
                  onClick={() => onSelectCategory('All')}
                  className="px-4 py-2.5 rounded-lg bg-[#F4F0E8] hover:bg-[#EAE3D5] text-[#28332D] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Clear Category Filter
                </button>
              )}
            </div>
          </motion.div>
        )}
      </section>

      {/* ==================== ARCHIVE SUMMARY BAR ==================== */}
      <div
        role="status"
        aria-label="Archive summary"
        className="mt-16 pt-6 border-t border-[#E6DFD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px] text-[#66706A]"
      >
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="w-2 h-2 rounded-full bg-[#1C553C] shrink-0"
          />
          <span className="tabular-nums">
            Showing {filteredActivities.length} of {ACTIVITIES.length} documented
            activities
            {selectedYear === 'all'
              ? ' across FY 2018–2026 archive'
              : ` for ${displayYearLabel}`}
          </span>
        </div>
        <span className="font-mono text-[11px] tracking-[0.1em] text-[#7D8580]">
          GARAD FOUNDATION · FINANCIAL YEAR ARCHIVE (APR–MAR)
        </span>
      </div>
    </main>
  );
}
