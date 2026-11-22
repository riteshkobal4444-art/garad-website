import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  History,
  Info,
  Loader2,
  MapPin,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';
import {
  CsrProjectProfile,
  CsrProjectStatus,
  CSR_PROJECTS,
} from '../data/csrHub';
import { getPublishedActivityReportBySlug } from '../data/reportsRegistry';
import { downloadVerifiedPdf } from '../utils/pdfDownload';
import {
  getActivityPath,
  getCsrPartnershipsPath,
  getCsrProjectPath,
  getReportsPath,
} from '../utils/router';
import { usePageSeo } from '../utils/seo';
import { ArchivalMediaFrame } from './ArchivalMediaFrame';
import { EASE_EDITORIAL } from './motion/MotionPrimitives';
import {
  CsrAreaOption,
  CsrPreferredProjectOption,
} from './CsrEnquiryForm';

interface CsrProjectDetailPageProps {
  project: CsrProjectProfile;
  onNavigateCsrHub: (prefill?: {
    project?: CsrPreferredProjectOption;
    area?: CsrAreaOption;
    scrollToEnquiry?: boolean;
  }) => void;
  onNavigateCsrProject: (slug: string) => void;
  onNavigateActivity: (slug: string) => void;
  onNavigateReports: () => void;
}

export function getCsrStatusTone(status: CsrProjectStatus): string {
  switch (status) {
    case 'Open for CSR Partnership':
      return 'bg-[#0D3021] text-white';
    case 'Awaiting Project Approval':
      return 'bg-[#FAEEE9] text-[#8A3014] border border-[#EFCFC2]';
    case 'Concept Under Development':
      return 'bg-[#EEF4F0] text-[#153D2C] border border-[#CFE0D6]';
    case 'Implementation Completed':
      return 'bg-[#F3EFE6] text-[#3F4843] border border-[#DFD8C8]';
  }
}

export function CsrProjectDetailPage({
  project,
  onNavigateCsrHub,
  onNavigateCsrProject,
  onNavigateActivity,
  onNavigateReports,
}: CsrProjectDetailPageProps) {
  const prefersReduced = useReducedMotion();
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const linkedActivityReport = useMemo(() => {
    if (!project.historicalRecord?.linkedActivitySlug) return undefined;
    return getPublishedActivityReportBySlug(
      project.historicalRecord.linkedActivitySlug
    );
  }, [project.historicalRecord?.linkedActivitySlug]);

  const otherProjects = useMemo(
    () => CSR_PROJECTS.filter((p) => p.slug !== project.slug),
    [project.slug]
  );

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${project.name} — CSR Project Profile | Garad Foundation`,
      description: project.shortDescription,
      publisher: {
        '@type': 'Organization',
        name: 'Garad Foundation',
        address: 'Thane, Maharashtra, India',
      },
    }),
    [project]
  );

  usePageSeo({
    title: `${project.name} | CSR Partnerships | Garad Foundation`,
    description: project.shortDescription,
    type: 'article',
    structuredData,
  });

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

  const handlePdfDownload = async (
    key: string,
    fileUrl: string,
    downloadFilename: string
  ) => {
    setDownloadError(null);
    setDownloadingKey(key);
    const res = await downloadVerifiedPdf({ fileUrl, downloadFilename });
    setDownloadingKey(null);
    if (!res.ok && res.error) {
      setDownloadError(res.error);
    }
  };

  return (
    <main className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-9 pb-20">
      {/* Breadcrumb Bar */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: EASE_EDITORIAL }}
        className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#ECE6DA]"
      >
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[12px] text-[#6B746E]"
        >
          <a
            href={getCsrPartnershipsPath()}
            onClick={(e) => handleLinkClick(e, () => onNavigateCsrHub())}
            className="hover:text-[#171C19] transition-colors"
          >
            CSR Partnerships
          </a>
          <span aria-hidden="true" className="text-[#C4BCB0]">
            /
          </span>
          <span className="font-semibold text-[#171C19]">{project.name}</span>
        </nav>

        <a
          href={getCsrPartnershipsPath()}
          onClick={(e) => handleLinkClick(e, () => onNavigateCsrHub())}
          className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#232D27] hover:text-[#9A3B1E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#9A3B1E]" />
          <span>Back to CSR Partnership Hub</span>
        </a>
      </motion.div>

      {/* Hero Header */}
      <section aria-labelledby="csr-project-title" className="pt-8 sm:pt-10">
        <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-semibold">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-md text-[11px] font-bold tracking-[0.04em] ${getCsrStatusTone(
              project.status
            )}`}
          >
            {project.status}
          </span>
          {project.isPriority && (
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A3B1E]">
              · Priority Initiative
            </span>
          )}
          <span className="text-[#7A827D]">· {project.focusArea}</span>
        </div>

        <h1
          id="csr-project-title"
          className="mt-4 font-serif text-[34px] sm:text-[46px] font-bold tracking-[-0.02em] leading-[1.12] text-[#171C19]"
        >
          {project.name}
        </h1>

        {project.subtitle && (
          <p className="mt-2 font-serif italic text-[19px] sm:text-[21px] text-[#9A3B1E]">
            {project.subtitle}
          </p>
        )}

        <p className="mt-4 max-w-[780px] text-[15.5px] sm:text-[17px] leading-[1.7] text-[#4C554F]">
          {project.shortDescription}
        </p>

        {/* Key Scope Summary Grid */}
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="chrome-card chrome-card-subtle rounded-[15px] bg-white p-4">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7A827D]">
              <Users className="w-3.5 h-3.5 text-[#9A3B1E]" />
              <span>Target Beneficiaries</span>
            </p>
            <p className="mt-2 text-[13.5px] font-semibold text-[#171C19] leading-snug">
              {project.targetBeneficiariesSummary}
            </p>
          </div>

          <div className="chrome-card chrome-card-subtle rounded-[15px] bg-white p-4">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7A827D]">
              <MapPin className="w-3.5 h-3.5 text-[#9A3B1E]" />
              <span>Geography</span>
            </p>
            <p className="mt-2 text-[13.5px] font-semibold text-[#171C19] leading-snug">
              {project.proposedGeographySummary}
            </p>
          </div>

          <div className="chrome-card chrome-card-subtle rounded-[15px] bg-white p-4">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7A827D]">
              <Calendar className="w-3.5 h-3.5 text-[#9A3B1E]" />
              <span>Duration</span>
            </p>
            <p className="mt-2 text-[13.5px] font-semibold text-[#171C19] leading-snug">
              {project.durationSummary}
            </p>
          </div>

          <div className="chrome-card chrome-card-subtle rounded-[15px] bg-white p-4">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7A827D]">
              <Target className="w-3.5 h-3.5 text-[#9A3B1E]" />
              <span>Funding Status</span>
            </p>
            <p className="mt-2 text-[13.5px] font-semibold text-[#171C19] leading-snug">
              {project.fundingSummary}
            </p>
          </div>
        </div>

        {/* Visual Media Frame */}
        <div className="mt-8 rounded-[20px] overflow-hidden border border-[#E3DCCF] aspect-[16/8.2] w-full">
          <ArchivalMediaFrame media={project.cardMedia} variant="hero" />
        </div>
      </section>

      {/* Historical Record Box (Strictly Separated from Future Proposed Targets) */}
      {project.historicalRecord && (
        <section
          aria-labelledby="historical-record-heading"
          className="mt-10 rounded-[20px] bg-[#EEF4F0] border border-[#CFE0D6] p-6 sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#0D3021]">
              <History className="w-3.5 h-3.5 text-[#9A3B1E]" />
              <span>Completed Historical Implementation (Separate from Proposed Targets)</span>
            </p>
            <span className="text-[12px] font-semibold text-[#3C4F44]">
              {project.historicalRecord.period}
            </span>
          </div>

          <h2
            id="historical-record-heading"
            className="mt-2 font-serif text-[23px] sm:text-[26px] font-bold text-[#171C19]"
          >
            {project.historicalRecord.heading}
          </h2>
          <p className="mt-1 text-[13px] font-medium text-[#46594E]">
            {project.historicalRecord.location}
          </p>
          <p className="mt-3 text-[14.5px] leading-[1.72] text-[#2F3E35] max-w-[74ch]">
            {project.historicalRecord.summary}
          </p>

          <ul className="mt-4 space-y-2">
            {project.historicalRecord.verifiedHighlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[13.5px] text-[#233229]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#0D3021] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-xl bg-white/80 border border-[#D4E2D9] px-4 py-3 flex items-start gap-2.5 text-[12.5px] text-[#3B4B41]">
            <Info className="w-4 h-4 text-[#9A3B1E] shrink-0 mt-0.5" />
            <span>{project.historicalRecord.disclaimer}</span>
          </div>

          {(project.historicalRecord.linkedActivitySlug || linkedActivityReport) && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {project.historicalRecord.linkedActivitySlug && (
                <a
                  href={getActivityPath(project.historicalRecord.linkedActivitySlug)}
                  onClick={(e) =>
                    handleLinkClick(e, () =>
                      onNavigateActivity(
                        project.historicalRecord!.linkedActivitySlug!
                      )
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-white text-[13px] font-semibold transition-colors"
                >
                  <span>View Documented Phase 1 Activity Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}

              {linkedActivityReport && (
                <button
                  type="button"
                  disabled={downloadingKey === 'historical-pdf'}
                  onClick={() =>
                    handlePdfDownload(
                      'historical-pdf',
                      linkedActivityReport.fileUrl,
                      linkedActivityReport.downloadFilename
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F4] border border-[#C6D8CD] text-[#0D3021] text-[13px] font-semibold transition-colors cursor-pointer"
                >
                  {downloadingKey === 'historical-pdf' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 text-[#9A3B1E]" />
                  )}
                  <span>
                    Download Phase 1 Activity Report PDF (
                    {linkedActivityReport.pageCount}p ·{' '}
                    {linkedActivityReport.fileSizeLabel})
                  </span>
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* Main 15-Section Structured Project Profile + Sticky Sidebar */}
      <section className="mt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_330px] gap-8 lg:gap-9 items-start">
        <div className="space-y-7 min-w-0">
          {/* 1. Project Overview & 2. Social Need Addressed */}
          <article className="chrome-card rounded-[20px] bg-white p-6 sm:p-8 space-y-6">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                01 · Project Overview
              </p>
              <h2 className="mt-1.5 font-serif text-[25px] font-bold text-[#171C19]">
                Scope &amp; Programme Context
              </h2>
              <div className="mt-3.5 space-y-3.5 text-[14.8px] leading-[1.78] text-[#4C554F]">
                {project.detail.overview.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#EFEAE0]">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                02 · Social Need Addressed
              </p>
              <h3 className="mt-1.5 font-serif text-[22px] font-bold text-[#171C19]">
                Community &amp; Educational Rationale
              </h3>
              <div className="mt-3 space-y-3 text-[14.8px] leading-[1.78] text-[#4C554F]">
                {project.detail.socialNeed.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          </article>

          {/* 3. Objectives, 4. Target Beneficiaries, 5. Proposed Geography */}
          <article className="chrome-card rounded-[20px] bg-white p-6 sm:p-8 space-y-6">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                03 · Project Objectives
              </p>
              <ul className="mt-3.5 space-y-2.5">
                {project.detail.objectives.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[14.5px] leading-[1.68] text-[#3B443E]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0D3021] shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-[#EFEAE0] grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                  04 · Target Beneficiaries
                </p>
                <ul className="mt-3 space-y-2 text-[14px] leading-[1.68] text-[#4C554F]">
                  {project.detail.targetBeneficiaries.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-2 w-1.5 h-1.5 rounded-full bg-[#9A3B1E] shrink-0"
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                  05 · Proposed Geography
                </p>
                <p className="mt-3 text-[14px] leading-[1.7] text-[#4C554F]">
                  {project.detail.proposedGeography}
                </p>
                <p className="mt-4 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                  07 · Project Duration
                </p>
                <p className="mt-2 text-[14px] leading-[1.7] text-[#4C554F]">
                  {project.detail.projectDuration}
                </p>
              </div>
            </div>
          </article>

          {/* 6. Implementation Methodology & 8. Key Activities */}
          <article className="chrome-card rounded-[20px] bg-white p-6 sm:p-8 space-y-6">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                06 · Implementation Methodology
              </p>
              <ol className="mt-3.5 space-y-3">
                {project.detail.implementationMethodology.map((step, idx) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 text-[14.5px] leading-[1.68] text-[#3F4843]"
                  >
                    <span className="font-mono text-[12px] font-bold text-[#9A3B1E] mt-0.5 shrink-0">
                      0{idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-6 border-t border-[#EFEAE0]">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                08 · Key Activities
              </p>
              <ul className="mt-3.5 space-y-2.5">
                {project.detail.keyActivities.map((act) => (
                  <li
                    key={act}
                    className="flex items-start gap-2.5 text-[14.5px] leading-[1.68] text-[#4C554F]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#9A3B1E] shrink-0 mt-1" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {/* 9. Expected Outputs, 10. Outcome Indicators, 11. Monitoring & Evaluation */}
          <article className="chrome-card rounded-[20px] bg-white p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                  09 · Expected Outputs
                </p>
                <ul className="mt-3 space-y-2.5 text-[14px] leading-[1.68] text-[#4C554F]">
                  {project.detail.expectedOutputs.map((out) => (
                    <li key={out} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-2 w-1.5 h-1.5 rounded-full bg-[#0D3021] shrink-0"
                      />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                  10 · Outcome Indicators
                </p>
                <ul className="mt-3 space-y-2.5 text-[14px] leading-[1.68] text-[#4C554F]">
                  {project.detail.outcomeIndicators.map((ind) => (
                    <li key={ind} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-2 w-1.5 h-1.5 rounded-full bg-[#9A3B1E] shrink-0"
                      />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-[#EFEAE0]">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                11 · Monitoring and Evaluation Approach
              </p>
              <ul className="mt-3 space-y-2.5">
                {project.detail.monitoringAndEvaluation.map((me) => (
                  <li
                    key={me}
                    className="flex items-start gap-2.5 text-[14px] leading-[1.68] text-[#4C554F]"
                  >
                    <ClipboardCheck className="w-4 h-4 text-[#0D3021] shrink-0 mt-0.5" />
                    <span>{me}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {/* 12. Funding Requirement & Budget Breakdown + 13. Documentation & Reporting */}
          <article className="chrome-card rounded-[20px] bg-white p-6 sm:p-8 space-y-6">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                12 · Funding Requirement &amp; Budget Breakdown
              </p>
              <div className="mt-3 rounded-xl bg-[#FAF8F4] border border-[#E6DFD2] p-4 sm:p-5">
                <p className="font-serif text-[24px] font-bold text-[#171C19]">
                  {project.detail.fundingAndBudget.headlineAmount}
                </p>
                <p className="mt-1 text-[13px] font-semibold text-[#9A3B1E]">
                  {project.detail.fundingAndBudget.approvalStatus}
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#555E58]">
                  {project.detail.fundingAndBudget.breakdownNote}
                </p>
              </div>

              <div className="mt-4 divide-y divide-[#EFEAE0] border border-[#EFEAE0] rounded-xl overflow-hidden">
                {project.detail.fundingAndBudget.indicativeComponents.map(
                  (comp) => (
                    <div
                      key={comp.item}
                      className="p-3.5 sm:px-4 bg-white flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5"
                    >
                      <p className="text-[13.5px] font-semibold text-[#171C19]">
                        {comp.item}
                      </p>
                      <p className="text-[12.5px] text-[#5C6660] sm:text-right max-w-md">
                        {comp.note}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-[#EFEAE0]">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                13 · Documentation &amp; Reporting Commitments
              </p>
              <ul className="mt-3 space-y-2.5">
                {project.detail.documentationAndReporting.map((docItem) => (
                  <li
                    key={docItem}
                    className="flex items-start gap-2.5 text-[14px] leading-[1.68] text-[#4C554F]"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#0D3021] shrink-0 mt-0.5" />
                    <span>{docItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>

        {/* Sticky Sidebar: 14. Concept Note Download + 15. Partnership Enquiry CTA */}
        <aside className="lg:sticky lg:top-[88px] space-y-5">
          {/* 14. Concept Note Card */}
          <div className="chrome-card rounded-[20px] bg-white p-5 sm:p-6">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
              14 · Project Concept Note
            </p>
            <h3 className="mt-1.5 font-serif text-[20px] font-bold text-[#171C19]">
              Documentation Status
            </h3>
            <p className="mt-2 text-[13px] leading-[1.68] text-[#555E58]">
              {project.conceptNoteStatusNote}
            </p>

            {project.conceptNotePdfUrl ? (
              <button
                type="button"
                disabled={downloadingKey === 'concept-note'}
                onClick={() =>
                  handlePdfDownload(
                    'concept-note',
                    project.conceptNotePdfUrl!,
                    `Garad-Foundation-${project.slug}-Concept-Note.pdf`
                  )
                }
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-white text-[13px] font-semibold transition-colors cursor-pointer"
              >
                {downloadingKey === 'concept-note' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Download Concept Note (PDF)</span>
              </button>
            ) : (
              <div className="mt-4 rounded-xl bg-[#FAF8F4] border border-[#E6DFD2] px-3.5 py-2.5 flex items-start gap-2 text-[12px] text-[#5C6660]">
                <FileText className="w-4 h-4 text-[#9A3B1E] shrink-0 mt-0.5" />
                <span>
                  Public PDF download will appear here once the final approved
                  concept note is uploaded.
                </span>
              </div>
            )}

            {downloadError && (
              <div
                role="alert"
                className="mt-3 rounded-xl bg-[#FDF0EC] border border-[#EBC7BC] px-3 py-2 flex items-start gap-2 text-[12px] text-[#7D2912]"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{downloadError}</span>
              </div>
            )}

            <a
              href={getReportsPath()}
              onClick={(e) => handleLinkClick(e, onNavigateReports)}
              className="mt-4 pt-3.5 border-t border-[#F0EBE1] flex items-center justify-between text-[12.5px] font-semibold text-[#0D3021] hover:text-[#9A3B1E] transition-colors"
            >
              <span>Browse Published Reports &amp; PDFs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 15. Partnership Enquiry CTA Card */}
          <div className="chrome-card chrome-card-dark rounded-[20px] bg-[#082417] text-white p-6">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#E6A94A]">
              15 · Corporate CSR Discussion
            </p>
            <h3 className="mt-2 font-serif text-[22px] font-bold leading-snug">
              Explore Supporting {project.name}
            </h3>
            <p className="mt-2.5 text-[13px] leading-[1.68] text-[#CBE0D5]">
              Connect with Garad Foundation to request due-diligence documents,
              discuss scope and school geography, or align on CSR reporting
              requirements.
            </p>

            <button
              type="button"
              onClick={() =>
                onNavigateCsrHub({
                  project: project.enquiryProjectOption,
                  area: project.enquiryDefaultArea,
                  scrollToEnquiry: true,
                })
              }
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#9A3B1E] hover:bg-[#AD4424] text-white text-[13px] font-semibold transition-colors cursor-pointer"
            >
              <span>Discuss a Partnership</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </aside>
      </section>

      {/* Other CSR Projects Navigation */}
      <section
        aria-labelledby="other-csr-projects-heading"
        className="mt-16 pt-12 border-t border-[#E6DFD2]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
              MORE CSR COLLABORATION PROFILES
            </p>
            <h2
              id="other-csr-projects-heading"
              className="mt-1 font-serif text-[24px] sm:text-[28px] font-bold text-[#171C19]"
            >
              Explore Other Initiatives
            </h2>
          </div>
          <a
            href={getCsrPartnershipsPath()}
            onClick={(e) => handleLinkClick(e, () => onNavigateCsrHub())}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#9A3B1E] hover:text-[#7E2D14] transition-colors"
          >
            <span>Return to CSR Hub</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {otherProjects.map((other) => (
            <a
              key={other.slug}
              href={getCsrProjectPath(other.slug)}
              onClick={(e) =>
                handleLinkClick(e, () => onNavigateCsrProject(other.slug))
              }
              className="chrome-card chrome-card-subtle chrome-card-lift group rounded-[18px] bg-white p-5 flex flex-col justify-between"
            >
              <div>
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded text-[10.5px] font-bold ${getCsrStatusTone(
                    other.status
                  )}`}
                >
                  {other.status}
                </span>
                <h3 className="mt-3 font-serif text-[20px] font-bold text-[#171C19] group-hover:text-[#0D3021] transition-colors">
                  {other.name}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#58625C] line-clamp-2">
                  {other.shortDescription}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-[12.5px] font-semibold text-[#9A3B1E]">
                <span>View Project Details</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
