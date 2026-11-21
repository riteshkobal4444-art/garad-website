import React, { useMemo, useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Globe,
  GraduationCap,
  Heart,
  HeartHandshake,
  Info,
  MapPin,
  Maximize2,
  Mic,
  Printer,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import {
  ActivityMedia,
  ActivityMetadataCard,
  ActivityObjective,
  ActivityRecord,
  getRelatedActivities,
} from '../data/activities';
import { getActivityPath } from '../utils/router';
import { usePageSeo } from '../utils/seo';
import { ArchivalMediaFrame } from './ArchivalMediaFrame';
import { MethodologyTimeline } from './MethodologyTimeline';
import {
  DistributionBreakdownModule,
  MultilingualFormatsModule,
  ParticipantSplitModule,
  VideographyHighlightsModule,
  WinnersRecognitionModule,
} from './ActivityVisualModules';
import {
  EASE_EDITORIAL,
  Reveal,
  Tilt3DCard,
} from './motion/MotionPrimitives';

interface ActivityDetailPageProps {
  activity: ActivityRecord;
  onNavigateArchive: () => void;
  onNavigateActivity: (slug: string) => void;
  onOpenLightbox: (mediaItems: ActivityMedia[], index: number) => void;
  onNavigateDonate: () => void;
}

function MetaIcon({ type }: { type: ActivityMetadataCard['icon'] }) {
  const cls = 'w-4 h-4 text-[#9A3B1E]';
  switch (type) {
    case 'calendar':
      return <Calendar className={cls} />;
    case 'map-pin':
      return <MapPin className={cls} />;
    case 'users':
      return <Users className={cls} />;
    case 'award':
      return <Award className={cls} />;
    case 'globe':
      return <Globe className={cls} />;
    case 'heart':
      return <HeartHandshake className={cls} />;
    case 'book':
      return <BookOpen className={cls} />;
  }
}

function ObjectiveIcon({ type }: { type: ActivityObjective['icon'] }) {
  const cls = 'w-4 h-4 text-[#9A3B1E]';
  switch (type) {
    case 'heart':
      return <Heart className={cls} />;
    case 'users':
      return <Users className={cls} />;
    case 'sparkles':
      return <Sparkles className={cls} />;
    case 'check':
      return <CheckCircle2 className={cls} />;
    case 'book':
      return <BookOpen className={cls} />;
    case 'shield':
      return <ShieldCheck className={cls} />;
    case 'video':
      return <Video className={cls} />;
    case 'graduation':
      return <GraduationCap className={cls} />;
    case 'award':
      return <Award className={cls} />;
    case 'mic':
      return <Mic className={cls} />;
  }
}

export function ActivityDetailPage({
  activity,
  onNavigateArchive,
  onNavigateActivity,
  onOpenLightbox,
  onNavigateDonate,
}: ActivityDetailPageProps) {
  const prefersReduced = useReducedMotion();
  const heroMediaRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: photoProgress } = useScroll({
    target: heroMediaRef,
    offset: ['start end', 'end start'],
  });
  const photoParallaxY = useTransform(photoProgress, [0, 1], [-16, 16]);

  const relatedActivities = useMemo(
    () => getRelatedActivities(activity),
    [activity]
  );

  // Dynamic per-activity SEO title, description, Open Graph & Schema.org Article data
  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: activity.title,
      description: activity.seoDescription,
      author: {
        '@type': 'Organization',
        name: 'Garad Foundation',
        location: 'Thane, Maharashtra, India',
      },
      articleSection: activity.category,
    }),
    [activity]
  );

  usePageSeo({
    title: activity.seoTitle,
    description: activity.seoDescription,
    type: 'article',
    structuredData,
  });

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    handler: () => void
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    handler();
  };

  // Real uploaded photos eligible for Lightbox inspection
  const realPhotos = useMemo(() => {
    const items: ActivityMedia[] = [];
    if (activity.heroImage.imagePath) items.push(activity.heroImage);
    activity.gallery.forEach((g) => {
      if (g.imagePath) items.push(g);
    });
    return items;
  }, [activity]);

  const hasHeroPhoto = Boolean(activity.heroImage.imagePath);

  return (
    <main className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20">
      {/* ==================== BREADCRUMB ROW ==================== */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, delay: 0.03, ease: EASE_EDITORIAL }}
        className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#ECE6DA]"
      >
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[12px] text-[#6B746E]"
        >
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, onNavigateArchive)}
            className="hover:text-[#171C19] transition-colors"
          >
            Home
          </a>
          <span aria-hidden="true" className="text-[#C4BCB0]">
            /
          </span>
          <a
            href="/activities"
            onClick={(e) => handleLinkClick(e, onNavigateArchive)}
            className="hover:text-[#171C19] transition-colors"
          >
            Activities
          </a>
          <span aria-hidden="true" className="text-[#C4BCB0]">
            /
          </span>
          <span className="tabular-nums">{activity.yearDisplay}</span>
          <span aria-hidden="true" className="text-[#C4BCB0]">
            /
          </span>
          <span className="font-semibold text-[#171C19]">
            {activity.shortTitle}
          </span>
        </nav>

        <motion.a
          href="/activities"
          onClick={(e) => handleLinkClick(e, onNavigateArchive)}
          whileHover={prefersReduced ? undefined : { x: -2 }}
          whileTap={prefersReduced ? undefined : { scale: 0.97 }}
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5DDD0] hover:border-[#CFC4B2] text-[12px] font-semibold text-[#232D27] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#9A3B1E] transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Back to All Activities</span>
        </motion.a>
      </motion.div>

      {/* ==================== PROJECT HERO ==================== */}
      <section aria-labelledby="activity-hero-title" className="pt-8 sm:pt-10">
        {/* Category & Archive Number Label */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: EASE_EDITORIAL }}
          className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-[#FAEEE9] border border-[#F2D9CE] text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9A3B1E]"
        >
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-[#9A3B1E]"
          />
          <span>
            {activity.category} · {activity.archiveNumber}
            {activity.isFlagship ? ' · FLAGSHIP INITIATIVE' : ''}
          </span>
        </motion.div>

        {/* Project Title */}
        <motion.h1
          id="activity-hero-title"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14, ease: EASE_EDITORIAL }}
          className="mt-4 font-serif text-[34px] sm:text-[46px] lg:text-[50px] font-bold tracking-[-0.02em] leading-[1.12] text-[#171C19] text-balance"
        >
          {activity.title}
        </motion.h1>

        {/* Introduction */}
        <motion.p
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.56, delay: 0.22, ease: EASE_EDITORIAL }}
          className="mt-4 max-w-[780px] text-[15.5px] sm:text-[17px] leading-[1.7] text-[#555E58]"
        >
          {activity.introduction}
        </motion.p>

        {/* Three Metadata Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {activity.metadataCards.map((meta, idx) => (
            <motion.div
              key={meta.id}
              initial={prefersReduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.54,
                delay: 0.28 + idx * 0.08,
                ease: EASE_EDITORIAL,
              }}
            >
              <Tilt3DCard
                maxTilt={3.5}
                elevationY={-4}
                glareOpacity={0.08}
                className="chrome-card chrome-card-subtle group relative overflow-hidden rounded-[16px] bg-white p-4 sm:p-5"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#FAEEE9] opacity-0 group-hover:opacity-90 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-125"
                />
                <div className="relative z-10 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF5EC] border border-[#EFE7D8] flex items-center justify-center shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:scale-105">
                    <MetaIcon type={meta.icon} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#7A827D]">
                      {meta.eyebrow}
                    </p>
                    <p className="mt-1 font-serif text-[18px] sm:text-[19px] font-bold text-[#171C19] leading-snug">
                      {meta.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#6A736E]">
                      {meta.subtitle}
                    </p>
                  </div>
                </div>
              </Tilt3DCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== MAIN DOCUMENTARY / ARCHIVAL VISUAL FRAME ==================== */}
      <section aria-label="Activity documentation visual" className="mt-9 sm:mt-11">
        <motion.div
          ref={heroMediaRef}
          initial={prefersReduced ? false : { opacity: 0, y: 22, scale: 0.988 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.68, ease: EASE_EDITORIAL }}
          onClick={
            hasHeroPhoto ? () => onOpenLightbox(realPhotos, 0) : undefined
          }
          role={hasHeroPhoto ? 'button' : undefined}
          tabIndex={hasHeroPhoto ? 0 : undefined}
          onKeyDown={
            hasHeroPhoto
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenLightbox(realPhotos, 0);
                  }
                }
              : undefined
          }
          className={`group relative rounded-[22px] overflow-hidden border border-[#E3DCCF] shadow-[0_24px_56px_-26px_rgba(13,48,33,0.26)] ${
            hasHeroPhoto ? 'cursor-pointer' : ''
          }`}
        >
          <div className="relative aspect-[16/9] sm:aspect-[16/7.8] w-full overflow-hidden">
            <motion.div
              style={prefersReduced ? undefined : { y: photoParallaxY }}
              className="w-full h-full scale-[1.03] will-change-transform"
            >
              <ArchivalMediaFrame media={activity.heroImage} variant="hero" />
            </motion.div>

            {hasHeroPhoto && (
              <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#082417]/75 backdrop-blur-sm text-white text-[11px] font-medium">
                <Maximize2 className="w-3 h-3" />
                <span>View Full Frame</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Factual Caption Strip Below Image */}
        <Reveal delay={0.1} y={10} className="mt-3.5">
          <div className="inline-flex items-start sm:items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F4F0E7] border border-[#EAE2D4] text-[12px] text-[#555E58]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#9A3B1E] shrink-0 mt-0.5 sm:mt-0" />
            <span>{activity.heroImage.caption}</span>
          </div>
        </Reveal>
      </section>

      {/* ==================== ACTIVITY-SPECIFIC VISUAL STORYTELLING MODULE ==================== */}
      {activity.implementation.methodology && (
        <MethodologyTimeline
          eyebrow={activity.implementation.methodology.eyebrow}
          heading={activity.implementation.methodology.heading}
          stages={activity.implementation.methodology.stages}
        />
      )}

      <DistributionBreakdownModule activity={activity} />
      <ParticipantSplitModule activity={activity} />
      <MultilingualFormatsModule activity={activity} />
      <VideographyHighlightsModule activity={activity} />

      {/* ==================== TWO-COLUMN EDITORIAL BODY + STICKY SIDEBAR ==================== */}
      <section className="mt-14 sm:mt-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_330px] gap-8 lg:gap-9 items-start">
        {/* LEFT COLUMN: LONG-FORM EDITORIAL NARRATIVE */}
        <div className="space-y-8 min-w-0">
          {/* Need & Rationale */}
          <Reveal y={20}>
            <article className="chrome-card chrome-card-lift rounded-[20px] bg-white p-6 sm:p-8">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                {activity.needAndRationale.eyebrow}
              </p>
              <h2 className="mt-2 font-serif text-[25px] sm:text-[29px] font-bold tracking-[-0.015em] text-[#171C19] leading-[1.22]">
                {activity.needAndRationale.heading}
              </h2>
              <div className="mt-4 space-y-4 text-[15px] leading-[1.82] text-[#4C554F] max-w-[66ch]">
                {activity.needAndRationale.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </article>
          </Reveal>

          {/* What We Did / Campaign Strategy */}
          <Reveal y={20}>
            <article className="chrome-card chrome-card-lift rounded-[20px] bg-white p-6 sm:p-8">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                {activity.whatWeDid.eyebrow}
              </p>
              <h2 className="mt-2 font-serif text-[25px] sm:text-[29px] font-bold tracking-[-0.015em] text-[#171C19] leading-[1.22]">
                {activity.whatWeDid.heading}
              </h2>
              <div className="mt-4 space-y-4 text-[15px] leading-[1.82] text-[#4C554F] max-w-[66ch]">
                {activity.whatWeDid.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </article>
          </Reveal>

          {/* Documented Objectives Grid */}
          {activity.objectives.length > 0 && (
            <Reveal y={20}>
              <div className="rounded-[20px] bg-[#F5F1E9]/80 border border-[#E8E0D1] p-6 sm:p-8">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                  {activity.objectivesSectionEyebrow}
                </p>
                <h2 className="mt-2 font-serif text-[25px] sm:text-[28px] font-bold tracking-[-0.015em] text-[#171C19]">
                  {activity.objectivesSectionHeading}
                </h2>

                <div
                  className={`mt-6 grid grid-cols-1 ${
                    activity.objectives.length === 3
                      ? 'sm:grid-cols-3'
                      : 'sm:grid-cols-2'
                  } gap-4`}
                >
                  {activity.objectives.map((obj, idx) => (
                    <motion.div
                      key={obj.id}
                      initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.5,
                        delay: idx * 0.08,
                        ease: EASE_EDITORIAL,
                      }}
                    >
                      <Tilt3DCard
                        maxTilt={3.5}
                        elevationY={-4}
                        glareOpacity={0.07}
                        className="chrome-card chrome-card-subtle group rounded-[15px] bg-white p-4 sm:p-5"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-8 h-8 rounded-lg bg-[#FAEEE9] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                            <ObjectiveIcon type={obj.icon} />
                          </span>
                          <div>
                            <h3 className="text-[14.5px] font-bold text-[#171C19]">
                              {obj.title}
                            </h3>
                            <p className="mt-1 text-[13px] leading-[1.6] text-[#5B645E]">
                              {obj.description}
                            </p>
                          </div>
                        </div>
                      </Tilt3DCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* Participation / Highlights narrative paragraphs (if distinct from above visual modules) */}
          {activity.participationDetails &&
            activity.participationDetails.paragraphs.length > 0 &&
            !activity.participationDetails.distributionBreakdown &&
            !activity.participationDetails.participantSplit && (
              <Reveal y={18}>
                <article className="chrome-card chrome-card-lift rounded-[20px] bg-white p-6 sm:p-8">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                    {activity.participationDetails.eyebrow}
                  </p>
                  <h2 className="mt-2 font-serif text-[24px] sm:text-[27px] font-bold tracking-[-0.015em] text-[#171C19]">
                    {activity.participationDetails.heading}
                  </h2>
                  <div className="mt-4 space-y-3.5 text-[15px] leading-[1.8] text-[#4C554F] max-w-[66ch]">
                    {activity.participationDetails.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </article>
              </Reveal>
            )}

          {/* Winners / Named Awardees Section (only rendered when documented!) */}
          <WinnersRecognitionModule activity={activity} />

          {/* Editorial Reflection Section */}
          <motion.section
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.62, ease: EASE_EDITORIAL }}
            aria-labelledby="reflection-heading"
            className="chrome-card chrome-card-lift relative rounded-[20px] bg-gradient-to-br from-[#F7F1E4] to-[#F2E9D8] p-7 sm:p-9 overflow-hidden"
          >
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
              {activity.reflection.eyebrow}
            </p>
            <h2
              id="reflection-heading"
              className="mt-2 font-serif text-[23px] sm:text-[26px] font-bold text-[#171C19]"
            >
              {activity.reflection.heading}
            </h2>
            <div className="mt-3.5 space-y-3 font-serif italic text-[17.5px] sm:text-[19px] leading-[1.68] text-[#232B26]">
              {activity.reflection.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </motion.section>

          {/* Field Archive Photography / Media Slots */}
          {activity.gallery.length > 0 && (
            <section aria-labelledby="gallery-heading" className="pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2
                  id="gallery-heading"
                  className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]"
                >
                  FIELD ARCHIVE PHOTOGRAPHY
                </h2>
                <span className="text-[11.5px] font-medium text-[#7B837E]">
                  {activity.date}
                </span>
              </div>

              <div
                className={`grid grid-cols-1 ${
                  activity.gallery.length === 1
                    ? 'sm:grid-cols-1 max-w-md'
                    : activity.gallery.length === 2
                    ? 'sm:grid-cols-2'
                    : 'sm:grid-cols-3'
                } gap-4 sm:gap-5`}
              >
                {activity.gallery.map((media, idx) => {
                  const hasPhoto = Boolean(media.imagePath);
                  const lightboxIdx = hasPhoto
                    ? realPhotos.findIndex((p) => p.imagePath === media.imagePath)
                    : -1;

                  return (
                    <motion.div
                      key={`${media.placeholderLabel}-${idx}`}
                      initial={prefersReduced ? false : { opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.54,
                        delay: idx * 0.09,
                        ease: EASE_EDITORIAL,
                      }}
                    >
                      <Tilt3DCard
                        maxTilt={3.5}
                        elevationY={-4}
                        onClick={
                          hasPhoto && lightboxIdx >= 0
                            ? () => onOpenLightbox(realPhotos, lightboxIdx)
                            : undefined
                        }
                        className={`chrome-card chrome-card-subtle group rounded-[15px] bg-white overflow-hidden ${
                          hasPhoto ? 'cursor-pointer' : ''
                        }`}
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                          <ArchivalMediaFrame media={media} variant="gallery" />
                        </div>
                        <div className="px-3.5 py-3">
                          <p className="text-[12px] leading-snug font-medium text-[#47514B]">
                            {media.caption}
                          </p>
                          {(media.dateRecorded || media.locationRecorded) && (
                            <p className="mt-1 text-[10.5px] text-[#7A827D]">
                              {[media.dateRecorded, media.locationRecorded]
                                .filter(Boolean)
                                .join(' · ')}
                            </p>
                          )}
                        </div>
                      </Tilt3DCard>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: STICKY IMPACT SIDEBAR */}
        <aside
          aria-label="Documented activity metrics and outputs"
          className="lg:sticky lg:top-[88px] space-y-5 self-start"
        >
          {/* Card 1: Documented Metrics & Outputs */}
          <Reveal delay={0.08} y={18}>
            <div className="chrome-card chrome-card-lift rounded-[20px] bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#F0EBE1]">
                <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#9A3B1E]">
                  DOCUMENTED FIGURES
                </span>
                <span className="text-[11px] font-semibold text-[#5E6862] tabular-nums">
                  {activity.yearDisplay}
                </span>
              </div>

              {/* 2 Key Stat Boxes */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {activity.verifiedMetrics.map((m) => (
                  <motion.div
                    key={m.label}
                    whileHover={prefersReduced ? undefined : { y: -3 }}
                    transition={{ duration: 0.2, ease: EASE_EDITORIAL }}
                    className="rounded-xl bg-[#F7F4ED] border border-[#ECE5D7] p-3.5 shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_20px_-12px_rgba(13,48,33,0.18)] transition-shadow"
                  >
                    <p
                      className={`font-serif text-[28px] font-bold leading-none tabular-nums ${
                        m.accent === 'terracotta'
                          ? 'text-[#9A3B1E]'
                          : 'text-[#171C19]'
                      }`}
                    >
                      {m.value}
                    </p>
                    <p className="mt-2 text-[11.5px] leading-snug font-medium text-[#5E6862]">
                      {m.label}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Metrics Disclaimer when specified (e.g. Mission Bharari internal reporting note) */}
              {activity.metricsDisclaimer && (
                <div className="mt-4 p-3 rounded-xl bg-[#F6F3EC] border border-[#EAE2D3] flex items-start gap-2 text-[11px] leading-relaxed text-[#58625C]">
                  <Info className="w-3.5 h-3.5 text-[#9A3B1E] shrink-0 mt-0.5" />
                  <span>{activity.metricsDisclaimer}</span>
                </div>
              )}

              {/* Outputs / Kit Composition / Summary Checklist */}
              {activity.outputs && activity.outputs.items.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[#F0EBE1]">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#7A827D] mb-3">
                    {activity.outputs.sidebarTitle}
                  </p>
                  <ul className="space-y-2.5">
                    {activity.outputs.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-[12.5px] leading-snug text-[#3F4843]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#9A3B1E] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Reveal>

          {/* Card 2: Implementation / Partners Summary (only rendered when populated) */}
          {(activity.partners?.length ||
            activity.implementation.fundingModel ||
            activity.implementation.deliveryModel ||
            activity.implementation.evaluatedBy) && (
            <Reveal delay={0.14} y={18}>
              <div className="chrome-card chrome-card-lift rounded-[20px] bg-white p-5 sm:p-6 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#9A3B1E]">
                  IMPLEMENTATION DETAILS
                </p>

                {activity.partners && activity.partners.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-[#EEF4F0] border border-[#D8E5DD]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#143B2A]">
                      Partner Organisation
                    </p>
                    {activity.partners.map((partner) => (
                      <div key={partner.name} className="mt-1">
                        <p className="text-[13.5px] font-bold text-[#171C19]">
                          {partner.name}
                        </p>
                        <p className="text-[11.5px] text-[#4E5E55]">
                          {partner.role}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {activity.implementation.fundingModel && (
                  <div>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#7A827D]">
                      Funding Model
                    </p>
                    <p className="mt-1 text-[13px] font-medium text-[#2A342E]">
                      {activity.implementation.fundingModel}
                    </p>
                  </div>
                )}

                {activity.implementation.deliveryModel && (
                  <div>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#7A827D]">
                      Delivery Model
                    </p>
                    <p className="mt-1 text-[13px] font-medium text-[#2A342E]">
                      {activity.implementation.deliveryModel}
                    </p>
                  </div>
                )}

                {activity.implementation.evaluatedBy && (
                  <div>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#7A827D]">
                      Evaluation
                    </p>
                    <p className="mt-1 text-[13px] font-medium text-[#2A342E]">
                      {activity.implementation.evaluatedBy}
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {/* Card 3: Support & Print Archival Record (Deep Forest Card) */}
          <Reveal delay={0.2} y={18}>
            <div className="chrome-card chrome-card-dark chrome-card-lift relative rounded-[20px] bg-[#082417] text-white p-6 overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-12 w-40 h-40 rounded-full bg-[#246346]/35 blur-2xl"
              />
              <div className="relative z-10">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-[#E6A94A]">
                  GARAD FOUNDATION · THANE
                </p>
                <h3 className="mt-2 font-serif text-[22px] font-bold leading-[1.22] text-white">
                  Support Grassroots Outreach
                </h3>
                <p className="mt-2.5 text-[13px] leading-[1.65] text-[#C5D8CD]">
                  Connect with our Thane volunteer coordination desk to volunteer
                  or support upcoming education, welfare, and youth initiatives.
                </p>

                <motion.a
                  href="/donate"
                  onClick={(e) => handleLinkClick(e, onNavigateDonate)}
                  whileHover={prefersReduced ? undefined : { y: -1.5 }}
                  whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                  className="mt-5 block text-center w-full py-2.5 px-4 rounded-xl bg-[#9A3B1E] hover:bg-[#AD4424] text-white text-[13px] font-semibold shadow-[0_8px_20px_rgba(154,59,30,0.3)] transition-colors cursor-pointer"
                >
                  Donate Now
                </motion.a>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="group mt-3.5 w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-[#D6E4DC] hover:text-white transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Activity Record</span>
                </button>
              </div>
            </div>
          </Reveal>
        </aside>
      </section>

      {/* ==================== RELATED ACTIVITIES INTERNAL LINKS ==================== */}
      {relatedActivities.length > 0 && (
        <section
          aria-labelledby="related-activities-heading"
          className="mt-16 pt-12 border-t border-[#E6DFD2]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                CONTINUE EXPLORING THE ARCHIVE
              </p>
              <h2
                id="related-activities-heading"
                className="mt-1 font-serif text-[25px] sm:text-[28px] font-bold text-[#171C19]"
              >
                Related Documented Activities
              </h2>
            </div>

            <a
              href="/activities"
              onClick={(e) => handleLinkClick(e, onNavigateArchive)}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#9A3B1E] hover:text-[#7E2D14] transition-colors"
            >
              <span>View full archive</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedActivities.map((rel) => (
              <a
                key={rel.slug}
                href={getActivityPath(rel.slug)}
                onClick={(e) =>
                  handleLinkClick(e, () => onNavigateActivity(rel.slug))
                }
                className="chrome-card chrome-card-subtle chrome-card-lift group rounded-[18px] bg-white p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[#9A3B1E]">
                    <span>{rel.category}</span>
                    <span className="text-[#7A827D] font-normal">
                      {rel.cardDate}
                    </span>
                  </div>
                  <h3 className="mt-2 font-serif text-[19px] font-bold text-[#171C19] group-hover:text-[#0D3021] transition-colors leading-snug">
                    {rel.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#5C6660] line-clamp-2">
                    {rel.cardDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-[12.5px] font-semibold text-[#9A3B1E]">
                  <span>Explore full story</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
