import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  ChevronDown,
  FileText,
  Handshake,
  Info,
  MapPin,
  Menu,
  Newspaper,
  User,
  Users,
  X,
} from 'lucide-react';
import { EASE_EDITORIAL } from './motion/MotionPrimitives';

export type NavSectionKey =
  | 'initiatives'
  | 'learning-hub'
  | 'in-the-news'
  | 'impact'
  | 'stories'
  | 'about';

interface NavbarProps {
  activeNav: NavSectionKey | null;
  isDonateRoute?: boolean;
  isLearningHubRoute?: boolean;
  isNewsRoute?: boolean;
  isReportsRoute?: boolean;
  isCsrRoute?: boolean;
  isVolunteerRoute?: boolean;
  onNavigateHome: () => void;
  onNavigateLearningHub: () => void;
  onNavigateNews: () => void;
  onSelectNav: (key: NavSectionKey) => void;
  onNavigateReports: () => void;
  onNavigateCsr: () => void;
  onNavigateVolunteer: () => void;
  onNavigateDonate: () => void;
  onOpenPortal: () => void;
}

const NAV_ITEMS: { key: NavSectionKey; label: string }[] = [
  { key: 'initiatives', label: 'Initiatives' },
  { key: 'learning-hub', label: 'Learning Hub' },
  { key: 'in-the-news', label: 'In the News' },
  { key: 'impact', label: 'Impact' },
  { key: 'stories', label: 'Stories' },
  { key: 'about', label: 'About Us' },
];

export function Navbar({
  activeNav,
  isDonateRoute = false,
  isLearningHubRoute = false,
  isNewsRoute = false,
  isReportsRoute = false,
  isCsrRoute = false,
  isVolunteerRoute = false,
  onNavigateHome,
  onNavigateLearningHub,
  onNavigateNews,
  onSelectNav,
  onNavigateReports,
  onNavigateCsr,
  onNavigateVolunteer,
  onNavigateDonate,
  onOpenPortal,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const aboutMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aboutMenuOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (
        aboutMenuRef.current &&
        !aboutMenuRef.current.contains(e.target as Node)
      ) {
        setAboutMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAboutMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [aboutMenuOpen]);

  const handleHomeLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    setAboutMenuOpen(false);
    onNavigateHome();
  };

  const handleLearningHubLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    setAboutMenuOpen(false);
    onNavigateLearningHub();
  };

  const handleNewsLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    setAboutMenuOpen(false);
    onNavigateNews();
  };

  const handleReportsLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    setAboutMenuOpen(false);
    onNavigateReports();
  };

  const handleCsrLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    setAboutMenuOpen(false);
    onNavigateCsr();
  };

  const handleVolunteerLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    setAboutMenuOpen(false);
    onNavigateVolunteer();
  };

  const handleDonateLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    setAboutMenuOpen(false);
    onNavigateDonate();
  };

  const handleNavClick = (key: NavSectionKey) => {
    setMobileMenuOpen(false);
    setAboutMenuOpen(false);
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
          className="hidden lg:flex items-center gap-5 xl:gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              activeNav === item.key ||
              (item.key === 'learning-hub' && isLearningHubRoute) ||
              (item.key === 'in-the-news' && isNewsRoute) ||
              (item.key === 'about' &&
                (isReportsRoute || isCsrRoute || isVolunteerRoute));

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

            if (item.key === 'learning-hub') {
              return (
                <a
                  key={item.key}
                  href="/learning-hub"
                  aria-current={isLearningHubRoute ? 'page' : undefined}
                  onClick={handleLearningHubLink}
                  className={`relative py-2 text-[13.5px] font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D3021]/40 rounded-sm ${
                    isActive
                      ? 'text-[#0D3021] font-semibold'
                      : 'text-[#555E58] hover:text-[#0D3021]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-underline"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute left-0 right-0 -bottom-[2px] h-[2px] rounded-full bg-[#0D3021]"
                    />
                  )}
                </a>
              );
            }

            if (item.key === 'in-the-news') {
              return (
                <a
                  key={item.key}
                  href="/in-the-news"
                  aria-current={isNewsRoute ? 'page' : undefined}
                  onClick={handleNewsLink}
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

            if (item.key === 'about') {
              return (
                <div key={item.key} ref={aboutMenuRef} className="relative">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={aboutMenuOpen}
                    onClick={() => setAboutMenuOpen((prev) => !prev)}
                    className={`relative py-2 inline-flex items-center gap-1 text-[13.5px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3B1E]/40 rounded-sm ${
                      isActive
                        ? 'text-[#142019] font-semibold'
                        : 'text-[#555E58] hover:text-[#142019]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#6E7872] transition-transform duration-200 ${
                        aboutMenuOpen ? 'rotate-180 text-[#9A3B1E]' : ''
                      }`}
                    />
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-underline"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        className="absolute left-0 right-0 -bottom-[2px] h-[2px] rounded-full bg-[#9A3B1E]"
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {aboutMenuOpen && (
                      <motion.div
                        role="menu"
                        aria-label="About Garad Foundation menu"
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: EASE_EDITORIAL }}
                        className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FAF8F4] border border-[#E4DDD0] shadow-[0_18px_40px_-18px_rgba(13,48,33,0.28)] p-1.5 z-50"
                      >
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => handleNavClick('about')}
                          className="w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-white transition-colors cursor-pointer"
                        >
                          <Info className="w-4 h-4 text-[#0D3021] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[13px] font-semibold text-[#171C19] leading-tight">
                              About Garad Foundation
                            </p>
                            <p className="mt-0.5 text-[11.5px] text-[#66706A] leading-snug">
                              Mission, Thane roots &amp; archive note
                            </p>
                          </div>
                        </button>

                        <a
                          href="/volunteer"
                          role="menuitem"
                          aria-current={isVolunteerRoute ? 'page' : undefined}
                          onClick={handleVolunteerLink}
                          className={`mt-0.5 w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                            isVolunteerRoute ? 'bg-[#EEF4F0]' : 'hover:bg-white'
                          }`}
                        >
                          <Users className="w-4 h-4 text-[#174C38] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[13px] font-semibold text-[#171C19] leading-tight">
                              Be a Volunteer
                            </p>
                            <p className="mt-0.5 text-[11.5px] text-[#66706A] leading-snug">
                              Join our community &amp; apply online
                            </p>
                          </div>
                        </a>

                        <a
                          href="/csr-partnerships"
                          role="menuitem"
                          aria-current={isCsrRoute ? 'page' : undefined}
                          onClick={handleCsrLink}
                          className={`mt-0.5 w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                            isCsrRoute ? 'bg-[#EEF4F0]' : 'hover:bg-white'
                          }`}
                        >
                          <Handshake className="w-4 h-4 text-[#0D3021] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[13px] font-semibold text-[#171C19] leading-tight">
                              CSR Partnerships
                            </p>
                            <p className="mt-0.5 text-[11.5px] text-[#66706A] leading-snug">
                              Project funding &amp; corporate hub
                            </p>
                          </div>
                        </a>

                        <a
                          href="/reports"
                          role="menuitem"
                          aria-current={isReportsRoute ? 'page' : undefined}
                          onClick={handleReportsLink}
                          className={`mt-0.5 w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                            isReportsRoute
                              ? 'bg-[#EEF4F0]'
                              : 'hover:bg-white'
                          }`}
                        >
                          <FileText className="w-4 h-4 text-[#9A3B1E] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[13px] font-semibold text-[#171C19] leading-tight">
                              Reports &amp; Publications
                            </p>
                            <p className="mt-0.5 text-[11.5px] text-[#66706A] leading-snug">
                              Annual Reports &amp; Activity PDFs
                            </p>
                          </div>
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
            className="lg:hidden w-9 h-9 rounded-lg border border-[#E4DDD0] bg-white text-[#142019] flex items-center justify-center cursor-pointer"
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
            className="lg:hidden absolute top-[68px] inset-x-0 bg-[#FAF8F4]/98 backdrop-blur-lg border-b border-[#E5DEC9] shadow-lg px-5 py-4"
          >
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  (activeNav === item.key ||
                    (item.key === 'learning-hub' && isLearningHubRoute) ||
                    (item.key === 'in-the-news' && isNewsRoute)) &&
                  !(
                    item.key === 'about' &&
                    (isReportsRoute || isCsrRoute || isVolunteerRoute)
                  );
                if (item.key === 'learning-hub') {
                  return (
                    <a
                      key={item.key}
                      href="/learning-hub"
                      aria-current={isLearningHubRoute ? 'page' : undefined}
                      onClick={handleLearningHubLink}
                      className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#EEF4F0] text-[#0D3021] font-semibold'
                          : 'text-[#4F5953] hover:bg-white'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-[#0D3021]" />
                      <span>{item.label}</span>
                    </a>
                  );
                }
                if (item.key === 'in-the-news') {
                  return (
                    <a
                      key={item.key}
                      href="/in-the-news"
                      aria-current={isNewsRoute ? 'page' : undefined}
                      onClick={handleNewsLink}
                      className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#EEF4F0] text-[#0D3021] font-semibold'
                          : 'text-[#4F5953] hover:bg-white'
                      }`}
                    >
                      <Newspaper className="w-4 h-4 text-[#9A3B1E]" />
                      <span>{item.label}</span>
                    </a>
                  );
                }
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

              <a
                href="/volunteer"
                aria-current={isVolunteerRoute ? 'page' : undefined}
                onClick={handleVolunteerLink}
                className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isVolunteerRoute
                    ? 'bg-[#EEF4F0] text-[#0D3021] font-semibold'
                    : 'text-[#4F5953] hover:bg-white'
                }`}
              >
                <Users className="w-4 h-4 text-[#174C38]" />
                <span>Be a Volunteer</span>
              </a>

              <a
                href="/csr-partnerships"
                aria-current={isCsrRoute ? 'page' : undefined}
                onClick={handleCsrLink}
                className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isCsrRoute
                    ? 'bg-[#EEF4F0] text-[#0D3021] font-semibold'
                    : 'text-[#4F5953] hover:bg-white'
                }`}
              >
                <Handshake className="w-4 h-4 text-[#0D3021]" />
                <span>CSR Partnerships</span>
              </a>

              <a
                href="/reports"
                aria-current={isReportsRoute ? 'page' : undefined}
                onClick={handleReportsLink}
                className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isReportsRoute
                    ? 'bg-[#EEF4F0] text-[#0D3021] font-semibold'
                    : 'text-[#4F5953] hover:bg-white'
                }`}
              >
                <FileText className="w-4 h-4 text-[#9A3B1E]" />
                <span>Reports &amp; Publications</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
