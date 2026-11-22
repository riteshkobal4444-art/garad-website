import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Search, X } from 'lucide-react';
import {
  ActivityCategory,
  CATEGORY_FILTERS,
  FiscalYearId,
  YEAR_FILTERS,
} from '../data/activities';

interface FilterDockProps {
  selectedYear: FiscalYearId;
  selectedCategory: ActivityCategory;
  searchQuery: string;
  onSelectYear: (year: FiscalYearId) => void;
  onSelectCategory: (category: ActivityCategory) => void;
  onSearchChange: (query: string) => void;
}

export function FilterDock({
  selectedYear,
  selectedCategory,
  searchQuery,
  onSelectYear,
  onSelectCategory,
  onSearchChange,
}: FilterDockProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="sticky top-[74px] sm:top-[80px] z-30 my-8 sm:my-10">
      <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-[#E7E0D3] shadow-[0_10px_30px_-16px_rgba(13,48,33,0.14)] px-3 sm:px-4 py-2.5">
        <div className="flex flex-col gap-2">
          {/* Row 1: YEAR filter group + Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.09em] text-[#7D8580] shrink-0 pl-1 w-[62px]">
                FY:
              </span>
              <div
                role="group"
                aria-label="Filter activities by Indian financial year (April to March)"
                className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 pr-2"
              >
                {YEAR_FILTERS.map((yr) => {
                  const isActive = selectedYear === yr.id;
                  return (
                    <button
                      key={yr.id}
                      type="button"
                      onClick={() => onSelectYear(yr.id)}
                      aria-pressed={isActive}
                      className={`relative px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D3021]/40 ${
                        isActive
                          ? 'text-white font-semibold'
                          : 'text-[#4F5852] hover:text-[#142019] hover:bg-[#F3EFE7]'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="filter-year-active-pill"
                          transition={
                            prefersReduced
                              ? { duration: 0.05 }
                              : { type: 'spring', stiffness: 420, damping: 32 }
                          }
                          className="absolute inset-0 rounded-full bg-[#0D3021] shadow-[0_3px_10px_rgba(13,48,33,0.22)]"
                        />
                      )}
                      <span className="relative z-10 inline-flex items-center gap-1.5 tabular-nums">
                        {isActive && yr.id !== 'all' && (
                          <span
                            aria-hidden="true"
                            className="w-1.5 h-1.5 rounded-full bg-[#E3A63A]"
                          />
                        )}
                        {yr.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Compact Archive Search Input */}
            <div className="relative w-full md:w-[250px] lg:w-[270px] shrink-0">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A827D]"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search activities, places, topics…"
                aria-label="Search documented activities"
                className="w-full rounded-full bg-[#F7F4ED] border border-[#E5DDD0] focus:border-[#0D3021] focus:bg-white pl-8 pr-8 py-1.5 text-[12px] text-[#171C19] placeholder:text-[#7A827D] focus:outline-none focus:ring-2 focus:ring-[#0D3021]/15 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear activity search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-[#6B746E] hover:text-[#171C19] hover:bg-[#EAE3D6] transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="h-[1px] w-full bg-[#EFE9DD]"
          />

          {/* Row 2: CATEGORY filter group */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.09em] text-[#7D8580] shrink-0 pl-1 w-[62px]">
              Category:
            </span>
            <div
              role="group"
              aria-label="Filter activities by category"
              className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 pr-1"
            >
              {CATEGORY_FILTERS.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onSelectCategory(cat)}
                    aria-pressed={isActive}
                    className={`relative px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3B1E]/40 ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-[#4F5852] bg-[#F4F1EA]/70 hover:bg-[#ECE6DA] hover:text-[#142019]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="filter-category-active-pill"
                        transition={
                          prefersReduced
                            ? { duration: 0.05 }
                            : { type: 'spring', stiffness: 420, damping: 32 }
                        }
                        className="absolute inset-0 rounded-full bg-[#9A3B1E] shadow-[0_3px_10px_rgba(154,59,30,0.25)]"
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
