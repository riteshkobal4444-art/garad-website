import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react';
import {
  ArrowRight,
  Award,
  Calendar,
  FilePenLine,
  GraduationCap,
  MapPin,
  Package,
  Star,
  Users,
  Video,
} from 'lucide-react';
import { ActivityRecord } from '../data/activities';
import { getActivityPath } from '../utils/router';
import { ArchivalMediaFrame } from './ArchivalMediaFrame';
import {
  EASE_EDITORIAL,
  Tilt3DCard,
  useCanHover3D,
} from './motion/MotionPrimitives';

interface ActivityCardProps {
  activity: ActivityRecord;
  index: number;
  onNavigateActivity: (slug: string) => void;
}

function StatIcon({ type }: { type: ActivityRecord['cardStatIcon'] }) {
  switch (type) {
    case 'box':
      return <Package className="w-3.5 h-3.5 text-[#143B2A] shrink-0" />;
    case 'users':
      return <Users className="w-3.5 h-3.5 text-[#9A3B1E] shrink-0" />;
    case 'pen':
      return <FilePenLine className="w-3.5 h-3.5 text-[#143B2A] shrink-0" />;
    case 'video':
      return <Video className="w-3.5 h-3.5 text-[#143B2A] shrink-0" />;
    case 'graduation':
      return <GraduationCap className="w-3.5 h-3.5 text-[#9A3B1E] shrink-0" />;
    case 'award':
      return <Award className="w-3.5 h-3.5 text-[#9A3B1E] shrink-0" />;
  }
}

export function ActivityCard({
  activity,
  index,
  onNavigateActivity,
}: ActivityCardProps) {
  const prefersReduced = useReducedMotion();
  const canHover3D = useCanHover3D();
  const imageWrapRef = useRef<HTMLDivElement>(null);

  const rawImgX = useMotionValue(0);
  const rawImgY = useMotionValue(0);
  const imgX = useSpring(rawImgX, { stiffness: 180, damping: 24 });
  const imgY = useSpring(rawImgY, { stiffness: 180, damping: 24 });

  const handleImageMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canHover3D || !imageWrapRef.current) return;
    const rect = imageWrapRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rawImgX.set(-nx * 7);
    rawImgY.set(-ny * 5);
  };

  const handleImageLeave = () => {
    rawImgX.set(0);
    rawImgY.set(0);
  };

  const href = getActivityPath(activity.slug);

  const handleCardLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    onNavigateActivity(activity.slug);
  };

  const categoryBadgeStyle =
    activity.category === 'Women & Health Awareness' ||
    activity.category === 'Language & Culture'
      ? 'bg-[#9A3B1E]/92 text-white'
      : 'bg-[#0D3021]/92 text-white';

  return (
    <motion.div
      layout={!prefersReduced}
      initial={prefersReduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.58,
        delay: Math.min(index * 0.07, 0.35),
        ease: EASE_EDITORIAL,
      }}
      className="h-full"
    >
      <Tilt3DCard
        maxTilt={3.5}
        elevationY={-6}
        glareOpacity={0.07}
        className="chrome-card group flex flex-col rounded-[20px] bg-white overflow-hidden"
      >
        <a
          href={href}
          onClick={handleCardLinkClick}
          className="flex flex-col flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#9A3B1E] rounded-[20px]"
        >
          {/* Top Archival Media Container */}
          <div
            ref={imageWrapRef}
            onPointerMove={canHover3D ? handleImageMove : undefined}
            onPointerLeave={canHover3D ? handleImageLeave : undefined}
            className="relative aspect-[16/10] w-full overflow-hidden bg-[#143B2A]"
          >
            <motion.div
              style={canHover3D ? { x: imgX, y: imgY } : undefined}
              className="w-full h-full scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            >
              <ArchivalMediaFrame media={activity.cardImage} variant="card" />
            </motion.div>

            {/* Top Badges */}
            {activity.isFlagship ? (
              <>
                <div className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FBF6E8]/95 backdrop-blur-sm border border-[#E5D3A7] text-[#17211B] text-[10px] font-bold tracking-[0.06em] shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Star className="w-2.5 h-2.5 fill-[#C98A2E] text-[#C98A2E]" />
                  <span>FLAGSHIP</span>
                </div>
                <div className="absolute top-3.5 right-3.5 z-10 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[#17211B] text-[10.5px] font-semibold shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                  {activity.category}
                </div>
              </>
            ) : (
              <div
                className={`absolute top-3.5 left-3.5 z-10 px-2.5 py-1 rounded-full backdrop-blur-sm text-[10.5px] font-semibold tracking-[0.01em] shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 ${categoryBadgeStyle}`}
              >
                {activity.category}
              </div>
            )}

            {/* Activity Number Tag bottom-right */}
            <span className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded bg-white/92 backdrop-blur-sm font-mono text-[10px] font-medium tracking-wider text-[#26322B] shadow-sm">
              {activity.archiveNumber}
            </span>
          </div>

          {/* Card Content Body */}
          <div className="flex flex-col flex-1 p-5 sm:p-6">
            {/* Date & Location line */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11.5px] font-medium text-[#6C746F]">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#9A3B1E]/85 shrink-0" />
                <span>{activity.cardDate}</span>
              </span>
              <span aria-hidden="true" className="text-[#C4BCB0]">
                ·
              </span>
              <span className="inline-flex items-center gap-1 min-w-0">
                <MapPin className="w-3 h-3 text-[#7D8680] shrink-0" />
                <span className="truncate">{activity.cardLocation}</span>
              </span>
            </div>

            {/* Authentic Activity Title */}
            <h3 className="mt-2.5 font-serif text-[20px] sm:text-[21px] font-bold tracking-[-0.01em] text-[#171C19] leading-[1.25] group-hover:text-[#0D3021] transition-colors">
              {activity.title}
            </h3>

            {/* Report-Based Description */}
            <p className="mt-2.5 text-[13.5px] leading-[1.65] text-[#555E58] flex-1">
              {activity.cardDescription}
            </p>

            {/* Verified Key Statistic Bar */}
            <div className="mt-5 px-3 py-2.5 rounded-xl bg-[#F6F3EC] border border-[#ECE6DA] flex items-center gap-2 text-[11.5px] font-semibold text-[#1E2A23]">
              <StatIcon type={activity.cardStatIcon} />
              <span className="leading-snug">{activity.cardKeyStat}</span>
            </div>

            {/* Explore Full Story CTA */}
            <div className="mt-4 pt-3.5 border-t border-[#F0EBE1] flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#9A3B1E] group-hover:text-[#7E2D14] transition-colors">
                <span>Explore Full Story</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5" />
              </span>
              <span className="text-[10.5px] font-medium text-[#757E78] tabular-nums">
                {activity.yearDisplay}
              </span>
            </div>
          </div>
        </a>
      </Tilt3DCard>
    </motion.div>
  );
}
