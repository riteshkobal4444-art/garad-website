import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Camera,
  GraduationCap,
  HeartHandshake,
  Leaf,
  MapPin,
  Mic,
  Package,
  ShieldCheck,
  Video,
} from 'lucide-react';
import { ActivityMedia, VisualMotif } from '../data/activities';

interface ArchivalMediaFrameProps {
  media: ActivityMedia;
  variant?: 'card' | 'hero' | 'gallery';
  className?: string;
  hideSampleBadge?: boolean;
  onImageError?: (failed: boolean) => void;
}

export function IllustrativeImageBadge({
  className = 'bottom-3 left-3',
}: {
  className?: string;
}) {
  return (
    <span
      className={`pointer-events-none select-none absolute ${className} z-10 inline-flex items-center gap-1.5 rounded bg-[#0A2217]/84 backdrop-blur-sm border border-white/22 px-2 py-0.5 font-mono text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.13em] text-[#FAF6EE] shadow-sm`}
    >
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full bg-[#E3A63A] shrink-0"
      />
      <span>ILLUSTRATIVE IMAGE</span>
    </span>
  );
}

const MOTIF_STYLES: Record<
  VisualMotif,
  {
    bg: string;
    accentGlow: string;
    ring: string;
    iconBg: string;
    iconColor: string;
    tag: string;
  }
> = {
  welfare: {
    bg: 'from-[#103524] via-[#194732] to-[#265A41]',
    accentGlow: 'bg-[#D69A3B]/20',
    ring: 'border-[#D69A3B]/30',
    iconBg: 'bg-[#FBF6E8]/12',
    iconColor: 'text-[#F0C676]',
    tag: 'Community Welfare Archive',
  },
  health: {
    bg: 'from-[#5A2416] via-[#7A311C] to-[#943B21]',
    accentGlow: 'bg-[#F2C3AE]/18',
    ring: 'border-[#F2C3AE]/28',
    iconBg: 'bg-white/12',
    iconColor: 'text-[#FADCD0]',
    tag: 'Women & Health Archive',
  },
  literature: {
    bg: 'from-[#18382B] via-[#214B39] to-[#2B5D47]',
    accentGlow: 'bg-[#E5D3A7]/16',
    ring: 'border-[#E5D3A7]/25',
    iconBg: 'bg-white/10',
    iconColor: 'text-[#EFE0BA]',
    tag: 'Youth Literary Archive',
  },
  video: {
    bg: 'from-[#132F25] via-[#1D4435] to-[#3B3A2C]',
    accentGlow: 'bg-[#E0925D]/18',
    ring: 'border-[#E0925D]/28',
    iconBg: 'bg-white/10',
    iconColor: 'text-[#F4C29F]',
    tag: 'Public Health Media Archive',
  },
  education: {
    bg: 'from-[#0D2D1F] via-[#17422F] to-[#265941]',
    accentGlow: 'bg-[#E3A63A]/20',
    ring: 'border-[#E3A63A]/30',
    iconBg: 'bg-[#FBF6E8]/12',
    iconColor: 'text-[#F2C97D]',
    tag: 'Rural Education Archive',
  },
  culture: {
    bg: 'from-[#4F2316] via-[#6D2E1A] to-[#873B21]',
    accentGlow: 'bg-[#ECC483]/18',
    ring: 'border-[#ECC483]/28',
    iconBg: 'bg-white/12',
    iconColor: 'text-[#F6DDB2]',
    tag: 'Language & Culture Archive',
  },
  environment: {
    bg: 'from-[#0D3222] via-[#174A33] to-[#236446]',
    accentGlow: 'bg-[#9ED9B4]/20',
    ring: 'border-[#9ED9B4]/30',
    iconBg: 'bg-white/12',
    iconColor: 'text-[#BCE8CC]',
    tag: 'Environmental Awareness Archive',
  },
};

function MotifIcon({ motif, size }: { motif: VisualMotif; size: string }) {
  switch (motif) {
    case 'welfare':
      return <Package className={size} />;
    case 'health':
      return <HeartHandshake className={size} />;
    case 'literature':
      return <BookOpen className={size} />;
    case 'video':
      return <Video className={size} />;
    case 'education':
      return <GraduationCap className={size} />;
    case 'culture':
      return <Mic className={size} />;
    case 'environment':
      return <Leaf className={size} />;
  }
}

/**
 * Renders an authentic Garad Foundation photograph or a clearly labelled illustrative
 * sample preview when `media.imagePath` is supplied. Automatically falls back to the
 * dignified archival placeholder if an image is missing or fails to load.
 */
export function ArchivalMediaFrame({
  media,
  variant = 'card',
  className = '',
  hideSampleBadge = false,
  onImageError,
}: ArchivalMediaFrameProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
    onImageError?.(false);
  }, [media.imagePath, onImageError]);

  if (media.imagePath && !imageFailed) {
    const isSample = media.imageType === 'sample';
    const badgePosition =
      variant === 'hero'
        ? 'bottom-3.5 left-4'
        : variant === 'gallery'
        ? 'bottom-2.5 left-2.5'
        : 'bottom-3 left-3';

    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#123123] ${className}`}>
        <img
          src={media.imagePath}
          alt={media.alt}
          loading={variant === 'hero' ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => {
            setImageFailed(true);
            onImageError?.(true);
          }}
          style={{ objectPosition: media.objectPosition || 'center 30%' }}
          className="w-full h-full object-cover"
        />

        {isSample && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#081911]/55 via-[#081911]/15 to-transparent"
          />
        )}

        {isSample && !hideSampleBadge && (
          <IllustrativeImageBadge className={badgePosition} />
        )}
      </div>
    );
  }

  const style = MOTIF_STYLES[media.visualMotif];

  return (
    <div
      role="img"
      aria-label={media.alt}
      className={`relative w-full h-full bg-gradient-to-br ${style.bg} text-white overflow-hidden select-none flex flex-col justify-between ${
        variant === 'hero'
          ? 'p-6 sm:p-10'
          : variant === 'gallery'
          ? 'p-4 sm:p-5'
          : 'p-5'
      } ${className}`}
    >
      {/* Subtle architectural archival grid pattern */}
      <div
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: variant === 'hero' ? '32px 32px' : '22px 22px',
        }}
        className="pointer-events-none absolute inset-0"
      />

      {/* Ambient radial light */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full blur-2xl ${style.accentGlow}`}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-12 w-52 h-52 rounded-full bg-black/25 blur-2xl"
      />

      {/* Subtle inner museum hairline frame */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-3 sm:inset-4 rounded-xl border ${style.ring}`}
      />

      {/* Top archival classification line (kept subtle so card badges never collide) */}
      <div
        className={`relative z-10 flex items-center justify-between gap-2 ${
          variant === 'card' ? 'pt-7' : ''
        }`}
      >
        {variant !== 'card' && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[10.5px] uppercase tracking-[0.14em] text-white/78">
            <Camera className="w-3.5 h-3.5 opacity-80 shrink-0" />
            <span>{style.tag}</span>
          </span>
        )}
        {variant === 'hero' && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/15 text-[10.5px] font-medium text-white/90">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F0C676] shrink-0" />
            <span>Safeguarding-First Archive</span>
          </span>
        )}
      </div>

      {/* Center Emblem & Archival Placeholder Notice */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center px-3 py-2">
        <div
          className={`rounded-2xl border ${style.ring} ${style.iconBg} backdrop-blur-sm flex items-center justify-center shadow-[0_12px_28px_rgba(0,0,0,0.2)] ${
            variant === 'hero'
              ? 'w-16 h-16 sm:w-20 sm:h-20'
              : variant === 'gallery'
              ? 'w-11 h-11'
              : 'w-12 h-12'
          }`}
        >
          <MotifIcon
            motif={media.visualMotif}
            size={
              variant === 'hero'
                ? 'w-8 h-8 sm:w-9 sm:h-9 ' + style.iconColor
                : variant === 'gallery'
                ? 'w-5 h-5 ' + style.iconColor
                : 'w-6 h-6 ' + style.iconColor
            }
          />
        </div>

        <p
          className={`mt-3 font-serif font-semibold text-white/95 leading-snug max-w-md ${
            variant === 'hero'
              ? 'text-[18px] sm:text-[22px]'
              : variant === 'gallery'
              ? 'text-[13px]'
              : 'text-[14px]'
          }`}
        >
          {media.placeholderLabel}
        </p>

        {variant === 'hero' && media.safeguardingNote && (
          <p className="mt-2 max-w-xl text-[12.5px] sm:text-[13.5px] leading-relaxed text-white/78">
            {media.safeguardingNote}
          </p>
        )}
      </div>

      {/* Bottom Archival Date & Location Metadata */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-[10.5px] sm:text-[11.5px] text-white/75 pt-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {media.dateRecorded && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 opacity-80 shrink-0" />
              <span>{media.dateRecorded}</span>
            </span>
          )}
          {media.locationRecorded && variant !== 'gallery' && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 opacity-80 shrink-0" />
              <span className="truncate max-w-[260px] sm:max-w-[380px]">
                {media.locationRecorded}
              </span>
            </span>
          )}
        </div>
        {variant === 'hero' && (
          <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-white/65">
            GARAD FOUNDATION ARCHIVE
          </span>
        )}
      </div>
    </div>
  );
}
