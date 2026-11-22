import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Handshake,
  Info,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  CSR_HERO_MEDIA,
  CSR_PROJECTS,
  IMPLEMENTATION_STEPS,
  INSTITUTIONAL_DOCUMENTS,
  ORGANISATIONAL_CREDIBILITY_ITEMS,
  PARTNERSHIP_MODELS,
  WHY_PARTNER_PILLARS,
} from '../data/csrHub';
import {
  getPublishedActivityReports,
  getPublishedAnnualReports,
} from '../data/reportsRegistry';
import { downloadVerifiedPdf } from '../utils/pdfDownload';
import {
  getActivityPath,
  getCsrProjectPath,
  getReportsPath,
} from '../utils/router';
import { usePageSeo } from '../utils/seo';
import { ArchivalMediaFrame } from './ArchivalMediaFrame';
import {
  CsrAreaOption,
  CsrEnquiryForm,
  CsrPreferredProjectOption,
} from './CsrEnquiryForm';
import { getCsrStatusTone } from './CsrProjectDetailPage';
import { EASE_EDITORIAL } from './motion/MotionPrimitives';

interface CsrPartnershipsPageProps {
  initialPrefill?: {
    project?: CsrPreferredProjectOption;
    area?: CsrAreaOption;
    scrollToEnquiry?: boolean;
  } | null;
  onNavigateCsrProject: (slug: string) => void;
  onNavigateArchive: () => void;
  onNavigateActivity: (slug: string) => void;
  onNavigateReports: () => void;
  onOpenAbout: () => void;
}

export function CsrPartnershipsPage({
  initialPrefill = null,
  onNavigateCsrProject,
  onNavigateArchive,
  onNavigateActivity,
  onNavigateReports,
  onOpenAbout,
}: CsrPartnershipsPageProps) {
  const prefersReduced = useReducedMotion();

  const publishedAnnualReports = useMemo(() => getPublishedAnnualReports(), []);
  const publishedActivityReports = useMemo(
    () => getPublishedActivityReports(),
    []
  );

  const [prefillProject, setPrefillProject] = useState<
    CsrPreferredProjectOption | ''
  >(initialPrefill?.project || '');
  const [prefillArea, setPrefillArea] = useState<CsrAreaOption | ''>(
    initialPrefill?.area || ''
  );

  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [docDownloadError, setDocDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPrefill?.project) setPrefillProject(initialPrefill.project);
    if (initialPrefill?.area) setPrefillArea(initialPrefill.area);
    if (initialPrefill?.scrollToEnquiry) {
      const timer = window.setTimeout(() => {
        document
          .getElementById('csr-enquiry')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 140);
      return () => window.clearTimeout(timer);
    }
  }, [initialPrefill]);

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'CSR Partnerships | Garad Foundation',
      description:
        'Explore CSR partnership opportunities with Garad Foundation in education, financial literacy, youth development and community empowerment in Maharashtra.',
      about: {
        '@type': 'Organization',
        name: 'Garad Foundation',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Thane',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
      },
    }),
    []
  );

  usePageSeo({
    title: 'CSR Partnerships | Garad Foundation',
    description:
      'Explore CSR partnership opportunities with Garad Foundation in education, financial literacy, youth development and community empowerment in Maharashtra.',
    type: 'website',
    structuredData,
  });

  const scrollToSection = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    handler: () => void
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    handler();
  };

  const handleDownloadPdf = async (
    id: string,
    fileUrl: string,
    downloadFilename: string
  ) => {
    setDocDownloadError(null);
    setDownloadingDocId(id);
    const res = await downloadVerifiedPdf({ fileUrl, downloadFilename });
    setDownloadingDocId(null);
    if (!res.ok && res.error) {
      setDocDownloadError(res.error);
    }
  };

  return (
    <main className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-20">
      {/* ==================== PHASE 3: HERO SECTION ==================== */}
      <section
        aria-labelledby="csr-hero-heading"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pb-14 border-b border-[#E6DFD2]"
      >
        <div className="lg:col-span-7">
          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
            className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9A3B1E]"
          >
            Garad Foundation · Institutional CSR &amp; Project Funding Hub
          </motion.p>

          <motion.h1
            id="csr-hero-heading"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.54, delay: 0.06, ease: EASE_EDITORIAL }}
            className="mt-3 font-serif text-[36px] sm:text-[46px] lg:text-[52px] font-bold tracking-[-0.02em] leading-[1.09] text-[#171C19] text-balance"
          >
            Partner with Garad Foundation
          </motion.h1>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.12, ease: EASE_EDITORIAL }}
            className="mt-4 font-serif text-[19px] sm:text-[21px] leading-[1.45] text-[#0D3021] max-w-[640px]"
          >
            Creating meaningful opportunities for children and communities
            through focused, measurable development programmes.
          </motion.p>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: EASE_EDITORIAL }}
            className="mt-4 max-w-[620px] text-[15px] sm:text-[16px] leading-[1.72] text-[#4F5852]"
          >
            Garad Foundation works with communities to support education, youth
            development and social empowerment. We welcome partnerships with
            organisations that share our commitment to creating practical and
            sustainable community impact.
          </motion.p>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: EASE_EDITORIAL }}
            className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <button
              type="button"
              onClick={() => scrollToSection('csr-projects')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-white text-[13.5px] font-semibold shadow-[0_8px_20px_-10px_rgba(8,36,23,0.45)] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Explore Our Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('csr-enquiry')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-[#F5F1E9] border border-[#DDD5C7] text-[#171C19] text-[13.5px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Handshake className="w-4 h-4 text-[#9A3B1E]" />
              <span>Start a Partnership Conversation</span>
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, delay: 0.14, ease: EASE_EDITORIAL }}
          className="lg:col-span-5"
        >
          <div className="chrome-card rounded-[20px] overflow-hidden aspect-[4/3.1] w-full">
            <ArchivalMediaFrame media={CSR_HERO_MEDIA} variant="hero" />
          </div>
          <p className="mt-2.5 text-[12px] text-[#66706A] leading-relaxed">
            Headquartered in Thane, Maharashtra · Documented grassroots outreach
            across Thane, Kalyan, Bhor Taluka (Pune District), and online across
            Maharashtra.
          </p>
        </motion.div>
      </section>

      {/* ==================== PHASE 4: WHY PARTNER WITH GARAD FOUNDATION ==================== */}
      <section
        aria-labelledby="why-partner-heading"
        className="pt-14 sm:pt-16"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
              Institutional Approach &amp; Credibility
            </p>
            <h2
              id="why-partner-heading"
              className="mt-1.5 font-serif text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] text-[#171C19]"
            >
              Why Partner with Garad Foundation?
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[13px] font-semibold">
            <button
              type="button"
              onClick={onOpenAbout}
              className="inline-flex items-center gap-1.5 text-[#0D3021] hover:text-[#9A3B1E] transition-colors cursor-pointer"
            >
              <span>About Garad Foundation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="/activities"
              onClick={(e) => handleLinkClick(e, onNavigateArchive)}
              className="inline-flex items-center gap-1.5 text-[#9A3B1E] hover:text-[#7D2B12] transition-colors"
            >
              <span>Explore Activity Archive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Four Concise Pillars */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_PARTNER_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="chrome-card chrome-card-subtle rounded-[18px] bg-white p-5 sm:p-6 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[11px] font-bold tracking-[0.12em] text-[#9A3B1E]">
                  {pillar.number}
                </span>
                <h3 className="mt-2 font-serif text-[19px] font-bold text-[#171C19] leading-snug">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-[1.68] text-[#525B55]">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Organisational Credibility Snapshot (Verified & Transparent Statuses Only) */}
        <div className="mt-8 rounded-[20px] bg-[#F5F1E9]/85 border border-[#E5DDD0] p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E5DDD0]">
            <h3 className="font-serif text-[20px] font-bold text-[#171C19]">
              Organisational Credibility &amp; Due-Diligence Readiness
            </h3>
            <span className="text-[12px] text-[#5C6660]">
              Only verified statuses shown · Registration certificates shared on
              formal due diligence
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {ORGANISATIONAL_CREDIBILITY_ITEMS.map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-white border border-[#EAE2D4] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13.5px] font-bold text-[#171C19]">
                    {item.label}
                  </p>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      item.status === 'Verified'
                        ? 'bg-[#EEF4F0] text-[#0D3021]'
                        : 'bg-[#FAF5EB] text-[#7D4B16]'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-[12.8px] leading-[1.62] text-[#555E58]">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PHASE 5: PROJECTS FOR CSR COLLABORATION ==================== */}
      <section
        id="csr-projects"
        aria-labelledby="csr-projects-heading"
        className="pt-16 sm:pt-20 scroll-mt-24"
      >
        <div className="max-w-2xl">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
            Project Funding Opportunities
          </p>
          <h2
            id="csr-projects-heading"
            className="mt-1.5 font-serif text-[28px] sm:text-[35px] font-bold tracking-[-0.015em] text-[#171C19]"
          >
            Projects for CSR Collaboration
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-[#525B55]">
            Explore initiatives where your organisation can contribute towards
            meaningful educational and community development outcomes. Project
            statuses distinguish clearly between proposals awaiting approval,
            concepts under development, and completed historical work.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {CSR_PROJECTS.map((project) => (
            <article
              key={project.id}
              className={`chrome-card chrome-card-lift rounded-[22px] bg-white overflow-hidden flex flex-col justify-between ${
                project.isPriority ? 'ring-1 ring-[#9A3B1E]/25' : ''
              }`}
            >
              <div>
                {/* Project Visual Header */}
                <div className="relative aspect-[16/8.6] w-full overflow-hidden border-b border-[#EFEAE0]">
                  <ArchivalMediaFrame
                    media={project.cardMedia}
                    variant="card"
                  />
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-bold tracking-[0.03em] shadow-sm ${getCsrStatusTone(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                    {project.isPriority && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#9A3B1E] text-white text-[10px] font-bold uppercase tracking-[0.1em] shadow-sm">
                        Priority Initiative
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A3B1E]">
                    {project.focusArea}
                  </p>
                  <h3 className="mt-1.5 font-serif text-[24px] font-bold text-[#171C19] leading-snug">
                    {project.name}
                  </h3>
                  {project.subtitle && (
                    <p className="mt-0.5 font-serif italic text-[14.5px] text-[#58625C]">
                      {project.subtitle}
                    </p>
                  )}

                  <p className="mt-3 text-[13.8px] leading-[1.7] text-[#4C554F]">
                    {project.shortDescription}
                  </p>

                  {/* Structured Project Metadata List */}
                  <dl className="mt-5 pt-4 border-t border-[#F0EBE1] space-y-2.5 text-[12.8px]">
                    <div className="flex items-start gap-2.5">
                      <Users className="w-3.5 h-3.5 text-[#9A3B1E] shrink-0 mt-0.5" />
                      <div>
                        <dt className="inline font-semibold text-[#171C19]">
                          Target Group:{' '}
                        </dt>
                        <dd className="inline text-[#525B55]">
                          {project.targetBeneficiariesSummary}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0D3021] shrink-0 mt-0.5" />
                      <div>
                        <dt className="inline font-semibold text-[#171C19]">
                          Geography:{' '}
                        </dt>
                        <dd className="inline text-[#525B55]">
                          {project.proposedGeographySummary}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Clock className="w-3.5 h-3.5 text-[#66706A] shrink-0 mt-0.5" />
                      <div>
                        <dt className="inline font-semibold text-[#171C19]">
                          Duration:{' '}
                        </dt>
                        <dd className="inline text-[#525B55]">
                          {project.durationSummary}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Building2 className="w-3.5 h-3.5 text-[#9A3B1E] shrink-0 mt-0.5" />
                      <div>
                        <dt className="inline font-semibold text-[#171C19]">
                          Funding:{' '}
                        </dt>
                        <dd className="inline text-[#525B55]">
                          {project.fundingSummary}
                        </dd>
                      </div>
                    </div>
                  </dl>

                  {/* Mission Bharari Historical Separation Note inside Card */}
                  {project.historicalRecord &&
                    project.slug === 'mission-bharari' && (
                      <div className="mt-4 rounded-xl bg-[#EEF4F0] border border-[#D4E3DA] p-3.5 text-[12px] leading-relaxed text-[#253A2E]">
                        <p className="font-bold text-[#0D3021]">
                          Completed Historical Phase 1 (3 Feb 2021):
                        </p>
                        <p className="mt-0.5">
                          220 students across 10 Zilla Parishad schools in Bhor
                          Taluka, Pune (documented separately from future
                          proposed targets).{' '}
                          <a
                            href={getActivityPath('mission-bharari-phase-1')}
                            onClick={(e) =>
                              handleLinkClick(e, () =>
                                onNavigateActivity('mission-bharari-phase-1')
                              )
                            }
                            className="font-semibold underline text-[#9A3B1E] hover:text-[#7C2B12]"
                          >
                            View Phase 1 Archive
                          </a>
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="px-6 py-4 bg-[#FAF8F4] border-t border-[#EFEAE0] flex flex-wrap items-center justify-between gap-3">
                <a
                  href={getCsrProjectPath(project.slug)}
                  onClick={(e) =>
                    handleLinkClick(e, () => onNavigateCsrProject(project.slug))
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-white text-[12.5px] font-semibold transition-colors whitespace-nowrap"
                >
                  <span>View Project Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setPrefillProject(project.enquiryProjectOption);
                    setPrefillArea(project.enquiryDefaultArea);
                    scrollToSection('csr-enquiry');
                  }}
                  className="text-[12.5px] font-semibold text-[#9A3B1E] hover:text-[#7D2B12] transition-colors cursor-pointer"
                >
                  Enquire About Project
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ==================== PHASE 7: IMPLEMENTATION & ACCOUNTABILITY APPROACH ==================== */}
      <section
        aria-labelledby="accountability-heading"
        className="pt-16 sm:pt-20"
      >
        <div className="max-w-2xl">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
            Implementation &amp; Accountability Approach
          </p>
          <h2
            id="accountability-heading"
            className="mt-1.5 font-serif text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] text-[#171C19]"
          >
            From Planning to Measurable Outcomes
          </h2>
          <p className="mt-2.5 text-[14.5px] leading-[1.7] text-[#525B55]">
            A clear five-step operating discipline across community needs
            identification, responsible execution, and transparent partner
            reporting.
          </p>
        </div>

        <ol className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {IMPLEMENTATION_STEPS.map((step) => (
            <li
              key={step.step}
              className="chrome-card chrome-card-subtle rounded-[18px] bg-white p-5 flex flex-col"
            >
              <span className="font-mono text-[11px] font-bold tracking-[0.12em] text-[#9A3B1E]">
                STEP {step.step}
              </span>
              <h3 className="mt-2 font-serif text-[18px] font-bold text-[#171C19] leading-snug">
                {step.title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.65] text-[#525B55]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-4 text-[12.5px] text-[#66706A] leading-relaxed">
          Note: Specific monitoring tools, attendance logs, and assessment
          methods are adapted to each project’s scope, beneficiary group, and
          partner reporting agreement rather than imposing a single uniform
          template across unrelated programmes.
        </p>
      </section>

      {/* ==================== PHASE 8: TRANSPARENCY & INSTITUTIONAL DOCUMENTS ==================== */}
      <section
        aria-labelledby="transparency-heading"
        className="pt-16 sm:pt-20"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
              Governance &amp; Verified Records
            </p>
            <h2
              id="transparency-heading"
              className="mt-1.5 font-serif text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] text-[#171C19]"
            >
              Our Commitment to Transparency
            </h2>
            <p className="mt-2.5 text-[15px] leading-[1.7] text-[#525B55]">
              We believe responsible partnerships require clear documentation,
              appropriate reporting and transparent communication.
            </p>
          </div>

          <a
            href={getReportsPath()}
            onClick={(e) => handleLinkClick(e, onNavigateReports)}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0D3021] hover:text-[#9A3B1E] transition-colors whitespace-nowrap"
          >
            <span>Open Full Reports &amp; Publications Portal</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {docDownloadError && (
          <div
            role="alert"
            className="mt-5 rounded-xl bg-[#FDF0EC] border border-[#EBC7BC] px-4 py-3 flex items-start gap-2.5 text-[13px] text-[#7D2912]"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{docDownloadError}</span>
          </div>
        )}

        {/* Part 1: Published Public PDFs (Downloadable Now) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="chrome-card rounded-[20px] bg-white p-6">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
              Published &amp; Downloadable Reports
            </p>
            <h3 className="mt-1.5 font-serif text-[22px] font-bold text-[#171C19]">
              Annual Reports &amp; Activity Reports
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[#58625C]">
              Verified A4 PDF publications currently available for immediate CSR
              team download.
            </p>

            <div className="mt-5 space-y-3">
              {publishedAnnualReports.map((rep) => (
                <div
                  key={rep.id}
                  className="rounded-xl bg-[#EEF4F0] border border-[#D4E3DA] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#0D3021]">
                      Annual Report · {rep.financialYear}
                    </p>
                    <p className="mt-0.5 font-serif text-[17px] font-bold text-[#171C19]">
                      {rep.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#4C5E53] tabular-nums">
                      PDF · {rep.pageCount} pages · {rep.fileSizeLabel}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={downloadingDocId === rep.id}
                    onClick={() =>
                      handleDownloadPdf(
                        rep.id,
                        rep.fileUrl,
                        rep.downloadFilename
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-white text-[12.5px] font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    {downloadingDocId === rep.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>Download PDF</span>
                  </button>
                </div>
              ))}

              <div className="rounded-xl bg-[#FAF8F4] border border-[#E6DFD2] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9A3B1E]">
                    Project-Level Documentation
                  </p>
                  <p className="mt-0.5 font-serif text-[17px] font-bold text-[#171C19]">
                    Individual Activity Reports ({publishedActivityReports.length}{' '}
                    Published PDFs)
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#5C6660]">
                    Mission Bharari Phase 1, Mamnoli Hygiene Drive, Utsavachi
                    Shidori &amp; FY 2020–21 Youth Programmes
                  </p>
                </div>

                <a
                  href={getReportsPath()}
                  onClick={(e) => handleLinkClick(e, onNavigateReports)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#F3EDE2] border border-[#DFD8CB] text-[#171C19] text-[12.5px] font-semibold transition-colors shrink-0 whitespace-nowrap"
                >
                  <FileText className="w-3.5 h-3.5 text-[#9A3B1E]" />
                  <span>View All PDFs</span>
                </a>
              </div>
            </div>
          </div>

          {/* Part 2: Statutory, Financial & Protected Compliance Documents */}
          <div className="chrome-card rounded-[20px] bg-white p-6">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
              Statutory &amp; Compliance Records
            </p>
            <h3 className="mt-1.5 font-serif text-[22px] font-bold text-[#171C19]">
              Due-Diligence Documentation
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[#58625C]">
              Public downloads are enabled only for verified public PDFs.
              Sensitive institutional identifiers and audited statements are
              shared securely with corporate CSR teams upon enquiry.
            </p>

            <ul className="mt-4 divide-y divide-[#F0EBE1]">
              {INSTITUTIONAL_DOCUMENTS.map((doc) => (
                <li
                  key={doc.id}
                  className="py-3 first:pt-1 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold text-[#171C19]">
                      {doc.title}
                    </p>
                    <p className="text-[12px] text-[#5C6660] leading-snug mt-0.5">
                      {doc.description}
                    </p>
                  </div>

                  {doc.publicPdfUrl ? (
                    <button
                      type="button"
                      disabled={downloadingDocId === doc.id}
                      onClick={() =>
                        handleDownloadPdf(
                          doc.id,
                          doc.publicPdfUrl!,
                          `Garad-Foundation-${doc.id}.pdf`
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D3021] text-white text-[11.5px] font-semibold shrink-0 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download PDF</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5E6862] bg-[#F5F1E9] border border-[#E6DFD2] px-2.5 py-1 rounded-md shrink-0 self-start sm:self-center whitespace-nowrap">
                      {doc.availability === 'Protected Institutional Record' ? (
                        <Lock className="w-3 h-3 text-[#9A3B1E]" />
                      ) : (
                        <ShieldCheck className="w-3 h-3 text-[#0D3021]" />
                      )}
                      <span>{doc.availability}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ==================== PHASE 9: PARTNERSHIP MODELS ==================== */}
      <section
        aria-labelledby="partnership-models-heading"
        className="pt-16 sm:pt-20"
      >
        <div className="max-w-2xl">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
            Collaboration Formats
          </p>
          <h2
            id="partnership-models-heading"
            className="mt-1.5 font-serif text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] text-[#171C19]"
          >
            Ways to Partner with Garad Foundation
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PARTNERSHIP_MODELS.map((model, idx) => (
            <div
              key={model.id}
              className="chrome-card chrome-card-subtle rounded-[18px] bg-white p-5 sm:p-6 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[11px] font-bold text-[#9A3B1E]">
                  0{idx + 1}
                </span>
                <h3 className="mt-2 font-serif text-[19px] font-bold text-[#171C19] leading-snug">
                  {model.title}
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-[1.68] text-[#4C554F]">
                  {model.description}
                </p>
              </div>
              <p className="mt-4 pt-3 border-t border-[#F0EBE1] text-[12px] leading-relaxed text-[#66706A]">
                {model.suitabilityNote}
              </p>
            </div>
          ))}
        </div>

        {/* CSR Statutory Eligibility Disclaimer */}
        <div className="mt-6 rounded-xl bg-[#F5F1E9] border border-[#E5DDD0] px-4 py-3.5 flex items-start gap-2.5 text-[12.5px] leading-relaxed text-[#4C554F]">
          <Info className="w-4 h-4 text-[#9A3B1E] shrink-0 mt-0.5" />
          <span>
            <strong>CSR Expenditure Eligibility Note:</strong> Not all forms of
            support automatically qualify as statutory CSR expenditure.
            Eligibility depends on applicable provisions of the Companies Act,
            2013, Schedule VII, prevailing CSR rules, and the partner company’s
            independent CSR compliance assessment.
          </span>
        </div>
      </section>

      {/* ==================== PHASE 10: CORPORATE CSR ENQUIRY FORM ==================== */}
      <section
        id="csr-enquiry"
        aria-labelledby="csr-enquiry-heading"
        className="pt-16 sm:pt-20 scroll-mt-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-5">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
              Initiate a Partnership Discussion
            </p>
            <h2
              id="csr-enquiry-heading"
              className="mt-1.5 font-serif text-[28px] sm:text-[35px] font-bold tracking-[-0.015em] text-[#171C19] leading-[1.15]"
            >
              Let&apos;s Explore a Partnership
            </h2>
            <p className="mt-3.5 text-[15px] leading-[1.72] text-[#4C554F]">
              Tell us about your organisation and the kind of community
              development initiative you would like to support. Our team will
              get in touch to discuss possible areas of collaboration.
            </p>

            <div className="mt-6 space-y-3 text-[13.5px] text-[#3F4843]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0D3021] shrink-0 mt-0.5" />
                <span>
                  Request statutory registrations, audited financial statements,
                  and due-diligence documentation.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0D3021] shrink-0 mt-0.5" />
                <span>
                  Discuss proposed Phase 1 scoping for Sabse Bada Rupaiya,
                  Mission Bharari, or Garad Granthalay.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0D3021] shrink-0 mt-0.5" />
                <span>
                  Receive a dedicated enquiry reference number and confidential
                  follow-up from our Thane coordination desk.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <CsrEnquiryForm
              initialPreferredProject={prefillProject}
              initialAreaOfInterest={prefillArea}
            />
          </div>
        </div>
      </section>

      {/* ==================== PHASE 11: FINAL CALL TO ACTION ==================== */}
      <section aria-labelledby="csr-final-cta-heading" className="pt-16 sm:pt-20">
        <div className="chrome-card chrome-card-dark rounded-[24px] bg-[#082417] text-white p-8 sm:p-11 flex flex-col lg:flex-row lg:items-center justify-between gap-7">
          <div className="max-w-2xl">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-[#E6A94A]">
              Garad Foundation · Thane, Maharashtra
            </p>
            <h2
              id="csr-final-cta-heading"
              className="mt-2 font-serif text-[28px] sm:text-[36px] font-bold leading-[1.15] text-white"
            >
              Let&apos;s Build Meaningful Impact Together.
            </h2>
            <p className="mt-3 text-[15px] leading-[1.72] text-[#CBE0D5]">
              We welcome conversations with organisations that believe in
              strengthening education, empowering young people and supporting
              communities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('csr-enquiry')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#9A3B1E] hover:bg-[#AD4424] text-white text-[13.5px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Discuss a CSR Partnership</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="/activities"
              onClick={(e) => handleLinkClick(e, onNavigateArchive)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/18 border border-white/15 text-white text-[13px] font-semibold transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 text-[#E6A94A]" />
              <span>Explore Our Programmes</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
