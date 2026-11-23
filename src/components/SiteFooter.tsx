import React from 'react';
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { GARAD_CONTACT_INFO } from '../data/homepage';

interface SiteFooterProps {
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onNavigateArchive: () => void;
  onNavigateLearningHub: () => void;
  onNavigateNews: () => void;
  onNavigateUniverse: () => void;
  onNavigateVolunteer: () => void;
  onNavigateCsr: () => void;
  onNavigateReports: () => void;
  onNavigateDonate: () => void;
}

export function SiteFooter({
  onNavigateHome,
  onNavigateAbout,
  onNavigateArchive,
  onNavigateLearningHub,
  onNavigateNews,
  onNavigateUniverse,
  onNavigateVolunteer,
  onNavigateCsr,
  onNavigateReports,
  onNavigateDonate,
}: SiteFooterProps) {
  const handleLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    handler: () => void
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    handler();
  };

  return (
    <footer
      id="contact"
      className="no-print scroll-mt-20 border-t border-[#E4DDD0] bg-[#F3EFE6] text-[#171C19] mt-auto"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand Identity */}
          <div className="lg:col-span-4">
            <a
              href="/"
              onClick={(e) => handleLink(e, onNavigateHome)}
              className="font-serif text-[22px] font-bold text-[#142019] leading-none hover:text-[#0D3021] transition-colors"
            >
              {GARAD_CONTACT_INFO.organisationName}
            </a>
            <p className="mt-2 text-[12.5px] font-semibold text-[#9A3B1E]">
              {GARAD_CONTACT_INFO.tagline}
            </p>
            <p className="mt-3 text-[13.5px] leading-[1.68] text-[#525C56] max-w-[38ch]">
              {GARAD_CONTACT_INFO.summary}
            </p>
          </div>

          {/* Column 2: Explore Ecosystem */}
          <div className="lg:col-span-3">
            <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-[#0D3021]">
              Explore
            </p>
            <nav
              aria-label="Footer primary links"
              className="mt-4 flex flex-col gap-2.5 text-[14px] font-medium text-[#3F4943]"
            >
              <a
                href="/"
                onClick={(e) => handleLink(e, onNavigateHome)}
                className="hover:text-[#0D3021] transition-colors w-fit"
              >
                Home
              </a>
              <a
                href="/about"
                onClick={(e) => handleLink(e, onNavigateAbout)}
                className="hover:text-[#0D3021] transition-colors w-fit"
              >
                About Us
              </a>
              <a
                href="/activities"
                onClick={(e) => handleLink(e, onNavigateArchive)}
                className="hover:text-[#0D3021] transition-colors w-fit"
              >
                Our Activities
              </a>
              <a
                href="/learning-hub"
                onClick={(e) => handleLink(e, onNavigateLearningHub)}
                className="hover:text-[#0D3021] transition-colors w-fit"
              >
                Learning Hub
              </a>
              <a
                href="/in-the-news"
                onClick={(e) => handleLink(e, onNavigateNews)}
                className="hover:text-[#0D3021] transition-colors w-fit"
              >
                In the News
              </a>
              <a
                href="/garad-universe"
                onClick={(e) => handleLink(e, onNavigateUniverse)}
                className="hover:text-[#0D3021] transition-colors w-fit"
              >
                Garad Universe
              </a>
            </nav>
          </div>

          {/* Column 3: Get Involved */}
          <div className="lg:col-span-2">
            <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-[#0D3021]">
              Get Involved
            </p>
            <nav
              aria-label="Footer get involved links"
              className="mt-4 flex flex-col gap-2.5 text-[14px] font-medium text-[#3F4943]"
            >
              <a
                href="/volunteer"
                onClick={(e) => handleLink(e, onNavigateVolunteer)}
                className="hover:text-[#0D3021] transition-colors w-fit"
              >
                Be a Volunteer
              </a>
              <a
                href="/donate"
                onClick={(e) => handleLink(e, onNavigateDonate)}
                className="font-semibold text-[#9A3B1E] hover:text-[#7E2D14] transition-colors w-fit"
              >
                Donate Now
              </a>
              <a
                href="/csr-partnerships"
                onClick={(e) => handleLink(e, onNavigateCsr)}
                className="hover:text-[#0D3021] transition-colors w-fit"
              >
                Partner With Us (CSR)
              </a>
              <a
                href="/reports"
                onClick={(e) => handleLink(e, onNavigateReports)}
                className="hover:text-[#0D3021] transition-colors w-fit"
              >
                Reports &amp; Publications
              </a>
            </nav>
          </div>

          {/* Column 4: Verified Contact Details */}
          <div className="lg:col-span-3">
            <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-[#0D3021]">
              Contact
            </p>
            <div className="mt-4 space-y-3 text-[13.5px] text-[#4A544E]">
              <p className="flex items-start gap-2.5 leading-relaxed">
                <MapPin className="w-4 h-4 text-[#9A3B1E] shrink-0 mt-0.5" />
                <span>{GARAD_CONTACT_INFO.address}</span>
              </p>
              <p>
                <a
                  href={`mailto:${GARAD_CONTACT_INFO.email}`}
                  className="inline-flex items-center gap-2.5 hover:text-[#0D3021] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#0D3021] shrink-0" />
                  <span>{GARAD_CONTACT_INFO.email}</span>
                </a>
              </p>
              <p>
                <a
                  href={GARAD_CONTACT_INFO.phoneHref}
                  className="inline-flex items-center gap-2.5 hover:text-[#0D3021] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#0D3021] shrink-0" />
                  <span>{GARAD_CONTACT_INFO.phoneDisplay}</span>
                </a>
              </p>
              <p className="pt-1">
                <a
                  href={GARAD_CONTACT_INFO.officialWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0D3021] hover:text-[#9A3B1E] transition-colors"
                >
                  <span>Official Website &amp; Socials (garadfoundation.org)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-12 pt-6 border-t border-[#E0D8C9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12.5px] text-[#606A64]">
          <p>
            © {new Date().getFullYear()} {GARAD_CONTACT_INFO.organisationName}.
            All rights reserved.
          </p>
          <p>{GARAD_CONTACT_INFO.cityRegion}</p>
        </div>
      </div>
    </footer>
  );
}
