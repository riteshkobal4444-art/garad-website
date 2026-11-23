import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronDown,
  FileText,
  Handshake,
  HeartHandshake,
  Menu,
  Users,
  X,
} from 'lucide-react';
import { EASE_EDITORIAL } from './motion/MotionPrimitives';

export type NavSectionKey =
  | 'home'
  | 'about'
  | 'activities'
  | 'learning-hub'
  | 'in-the-news'
  | 'garad-universe'
  | 'contact';

interface NavbarProps {
  activeNav: NavSectionKey | null;
  isHomeRoute?: boolean;
  isDonateRoute?: boolean;
  isVolunteerRoute?: boolean;
  isCsrRoute?: boolean;
  isReportsRoute?: boolean;
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onNavigateArchive: () => void;
  onNavigateLearningHub: () => void;
  onNavigateNews: () => void;
  onNavigateUniverse: () => void;
  onNavigateContact: () => void;
  onNavigateVolunteer: () => void;
  onNavigateDonate: () => void;
  onNavigateCsr: () => void;
  onNavigateReports: () => void;
}

const PRIMARY_NAV_ITEMS: {
  key: NavSectionKey;
  label: string;
  href: string;
}[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'about', label: 'About Us', href: '/about' },
  { key: 'activities', label: 'Our Activities', href: '/activities' },
  { key: 'learning-hub', label: 'Learning Hub', href: '/learning-hub' },
  { key: 'in-the-news', label: 'In the News', href: '/in-the-news' },
  { key: 'garad-universe', label: 'Garad Universe', href: '/garad-universe' },
  { key: 'contact', label: 'Contact', href: '#contact' },
];

export function Navbar({
  activeNav,
  isHomeRoute = false,
  isDonateRoute = false,
  isVolunteerRoute = false,
  isCsrRoute = false,
  isReportsRoute = false,
  onNavigateHome,
  onNavigateAbout,
  onNavigateArchive,
  onNavigateLearningHub,
  onNavigateNews,
  onNavigateUniverse,
  onNavigateContact,
  onNavigateVolunteer,
  onNavigateDonate,
  onNavigateCsr,
  onNavigateReports,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [involvedOpen, setInvolvedOpen] = useState(false);
  const involvedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!involvedOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (
        involvedRef.current &&
        !involvedRef.current.contains(e.target as Node)
      ) {
        setInvolvedOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setInvolvedOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [involvedOpen]);

  // Transparent integrated over hero only at top of Homepage when menu is closed
  const isTransparentHeroBar = isHomeRoute && !isScrolled && !mobileMenuOpen;

  const dispatchNav = (key: NavSectionKey) => {
    setMobileMenuOpen(false);
    setInvolvedOpen(false);
    switch (key) {
      case 'home':
        onNavigateHome();
        break;
      case 'about':
        onNavigateAbout();
        break;
      case 'activities':
        onNavigateArchive();
        break;
      case 'learning-hub':
        onNavigateLearningHub();
        break;
      case 'in-the-news':
        onNavigateNews();
        break;
      case 'garad-universe':
        onNavigateUniverse();
        break;
      case 'contact':
        onNavigateContact();
        break;
    }
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    handler: () => void
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    setInvolvedOpen(false);
    handler();
  };

  const isInvolvedActive = isVolunteerRoute || isDonateRoute || isCsrRoute;

  return (
    <header
      className={`${
        isHomeRoute ? 'fixed top-0 inset-x-0' : 'sticky top-0'
      } z-40 h-[68px] transition-all duration-300 ${
        isTransparentHeroBar
          ? 'bg-gradient-to-b from-[#071911]/72 to-transparent border-b border-white/10'
          : 'bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#E6DFD2] shadow-[0_6px_22px_-16px_rgba(13,48,33,0.18)]'
      }`}
    >
      <div className="max-w-[1280px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        {/* Zone 1: Clean Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, onNavigateHome)}
          aria-label="Garad Foundation Home"
          className={`font-serif text-[20px] sm:text-[22px] font-bold tracking-[-0.02em] leading-none whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A63A] rounded-sm py-1 ${
            isTransparentHeroBar
              ? 'text-[#FAF8F4] hover:text-[#E8BC66]'
              : 'text-[#142019] hover:text-[#0D3021]'
          }`}
        >
          Garad Foundation
        </a>

        {/* Zone 2: Single-Line Primary Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden xl:flex items-center gap-6"
        >
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <a
                key={item.key}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => handleLinkClick(e, () => dispatchNav(item.key))}
                className={`relative py-2 text-[13.5px] font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A63A] rounded-sm ${
                  isTransparentHeroBar
                    ? isActive
                      ? 'text-[#FAF8F4] font-semibold'
                      : 'text-[#DCE6E0] hover:text-white'
                    : isActive
                      ? 'text-[#0D3021] font-semibold'
                      : 'text-[#4D5751] hover:text-[#142019]'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className={`absolute left-0 right-0 -bottom-[1px] h-[2px] rounded-full ${
                      isTransparentHeroBar ? 'bg-[#E3A63A]' : 'bg-[#0D3021]'
                    }`}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Highlighted GET INVOLVED Dropdown + Mobile Trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div ref={involvedRef} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={involvedOpen}
              onClick={() => setInvolvedOpen((prev) => !prev)}
              className={`min-h-[40px] inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A63A] focus-visible:ring-offset-2 ${
                isTransparentHeroBar
                  ? 'bg-[#E3A63A] hover:bg-[#D5972C] text-[#0D2118]'
                  : isInvolvedActive
                    ? 'bg-[#0D3021] text-[#FAF8F4] ring-2 ring-[#0D3021]/25'
                    : 'bg-[#0D3021] hover:bg-[#16402E] text-[#FAF8F4]'
              }`}
            >
              <span>Get Involved</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  involvedOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {involvedOpen && (
                <motion.div
                  role="menu"
                  aria-label="Get Involved options"
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: EASE_EDITORIAL }}
                  className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-[#FAF8F4] border border-[#E4DDD0] shadow-[0_20px_44px_-18px_rgba(13,48,33,0.32)] p-1.5 z-50 text-[#171C19]"
                >
                  <a
                    href="/volunteer"
                    role="menuitem"
                    aria-current={isVolunteerRoute ? 'page' : undefined}
                    onClick={(e) => handleLinkClick(e, onNavigateVolunteer)}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      isVolunteerRoute ? 'bg-[#EEF4F0]' : 'hover:bg-white'
                    }`}
                  >
                    <Users className="w-4 h-4 text-[#174C38] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[13.5px] font-semibold text-[#142019] leading-tight">
                        Volunteer
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-[#606A64] leading-snug">
                        Share your time &amp; skills with us
                      </p>
                    </div>
                  </a>

                  <a
                    href="/donate"
                    role="menuitem"
                    aria-current={isDonateRoute ? 'page' : undefined}
                    onClick={(e) => handleLinkClick(e, onNavigateDonate)}
                    className={`mt-0.5 w-full flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      isDonateRoute ? 'bg-[#FAEEE9]' : 'hover:bg-white'
                    }`}
                  >
                    <HeartHandshake className="w-4 h-4 text-[#9A3B1E] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[13.5px] font-semibold text-[#142019] leading-tight">
                        Donate
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-[#606A64] leading-snug">
                        Support grassroots education &amp; outreach
                      </p>
                    </div>
                  </a>

                  <a
                    href="/csr-partnerships"
                    role="menuitem"
                    aria-current={isCsrRoute ? 'page' : undefined}
                    onClick={(e) => handleLinkClick(e, onNavigateCsr)}
                    className={`mt-0.5 w-full flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      isCsrRoute ? 'bg-[#EEF4F0]' : 'hover:bg-white'
                    }`}
                  >
                    <Handshake className="w-4 h-4 text-[#0D3021] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[13.5px] font-semibold text-[#142019] leading-tight">
                        Partner With Us
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-[#606A64] leading-snug">
                        CSR partnerships &amp; project funding
                      </p>
                    </div>
                  </a>

                  <div className="my-1.5 border-t border-[#E9E2D5]" />

                  <a
                    href="/reports"
                    role="menuitem"
                    aria-current={isReportsRoute ? 'page' : undefined}
                    onClick={(e) => handleLinkClick(e, onNavigateReports)}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      isReportsRoute ? 'bg-[#EEF4F0]' : 'hover:bg-white'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-[#9A3B1E] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[13px] font-semibold text-[#142019] leading-tight">
                        Reports &amp; Publications
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-[#606A64] leading-snug">
                        Annual Reports &amp; Activity PDFs
                      </p>
                    </div>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={
              mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={mobileMenuOpen}
            className={`xl:hidden w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
              isTransparentHeroBar
                ? 'border-white/25 bg-white/10 text-white hover:bg-white/18'
                : 'border-[#E2DACB] bg-white text-[#142019] hover:bg-[#F5F0E6]'
            }`}
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Accessible Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE_EDITORIAL }}
            className="xl:hidden absolute top-[68px] inset-x-0 bg-[#FAF8F4]/98 backdrop-blur-lg border-b border-[#E5DDD0] shadow-xl px-5 py-4 max-h-[calc(100vh-68px)] overflow-y-auto"
          >
            <div className="flex flex-col gap-1">
              {PRIMARY_NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.key;
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) =>
                      handleLinkClick(e, () => dispatchNav(item.key))
                    }
                    className={`min-h-[44px] flex items-center px-3.5 py-2.5 rounded-xl text-[14.5px] font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EEF4F0] text-[#0D3021] font-semibold'
                        : 'text-[#3F4943] hover:bg-white'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}

              <div className="my-2 border-t border-[#E7E0D3]" />

              <a
                href="/volunteer"
                onClick={(e) => handleLinkClick(e, onNavigateVolunteer)}
                className="min-h-[44px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[14.5px] font-medium text-[#174C38] hover:bg-white"
              >
                <Users className="w-4 h-4" />
                <span>Volunteer</span>
              </a>
              <a
                href="/donate"
                onClick={(e) => handleLinkClick(e, onNavigateDonate)}
                className="min-h-[44px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[14.5px] font-semibold text-[#9A3B1E] hover:bg-white"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Donate</span>
              </a>
              <a
                href="/csr-partnerships"
                onClick={(e) => handleLinkClick(e, onNavigateCsr)}
                className="min-h-[44px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[14.5px] font-medium text-[#0D3021] hover:bg-white"
              >
                <Handshake className="w-4 h-4" />
                <span>Partner With Us</span>
              </a>
              <a
                href="/reports"
                onClick={(e) => handleLinkClick(e, onNavigateReports)}
                className="min-h-[44px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[14.5px] font-medium text-[#3F4943] hover:bg-white"
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
