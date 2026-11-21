import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, User, Menu, X } from 'lucide-react';
import { EASE_EDITORIAL } from './motion/MotionPrimitives';

export type NavSectionKey = 'initiatives' | 'impact' | 'stories' | 'about';

interface NavbarProps {
  activeNav: NavSectionKey | null;
  isDonateRoute?: boolean;
  onNavigateHome: () => void;
  onSelectNav: (key: NavSectionKey) => void;
  onNavigateDonate: () => void;
  onOpenPortal: () => void;
}

const NAV_ITEMS: { key: NavSectionKey; label: string }[] = [
  { key: 'initiatives', label: 'Initiatives' },
  { key: 'impact', label: 'Impact' },
  { key: 'stories', label: 'Stories' },
  { key: 'about', label: 'About Us' },
];

export function Navbar({
  activeNav,
  isDonateRoute = false,
  onNavigateHome,
  onSelectNav,
  onNavigateDonate,
  onOpenPortal,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHomeLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigateHome();
  };

  const handleDonateLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigateDonate();
  };

  const handleNavClick = (key: NavSectionKey) => {
    setMobileMenuOpen(false);
    onSelectNav(key);
  };

  return (
    <header className="sticky top-0 z-40 h-[68px] bg-[#FAF8F4]/92 backdrop-blur-md border-b border-[#E8E2D6]/90 transition-colors">
      <div className="max-w-[1200px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sm:gap-8">
        {/* Brand lockup */}
        <a
          href="/"
          onClick={handleHomeLink}
          className="group text-left flex flex-col justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3B1E]/40 rounded-md py-1"
          aria-label="Garad Foundation Home"
        >
          <span className="font-serif text-[19px] sm:text-[21px] font-bold tracking-[-0.015em] text-[#142019] leading-none group-hover:text-[#0D3021] transition-colors whitespace-nowrap">
            Garad Foundation
          </span>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-[#66706A] leading-none whitespace-nowrap">
            <MapPin className="w-3 h-3 text-[#9A3B1E] shrink-0" />
            Thane, Maharashtra
          </span>
        </a>

        {/* Center Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 lg:gap-8"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.key;
            if (item.key === 'initiatives') {
              return (
                <a
                  key={item.key}
                  href="/activities"
                  onClick={handleHomeLink}
                  className={`relative py-2 text-[13.5px] font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3B1E]/40 rounded-sm ${
                    isActive
                      ? 'text-[#142019] font-semibold'
                      : 'text-[#555E58] hover:text-[#142019]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-underline"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute left-0 right-0 -bottom-[2px] h-[2px] rounded-full bg-[#9A3B1E]"
                    />
                  )}
                </a>
              );
            }

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavClick(item.key)}
                className={`relative py-2 text-[13.5px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3B1E]/40 rounded-sm ${
                  isActive
                    ? 'text-[#142019] font-semibold'
                    : 'text-[#555E58] hover:text-[#142019]'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute left-0 right-0 -bottom-[2px] h-[2px] rounded-full bg-[#9A3B1E]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <motion.a
            href="/donate"
            onClick={handleDonateLink}
            aria-current={isDonateRoute ? 'page' : undefined}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.16, ease: EASE_EDITORIAL }}
            className={`px-4 sm:px-5 py-2 rounded-lg text-white text-[13px] font-semibold tracking-[0.01em] transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3B1E] focus-visible:ring-offset-2 ${
              isDonateRoute
                ? 'bg-[#7F2E16] ring-2 ring-[#9A3B1E]/35 shadow-[0_4px_14px_rgba(154,59,30,0.28)]'
                : 'bg-[#9A3B1E] hover:bg-[#843016] shadow-[0_2px_10px_rgba(154,59,30,0.22)] hover:shadow-[0_6px_18px_rgba(154,59,30,0.28)]'
            }`}
          >
            Donate Now
          </motion.a>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.15 }}
            onClick={onOpenPortal}
            aria-label="About this archival platform"
            className="w-9 h-9 rounded-full bg-[#0D3021] hover:bg-[#16402E] text-white flex items-center justify-center shadow-sm transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D3021] focus-visible:ring-offset-2"
          >
            <User className="w-4 h-4" />
          </motion.button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden w-9 h-9 rounded-lg border border-[#E4DDD0] bg-white text-[#142019] flex items-center justify-center cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE_EDITORIAL }}
            className="md:hidden absolute top-[68px] inset-x-0 bg-[#FAF8F4]/98 backdrop-blur-lg border-b border-[#E5DEC9] shadow-lg px-5 py-4"
          >
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleNavClick(item.key)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EEF4F0] text-[#0D3021] font-semibold'
                        : 'text-[#4F5953] hover:bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
