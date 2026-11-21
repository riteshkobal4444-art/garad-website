import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import {
  ActivityReportDocument,
  AnnualReportDocument,
  getActiveActivityReportCategories,
  getPublishedActivityReports,
  getPublishedAnnualReports,
  ReportDocumentCategory,
} from '../data/reportsRegistry';
import { getActivityPath } from '../utils/router';
import { downloadVerifiedPdf } from '../utils/pdfDownload';
import { usePageSeo } from '../utils/seo';
import { EASE_EDITORIAL } from './motion/MotionPrimitives';

interface ReportsPageProps {
  onNavigateArchive: () => void;
  onNavigateActivity: (slug: string) => void;
  onNavigateDonate: () => void;
}

type ActivityFilterKey =
  | 'All'
  | Exclude<ReportDocumentCategory, 'Annual Reports'>;

/**
 * Clean editorial cover thumbnail rendered directly from the real Annual Report title
 * and financial year — never using stock photos or fake edition titles.
 */
function AnnualReportCoverThumbnail({ report }: { report: AnnualReportDocument }) {
  return (
    <div
      aria-hidden="true"
      className="relative w-full sm:w-[210px] shrink-0 aspect-[3/4] rounded-[14px] overflow-hidden bg-[#082417] text-white border border-[#193F2D] shadow-[0_14px_30px_-16px_rgba(8,36,23,0.45)] flex flex-col justify-between p-5 select-none"
    >
      {/* Subtle architectural line pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Terracotta top hairline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#9A3B1E]" />

      {/* Header emblem */}
      <div className="relative z-10 flex items-center gap-2.5">
        <span className="w-7 h-7 rounded border border-[#E6A94A]/70 bg-[#143B2A] flex items-center justify-center font-serif text-[11px] font-bold text-[#FAF8F4]">
          GF
        </span>
        <div className="leading-tight">
          <p className="font-serif text-[11px] font-bold text-white tracking-tight">
            Garad Foundation
          </p>
          <p className="text-[8.5px] text-[#B7D1C3]">Thane, Maharashtra</p>
        </div>
      </div>

      {/* Main title block */}
      <div className="relative z-10 my-auto pt-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#E6A94A]">
          Institutional Publication
        </p>
        <p className="mt-1.5 font-serif text-[22px] font-bold leading-[1.14] text-[#FAF8F4]">
          {report.title}
        </p>
        <div className="mt-3 w-8 h-[2px] bg-[#9A3B1E]" />
      </div>

      {/* Footer stamp */}
      <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-[9px] font-mono text-[#CBE0D5]">
        <span>{report.financialYear}</span>
        <span>A4 PDF</span>
      </div>
    </div>
  );
}

export function ReportsPage({
  onNavigateArchive,
  onNavigateActivity,
  onNavigateDonate,
}: ReportsPageProps) {
  const prefersReduced = useReducedMotion();

  const annualReports = useMemo(() => getPublishedAnnualReports(), []);
  const allActivityReports = useMemo(() => getPublishedActivityReports(), []);
  const activeCategories = useMemo(
    () => getActiveActivityReportCategories(),
    []
  );

  const [selectedCategory, setSelectedCategory] =
    useState<ActivityFilterKey>('All');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<{
    id: string;
    message: string;
  } | null>(null);

  const filteredActivityReports = useMemo(() => {
    if (selectedCategory === 'All') return allActivityReports;
    return allActivityReports.filter((doc) => doc.category === selectedCategory);
  }, [allActivityReports, selectedCategory]);

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Reports & Publications — Garad Foundation',
      description:
        "Explore Garad Foundation's work, documented activities and annual progress through our CSR-ready PDF reports.",
      publisher: {
        '@type': 'Organization',
        name: 'Garad Foundation',
        address: 'Thane, Maharashtra, India',
      },
    }),
    []
  );

  usePageSeo({
    title: 'Reports & Publications — Garad Foundation',
    description:
      "Explore Garad Foundation's work, documented activities and annual progress through our downloadable CSR-ready Annual Reports and Activity Reports.",
    type: 'website',
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

  const handleDownload = async (
    id: string,
    fileUrl: string,
    downloadFilename: string
  ) => {
    setDownloadError(null);
    setDownloadingId(id);
    const result = await downloadVerifiedPdf({ fileUrl, downloadFilename });
    setDownloadingId(null);
    if (!result.ok && result.error) {
      setDownloadError({ id, message: result.error });
    }
  };

  return (
    <main className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-9 pb-20">
      {/* Breadcrumb Strip */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
        className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#ECE6DA]"
      >
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[12px] text-[#6B746E]"
        >
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, onNavigateArchive)}
            className="hover:text-[#171C19] transition-colors"
          >
            Home
          </a>
          <span aria-hidden="true" className="text-[#C4BCB0]">
            /
          </span>
          <span className="font-semibold text-[#171C19]">
            Reports &amp; Publications
          </span>
        </nav>

        <a
          href="/activities"
          onClick={(e) => handleLinkClick(e, onNavigateArchive)}
          className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#232D27] hover:text-[#9A3B1E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#9A3B1E]" />
          <span>Explore Activities Archive</span>
        </a>
      </motion.div>

      {/* ==================== A. PAGE INTRODUCTION ==================== */}
      <section aria-labelledby="reports-page-title" className="pt-8 sm:pt-11">
        <motion.p
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.04, ease: EASE_EDITORIAL }}
          className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]"
        >
          Garad Foundation · Institutional Documentation
        </motion.p>

        <motion.h1
          id="reports-page-title"
          initial={prefersReduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.56, delay: 0.08, ease: EASE_EDITORIAL }}
          className="mt-3 font-serif text-[36px] sm:text-[46px] lg:text-[50px] font-bold tracking-[-0.02em] leading-[1.1] text-[#171C19] text-balance"
        >
          Reports &amp; Publications
        </motion.h1>

        <motion.p
          initial={prefersReduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, delay: 0.14, ease: EASE_EDITORIAL }}
          className="mt-4 max-w-[700px] text-[16px] sm:text-[17.5px] leading-[1.68] text-[#4C554F]"
        >
          Explore Garad Foundation&apos;s work, documented activities and annual
          progress through our reports.
        </motion.p>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE_EDITORIAL }}
          className="mt-6 max-w-[780px] text-[14px] leading-[1.78] text-[#5C6660] space-y-2.5"
        >
          <p>
            Every publication listed on this page is prepared in A4 PDF format
            from Garad Foundation&apos;s verified activity records for
            transparent review by corporate CSR teams, institutional donors,
            grant reviewers, and community stakeholders.
          </p>
          <p className="text-[13px] text-[#6A736E] flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              Published Annual Reports:{' '}
              <strong className="text-[#171C19] tabular-nums">
                {annualReports.length}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Published Activity Reports:{' '}
              <strong className="text-[#171C19] tabular-nums">
                {allActivityReports.length}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>Selectable A4 PDF Format</span>
          </p>
        </motion.div>
      </section>

      {/* ==================== B. ANNUAL REPORTS SECTION ==================== */}
      {annualReports.length > 0 && (
        <section
          aria-labelledby="annual-reports-heading"
          className="mt-12 sm:mt-14"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-[#E6DFD2]">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                Consolidated Institutional Publications
              </p>
              <h2
                id="annual-reports-heading"
                className="mt-1 font-serif text-[26px] sm:text-[31px] font-bold tracking-[-0.015em] text-[#171C19]"
              >
                Annual Reports
              </h2>
            </div>
            <p className="text-[12.5px] text-[#66706A]">
              Published by Financial Year (Descending)
            </p>
          </div>

          <div className="mt-7 space-y-6">
            {annualReports.map((report) => {
              const isBusy = downloadingId === report.id;
              const hasErr = downloadError?.id === report.id;

              return (
                <article
                  key={report.id}
                  className="chrome-card chrome-card-lift rounded-[22px] bg-white p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start"
                >
                  <AnnualReportCoverThumbnail report={report} />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] font-semibold text-[#66706A]">
                        <span className="text-[#9A3B1E] font-bold">
                          {report.financialYear}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{report.publicationDate}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">
                          PDF · {report.pageCount} pages · {report.fileSizeLabel}
                        </span>
                      </div>

                      <h3 className="mt-2 font-serif text-[26px] sm:text-[30px] font-bold tracking-[-0.015em] text-[#171C19] leading-tight">
                        {report.title}
                      </h3>

                      <p className="mt-3 text-[14.5px] leading-[1.72] text-[#4C554F] max-w-[64ch]">
                        {report.description}
                      </p>

                      <ul className="mt-4 space-y-2">
                        {report.highlights.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-[13px] leading-snug text-[#3F4843]"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#143B2A] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-5 border-t border-[#F0EBE1] flex flex-col sm:flex-row sm:items-center gap-3">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() =>
                          handleDownload(
                            report.id,
                            report.fileUrl,
                            report.downloadFilename
                          )
                        }
                        aria-label={`Download ${report.title} PDF (${report.fileSizeLabel}, ${report.pageCount} pages)`}
                        className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#0D3021] hover:bg-[#16402E] disabled:opacity-65 text-white text-[13.5px] font-semibold shadow-[0_8px_20px_-10px_rgba(8,36,23,0.45)] transition-colors cursor-pointer w-full sm:w-auto whitespace-nowrap"
                      >
                        {isBusy ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Preparing PDF…</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>Download Annual Report</span>
                          </>
                        )}
                      </button>

                      <a
                        href={report.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#FAF8F4] hover:bg-[#F2ECE0] border border-[#E5DDD0] text-[13px] font-semibold text-[#232D27] transition-colors w-full sm:w-auto whitespace-nowrap"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#9A3B1E]" />
                        <span>View PDF in Browser</span>
                      </a>
                    </div>

                    {hasErr && (
                      <div
                        role="alert"
                        className="mt-3 rounded-xl bg-[#FDF0EC] border border-[#EBC7BC] px-3.5 py-2.5 flex items-start gap-2 text-[12.5px] text-[#7D2912]"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{downloadError.message}</span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-4 text-[12.5px] leading-relaxed text-[#66706A]">
            Only approved financial-year annual reports with finalized PDF
            editions are listed above. Subsequent financial-year editions (FY
            2021–22 onward) will be published here once reviewed and approved.
          </p>
        </section>
      )}

      {/* ==================== C. INDIVIDUAL ACTIVITY REPORTS SECTION ==================== */}
      {allActivityReports.length > 0 && (
        <section
          aria-labelledby="activity-reports-heading"
          className="mt-14 sm:mt-16"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#E6DFD2]">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                Project-Level CSR Documentation
              </p>
              <h2
                id="activity-reports-heading"
                className="mt-1 font-serif text-[26px] sm:text-[31px] font-bold tracking-[-0.015em] text-[#171C19]"
              >
                Individual Activity Reports
              </h2>
            </div>

            {/* Category filter tabs (shown only for categories with published reports) */}
            {activeCategories.length > 1 && (
              <div
                role="tablist"
                aria-label="Filter activity reports by programme category"
                className="flex flex-wrap items-center gap-1.5"
              >
                {(['All', ...activeCategories] as ActivityFilterKey[]).map(
                  (cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-[#0D3021] text-white'
                            : 'bg-[#F4F0E7] text-[#4C554F] hover:bg-[#EAE3D5] hover:text-[#171C19]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>

          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredActivityReports.map((doc: ActivityReportDocument) => {
              const isBusy = downloadingId === doc.id;
              const hasErr = downloadError?.id === doc.id;

              return (
                <article
                  key={doc.id}
                  className="chrome-card chrome-card-subtle chrome-card-lift rounded-[20px] bg-white p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* Clean unboxed typographic metadata */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] font-medium text-[#66706A]">
                      <span className="font-bold text-[#9A3B1E]">
                        {doc.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{doc.financialYear}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[11px] text-[#555E58]">
                        {doc.archiveNumber}
                      </span>
                    </div>

                    <h3 className="mt-2 font-serif text-[21px] sm:text-[22px] font-bold tracking-[-0.01em] text-[#171C19] leading-snug">
                      {doc.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#6A736E]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#9A3B1E]/80 shrink-0" />
                        <span>{doc.dateLabel}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#7A827D] shrink-0" />
                        <span>{doc.location}</span>
                      </span>
                    </div>

                    <p className="mt-3 text-[13.5px] leading-[1.68] text-[#525B55]">
                      {doc.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#F3EEE4] flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-[#5E6862]">
                      <span className="font-semibold text-[#171C19]">
                        {doc.keyOutputSummary}
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums">
                        <FileText className="w-3.5 h-3.5 text-[#9A3B1E]" />
                        <span>
                          PDF · {doc.pageCount}p · {doc.fileSizeLabel}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#EFEAE0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() =>
                        handleDownload(
                          doc.id,
                          doc.fileUrl,
                          doc.downloadFilename
                        )
                      }
                      aria-label={`Download ${doc.title} Activity Report PDF (${doc.fileSizeLabel}, ${doc.pageCount} pages)`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#9A3B1E] hover:bg-[#843016] disabled:opacity-65 text-white text-[12.5px] font-semibold transition-colors cursor-pointer whitespace-nowrap w-full sm:w-auto"
                    >
                      {isBusy ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Downloading…</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Activity Report</span>
                        </>
                      )}
                    </button>

                    <a
                      href={getActivityPath(doc.activitySlug)}
                      onClick={(e) =>
                        handleLinkClick(e, () =>
                          onNavigateActivity(doc.activitySlug)
                        )
                      }
                      className="inline-flex items-center justify-center sm:justify-end gap-1.5 text-[12.5px] font-semibold text-[#0D3021] hover:text-[#9A3B1E] transition-colors whitespace-nowrap"
                    >
                      <span>View Activity Page</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {hasErr && (
                    <div
                      role="alert"
                      className="mt-3 rounded-xl bg-[#FDF0EC] border border-[#EBC7BC] px-3 py-2 flex items-start gap-2 text-[12px] text-[#7D2912]"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{downloadError.message}</span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ==================== CSR & TRANSPARENCY NOTE ==================== */}
      <section
        aria-labelledby="csr-transparency-heading"
        className="mt-14 sm:mt-16"
      >
        <div className="chrome-card chrome-card-dark rounded-[22px] bg-[#082417] text-white p-7 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#E6A94A]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CSR &amp; Institutional Due Diligence</span>
            </p>
            <h2
              id="csr-transparency-heading"
              className="mt-2 font-serif text-[24px] sm:text-[27px] font-bold leading-snug"
            >
              Documentation Standard &amp; Supporting Records
            </h2>
            <p className="mt-2.5 text-[13.5px] leading-[1.7] text-[#CBE0D5]">
              All published reports distinguish clearly between documented
              outputs, verified beneficiary disaggregation, and evidence scope.
              Audited financial statements and statutory registration
              certificates (12A / 80G) are maintained on record and furnished
              directly during institutional CSR due diligence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a
              href="/donate"
              onClick={(e) => handleLinkClick(e, onNavigateDonate)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#9A3B1E] hover:bg-[#AD4424] text-white text-[13px] font-semibold transition-colors whitespace-nowrap"
            >
              <span>Support Our Work</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/activities"
              onClick={(e) => handleLinkClick(e, onNavigateArchive)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/18 border border-white/15 text-white text-[12.5px] font-semibold transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#E6A94A]" />
              <span>Browse Digital Archive</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
