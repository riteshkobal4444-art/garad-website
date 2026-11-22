import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Film,
  Globe,
  HeartHandshake,
  MapPin,
  Medal,
  Mic,
  Music,
  Package,
  ShieldAlert,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { ActivityRecord } from '../data/activities';
import { EASE_EDITORIAL, Tilt3DCard } from './motion/MotionPrimitives';

/**
 * Activity 01 — Utsavachi Shidori:
 * 175-box distribution breakdown (80 + 95) + three Thane traffic junctions.
 */
export function DistributionBreakdownModule({
  activity,
}: {
  activity: ActivityRecord;
}) {
  const prefersReduced = useReducedMotion();
  const breakdown = activity.participationDetails?.distributionBreakdown;
  if (!breakdown) return null;

  return (
    <section
      aria-labelledby="distribution-breakdown-heading"
      className="mt-12 sm:mt-14"
    >
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
          {activity.participationDetails?.eyebrow}
        </p>
        <h2
          id="distribution-breakdown-heading"
          className="mt-1.5 font-serif text-[26px] sm:text-[31px] font-bold tracking-[-0.015em] text-[#171C19]"
        >
          {activity.participationDetails?.heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Rounds Breakdown */}
        <div className="chrome-card chrome-card-lift lg:col-span-7 rounded-[20px] bg-white p-6 sm:p-7">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#F0EBE1]">
            <div className="flex items-center gap-2 text-sm font-bold text-[#171C19]">
              <Package className="w-4 h-4 text-[#9A3B1E]" />
              <span>Documented Distribution Table</span>
            </div>
            <span className="font-mono text-xs font-semibold text-[#143B2A] bg-[#EEF4F0] px-2.5 py-1 rounded-md tabular-nums">
              Total: {breakdown.totalBoxes} Food Boxes
            </span>
          </div>

          <div className="mt-5 space-y-5">
            {breakdown.rounds.map((round, idx) => {
              const pct = Math.round((round.boxes / breakdown.totalBoxes) * 100);
              return (
                <div key={round.roundLabel}>
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="text-[14px] font-bold text-[#171C19]">
                        {round.roundLabel}
                      </span>
                      <span className="ml-2 text-[12px] text-[#6B746E]">
                        {round.note}
                      </span>
                    </div>
                    <span className="font-serif text-[22px] font-bold text-[#143B2A] tabular-nums">
                      {round.boxes}{' '}
                      <span className="font-sans text-xs font-medium text-[#6B746E]">
                        boxes
                      </span>
                    </span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-[#F3EFE6] overflow-hidden">
                    <motion.div
                      initial={prefersReduced ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{
                        duration: 0.75,
                        delay: idx * 0.14,
                        ease: EASE_EDITORIAL,
                      }}
                      style={{
                        width: `${pct}%`,
                        transformOrigin: 'left center',
                      }}
                      className={`h-full rounded-full ${
                        idx === 0
                          ? 'bg-gradient-to-r from-[#143B2A] to-[#235D43]'
                          : 'bg-gradient-to-r from-[#9A3B1E] to-[#C25C3B]'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#F0EBE1] flex flex-wrap items-center justify-between gap-2 text-xs text-[#555E58]">
            <span>Verified sum of documented rounds: 80 + 95 = 175 boxes</span>
            <span className="font-semibold text-[#143B2A]">
              {breakdown.fundingNote}
            </span>
          </div>
        </div>

        {/* Three Thane Locations */}
        <div className="chrome-card chrome-card-lift lg:col-span-5 rounded-[20px] bg-[#EEF4F0] p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-[#143B2A]">
              THANE COVERAGE POINTS
            </p>
            <h3 className="mt-1.5 font-serif text-[21px] font-bold text-[#171C19]">
              Three Traffic Junctions Covered
            </h3>
            <div className="mt-5 space-y-3">
              {breakdown.locations.map((loc, idx) => (
                <motion.div
                  key={loc}
                  initial={prefersReduced ? false : { opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.08,
                    ease: EASE_EDITORIAL,
                  }}
                  className="rounded-xl bg-white/95 border border-[#D7E3DB] px-4 py-3 flex items-center gap-3 shadow-[0_4px_14px_-10px_rgba(13,48,33,0.16)]"
                >
                  <span className="w-7 h-7 rounded-lg bg-[#FAEEE9] text-[#9A3B1E] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span className="text-[13.5px] font-semibold text-[#171C19]">
                    {loc}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-[12px] leading-relaxed text-[#475B50]">
            Fresh, home-prepared meals and snacks were packed into individual
            meal boxes by youth volunteers for direct on-site distribution.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Activity 02 — Menstrual Hygiene Awareness:
 * Participant split (150 tribal women + 50 adolescent girls = 200) + partner & screening note.
 */
export function ParticipantSplitModule({
  activity,
}: {
  activity: ActivityRecord;
}) {
  const prefersReduced = useReducedMotion();
  const split = activity.participationDetails?.participantSplit;
  if (!split) return null;

  const total = split.reduce((sum, g) => sum + g.count, 0);

  return (
    <section
      aria-labelledby="participant-split-heading"
      className="mt-12 sm:mt-14"
    >
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
          {activity.participationDetails?.eyebrow}
        </p>
        <h2
          id="participant-split-heading"
          className="mt-1.5 font-serif text-[26px] sm:text-[31px] font-bold tracking-[-0.015em] text-[#171C19]"
        >
          {activity.participationDetails?.heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {split.map((group, idx) => (
          <motion.div
            key={group.label}
            initial={prefersReduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: idx * 0.1, ease: EASE_EDITORIAL }}
          >
            <Tilt3DCard
              maxTilt={3.5}
              elevationY={-4}
              className="chrome-card rounded-[18px] bg-white p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.11em] text-[#6B746E]">
                    Cohort 0{idx + 1}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold tabular-nums ${
                      group.tone === 'forest'
                        ? 'bg-[#EEF4F0] text-[#143B2A]'
                        : 'bg-[#FAEEE9] text-[#9A3B1E]'
                    }`}
                  >
                    {group.sharePercent}% of total
                  </span>
                </div>
                <p
                  className={`mt-3 font-serif text-[40px] font-bold leading-none tabular-nums ${
                    group.tone === 'forest' ? 'text-[#143B2A]' : 'text-[#9A3B1E]'
                  }`}
                >
                  {group.count}
                </p>
                <h3 className="mt-2 text-[15px] font-bold text-[#171C19]">
                  {group.label}
                </h3>
              </div>

              <div className="mt-5 h-2 rounded-full bg-[#F3EFE6] overflow-hidden">
                <motion.div
                  initial={prefersReduced ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.15 + idx * 0.1, ease: EASE_EDITORIAL }}
                  style={{
                    width: `${group.sharePercent}%`,
                    transformOrigin: 'left center',
                  }}
                  className={`h-full rounded-full ${
                    group.tone === 'forest' ? 'bg-[#143B2A]' : 'bg-[#9A3B1E]'
                  }`}
                />
              </div>
            </Tilt3DCard>
          </motion.div>
        ))}

        {/* Combined Total & Partner Card */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.2, ease: EASE_EDITORIAL }}
        >
          <div className="chrome-card chrome-card-dark chrome-card-lift h-full rounded-[18px] bg-[#0D3021] text-white p-6 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#E6A94A]">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Total Verified Reach</span>
              </span>
              <p className="mt-3 font-serif text-[40px] font-bold leading-none tabular-nums">
                {total}
              </p>
              <p className="mt-1.5 text-[13.5px] font-semibold text-white/95">
                Participants in Mamnoli, Kalyan
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-white/15 text-[12px] text-[#CBE0D5]">
              Partner: <strong className="text-white">Aapla Thane Foundation</strong>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Preventive Health Screening Note (strictly factual, no invented counts) */}
      {activity.participationDetails?.healthScreeningNote && (
        <div className="mt-5 rounded-2xl bg-[#F6F2EA] border border-[#E7DEC9] px-5 py-4 flex items-start gap-3 text-[13px] leading-relaxed text-[#4C5650]">
          <ShieldAlert className="w-4 h-4 text-[#9A3B1E] shrink-0 mt-0.5" />
          <p>{activity.participationDetails.healthScreeningNote}</p>
        </div>
      )}
    </section>
  );
}

/**
 * Activity 03 — Online Essay & Poetry Competition:
 * 30 participants, 3 languages, 2 formats, Indian history theme.
 */
export function MultilingualFormatsModule({
  activity,
}: {
  activity: ActivityRecord;
}) {
  const prefersReduced = useReducedMotion();
  const { languages, formats, themeSummary } = activity.implementation;
  if (!languages || !formats || activity.slug !== 'online-essay-poetry-competition') {
    return null;
  }

  return (
    <section
      aria-labelledby="multilingual-highlights-heading"
      className="mt-12 sm:mt-14"
    >
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
          {activity.participationDetails?.eyebrow}
        </p>
        <h2
          id="multilingual-highlights-heading"
          className="mt-1.5 font-serif text-[26px] sm:text-[31px] font-bold tracking-[-0.015em] text-[#171C19]"
        >
          {activity.participationDetails?.heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Participants */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
        >
          <Tilt3DCard
            maxTilt={3.5}
            elevationY={-4}
            className="chrome-card rounded-[18px] bg-white p-6"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EEF4F0] text-[#143B2A] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <p className="mt-4 font-serif text-[36px] font-bold text-[#171C19] leading-none tabular-nums">
              30
            </p>
            <h3 className="mt-1.5 text-[15px] font-bold text-[#171C19]">
              Verified Youth Participants
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[#5C6660]">
              Every digital entry was individually reviewed and appreciated, with
              top participants receiving e-certificates.
            </p>
          </Tilt3DCard>
        </motion.div>

        {/* Three Languages */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE_EDITORIAL }}
        >
          <Tilt3DCard
            maxTilt={3.5}
            elevationY={-4}
            className="chrome-card rounded-[18px] bg-white p-6"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAEEE9] text-[#9A3B1E] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="mt-4 font-serif text-[21px] font-bold text-[#171C19]">
              Three Languages
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1.5 rounded-lg bg-[#FAF6EE] border border-[#E9DFCE] text-[13px] font-semibold text-[#171C19]"
                >
                  {lang}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[12.5px] text-[#636D67]">
              Inclusive multilingual digital access across Maharashtra.
            </p>
          </Tilt3DCard>
        </motion.div>

        {/* Two Formats & Theme */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE_EDITORIAL }}
        >
          <Tilt3DCard
            maxTilt={3.5}
            elevationY={-4}
            className="chrome-card rounded-[18px] bg-[#EEF4F0] p-6"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-[#143B2A] flex items-center justify-center border border-[#D4E3D9]">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="mt-4 font-serif text-[21px] font-bold text-[#171C19]">
              Two Writing Formats
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {formats.map((fmt) => (
                <span
                  key={fmt}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#D4E3D9] text-[13px] font-semibold text-[#143B2A]"
                >
                  {fmt}
                </span>
              ))}
            </div>
            {themeSummary && (
              <p className="mt-3 text-[12.5px] leading-relaxed text-[#43564B]">
                Theme: <strong>{themeSummary}</strong>
              </p>
            )}
          </Tilt3DCard>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Activity 04 — Online Videography Awareness Contest:
 * 20 youth creators, 3 video themes, and 2 documented awardees.
 */
export function VideographyHighlightsModule({
  activity,
}: {
  activity: ActivityRecord;
}) {
  const prefersReduced = useReducedMotion();
  const themes = activity.participationDetails?.videoThemes;
  if (!themes || activity.slug !== 'online-videography-awareness-contest') {
    return null;
  }

  return (
    <section
      aria-labelledby="videography-themes-heading"
      className="mt-12 sm:mt-14"
    >
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
          {activity.participationDetails?.eyebrow}
        </p>
        <h2
          id="videography-themes-heading"
          className="mt-1.5 font-serif text-[26px] sm:text-[31px] font-bold tracking-[-0.015em] text-[#171C19]"
        >
          {activity.participationDetails?.heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {themes.map((theme, idx) => (
          <motion.div
            key={theme}
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.09, ease: EASE_EDITORIAL }}
          >
            <Tilt3DCard
              maxTilt={3.5}
              elevationY={-4}
              className="chrome-card rounded-[18px] bg-white p-5 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-[#FAEEE9] text-[#9A3B1E] font-mono text-[11px] font-semibold">
                  THEME 0{idx + 1}
                </span>
                <Film className="w-4 h-4 text-[#143B2A]" />
              </div>
              <h3 className="mt-4 font-serif text-[19px] font-bold text-[#171C19] leading-snug">
                {theme}
              </h3>
              <p className="mt-2 text-[12.5px] text-[#636D67]">
                Accepted in Marathi, Hindi, and English via WhatsApp and email.
              </p>
            </Tilt3DCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/**
 * Recognised Winners & Named Awardees Section
 * Used cleanly by both Activity 04 (2 winners with video titles) and Activity 06 (8 named awardees).
 */
export function WinnersRecognitionModule({
  activity,
}: {
  activity: ActivityRecord;
}) {
  const prefersReduced = useReducedMotion();
  const winners = activity.winners;
  if (!winners || winners.entries.length === 0) return null;

  const topPrizes = winners.entries.filter((e) => e.tier !== 'consolation');
  const consolations = winners.entries.filter((e) => e.tier === 'consolation');

  return (
    <section
      aria-labelledby="winners-recognition-heading"
      className="chrome-card chrome-card-lift rounded-[20px] bg-white p-6 sm:p-8"
    >
      <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
        {winners.eyebrow}
      </p>
      <h2
        id="winners-recognition-heading"
        className="mt-2 font-serif text-[25px] sm:text-[29px] font-bold tracking-[-0.015em] text-[#171C19]"
      >
        {winners.heading}
      </h2>
      {winners.subtitle && (
        <p className="mt-2 text-[14px] leading-relaxed text-[#58625C]">
          {winners.subtitle}
        </p>
      )}

      {/* First & Second Prize Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {topPrizes.map((entry, idx) => (
          <motion.div
            key={`${entry.rank}-${entry.name}`}
            initial={prefersReduced ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.48, delay: idx * 0.09, ease: EASE_EDITORIAL }}
          >
            <Tilt3DCard
              maxTilt={3}
              elevationY={-4}
              className={`rounded-2xl border p-5 ${
                entry.tier === 'first'
                  ? 'bg-gradient-to-br from-[#FBF6E8] to-[#F6ECDA] border-[#E5D3A7]'
                  : 'bg-[#FAF8F4] border-[#E7E0D3]'
              }`}
            >
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.11em] text-[#9A3B1E]">
                {entry.tier === 'first' ? (
                  <Trophy className="w-4 h-4 text-[#B57921]" />
                ) : (
                  <Medal className="w-4 h-4 text-[#143B2A]" />
                )}
                <span>{entry.rank}</span>
              </div>
              <p className="mt-2.5 font-serif text-[22px] font-bold text-[#171C19]">
                {entry.name}
              </p>
              {entry.workTitle && (
                <p className="mt-1.5 text-[13.5px] italic text-[#4E5852]">
                  “{entry.workTitle}”
                </p>
              )}
            </Tilt3DCard>
          </motion.div>
        ))}
      </div>

      {/* Consolation Awardees Grid (Activity 06) */}
      {consolations.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[#F0EBE1]">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B746E] mb-3.5">
            Consolation Awardees ({consolations.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {consolations.map((entry, idx) => (
              <motion.div
                key={entry.name}
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.05,
                  ease: EASE_EDITORIAL,
                }}
                className="rounded-xl bg-[#FAF8F4] border border-[#EAE4D8] px-4 py-3 flex items-center gap-3"
              >
                <span className="w-7 h-7 rounded-lg bg-[#EEF4F0] text-[#143B2A] flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[#171C19] truncate">
                    {entry.name}
                  </p>
                  <p className="text-[11px] text-[#6E7771]">{entry.rank}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Evaluation criteria chips if documented */}
      {activity.implementation.evaluationCriteria &&
        activity.implementation.evaluationCriteria.length > 0 && (
          <div className="mt-6 pt-5 border-t border-[#F0EBE1] flex flex-wrap items-center gap-2 text-xs text-[#555E58]">
            <span className="font-semibold text-[#171C19] inline-flex items-center gap-1.5 mr-1">
              <Sparkles className="w-3.5 h-3.5 text-[#9A3B1E]" />
              Evaluation Criteria:
            </span>
            {activity.implementation.evaluationCriteria.map((criterion) => (
              <span
                key={criterion}
                className="px-2.5 py-1 rounded-md bg-[#F5F1E9] border border-[#E6DFD2] text-[#2C3630] font-medium"
              >
                {criterion}
              </span>
            ))}
          </div>
        )}

      {/* Prize Fulfilment note */}
      {winners.fulfilmentNote && (
        <div className="mt-5 rounded-xl bg-[#EEF4F0] border border-[#D8E5DD] px-4 py-3 flex items-center gap-2.5 text-[12.5px] font-medium text-[#143B2A]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{winners.fulfilmentNote}</span>
        </div>
      )}
    </section>
  );
}

/**
 * Activity 07 — Abhivyakta 2024:
 * Dedicated two-track showcase for Elocution Competition ("Voices of Inspiration")
 * and Folk Dance Competition ("A Celebration of Culture") within Garad Foundation's editorial palette.
 */
export function CompetitionTracksModule({
  activity,
}: {
  activity: ActivityRecord;
}) {
  const prefersReduced = useReducedMotion();
  const tracks = activity.competitionTracks;
  if (!tracks) return null;

  return (
    <section
      aria-labelledby="competition-tracks-heading"
      className="mt-12 sm:mt-14 space-y-6"
    >
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
          {tracks.eyebrow}
        </p>
        <h2
          id="competition-tracks-heading"
          className="mt-1.5 font-serif text-[26px] sm:text-[32px] font-bold tracking-[-0.015em] text-[#171C19]"
        >
          {tracks.heading}
        </h2>
        {tracks.intro && (
          <p className="mt-2 max-w-[700px] text-[14.5px] leading-relaxed text-[#555E58]">
            {tracks.intro}
          </p>
        )}
      </div>

      {/* TRACK 1: ELOCUTION COMPETITION — VOICES OF INSPIRATION */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.56, ease: EASE_EDITORIAL }}
        className="chrome-card chrome-card-lift rounded-[22px] bg-white overflow-hidden"
      >
        <div className="bg-[#0D3021] text-white px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#E6A94A]">
              <Mic className="w-3.5 h-3.5" />
              <span>{tracks.elocution.label}</span>
            </span>
            <h3 className="mt-2 font-serif text-[26px] sm:text-[30px] font-bold leading-tight text-white">
              {tracks.elocution.title}
            </h3>
            <p className="mt-2 max-w-[62ch] text-[13.5px] leading-relaxed text-[#CBE0D5]">
              {tracks.elocution.summary}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl bg-white/10 border border-white/15 px-5 py-3.5 text-left sm:text-right">
            <p className="font-serif text-[34px] font-bold leading-none text-white tabular-nums">
              {tracks.elocution.participantCount}
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#E6A94A]">
              {tracks.elocution.participantLabel}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Two Grade Categories */}
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-[#6B746E] mb-3.5">
              COMPETITION CATEGORIES
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tracks.elocution.categories.map((cat, idx) => (
                <Tilt3DCard
                  key={cat.title}
                  maxTilt={3}
                  elevationY={-3}
                  className="rounded-[16px] bg-[#EEF4F0] border border-[#D7E4DC] p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-[#143B2A]">
                      {cat.subtitle}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-[#143B2A] bg-white px-2 py-0.5 rounded-md border border-[#D4E3D9]">
                      GROUP 0{idx + 1}
                    </span>
                  </div>
                  <h4 className="mt-2 font-serif text-[22px] font-bold text-[#171C19]">
                    {cat.title}
                  </h4>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#46574E]">
                    {cat.detail}
                  </p>
                </Tilt3DCard>
              ))}
            </div>
          </div>

          {/* Theme & Prizes Strip */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
            <div className="lg:col-span-7 rounded-[16px] bg-[#FAF8F4] border border-[#E7E0D3] p-5">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A3B1E]">
                <BookOpen className="w-4 h-4" />
                <span>Theme Focus</span>
              </div>
              <h4 className="mt-2 font-serif text-[19px] font-bold text-[#171C19]">
                {tracks.elocution.themeTitle}
              </h4>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#555E58]">
                {tracks.elocution.themeDescription}
              </p>
            </div>

            <div className="lg:col-span-5 rounded-[16px] bg-[#FAF8F4] border border-[#E7E0D3] p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#143B2A]">
                <Trophy className="w-4 h-4 text-[#B57921]" />
                <span>Winner Recognition</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {tracks.elocution.prizes.map((prize) => (
                  <span
                    key={prize}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2D9C9] text-[12.5px] font-semibold text-[#171C19]"
                  >
                    <Award className="w-3.5 h-3.5 text-[#9A3B1E]" />
                    <span>{prize}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* TRACK 2: FOLK DANCE COMPETITION — A CELEBRATION OF CULTURE */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.56, delay: 0.08, ease: EASE_EDITORIAL }}
        className="chrome-card chrome-card-lift rounded-[22px] bg-[#FBF7F0] overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#8E3519] via-[#9A3B1E] to-[#B1512C] text-white px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#FCE2B6]">
              <Music className="w-3.5 h-3.5" />
              <span>{tracks.folkDance.label}</span>
            </span>
            <h3 className="mt-2 font-serif text-[26px] sm:text-[30px] font-bold leading-tight text-white">
              {tracks.folkDance.title}
            </h3>
            <p className="mt-2 max-w-[62ch] text-[13.5px] leading-relaxed text-[#FBE9DF]">
              {tracks.folkDance.summary}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl bg-black/15 border border-white/20 px-5 py-3.5 text-left sm:text-right">
            <p className="font-serif text-[34px] font-bold leading-none text-white tabular-nums">
              {tracks.folkDance.participantCount}
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#FCE2B6]">
              {tracks.folkDance.participantLabel}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-[#8E3519] mb-3.5">
              {tracks.folkDance.highlightsLabel || 'CULTURAL SHOWCASE HIGHLIGHTS'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tracks.folkDance.danceForms.map((form) => (
                <Tilt3DCard
                  key={form.name}
                  maxTilt={3}
                  elevationY={-3}
                  className="rounded-[16px] bg-white border border-[#EADBC8] p-5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-[#FAEEE9] text-[#9A3B1E] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h4 className="font-serif text-[21px] font-bold text-[#171C19]">
                      {form.name}
                    </h4>
                  </div>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#555E58]">
                    {form.description}
                  </p>
                </Tilt3DCard>
              ))}
            </div>
          </div>

          {/* Award Ceremony Highlight */}
          <div className="rounded-[15px] bg-[#F4EAD8]/70 border border-[#E5D3B3] px-5 py-4 flex items-start gap-3 text-[13.5px] leading-relaxed text-[#3E352A]">
            <Trophy className="w-4 h-4 text-[#9A3B1E] shrink-0 mt-0.5" />
            <p>{tracks.folkDance.closingHighlight}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

