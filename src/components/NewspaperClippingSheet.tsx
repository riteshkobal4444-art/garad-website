import React from 'react';
import {
  formatPublicationDate,
  MediaCoverageItem,
} from '../data/mediaCoverage';

interface NewspaperClippingSheetProps {
  item: MediaCoverageItem;
  /** Rendering scale: compact hero plate, archive card, or full-scale modal inspection */
  mode?: 'hero' | 'featured' | 'medium' | 'archival' | 'full';
  className?: string;
}

/**
 * Renders a realistic scanned newspaper extract on warm archival newsprint.
 *
 * - For real verified press records (`isDemo === false`) with a raster scan (`clippingImage`),
 *   renders the authentic uncropped scan image directly.
 * - For demonstration clippings (`isDemo === true`), composes a realistic broadsheet print
 *   layout with paper texture, masthead rule, serif headline, inset documentary photo,
 *   multi-column print text, and an unmistakable `DEMO CONTENT` archival stamp.
 */
export function NewspaperClippingSheet({
  item,
  mode = 'medium',
  className = '',
}: NewspaperClippingSheetProps) {
  // Real verified newspaper scan: always preserve full uncropped scan
  if (!item.isDemo && (item.clippingImage || item.thumbnail)) {
    return (
      <div
        className={`relative bg-[#F4EFE4] border border-[#D4CBB8] p-3 sm:p-4 ${className}`}
      >
        <img
          src={item.clippingImage || item.thumbnail}
          alt={`${item.publicationName}: ${item.headline}`}
          loading={mode === 'full' ? 'eager' : 'lazy'}
          className="w-full h-auto object-contain mx-auto"
        />
      </div>
    );
  }

  const isHero = mode === 'hero';
  const isFeatured = mode === 'featured';
  const isArchival = mode === 'archival';
  const isFull = mode === 'full';

  const columnsToShow = isHero
    ? (item.clippingColumns || []).slice(0, 2)
    : isArchival
    ? (item.clippingColumns || []).slice(0, 1)
    : isFeatured || isFull
    ? item.clippingColumns || []
    : (item.clippingColumns || []).slice(0, 2);

  return (
    <div
      className={`relative overflow-hidden border border-[#CFC5B1] bg-[#F5F0E3] text-[#1C211E] select-none ${
        isFull
          ? 'p-6 sm:p-9 shadow-[0_24px_60px_-24px_rgba(14,26,20,0.45)]'
          : isHero
          ? 'p-4 sm:p-5 shadow-[0_20px_48px_-22px_rgba(14,26,20,0.38)]'
          : 'p-4 sm:p-5 shadow-[0_10px_28px_-18px_rgba(14,26,20,0.28)]'
      } ${className}`}
      style={{
        backgroundImage:
          'radial-gradient(rgba(40, 32, 18, 0.045) 1px, transparent 0), linear-gradient(180deg, rgba(255,252,245,0.65) 0%, rgba(235,227,209,0.42) 100%)',
        backgroundSize: '14px 14px, 100% 100%',
      }}
    >
      {/* Subtle torn/aged paper top & bottom edge highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-white/75"
      />

      {/* Diagonal Subtle Watermark for Demo Content */}
      {item.isDemo && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <span
            className={`font-mono font-bold uppercase tracking-[0.28em] text-[#9A3B1E]/[0.085] -rotate-[22deg] whitespace-nowrap ${
              isFull
                ? 'text-[44px] sm:text-[62px]'
                : isFeatured
                ? 'text-[34px] sm:text-[44px]'
                : 'text-[22px] sm:text-[26px]'
            }`}
          >
            DEMO CONTENT
          </span>
        </div>
      )}

      {/* Broadsheet Newspaper Top Folio Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-[#1B221E] text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.13em] text-[#3B443F]">
        <span className="font-semibold text-[#171E1A]">
          {item.publicationName}
        </span>
        <span className="tabular-nums text-[#535D57]">
          Sample Date: {formatPublicationDate(item)}
        </span>
      </div>

      <div className="relative z-10 mt-[2px] pt-1.5 pb-2 border-t border-b border-[#1B221E]/25 flex items-center justify-between gap-2 text-[9px] font-mono uppercase tracking-[0.12em] text-[#606A64]">
        <span className="truncate">{item.editionNote || 'Sample Print Extract'}</span>
        {item.isDemo && (
          <span className="shrink-0 font-bold text-[#9A3B1E] tracking-[0.16em]">
            DEMO CONTENT
          </span>
        )}
      </div>

      {/* Newspaper Print Headline */}
      <h3
        className={`relative z-10 mt-3 font-serif font-bold text-[#141A17] tracking-[-0.015em] ${
          isFull
            ? 'text-[26px] sm:text-[34px] leading-[1.12]'
            : isFeatured
            ? 'text-[23px] sm:text-[28px] leading-[1.15]'
            : isHero
            ? 'text-[17px] sm:text-[19px] leading-[1.18]'
            : isArchival
            ? 'text-[17px] sm:text-[18px] leading-[1.22]'
            : 'text-[19px] sm:text-[21px] leading-[1.2]'
        }`}
      >
        {item.headline}
      </h3>

      {item.clippingLead && !isArchival && (
        <p
          className={`relative z-10 mt-2 font-serif italic text-[#3A433E] border-b border-[#1B221E]/15 pb-2.5 ${
            isFull
              ? 'text-[15.5px] leading-[1.5]'
              : isHero
              ? 'text-[11.5px] leading-[1.45]'
              : 'text-[13px] leading-[1.48]'
          }`}
        >
          {item.clippingLead}
        </p>
      )}

      {/* Body Layout: Inset Photo + Multi-Column Print Copy */}
      <div
        className={`relative z-10 mt-3 ${
          isFeatured || isFull
            ? 'grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-start'
            : 'space-y-3'
        }`}
      >
        {/* Inset Print Photograph */}
        {item.clippingImage && (
          <figure
            className={
              isFeatured || isFull ? 'md:col-span-6' : 'w-full'
            }
          >
            <div className="border border-[#BFB5A0] bg-[#EAE3D2] p-1">
              <img
                src={item.clippingImage}
                alt={item.photoCaption || item.headline}
                loading={isFull ? 'eager' : 'lazy'}
                className={`w-full object-cover sepia-[0.16] contrast-[1.03] saturate-[0.82] ${
                  isFull
                    ? 'aspect-[16/10]'
                    : isFeatured
                    ? 'aspect-[16/10]'
                    : isHero
                    ? 'h-[118px]'
                    : isArchival
                    ? 'h-[126px]'
                    : 'aspect-[16/10]'
                }`}
              />
            </div>
            {item.photoCaption && !isHero && (
              <figcaption className="mt-1.5 text-[10px] font-serif italic text-[#5B645E] leading-snug">
                {item.photoCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Print Newspaper Columns */}
        <div
          className={
            isFeatured || isFull
              ? 'md:col-span-6'
              : 'w-full'
          }
        >
          <div
            className={`text-[#2C3430] ${
              isFull
                ? 'sm:columns-2 gap-5 text-[13px] leading-[1.65] space-y-2.5'
                : isFeatured
                ? 'sm:columns-2 gap-4 text-[11.5px] leading-[1.6] space-y-2'
                : isHero
                ? 'columns-2 gap-3 text-[9.5px] leading-[1.45] space-y-1.5'
                : 'text-[11.5px] leading-[1.58] space-y-2'
            }`}
            style={{
              columnRule: '1px solid rgba(27, 34, 30, 0.14)',
            }}
          >
            {columnsToShow.map((para, idx) => (
              <p key={idx} className="break-inside-avoid">
                {para}
              </p>
            ))}
          </div>

          {isFull && item.activityDate && (
            <p className="mt-4 pt-3 border-t border-[#1B221E]/15 text-[10.5px] font-mono uppercase tracking-[0.1em] text-[#5B645E]">
              {item.activityDate} · Published {formatPublicationDate(item)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
