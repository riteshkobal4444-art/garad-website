import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  Clock,
  ExternalLink,
  Eye,
  Film,
  Lock,
  Maximize2,
  Play,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import {
  formatPublicationDate,
  getMediaFinancialYear,
  getMediaFinancialYears,
  getMediaOverviewCounts,
  getMediaTypeLabel,
  groupMediaByPublicationYear,
  IS_SHOWING_DEMO_MEDIA_ARCHIVE,
  isSafeExternalUrl,
  MEDIA_COVERAGE_ITEMS,
  MediaCoverageItem,
  MediaType,
} from '../data/mediaCoverage';
import {
  ConcreteFinancialYearId,
  formatFinancialYearLabel,
} from '../utils/financialYear';
import { usePageSeo } from '../utils/seo';
import { NewspaperClippingSheet } from './NewspaperClippingSheet';
import {
  DigitalArticlePreviewModal,
  NewspaperClippingViewerModal,
  NewsVideoPlayerModal,
} from './MediaViewerModals';
import { EASE_EDITORIAL } from './motion/MotionPrimitives';

type MediaFilterType = 'all' | MediaType;
type MediaFyFilter = 'all' | ConcreteFinancialYearId;

interface InTheNewsPageProps {
  onNavigateArchive: () => void;
  onNavigateActivity: (slug: string) => void;
  onNavigateReports: () => void;
}

export function InTheNewsPage({
  onNavigateArchive,
  onNavigateActivity,
  onNavigateReports,
}: InTheNewsPageProps) {
  const prefersReduced = useReducedMotion();

  const [selectedType, setSelectedType] = useState<MediaFilterType>('all');
  const [selectedFy, setSelectedFy] = useState<MediaFyFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [activeClipping, setActiveClipping] =
    useState<MediaCoverageItem | null>(null);
  const [activeVideo, setActiveVideo] = useState<MediaCoverageItem | null>(
    null
  );
  const [activeDigitalPreview, setActiveDigitalPreview] =
    useState<MediaCoverageItem | null>(null);

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Garad in the News — Garad Foundation Media Archive',
      description:
        'Explore the stories, publications and media coverage highlighting our work with communities.',
      publisher: {
        '@type': 'Organization',
        name: 'Garad Foundation',
      },
    }),
    []
  );

  usePageSeo({
    title: 'Garad in the News — Garad Foundation Media Archive',
    description:
      'Explore the stories, publications and media coverage highlighting our work with communities.',
    type: 'website',
    structuredData,
  });

  // Live overview counts derived strictly from MEDIA_COVERAGE_ITEMS (never hardcoded)
  const overviewCounts = useMemo(
    () => getMediaOverviewCounts(MEDIA_COVERAGE_ITEMS),
    []
  );

  // Financial years derived strictly from each item's publicationDate (April–March rule)
  const publicationFinancialYears = useMemo(
    () => getMediaFinancialYears(MEDIA_COVERAGE_ITEMS),
    []
  );

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MEDIA_COVERAGE_ITEMS.filter((item) => {
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (selectedFy !== 'all') {
        const itemFy = getMediaFinancialYear(item.publicationDate);
        if (itemFy !== selectedFy) return false;
      }
      if (!q) return true;

      const haystack = [
        item.headline,
        item.publicationName,
        item.publicationDate,
        formatPublicationDate(item),
        item.description,
        item.category || '',
        item.editionNote || '',
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [selectedType, selectedFy, searchQuery]);

  const newspaperItems = useMemo(
    () => filteredItems.filter((item) => item.type === 'newspaper'),
    [filteredItems]
  );

  const digitalItems = useMemo(
    () => filteredItems.filter((item) => item.type === 'digital'),
    [filteredItems]
  );

  const videoItems = useMemo(
    () => filteredItems.filter((item) => item.type === 'video'),
    [filteredItems]
  );

  const timelineGroups = useMemo(
    () => groupMediaByPublicationYear(filteredItems),
    [filteredItems]
  );

  // Hero visual composition items drawn from the dataset
  const heroPrimaryClipping = useMemo(
    () =>
      MEDIA_COVERAGE_ITEMS.find(
        (i) => i.type === 'newspaper' && i.layoutVariant === 'featured'
      ) ||
      MEDIA_COVERAGE_ITEMS.find((i) => i.type === 'newspaper') ||
      null,
    []
  );
  const heroSecondaryClipping = useMemo(
    () =>
      MEDIA_COVERAGE_ITEMS.find(
        (i) =>
          i.type === 'newspaper' &&
          i.id !== heroPrimaryClipping?.id &&
          i.layoutVariant === 'archival'
      ) ||
      MEDIA_COVERAGE_ITEMS.find(
        (i) => i.type === 'newspaper' && i.id !== heroPrimaryClipping?.id
      ) ||
      null,
    [heroPrimaryClipping]
  );
  const heroAccentPhotoItem = useMemo(
    () =>
      MEDIA_COVERAGE_ITEMS.find(
        (i) => i.type === 'digital' && Boolean(i.thumbnail)
      ) ||
      MEDIA_COVERAGE_ITEMS.find((i) => Boolean(i.thumbnail)) ||
      null,
    []
  );

  // Varied newspaper archive layout partitions:
  // Featured (large) + Archival (compact) on row 1, Medium clippings on row 2
  const featuredClipping = useMemo(
    () =>
      newspaperItems.find((i) => i.layoutVariant === 'featured') ||
      newspaperItems[0] ||
      null,
    [newspaperItems]
  );
  const archivalClipping = useMemo(
    () =>
      newspaperItems.find(
        (i) =>
          i.id !== featuredClipping?.id && i.layoutVariant === 'archival'
      ) || null,
    [newspaperItems, featuredClipping]
  );
  const mediumClippings = useMemo(
    () =>
      newspaperItems.filter(
        (i) => i.id !== featuredClipping?.id && i.id !== archivalClipping?.id
      ),
    [newspaperItems, featuredClipping, archivalClipping]
  );

  const featuredVideo = videoItems[0] || null;
  const secondaryVideos = videoItems.slice(1);

  const hasActiveFilters =
    selectedType !== 'all' ||
    selectedFy !== 'all' ||
    searchQuery.trim().length > 0;

  const resetFilters = () => {
    setSelectedType('all');
    setSelectedFy('all');
    setSearchQuery('');
  };

  const showNewspaperSection =
    selectedType === 'all' || selectedType === 'newspaper';
  const showDigitalSection =
    selectedType === 'all' || selectedType === 'digital';
  const showVideoSection = selectedType === 'all' || selectedType === 'video';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  };

  const handleOpenMediaItem = (item: MediaCoverageItem) => {
    if (item.type === 'newspaper') {
      setActiveClipping(item);
      return;
    }
    if (item.type === 'video') {
      setActiveVideo(item);
      return;
    }
    if (item.type === 'digital') {
      if (!item.isDemo && isSafeExternalUrl(item.articleUrl) && item.articleUrl) {
        window.open(item.articleUrl, '_blank', 'noopener,noreferrer');
      } else {
        setActiveDigitalPreview(item);
      }
    }
  };

  return (
    <main className="bg-[#FAF8F4] text-[#171C19] overflow-x-clip">
      {/* ====================================================================
          SECTION 1 — EDITORIAL PRESSROOM HERO WITH OVERLAPPING CLIPPINGS
         ==================================================================== */}
      <section
        aria-labelledby="pressroom-hero-heading"
        className="relative border-b border-[#E2D9C7] bg-[#F5F0E6]"
      >
        {/* Fine broadsheet column vertical rules */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(13, 48, 33, 0.04) 1px, transparent 1px)',
            backgroundSize: '240px 100%',
          }}
        />

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12 sm:pb-16">
          {/* Top Broadsheet Masthead Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#142019]/15 text-[11px] font-mono uppercase tracking-[0.14em] text-[#4E5953]">
            <span>GARAD FOUNDATION · EDITORIAL MEDIA ARCHIVE</span>
            {IS_SHOWING_DEMO_MEDIA_ARCHIVE ? (
              <span className="font-bold text-[#9A3B1E] tracking-[0.16em]">
                DEMO CONTENT · VISUAL PREVIEW MODE
              </span>
            ) : (
              <span>THANE, MAHARASHTRA · VERIFIED PRESS ARCHIVE</span>
            )}
          </div>

          <div className="mt-8 sm:mt-11 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Editorial Masthead Copy */}
            <div className="lg:col-span-6">
              {IS_SHOWING_DEMO_MEDIA_ARCHIVE && (
                <motion.div
                  initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.42, ease: EASE_EDITORIAL }}
                  className="mb-5 pb-3.5 border-b border-[#D8CEBB] max-w-[54ch]"
                >
                  <p className="text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-[#9A3B1E]">
                    DEMO CONTENT NOTICE
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[#525D57]">
                    This preview showcases fictional sample clippings, articles,
                    and video layouts so you can review the pressroom design
                    before uploading verified Garad Foundation coverage.
                  </p>
                </motion.div>
              )}

              <motion.h1
                id="pressroom-hero-heading"
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.58,
                  delay: 0.05,
                  ease: EASE_EDITORIAL,
                }}
                className="font-serif text-[42px] sm:text-[54px] lg:text-[62px] font-bold tracking-[-0.025em] leading-[1.03] text-[#111B15] text-balance"
              >
                GARAD IN THE NEWS
              </motion.h1>

              <motion.p
                initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.13,
                  ease: EASE_EDITORIAL,
                }}
                className="mt-4 font-serif italic text-[22px] sm:text-[26px] leading-[1.28] text-[#9A3B1E] text-balance"
              >
                Our Work. Their Stories. In the News.
              </motion.p>

              <motion.p
                initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.54,
                  delay: 0.2,
                  ease: EASE_EDITORIAL,
                }}
                className="mt-4 max-w-[52ch] text-[15.5px] sm:text-[16.5px] leading-[1.72] text-[#3F4A44]"
              >
                Explore the stories, publications and media coverage
                highlighting our work with communities.
              </motion.p>

              {/* Editorial Section Index Strip */}
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.26,
                  ease: EASE_EDITORIAL,
                }}
                className="mt-8 pt-5 border-t border-[#142019]/15 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[12.5px] font-semibold text-[#17281F]"
              >
                <button
                  type="button"
                  onClick={() => scrollToSection('in-print')}
                  className="inline-flex items-center gap-1.5 hover:text-[#9A3B1E] transition-colors cursor-pointer"
                >
                  <span className="font-mono text-[10.5px] text-[#7D8781]">
                    01
                  </span>
                  <span>Newspaper Cuttings</span>
                </button>
                <span aria-hidden="true" className="text-[#C8BFA9]">
                  /
                </span>
                <button
                  type="button"
                  onClick={() => scrollToSection('online-press')}
                  className="inline-flex items-center gap-1.5 hover:text-[#9A3B1E] transition-colors cursor-pointer"
                >
                  <span className="font-mono text-[10.5px] text-[#7D8781]">
                    02
                  </span>
                  <span>Digital Articles</span>
                </button>
                <span aria-hidden="true" className="text-[#C8BFA9]">
                  /
                </span>
                <button
                  type="button"
                  onClick={() => scrollToSection('on-screen')}
                  className="inline-flex items-center gap-1.5 hover:text-[#9A3B1E] transition-colors cursor-pointer"
                >
                  <span className="font-mono text-[10.5px] text-[#7D8781]">
                    03
                  </span>
                  <span>News Videos</span>
                </button>
                <span aria-hidden="true" className="text-[#C8BFA9]">
                  /
                </span>
                <button
                  type="button"
                  onClick={() => scrollToSection('media-timeline')}
                  className="inline-flex items-center gap-1.5 hover:text-[#9A3B1E] transition-colors cursor-pointer"
                >
                  <span className="font-mono text-[10.5px] text-[#7D8781]">
                    04
                  </span>
                  <span>Timeline</span>
                </button>
              </motion.div>
            </div>

            {/* Right Focal Point: Overlapping Sample Newspaper Clippings + Photography */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-[540px] bg-[#162C20] border border-[#244232] p-5 sm:p-7 shadow-[0_28px_68px_-28px_rgba(10,28,19,0.55)]">
                {/* Subtle desk mat hairline border */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-2.5 border border-[#FAF8F4]/10"
                />

                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.15em] text-[#C5D6CC] mb-4">
                  <span>ARCHIVAL PRESS TABLE</span>
                  <span className="text-[#E5B869]">
                    {IS_SHOWING_DEMO_MEDIA_ARCHIVE
                      ? 'DEMO CONTENT'
                      : 'CURATED FOLIO'}
                  </span>
                </div>

                {/* Layered Composition Container */}
                <div className="relative pt-4 pb-2 sm:px-3">
                  {/* Back-Left Angled Secondary Print Clipping */}
                  {heroSecondaryClipping && (
                    <motion.div
                      initial={
                        prefersReduced
                          ? false
                          : { opacity: 0, x: -16, rotate: -4 }
                      }
                      animate={{ opacity: 1, x: 0, rotate: -2.6 }}
                      transition={{
                        duration: 0.65,
                        delay: 0.16,
                        ease: EASE_EDITORIAL,
                      }}
                      className="hidden sm:block absolute -left-2 top-0 w-[62%] z-10 opacity-90 pointer-events-none"
                    >
                      <div className="border border-[#CFC5B1] bg-[#EFE9DA] p-3.5 text-[#1E2420] shadow-md">
                        <p className="text-[8.5px] font-mono uppercase tracking-[0.13em] text-[#5B655F] border-b border-[#1E2420]/30 pb-1">
                          {heroSecondaryClipping.publicationName} · DEMO
                        </p>
                        <p className="mt-2 font-serif text-[13px] font-bold leading-snug text-[#171E1A]">
                          {heroSecondaryClipping.headline}
                        </p>
                        <p className="mt-1.5 text-[9.5px] leading-relaxed text-[#46504A] line-clamp-3">
                          {heroSecondaryClipping.clippingColumns?.[0] ||
                            heroSecondaryClipping.description}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Back-Right Layered Documentary Photography Plate */}
                  {heroAccentPhotoItem?.thumbnail && (
                    <motion.div
                      initial={
                        prefersReduced
                          ? false
                          : { opacity: 0, x: 16, rotate: 4 }
                      }
                      animate={{ opacity: 1, x: 0, rotate: 2.4 }}
                      transition={{
                        duration: 0.65,
                        delay: 0.22,
                        ease: EASE_EDITORIAL,
                      }}
                      className="hidden sm:block absolute -right-1 top-2 w-[44%] z-10 bg-[#FAF8F4] border border-[#D4CBB8] p-1.5 shadow-lg pointer-events-none"
                    >
                      <img
                        src={heroAccentPhotoItem.thumbnail}
                        alt={heroAccentPhotoItem.headline}
                        className="w-full aspect-[4/3] object-cover"
                      />
                      <p className="mt-1 px-0.5 text-[8.5px] font-mono uppercase tracking-[0.11em] text-[#66706A] truncate">
                        DEMO PHOTO · COMMUNITY
                      </p>
                    </motion.div>
                  )}

                  {/* Foreground Primary Sample Newspaper Clipping (Interactive) */}
                  {heroPrimaryClipping && (
                    <motion.button
                      type="button"
                      onClick={() => setActiveClipping(heroPrimaryClipping)}
                      initial={
                        prefersReduced ? false : { opacity: 0, y: 18, scale: 0.98 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      whileHover={prefersReduced ? undefined : { y: -3 }}
                      transition={{
                        duration: 0.65,
                        delay: 0.1,
                        ease: EASE_EDITORIAL,
                      }}
                      className="relative z-20 sm:mt-14 w-full text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B869]"
                    >
                      <NewspaperClippingSheet
                        item={heroPrimaryClipping}
                        mode="hero"
                      />
                      <span className="absolute right-3 bottom-3 z-20 inline-flex items-center gap-1.5 bg-[#0D3021] text-[#FAF8F4] px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.1em] shadow-md group-hover:bg-[#9A3B1E] transition-colors">
                        <Maximize2 className="w-3 h-3" />
                        <span>Inspect Clipping</span>
                      </span>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2 — MEDIA OVERVIEW (Calculated Live from Dataset)
         ==================================================================== */}
      <section
        aria-labelledby="media-overview-heading"
        className="border-b border-[#E3DBC9] bg-[#FAF8F4]"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <h2
              id="media-overview-heading"
              className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[#5B6660]"
            >
              {IS_SHOWING_DEMO_MEDIA_ARCHIVE
                ? 'DEMO CONTENT · SAMPLE MEDIA ARCHIVE OVERVIEW'
                : 'MEDIA ARCHIVE OVERVIEW'}
            </h2>
            {IS_SHOWING_DEMO_MEDIA_ARCHIVE && (
              <span className="text-[11px] font-mono text-[#9A3B1E] uppercase tracking-[0.12em]">
                Calculated live from demonstration dataset
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#E3DBC9] border-y border-[#E3DBC9]">
            {[
              {
                label: 'Newspaper Cuttings',
                value: overviewCounts.newspapers,
                note: IS_SHOWING_DEMO_MEDIA_ARCHIVE
                  ? 'Sample print extracts'
                  : 'Archived print clippings',
              },
              {
                label: 'Digital Articles',
                value: overviewCounts.digital,
                note: IS_SHOWING_DEMO_MEDIA_ARCHIVE
                  ? 'Sample online features'
                  : 'Verified web coverage',
              },
              {
                label: 'News Videos',
                value: overviewCounts.videos,
                note: IS_SHOWING_DEMO_MEDIA_ARCHIVE
                  ? 'Sample broadcast previews'
                  : 'Broadcast & video reports',
              },
              {
                label: IS_SHOWING_DEMO_MEDIA_ARCHIVE
                  ? 'Sample Media Entries'
                  : 'Total Media Entries',
                value: overviewCounts.total,
                note: IS_SHOWING_DEMO_MEDIA_ARCHIVE
                  ? 'Demonstration archive total'
                  : 'Verified archival records',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="py-5 px-3 sm:px-6 flex flex-col justify-between"
              >
                <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#616C66]">
                  {stat.label}
                </p>
                <p className="mt-2 font-serif text-[34px] sm:text-[40px] font-bold leading-none text-[#142019] tabular-nums">
                  {stat.value}
                </p>
                <p className="mt-2 text-[12px] text-[#66706A]">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3 — WORKING EDITORIAL FILTERS (Type + Publication FY + Search)
         ==================================================================== */}
      <section
        aria-label="Filter media archive"
        className="sticky top-[68px] z-30 border-b border-[#E2D9C8] bg-[#FAF8F4]/95 backdrop-blur-md"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Media Type Filter Buttons */}
            <div
              role="group"
              aria-label="Filter coverage by media category"
              className="flex items-center gap-1 overflow-x-auto no-scrollbar"
            >
              {(
                [
                  { id: 'all', label: 'All Media', count: overviewCounts.total },
                  {
                    id: 'newspaper',
                    label: 'Newspaper Cuttings',
                    count: overviewCounts.newspapers,
                  },
                  {
                    id: 'digital',
                    label: 'Digital Articles',
                    count: overviewCounts.digital,
                  },
                  {
                    id: 'video',
                    label: 'News Videos',
                    count: overviewCounts.videos,
                  },
                ] as const
              ).map((tab) => {
                const isActive = selectedType === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedType(tab.id)}
                    aria-pressed={isActive}
                    className={`px-3.5 py-2 text-[12.5px] font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D3021]/40 ${
                      isActive
                        ? 'bg-[#0D3021] border-[#0D3021] text-white'
                        : 'bg-transparent border-transparent text-[#49534D] hover:text-[#142019] hover:bg-[#EFEAE0]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`ml-1.5 font-mono text-[11px] tabular-nums ${
                        isActive ? 'text-[#D6E6DD]' : 'text-[#7C857F]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Publication Financial Year Filter (Apr–Mar) + Search */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              {publicationFinancialYears.length > 0 && (
                <label className="inline-flex items-center gap-2 text-[12px] text-[#555E58] shrink-0">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.1em]">
                    Pub. FY
                  </span>
                  <select
                    value={selectedFy}
                    onChange={(e) =>
                      setSelectedFy(e.target.value as MediaFyFilter)
                    }
                    aria-label="Filter media coverage by publication financial year (April to March)"
                    className="border border-[#D5CCB9] bg-white px-2.5 py-1.5 text-[12.5px] font-medium text-[#171C19] focus:outline-none focus:border-[#0D3021] cursor-pointer tabular-nums"
                  >
                    <option value="all">All Years</option>
                    {publicationFinancialYears.map((fy) => (
                      <option key={fy.id} value={fy.id}>
                        FY {fy.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="relative flex-1 sm:w-[225px]">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#78827C]"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search headline or source…"
                  aria-label="Search media archive entries"
                  className="w-full border border-[#D5CCB9] bg-white pl-8 pr-8 py-1.5 text-[12.5px] text-[#171C19] placeholder:text-[#7B847E] focus:outline-none focus:border-[#0D3021] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear media search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#6E7771] hover:text-[#171C19] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-semibold text-[#9A3B1E] hover:bg-[#F3EBE4] transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4 — NEWSPAPER ARCHIVE (4 Varied Scanned Clipping Layouts)
         ==================================================================== */}
      {showNewspaperSection && (
        <section
          id="in-print"
          aria-labelledby="in-print-heading"
          className="scroll-mt-32 border-b border-[#E3DBC9] bg-[#FAF8F4]"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#142019]/15">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#9A3B1E]">
                  01 / NEWSPAPER ARCHIVE
                  {IS_SHOWING_DEMO_MEDIA_ARCHIVE ? ' · DEMO CONTENT' : ''}
                </p>
                <h2
                  id="in-print-heading"
                  className="mt-2 font-serif text-[28px] sm:text-[36px] font-bold tracking-[-0.02em] leading-[1.15] text-[#142019] text-balance"
                >
                  IN PRINT — THE STORIES THAT REACHED THE PAGES
                </h2>
              </div>
              <p className="text-[12.5px] font-mono text-[#646F69] tabular-nums shrink-0">
                {newspaperItems.length}{' '}
                {newspaperItems.length === 1
                  ? 'Newspaper Cutting'
                  : 'Newspaper Cuttings'}{' '}
                · Click any extract to inspect &amp; zoom
              </p>
            </div>

            {newspaperItems.length > 0 ? (
              <div className="mt-10 space-y-8">
                {/* Row 1: Large Featured Clipping + Smaller Archival Clipping */}
                {(featuredClipping || archivalClipping) && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                    {featuredClipping && (
                      <motion.article
                        initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.52, ease: EASE_EDITORIAL }}
                        className={
                          archivalClipping ? 'lg:col-span-8' : 'lg:col-span-12'
                        }
                      >
                        <button
                          type="button"
                          onClick={() => setActiveClipping(featuredClipping)}
                          className="group relative block w-full text-left cursor-pointer transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3B1E]"
                        >
                          <NewspaperClippingSheet
                            item={featuredClipping}
                            mode="featured"
                          />
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#555E58]">
                            <span className="font-mono uppercase tracking-[0.1em] text-[11px]">
                              Featured Cutting · {featuredClipping.category}
                              {featuredClipping.isDemo ? ' · DEMO CONTENT' : ''}
                            </span>
                            <span className="inline-flex items-center gap-1 font-semibold text-[#0D3021] group-hover:text-[#9A3B1E] transition-colors">
                              <span>Open Full Clipping &amp; Zoom</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </button>
                      </motion.article>
                    )}

                    {archivalClipping && (
                      <motion.article
                        initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{
                          duration: 0.52,
                          delay: 0.08,
                          ease: EASE_EDITORIAL,
                        }}
                        className="lg:col-span-4"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveClipping(archivalClipping)}
                          className="group relative block w-full text-left cursor-pointer transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3B1E]"
                        >
                          <NewspaperClippingSheet
                            item={archivalClipping}
                            mode="archival"
                          />
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#555E58]">
                            <span className="font-mono uppercase tracking-[0.1em] text-[11px]">
                              Archival Brief
                              {archivalClipping.isDemo ? ' · DEMO CONTENT' : ''}
                            </span>
                            <span className="inline-flex items-center gap-1 font-semibold text-[#0D3021] group-hover:text-[#9A3B1E] transition-colors">
                              <span>Inspect</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </button>
                      </motion.article>
                    )}
                  </div>
                )}

                {/* Row 2: Two Medium Clipping Cards */}
                {mediumClippings.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7 items-start pt-2">
                    {mediumClippings.map((clip, idx) => (
                      <motion.article
                        key={clip.id}
                        initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{
                          duration: 0.5,
                          delay: idx * 0.08,
                          ease: EASE_EDITORIAL,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveClipping(clip)}
                          className="group relative block w-full text-left cursor-pointer transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3B1E]"
                        >
                          <NewspaperClippingSheet item={clip} mode="medium" />
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#555E58]">
                            <span className="font-mono uppercase tracking-[0.1em] text-[11px]">
                              {clip.category || 'Print Feature'}
                              {clip.isDemo ? ' · DEMO CONTENT' : ''}
                            </span>
                            <span className="inline-flex items-center gap-1 font-semibold text-[#0D3021] group-hover:text-[#9A3B1E] transition-colors">
                              <span>Open Full Clipping</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </button>
                      </motion.article>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-8 border border-[#DDD4C3] bg-[#F5F0E6] p-8 text-center">
                <p className="font-serif text-[22px] font-bold text-[#142019]">
                  No newspaper cuttings match the active filter.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D3021] text-white text-[12.5px] font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Show All Media</span>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ====================================================================
          SECTION 5 — DIGITAL NEWS ARTICLES (2 Editorial Cards, Preview-Only)
         ==================================================================== */}
      {showDigitalSection && (
        <section
          id="online-press"
          aria-labelledby="online-press-heading"
          className="scroll-mt-32 border-b border-[#E3DBC9] bg-[#F4EFE6]"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#142019]/15">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#9A3B1E]">
                  02 / DIGITAL NEWS ARTICLES
                  {IS_SHOWING_DEMO_MEDIA_ARCHIVE ? ' · DEMO CONTENT' : ''}
                </p>
                <h2
                  id="online-press-heading"
                  className="mt-2 font-serif text-[28px] sm:text-[36px] font-bold tracking-[-0.02em] leading-[1.15] text-[#142019] text-balance"
                >
                  ONLINE — STORIES BEYOND PRINT
                </h2>
              </div>
              <p className="text-[12.5px] font-mono text-[#646F69] tabular-nums shrink-0">
                {digitalItems.length}{' '}
                {digitalItems.length === 1
                  ? 'Digital Article'
                  : 'Digital Articles'}
              </p>
            </div>

            {digitalItems.length > 0 ? (
              <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {digitalItems.map((article, idx) => {
                  const hasVerifiedLink =
                    !article.isDemo && isSafeExternalUrl(article.articleUrl);

                  return (
                    <motion.article
                      key={article.id}
                      initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{
                        duration: 0.5,
                        delay: idx * 0.08,
                        ease: EASE_EDITORIAL,
                      }}
                      className="group border border-[#D8CEBC] bg-[#FAF8F4] flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_18px_42px_-26px_rgba(13,48,33,0.28)]"
                    >
                      {article.thumbnail && (
                        <div className="relative overflow-hidden border-b border-[#E2D9C8] bg-[#EAE3D4] aspect-[16/10]">
                          <img
                            src={article.thumbnail}
                            alt={article.headline}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                          />
                          {article.isDemo && (
                            <span className="absolute left-3 top-3 bg-[#142019]/88 text-[#FAF8F4] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.14em]">
                              DEMO CONTENT
                            </span>
                          )}
                        </div>
                      )}

                      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-[0.12em]">
                            <span className="font-semibold text-[#0D3021]">
                              {article.publicationName}
                            </span>
                            <span className="text-[#646F69] tabular-nums">
                              {article.isDemo ? 'Sample Date: ' : ''}
                              {formatPublicationDate(article)}
                            </span>
                          </div>

                          <h3 className="mt-3 font-serif text-[23px] sm:text-[26px] font-bold leading-[1.22] text-[#142019]">
                            {article.headline}
                          </h3>

                          <p className="mt-3 text-[14.5px] leading-[1.72] text-[#4C5751]">
                            {article.description}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-[#E5DDD0] flex flex-wrap items-center justify-between gap-3">
                          {hasVerifiedLink && article.articleUrl ? (
                            <a
                              href={article.articleUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#9A3B1E] hover:text-[#782911] transition-colors"
                            >
                              <span>Read Original Article</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span
                              aria-disabled="true"
                              className="inline-flex items-center gap-1.5 text-[12px] font-mono uppercase tracking-[0.08em] text-[#7A847E]"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>External Link Disabled (Demo)</span>
                            </span>
                          )}

                          {article.isDemo && (
                            <button
                              type="button"
                              onClick={() => setActiveDigitalPreview(article)}
                              className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#0D3021] hover:text-[#9A3B1E] transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview Entry</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 border border-[#DDD4C3] bg-[#FAF8F4] p-8 text-center">
                <p className="font-serif text-[22px] font-bold text-[#142019]">
                  No digital articles match the active filter.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D3021] text-white text-[12.5px] font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Show All Media</span>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ====================================================================
          SECTION 6 — NEWS VIDEOS (Cinematic Documentary Library: 1 Featured + 2 Cards)
         ==================================================================== */}
      {showVideoSection && (
        <section
          id="on-screen"
          aria-labelledby="on-screen-heading"
          className="scroll-mt-32 bg-[#0A1E15] text-[#FAF8F4] border-b border-[#1D3C2C]"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#FAF8F4]/15">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#E5B869]">
                  03 / NEWS VIDEOS
                  {IS_SHOWING_DEMO_MEDIA_ARCHIVE ? ' · DEMO CONTENT' : ''}
                </p>
                <h2
                  id="on-screen-heading"
                  className="mt-2 font-serif text-[28px] sm:text-[36px] font-bold tracking-[-0.02em] leading-[1.15] text-[#FAF8F4] text-balance"
                >
                  ON SCREEN — GARAD IN THE NEWS
                </h2>
              </div>
              <p className="text-[12.5px] font-mono text-[#A8BEB2] tabular-nums shrink-0">
                {videoItems.length}{' '}
                {videoItems.length === 1 ? 'News Video' : 'News Videos'}
              </p>
            </div>

            {featuredVideo ? (
              <div className="mt-10 space-y-8">
                {/* Featured Large Documentary Video */}
                <motion.article
                  initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, ease: EASE_EDITORIAL }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-9 items-center border border-[#224534] bg-[#0F2A1D] p-4 sm:p-6"
                >
                  <button
                    type="button"
                    onClick={() => setActiveVideo(featuredVideo)}
                    className="lg:col-span-7 relative aspect-video w-full overflow-hidden bg-[#06130C] border border-[#254A37] group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B869]"
                  >
                    {featuredVideo.thumbnail ? (
                      <img
                        src={featuredVideo.thumbnail}
                        alt={featuredVideo.headline}
                        loading="lazy"
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.025] transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-12 h-12 text-[#3F6B54]" />
                      </div>
                    )}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#05100A]/80 via-[#05100A]/15 to-transparent"
                    />
                    {featuredVideo.isDemo && (
                      <span className="absolute left-3.5 top-3.5 bg-[#08170F]/88 border border-[#E5B869]/40 text-[#E5B869] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.14em]">
                        DEMO CONTENT
                      </span>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="w-16 h-16 rounded-full bg-[#FAF8F4] text-[#0A1E15] flex items-center justify-center shadow-[0_14px_34px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </span>
                    </div>
                    {featuredVideo.duration && (
                      <span className="absolute right-3.5 bottom-3.5 inline-flex items-center gap-1.5 bg-[#08170F]/90 px-2.5 py-1 text-[11px] font-mono text-[#FAF8F4] tabular-nums">
                        <Clock className="w-3 h-3 text-[#E5B869]" />
                        {featuredVideo.duration}
                      </span>
                    )}
                  </button>

                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#E5B869]">
                        Featured Video · {featuredVideo.publicationName}
                      </p>
                      <h3 className="mt-3 font-serif text-[25px] sm:text-[30px] font-bold leading-[1.2] text-[#FAF8F4]">
                        {featuredVideo.headline}
                      </h3>
                      <p className="mt-2.5 font-mono text-[12px] text-[#9EB7A9] tabular-nums">
                        {featuredVideo.isDemo ? 'Sample Date: ' : ''}
                        {formatPublicationDate(featuredVideo)}
                        {featuredVideo.category
                          ? ` · ${featuredVideo.category}`
                          : ''}
                      </p>
                      <p className="mt-4 text-[14.5px] leading-[1.72] text-[#D2DFD7]">
                        {featuredVideo.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#224534] flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveVideo(featuredVideo)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#9A3B1E] hover:bg-[#B34726] text-white text-[13px] font-semibold transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>
                          {featuredVideo.isDemo
                            ? 'Open Video Preview'
                            : 'Watch Broadcast'}
                        </span>
                      </button>
                      {featuredVideo.isDemo && (
                        <span className="text-[10.5px] font-mono uppercase tracking-[0.13em] text-[#E5B869]">
                          DEMO CONTENT
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>

                {/* Two Secondary Documentary Video Cards */}
                {secondaryVideos.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    {secondaryVideos.map((vid, idx) => (
                      <motion.article
                        key={vid.id}
                        initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{
                          duration: 0.5,
                          delay: idx * 0.08,
                          ease: EASE_EDITORIAL,
                        }}
                        className="border border-[#224534] bg-[#0E281B] flex flex-col overflow-hidden group"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveVideo(vid)}
                          className="relative aspect-video w-full bg-[#06130C] overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E5B869]"
                        >
                          {vid.thumbnail ? (
                            <img
                              src={vid.thumbnail}
                              alt={vid.headline}
                              loading="lazy"
                              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="w-10 h-10 text-[#3F6B54]" />
                            </div>
                          )}
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-[#05100A]/75 via-transparent to-transparent"
                          />
                          {vid.isDemo && (
                            <span className="absolute left-3 top-3 bg-[#08170F]/88 border border-[#E5B869]/40 text-[#E5B869] px-2 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-[0.13em]">
                              DEMO CONTENT
                            </span>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="w-12 h-12 rounded-full bg-[#FAF8F4]/95 text-[#0A1E15] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                              <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                            </span>
                          </div>
                          {vid.duration && (
                            <span className="absolute right-3 bottom-3 bg-[#08170F]/90 px-2 py-0.5 text-[10.5px] font-mono text-[#FAF8F4] tabular-nums">
                              {vid.duration}
                            </span>
                          )}
                        </button>

                        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#E5B869]">
                              {vid.publicationName} ·{' '}
                              <span className="text-[#A8BEB2] tabular-nums">
                                {vid.isDemo ? 'Sample Date: ' : ''}
                                {formatPublicationDate(vid)}
                              </span>
                            </p>
                            <h3 className="mt-2 font-serif text-[20px] sm:text-[22px] font-bold leading-snug text-[#FAF8F4]">
                              <button
                                type="button"
                                onClick={() => setActiveVideo(vid)}
                                className="text-left hover:text-[#E5B869] transition-colors cursor-pointer"
                              >
                                {vid.headline}
                              </button>
                            </h3>
                            <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#C2D4CA]">
                              {vid.description}
                            </p>
                          </div>

                          <div className="mt-5 pt-3.5 border-t border-[#1F4030] flex items-center justify-between text-[12px]">
                            <button
                              type="button"
                              onClick={() => setActiveVideo(vid)}
                              className="inline-flex items-center gap-1.5 font-semibold text-[#FAF8F4] hover:text-[#E5B869] transition-colors cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>
                                {vid.isDemo
                                  ? 'Preview Video Entry'
                                  : 'Watch Video'}
                              </span>
                            </button>
                            {vid.isDemo && (
                              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#A8BEB2]">
                                DEMO CONTENT
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-8 border border-[#224534] bg-[#0F2A1D] p-8 text-center">
                <p className="font-serif text-[22px] font-bold text-[#FAF8F4]">
                  No news videos match the active filter.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#9A3B1E] text-white text-[12.5px] font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Show All Media</span>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ====================================================================
          SECTION 7 — COMPACT CHRONOLOGICAL MEDIA TIMELINE (By Publication Date)
         ==================================================================== */}
      <section
        id="media-timeline"
        aria-labelledby="media-timeline-heading"
        className="scroll-mt-32 border-b border-[#E3DBC9] bg-[#FAF8F4]"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#142019]/15">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#9A3B1E]">
                04 / MEDIA TIMELINE
                {IS_SHOWING_DEMO_MEDIA_ARCHIVE ? ' · DEMO CONTENT' : ''}
              </p>
              <h2
                id="media-timeline-heading"
                className="mt-2 font-serif text-[28px] sm:text-[36px] font-bold tracking-[-0.02em] leading-[1.15] text-[#142019] text-balance"
              >
                OUR JOURNEY THROUGH THE MEDIA
              </h2>
            </div>
            <p className="text-[12.5px] text-[#5F6A64] max-w-sm md:text-right">
              Chronological by publication date — kept independent from Garad
              Foundation activity dates.
            </p>
          </div>

          {timelineGroups.length > 0 ? (
            <div className="mt-10 space-y-10">
              {timelineGroups.map((group) => (
                <div
                  key={group.year}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8"
                >
                  <div className="md:col-span-2">
                    <p className="font-serif text-[32px] font-bold leading-none text-[#0D3021] tabular-nums">
                      {group.year}
                    </p>
                    <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.12em] text-[#7A847E] tabular-nums">
                      {group.items.length}{' '}
                      {group.items.length === 1 ? 'Entry' : 'Entries'}
                    </p>
                  </div>

                  <div className="md:col-span-10 divide-y divide-[#E4DCCE] border-t border-[#E4DCCE]">
                    {group.items.map((item) => {
                      const pubFy = getMediaFinancialYear(item.publicationDate);
                      return (
                        <div
                          key={item.id}
                          className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="text-[11px] font-mono uppercase tracking-[0.11em] text-[#66706A] tabular-nums flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span>
                                {item.isDemo ? 'Sample Date: ' : ''}
                                {formatPublicationDate(item)}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#0D3021] font-semibold">
                                {getMediaTypeLabel(item.type)}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{item.publicationName}</span>
                              {pubFy && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span>
                                    FY {formatFinancialYearLabel(pubFy)}
                                  </span>
                                </>
                              )}
                              {item.isDemo && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-bold text-[#9A3B1E]">
                                    DEMO CONTENT
                                  </span>
                                </>
                              )}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleOpenMediaItem(item)}
                              className="mt-1 text-left font-serif text-[18px] sm:text-[19px] font-bold text-[#142019] hover:text-[#9A3B1E] transition-colors leading-snug cursor-pointer"
                            >
                              {item.headline}
                            </button>
                          </div>

                          <div className="shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenMediaItem(item)}
                              className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0D3021] hover:text-[#9A3B1E] transition-colors cursor-pointer"
                            >
                              <span>
                                {item.type === 'newspaper'
                                  ? 'Inspect Clipping'
                                  : item.type === 'video'
                                  ? item.isDemo
                                    ? 'Preview Video'
                                    : 'Watch Video'
                                  : item.isDemo
                                  ? 'Preview Article'
                                  : 'Read Article'}
                              </span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 border border-[#DDD4C3] bg-[#F5F0E6] p-8 text-center">
              <p className="font-serif text-[21px] font-bold text-[#142019]">
                No timeline entries match the active filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D3021] text-white text-[12.5px] font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          SECTION 8 — SUBTLE EDITORIAL CLOSING BAND ABOVE EXISTING SITE FOOTER
         ==================================================================== */}
      <section
        aria-label="Closing archive note"
        className="bg-[#0D3021] text-[#FAF8F4]"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#E5B869]">
              Garad Foundation · Media Archive
            </p>
            <p className="mt-2.5 font-serif italic text-[24px] sm:text-[30px] leading-[1.25] text-[#FAF8F4] text-balance">
              &ldquo;Every story reflects a step towards positive change.&rdquo;
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 shrink-0">
            <a
              href="/activities"
              onClick={(e) => {
                if (
                  e.metaKey ||
                  e.ctrlKey ||
                  e.shiftKey ||
                  e.altKey ||
                  e.button !== 0
                ) {
                  return;
                }
                e.preventDefault();
                onNavigateArchive();
              }}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#FAF8F4] hover:bg-white text-[#0D3021] text-[13px] font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Activities Archive</span>
            </a>
            <a
              href="/reports"
              onClick={(e) => {
                if (
                  e.metaKey ||
                  e.ctrlKey ||
                  e.shiftKey ||
                  e.altKey ||
                  e.button !== 0
                ) {
                  return;
                }
                e.preventDefault();
                onNavigateReports();
              }}
              className="inline-flex items-center gap-2 px-5 py-3 border border-[#FAF8F4]/25 hover:border-[#FAF8F4]/55 hover:bg-[#15422E] text-[#FAF8F4] text-[13px] font-semibold transition-colors"
            >
              <span>Reports &amp; Publications</span>
              <ArrowUpRight className="w-4 h-4 text-[#E5B869]" />
            </a>
          </div>
        </div>
      </section>

      {/* Modals (Zoomable Newspaper Viewer, Cinema Video Preview/Player, Digital Article Preview) */}
      <NewspaperClippingViewerModal
        item={activeClipping}
        onClose={() => setActiveClipping(null)}
        onNavigateActivity={onNavigateActivity}
      />

      <NewsVideoPlayerModal
        item={activeVideo}
        onClose={() => setActiveVideo(null)}
        onNavigateActivity={onNavigateActivity}
      />

      <DigitalArticlePreviewModal
        item={activeDigitalPreview}
        onClose={() => setActiveDigitalPreview(null)}
      />
    </main>
  );
}
