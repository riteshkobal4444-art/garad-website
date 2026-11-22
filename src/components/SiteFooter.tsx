import React from 'react';
import { FileText, Handshake, HeartHandshake, MapPin, Users } from 'lucide-react';

interface SiteFooterProps {
  onNavigateArchive: () => void;
  onNavigateVolunteer: () => void;
  onNavigateCsr: () => void;
  onNavigateReports: () => void;
  onNavigateDonate: () => void;
}

export function SiteFooter({
  onNavigateArchive,
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
    <footer className="no-print border-t border-[#E6DFD2] bg-[#F5F1E9]/75 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="font-serif text-[18px] font-bold text-[#142019] leading-none">
            Garad Foundation
          </p>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] text-[#5C6660]">
            <MapPin className="w-3.5 h-3.5 text-[#9A3B1E] shrink-0" />
            <span>
              Thane, Maharashtra, India · Grassroots Education, Health &amp;
              Community Outreach
            </span>
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[13px] font-semibold"
        >
          <a
            href="/activities"
            onClick={(e) => handleLink(e, onNavigateArchive)}
            className="text-[#3C4640] hover:text-[#9A3B1E] transition-colors whitespace-nowrap"
          >
            Initiatives Archive
          </a>
          <a
            href="/volunteer"
            onClick={(e) => handleLink(e, onNavigateVolunteer)}
            className="inline-flex items-center gap-1.5 text-[#174C38] hover:text-[#9A3B1E] transition-colors whitespace-nowrap"
          >
            <Users className="w-3.5 h-3.5 text-[#174C38]" />
            <span>Be a Volunteer</span>
          </a>
          <a
            href="/csr-partnerships"
            onClick={(e) => handleLink(e, onNavigateCsr)}
            className="inline-flex items-center gap-1.5 text-[#0D3021] hover:text-[#9A3B1E] transition-colors whitespace-nowrap"
          >
            <Handshake className="w-3.5 h-3.5 text-[#0D3021]" />
            <span>CSR Partnerships</span>
          </a>
          <a
            href="/reports"
            onClick={(e) => handleLink(e, onNavigateReports)}
            className="inline-flex items-center gap-1.5 text-[#0D3021] hover:text-[#9A3B1E] transition-colors whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-[#9A3B1E]" />
            <span>Reports &amp; Publications</span>
          </a>
          <a
            href="/donate"
            onClick={(e) => handleLink(e, onNavigateDonate)}
            className="inline-flex items-center gap-1.5 text-[#9A3B1E] hover:text-[#7E2D14] transition-colors whitespace-nowrap"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Donate Now</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
